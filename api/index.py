import os
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
    max_case_managers: int = 10
    max_jobseekers: int = 250
    payment_status: str = "Paid & Current"

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

class ResumeBuilderRequest(BaseModel):
    jobseeker_name: str
    target_role: str
    work_experience: str
    skills: str

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
        @keyframes pulse-red { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.05); } }
        .recording-pulse { animation: pulse-red 1.2s infinite; }
        @media print {
            body * { visibility: hidden; }
            #printable-report, #printable-report *, #printable-cert, #printable-cert * { visibility: visible; }
            #printable-report, #printable-cert { position: absolute; left: 0; top: 0; width: 100%; color: #000; background: #fff; padding: 20px; }
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
                <label for="role-select" class="text-2xs text-slate-400 font-bold uppercase tracking-wider hidden md:inline">Role View:</label>
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
        </div>
    </header>

    <main class="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">

        <!-- 1. SYSTEM ADMIN PANEL (Subscription & Seat Quotas) -->
        <div id="sys-admin-panel" class="hidden space-y-6">
            <div class="card bg-slate-800 border border-purple-500/40 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">⚙️</span>
                        <h3 class="text-md font-bold text-purple-300">System Admin - Provider Accounts & Subscription Health</h3>
                    </div>
                    <span class="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2.5 py-1 rounded font-bold">
                        Global Platform Control
                    </span>
                </div>
                
                <!-- Provision Form -->
                <form onsubmit="handleProvisionProvider(event)" class="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
                    <div>
                        <label class="block text-slate-400 mb-1">Provider Name</label>
                        <input type="text" id="adm-provider-name" required placeholder="e.g. APM Employment" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-purple-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Max Case Managers</label>
                        <input type="number" id="adm-max-cm" value="10" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-purple-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Max Jobseekers</label>
                        <input type="number" id="adm-max-js" value="250" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-purple-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Payment Status</label>
                        <select id="adm-payment-status" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-purple-500">
                            <option value="Paid & Current">Paid & Current ✅</option>
                            <option value="Overdue">Payment Overdue ⚠️</option>
                            <option value="Trialing">Active Trial ⏳</option>
                        </select>
                    </div>
                    <div class="flex items-end">
                        <button type="submit" class="w-full bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-2 rounded-lg transition">
                            Save Provider
                        </button>
                    </div>
                </form>
            </div>

            <!-- Provider Accounts Overview Table -->
            <div class="card bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3 text-xs">
                <h4 class="font-bold text-slate-200 border-b border-slate-700 pb-2">Active Contracted Providers</h4>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="text-slate-400 border-b border-slate-700">
                                <th class="pb-2">Provider Name</th>
                                <th class="pb-2">Max Case Managers</th>
                                <th class="pb-2">Max Jobseekers</th>
                                <th class="pb-2">Subscription Status</th>
                                <th class="pb-2">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800 text-slate-300">
                            <tr>
                                <td class="py-2.5 font-bold text-purple-300">MAX Employment (Brisbane Central)</td>
                                <td>15 CMs</td>
                                <td>350 Jobseekers</td>
                                <td><span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-semibold">Paid & Current</span></td>
                                <td><button class="text-slate-400 hover:text-white">Edit Limits</button></td>
                            </tr>
                            <tr>
                                <td class="py-2.5 font-bold text-purple-300">APM Employment Services</td>
                                <td>8 CMs</td>
                                <td>200 Jobseekers</td>
                                <td><span class="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded font-semibold">Paid & Current</span></td>
                                <td><button class="text-slate-400 hover:text-white">Edit Limits</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- 2. BUSINESS MANAGER PANEL (Provider Overview & Target Graphs) -->
        <div id="biz-manager-panel" class="hidden space-y-6">
            <div class="card bg-slate-800 border border-amber-500/40 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 class="text-md font-bold text-amber-300">🏢 Provider Target Compliance & PBAS Progress Graph</h3>
                    <div class="flex gap-2">
                        <button onclick="openDrilldownModal('REPORT_VAULT')" class="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-md transition">
                            📁 Quick Report & Certificate Vault
                        </button>
                    </div>
                </div>

                <!-- Graph Representation -->
                <div class="space-y-3">
                    <div class="flex justify-between text-xs font-bold">
                        <span class="text-slate-300">Provider Target Compliance (Total 250 Candidates)</span>
                        <span class="text-teal-400">84% Overall Compliance Rate</span>
                    </div>
                    <div class="w-full bg-slate-950 rounded-full h-5 flex overflow-hidden border border-slate-700">
                        <div class="bg-emerald-500 h-full text-2xs font-bold text-slate-950 flex items-center justify-center" style="width: 72%">72% On Track (180)</div>
                        <div class="bg-amber-500 h-full text-2xs font-bold text-slate-950 flex items-center justify-center" style="width: 16%">16% At Risk (40)</div>
                        <div class="bg-rose-500 h-full text-2xs font-bold text-white flex items-center justify-center" style="width: 12%">12% Non-Compliant (30)</div>
                    </div>
                </div>

                <!-- Interactive Clickable Detail Buttons -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
                    <button onclick="openDrilldownModal('ON_TRACK')" class="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-left hover:bg-emerald-950/70 transition space-y-1">
                        <p class="font-bold text-emerald-300">✅ 180 Candidates On Track</p>
                        <p class="text-2xs text-slate-400">Meeting PBAS targets. Click to view full candidate list.</p>
                    </button>
                    <button onclick="openDrilldownModal('AT_RISK')" class="p-3 bg-amber-950/40 border border-amber-500/40 rounded-xl text-left hover:bg-amber-950/70 transition space-y-1">
                        <p class="font-bold text-amber-300">⚠️ 40 Candidates At Risk</p>
                        <p class="text-2xs text-slate-400">Behind on points. Click to open intervention list.</p>
                    </button>
                    <button onclick="openDrilldownModal('NON_COMPLIANT')" class="p-3 bg-rose-950/40 border border-rose-500/40 rounded-xl text-left hover:bg-rose-950/70 transition space-y-1">
                        <p class="font-bold text-rose-300">🚨 30 Non-Compliant</p>
                        <p class="text-2xs text-slate-400">Zero activities logged. Click for urgent follow-up.</p>
                    </button>
                </div>
            </div>
        </div>

        <!-- 3. CASE MANAGER PANEL (Caseload Metrics & Real-Time Candidate Monitor) -->
        <div id="case-manager-panel" class="space-y-6">
            <div class="card bg-slate-800 border border-teal-500/40 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 class="text-md font-bold text-teal-300">📊 My Caseload Compliance & Target Gauges</h3>
                    <button onclick="openDrilldownModal('REPORT_VAULT')" class="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-md transition">
                        📁 Access Reports & Certificates Vault
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <button onclick="openDrilldownModal('ON_TRACK')" class="p-3 bg-slate-900 border border-slate-700 rounded-xl text-left hover:border-emerald-500 transition space-y-1">
                        <p class="font-bold text-emerald-400">✅ 28 Candidates On Track</p>
                        <p class="text-2xs text-slate-400">Click to view active caseload progress.</p>
                    </button>
                    <button onclick="openDrilldownModal('AT_RISK')" class="p-3 bg-slate-900 border border-slate-700 rounded-xl text-left hover:border-amber-500 transition space-y-1">
                        <p class="font-bold text-amber-400">⚠️ 6 Candidates At Risk</p>
                        <p class="text-2xs text-slate-400">Click to view required interventions.</p>
                    </button>
                    <button onclick="openDrilldownModal('NON_COMPLIANT')" class="p-3 bg-slate-900 border border-slate-700 rounded-xl text-left hover:border-rose-500 transition space-y-1">
                        <p class="font-bold text-rose-400">🚨 2 Candidates Urgent</p>
                        <p class="text-2xs text-slate-400">Click for immediate case notes.</p>
                    </button>
                </div>
            </div>

            <!-- Real-Time Candidate Activity Feed -->
            <div class="card bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">⚡</span>
                        <h3 class="text-md font-bold text-slate-100">Live Candidate Engagement & Compliance Monitor</h3>
                    </div>
                    <span class="text-2xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-bold">
                        Live Feed
                    </span>
                </div>

                <div class="space-y-3 text-xs">
                    <div class="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div>
                            <p class="font-bold text-slate-200">Alex Taylor logged 3 Job Applications</p>
                            <p class="text-2xs text-slate-400">Proof screenshot uploaded • Coles, Woolworths, Local Cafe</p>
                        </div>
                        <span class="text-2xs font-mono text-teal-400">2 mins ago</span>
                    </div>

                    <div class="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div>
                            <p class="font-bold text-amber-300">🎯 Interview Milestone: Jordan Lee</p>
                            <p class="text-2xs text-slate-400">Secured Interview for Apprentice Electrician at Sparks Ltd</p>
                        </div>
                        <span class="text-2xs font-mono text-amber-400">14 mins ago</span>
                    </div>

                    <div class="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div>
                            <p class="font-bold text-purple-300">🎓 Certificate Earned: Morgan Smith</p>
                            <p class="text-2xs text-slate-400">Completed Module: Workplace Rights & Communication (Score: 100%)</p>
                        </div>
                        <span class="text-2xs font-mono text-purple-400">1 hour ago</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 4. JOBSEEKER CANDIDATE EXPERIENCE -->
        <div id="jobseeker-panel" class="hidden space-y-6">
            <!-- Victory Buttons -->
            <div id="jobseeker-victory-banner" class="p-5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 to-teal-950/40 space-y-3">
                <div>
                    <h2 class="text-lg font-extrabold text-amber-300">🎉 Share Your Victory!</h2>
                    <p class="text-xs text-slate-300">Tap below to record your milestone with your Case Manager.</p>
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

            <!-- Employability Micro-Learning Module with Video & Comprehensive Quiz -->
            <div class="card bg-slate-800 border border-teal-500/40 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">🎓</span>
                        <h3 class="text-md font-bold text-slate-100">Employability Micro-Learning Module</h3>
                    </div>
                    <span class="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-1 rounded font-semibold">
                        Certificate Included
                    </span>
                </div>

                <div class="space-y-3 text-xs">
                    <h4 class="font-bold text-teal-300 text-sm">Module 1: Workplace Communication & Preparation</h4>
                    <p class="text-slate-300">Watch the short video lesson below, review the key points, and complete the comprehensive quiz to earn your Stamped Certificate.</p>
                    
                    <!-- Embedded Video Clip -->
                    <div class="aspect-video w-full rounded-xl overflow-hidden border border-slate-700 bg-slate-950">
                        <iframe class="w-full h-full" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" title="Workplace Skills Lesson" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>

                    <!-- Module Quiz -->
                    <div class="p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-3">
                        <p class="font-bold text-slate-200">Module Quiz Question 1 of 1:</p>
                        <p class="text-slate-300">What is the most effective way to structure an answer to an interview question about past workplace experience?</p>
                        <div class="space-y-2">
                            <label class="block p-2 bg-slate-950 rounded border border-slate-800 hover:border-teal-500 cursor-pointer">
                                <input type="radio" name="quiz-q1" value="STAR" class="mr-2"> The STAR Method (Situation, Task, Action, Result)
                            </label>
                            <label class="block p-2 bg-slate-950 rounded border border-slate-800 hover:border-teal-500 cursor-pointer">
                                <input type="radio" name="quiz-q1" value="Random" class="mr-2"> Giving a brief single-word answer
                            </label>
                        </div>
                        <button onclick="submitModuleQuiz()" class="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition shadow-md">
                            Submit Quiz & Issue Certificate 🎓
                        </button>
                    </div>
                </div>
            </div>

            <!-- Job Search Logger & Screenshot Proof Uploader -->
            <div class="card bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 class="text-md font-bold text-slate-100">📝 Job Search Reporting & Proof Uploader</h3>
                    <span class="text-2xs text-slate-400">Logged to Case Manager in Real-Time</span>
                </div>

                <form onsubmit="handleLogJobSearch(event)" class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                        <label class="block text-slate-400 mb-1">Employer / Business</label>
                        <input type="text" id="js-employer" required placeholder="e.g. Coles Supermarkets" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-teal-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Position Applied For</label>
                        <input type="text" id="js-role" required placeholder="e.g. Retail Team Member" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-teal-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Proof Screenshot / Document</label>
                        <input type="file" id="js-file" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-400 outline-none focus:border-teal-500">
                    </div>
                    <div class="md:col-span-3">
                        <button type="submit" class="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 rounded-lg transition shadow-md">
                            Log Job Search Entry
                        </button>
                    </div>
                </form>
            </div>

            <!-- AI Resume & Cover Letter Builder -->
            <div class="card bg-slate-800 border border-teal-500/40 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">📄</span>
                        <h3 class="text-md font-bold text-slate-100">AI Resume & Cover Letter Builder</h3>
                    </div>
                    <span class="text-2xs bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-0.5 rounded font-bold">GPT-4o Powered</span>
                </div>

                <form onsubmit="handleBuildResume(event)" class="space-y-3 text-xs">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label class="block text-slate-400 mb-1">Your Full Name</label>
                            <input type="text" id="res-name" required value="Alex Taylor" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-teal-500">
                        </div>
                        <div>
                            <label class="block text-slate-400 mb-1">Target Job Role</label>
                            <input type="text" id="res-role" required value="Retail Sales Assistant" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-teal-500">
                        </div>
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Past Experience / Tasks</label>
                        <textarea id="res-exp" rows="2" placeholder="e.g. Worked cash registers, customer service, stocking shelves..." class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-teal-500"></textarea>
                    </div>
                    <button type="submit" id="btn-res-build" class="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 rounded-lg transition shadow-md">
                        Generate Tailored Resume & Cover Letter
                    </button>
                </form>

                <div id="resume-output-box" class="hidden p-4 bg-slate-900 rounded-xl border border-slate-700 space-y-2 text-xs">
                    <p class="font-bold text-teal-400 uppercase">Generated AI Resume & Cover Letter:</p>
                    <div id="resume-output-text" class="whitespace-pre-wrap leading-relaxed text-slate-200"></div>
                </div>
            </div>
        </div>

        <!-- DRILLDOWN MODAL (FOR BUSINESS MANAGER & CASE MANAGER BUTTON CLICKS) -->
        <div id="drilldown-modal" class="hidden fixed inset-0 bg-slate-950/80 backdrop-blur z-50 flex items-center justify-center p-4">
            <div class="card bg-slate-900 border border-teal-500/40 rounded-xl p-6 max-w-2xl w-full space-y-4 shadow-2xl">
                <div class="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 id="drilldown-title" class="text-base font-bold text-teal-300">Details List</h3>
                    <button onclick="closeDrilldownModal()" class="text-slate-400 hover:text-slate-200 text-sm">✕</button>
                </div>
                <div id="drilldown-content" class="text-xs space-y-2 max-h-80 overflow-y-auto"></div>
            </div>
        </div>

    </main>

    <!-- PRINTABLE MODULE COMPLETION CERTIFICATE TEMPLATE -->
    <div id="printable-cert" class="hidden p-12 border-8 border-slate-900 text-center space-y-6">
        <div class="flex justify-between items-center border-b pb-4">
            <h2 class="text-xl font-bold">STRAIGHT UP TRAINING</h2>
            <img id="cert-provider-logo" src="https://via.placeholder.com/150x50/0f766e/ffffff?text=Provider+Logo" class="h-8">
        </div>
        <h1 class="text-3xl font-extrabold text-slate-900 tracking-wider">CERTIFICATE OF COMPLETION</h1>
        <p class="text-sm">This is to certify that</p>
        <h2 class="text-2xl font-black text-teal-700">ALEX TAYLOR</h2>
        <p class="text-sm">has successfully completed the employability module</p>
        <h3 class="text-lg font-bold text-slate-800">Workplace Communication & Preparation</h3>
        <p class="text-xs text-slate-500">Verification Hash: #CERT-20260912-9A4F • Verified Timestamp: 12-Sep-2026</p>
    </div>

    <script>
        function switchRole(role) {
            const sysAdminPanel = document.getElementById('sys-admin-panel');
            const bizManagerPanel = document.getElementById('biz-manager-panel');
            const caseManagerPanel = document.getElementById('case-manager-panel');
            const jobseekerPanel = document.getElementById('jobseeker-panel');

            sysAdminPanel.classList.add('hidden');
            bizManagerPanel.classList.add('hidden');
            caseManagerPanel.classList.add('hidden');
            jobseekerPanel.classList.add('hidden');

            if (role === 'SYS_ADMIN') { sysAdminPanel.classList.remove('hidden'); }
            else if (role === 'BUSINESS_MANAGER') { bizManagerPanel.classList.remove('hidden'); }
            else if (role === 'CASE_MANAGER') { caseManagerPanel.classList.remove('hidden'); }
            else if (role === 'JOBSEEKER') { jobseekerPanel.classList.remove('hidden'); }
        }

        function toggleAccessibility() {
            document.body.classList.toggle('wcag-mode');
        }

        function openDrilldownModal(type) {
            const modal = document.getElementById('drilldown-modal');
            const title = document.getElementById('drilldown-title');
            const content = document.getElementById('drilldown-content');

            modal.classList.remove('hidden');

            if (type === 'ON_TRACK') {
                title.innerText = '✅ On Track Candidate List';
                content.innerHTML = `
                    <div class="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between"><span>Alex Taylor</span><span class="text-emerald-400 font-bold">100 PBAS Points</span></div>
                    <div class="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between"><span>Jordan Lee</span><span class="text-emerald-400 font-bold">95 PBAS Points</span></div>
                `;
            } else if (type === 'AT_RISK') {
                title.innerText = '⚠️ At Risk Candidate List';
                content.innerHTML = `
                    <div class="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between"><span>Morgan Smith</span><span class="text-amber-400 font-bold">45 PBAS Points</span></div>
                `;
            } else if (type === 'REPORT_VAULT') {
                title.innerText = '📁 Quick Certificate & Compliance Report Vault';
                content.innerHTML = `
                    <div class="p-3 bg-slate-950 rounded border border-slate-800 flex justify-between items-center">
                        <div><p class="font-bold">Module Completion Certificate - Alex Taylor</p><p class="text-2xs text-slate-400">Issued 12-Sep-2026</p></div>
                        <button onclick="window.print()" class="px-3 py-1 bg-teal-600 text-white rounded">Print Cert</button>
                    </div>
                `;
            }
        }

        function closeDrilldownModal() {
            document.getElementById('drilldown-modal').classList.add('hidden');
        }

        async function handleProvisionProvider(e) {
            e.preventDefault();
            alert('Provider provisioned with max CM and Jobseeker limits!');
        }

        async function handleLogJobSearch(e) {
            e.preventDefault();
            alert('Job search entry and proof file uploaded! Case Manager notified in real-time.');
        }

        async function submitModuleQuiz() {
            const cert = document.getElementById('printable-cert');
            cert.classList.remove('hidden');
            window.print();
            cert.classList.add('hidden');
        }

        async function handleBuildResume(e) {
            e.preventDefault();
            const box = document.getElementById('resume-output-box');
            const text = document.getElementById('resume-output-text');
            const btn = document.getElementById('btn-res-build');
            
            btn.innerText = 'Generating with AI...';
            btn.disabled = true;
            box.classList.remove('hidden');
            text.innerText = 'Building tailored professional resume...';

            try {
                const res = await fetch('/api/ai/build-resume', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jobseeker_name: document.getElementById('res-name').value,
                        target_role: document.getElementById('res-role').value,
                        work_experience: document.getElementById('res-exp').value,
                        skills: "Communication, Teamwork, Reliability"
                    })
                });

                const data = await res.json();
                if (res.ok) {
                    text.innerText = data.resume_text;
                }
            } catch (err) {
                text.innerText = `Error generating resume: ${err.message}`;
            } finally {
                btn.innerText = 'Generate Tailored Resume & Cover Letter';
                btn.disabled = false;
            }
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
    payload = {
        "name": req.provider_name,
        "program_type": req.program_type.value,
        "max_case_managers": req.max_case_managers,
        "seat_capacity": req.max_jobseekers,
        "payment_status": req.payment_status
    }
    try:
        response = supabase.table("providers").insert(payload).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        return {"status": "mock_provisioned", "message": f"Provisioned {req.provider_name}"}

@app.post("/api/ai/build-resume")
async def build_resume(req: ResumeBuilderRequest):
    client = get_openai_client()
    prompt = (
        f"Create a professional Australian resume and matching cover letter for candidate '{req.jobseeker_name}' "
        f"applying for '{req.target_role}'. Experience: '{req.work_experience}'."
    )
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert Australian resume writer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7, max_tokens=600
        )
        output = response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OpenAI Error: {str(e)}")

    return {"resume_text": output}