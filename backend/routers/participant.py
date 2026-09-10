from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from lib import ai, certificates, limits
from lib.db import db
from models.schemas import (
    EvidenceUpload,
    Certificate,
    GrantRequest,
    JobSearchLog,
    JobSearchLogCreate,
    ModuleDetail,
    ParticipantDashboard,
    ParticipantProgress,
    Quiz,
    QuizAnswerResult,
    QuizResult,
    QuizSubmission,
    Resume,
    ResumeCreate,
    ResumeUpdate,
    TrainingModule,
    UsageSummary,
    User,
)

router = APIRouter(prefix="/participants", tags=["participant"])

POINTS_BY_TYPE = {
    "Online application": 5,
    "In person": 10,
    "Email application": 5,
    "Phone enquiry": 5,
    "Recruitment agency": 5,
    "Interview attended": 20,
}


async def get_participant(pid: str) -> User:
    doc = await db.users.find_one({"id": pid})
    if not doc:
        raise HTTPException(status_code=404, detail="Jobseeker not found")
    if doc.get("role") != "participant":
        raise HTTPException(status_code=403, detail="Not a jobseeker account")
    return User(**doc)


async def completion_stats(pid: str) -> tuple[int, int, int, list[dict]]:
    total = await db.training_modules.count_documents({})
    progress = await db.participant_progress.find({"participant_id": pid}).to_list(500)
    completed = len([p for p in progress if p.get("status") == "completed"])
    percent = round(completed / total * 100) if total else 0
    return total, completed, percent, progress


async def pbas_points(pid: str) -> int:
    # Projection keeps the base64 evidence payload out of a points-only aggregation.
    logs = await db.job_search_logs.find(
        {"participant_id": pid}, {"points": 1}
    ).to_list(500)
    return sum(int(log.get("points", 5)) for log in logs)


@router.get("/{pid}/dashboard", response_model=ParticipantDashboard)
async def dashboard(pid: str):
    user = await get_participant(pid)
    total, completed, percent, progress = await completion_stats(pid)
    done_ids = {p["module_id"] for p in progress if p.get("status") == "completed"}
    in_progress = len([p for p in progress if p.get("status") == "in_progress"])

    next_module = None
    for doc in await db.training_modules.find().sort("order", 1).to_list(200):
        if doc["id"] not in done_ids:
            next_module = TrainingModule(**doc)
            break

    logs = await db.job_search_logs.find({"participant_id": pid}).sort("created_at", -1).to_list(5)
    sessions = await db.interview_sessions.find(
        {"participant_id": pid, "finished": True}
    ).sort("created_at", -1).to_list(1)

    return ParticipantDashboard(
        user=user,
        total_modules=total,
        completed_modules=completed,
        in_progress_modules=in_progress,
        completion_percent=percent,
        next_module=next_module,
        recent_logs=[JobSearchLog(**log) for log in logs],
        pbas_points=await pbas_points(pid),
        certificates=await db.certificates.count_documents({"participant_id": pid}),
        latest_interview_score=sessions[0].get("overall_score") if sessions else None,
        usage=await limits.usage_summary(pid),
    )


@router.get("/{pid}/usage", response_model=UsageSummary)
async def usage(pid: str):
    await get_participant(pid)
    return await limits.usage_summary(pid)


@router.get("/{pid}/progress", response_model=list[ParticipantProgress])
async def list_progress(pid: str):
    docs = await db.participant_progress.find({"participant_id": pid}).to_list(500)
    return [ParticipantProgress(**d) for d in docs]


@router.get("/{pid}/modules/{module_id}", response_model=ModuleDetail)
async def module_detail(pid: str, module_id: str):
    mod = await db.training_modules.find_one({"id": module_id})
    if not mod:
        raise HTTPException(status_code=404, detail="Module not found")
    quiz = await db.quizzes.find_one({"module_id": module_id})
    prog = await db.participant_progress.find_one({"participant_id": pid, "module_id": module_id})
    return ModuleDetail(
        module=TrainingModule(**mod),
        quiz=Quiz(**quiz) if quiz else None,
        progress=ParticipantProgress(**prog) if prog else None,
    )


@router.post("/{pid}/modules/{module_id}/start", response_model=ParticipantProgress)
async def start_module(pid: str, module_id: str):
    await get_participant(pid)
    existing = await db.participant_progress.find_one({"participant_id": pid, "module_id": module_id})
    if existing:
        return ParticipantProgress(**existing)
    prog = ParticipantProgress(participant_id=pid, module_id=module_id, status="in_progress")
    await db.participant_progress.insert_one(prog.model_dump())
    return prog


@router.post("/{pid}/modules/{module_id}/quiz", response_model=QuizResult)
async def submit_quiz(pid: str, module_id: str, body: QuizSubmission):
    await get_participant(pid)
    quiz = await db.quizzes.find_one({"module_id": module_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found for this module")
    questions = quiz.get("questions", [])
    if len(body.answers) != len(questions):
        raise HTTPException(status_code=400, detail="Please answer every question")

    results = []
    correct = 0
    for q, selected in zip(questions, body.answers):
        is_correct = selected == q["correct_answer"]
        correct += int(is_correct)
        results.append(
            QuizAnswerResult(
                question=q["question"],
                selected=selected,
                correct_answer=q["correct_answer"],
                is_correct=is_correct,
                explanation=q.get("explanation", ""),
            )
        )

    score = round(correct / len(questions) * 100)
    passed = score >= 80
    await db.participant_progress.update_one(
        {"participant_id": pid, "module_id": module_id},
        {
            "$set": {
                "status": "completed" if passed else "in_progress",
                "quiz_score": score,
                "completed_at": datetime.now(timezone.utc) if passed else None,
            },
            "$setOnInsert": {"id": str(__import__("uuid").uuid4()), "participant_id": pid, "module_id": module_id},
        },
        upsert=True,
    )

    new_certs: list[Certificate] = []
    if passed:
        participant_doc = await db.users.find_one({"id": pid})
        if participant_doc:
            new_certs = await certificates.issue_for_category(participant_doc, module_id)

    return QuizResult(
        score=score,
        passed=passed,
        correct=correct,
        total=len(questions),
        results=results,
        certificate_earned=passed,
        new_certificates=new_certs,
    )


@router.get("/{pid}/certificates", response_model=list[Certificate])
async def list_certificates(pid: str):
    docs = await db.certificates.find({"participant_id": pid}).sort("issued_at", -1).to_list(100)
    return await certificates.hydrate(docs)


@router.get("/{pid}/job-logs", response_model=list[JobSearchLog])
async def list_job_logs(pid: str):
    docs = await db.job_search_logs.find({"participant_id": pid}).sort("created_at", -1).to_list(200)
    # Never ship the base64 payload in a list response — it is fetched only on download.
    for d in docs:
        d["evidence_data"] = ""
    return [JobSearchLog(**d) for d in docs]


@router.post("/{pid}/job-logs/{log_id}/evidence", response_model=JobSearchLog)
async def upload_evidence(pid: str, log_id: str, body: EvidenceUpload):
    """Attach or replace the proof file (PDF, screenshot, receipt) on a job search entry."""
    await get_participant(pid)
    log = await db.job_search_logs.find_one({"id": log_id, "participant_id": pid})
    if not log:
        raise HTTPException(status_code=404, detail="Job search entry not found")
    size = limits.evidence_byte_size(body.evidence_data)
    if size > limits.EVIDENCE_MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Files must be {limits.EVIDENCE_MAX_BYTES // (1024 * 1024)}MB or smaller.",
        )
    await db.job_search_logs.update_one(
        {"id": log_id},
        {
            "$set": {
                "evidence_filename": body.evidence_filename,
                "evidence_data": body.evidence_data,
                "evidence_mime": body.evidence_mime,
                "evidence_size": size,
                # A replaced file goes back into the review queue.
                "review_status": "pending",
                "review_note": "",
                "reviewed_by": "",
                "reviewed_at": None,
                "status": "submitted",
            }
        },
    )
    doc = await db.job_search_logs.find_one({"id": log_id})
    doc["evidence_data"] = ""
    return JobSearchLog(**doc)


@router.post("/{pid}/job-logs", response_model=JobSearchLog)
async def create_job_log(pid: str, body: JobSearchLogCreate):
    await get_participant(pid)
    if await limits.remaining(pid, "job_logs") <= 0:
        raise HTTPException(
            status_code=429,
            detail=(
                f"You have reached the monthly cap of {limits.JOB_LOGS_PER_MONTH} job search entries. "
                "Ask your case manager if you need more."
            ),
        )
    size = limits.evidence_byte_size(body.evidence_data)
    if size > limits.EVIDENCE_MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail=f"Files must be {limits.EVIDENCE_MAX_BYTES // (1024 * 1024)}MB or smaller.",
        )
    log = JobSearchLog(
        participant_id=pid,
        points=POINTS_BY_TYPE.get(body.application_type, 5),
        evidence_size=size,
        **body.model_dump(),
    )
    await db.job_search_logs.insert_one(log.model_dump())
    log.evidence_data = ""
    return log


@router.get("/{pid}/resumes", response_model=list[Resume])
async def list_resumes(pid: str):
    docs = await db.resumes.find({"participant_id": pid}).sort("created_at", -1).to_list(50)
    return [Resume(**d) for d in docs]


@router.post("/{pid}/resumes", response_model=Resume)
async def create_resume(pid: str, body: ResumeCreate):
    await get_participant(pid)
    usage_now = await limits.usage_summary(pid)
    if usage_now.resumes.remaining <= 0:
        raise HTTPException(
            status_code=402,
            detail=(
                f"Upgrade Required — you have used all {usage_now.resumes.limit} AI resume generations "
                "for this month. Saved resumes can still be edited and downloaded free of charge; ask "
                "your case manager for an extra session or upgrade your site plan."
            ),
        )
    want_cover = body.include_cover_letter and usage_now.cover_letters.remaining > 0
    generated = await ai.build_resume(body.model_dump())
    resume = Resume(
        participant_id=pid,
        title=body.title,
        contact_info_json=body.contact_info_json,
        work_history_json=body.work_history_json,
        education_json=body.education_json,
        skills_json=body.skills_json,
        generated_markdown=generated["resume_markdown"],
        cover_letter_markdown=generated["cover_letter_markdown"] if want_cover else "",
    )
    await db.resumes.insert_one(resume.model_dump())
    return resume


@router.patch("/{pid}/resumes/{resume_id}", response_model=Resume)
async def update_resume(pid: str, resume_id: str, body: ResumeUpdate):
    """Save participant text edits. Free — no AI call, no credit spent."""
    await get_participant(pid)
    doc = await db.resumes.find_one({"id": resume_id, "participant_id": pid})
    if not doc:
        raise HTTPException(status_code=404, detail="Resume not found")
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if updates:
        await db.resumes.update_one({"id": resume_id}, {"$set": updates})
        doc.update(updates)
    return Resume(**doc)
