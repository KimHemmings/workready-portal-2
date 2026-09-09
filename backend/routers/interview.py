from fastapi import APIRouter, HTTPException

from lib import ai, certificates, limits
from lib.db import db
from models.schemas import (
    FeedbackSummary,
    InterviewAnswer,
    InterviewSession,
    InterviewStart,
    TranscriptTurn,
)

router = APIRouter(prefix="/interviews", tags=["interview"])


async def _load(session_id: str) -> InterviewSession:
    doc = await db.interview_sessions.find_one({"id": session_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Interview session not found")
    return InterviewSession(**doc)


@router.post("/start", response_model=InterviewSession)
async def start(body: InterviewStart):
    user = await db.users.find_one({"id": body.participant_id})
    if not user:
        raise HTTPException(status_code=404, detail="Jobseeker not found")
    usage = await limits.usage_summary(body.participant_id)
    if usage.interviews.remaining <= 0:
        raise HTTPException(
            status_code=402,
            detail=(
                f"Upgrade Required — you have used all {usage.interviews.limit} AI practice interviews "
                "for this month. Your case manager can grant an extra session, or upgrade your site plan."
            ),
        )
    questions = await ai.generate_questions(body.job_target, body.industry, body.mode)
    session = InterviewSession(
        participant_id=body.participant_id,
        job_target=body.job_target,
        industry=body.industry,
        mode=body.mode,
        questions=questions,
        transcript_json=[TranscriptTurn(role="interviewer", content=questions[0])],
    )
    await db.interview_sessions.insert_one(session.model_dump())
    return session


@router.get("/{session_id}", response_model=InterviewSession)
async def get_session(session_id: str):
    return await _load(session_id)


@router.post("/{session_id}/answer", response_model=InterviewSession)
async def answer(session_id: str, body: InterviewAnswer):
    session = await _load(session_id)
    if session.finished:
        raise HTTPException(status_code=400, detail="This interview is already complete")
    if not body.answer.strip():
        raise HTTPException(status_code=400, detail="Please type an answer first")

    question = session.questions[session.current_index]
    session.transcript_json.append(TranscriptTurn(role="participant", content=body.answer.strip()))
    tip = await ai.coach_tip(question, body.answer, session.job_target, session.mode)
    session.transcript_json.append(TranscriptTurn(role="coach", content=tip))
    session.current_index += 1

    if session.current_index >= len(session.questions):
        session.finished = True
        scored = await ai.score_interview(
            session.job_target,
            session.industry,
            [t.model_dump() for t in session.transcript_json],
            session.mode,
        )
        session.overall_score = scored["overall_score"]
        session.feedback_summary_json = FeedbackSummary(**{
            "strengths": scored["strengths"],
            "improvements": scored["improvements"],
            "skills": scored["skills"],
            "summary": scored["summary"],
        })
        participant_doc = await db.users.find_one({"id": session.participant_id})
        if participant_doc:
            await certificates.issue_for_interview(
                participant_doc, session.job_target, session.overall_score
            )
    else:
        session.transcript_json.append(
            TranscriptTurn(role="interviewer", content=session.questions[session.current_index])
        )

    await db.interview_sessions.replace_one({"id": session.id}, session.model_dump())
    return session


@router.get("/participant/{pid}/history", response_model=list[InterviewSession])
async def history(pid: str):
    docs = await db.interview_sessions.find({"participant_id": pid}).sort("created_at", -1).to_list(50)
    return [InterviewSession(**d) for d in docs]
