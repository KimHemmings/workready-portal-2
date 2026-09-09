"""Sign-in, registration and shared lookup endpoints (no demo mode)."""

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

from lib.db import db
from lib.security import hash_password, new_site_code, verify_password
from models.schemas import Cohort, Organization, TrainingModule, User

router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterRequest(BaseModel):
    name: str = Field(min_length=2)
    organization_name: str = ""
    email: EmailStr
    password: str = Field(min_length=8)
    invite_code: str = ""


def _touch(doc: dict) -> User:
    return User(**doc)


@router.post("/auth/login", response_model=User)
async def login(body: LoginRequest):
    email = body.email.strip().lower()
    doc = await db.users.find_one({"email": email})
    if not doc or not verify_password(body.password, doc.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
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
    return _touch(doc)


@router.post("/auth/register", response_model=User)
async def register(body: RegisterRequest):
    email = str(body.email).strip().lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="An account with that email already exists")

    code = body.invite_code.strip().upper()
    if code:
        org = await db.organizations.find_one({"site_code": code})
        if not org:
            raise HTTPException(status_code=404, detail="That site invite code was not recognised")
    else:
        # No invite code: stand up the person's own site so they can start training straight away.
        org_name = body.organization_name.strip() or f"{body.name.strip().split(' ')[0]}'s Site"
        new_org = Organization(name=org_name, type="School", site_code=new_site_code())
        await db.organizations.insert_one(new_org.model_dump())
        org = new_org.model_dump()

    # Registration always creates a Participant. Coaches and admins are invited by a Provider Admin.
    coach = await db.users.find_one({"organization_id": org["id"], "role": "coach", "status": "active"})
    user = User(
        name=body.name.strip(),
        email=email,
        role="participant",
        organization_id=org["id"],
        coach_id=coach["id"] if coach else None,
        last_login=datetime.now(timezone.utc),
    )
    doc = user.model_dump()
    doc["password_hash"] = hash_password(body.password)
    await db.users.insert_one(doc)
    return user


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
