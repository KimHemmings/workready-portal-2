import os
from enum import Enum
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException, Depends
from fastapi.responses import HTMLResponse
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

# Root UI Endpoint
@app.get("/", response_class=HTMLResponse)
async def serve_portal_ui():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WorkReady Portal - Multi-Program Platform</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-slate-900 text-white min-h-screen flex flex-col justify-center items-center p-6">
        <div class="max-w-2xl w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl text-center space-y-6">
            <span class="inline-block px-3 py-1 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full text-xs font-semibold tracking-wide uppercase">
                API Version 2.0-Multi-Program
            </span>
            <h1 class="text-3xl font-bold text-slate-100">WorkReady Portal API</h1>
            <p class="text-slate-400 text-sm">
                Unified SaaS platform engine configured for <strong class="text-slate-200">Workforce Australia</strong>, <strong class="text-slate-200">Transition to Work (TtW)</strong>, and <strong class="text-slate-200">Inclusive Employment Australia (IEA)</strong>.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 text-left text-xs">
                <div class="p-3 bg-slate-900 border border-slate-700 rounded-lg">
                    <p class="font-bold text-teal-400 mb-1">Workforce Australia</p>
                    <p class="text-slate-400">PBAS Points & Progress Payments Engine</p>
                </div>
                <div class="p-3 bg-slate-900 border border-slate-700 rounded-lg">
                    <p class="font-bold text-amber-400 mb-1">Transition to Work</p>
                    <p class="text-slate-400">Youth Pathways & TAFE Education Logs</p>
                </div>
                <div class="p-3 bg-slate-900 border border-slate-700 rounded-lg">
                    <p class="font-bold text-indigo-400 mb-1">Inclusive Employment</p>
                    <p class="text-slate-400">Capacity Hours & Workplace Adjustments</p>
                </div>
            </div>
            <div class="pt-4 border-t border-slate-700 flex justify-center gap-4 text-xs font-medium text-slate-400">
                <a href="/api/health" class="hover:text-teal-400 transition-colors">/api/health</a>
                <span>•</span>
                <a href="/docs" class="hover:text-teal-400 transition-colors">/docs (Interactive Swagger)</a>
            </div>
        </div>
    </body>
    </html>
    """

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