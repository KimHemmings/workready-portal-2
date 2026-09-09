"""Magic invite links and seat-capped user creation.

Invites replace background emails entirely: adding a user mints a single-use token, and the inviter
copies the link straight out of the UI.
"""

import secrets

from fastapi import HTTPException

from models.schemas import InviteResult, Role, User

from . import limits
from .db import db

SEAT_LIMIT_MESSAGE = "Seat limit reached. Contact your account manager to upgrade."


def new_invite_token() -> str:
    return secrets.token_urlsafe(24)


def invite_path(token: str) -> str:
    return f"/register?invite={token}"


def welcome_message(name: str, org_name: str, role: Role, path: str) -> str:
    role_label = {
        "participant": "Jobseeker",
        "coach": "Case Manager",
        "admin": "Provider Admin",
        "owner": "System Owner",
    }[role]
    return (
        f"G'day {name.split(' ')[0]},\n\n"
        f"You've been set up on Straight Up Training with {org_name} as a {role_label}. "
        "Open the link below to set your password and get started:\n\n"
        f"{path}\n\n"
        "The link is personal to you — please don't share it."
    )


async def assert_seat_available(organization_id: str, role: Role) -> None:
    """Block a new coach/jobseeker once the provider's paid seat count is used up."""
    if role not in ("participant", "coach"):
        return
    coach_limit, participant_limit = await limits.org_limits(organization_id)
    participants_used, coaches_used = await limits.seats_used(organization_id)
    if role == "participant" and participants_used >= participant_limit:
        raise HTTPException(status_code=409, detail=SEAT_LIMIT_MESSAGE)
    if role == "coach" and coaches_used >= coach_limit:
        raise HTTPException(status_code=409, detail=SEAT_LIMIT_MESSAGE)


async def create_invited_user(
    *,
    name: str,
    email: str,
    role: Role,
    organization_id: str,
    invited_by: str,
    phone: str = "",
    coach_id: str | None = None,
    cohort_id: str | None = None,
) -> InviteResult:
    email = email.strip().lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="A user with that email already exists")
    await assert_seat_available(organization_id, role)

    token = new_invite_token()
    user = User(
        name=name.strip(),
        email=email,
        role=role,
        organization_id=organization_id,
        phone=phone,
        coach_id=coach_id,
        cohort_id=cohort_id,
        status="pending",
        must_change_password=True,
        invite_token=token,
        invited_by=invited_by,
    )
    await db.users.insert_one(user.model_dump())

    org = await db.organizations.find_one({"id": organization_id}) or {}
    path = invite_path(token)
    return InviteResult(
        user=user,
        invite_token=token,
        invite_path=path,
        welcome_message=welcome_message(user.name, org.get("name", "your site"), role, path),
    )


async def refresh_invite(user_doc: dict) -> InviteResult:
    """Re-issue (or reuse) a magic link so an inviter can hand it over again at any time."""
    token = user_doc.get("invite_token")
    if not token:
        token = new_invite_token()
        await db.users.update_one({"id": user_doc["id"]}, {"$set": {"invite_token": token}})
        user_doc["invite_token"] = token
    org = await db.organizations.find_one({"id": user_doc["organization_id"]}) or {}
    path = invite_path(token)
    return InviteResult(
        user=User(**user_doc),
        invite_token=token,
        invite_path=path,
        welcome_message=welcome_message(
            user_doc["name"], org.get("name", "your site"), user_doc["role"], path
        ),
    )
