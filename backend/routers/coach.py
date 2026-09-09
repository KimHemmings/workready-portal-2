import csv
import io

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from lib.db import db
from lib.pdf import simple_pdf
from models.schemas import (
    CaseNote,
    CaseNoteCreate,
    Certificate,
    CoachParticipantDetail,
    InterviewSession,
    JobSearchLog,
    ParticipantProgress,
    Resume,
    RosterRow,
    TrainingModule,
    User,
)

router = APIRouter(prefix="/coaches", tags=["coach"])


async def _coach(coach_id: str) -> User:
    doc = await db.users.find_one({"id": coach_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Case manager not found")
    if doc.get("role") not in ("coach", "admin"):
        raise HTTPException(status_code=403, detail="Case manager access required")
    return User(**doc)


async def _roster_rows(coach_id: str) -> list[RosterRow]:
    total_modules = await db.training_modules.count_documents({})
    participants = await db.users.find({"coach_id": coach_id, "role": "participant"}).to_list(500)
    rows: list[RosterRow] = []
    for p in participants:
        progress = await db.participant_progress.find({"participant_id": p["id"]}).to_list(500)
        completed = len([x for x in progress if x.get("status") == "completed"])
        logs = await db.job_search_logs.find({"participant_id": p["id"]}).to_list(500)
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
    await _coach(coach_id)
    return await _roster_rows(coach_id)


@router.get("/{coach_id}/participants/{pid}", response_model=CoachParticipantDetail)
async def participant_detail(coach_id: str, pid: str):
    await _coach(coach_id)
    p = await db.users.find_one({"id": pid, "role": "participant"})
    if not p:
        raise HTTPException(status_code=404, detail="Jobseeker not found")
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
        certificates=[Certificate(**x) for x in certs],
        pbas_points=sum(int(log.get("points", 5)) for log in logs),
    )


@router.post("/{coach_id}/participants/{pid}/notes", response_model=CaseNote)
async def add_note(coach_id: str, pid: str, body: CaseNoteCreate):
    coach = await _coach(coach_id)
    if not body.body.strip():
        raise HTTPException(status_code=400, detail="Note cannot be empty")
    note = CaseNote(participant_id=pid, coach_id=coach_id, coach_name=coach.name, body=body.body.strip())
    await db.case_notes.insert_one(note.model_dump())
    return note


async def _report_rows(coach_id: str) -> list[list[str]]:
    rows = [["Jobseeker", "Email", "Completion %", "Modules completed", "Job applications", "PBAS points", "Status"]]
    for r in await _roster_rows(coach_id):
        rows.append(
            [
                r.participant.name,
                r.participant.email,
                str(r.completion_percent),
                str(r.completed_modules),
                str(r.job_applications),
                str(r.pbas_points),
                r.risk.replace("_", " ").title(),
            ]
        )
    return rows


@router.get("/{coach_id}/export.csv")
async def export_csv(coach_id: str):
    await _coach(coach_id)
    buf = io.StringIO()
    csv.writer(buf).writerows(await _report_rows(coach_id))
    return Response(
        content=buf.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="workready-compliance.csv"'},
    )


@router.get("/{coach_id}/export.pdf")
async def export_pdf(coach_id: str):
    coach = await _coach(coach_id)
    rows = await _report_rows(coach_id)
    lines = [f"Case Manager: {coach.name}", ""]
    for row in rows:
        lines.append(" | ".join(row))
    return Response(
        content=simple_pdf("WorkReady Portal - Compliance Report", lines),
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="workready-compliance.pdf"'},
    )
