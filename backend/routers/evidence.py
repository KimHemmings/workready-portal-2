"""Job Search Evidence review.

Learners upload proof of each job application; Case Managers, Providers and the System Admin review
it here. Every query is scoped by the viewer's role:
  coach  -> only their own caseload
  admin  -> everyone in their organisation
  owner  -> every organisation
"""

import base64
import binascii
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from lib.db import db
from models.schemas import (
    EvidenceReview,
    EvidenceRow,
    EvidenceSummary,
    JobSearchLog,
    User,
)

router = APIRouter(prefix="/evidence", tags=["evidence"])

REVIEW_ROLES = ("coach", "admin", "owner")


async def _reviewer(staff_id: str) -> User:
    doc = await db.users.find_one({"id": staff_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Reviewer not found")
    if doc.get("role") not in REVIEW_ROLES:
        raise HTTPException(status_code=403, detail="Case Manager access required")
    return User(**doc)


async def _visible_learners(reviewer: User) -> dict[str, dict]:
    """Learner docs this reviewer is allowed to see, keyed by id."""
    query: dict = {"role": "participant"}
    if reviewer.role == "coach":
        query.update({"coach_id": reviewer.id, "organization_id": reviewer.organization_id})
    elif reviewer.role == "admin":
        query["organization_id"] = reviewer.organization_id
    learners = await db.users.find(query).to_list(1000)
    return {x["id"]: x for x in learners}


@router.get("/{staff_id}", response_model=EvidenceSummary)
async def list_evidence(staff_id: str):
    reviewer = await _reviewer(staff_id)
    learners = await _visible_learners(reviewer)
    if not learners:
        return EvidenceSummary(rows=[], pending=0, approved=0, flagged=0, with_file=0)

    orgs = {
        o["id"]: o["name"]
        for o in await db.organizations.find().to_list(200)
    }
    logs = (
        await db.job_search_logs.find({"participant_id": {"$in": list(learners)}})
        .sort("created_at", -1)
        .to_list(1000)
    )

    rows: list[EvidenceRow] = []
    for log in logs:
        learner = learners[log["participant_id"]]
        has_file = bool(log.get("evidence_data"))
        # Strip the base64 payload from the list response; it is fetched only on download.
        log["evidence_data"] = ""
        rows.append(
            EvidenceRow(
                log=JobSearchLog(**log),
                learner_id=learner["id"],
                learner_name=learner["name"],
                learner_email=learner["email"],
                organization_name=orgs.get(learner["organization_id"], "Unknown provider"),
                has_file=has_file,
            )
        )

    return EvidenceSummary(
        rows=rows,
        pending=len([r for r in rows if r.log.review_status == "pending"]),
        approved=len([r for r in rows if r.log.review_status == "approved"]),
        flagged=len([r for r in rows if r.log.review_status == "flagged"]),
        with_file=len([r for r in rows if r.has_file]),
    )


async def _log_in_scope(reviewer: User, log_id: str) -> dict:
    log = await db.job_search_logs.find_one({"id": log_id})
    if not log:
        raise HTTPException(status_code=404, detail="Evidence record not found")
    learners = await _visible_learners(reviewer)
    if log["participant_id"] not in learners:
        # 404 rather than 403 so a foreign record's existence is never leaked.
        raise HTTPException(status_code=404, detail="Evidence record not found")
    return log


@router.get("/{staff_id}/{log_id}/file")
async def download_evidence(staff_id: str, log_id: str):
    """Stream the stored proof file back as a normal browser download."""
    reviewer = await _reviewer(staff_id)
    log = await _log_in_scope(reviewer, log_id)
    data = log.get("evidence_data") or ""
    if not data:
        raise HTTPException(status_code=404, detail="No file was attached to this record")
    try:
        raw = base64.b64decode(data)
    except (binascii.Error, ValueError):
        raise HTTPException(status_code=422, detail="Stored file is not readable")
    filename = log.get("evidence_filename") or "evidence"
    return Response(
        content=raw,
        media_type=log.get("evidence_mime") or "application/octet-stream",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.patch("/{staff_id}/{log_id}/review", response_model=JobSearchLog)
async def review_evidence(staff_id: str, log_id: str, body: EvidenceReview):
    """Approve or flag a submission. Approving also marks the PBAS log as verified."""
    reviewer = await _reviewer(staff_id)
    await _log_in_scope(reviewer, log_id)
    update = {
        "review_status": body.review_status,
        "review_note": body.review_note.strip(),
        "reviewed_by": reviewer.name,
        "reviewed_at": datetime.now(timezone.utc),
        "status": "verified" if body.review_status == "approved" else "submitted",
    }
    await db.job_search_logs.update_one({"id": log_id}, {"$set": update})
    doc = await db.job_search_logs.find_one({"id": log_id})
    doc["evidence_data"] = ""
    return JobSearchLog(**doc)
