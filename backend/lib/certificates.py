"""Certificate issuance rules.

A participant earns a certificate when either:
  * they complete every module in a category (a "category" certificate), or
  * they score over 70 on an AI mock interview (an "interview" certificate).

Issuance is idempotent: the same participant/kind/title is never issued twice.
"""

import random
from datetime import datetime, timezone

from lib.db import db
from models.schemas import Certificate

PASS_MARK = 80
INTERVIEW_THRESHOLD = 70


async def _next_certificate_id() -> str:
    year = datetime.now(timezone.utc).year
    for _ in range(25):
        candidate = f"CERT-{year}-{random.randint(1000, 9999)}"
        if not await db.certificates.find_one({"certificate_id": candidate}):
            return candidate
    return f"CERT-{year}-{random.randint(10000, 99999)}"


async def _issue(
    participant: dict,
    kind: str,
    title: str,
    subtitle: str,
    score: int | None,
) -> Certificate | None:
    existing = await db.certificates.find_one(
        {"participant_id": participant["id"], "kind": kind, "title": title}
    )
    if existing:
        return None

    org = await db.organizations.find_one({"id": participant.get("organization_id")})
    cert = Certificate(
        certificate_id=await _next_certificate_id(),
        participant_id=participant["id"],
        participant_name=participant.get("name", "Jobseeker"),
        kind=kind,  # type: ignore[arg-type]
        title=title,
        subtitle=subtitle,
        organization_id=participant.get("organization_id", ""),
        organization_name=(org or {}).get("name", "WorkReady Portal"),
        organization_logo=(org or {}).get("branding_logo", ""),
        score=score,
    )
    await db.certificates.insert_one(cert.model_dump())
    return cert


async def issue_for_category(participant: dict, module_id: str) -> list[Certificate]:
    """Issue a certificate if every module in this module's category is now complete."""
    module = await db.training_modules.find_one({"id": module_id})
    if not module:
        return []
    category = module["category"]

    category_modules = await db.training_modules.find({"category": category}).to_list(200)
    category_ids = {m["id"] for m in category_modules}

    progress = await db.participant_progress.find(
        {"participant_id": participant["id"], "status": "completed"}
    ).to_list(500)
    completed_ids = {p["module_id"] for p in progress}

    if not category_ids or not category_ids.issubset(completed_ids):
        return []

    scores = [p.get("quiz_score") or 0 for p in progress if p["module_id"] in category_ids]
    average = round(sum(scores) / len(scores)) if scores else None

    cert = await _issue(
        participant,
        "category",
        category,
        f"Completed all {len(category_ids)} module(s) in {category}",
        average,
    )
    return [cert] if cert else []


async def issue_for_interview(participant: dict, job_target: str, score: int) -> list[Certificate]:
    """Issue an interview readiness certificate when the score clears the threshold."""
    if score <= INTERVIEW_THRESHOLD:
        return []
    cert = await _issue(
        participant,
        "interview",
        "Interview Readiness",
        f"Achieved {score}% readiness in a mock interview for {job_target}",
        score,
    )
    return [cert] if cert else []
