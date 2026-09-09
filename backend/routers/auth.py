from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from lib.db import db
from models.schemas import Cohort, Organization, TrainingModule, User

router = APIRouter(tags=["auth"])


class LoginRequest(BaseModel):
    email: str


@router.post("/auth/login", response_model=User)
async def login(body: LoginRequest):
    email = body.email.strip().lower()
    doc = await db.users.find_one({"email": email})
    if not doc:
        raise HTTPException(status_code=404, detail="No account found for that email")
    if doc.get("status") != "active":
        raise HTTPException(status_code=403, detail="This account is inactive")
    now = datetime.now(timezone.utc)
    await db.users.update_one({"id": doc["id"]}, {"$set": {"last_login": now}})
    doc["last_login"] = now
    return User(**doc)


@router.get("/auth/demo-accounts", response_model=list[User])
async def demo_accounts():
    docs = await db.users.find({"is_demo": True}).to_list(20)
    return [User(**d) for d in docs]


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
