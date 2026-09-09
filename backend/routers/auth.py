"""Sign-in, magic-link registration, password reset and shared lookups.

There is no public self-registration: accounts exist only because an Owner, Provider Admin or Case
Manager invited them, so every registration goes through a magic invite token.
"""

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from lib.db import db
from lib.security import hash_password, verify_password
from models.schemas import (
    ChangePasswordRequest,
    Cohort,
    CompleteRegistrationRequest,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    InvitePreview,
    Organization,
    TrainingModule,
    User,
)

router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/auth/login", response_model=User)
async def login(body: LoginRequest):
    email = body.email.strip().lower()
    doc = await db.users.find_one({"email": email})
    if not doc or not verify_password(body.password, doc.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if doc.get("status") == "pending":
        raise HTTPException(
            status_code=403,
            detail="Your account setup isn't finished — open the invite link you were given to set a password.",
        )
    if doc.get("status") == "archived":
        raise HTTPException(
            status_code=403,
            detail="This account was archived after 60 days of inactivity. Ask your provider to reactivate it.",
        )
    if doc.get("status") != "active":
        raise HTTPException(status_code=403, detail="This account is inactive")
    now = datetime.now(timezone.utc)
    await db.users.update_one({"id": doc["id"]}, {"$set": {"last_login": now}})
    doc["last_login"] = now
    return User(**doc)


@router.get("/auth/invites/{token}", response_model=InvitePreview)
async def invite_preview(token: str):
    """Details shown on the Complete Registration screen — role and site are locked in here."""
    doc = await db.users.find_one({"invite_token": token})
    if not doc:
        raise HTTPException(status_code=404, detail="That invite link is not valid or has been used")
    org = await db.organizations.find_one({"id": doc["organization_id"]}) or {}
    return InvitePreview(
        email=doc["email"],
        name=doc["name"],
        role=doc["role"],
        organization_name=org.get("name", ""),
        organization_logo=org.get("branding_logo", "") or "",
        already_completed=doc.get("status") == "active",
    )


@router.post("/auth/invites/{token}/complete", response_model=User)
async def complete_registration(token: str, body: CompleteRegistrationRequest):
    doc = await db.users.find_one({"invite_token": token})
    if not doc:
        raise HTTPException(status_code=404, detail="That invite link is not valid or has been used")
    now = datetime.now(timezone.utc)
    updates = {
        "password_hash": hash_password(body.password),
        "status": "active",
        "must_change_password": False,
        "invite_token": None,
        "last_login": now,
    }
    await db.users.update_one({"id": doc["id"]}, {"$set": updates})
    doc.update(updates)
    return User(**doc)


@router.post("/auth/forgot-password", response_model=ForgotPasswordResponse)
async def forgot_password(body: ForgotPasswordRequest):
    """Points the person at whoever can issue them a temporary password (no email sending)."""
    email = body.email.strip().lower()
    doc = await db.users.find_one({"email": email})
    generic = ForgotPasswordResponse(
        message=(
            "If that email is registered, your Case Manager or Provider Admin can issue a temporary "
            "password straight away. Please contact them to have your access restored."
        )
    )
    if not doc:
        return generic

    contact = None
    if doc.get("role") == "participant" and doc.get("coach_id"):
        contact = await db.users.find_one({"id": doc["coach_id"]})
    if not contact:
        contact = await db.users.find_one(
            {"organization_id": doc["organization_id"], "role": "admin", "status": "active"}
        )
    if not contact:
        return generic
    return ForgotPasswordResponse(
        message=(
            f"{contact['name']} can reset your password from the user roster and hand you a temporary "
            "password. You'll be asked to choose a new one as soon as you sign in."
        ),
        contact_name=contact["name"],
        contact_email=contact["email"],
    )


@router.post("/auth/change-password", response_model=User)
async def change_password(body: ChangePasswordRequest):
    doc = await db.users.find_one({"id": body.user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(body.current_password, doc.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Your current password is incorrect")
    if body.current_password == body.new_password:
        raise HTTPException(status_code=400, detail="Please choose a different password")
    updates = {"password_hash": hash_password(body.new_password), "must_change_password": False}
    await db.users.update_one({"id": doc["id"]}, {"$set": updates})
    doc.update(updates)
    return User(**doc)


@router.get("/users/{user_id}", response_model=User)
async def get_user(user_id: str):
    doc = await db.users.find_one({"id": user_id})
    if not doc:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**doc)


@router.get("/organizations/{org_id}", response_model=Organization)
async def get_org(org_id: str):
    doc = await db.organizations.find_one({"id": org_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Organisation not found")
    return Organization(**doc)


@router.get("/modules", response_model=list[TrainingModule])
async def list_modules():
    docs = await db.training_modules.find().sort("order", 1).to_list(200)
    return [TrainingModule(**d) for d in docs]


@router.get("/cohorts", response_model=list[Cohort])
async def list_cohorts(organization_id: str):
    docs = await db.cohorts.find({"organization_id": organization_id}).to_list(100)
    return [Cohort(**d) for d in docs]
