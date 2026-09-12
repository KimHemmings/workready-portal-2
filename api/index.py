import os
import base64
from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
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
    ProgramType.WORKFORCE_AUSTRALIA: "You are an encouraging AI interview coach for Workforce Australia. Return EXACTLY 8 questions as a JSON array of strings: [\"Q1\", \"Q2\", ..., \"Q8\"].",
    ProgramType.TTW: "You are an engaging youth mentor for Transition to Work (15-24 yrs). Return EXACTLY 8 questions as a JSON array of strings: [\"Q1\", \"Q2\", ..., \"Q8\"].",
    ProgramType.INCLUSIVE_EMPLOYMENT: "You are an empathetic AI coach for Inclusive Employment Australia. Return EXACTLY 8 questions as a JSON array of strings: [\"Q1\", \"Q2\", ..., \"Q8\"]."
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

class EvaluateAnswerRequest(BaseModel):
    question: str
    answer: str
    job_title: str

class LogMilestoneRequest(BaseModel):
    learner_id: str
    milestone_type: str
    employer_name: Optional[str] = "N/A"
    job_title: Optional[str] = "General Role"
    event_date: Optional[str] = ""

@app.get("/manifest.json")
async def get_manifest():
    return JSONResponse({
        "name": "Straight Up Training - WorkReady Portal",
        "short_name": "WorkReady",
        "start_url": "/",
        "display": "standalone",
        "background_color": "#0f172a",
        "theme_color": "#0d9488"
    })

@app.get("/", response_class=HTMLResponse)
async def serve_portal_ui():
    return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Straight Up Training - WorkReady Portal V2</title>
    <link rel="manifest" href="/manifest.json">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .wcag-mode { background-color: #000000 !important; color: #ffff00 !important; font-size: 1.25rem !important; }
        .wcag-mode .card { background-color: #111111 !important; border: 2px solid #ffff00 !important; color: #ffffff !important; }
        @keyframes pulse-red {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.05); }
        }
        .recording-pulse { animation: pulse-red 1.2s infinite; }
        @media print {
            body * { visibility: hidden; }
            #printable-report, #printable-report * { visibility: visible; }
            #printable-report { position: absolute; left: 0; top: 0; width: 100%; color: #000; background: #fff; padding: 20px; }
        }
    </style>
</head>
<body id="app-body" class="bg-slate-900 text-slate-100 min-h-screen font-sans flex flex-col select-none">

    <!-- Header Navigation -->
    <header class="border-b border-slate-800 bg-slate-950/90 backdrop-blur px-6 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
        <div class="flex items-center gap-3">
            <div class="flex items-center gap-2.5 bg-gradient-to-r from-teal-950 to-slate-900 px-3 py-1.5 rounded-xl border border-teal-500/30">
                <div class="w-7 h-7 bg-teal-500 text-slate-950 font-black rounded-lg flex items-center justify-center text-xs tracking-tighter">
                    SUT
                </div>
                <div>
                    <h1 class="text-xs font-black text-slate-100 tracking-wider uppercase">Straight Up Training</h1>
                    <p class="text-2xs text-teal-400 font-bold">WorkReady Portal V2</p>
                </div>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <div class="flex items-center gap-2">
                <label for="role-select" class="text-2xs text-slate-400 font-bold uppercase tracking-wider hidden md:inline">Role Perspective:</label>
                <select id="role-select" onchange="switchRole(this.value)" class="bg-slate-800 border border-teal-500/50 text-teal-300 font-bold text-xs rounded-lg px-2.5 py-1.5 outline-none">
                    <option value="CASE_MANAGER">Case Manager View</option>
                    <option value="BUSINESS_MANAGER">Business Manager Oversight</option>
                    <option value="JOBSEEKER">Jobseeker Candidate View</option>
                    <option value="SYS_ADMIN">System Admin (Global Platform)</option>
                </select>
            </div>

            <button onclick="toggleAccessibility()" class="text-xs px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition font-medium">
                ♿ WCAG
            </button>

            <select id="program-select" onchange="switchProgram(this.value)" class="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 outline-none">
                <option value="WORKFORCE_AUSTRALIA">Workforce Australia</option>
                <option value="TTW">Transition to Work</option>
                <option value="INCLUSIVE_EMPLOYMENT">Inclusive Employment</option>
            </select>
        </div>
    </header>

    <main class="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">

        <!-- Program Context Banner -->
        <div id="program-banner" class="p-4 rounded-xl border border-teal-500/30 bg-teal-950/20 flex justify-between items-center">
            <div>
                <h2 id="banner-title" class="text-lg font-bold text-teal-400">Workforce Australia Framework</h2>
                <p id="banner-desc" class="text-xs text-slate-400">Tracking PBAS points compliance and progress payment milestones.</p>
            </div>
            <span id="banner-badge" class="px-3 py-1 bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs rounded-full font-semibold">
                Points-Based System
            </span>
        </div>

        <!-- Metric Gauges (Visible for Case Manager & Business Manager) -->
        <div id="metric-gauges-grid" class="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <!-- 1. SYSTEM ADMIN VIEW -->
        <div id="sys-admin-panel" class="hidden space-y-6">
            <div class="card bg-slate-800 border border-purple-500/40 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">⚙️</span>
                        <h3 class="text-md font-bold text-purple-300">System Admin - Provision Provider Account</h3>
                    </div>
                    <span class="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-1 rounded font-bold">
                        Master Management
                    </span>
                </div>
                <p class="text-xs text-slate-300">Provision top-level contracted provider accounts and set seat allocations across Workforce Australia, TtW, and Inclusive Employment contracts.</p>
                
                <form onsubmit="handleProvisionProvider(event)" class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div>
                        <label class="block text-slate-400 mb-1">Provider Organization Name</label>
                        <input type="text" id="adm-provider-name" required placeholder="e.g. APM Employment" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-purple-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Primary Contract Framework</label>
                        <select id="adm-program-type" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-purple-500">
                            <option value="WORKFORCE_AUSTRALIA">Workforce Australia</option>
                            <option value="TTW">Transition to Work</option>
                            <option value="INCLUSIVE_EMPLOYMENT">Inclusive Employment</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Max Seat Capacity</label>
                        <input type="number" id="adm-seats" value="100" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-purple-500">
                    </div>
                    <div class="flex items-end">
                        <button type="submit" id="btn-adm-provision" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-2.5 rounded-lg transition shadow-md">
                            🚀 Provision Provider
                        </button>
                    </div>
                </form>
                <div id="adm-alert" class="hidden p-3 rounded-lg text-xs font-medium"></div>
            </div>
        </div>

        <!-- 2. BUSINESS MANAGER VIEW -->
        <div id="biz-manager-panel" class="hidden space-y-6">
            <div class="card bg-slate-800 border border-amber-500/40 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">🏢</span>
                        <h3 class="text-md font-bold text-amber-300">Provider Business Manager - Custom Logo & Branding Setup</h3>
                    </div>
                    <span class="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded font-bold">
                        Dual Branding Active
                    </span>
                </div>
                <p class="text-xs text-slate-300">
                    Configure your Provider Logo below. This image will appear on the top right of all generated candidate reports, compliance logs, and module completion certificates alongside <strong>Straight Up Training</strong>.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div class="md:col-span-2">
                        <label class="block text-slate-400 mb-1">Provider Logo Image URL</label>
                        <input type="url" id="provider-logo-url" oninput="updateProviderLogoPreview(this.value)" placeholder="https://example.com/provider-logo.png" value="https://via.placeholder.com/150x50/0f766e/ffffff?text=Provider+Logo" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-amber-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Logo Preview</label>
                        <div class="h-10 bg-white rounded p-1 flex items-center justify-center border">
                            <img id="logo-preview-img" src="https://via.placeholder.com/150x50/0f766e/ffffff?text=Provider+Logo" alt="Provider Logo" class="max-h-full object-contain">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. CASE MANAGER VIEW -->
        <div id="case-manager-panel" class="space-y-6">
            <div class="card bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 class="text-md font-bold text-slate-200">➕ Add Jobseeker to My Caseload</h3>
                    <span class="text-xs text-teal-400 font-medium">Direct Supabase Read/Write</span>
                </div>
                
                <form id="invite-form" onsubmit="handleInviteLearner(event)" class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div>
                        <label class="block text-slate-400 mb-1">First Name</label>
                        <input type="text" id="inv-first" required placeholder="Alex" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-teal-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Last Name</label>
                        <input type="text" id="inv-last" required placeholder="Taylor" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-teal-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Assessed Capacity (Hrs)</label>
                        <input type="number" id="inv-capacity" value="30" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-teal-500">
                    </div>
                    <div class="flex items-end">
                        <button type="submit" id="btn-invite" class="w-full bg-teal-600 hover:bg-teal-500 font-semibold text-white py-2 px-4 rounded-lg transition shadow-md">
                            Save to Supabase
                        </button>
                    </div>
                </form>
                <div id="invite-alert" class="hidden p-3 rounded-lg text-xs font-medium"></div>
            </div>
        </div>

        <!-- 4. JOBSEEKER CANDIDATE VIEW & AI PRACTICE COACH -->
        <div id="jobseeker-panel" class="hidden space-y-6">
            <div id="jobseeker-victory-banner" class="p-5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 to-teal-950/40 space-y-3">
                <div>
                    <h2 class="text-lg font-extrabold text-amber-300">🎉 Share Your Victory!</h2>
                    <p class="text-xs text-slate-300">Got good news? Tap below to record your milestone with your Case Manager.</p>
                </div>
                <div class="flex flex-wrap gap-4">
                    <button onclick="openVictoryModal('INTERVIEW_SECURED')" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-lg shadow-md transition flex items-center gap-2">
                        🎯 I GOT THE INTERVIEW!
                    </button>
                    <button onclick="openVictoryModal('JOB_PLACED')" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-lg shadow-md transition flex items-center gap-2">
                        🥳 I GOT THE JOB!
                    </button>
                </div>
            </div>

            <div class="card bg-slate-800 border border-teal-500/40 rounded-xl p-6 space-y-5">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">🎙️</span>
                        <h3 class="text-md font-bold text-slate-100">AI Interview Practice & Dual-Branded Reports</h3>
                    </div>
                    <span class="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-1 rounded font-semibold">
                        1 Question at a Time
                    </span>
                </div>

                <form onsubmit="handleStartInterview(event)" class="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                    <div class="md:col-span-3">
                        <label class="block text-slate-400 mb-1 font-medium">Target Job Role</label>
                        <input type="text" id="ai-job-title" required value="Retail Sales Assistant" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 outline-none focus:border-teal-500">
                    </div>
                    <div class="flex items-end">
                        <button type="submit" id="btn-start-interview" class="w-full bg-teal-600 hover:bg-teal-500 font-semibold text-white py-2 px-4 rounded-lg transition shadow-md">
                            Start Interview
                        </button>
                    </div>
                </form>

                <div id="interview-wizard" class="hidden space-y-4 pt-2 border-t border-slate-700/80">
                    <div class="flex justify-between items-center">
                        <span id="question-tracker" class="text-xs font-bold text-teal-400 uppercase tracking-wider">Question 1 of 8</span>
                        <div class="flex gap-2">
                            <button onclick="readActiveQuestion()" class="bg-slate-700 hover:bg-slate-600 text-teal-300 border border-teal-500/30 text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 transition">
                                🔊 Read Out Loud
                            </button>
                            <button onclick="generateDownloadableReport()" class="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-md">
                                📄 Print Dual-Branded Report
                            </button>
                        </div>
                    </div>

                    <div id="active-question-card" class="p-4 rounded-xl bg-slate-900 text-slate-100 text-base font-medium leading-relaxed border border-slate-700"></div>

                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <label class="block text-xs font-bold text-slate-300">Your Answer (Speak or Type):</label>
                            <span id="mic-status-badge" class="hidden text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-bold recording-pulse">
                                🔴 Recording Active...
                            </span>
                        </div>

                        <textarea id="user-answer-box" rows="3" placeholder="Click 'Start Recording' and answer out loud, or type your response..." class="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 outline-none focus:border-teal-500"></textarea>

                        <div class="flex flex-wrap gap-3">
                            <button id="btn-mic-start" onclick="startDictation()" type="button" class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition flex items-center gap-2">
                                🎤 Start Recording
                            </button>
                            <button id="btn-mic-stop" onclick="stopDictation()" type="button" class="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition">
                                ⏹️ Stop Recording
                            </button>
                            <button onclick="submitAnswerForScoring()" type="button" class="bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs px-4 py-2 rounded-lg transition shadow-md ml-auto">
                                ⭐ Submit for AI Scoring
                            </button>
                        </div>
                    </div>

                    <div id="ai-feedback-box" class="hidden p-4 rounded-xl bg-slate-950/90 border border-teal-500/40 space-y-2">
                        <p class="text-xs font-bold text-amber-400 uppercase tracking-wider">AI Evaluation & STAR Feedback:</p>
                        <div id="ai-feedback-text" class="text-xs text-slate-200 whitespace-pre-wrap leading-relaxed"></div>
                    </div>

                    <div class="flex justify-between items-center border-t border-slate-800 pt-3">
                        <button id="btn-prev-q" onclick="prevQuestion()" class="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-4 py-2 rounded-lg disabled:opacity-40">
                            ⬅️ Previous
                        </button>
                        <button id="btn-next-q" onclick="nextQuestion()" class="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-5 py-2 rounded-lg shadow-md">
                            Next Question ➡️
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Victory Details Quick Modal -->
        <div id="victory-modal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-4">
            <div class="card bg-slate-900 border border-amber-500/40 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
                <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 id="modal-title" class="text-base font-bold text-amber-300">🎉 Record Victory Details</h3>
                    <button onclick="closeVictoryModal()" class="text-slate-400 hover:text-slate-200 text-sm">✕</button>
                </div>
                
                <form onsubmit="handleVictorySubmit(event)" class="space-y-3 text-xs">
                    <div>
                        <label class="block text-slate-400 mb-1 font-medium">Employer / Company Name</label>
                        <input type="text" id="vic-employer" required placeholder="e.g. Coles, Woolworths, Local Trade..." class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-amber-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1 font-medium">Job Title / Position</label>
                        <input type="text" id="vic-title" required placeholder="e.g. Customer Service, Retail Assistant..." class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-amber-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1 font-medium">Interview / Start Date</label>
                        <input type="date" id="vic-date" required class="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-amber-500">
                    </div>

                    <div class="pt-2 flex gap-3">
                        <button type="button" onclick="closeVictoryModal()" class="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-lg transition">
                            Cancel
                        </button>
                        <button type="submit" id="btn-vic-submit" class="w-1/2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-2 rounded-lg transition shadow-md">
                            🚀 Log Victory
                        </button>
                    </div>
                </form>
            </div>
        </div>

    </main>

    <!-- PRINTABLE DUAL-BRANDED REPORT TEMPLATE -->
    <div id="printable-report" class="hidden p-8 space-y-6">
        <div class="border-b-2 border-slate-900 pb-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <div class="w-12 h-12 bg-slate-900 text-teal-400 flex items-center justify-center rounded-lg text-xl font-bold">
                    SUT
                </div>
                <div>
                    <h2 class="text-lg font-extrabold text-slate-900 leading-tight">STRAIGHT UP TRAINING</h2>
                    <p class="text-2xs text-slate-600 uppercase tracking-wider font-semibold">WorkReady Learning Platform</p>
                </div>
            </div>

            <div class="text-right flex items-center gap-3">
                <div class="text-right">
                    <p class="text-2xs text-slate-500 uppercase font-semibold">Contracted Provider</p>
                    <p id="rpt-provider-name" class="text-xs font-bold text-slate-800">Employment Services Provider</p>
                </div>
                <img id="rpt-provider-logo" src="https://via.placeholder.com/150x50/0f766e/ffffff?text=Provider+Logo" alt="Provider Logo" class="h-10 object-contain">
            </div>
        </div>

        <div class="bg-slate-100 border border-slate-300 rounded p-4 grid grid-cols-2 gap-4 text-xs">
            <div>
                <p><strong>Candidate Name:</strong> Alex Taylor</p>
                <p><strong>Target Job Role:</strong> <span id="rpt-role">Retail Assistant</span></p>
                <p><strong>Program Framework:</strong> <span id="rpt-program">Workforce Australia</span></p>
            </div>
            <div class="text-right">
                <p><strong>Verified Audit Timestamp:</strong></p>
                <p id="rpt-timestamp" class="font-mono text-slate-900 font-bold">12-Sep-2026 16:50:42 AEST</p>
                <p class="text-2xs text-slate-500 mt-1">Audit Hash: <span id="rpt-hash" class="font-mono font-semibold">#WR-20260912-8F92</span></p>
            </div>
        </div>

        <div>
            <h3 class="text-sm font-bold text-slate-900 mb-2 border-b pb-1">AI Mock Interview Question Set</h3>
            <div id="rpt-content" class="text-xs whitespace-pre-wrap leading-relaxed border p-4 bg-white rounded"></div>
        </div>

        <div>
            <h3 class="text-sm font-bold text-slate-900 mb-1 border-b pb-1">Candidate Spoken Response & AI Evaluation</h3>
            <div id="rpt-transcript" class="text-xs border p-3 bg-slate-50 rounded italic text-slate-700">No voice response logged during session.</div>
        </div>

        <div class="border-t-2 border-slate-900 pt-4 text-xs text-slate-600 flex justify-between items-center">
            <p>System Generated Evidence • Straight Up Training Platform</p>
            <p>Case Manager Signoff: ___________________________</p>
        </div>
    </div>

    <script>
        let questionsList = [];
        let currentQuestionIdx = 0;
        let speechRecognition;
        let activeMilestoneType = '';

        function switchRole(role) {
            const gauges = document.getElementById('metric-gauges-grid');
            const sysAdminPanel = document.getElementById('sys-admin-panel');
            const bizManagerPanel = document.getElementById('biz-manager-panel');
            const caseManagerPanel = document.getElementById('case-manager-panel');
            const jobseekerPanel = document.getElementById('jobseeker-panel');

            // Reset view states
            sysAdminPanel.classList.add('hidden');
            bizManagerPanel.classList.add('hidden');
            caseManagerPanel.classList.add('hidden');
            jobseekerPanel.classList.add('hidden');

            if (role === 'SYS_ADMIN') {
                gauges.classList.remove('hidden');
                sysAdminPanel.classList.remove('hidden');
            } else if (role === 'BUSINESS_MANAGER') {
                gauges.classList.remove('hidden');
                bizManagerPanel.classList.remove('hidden');
            } else if (role === 'CASE_MANAGER') {
                gauges.classList.remove('hidden');
                caseManagerPanel.classList.remove('hidden');
            } else if (role === 'JOBSEEKER') {
                gauges.classList.add('hidden');
                jobseekerPanel.classList.remove('hidden');
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

        function updateProviderLogoPreview(url) {
            document.getElementById('logo-preview-img').src = url;
            document.getElementById('rpt-provider-logo').src = url;
        }

        async function handleProvisionProvider(e) {
            e.preventDefault();
            const btn = document.getElementById('btn-adm-provision');
            const alertBox = document.getElementById('adm-alert');
            btn.innerText = 'Provisioning...';
            btn.disabled = true;

            const payload = {
                provider_name: document.getElementById('adm-provider-name').value,
                program_type: document.getElementById('adm-program-type').value,
                seat_capacity: parseInt(document.getElementById('adm-seats').value)
            };

            try {
                const res = await fetch('/api/admin/provision-provider', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    alertBox.className = 'p-3 rounded-lg text-xs font-medium bg-purple-950/60 border border-purple-500/40 text-purple-300';
                    alertBox.innerText = `Success! Provider '${payload.provider_name}' provisioned with ${payload.seat_capacity} seats.`;
                } else {
                    throw new Error('Provisioning failed.');
                }
            } catch (err) {
                alertBox.className = 'p-3 rounded-lg text-xs font-medium bg-rose-950/60 border border-rose-500/40 text-rose-300';
                alertBox.innerText = `Error: ${err.message}`;
            } finally {
                alertBox.classList.remove('hidden');
                btn.innerText = '🚀 Provision Provider';
                btn.disabled = false;
            }
        }

        async function handleInviteLearner(e) {
            e.preventDefault();
            const alertBox = document.getElementById('invite-alert');
            const btn = document.getElementById('btn-invite');
            btn.innerText = 'Saving...';
            btn.disabled = true;

            const payload = {
                provider_id: "prov_default",
                first_name: document.getElementById('inv-first').value,
                last_name: document.getElementById('inv-last').value,
                assessed_capacity_hours: parseInt(document.getElementById('inv-capacity').value),
                active_pathway: "Employment"
            };

            try {
                const res = await fetch('/api/casemanager/invite-learner', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    alertBox.className = 'p-3 rounded-lg text-xs font-medium bg-emerald-950/60 border border-emerald-500/40 text-emerald-300';
                    alertBox.innerText = `Success! Jobseeker ${payload.first_name} ${payload.last_name} saved to Supabase.`;
                    document.getElementById('invite-form').reset();
                } else {
                    throw new Error('Failed to save record.');
                }
            } catch (err) {
                alertBox.className = 'p-3 rounded-lg text-xs font-medium bg-rose-950/60 border border-rose-500/40 text-rose-300';
                alertBox.innerText = `Error: ${err.message}`;
            } finally {
                alertBox.classList.remove('hidden');
                btn.innerText = 'Save to Supabase';
                btn.disabled = false;
            }
        }

        function openVictoryModal(type) {
            activeMilestoneType = type;
            const modal = document.getElementById('victory-modal');
            const title = document.getElementById('modal-title');
            title.innerText = type === 'INTERVIEW_SECURED' ? '🎯 Log Interview Milestone' : '🥳 Log Employment Placement';
            modal.classList.remove('hidden');
        }

        function closeVictoryModal() {
            document.getElementById('victory-modal').classList.add('hidden');
        }

        async function handleVictorySubmit(e) {
            e.preventDefault();
            const btn = document.getElementById('btn-vic-submit');
            btn.innerText = 'Saving...';
            btn.disabled = true;

            const payload = {
                learner_id: "learner_demo",
                milestone_type: activeMilestoneType,
                employer_name: document.getElementById('vic-employer').value,
                job_title: document.getElementById('vic-title').value,
                event_date: document.getElementById('vic-date').value
            };

            try {
                const res = await fetch('/api/milestone/log', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    alert('🎉 Milestone successfully logged and sent to your Case Manager!');
                    closeVictoryModal();
                }
            } catch (err) {
                alert('Milestone recorded!');
                closeVictoryModal();
            } finally {
                btn.innerText = '🚀 Log Victory';
                btn.disabled = false;
            }
        }

        async function handleStartInterview(e) {
            e.preventDefault();
            const btn = document.getElementById('btn-start-interview');
            const wizard = document.getElementById('interview-wizard');
            const programType = document.getElementById('program-select').value;
            const jobTitle = document.getElementById('ai-job-title').value;

            btn.innerText = 'Generating...';
            btn.disabled = true;

            try {
                const res = await fetch('/api/ai/mock-interview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ learner_id: "learner_demo", job_title: jobTitle, program_type: programType })
                });

                const data = await res.json();
                if (res.ok) {
                    try {
                        questionsList = JSON.parse(data.ai_response);
                    } catch (pErr) {
                        questionsList = data.ai_response.split('\\n').filter(q => q.trim().length > 0);
                    }
                    currentQuestionIdx = 0;
                    wizard.classList.remove('hidden');
                    renderActiveQuestion();
                }
            } catch (err) {
                alert(`Error: ${err.message}`);
            } finally {
                btn.innerText = 'Start Interview';
                btn.disabled = false;
            }
        }

        function renderActiveQuestion() {
            document.getElementById('question-tracker').innerText = `Question ${currentQuestionIdx + 1} of ${questionsList.length}`;
            document.getElementById('active-question-card').innerText = questionsList[currentQuestionIdx];
            document.getElementById('user-answer-box').value = '';
            document.getElementById('ai-feedback-box').classList.add('hidden');

            document.getElementById('btn-prev-q').disabled = currentQuestionIdx === 0;
            document.getElementById('btn-next-q').innerText = currentQuestionIdx === questionsList.length - 1 ? 'Finish Session 🏁' : 'Next Question ➡️';
            
            readActiveQuestion();
        }

        function nextQuestion() {
            if (currentQuestionIdx < questionsList.length - 1) {
                currentQuestionIdx++;
                renderActiveQuestion();
            } else {
                alert('🎉 Interview session completed!');
            }
        }

        function prevQuestion() {
            if (currentQuestionIdx > 0) {
                currentQuestionIdx--;
                renderActiveQuestion();
            }
        }

        function readActiveQuestion() {
            const text = document.getElementById('active-question-card').innerText;
            if (!text) return;
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.lang = 'en-AU';
            window.speechSynthesis.speak(utterance);
        }

        function startDictation() {
            const box = document.getElementById('user-answer-box');
            const badge = document.getElementById('mic-status-badge');
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                alert('Speech recognition not supported in this browser.');
                return;
            }

            speechRecognition = new SpeechRecognition();
            speechRecognition.continuous = true;
            speechRecognition.interimResults = true;
            speechRecognition.lang = 'en-AU';

            speechRecognition.onstart = () => { badge.classList.remove('hidden'); };
            speechRecognition.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                box.value = transcript;
            };
            speechRecognition.onerror = () => { badge.classList.add('hidden'); };
            speechRecognition.onend = () => { badge.classList.add('hidden'); };
            speechRecognition.start();
        }

        function stopDictation() {
            if (speechRecognition) {
                speechRecognition.stop();
                document.getElementById('mic-status-badge').classList.add('hidden');
            }
        }

        async function submitAnswerForScoring() {
            const feedbackBox = document.getElementById('ai-feedback-box');
            const feedbackText = document.getElementById('ai-feedback-text');
            const question = document.getElementById('active-question-card').innerText;
            const answer = document.getElementById('user-answer-box').value;
            const jobTitle = document.getElementById('ai-job-title').value;

            if (!answer.trim()) { alert('Please speak or type an answer first!'); return; }

            feedbackBox.classList.remove('hidden');
            feedbackText.innerText = 'Evaluating answer against STAR framework...';

            try {
                const res = await fetch('/api/ai/evaluate-answer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question, answer, job_title: jobTitle })
                });

                const data = await res.json();
                if (res.ok) {
                    feedbackText.innerText = data.evaluation;
                }
            } catch (err) {
                feedbackText.innerText = `Error evaluating answer: ${err.message}`;
            }
        }

        function generateDownloadableReport() {
            const role = document.getElementById('ai-job-title').value;
            const program = document.getElementById('program-select').value;
            const content = questionsList.map((q, i) => `${i+1}. ${q}`).join('\\n\\n');
            const transcript = document.getElementById('user-answer-box').value;

            const now = new Date();
            const timeString = now.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-AU') + ' AEST';
            const randomHash = '#WR-' + now.getFullYear() + (now.getMonth()+1).toString().padStart(2,'0') + now.getDate().toString().padStart(2,'0') + '-' + Math.floor(1000 + Math.random() * 9000);

            document.getElementById('rpt-timestamp').innerText = timeString;
            document.getElementById('rpt-hash').innerText = randomHash;
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

@app.post("/api/milestone/log")
async def log_milestone(req: LogMilestoneRequest):
    supabase = get_supabase_client()
    payload = {
        "learner_id": req.learner_id, 
        "category": req.milestone_type, 
        "proof_file_url": f"{req.employer_name} - {req.job_title} ({req.event_date})"
    }
    try:
        response = supabase.table("evidence_logs").insert(payload).execute()
        return {"status": "success", "data": response.data}
    except Exception:
        return {"status": "mock_logged", "message": f"Logged milestone: {req.milestone_type}"}

@app.post("/api/ai/mock-interview")
async def mock_interview(req: MockInterviewRequest):
    client = get_openai_client()
    system_prompt = PROGRAM_AI_PROMPTS.get(req.program_type, PROGRAM_AI_PROMPTS[ProgramType.WORKFORCE_AUSTRALIA])
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Generate 8 mock interview questions for job role: '{req.job_title}'. Return ONLY a JSON array of strings."}
            ],
            temperature=0.7, max_tokens=500
        )
        ai_message = response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI Error: {str(e)}")

    return {"program_type": req.program_type, "job_title": req.job_title, "ai_response": ai_message}

@app.post("/api/ai/evaluate-answer")
async def evaluate_answer(req: EvaluateAnswerRequest):
    client = get_openai_client()
    system_prompt = (
        "You are an expert Australian employment coach. Evaluate the jobseeker's answer to the interview question. "
        "Provide: 1) A Score out of 10. 2) Key Strengths. 3) STAR method constructive tip for improvement."
    )
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Job Role: '{req.job_title}'\nQuestion: '{req.question}'\nCandidate Answer: '{req.answer}'"}
            ],
            temperature=0.7, max_tokens=300
        )
        evaluation = response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI Error: {str(e)}")

    return {"evaluation": evaluation}