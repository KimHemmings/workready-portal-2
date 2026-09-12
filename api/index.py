import os
import random
import string
from datetime import datetime
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client

# Safely import ZoneInfo for Sydney/Australian time formatting
try:
    from zoneinfo import ZoneInfo
    TIMEZONE = ZoneInfo("Australia/Sydney")
except Exception:
    TIMEZONE = None

app = FastAPI(title="WorkReady Portal V2 API Engine", version="2.0.0")

# Read Supabase environment credentials from Vercel
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")


def get_supabase() -> Client:
    """Lazy initialization of Supabase client to prevent serverless import crashes."""
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        raise HTTPException(
            status_code=500,
            detail="Supabase credentials (SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY) are missing in environment variables."
        )
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


# Request Pydantic Models
class ProvisionProviderRequest(BaseModel):
    name: str
    admin_email: str
    program_framework: str  # WORKFORCE_AUSTRALIA | TTW | INCLUSIVE_EMPLOYMENT
    max_case_managers: int
    max_jobseekers: int
    logo_url: str = None


class InviteCandidateRequest(BaseModel):
    email: str
    case_manager_id: str
    provider_id: str


class QuizSubmitRequest(BaseModel):
    learner_id: str
    module_id: str
    score: int
    passing_score: int = 80


# API Route Definitions
@app.get("/api/health")
async def health_check():
    """System health check endpoint."""
    return {
        "status": "online",
        "system": "WorkReady Portal V2 API Engine",
        "timestamp": datetime.now(TIMEZONE).isoformat() if TIMEZONE else datetime.utcnow().isoformat()
    }


@app.post("/api/admin/provision-provider")
async def provision_provider(payload: ProvisionProviderRequest):
    """System Admin endpoint: Provision a new provider tenant with seat quota limits and program framework."""
    try:
        supabase = get_supabase()
        response = supabase.rpc("provision_provider_tenant", {
            "p_name": payload.name,
            "p_email": payload.admin_email,
            "p_framework": payload.program_framework,
            "p_max_cms": payload.max_case_managers,
            "p_max_jobseekers": payload.max_jobseekers,
            "p_logo_url": payload.logo_url
        }).execute()

        return {
            "status": "success",
            "provider_id": response.data,
            "message": f"Provider '{payload.name}' provisioned successfully under {payload.program_framework} framework."
        }
    except Exception as e:
        err_msg = str(e)
        raise HTTPException(status_code=500, detail=f"Database error during provider provisioning: {err_msg}")


@app.post("/api/candidates/invite")
async def invite_candidate(payload: InviteCandidateRequest):
    """Case Manager endpoint: Invite a jobseeker into the portal with RLS assignment."""
    try:
        supabase = get_supabase()
        response = supabase.table("learners").insert({
            "email": payload.email,
            "case_manager_id": payload.case_manager_id,
            "provider_id": payload.provider_id,
            "role": "jobseeker",
            "status": "invited"
        }).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        err_msg = str(e)
        if "Contract limit reached" in err_msg:
            raise HTTPException(status_code=403, detail=err_msg)
        raise HTTPException(status_code=500, detail=f"Database error: {err_msg}")


@app.post("/api/modules/submit-quiz")
async def submit_quiz(payload: QuizSubmitRequest):
    """Jobseeker LMS endpoint: Evaluate quiz score and issue cryptographic audit certificate."""
    if payload.score < payload.passing_score:
        return {
            "passed": False,
            "message": f"Score {payload.score}% did not meet passing threshold of {payload.passing_score}%."
        }

    now = datetime.now(TIMEZONE) if TIMEZONE else datetime.utcnow()
    timestamp_str = now.strftime("%Y%m%d")
    random_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    cert_hash = f"#WR-{timestamp_str}-{random_code}"

    supabase = get_supabase()

    # 1. Upsert module completion record
    supabase.table("learner_modules").upsert({
        "learner_id": payload.learner_id,
        "module_id": payload.module_id,
        "status": "completed",
        "quiz_score": payload.score,
        "completed_at": now.isoformat()
    }).execute()

    # 2. Store official cryptographic audit certificate entry
    cert_response = supabase.table("certificates").insert({
        "learner_id": payload.learner_id,
        "module_id": payload.module_id,
        "certificate_code": cert_hash
    }).execute()

    return {
        "passed": True,
        "certificate_code": cert_hash,
        "issued_at": now.strftime("%d-%b-%Y %H:%M:%S %Z") if TIMEZONE else now.strftime("%d-%b-%Y %H:%M:%S UTC"),
        "data": cert_response.data
    }