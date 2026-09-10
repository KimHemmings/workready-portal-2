"""Monthly AI/activity caps, tenant seat caps and inactivity archiving.

All "current month" maths is anchored to server time (UTC) — never to a client-supplied date.
Overrides granted by a case manager live in the `usage_overrides` collection, one document per
participant per month.
"""

from datetime import datetime, timedelta, timezone

from models.schemas import UsageMetric, UsageSummary

from .db import db

# Platform caps
INTERVIEWS_PER_MONTH = 3
RESUMES_PER_MONTH = 3
COVER_LETTERS_PER_MONTH = 3
JOB_LOGS_PER_MONTH = 20
PARTICIPANT_SEATS = 100
COACH_SEATS = 5
LOGO_MAX_BYTES = 2 * 1024 * 1024  # 2MB
EVIDENCE_MAX_BYTES = 5 * 1024 * 1024  # 5MB per proof file
INACTIVE_DAYS = 60

UsageKind = str
KINDS = ("interviews", "resumes", "cover_letters", "job_logs")
LIMIT_BY_KIND = {
    "interviews": INTERVIEWS_PER_MONTH,
    "resumes": RESUMES_PER_MONTH,
    "cover_letters": COVER_LETTERS_PER_MONTH,
    "job_logs": JOB_LOGS_PER_MONTH,
}


def month_start(now: datetime | None = None) -> datetime:
    now = now or datetime.now(timezone.utc)
    return now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)


def month_key(now: datetime | None = None) -> str:
    return month_start(now).strftime("%Y-%m")


async def _overrides(participant_id: str) -> dict[str, int]:
    doc = await db.usage_overrides.find_one(
        {"participant_id": participant_id, "month": month_key()}
    )
    return {k: int(doc.get(k, 0)) for k in KINDS} if doc else {k: 0 for k in KINDS}


async def _count_since(collection, query: dict, field: str = "created_at") -> int:
    return await collection.count_documents({**query, field: {"$gte": month_start()}})


async def usage_summary(participant_id: str) -> UsageSummary:
    extra = await _overrides(participant_id)
    interviews_used = await _count_since(
        db.interview_sessions, {"participant_id": participant_id, "finished": True}
    )
    resumes_used = await _count_since(db.resumes, {"participant_id": participant_id})
    covers_used = await _count_since(
        db.resumes,
        {"participant_id": participant_id, "cover_letter_markdown": {"$nin": ["", None]}},
    )
    logs_used = await _count_since(db.job_search_logs, {"participant_id": participant_id})

    used = {
        "interviews": interviews_used,
        "resumes": resumes_used,
        "cover_letters": covers_used,
        "job_logs": logs_used,
    }

    def metric(kind: str) -> UsageMetric:
        limit = LIMIT_BY_KIND[kind] + extra[kind]
        return UsageMetric(
            kind=kind,
            used=used[kind],
            limit=limit,
            base_limit=LIMIT_BY_KIND[kind],
            granted_extra=extra[kind],
            remaining=max(0, limit - used[kind]),
        )

    return UsageSummary(
        participant_id=participant_id,
        month=month_key(),
        interviews=metric("interviews"),
        resumes=metric("resumes"),
        cover_letters=metric("cover_letters"),
        job_logs=metric("job_logs"),
    )


async def grant_extra(participant_id: str, kind: str, amount: int) -> UsageSummary:
    await db.usage_overrides.update_one(
        {"participant_id": participant_id, "month": month_key()},
        {
            "$inc": {kind: max(1, amount)},
            "$setOnInsert": {"participant_id": participant_id, "month": month_key()},
        },
        upsert=True,
    )
    return await usage_summary(participant_id)


async def remaining(participant_id: str, kind: str) -> int:
    summary = await usage_summary(participant_id)
    return int(getattr(summary, kind).remaining)


def logo_byte_size(value: str) -> int:
    """Approximate stored size of a base64/data-URL payload: decoded bytes."""
    if value.startswith("data:"):
        b64 = value.split(",", 1)[-1]
        return int(len(b64) * 3 / 4)
    return len(value.encode("utf-8"))


async def seats_used(organization_id: str) -> tuple[int, int]:
    held = {"$in": ["active", "pending"]}
    participants = await db.users.count_documents(
        {"organization_id": organization_id, "role": "participant", "status": held}
    )
    coaches = await db.users.count_documents(
        {"organization_id": organization_id, "role": "coach", "status": held}
    )
    return participants, coaches


async def org_limits(organization_id: str) -> tuple[int, int]:
    """(coach seat limit, participant seat limit) as sold to this provider."""
    org = await db.organizations.find_one({"id": organization_id}) or {}
    return (
        int(org.get("coach_seat_limit", COACH_SEATS)),
        int(org.get("participant_seat_limit", PARTICIPANT_SEATS)),
    )


async def archive_inactive(organization_id: str | None = None) -> int:
    """Archive jobseekers with no login for INACTIVE_DAYS. Returns how many were archived."""
    cutoff = datetime.now(timezone.utc) - timedelta(days=INACTIVE_DAYS)
    query: dict = {
        "role": "participant",
        "status": "active",
        "last_login": {"$ne": None, "$lt": cutoff},
    }
    if organization_id:
        query["organization_id"] = organization_id
    result = await db.users.update_many(
        query, {"$set": {"status": "archived", "archived_at": datetime.now(timezone.utc)}}
    )
    return int(result.modified_count)


def evidence_byte_size(value: str) -> int:
    """Decoded size of an uploaded proof file (base64 or data URL)."""
    return logo_byte_size(value)
