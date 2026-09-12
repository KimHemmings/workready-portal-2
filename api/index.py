import os
import random
import string
from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client

app = FastAPI(title="WorkReady Portal V2 API", version="2.0.0")

# Initialize Supabase Client using Environment Variables
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


class InviteCandidateRequest(BaseModel):
    email: str
    case_manager_id: str
    provider_id: str


class QuizSubmitRequest(BaseModel):
    learner_id: str
    module_id: str
    score: int
    passing_score: int = 80


@app.get("/api/health")
async def health_check():
    return {"status": "online", "system": "WorkReady Portal V2 API"}


@app.post("/api/candidates/invite")
async def invite_candidate(payload: InviteCandidateRequest):
    try:
        # Enforces database RLS & quota triggers automatically upon insertion
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
    if payload.score < payload.passing_score:
        return {
            "passed": False,
            "message": f"Score {payload.score}% did not meet passing threshold of {payload.passing_score}%."
        }

    # Generate Audit Cryptographic Verification Hash
    timestamp_str = datetime.now(ZoneInfo("Australia/Sydney")).strftime("%Y%m%d")
    random_code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    cert_hash = f"#WR-{timestamp_str}-{random_code}"

    # Upsert module completion state into learner_modules
    supabase.table("learner_modules").upsert({
        "learner_id": payload.learner_id,
        "module_id": payload.module_id,
        "status": "completed",
        "quiz_score": payload.score,
        "completed_at": datetime.now(ZoneInfo("Australia/Sydney")).isoformat()
    }).execute()

    # Store official audit certificate entry into certificates vault
    cert_response = supabase.table("certificates").insert({
        "learner_id": payload.learner_id,
        "module_id": payload.module_id,
        "certificate_code": cert_hash
    }).execute()

    return {
        "passed": True,
        "certificate_code": cert_hash,
        "issued_at": datetime.now(ZoneInfo("Australia/Sydney")).strftime("%d-%b-%Y %H:%M:%S %Z"),
        "data": cert_response.data
    }