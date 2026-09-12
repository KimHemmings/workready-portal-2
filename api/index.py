import os
from enum import Enum
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from openai import OpenAI
from supabase import create_client, Client

app = FastAPI(title="WorkReady Portal Multi-Program API")

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

@app.get("/", response_class=HTMLResponse)
async def serve_portal_ui():
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WorkReady Portal V2 - Case Manager Workspace</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .wcag-mode {
            background-color: #000000 !important;
            color: #ffff00 !important;
            font-size: 1.15rem !important;
        }
        .wcag-mode .card {
            background-color: #111111 !important;
            border: 2px solid #ffff00 !important;
            color: #ffffff !important;
        }
    </style>
</head>
<body id="app-body" class="bg-slate-900 text-slate-100 min-h-screen font-sans flex flex-col">

    <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div class="flex items-center gap-3">
            <span class="p-2 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20 text-xs font-bold uppercase">
                WorkReady V2
            </span>
            <h1 class="text-xl font-bold tracking-tight">Case Manager Portal</h1>
        </div>

        <div class="flex items-center gap-4">
            <button onclick="toggleAccessibility()" class="text-xs px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition font-medium flex items-center gap-2">
                ♿ WCAG High Contrast
            </button>

            <div class="flex items-center gap-2">
                <label for="program-select" class="text-xs text-slate-400 font-medium">Active Program:</label>
                <select id="program-select" onchange="switchProgram(this.value)" class="bg-slate-800 border border-teal-500/40 text-teal-300 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 outline-none">
                    <option value="WORKFORCE_AUSTRALIA">Workforce Australia (PBAS)</option>
                    <option value="TTW">Transition to Work (Youth Pathways)</option>
                    <option value="INCLUSIVE_EMPLOYMENT">Inclusive Employment (IEA)</option>
                </select>
            </div>
        </div>
    </header>

    <main class="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">

        <div id="program-banner" class="p-4 rounded-xl border border-teal-500/30 bg-teal-950/20 flex justify-between items-center">
            <div>
                <h2 id="banner-title" class="text-lg font-bold text-teal-400">Workforce Australia Framework</h2>
                <p id="banner-desc" class="text-xs text-slate-400">Tracking PBAS points compliance and progress payment milestones.</p>
            </div>
            <span id="banner-badge" class="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs rounded-full font-semibold">
                Points-Based System
            </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div class="card bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-2">
                <p id="metric-1-label" class="text-xs text-slate-400 font-medium">Monthly PBAS Points Target</p>
                <div class="flex items-baseline justify-between">
                    <span id="metric-1-val" class="text-3xl font-extrabold text-white">80 / 100</span>
                    <span id="metric-1-sub" class="text-xs text-emerald-400 font-medium">80% Met</span>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-2">
                    <div id="metric-1-progress" class="bg-teal-400 h-2 rounded-full" style="width: 80%"></div>
                </div>
            </div>

            <div class="card bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-2">
                <p id="metric-2-label" class="text-xs text-slate-400 font-medium">Active Learner Roster</p>
                <div class="flex items-baseline justify-between">
                    <span id="metric-2-val" class="text-3xl font-extrabold text-white">124</span>
                    <span id="metric-2-sub" class="text-xs text-teal-400 font-medium">Capacity: 150</span>
                </div>
                <p class="text-xs text-slate-400">Current provider seat quota utilisation.</p>
            </div>

            <div class="card bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-2">
                <p id="metric-3-label" class="text-xs text-slate-400 font-medium">Outcome Claim Eligibility</p>
                <div class="flex items-baseline justify-between">
                    <span id="metric-3-val" class="text-3xl font-extrabold text-white">18 Learners</span>
                    <span id="metric-3-sub" class="text-xs text-amber-400 font-medium">Pending Audit</span>
                </div>
                <p class="text-xs text-slate-400">12-week & 26-week employment tracking.</p>
            </div>
        </div>

        <div class="card bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 flex justify-between items-center text-xs text-slate-400">
            <span>Unified API Platform Engine Live</span>
            <div class="flex gap-4 font-medium">
                <a href="/api/health" target="_blank" class="text-teal-400 hover:underline">/api/health</a>
                <span>•</span>
                <a href="/docs" target="_blank" class="text-teal-400 hover:underline">/docs (Interactive Swagger)</a>
            </div>
        </div>

    </main>

    <script>
        function switchProgram(program) {
            const body = document.getElementById('app-body');
            const title = document.getElementById('banner-title');
            const desc = document.getElementById('banner-desc');
            const badge = document.getElementById('banner-badge');
            
            const m1Label = document.getElementById('metric-1-label');
            const m1Val = document.getElementById('metric-1-val');
            const m1Sub = document.getElementById('metric-1-sub');
            const m1Progress = document.getElementById('metric-1-progress');

            if (program === 'WORKFORCE_AUSTRALIA') {
                title.innerText = 'Workforce Australia Framework';
                desc.innerText = 'Tracking PBAS points compliance and progress payment milestones.';
                badge.innerText = 'Points-Based System';
                m1Label.innerText = 'Monthly PBAS Points Target';
                m1Val.innerText = '80 / 100';
                m1Sub.innerText = '80% Met';
                m1Progress.style.width = '80%';
            } else if (program === 'TTW') {
                title.innerText = 'Transition to Work (TtW) Youth Framework';
                desc.innerText = 'Focusing on education logs, TAFE pathways, and intensive youth mentoring.';
                badge.innerText = 'Youth Pathways';
                m1Label.innerText = 'TAFE & Training Hours Logged';
                m1Val.innerText = '45 / 50 Hrs';
                m1Sub.innerText = '90% Progress';
                m1Progress.style.width = '90%';
            } else if (program === 'INCLUSIVE_EMPLOYMENT') {
                title.innerText = 'Inclusive Employment Australia (IEA)';
                desc.innerText = 'Tailored support tracking assessed capacity hours and workplace adjustments.';
                badge.innerText = 'Custom Capacity Support';
                m1Label.innerText = 'Assessed Capacity Target';
                m1Val.innerText = '15 / 15 Hrs';
                m1Sub.innerText = '100% Compliant';
                m1Progress.style.width = '100%';
            }
        }

        function toggleAccessibility() {
            document.body.classList.toggle('wcag-mode');
        }
    </script>
</body>
</html>
    """

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "2.0-multi-program"}

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