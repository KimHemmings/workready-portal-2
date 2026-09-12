import os
import base64
from datetime import datetime
from enum import Enum
from typing import Optional, Dict, Any
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
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
    ProgramType.WORKFORCE_AUSTRALIA: "You are an encouraging AI interview coach for Workforce Australia. Return EXACTLY 8 distinct questions as a JSON array of strings: [\"Q1\", \"Q2\", ..., \"Q8\"].",
    ProgramType.TTW: "You are an engaging youth mentor for Transition to Work (15-24 yrs). Return EXACTLY 8 simple, direct entry-level questions as a JSON array of strings: [\"Q1\", \"Q2\", ..., \"Q8\"].",
    ProgramType.INCLUSIVE_EMPLOYMENT: "You are an empathetic AI coach for Inclusive Employment Australia. Return EXACTLY 8 short, accessible questions as a JSON array of strings: [\"Q1\", \"Q2\", ..., \"Q8\"]."
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

    <!-- Header Navigation with Official Straight Up Training Branding -->
    <header class="border-b border-slate-800 bg-slate-950/90 backdrop-blur px-6 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
        <div class="flex items-center gap-3">
            <div class="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-xl border border-teal-500/40">
                <!-- Straight Up Training Official Brand Emblem -->
                <svg class="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 40 C 20 20, 40 10, 40 30" stroke="#4ade80" stroke-width="8" stroke-linecap="round"/>
                    <path d="M50 35 C 40 15, 60 5, 60 25" stroke="#fbbf24" stroke-width="8" stroke-linecap="round"/>
                    <path d="M70 40 C 60 20, 80 10, 80 30" stroke="#a855f7" stroke-width="8" stroke-linecap="round"/>
                    <path d="M20 75 Q 50 90 80 75" stroke="#38bdf8" stroke-width="6" stroke-linecap="round"/>
                </svg>
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

        <!-- 1. SYSTEM ADMIN PANEL (Subscription & Provider Accounts ONLY) -->
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

            <div class="card bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3 text-xs">
                <h4 class="font-bold text-slate-200 border-b border-slate-700 pb-2">Active Contracted Providers & Payment Health</h4>
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

        <!-- 2. BUSINESS MANAGER PANEL (Provider Overview & Dual Branding ONLY) -->
        <div id="biz-manager-panel" class="hidden space-y-6">
            <div class="card bg-slate-800 border border-amber-500/40 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 class="text-md font-bold text-amber-300">🏢 Provider Target Compliance & Progress Graph</h3>
                    <button onclick="openDrilldownModal('REPORT_VAULT')" class="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow-md transition">
                        📁 Quick Report & Certificate Vault
                    </button>
                </div>

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

            <!-- Provider Dual-Branding Setup -->
            <div class="card bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 class="text-md font-bold text-slate-100">🖼️ Dual-Branding Setup (Provider Logo)</h3>
                    <span class="text-2xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">Active Co-Branding</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div class="md:col-span-2">
                        <label class="block text-slate-400 mb-1">Provider Logo Image URL</label>
                        <input type="url" id="provider-logo-url" oninput="updateProviderLogoPreview(this.value)" placeholder="https://example.com/provider-logo.png" value="https://via.placeholder.com/150x50/0f766e/ffffff?text=Provider+Logo" class="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-200 outline-none focus:border-amber-500">
                    </div>
                    <div>
                        <label class="block text-slate-400 mb-1">Preview</label>
                        <div class="h-10 bg-white rounded p-1 flex items-center justify-center border">
                            <img id="logo-preview-img" src="https://via.placeholder.com/150x50/0f766e/ffffff?text=Provider+Logo" class="max-h-full object-contain">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 3. CASE MANAGER PANEL -->
        <div id="case-manager-panel" class="space-y-6">
            <div class="card bg-slate-800 border border-teal-500/40 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 class="text-md font-bold text-teal-300">📊 My Caseload Compliance & Targets</h3>
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

            <!-- Add Jobseeker Form -->
            <div class="card bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 class="text-md font-bold text-slate-200">➕ Add Jobseeker to My Caseload</h3>
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
            </div>

            <!-- Live Engagement Stream -->
            <div class="card bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <h3 class="text-md font-bold text-slate-100">⚡ Live Candidate Engagement & Proof Vault Stream</h3>
                    <span class="text-2xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">Supabase Live</span>
                </div>
                <div class="space-y-3 text-xs">
                    <div class="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                        <div>
                            <p class="font-bold text-slate-200">Alex Taylor logged Job Application</p>
                            <p class="text-2xs text-slate-400">Employer: Coles Supermarkets (Retail Assistant)</p>
                        </div>
                        <span class="text-2xs font-mono text-teal-400">Just now</span>
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
                    <button onclick="openVictoryModal('INTERVIEW_SECURED')" class="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-lg shadow-md transition">
                        🎯 I GOT THE INTERVIEW!
                    </button>
                    <button onclick="openVictoryModal('JOB_PLACED')" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-lg shadow-md transition">
                        🥳 I GOT THE JOB!
                    </button>
                </div>
            </div>

            <!-- 1-by-1 AI Interview Coach with Encouraging Mentor Prompt & Continuous Dictation -->
            <div class="card bg-slate-800 border border-teal-500/40 rounded-xl p-6 space-y-5">
                <div class="flex justify-between items-center border-b border-slate-700 pb-3">
                    <div class="flex items-center gap-2">
                        <span class="text-xl">🎙️</span>
                        <h3 class="text-md font-bold text-slate-100">AI Interview Practice & Diagnostic Report</h3>
                    </div>
                    <span class="text-xs bg-teal-500/20 text-teal-300 border border-teal-500/40 px-2 py-1 rounded font-semibold">
                        Confidence Builder
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
                            <button onclick="readActiveQuestion()" class="bg-slate-700 hover:bg-slate-600 text-teal-300 border border-teal-500/30 text-xs px-3 py-1.5 rounded-lg transition">
                                🔊 Read Out Loud
                            </button>
                            <button onclick="generateDownloadableReport()" class="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg transition shadow-md">
                                📄 Print Diagnostic Report
                            </button>
                        </div>
                    </div>

                    <div id="active-question-card" class="p-4 rounded-xl bg-slate-900 text-slate-100 text-base font-medium leading-relaxed border border-slate-700"></div>

                    <div class="space-y-2">
                        <div class="flex justify-between items-center">
                            <label class="block text-xs font-bold text-slate-300">Your Answer (Speak or Type):</label>
                            <span id="mic-status-badge" class="hidden text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2 py-0.5 rounded font-bold recording-pulse">
                                🔴 Recording Active... Speak freely!
                            </span>
                        </div>

                        <textarea id="user-answer-box" rows="3" placeholder="Click 'Start Recording' and answer out loud, or type your response..." class="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-200 outline-none focus:border-teal-500"></textarea>

                        <div class="flex flex-wrap gap-3">
                            <button id="btn-mic-start" onclick="startDictation()" type="button" class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition">
                                🎤 Start Recording
                            </button>
                            <button id="btn-mic-stop" onclick="stopDictation()" type="button" class="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition">
                                ⏹️ Stop Recording
                            </button>
                            <button onclick="submitAnswerForScoring()" type="button" class="bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs px-4 py-2 rounded-lg transition shadow-md ml-auto">
                                ⭐ Get Encouraging Feedback
                            </button>
                        </div>
                    </div>

                    <div id="ai-feedback-box" class="hidden p-4 rounded-xl bg-slate-950/90 border border-teal-500/40 space-y-2">
                        <p class="text-xs font-bold text-amber-400 uppercase tracking-wider">AI Mentor Feedback & Guidance:</p>
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

        <!-- DRILLDOWN MODAL -->
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

    <!-- PRINTABLE FULL DIAGNOSTIC REPORT TEMPLATE (WITH ANSWERS, SCORES & TIMESTAMPS) -->
    <div id="printable-report" class="hidden p-8 space-y-6">
        <div class="border-b-2 border-slate-900 pb-4 flex justify-between items-center">
            <div class="flex items-center gap-3">
                <svg class="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 40 C 20 20, 40 10, 40 30" stroke="#4ade80" stroke-width="8" stroke-linecap="round"/>
                    <path d="M50 35 C 40 15, 60 5, 60 25" stroke="#fbbf24" stroke-width="8" stroke-linecap="round"/>
                    <path d="M70 40 C 60 20, 80 10, 80 30" stroke="#a855f7" stroke-width="8" stroke-linecap="round"/>
                </svg>
                <div>
                    <h2 class="text-lg font-extrabold text-slate-900 leading-tight">STRAIGHT UP TRAINING</h2>
                    <p class="text-2xs text-slate-600 uppercase tracking-wider font-semibold">AI Interview Diagnostic Evidence</p>
                </div>
            </div>

            <div class="text-right flex items-center gap-3">
                <div class="text-right">
                    <p class="text-2xs text-slate-500 uppercase font-semibold">Contracted Provider</p>
                    <p id="rpt-provider-name" class="text-xs font-bold text-slate-800">Employment Services Provider</p>
                </div>
                <img id="rpt-provider-logo" src="https://via.placeholder.com/150x50/0f766e/ffffff?text=Provider+Logo" class="h-10 object-contain">
            </div>
        </div>

        <div class="bg-slate-100 border border-slate-300 rounded p-4 grid grid-cols-2 gap-4 text-xs">
            <div>
                <p><strong>Candidate Name:</strong> Alex Taylor</p>
                <p><strong>Target Job Role:</strong> <span id="rpt-role">Retail Assistant</span></p>
            </div>
            <div class="text-right">
                <p><strong>Verified Audit Timestamp:</strong></p>
                <p id="rpt-timestamp" class="font-mono text-slate-900 font-bold">12-Sep-2026 18:02:00 AEST</p>
                <p class="text-2xs text-slate-500 mt-1">Audit Hash: <span id="rpt-hash" class="font-mono font-semibold">#WR-20260912-8F92</span></p>
            </div>
        </div>

        <div>
            <h3 class="text-sm font-bold text-slate-900 mb-2 border-b pb-1">AI Mock Interview Diagnostic & Response Evaluation</h3>
            <div id="rpt-content" class="text-xs space-y-3"></div>
        </div>

        <div class="border-t-2 border-slate-900 pt-4 text-xs text-slate-600 flex justify-between items-center">
            <p>System Generated Evidence • Straight Up Training Platform</p>
            <p>Case Manager Signoff: ___________________________</p>
        </div>
    </div>

    <script>
        let questionsList = [];
        let answersList = {};
        let feedbackList = {};
        let currentQuestionIdx = 0;
        let speechRecognition;
        let isManualStop = false;

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

        function updateProviderLogoPreview(url) {
            document.getElementById('logo-preview-img').src = url;
            document.getElementById('rpt-provider-logo').src = url;
        }

        async function handleStartInterview(e) {
            e.preventDefault();
            const btn = document.getElementById('btn-start-interview');
            const wizard = document.getElementById('interview-wizard');
            const programType = "WORKFORCE_AUSTRALIA";
            const jobTitle = document.getElementById('ai-job-title').value;

            btn.innerText = 'Generating Questions...';
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
                    answersList = {};
                    feedbackList = {};
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
            document.getElementById('user-answer-box').value = answersList[currentQuestionIdx] || '';
            
            const feedbackBox = document.getElementById('ai-feedback-box');
            if (feedbackList[currentQuestionIdx]) {
                feedbackBox.classList.remove('hidden');
                document.getElementById('ai-feedback-text').innerText = feedbackList[currentQuestionIdx];
            } else {
                feedbackBox.classList.add('hidden');
            }

            document.getElementById('btn-prev-q').disabled = currentQuestionIdx === 0;
            document.getElementById('btn-next-q').innerText = currentQuestionIdx === questionsList.length - 1 ? 'Finish Session 🏁' : 'Next Question ➡️';
            
            readActiveQuestion();
        }

        function nextQuestion() {
            answersList[currentQuestionIdx] = document.getElementById('user-answer-box').value;
            if (currentQuestionIdx < questionsList.length - 1) {
                currentQuestionIdx++;
                renderActiveQuestion();
            } else {
                alert('🎉 Interview session completed! Click "Print Diagnostic Report" to export your full results.');
            }
        }

        function prevQuestion() {
            answersList[currentQuestionIdx] = document.getElementById('user-answer-box').value;
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

        /* CONTINUOUS SPEECH DICTATION ENGINE */
        function startDictation() {
            const box = document.getElementById('user-answer-box');
            const badge = document.getElementById('mic-status-badge');
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (!SpeechRecognition) {
                alert('Speech recognition is not supported in this browser.');
                return;
            }

            isManualStop = false;
            speechRecognition = new SpeechRecognition();
            speechRecognition.continuous = true;
            speechRecognition.interimResults = true;
            speechRecognition.lang = 'en-AU';

            speechRecognition.onstart = () => { badge.classList.remove('hidden'); };
            speechRecognition.onresult = (event) => {
                let transcript = '';
                for (let i = 0; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                box.value = transcript;
                answersList[currentQuestionIdx] = transcript;
            };
            speechRecognition.onend = () => {
                if (!isManualStop) {
                    speechRecognition.start(); // Auto-restart to prevent pause cuts
                } else {
                    badge.classList.add('hidden');
                }
            };
            speechRecognition.start();
        }

        function stopDictation() {
            isManualStop = true;
            if (speechRecognition) {
                speechRecognition.stop();
            }
            document.getElementById('mic-status-badge').classList.add('hidden');
        }

        async function submitAnswerForScoring() {
            const feedbackBox = document.getElementById('ai-feedback-box');
            const feedbackText = document.getElementById('ai-feedback-text');
            const question = document.getElementById('active-question-card').innerText;
            const answer = document.getElementById('user-answer-box').value;
            const jobTitle = document.getElementById('ai-job-title').value;

            if (!answer.trim()) { alert('Please speak or type an answer first!'); return; }

            feedbackBox.classList.remove('hidden');
            feedbackText.innerText = 'Evaluating answer with encouraging STAR feedback...';

            try {
                const res = await fetch('/api/ai/evaluate-answer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question, answer, job_title: jobTitle })
                });

                const data = await res.json();
                if (res.ok) {
                    feedbackText.innerText = data.evaluation;
                    feedbackList[currentQuestionIdx] = data.evaluation;
                }
            } catch (err) {
                feedbackText.innerText = `Error evaluating answer: ${err.message}`;
            }
        }

        function generateDownloadableReport() {
            const role = document.getElementById('ai-job-title').value;
            const contentBox = document.getElementById('rpt-content');
            contentBox.innerHTML = '';

            questionsList.forEach((q, idx) => {
                const ans = answersList[idx] || 'No answer recorded.';
                const fb = feedbackList[idx] || 'Pending evaluation.';
                
                const qDiv = document.createElement('div');
                qDiv.className = 'border-b pb-3 space-y-1';
                qDiv.innerHTML = `
                    <p class="font-bold text-slate-900">Q${idx + 1}: ${q}</p>
                    <p class="text-slate-700 italic bg-slate-50 p-2 rounded">Candidate Answer: "${ans}"</p>
                    <p class="text-teal-800 font-semibold bg-teal-50 p-2 rounded">AI Evaluation & Score: ${fb}</p>
                `;
                contentBox.appendChild(qDiv);
            });

            const now = new Date();
            const timeString = now.toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-AU') + ' AEST';
            const randomHash = '#WR-' + now.getFullYear() + (now.getMonth()+1).toString().padStart(2,'0') + now.getDate().toString().padStart(2,'0') + '-' + Math.floor(1000 + Math.random() * 9000);

            document.getElementById('rpt-timestamp').innerText = timeString;
            document.getElementById('rpt-hash').innerText = randomHash;
            document.getElementById('rpt-role').innerText = role;

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
    except Exception:
        return {"status": "mock_provisioned", "message": f"Provisioned {req.provider_name}"}

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
        "You are an encouraging, highly supportive Australian employment coach. Evaluate the candidate's interview answer. "
        "Structure your response warmly: 1) Give an encouraging Score out of 10. 2) Praise 1-2 Key Strengths. "
        "3) Provide 1 gentle STAR method tip for improvement to build candidate confidence."
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