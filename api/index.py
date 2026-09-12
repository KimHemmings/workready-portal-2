import os
from enum import Enum
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from openai import OpenAI
from supabase import create_client, Client

app = FastAPI(title="WorkReady Portal Multi-Program API")

# Helper functions for safe environment variable loading
def get_openai_client() -> OpenAI:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY environment variable is not set.")
    return OpenAI(api_key=api_key)

def get_supabase_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="SUPABASE_URL or SUPABASE_KEY environment variables are not set.")
    return create_client(url, key)

class ProgramType(str, Enum):
    WORKFORCE_AUSTRALIA = "WORKFORCE_AUSTRALIA"
    TTW = "TTW"
    INCLUSIVE_EMPLOYMENT = "INCLUSIVE_EMPLOYMENT"

PROGRAM_FEATURE_DEFAULTS: Dict[ProgramType, Dict[str, bool]] = {
    ProgramType.WORKFORCE_AUSTRALIA: {
        "pbas_enabled": True, 
        "education_tracking": False, 
        "workplace_adjustments": False, 
        "wcag_accessible_ui": False
    },
    ProgramType.TTW: {
        "pbas_enabled": False, 
        "education_tracking": True, 
        "workplace_adjustments": False, 
        "wcag_accessible_ui": False
    },
    ProgramType.INCLUSIVE_EMPLOYMENT: {
        "pbas_enabled": False, 
        "education_tracking": True, 
        "workplace_adjustments": True, 
        "wcag_accessible_ui": True
    }
}

PROGRAM_AI_PROMPTS: Dict[ProgramType, str] = {
    ProgramType.WORKFORCE_AUSTRALIA: (
        "You are an encouraging, pragmatic AI interview coach for an Australian Workforce Australia jobseeker. "
        "Focus on practical work experience, addressing employment gaps, and building confidence for immediate hiring."
    ),
    ProgramType.TTW: (
        "You are an engaging youth career mentor for a 15-24 year old in Australia (Transition to Work program). "
        "Use supportive, clear language. Focus on entry-level roles, soft skills, or TAFE courses."
    ),
    ProgramType.INCLUSIVE_EMPLOYMENT: (
        "You are an empathetic, highly structured AI career coach for candidates with varied abilities (Inclusive Employment Australia). "
        "Keep questions short, direct, and accessible. Focus on strengths, comfortable routines, and required workplace adjustments."
    )
}

# Request Data Schemas
class ProvisionProviderRequest(BaseModel):
    provider_name: str
    program_type: ProgramType
    seat_capacity: int = 100

class InviteLearnerRequest(BaseModel):
    provider_id: str
    first_name: str
    last_name: str
    assessed_capacity_hours: Optional[int] = 30
    active_pathway: Optional[str] = "Employment"

class MockInterviewRequest(BaseModel):
    learner_id: str
    job_title: str
    program_type: ProgramType = ProgramType.WORKFORCE_AUSTRALIA

class LogEvidenceRequest(BaseModel):
    learner_id: str
    category: str
    hours_logged: Optional[float] = 0.0
    proof_file_url: Optional[str] = None

# Root Route - Serves the index.html frontend file
@app.get("/", response_class=HTMLResponse)
async def serve_portal_ui():
    index_path = os.path.join(os.path.dirname(__file__), "..", "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return f.read()
    return "<h1>WorkReady Portal Engine Live</h1><p>Visit <a href='/docs'>/docs</a> for Swagger UI.</p>"

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "2.0-multi-program"}

# Live Supabase Database Endpoints

@app.post("/api/admin/provision-provider")
async def provision_provider(req: ProvisionProviderRequest):
    supabase = get_supabase_client()
    flags = PROGRAM_FEATURE_DEFAULTS.get(req.program_type, {})
    
    payload = {
        "name": req.provider_name,
        "program_type": req.program_type.value,
        "seat_capacity": req.seat_capacity,
        "feature_flags": flags
    }
    
    try:
        response = supabase.table("providers").insert(payload).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/casemanager/invite-learner")
async def invite_learner(req: InviteLearnerRequest):
    supabase = get_supabase_client()
    
    payload = {
        "provider_id": req.provider_id,
        "first_name": req.first_name,
        "last_name": req.last_name,
        "assessed_capacity_hours": req.assessed_capacity_hours,
        "active_pathway": req.active_pathway
    }
    
    try:
        response = supabase.table("learners").insert(payload).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/evidence/log")
async def log_evidence(req: LogEvidenceRequest):
    supabase = get_supabase_client()
    
    payload = {
        "learner_id": req.learner_id,
        "category": req.category,
        "hours_logged": req.hours_logged,
        "proof_file_url": req.proof_file_url
    }
    
    try:
        response = supabase.table("evidence_logs").insert(payload).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/ai/mock-interview")
async def mock_interview(req: MockInterviewRequest):
    client = get_openai_client()
    system_prompt = PROGRAM_AI_PROMPTS.get(
        req.program_type, 
        PROGRAM_AI_PROMPTS[ProgramType.WORKFORCE_AUSTRALIA]
    )
    
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {
                    "role": "user", 
                    "content": f"Conduct an initial mock interview question for the job role: '{req.job_title}'. Provide 1 question and 1 helpful tip."
                }
            ],
            temperature=0.7,
            max_tokens=250
        )
        ai_message = response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API Error: {str(e)}")

    return {
        "program_type": req.program_type,
        "job_title": req.job_title,
        "ai_response": ai_message
    }