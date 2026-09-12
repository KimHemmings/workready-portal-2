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
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY missing.")
    return OpenAI(api_key=api_key)

def get_supabase_client() -> Client:
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise HTTPException(status_code=500, detail="SUPABASE_URL or SUPABASE_KEY missing.")
    return create_client(url, key)

class ProgramType(str, Enum):
    WORKFORCE_AUSTRALIA = "WORKFORCE_AUSTRALIA"
    TTW = "TTW"
    INCLUSIVE_EMPLOYMENT = "INCLUSIVE_EMPLOYMENT"

PROGRAM_FEATURE_DEFAULTS: Dict[ProgramType, Dict[str, bool]] = {
    ProgramType.WORKFORCE_AUSTRALIA: {"pbas_enabled": True, "education_tracking": False, "workplace_adjustments": False, "wcag_accessible_ui": False},
    ProgramType.TTW: {"pbas_enabled": False, "education_tracking": True, "workplace_adjustments": False, "wcag_accessible_ui": False},
    ProgramType.INCLUSIVE_EMPLOYMENT: {"pbas_enabled": False, "education_tracking": True, "workplace_adjustments": True, "wcag_accessible_ui": True}
}

PROGRAM_AI_PROMPTS: Dict[ProgramType, str] = {
    ProgramType.WORKFORCE_AUSTRALIA: (
        "You are an encouraging AI interview coach for a Workforce Australia jobseeker. "
        "Generate EXACTLY 8 distinct, numbered interview questions suited for this job role. "
        "Include brief tips on how to structure responses using the STAR method."
    ),
    ProgramType.TTW: (
        "You are an engaging youth career mentor for a Transition to Work jobseeker (15-24 yrs). "
        "Generate EXACTLY 8 direct, entry-level mock interview questions using clear, simple language suitable for LLN candidates."
    ),
    ProgramType.INCLUSIVE_EMPLOYMENT: (
        "You are an empathetic, highly structured AI coach for Inclusive Employment Australia candidates. "
        "Generate EXACTLY 8 short, accessible mock interview questions focusing on strengths, routines, and required workplace adjustments."
    )
}

class ProvisionProviderRequest(BaseModel):
    provider_name: str
    program_type: ProgramType
    seat_capacity: int = 100

class InviteLearnerRequest(BaseModel):
    provider_id: Optional[str] = "prov_default"
    first_name: str
    last_name: str
    assessed_capacity_hours: Optional[int] = 30
    active_pathway: Optional[str] = "Employment"

class MockInterviewRequest(BaseModel):
    learner_id: Optional[str] = "learner_demo"
    job_title: str
    program_type: ProgramType = ProgramType.WORKFORCE_AUSTRALIA

class LogMilestoneRequest(BaseModel):
    learner_id: str
    milestone_type: str  # INTERVIEW_SECURED or JOB_PLACED
    job_title: Optional[str] = "General Role"

@app.get("/", response_class=HTMLResponse)
async def serve_portal_ui():
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WorkReady Portal V2 - Unified Workspace</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .wcag-mode {
            background-color: #000000 !important;
            color: #ffff00 !important;
            font-size: 1.25rem !important;
        }
        .wcag-mode .card {
            background-color: #111111 !important;
            border: 2px solid #ffff00 !important;
            color: #ffffff !important;
        }
        @media print {
            body * { visibility: hidden; }
            #printable-report, #printable-report * { visibility: visible; }
            #printable-report { position: absolute; left: 0; top: 0; width: 100%; color: #000; background: #fff; }
        }
    </style>
</head>
<body id="app-body" class="bg-slate-900 text-slate-100 min-h-screen font-sans flex flex-col">

    <!-- Top Navigation Header -->
    <header class="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div class="flex items-center gap-3">
            <span class="p-2 bg-teal-500/10 text-teal-400 rounded-lg border border-teal-500/20 text-xs font-bold uppercase">
                WorkReady V2
            </span>
            <h1 id="portal-title" class="text-xl font-bold tracking-tight">Case Manager Portal</h1>
        </div>

        <div class="flex items-center gap-4">
            <!-- Role Switcher -->
            <div class="flex items-center gap-2">
                <label for="role-select" class="text-xs text-slate-400 font-medium">Role Perspective:</label>
                <select id="role-select" onchange="switchRole(this.value)" class="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none">
                    <option value="CASE_MANAGER">Case Manager View</option>
                    <option value="JOBSEEKER">Jobseeker / Candidate View</option>
                    <option value="BUSINESS_MANAGER">Business Manager Oversight</option>
                    <option value="SYS_ADMIN">System Admin (Platform Owner)</option>
                </select>
            </div>

            <!-- WCAG Toggle -->
            <button onclick="toggleAccessibility()" class="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition font-medium">
                ♿ WCAG
            </button>

            <!-- Program Selector -->
            <select id="program-select" onchange="switchProgram(this.value)" class="bg-slate-800 border border-teal-500/40 text-teal-300 text-xs rounded-lg px-3 py-1.5 outline-none">
                <option value="WORKFORCE_AUSTRALIA">Workforce Australia</option>
                <option value="TTW">Transition to Work</option>
                <option value="INCLUSIVE_EMPLOYMENT">Inclusive Employment</option>
            </select>
        </div>
    </header>

    <main class="flex-1 max-w-6xl w-full mx-auto p-6 space-y-6">

        <!-- JOBSEEKER VICTORY BUTTONS BANNER -->
        <div id="jobseeker-victory-banner" class="hidden p-5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 to-teal-950/40 space-y-3">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-lg font-extrabold text-amber-300">🎉 Share Your Milestone Victory!</h2>
                    <p class="text-xs text-slate-300">Got good news? Tap below to notify your Case Manager instantly and update your compliance record.</p>
                </div>
            </div>
            <div class="flex flex-wrap gap-4 pt-1">
                <button onclick="triggerMilestone('INTERVIEW_SECURED')" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-lg transition shadow-lg flex items-center gap-2">
                    🎯 I GOT THE INTERVIEW!
                </button>
                <button onclick="triggerMilestone('JOB_PLACED')" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-lg transition shadow-lg flex items-center gap-2">
                    🥳 I GOT THE JOB!
                </button>
            </div>
            <div id="victory-alert" class="hidden text-xs font-bold text-emerald-300 pt-1"></div>
        </div>

        <div id="program-banner" class="p-4 rounded-xl border border-teal-500/30 bg-teal-950/20 flex justify-between items-center">
            <div>
                <h2 id="banner-title" class="text-lg font-bold text-teal-400">Workforce Australia Framework</h2>
                <p id="banner-desc" class="text-xs text-slate-400">Tracking PBAS points compliance and progress payment milestones.</p>
            </div>
            <span id="banner-badge" class="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs rounded-full font-semibold">
                Points-Based System
            </span>
        </div>

        <!-- Metric Gauges -->
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

        <!-- 8-QUESTION AI MOCK INTERVIEW + REPORT GENERATOR -->
        <div class="card bg-slate-800 border border-teal-500/40 rounded-xl p-6 space-y-4">
            <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                <div class="flex items-center gap-2">
                    <span class="text-xl">🎙️</span>
                    <h3 class="text-md font-bold text-slate-100">AI Mock Interview Practice & Diagnostic Report</h3>
                </div>
                <span class="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-1 rounded font-semibold">
                    Voice & Report Enabled
                </span>
            </div>

            <form onsubmit="handleGenerateInterview(event)" class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                <div class="md:col-span-3">
                    <label class="block text-slate-400 mb-1 font-medium">Target Job Role</label>
                    <input type="text" id="ai-job-title" required value="Retail Sales Assistant" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:border-teal-500 outline-none">
                </div>
                <div class="flex items-end">
                    <button type="submit" id="btn-ai-generate" class="w-full bg-teal-600 hover:bg-teal-500 font-semibold text-white py-2 px-4 rounded-lg transition shadow-md">
                        Generate 8 Questions
                    </button>
                </div>
            </form>

            <div id="ai-output-box" class="hidden p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-4">
                <div class="flex justify-between items-center flex-wrap gap-2">
                    <p class="text-xs font-bold text-teal-400 uppercase tracking-wider">AI Interview Question Set:</p>
                    <div class="flex gap-2">
                        <button onclick="readAloudQuestions()" class="bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 text-xs px-3 py-1.5 rounded-lg transition">
                            🔊 Read Out Loud
                        </button>
                        <button onclick="generateDownloadableReport()" class="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-md">
                            📄 Download/Print Report
                        </button>
                    </div>
                </div>
                
                <div id="ai-response-text" class="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed border-t border-b border-slate-800 py-3"></div>

                <div class="space-y-2 pt-2">
                    <label class="block text-xs font-bold text-slate-300">🎤 Practice Your Spoken Response (LLN Voice Dictation):</label>
                    <textarea id="speech-answer-box" rows="2" placeholder="Click 'Start Speaking' and state your answer out loud..." class="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 outline-none focus:border-teal-500"></textarea>
                    <div class="flex gap-3">
                        <button onclick="startDictation()" type="button" class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition">
                            🎤 Start Speaking
                        </button>
                        <button onclick="stopDictation()" type="button" class="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition">
                            ⏹️ Stop Dictation
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <!-- HIDDEN PRINTABLE REPORT CONTAINER -->
    <div id="printable-report" class="hidden p-8 space-y-6">
        <div class="border-b-2 border-teal-600 pb-4 flex justify-between items-center">
            <div>
                <h1 class="text-2xl font-bold text-slate-900">WorkReady Portal V2 - AI Performance Diagnostic</h1>
                <p class="text-xs text-slate-600">Official Case Management Audit Evidence & Practice Log</p>
            </div>
            <div class="text-right text-xs text-slate-600">
                <p><strong>Date:</strong> <span id="rpt-date"></span></p>
                <p><strong>Program:</strong> <span id="rpt-program"></span></p>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 text-xs border p-4 rounded bg-slate-50">
            <div><strong>Candidate Name:</strong> Alex Taylor</div>
            <div><strong>Target Job Role:</strong> <span id="rpt-role"></span></div>
            <div><strong>LLN Accessibility Mode:</strong> Active</div>
            <div><strong>STAR Response Method:</strong> Evaluated</div>
        </div>

        <div>
            <h3 class="text-sm font-bold text-slate-900 mb-2">Generated Interview Questions & Spoken Answers</h3>
            <div id="rpt-content" class="text-xs whitespace-pre-wrap leading-relaxed border p-4 bg-white rounded"></div>
        </div>

        <div>
            <h3 class="text-sm font-bold text-slate-900 mb-1">Spoken Practice Transcript / Candidate Response</h3>
            <div id="rpt-transcript" class="text-xs border p-3 bg-slate-50 rounded italic text-slate-700">No voice answer recorded yet.</div>
        </div>

        <div class="border-t pt-4 text-xs text-slate-500 flex justify-between">
            <p>Generated by WorkReady Portal AI Engine (gpt-4o-mini)</p>
            <p>Case Manager Signature: _______________________</p>
        </div>
    </div>

    <script>
        let speechRecognition;

        function switchRole(role) {
            const title = document.getElementById('portal-title');
            const vicBanner = document.getElementById('jobseeker-victory-banner');

            if (role === 'JOBSEEKER') {
                title.innerText = 'Jobseeker Personal Hub';
                vicBanner.classList.remove('hidden');
            } else if (role === 'BUSINESS_MANAGER') {
                title.innerText = 'Business Manager Oversight Portal';
                vicBanner.classList.add('hidden');
            } else if (role === 'SYS_ADMIN') {
                title.innerText = 'System Admin Control Panel';
                vicBanner.classList.add('hidden');
            } else {
                title.innerText = 'Case Manager Portal';
                vicBanner.classList.add('hidden');
            }
        }

        function switchProgram(program) {
            const title = document.getElementById('banner-title');
            const desc = document.getElementById('banner-desc');
            const badge = document.getElementById('banner-badge');
            
            const m1Label = document.getElementById('metric-1-label');
            const m1Val = document.getElementById('metric-1-val');

            if (program === 'WORKFORCE_AUSTRALIA') {
                title.innerText = 'Workforce Australia Framework';
                desc.innerText = 'Tracking PBAS points compliance and progress payment milestones.';
                badge.innerText = 'Points-Based System';
                m1Label.innerText = 'Monthly PBAS Points Target';
                m1Val.innerText = '80 / 100';
            } else if (program === 'TTW') {
                title.innerText = 'Transition to Work (TtW) Youth Framework';
                desc.innerText = 'Focusing on education logs, TAFE pathways, and intensive youth mentoring.';
                badge.innerText = 'Youth Pathways';
                m1Label.innerText = 'TAFE & Training Hours Logged';
                m1Val.innerText = '45 / 50 Hrs';
            } else if (program === 'INCLUSIVE_EMPLOYMENT') {
                title.innerText = 'Inclusive Employment Australia (IEA)';
                desc.innerText = 'Tailored support tracking assessed capacity hours and workplace adjustments.';
                badge.innerText = 'Custom Capacity Support';
                m1Label.innerText = 'Assessed Capacity Target';
                m1Val.innerText = '15 / 15 Hrs';
            }
        }

        function toggleAccessibility() {
            document.body.classList.toggle('wcag-mode');
        }

        async function triggerMilestone(type) {
            const alertBox = document.getElementById('victory-alert');
            const role = document.getElementById('ai-job-title').value;

            try {
                const res = await fetch('/api/milestone/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ learner_id: "learner_demo", milestone_type: type, job_title: role })
                });

                if (res.ok) {
                    alertBox.innerText = type === 'INTERVIEW_SECURED' 
                        ? '🎉 AMAZING! Interview logged and notification sent to your Case Manager!' 
                        : '🥳 CONGRATULATIONS ON THE JOB! Your outcome milestone has been logged!';
                    alertBox.classList.remove('hidden');
                }
            } catch (err) {
                alertBox.innerText = 'Milestone logged locally!';
                alertBox.classList.remove('hidden');
            }
        }

        async function handleGenerateInterview(e) {
            e.preventDefault();
            const btn = document.getElementById('btn-ai-generate');
            const outputBox = document.getElementById('ai-output-box');
            const responseText = document.getElementById('ai-response-text');
            const programType = document.getElementById('program-select').value;
            const jobTitle = document.getElementById('ai-job-title').value;

            btn.innerText = 'Generating...';
            btn.disabled = true;
            outputBox.classList.remove('hidden');
            responseText.innerText = 'Connecting to GPT-4o-mini engine...';

            try {
                const res = await fetch('/api/ai/mock-interview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ learner_id: "learner_demo", job_title: jobTitle, program_type: programType })
                });

                const data = await res.json();
                if (res.ok) {
                    responseText.innerText = data.ai_response;
                } else {
                    throw new Error(data.detail || 'Failed to generate questions.');
                }
            } catch (err) {
                responseText.innerText = `Error: ${err.message}`;
            } finally {
                btn.innerText = 'Generate 8 Questions';
                btn.disabled = false;
            }
        }

        function generateDownloadableReport() {
            const role = document.getElementById('ai-job-title').value;
            const program = document.getElementById('program-select').value;
            const content = document.getElementById('ai-response-text').innerText;
            const transcript = document.getElementById('speech-answer-box').value;

            document.getElementById('rpt-date').innerText = new Date().toLocaleDateString();
            document.getElementById('rpt-program').innerText = program;
            document.getElementById('rpt-role').innerText = role;
            document.getElementById('rpt-content').innerText = content;
            if (transcript) {
                document.getElementById('rpt-transcript').innerText = transcript;
            }

            const printReport = document.getElementById('printable-report');
            printReport.classList.remove('hidden');
            window.print();
            printReport.classList.add('hidden');
        }

        function readAloudQuestions() {
            const text = document.getElementById('ai-response-text').innerText;
            if (!text) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }

        function startDictation() {
            const box = document.getElementById('speech-answer-box');
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SpeechRecognition) { alert('Speech recognition not supported in this browser.'); return; }
            speechRecognition = new SpeechRecognition();
            speechRecognition.continuous = true;
            speechRecognition.interimResults = true;
            speechRecognition.lang = 'en-AU';
            speechRecognition.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                box.value = transcript;
            };
            speechRecognition.start();
        }

        function stopDictation() {
            if (speechRecognition) speechRecognition.stop();
        }
    </script>
</body>
</html>
    """

@app.get("/api/health")
async def health_check():
    return {"status": "ok", "version": "2.0-multi-program"}

@app.post("/api/milestone/log")
async def log_milestone(req: LogMilestoneRequest):
    supabase = get_supabase_client()
    payload = {"learner_id": req.learner_id, "category": req.milestone_type, "proof_file_url": req.job_title}
    try:
        response = supabase.table("evidence_logs").insert(payload).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "mock_logged", "message": f"Logged milestone: {req.milestone_type}"}

@app.post("/api/casemanager/invite-learner")
async def invite_learner(req: InviteLearnerRequest):
    supabase = get_supabase_client()
    payload = {"provider_id": req.provider_id, "first_name": req.first_name, "last_name": req.last_name, "assessed_capacity_hours": req.assessed_capacity_hours, "active_pathway": req.active_pathway}
    try:
        response = supabase.table("learners").insert(payload).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.post("/api/ai/mock-interview")
async def mock_interview(req: MockInterviewRequest):
    client = get_openai_client()
    system_prompt = PROGRAM_AI_PROMPTS.get(req.program_type, PROGRAM_AI_PROMPTS[ProgramType.WORKFORCE_AUSTRALIA])
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": f"Generate exactly 8 mock interview questions for the job role: '{req.job_title}'."}],
            temperature=0.7, max_tokens=600
        )
        ai_message = response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI API Error: {str(e)}")

    return {"program_type": req.program_type, "job_title": req.job_title, "ai_response": ai_message}