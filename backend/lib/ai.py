"""LLM helpers (Claude Sonnet 4.5 via the Emergent universal key) with safe fallbacks."""

import json
import logging
import os
import re
import uuid

logger = logging.getLogger(__name__)

MODEL = ("anthropic", "claude-sonnet-4-5-20250929")

FALLBACK_QUESTIONS = [
    "Thanks for coming in today. To start, can you tell me a bit about yourself and why this role interests you?",
    "Tell me about a time you had to work as part of a team. What was your role and how did it go?",
    "Describe a situation where you had to deal with a difficult customer or workmate. How did you handle it?",
    "If you were running late for your shift, what would you do?",
    "What do you think good workplace safety looks like day to day, and how would you contribute to it?",
]


def _key() -> str:
    return os.environ.get("EMERGENT_LLM_KEY", "")


async def _ask(system: str, prompt: str) -> str | None:
    """One-shot LLM call. Returns None on any failure so callers can fall back."""
    if not _key():
        return None
    try:
        from emergentintegrations.llm.chat import LlmChat, UserMessage

        chat = LlmChat(
            api_key=_key(),
            session_id=str(uuid.uuid4()),
            system_message=system,
        ).with_model(*MODEL)
        return await chat.send_message(UserMessage(text=prompt))
    except Exception as exc:
        logger.error("LLM call failed: %s", exc)
        return None


def _parse_json(text: str | None):
    if not text:
        return None
    match = re.search(r"\{.*\}|\[.*\]", text, re.S)
    if not match:
        return None
    try:
        return json.loads(match.group(0))
    except Exception:
        return None


INTERVIEWER_SYSTEM = (
    "You are a friendly, encouraging Australian employer conducting a practice job interview "
    "for an entry-level jobseeker. Use plain Australian English, short sentences, and a warm tone. "
    "Never be intimidating."
)

# LLND = Language, Literacy, Numeracy and Digital barriers. This variant keeps every
# sentence short and concrete, avoids idiom and jargon, and stays highly encouraging.
LLND_SYSTEM = (
    "You are a kind, patient Australian employer running a practice interview for a jobseeker who "
    "has Language, Literacy, Numeracy and Digital (LLND) barriers. Follow these rules strictly: "
    "use very simple Australian English at about a Year 5 reading level; keep every question under "
    "15 words; ask only ONE thing at a time; never use idioms, workplace jargon or abbreviations; "
    "use everyday words. Always sound warm, patient and encouraging."
)

LLND_FALLBACK_QUESTIONS = [
    "Hello! Tell me your name and why you want this job.",
    "Tell me about a time you helped someone.",
    "What do you do if you do not understand a task?",
    "What would you do if you were going to be late?",
    "How do you stay safe at work?",
]


def _system(mode: str) -> str:
    return LLND_SYSTEM if mode == "llnd" else INTERVIEWER_SYSTEM


async def generate_questions(job_target: str, industry: str, mode: str = "standard") -> list[str]:
    if mode == "llnd":
        prompt = (
            f"Write exactly 5 very simple practice interview questions for an entry-level "
            f"'{job_target}' job in the Australian {industry} industry. "
            "Each question must be under 15 words, use simple everyday words, and ask only one thing. "
            'Respond ONLY with JSON: {"questions": ["...", "...", "...", "...", "..."]}'
        )
    else:
        prompt = (
            f"Write exactly 5 realistic behavioural and situational interview questions for an entry-level "
            f"'{job_target}' role in the Australian {industry} industry. Mix behavioural and situational. "
            'Respond ONLY with JSON: {"questions": ["...", "...", "...", "...", "..."]}'
        )

    raw = await _ask(_system(mode), prompt)
    data = _parse_json(raw)
    if isinstance(data, dict) and isinstance(data.get("questions"), list):
        qs = [str(q) for q in data["questions"] if str(q).strip()][:5]
        if len(qs) == 5:
            return qs
    return list(LLND_FALLBACK_QUESTIONS if mode == "llnd" else FALLBACK_QUESTIONS)


async def coach_tip(question: str, answer: str, job_target: str, mode: str = "standard") -> str:
    if mode == "llnd":
        prompt = (
            f"The jobseeker is practising for a '{job_target}' job.\nQuestion: {question}\n"
            f"Their answer: {answer}\n\n"
            "Say one kind, encouraging sentence. First say what they did well. "
            "Then give ONE very simple tip. Use under 25 simple words. Plain text only."
        )
    else:
        prompt = (
            f"The jobseeker is practising for a '{job_target}' role.\nQuestion: {question}\n"
            f"Their answer: {answer}\n\nGive ONE short encouraging coaching tip (max 30 words) on how to "
            "strengthen that answer against the Australian Core Skills for Work. Plain text only."
        )

    raw = await _ask(_system(mode), prompt)
    if raw:
        return raw.strip().strip('"')[:300]
    if mode == "llnd":
        return "Well done for having a go. Next time, add one example of what you did."
    return "Good start — try adding a specific example with what you did and what the result was (the STAR approach)."


async def score_interview(
    job_target: str, industry: str, transcript: list[dict], mode: str = "standard"
) -> dict:
    convo = "\n".join(f"{t['role']}: {t['content']}" for t in transcript)
    tone = (
        "Be very encouraging and use simple, plain words in every comment, because this jobseeker "
        "has Language, Literacy, Numeracy and Digital barriers. Focus on effort and progress."
        if mode == "llnd"
        else "Be constructive and specific."
    )
    raw = await _ask(
        "You are an Australian employability assessor scoring a practice interview against the "
        "Australian Core Skills for Work framework.",
        f"Role: {job_target} ({industry}).\nTranscript:\n{convo}\n\n{tone}\n"
        "Score the jobseeker out of 100 overall and out of 100 for Communication, Problem Solving and "
        "Workplace Etiquette. Respond ONLY with JSON: "
        '{"overall_score": 0, "summary": "", "strengths": ["", ""], "improvements": ["", ""], '
        '"skills": [{"skill": "Communication", "score": 0, "comment": ""}, '
        '{"skill": "Problem Solving", "score": 0, "comment": ""}, '
        '{"skill": "Workplace Etiquette", "score": 0, "comment": ""}]}',
    )
    data = _parse_json(raw)
    if isinstance(data, dict) and isinstance(data.get("overall_score"), (int, float)):
        skills = data.get("skills") if isinstance(data.get("skills"), list) else []
        return {
            "overall_score": int(data["overall_score"]),
            "summary": str(data.get("summary", "")),
            "strengths": [str(s) for s in data.get("strengths", [])][:5],
            "improvements": [str(s) for s in data.get("improvements", [])][:5],
            "skills": [
                {
                    "skill": str(s.get("skill", "")),
                    "score": int(s.get("score", 0)),
                    "comment": str(s.get("comment", "")),
                }
                for s in skills
                if isinstance(s, dict)
            ],
        }
    answered = len([t for t in transcript if t["role"] == "participant"])
    base = 55 + min(answered, 5) * 5
    return {
        "overall_score": base,
        "summary": "You completed the practice interview. Keep building detailed examples for each answer.",
        "strengths": ["Completed all questions", "Willing to have a go at tough questions"],
        "improvements": [
            "Use the STAR approach: Situation, Task, Action, Result",
            "Give concrete Australian workplace examples",
        ],
        "skills": [
            {"skill": "Communication", "score": base, "comment": "Clear, keep expanding your answers."},
            {"skill": "Problem Solving", "score": base - 5, "comment": "Describe the steps you took."},
            {"skill": "Workplace Etiquette", "score": base + 5, "comment": "Polite and professional tone."},
        ],
    }


async def build_resume(payload: dict) -> dict:
    raw = await _ask(
        "You are an expert Australian resume writer producing ATS-friendly documents in Australian English.",
        "Write an ATS-friendly resume and a short cover letter in Markdown for this jobseeker.\n"
        f"{json.dumps(payload)[:4000]}\n\n"
        'Respond ONLY with JSON: {"resume_markdown": "...", "cover_letter_markdown": "..."}',
    )
    data = _parse_json(raw)
    if isinstance(data, dict) and data.get("resume_markdown"):
        return {
            "resume_markdown": str(data["resume_markdown"]),
            "cover_letter_markdown": str(data.get("cover_letter_markdown", "")),
        }
    contact = payload.get("contact_info_json", {}) or {}
    name = contact.get("full_name", "Jobseeker")
    skills = ", ".join(payload.get("skills_json", []) or [])
    jobs = "\n".join(
        f"### {j.get('title', '')} — {j.get('employer', '')}\n{j.get('dates', '')}\n\n{j.get('description', '')}\n"
        for j in payload.get("work_history_json", []) or []
    )
    edu = "\n".join(
        f"- **{e.get('qualification', '')}**, {e.get('institution', '')} ({e.get('year', '')})"
        for e in payload.get("education_json", []) or []
    )
    md = (
        f"# {name}\n\n{contact.get('email', '')} | {contact.get('phone', '')} | "
        f"{contact.get('location', '')}\n\n## Professional Summary\n\n"
        f"Motivated and reliable candidate seeking a {payload.get('target_role', 'role')} position, "
        f"with strong communication and teamwork skills.\n\n## Key Skills\n\n{skills}\n\n"
        f"## Work History\n\n{jobs}\n\n## Education\n\n{edu}\n"
    )
    cover = (
        f"Dear Hiring Manager,\n\nI am writing to apply for the {payload.get('target_role', 'advertised')} "
        f"position. I bring reliability, a strong work ethic and skills in {skills}.\n\n"
        f"I would welcome the opportunity to discuss my application.\n\nKind regards,\n{name}\n"
    )
    return {"resume_markdown": md, "cover_letter_markdown": cover}
