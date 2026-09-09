from fastapi import APIRouter, HTTPException

from lib import limits
from lib.db import db
from lib.security import hash_password, new_site_code
from models.schemas import (
    AdminOverview,
    AssignUpdate,
    Cohort,
    NameCount,
    Organization,
    User,
    UserCreate,
)

router = APIRouter(prefix="/admin", tags=["admin"])


async def _admin(admin_id: str) -> User:
    doc = await db.users.find_one({"id": admin_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Admin not found")
    if doc.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Provider admin access required")
    return User(**doc)


@router.get("/{admin_id}/overview", response_model=AdminOverview)
async def overview(admin_id: str):
    admin = await _admin(admin_id)
    await limits.archive_inactive(admin.organization_id)
    org_doc = await db.organizations.find_one({"id": admin.organization_id})
    if not org_doc:
        raise HTTPException(status_code=404, detail="Organisation not found")
    if not org_doc.get("site_code"):
        code = new_site_code()
        await db.organizations.update_one(
            {"id": admin.organization_id}, {"$set": {"site_code": code}}
        )
        org_doc["site_code"] = code

    users = await db.users.find({"organization_id": admin.organization_id}).to_list(1000)
    participants = [u for u in users if u["role"] == "participant"]
    coaches = [u for u in users if u["role"] == "coach"]
    cohorts = await db.cohorts.find({"organization_id": admin.organization_id}).to_list(100)
    modules = await db.training_modules.find().sort("order", 1).to_list(200)
    total_modules = len(modules)

    progress = await db.participant_progress.find().to_list(5000)
    pids = {p["id"] for p in participants}
    org_progress = [p for p in progress if p["participant_id"] in pids]

    completed_per_participant: dict[str, int] = {}
    for p in org_progress:
        if p.get("status") == "completed":
            completed_per_participant[p["participant_id"]] = completed_per_participant.get(p["participant_id"], 0) + 1

    if participants and total_modules:
        avg = round(
            sum(completed_per_participant.get(p["id"], 0) for p in participants)
            / (len(participants) * total_modules)
            * 100
        )
    else:
        avg = 0

    engagement = []
    for m in modules:
        count = len([p for p in org_progress if p["module_id"] == m["id"]])
        engagement.append(NameCount(name=m["title"], value=count))

    cohort_completion = []
    for c in cohorts:
        members = [p for p in participants if p.get("cohort_id") == c["id"]]
        if members and total_modules:
            pct = round(
                sum(completed_per_participant.get(m["id"], 0) for m in members)
                / (len(members) * total_modules)
                * 100
            )
        else:
            pct = 0
        cohort_completion.append(NameCount(name=c["name"], value=pct))

    seats_participants, seats_coaches = await limits.seats_used(admin.organization_id)
    archived = await db.users.count_documents(
        {"organization_id": admin.organization_id, "role": "participant", "status": "archived"}
    )

    return AdminOverview(
        organization=Organization(**org_doc),
        total_participants=len(participants),
        total_coaches=len(coaches),
        total_cohorts=len(cohorts),
        average_completion=avg,
        module_engagement=engagement,
        cohort_completion=cohort_completion,
        users=[User(**u) for u in users],
        cohorts=[Cohort(**c) for c in cohorts],
        coaches=[User(**c) for c in coaches],
        participant_seats_used=seats_participants,
        participant_seat_limit=limits.PARTICIPANT_SEATS,
        coach_seats_used=seats_coaches,
        coach_seat_limit=limits.COACH_SEATS,
        archived_participants=archived,
        logo_max_bytes=limits.LOGO_MAX_BYTES,
    )


@router.post("/{admin_id}/users", response_model=User)
async def invite_user(admin_id: str, body: UserCreate):
    admin = await _admin(admin_id)
    email = body.email.strip().lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="A user with that email already exists")

    seats_participants, seats_coaches = await limits.seats_used(admin.organization_id)
    if body.role == "participant" and seats_participants >= limits.PARTICIPANT_SEATS:
        raise HTTPException(
            status_code=409,
            detail=f"Site limit reached: {limits.PARTICIPANT_SEATS} active jobseeker seats are in use.",
        )
    if body.role == "coach" and seats_coaches >= limits.COACH_SEATS:
        raise HTTPException(
            status_code=409,
            detail=f"Site limit reached: {limits.COACH_SEATS} case manager seats are in use.",
        )
    user = User(
        name=body.name.strip(),
        email=email,
        role=body.role,
        organization_id=admin.organization_id,
        phone=body.phone,
        coach_id=body.coach_id,
        cohort_id=body.cohort_id,
    )
    doc = user.model_dump()
    doc["password_hash"] = hash_password(body.password or "Welcome2026!")
    await db.users.insert_one(doc)
    return user


@router.patch("/{admin_id}/users/{user_id}/assign", response_model=User)
async def assign_user(admin_id: str, user_id: str, body: AssignUpdate):
    await _admin(admin_id)
    doc = await db.users.find_one({"id": user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if updates:
        await db.users.update_one({"id": user_id}, {"$set": updates})
        doc.update(updates)
    return User(**doc)


@router.patch("/{admin_id}/users/{user_id}/status", response_model=User)
async def toggle_status(admin_id: str, user_id: str):
    admin = await _admin(admin_id)
    doc = await db.users.find_one({"id": user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")
    reactivating = doc.get("status") != "active"
    if reactivating:
        seats_participants, seats_coaches = await limits.seats_used(admin.organization_id)
        if doc.get("role") == "participant" and seats_participants >= limits.PARTICIPANT_SEATS:
            raise HTTPException(
                status_code=409,
                detail=f"Site limit reached: {limits.PARTICIPANT_SEATS} active jobseeker seats are in use.",
            )
        if doc.get("role") == "coach" and seats_coaches >= limits.COACH_SEATS:
            raise HTTPException(
                status_code=409,
                detail=f"Site limit reached: {limits.COACH_SEATS} case manager seats are in use.",
            )
    new_status = "active" if reactivating else "inactive"
    await db.users.update_one(
        {"id": user_id}, {"$set": {"status": new_status, "archived_at": None}}
    )
    doc["status"] = new_status
    doc["archived_at"] = None
    return User(**doc)


@router.patch("/{admin_id}/organization", response_model=Organization)
async def update_branding(admin_id: str, body: dict):
    admin = await _admin(admin_id)
    updates = {
        k: v
        for k, v in body.items()
        if k in ("name", "type", "branding_logo", "primary_color", "site_code")
    }
    if "site_code" in updates:
        code = str(updates["site_code"]).strip().upper().replace(" ", "-")
        if len(code) < 4 or len(code) > 24:
            raise HTTPException(
                status_code=400, detail="Site registration code must be 4–24 characters."
            )
        clash = await db.organizations.find_one(
            {"site_code": code, "id": {"$ne": admin.organization_id}}
        )
        if clash:
            raise HTTPException(status_code=409, detail="Another site is already using that code.")
        updates["site_code"] = code
    logo = updates.get("branding_logo")
    if isinstance(logo, str) and limits.logo_byte_size(logo) > limits.LOGO_MAX_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Logo is too large — please upload an image under 2MB.",
        )
    if updates:
        await db.organizations.update_one({"id": admin.organization_id}, {"$set": updates})
    doc = await db.organizations.find_one({"id": admin.organization_id})
    return Organization(**doc)


@router.post("/{admin_id}/site-code/regenerate", response_model=Organization)
async def regenerate_site_code(admin_id: str):
    admin = await _admin(admin_id)
    for _ in range(10):
        code = new_site_code()
        if not await db.organizations.find_one({"site_code": code}):
            await db.organizations.update_one(
                {"id": admin.organization_id}, {"$set": {"site_code": code}}
            )
            break
    doc = await db.organizations.find_one({"id": admin.organization_id})
    return Organization(**doc)


@router.post("/{admin_id}/archive-sweep")
async def archive_sweep(admin_id: str):
    """Manually run the 60-day inactivity data-retention sweep for this organisation."""
    admin = await _admin(admin_id)
    archived = await limits.archive_inactive(admin.organization_id)
    return {"archived": archived, "inactive_days": limits.INACTIVE_DAYS}


@router.post("/{admin_id}/cohorts", response_model=Cohort)
async def create_cohort(admin_id: str, body: dict):
    admin = await _admin(admin_id)
    name = str(body.get("name", "")).strip()
    if not name:
        raise HTTPException(status_code=400, detail="Cohort name is required")
    cohort = Cohort(name=name, organization_id=admin.organization_id, coach_id=body.get("coach_id"))
    await db.cohorts.insert_one(cohort.model_dump())
    return cohort
