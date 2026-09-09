"""Owner (system admin) tier: create provider accounts and set their paid seat caps."""

from fastapi import APIRouter, HTTPException

from lib import invites, limits
from lib.db import db
from lib.security import new_site_code
from models.schemas import (
    InviteResult,
    Organization,
    OwnerOverview,
    ProviderCreate,
    ProviderRow,
    SeatUpdate,
    User,
)

router = APIRouter(prefix="/owner", tags=["owner"])


async def _owner(owner_id: str) -> User:
    doc = await db.users.find_one({"id": owner_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Owner not found")
    if doc.get("role") != "owner":
        raise HTTPException(status_code=403, detail="System owner access required")
    return User(**doc)


async def _provider_row(org: dict) -> ProviderRow:
    participants_used, coaches_used = await limits.seats_used(org["id"])
    admins = await db.users.find({"organization_id": org["id"], "role": "admin"}).to_list(20)
    return ProviderRow(
        organization=Organization(**org),
        admins=[User(**a) for a in admins],
        coach_seats_used=coaches_used,
        participant_seats_used=participants_used,
    )


@router.get("/{owner_id}/overview", response_model=OwnerOverview)
async def overview(owner_id: str):
    await _owner(owner_id)
    orgs = await db.organizations.find().sort("created_at", 1).to_list(500)
    rows = [await _provider_row(o) for o in orgs]
    return OwnerOverview(
        providers=rows,
        total_providers=len(rows),
        total_coaches=sum(r.coach_seats_used for r in rows),
        total_participants=sum(r.participant_seats_used for r in rows),
    )


@router.post("/{owner_id}/providers", response_model=InviteResult)
async def create_provider(owner_id: str, body: ProviderCreate):
    """Stand up a provider account plus its first Provider Admin (delivered by magic link)."""
    owner = await _owner(owner_id)
    email = body.admin_email.strip().lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="A user with that email already exists")

    code = new_site_code()
    while await db.organizations.find_one({"site_code": code}):
        code = new_site_code()

    org = Organization(
        name=body.organization_name.strip(),
        type=body.type,
        site_code=code,
        coach_seat_limit=body.coach_seat_limit,
        participant_seat_limit=body.participant_seat_limit,
    )
    await db.organizations.insert_one(org.model_dump())

    return await invites.create_invited_user(
        name=body.admin_name,
        email=email,
        role="admin",
        organization_id=org.id,
        invited_by=owner.id,
    )


@router.patch("/{owner_id}/providers/{org_id}/seats", response_model=Organization)
async def set_seats(owner_id: str, org_id: str, body: SeatUpdate):
    await _owner(owner_id)
    org = await db.organizations.find_one({"id": org_id})
    if not org:
        raise HTTPException(status_code=404, detail="Provider not found")
    participants_used, coaches_used = await limits.seats_used(org_id)
    if body.coach_seat_limit < coaches_used:
        raise HTTPException(
            status_code=409,
            detail=f"{coaches_used} case manager seats are already in use — set a limit of {coaches_used} or more.",
        )
    if body.participant_seat_limit < participants_used:
        raise HTTPException(
            status_code=409,
            detail=f"{participants_used} jobseeker seats are already in use — set a limit of {participants_used} or more.",
        )
    await db.organizations.update_one({"id": org_id}, {"$set": body.model_dump()})
    doc = await db.organizations.find_one({"id": org_id})
    return Organization(**doc)


@router.post("/{owner_id}/users/{user_id}/invite-link", response_model=InviteResult)
async def reissue_invite(owner_id: str, user_id: str):
    await _owner(owner_id)
    doc = await db.users.find_one({"id": user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")
    return await invites.refresh_invite(doc)
