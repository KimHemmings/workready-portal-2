import os
from enum import Enum
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from openai import OpenAI

app = FastAPI(title="WorkReady Portal Multi-Program API")

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
        "Use supportive, clear language. Focus on entry-level roles (retail, hospitality, apprenticeships), soft skills, or TAFE courses."
    ),
    ProgramType.INCLUSIVE_EMPLOYMENT: (
        "You are an empathetic, highly structured AI career coach for candidates with varied abilities (Inclusive Employment Australia). "
        "Keep questions short, direct, and accessible. Focus on strengths, comfortable routines, and required workplace adjustments."
    )
}

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
    language: str = "en"

class MockInterviewRequest(BaseModel):
    learner_id: str
    job_title: str
    program_type: ProgramType = ProgramType.WORKFORCE_AUSTRALIA

class LogEvidenceRequest(BaseModel):
    learner_id: str
    category: str
    hours_logged: Optional[float] = 0.0
    proof_file_url: Optional[str] = None

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "2.0-multi-program"}

@app.post("/api/admin/provision-provider")
async def provision_provider(req: ProvisionProviderRequest):
    flags = PROGRAM_FEATURE_DEFAULTS.get(req.program_type, {})
    return {
        "status": "success",
        "provider_name": req.provider_name,
        "program_type": req.program_type,
        "seat_capacity": req.seat_capacity,
        "feature_flags": flags
    }

@app.post("/api/casemanager/invite-learner")
async def invite_learner(req: InviteLearnerRequest):
    return {
        "status": "success",
        "learner": {
            "first_name": req.first_name,
            "last_name": req.last_name,
            "assessed_capacity_hours": req.assessed_capacity_hours,
            "active_pathway": req.active_pathway,
            "language": req.language
        }
    }

@app.post("/api/ai/mock-interview")
async def mock_interview(req: MockInterviewRequest):
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

@app.post("/api/evidence/log")
async def log_evidence(req: LogEvidenceRequest):
    return {
        "status": "recorded",
        "learner_id": req.learner_id,
        "category": req.category,
        "hours_logged": req.hours_logged,
        "file_attached": bool(req.proof_file_url)
    }

@app.get("/api/casemanager/learners/{learner_id}")
async def get_learner_dashboard(learner_id: str, program_type: ProgramType = ProgramType.WORKFORCE_AUSTRALIA):
    base_data = {
        "learner_id": learner_id,
        "program_type": program_type,
        "name": "Alex Taylor",
        "progress_payment_eligible": True
    }
    
    if program_type == ProgramType.WORKFORCE_AUSTRALIA:
        base_data.update({"pbas_points": 80, "pbas_target": 100, "warning_flag": False})
    elif program_type == ProgramType.TTW:
        base_data.update({"active_pathway": "Cert III Individual Support", "tafe_hours_logged": 45, "streak_days": 12})
    elif program_type == ProgramType.INCLUSIVE_EMPLOYMENT:
        base_data.update({"assessed_capacity_hours": 15, "weekly_hours_logged": 12, "adjustments_logged": 2})
        
    return base_data