"""Invite onboarding emails and System Admin role switching.

`POST /api/invite-email/{inviter_id}/{user_id}` sends the onboarding email through Resend and always
returns the rendered subject/body plus a `mailto:` draft, so the inviter can deliver it manually when
email is unavailable.
"""

import os
import re
from pathlib import Path
from urllib.parse import quote

from dotenv import dotenv_values
from fastapi import APIRouter, HTTPException

from lib import email as mailer
from lib import invites
from lib.db import db
from models.schemas import InviteEmailResult, RoleSwitchTarget, User

router = APIRouter(tags=["invite-email"])

# Roles allowed to invite, and which roles each may invite.
CAN_INVITE: dict[str, tuple[str, ...]] = {
    "owner": ("admin", "coach", "participant"),
    "admin": ("coach", "participant"),
    "coach": ("participant",),
}

ROLE_LABEL = {
    "owner": "System Admin",
    "admin": "Provider",
    "coach": "Case Manager",
    "participant": "Learner",
}


def app_url() -> str:
    """Public origin used in onboarding links.

    In production APP_URL arrives as a platform secret, so the process environment wins. The pod's
    supervisor config exports a stale UUID-form preview host, so that one specific case falls back
    to backend/.env.
    """
    env_value = os.environ.get("APP_URL", "").strip()
    stale_preview = bool(re.match(r"^https?://[0-9a-f-]{36}\.preview\.emergentagent\.com", env_value))
    if env_value and not stale_preview:
        return env_value.rstrip("/")
    file_value = dotenv_values(Path(__file__).resolve().parents[1] / ".env").get("APP_URL") or ""
    return (file_value or env_value).rstrip("/")


async def _inviter(inviter_id: str) -> User:
    doc = await db.users.find_one({"id": inviter_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Inviter not found")
    if doc.get("role") not in CAN_INVITE:
        raise HTTPException(status_code=403, detail="You cannot send invitations")
    return User(**doc)


@router.post("/invite-email/{inviter_id}/{user_id}", response_model=InviteEmailResult)
async def send_invite_email(inviter_id: str, user_id: str):
    inviter = await _inviter(inviter_id)
    target = await db.users.find_one({"id": user_id})
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    if target["role"] not in CAN_INVITE[inviter.role]:
        raise HTTPException(status_code=403, detail="You cannot invite that role")
    if inviter.role != "owner" and target["organization_id"] != inviter.organization_id:
        raise HTTPException(status_code=404, detail="User not found")
    if inviter.role == "coach" and target.get("coach_id") != inviter.id:
        raise HTTPException(status_code=404, detail="User not found")

    # Re-issuing keeps one live magic link per user, so a resent email never invalidates the first.
    result = await invites.refresh_invite(target)
    org = await db.organizations.find_one({"id": target["organization_id"]}) or {}
    org_name = org.get("name", "Straight Up Training")
    link = f"{app_url()}{result.invite_path}"

    subject = mailer.invite_subject()
    text = mailer.invite_text(target["name"], target["role"], org_name, link)
    status, detail = await mailer.send_email(
        to=target["email"],
        subject=subject,
        html=mailer.invite_html(target["name"], target["role"], org_name, link),
        text=text,
    )

    return InviteEmailResult(
        status=status,
        detail=detail,
        recipient=target["email"],
        subject=subject,
        body=text,
        invite_url=link,
        mailto_url=(
            f"mailto:{quote(target['email'])}"
            f"?subject={quote(subject)}&body={quote(text)}"
        ),
    )


@router.get("/role-switch/{owner_id}", response_model=list[RoleSwitchTarget])
async def role_switch_targets(owner_id: str):
    """One real, active user per role so the System Admin can preview every screen with live data."""
    doc = await db.users.find_one({"id": owner_id})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")
    if doc.get("role") != "owner":
        raise HTTPException(status_code=403, detail="System Admin access required")

    targets: list[RoleSwitchTarget] = [
        RoleSwitchTarget(role="owner", label=ROLE_LABEL["owner"], user=User(**doc))
    ]
    # Prefer a user from an organisation that actually has learners, so every previewed screen has
    # real data rather than an empty provider.
    populated = await db.users.distinct("organization_id", {"role": "participant"})
    for role in ("admin", "coach", "participant"):
        candidate = await db.users.find_one(
            {"role": role, "status": "active", "organization_id": {"$in": populated}}
        ) or await db.users.find_one({"role": role, "status": "active"})
        if candidate:
            targets.append(
                RoleSwitchTarget(role=role, label=ROLE_LABEL[role], user=User(**candidate))
            )
    return targets
