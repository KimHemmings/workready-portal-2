import csv
import io

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from lib.db import db
from lib import certificates as certs_lib
from lib import invites, limits
from lib.pdf import simple_pdf
from lib.security import hash_password, temporary_password
from models.schemas import (
    CaseNote,
    CaseNoteCreate,
    Certificate,
    CoachParticipantDetail,
    GrantRequest,
    InterviewSession,
    InviteResult,
    JobSearchLog,
    ParticipantProgress,
    Resume,
    ResetPasswordResult,
    RosterRow,
    TrainingModule,
    UsageSummary,
    User,
    UserCreate,
)

router = APIRouter(prefix="/coaches", tags=["coach"])


async def _coach(coach_id: str) -> User:
    doc = await db.users.find_one({"id": coach_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Case manager not found")
    if doc.get("role") not in ("coach", "admin"):
        raise HTTPException(status_code=403, detail="Case manager access required")
    return User(**doc)


async def _participant_in_tenant(coach: User, pid: str) -> dict:
    """Load a jobseeker only if they sit inside the case manager's organisation.

    Tenant isolation: a foreign jobseeker returns 404 rather than 403 so the record's existence
    is not leaked across organisations.
    """
    doc = await db.users.find_one(
        {"id": pid, "role": "participant", "organization_id": coach.organization_id}
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Jobseeker not found")
    return doc


async def _roster_rows(coach: User) -> list[RosterRow]:
    total_modules = await db.training_modules.count_documents({})
    # Every roster query is scoped to the case manager's organisation AND their own caseload.
    participants = await db.users.find(
        {
            "coach_id": coach.id,
            "role": "participant",
            "organization_id": coach.organization_id,
        }
    ).to_list(500)
    rows: list[RosterRow] = []
    for p in participants:
        progress = await db.participant_progress.find({"participant_id": p["id"]}).to_list(500)
        completed = len([x for x in progress if x.get("status") == "completed"])
        # Projection keeps the base64 evidence payload out of the roster aggregation.
        logs = await db.job_search_logs.find(
            {"participant_id": p["id"]}, {"points": 1}
        ).to_list(500)
        points = sum(int(log.get("points", 5)) for log in logs)
        percent = round(completed / total_modules * 100) if total_modules else 0
        risk = "on_track" if points >= 100 else "watch" if points >= 50 else "at_risk"
        rows.append(
            RosterRow(
                participant=User(**p),
                completion_percent=percent,
                completed_modules=completed,
                job_applications=len(logs),
                pbas_points=points,
                last_login=p.get("last_login"),
                risk=risk,
            )
        )
    rows.sort(key=lambda r: r.participant.name)
    return rows


@router.get("/{coach_id}/roster", response_model=list[RosterRow])
async def roster(coach_id: str):
    coach = await _coach(coach_id)
    # Data-retention sweep runs whenever a case manager opens their roster (own tenant only).
    await limits.archive_inactive(coach.organization_id)
    return await _roster_rows(coach)


@router.get("/{coach_id}/participants/{pid}", response_model=CoachParticipantDetail)
async def participant_detail(coach_id: str, pid: str):
    coach = await _coach(coach_id)
    p = await _participant_in_tenant(coach, pid)
    total_modules = await db.training_modules.count_documents({})
    progress = await db.participant_progress.find({"participant_id": pid}).to_list(500)
    completed = len([x for x in progress if x.get("status") == "completed"])
    logs = await db.job_search_logs.find({"participant_id": pid}).sort("created_at", -1).to_list(200)
    resumes = await db.resumes.find({"participant_id": pid}).sort("created_at", -1).to_list(50)
    interviews = await db.interview_sessions.find({"participant_id": pid}).sort("created_at", -1).to_list(50)
    notes = await db.case_notes.find({"participant_id": pid}).sort("created_at", -1).to_list(200)
    certs = await db.certificates.find({"participant_id": pid}).sort("issued_at", -1).to_list(100)
    modules = await db.training_modules.find().sort("order", 1).to_list(200)
    return CoachParticipantDetail(
        participant=User(**p),
        completion_percent=round(completed / total_modules * 100) if total_modules else 0,
        progress=[ParticipantProgress(**x) for x in progress],
        modules=[TrainingModule(**m) for m in modules],
        job_logs=[JobSearchLog(**x) for x in logs],
        resumes=[Resume(**x) for x in resumes],
        interviews=[InterviewSession(**x) for x in interviews],
        notes=[CaseNote(**x) for x in notes],
        certificates=await certs_lib.hydrate(certs),
        pbas_points=sum(int(log.get("points", 5)) for log in logs),
        usage=await limits.usage_summary(pid),
    )


@router.post("/{coach_id}/participants/{pid}/grant-ai", response_model=UsageSummary)
async def grant_ai(coach_id: str, pid: str, body: GrantRequest):
    """Case manager override: top up a jobseeker's monthly AI/activity allowance."""
    coach = await _coach(coach_id)
    await _participant_in_tenant(coach, pid)
    if body.amount < 1 or body.amount > 10:
        raise HTTPException(status_code=400, detail="Grant between 1 and 10 extra sessions")
    return await limits.grant_extra(pid, body.kind, body.amount)


@router.post("/{coach_id}/participants", response_model=InviteResult)
async def invite_participant(coach_id: str, body: UserCreate):
    """Case managers add jobseekers to their own caseload, capped by the provider's paid seats."""
    coach = await _coach(coach_id)
    return await invites.create_invited_user(
        name=body.name,
        email=body.email,
        role="participant",
        organization_id=coach.organization_id,
        invited_by=coach.id,
        phone=body.phone,
        coach_id=coach.id,
        cohort_id=body.cohort_id,
    )


@router.post("/{coach_id}/participants/{pid}/invite-link", response_model=InviteResult)
async def reissue_invite(coach_id: str, pid: str):
    coach = await _coach(coach_id)
    doc = await _participant_in_tenant(coach, pid)
    return await invites.refresh_invite(doc)


@router.post("/{coach_id}/participants/{pid}/reset-password", response_model=ResetPasswordResult)
async def reset_password(coach_id: str, pid: str):
    coach = await _coach(coach_id)
    doc = await _participant_in_tenant(coach, pid)
    temp = temporary_password()
    await db.users.update_one(
        {"id": pid}, {"$set": {"password_hash": hash_password(temp), "must_change_password": True}}
    )
    return ResetPasswordResult(
        user_id=pid, name=doc["name"], email=doc["email"], temporary_password=temp
    )


@router.post("/{coach_id}/participants/{pid}/notes", response_model=CaseNote)
async def add_note(coach_id: str, pid: str, body: CaseNoteCreate):
    coach = await _coach(coach_id)
    await _participant_in_tenant(coach, pid)
    if not body.body.strip():
        raise HTTPException(status_code=400, detail="Note cannot be empty")
    note = CaseNote(participant_id=pid, coach_id=coach_id, coach_name=coach.name, body=body.body.strip())
    await db.case_notes.insert_one(note.model_dump())
    return note


async def _report_rows(coach: User) -> list[list[str]]:
    """Full cohort compliance summary, scoped to the case manager's organisation."""
    modules = await db.training_modules.find().sort("order", 1).to_list(200)
    cohorts = {
        c["id"]: c["name"]
        for c in await db.cohorts.find({"organization_id": coach.organization_id}).to_list(100)
    }

    header = [
        "Jobseeker",
        "Email",
        "Cohort",
        "Completion %",
        "Modules completed",
        "Average quiz score %",
        "Certificates earned",
        "Job applications",
        "PBAS points",
        "Last login",
        "Status",
    ] + [f"Quiz: {m['title']}" for m in modules]
    rows = [header]

    for r in await _roster_rows(coach):
        pid = r.participant.id
        progress = await db.participant_progress.find({"participant_id": pid}).to_list(500)
        by_module = {p["module_id"]: p for p in progress}
        scores = [p["quiz_score"] for p in progress if p.get("quiz_score") is not None]
        certs = await db.certificates.count_documents({"participant_id": pid})

        rows.append(
            [
                r.participant.name,
                r.participant.email,
                cohorts.get(r.participant.cohort_id or "", "Unassigned"),
                str(r.completion_percent),
                str(r.completed_modules),
                str(round(sum(scores) / len(scores)) if scores else 0),
                str(certs),
                str(r.job_applications),
                str(r.pbas_points),
                r.last_login.date().isoformat() if r.last_login else "Never",
                r.risk.replace("_", " ").title(),
            ]
            + [
                str(by_module[m["id"]]["quiz_score"])
                if m["id"] in by_module and by_module[m["id"]].get("quiz_score") is not None
                else "-"
                for m in modules
            ]
        )
    return rows


@router.get("/{coach_id}/export.csv")
async def export_csv(coach_id: str):
    coach = await _coach(coach_id)
    buf = io.StringIO()
    csv.writer(buf).writerows(await _report_rows(coach))
    return Response(
        content=buf.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="cohort-summary.csv"'},
    )


@router.get("/{coach_id}/export.pdf")
async def export_pdf(coach_id: str):
    coach = await _coach(coach_id)
    rows = await _report_rows(coach)
    org = await db.organizations.find_one({"id": coach.organization_id}) or {}
    lines = [
        f"Organisation: {org.get('name', 'Straight Up Training')}",
        f"Case Manager: {coach.name}",
        "",
    ]
    for row in rows:
        lines.append(" | ".join(row))
    return Response(
        content=simple_pdf("Straight Up Training - Compliance Report", lines),
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="compliance-report.pdf"'},
    )
