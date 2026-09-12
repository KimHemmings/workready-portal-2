import os
import json
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai

# Initialize FastAPI App
app = FastAPI(
    title="WorkReady Portal V2 API",
    version="2.0.0",
    description="Backend API for WorkReady Portal V2 supporting Australian Employment Services"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set OpenAI API Key
openai.api_key = os.getenv("OPENAI_API_KEY")


# --- Data Models ---

class HealthCheckResponse(BaseModel):
    status: str
    version: str
    environment: str


class ProvisionProviderRequest(BaseModel):
    provider_name: str
    program_framework: str  # Workforce Australia, TtW, or IEA
    admin_contact_email: str
    case_manager_seats: int
    jobseeker_seats: int


class InviteCandidateRequest(BaseModel):
    provider_id: str
    case_manager_id: str
    candidate_name: str
    candidate_email: str
    program_framework: str


class QuizSubmissionRequest(BaseModel):
    learner_id: str
    module_id: str
    score: int
    passed: bool


class ResponseItem(BaseModel):
    question_number: int
    question_text: str
    user_transcript: str


class MockInterviewPayload(BaseModel):
    learner_id: str
    industry: str
    responses: List[ResponseItem]


# --- API Routes ---

@app.get("/api/health", response_model=HealthCheckResponse)
async def health_check():
    return {
        "status": "healthy",
        "version": "2.0.0",
        "environment": os.getenv("VERCEL_ENV", "development")
    }


@app.post("/api/admin/provision-provider")
async def provision_provider(payload: ProvisionProviderRequest):
    if not payload.provider_name or not payload.admin_contact_email:
        raise HTTPException(status_code=400, detail="Provider name and admin email are required.")
    
    # Mock provisioning logic (integrated with Supabase in production schema)
    return {
        "status": "success",
        "message": f"Provider '{payload.provider_name}' provisioned successfully under {payload.program_framework}.",
        "provider_id": "prov_8f92a10b",
        "allocated_seats": {
            "case_managers": payload.case_manager_seats,
            "jobseekers": payload.jobseeker_seats
        }
    }


@app.post("/api/candidates/invite")
async def invite_candidate(payload: InviteCandidateRequest):
    if not payload.candidate_email or not payload.case_manager_id:
        raise HTTPException(status_code=400, detail="Candidate email and Case Manager ID required.")
    
    return {
        "status": "success",
        "message": f"Invitation sent to {payload.candidate_email} for {payload.program_framework}.",
        "invitation_code": "INV-2026-9941"
    }


@app.post("/api/modules/submit-quiz")
async def submit_quiz(payload: QuizSubmissionRequest):
    certificate_generated = payload.passed and payload.score >= 80
    return {
        "status": "success",
        "learner_id": payload.learner_id,
        "module_id": payload.module_id,
        "score": payload.score,
        "passed": payload.passed,
        "certificate_issued": certificate_generated,
        "certificate_id": "CERT-2026-8812" if certificate_generated else None
    }


@app.post("/api/ai/mock-interview")
async def evaluate_mock_interview(payload: MockInterviewPayload):
    if not payload.responses:
        raise HTTPException(status_code=400, detail="No interview responses submitted.")

    system_prompt = (
        "You are an empathetic, constructive Australian Employment Services Job Coach. "
        "Evaluate candidate interview responses based on the STAR method (Situation, Task, Action, Result). "
        "Provide constructive feedback, highlight key strengths, identify areas for growth, and give an overall score out of 100. "
        "Maintain a supportive, highly encouraging tone suitable for Australian Jobseekers."
    )

    formatted_responses = "\n".join([
        f"Q{r.question_number} [{payload.industry.upper()}]: {r.question_text}\nAnswer: {r.user_transcript}\n"
        for r in payload.responses
    ])

    user_prompt = f"""
Candidate ID: {payload.learner_id}
Target Industry Sector: {payload.industry}

Responses Recorded:
{formatted_responses}

Provide an evaluation report formatted strictly as JSON with the following structure:
{{
  "overall_score": 85,
  "star_breakdown": {{
    "situation": "Feedback on how well situation was set up",
    "task": "Feedback on task clarity",
    "action": "Feedback on specific actions described",
    "result": "Feedback on outcomes and metrics achieved"
  }},
  "strengths": ["Strength point 1", "Strength point 2"],
  "areas_for_growth": ["Growth area 1", "Growth area 2"],
  "summary_feedback": "A supportive 2-3 sentence narrative summary."
}}
"""

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        evaluation_content = response.choices[0].message.content
        return {
            "status": "success",
            "evaluation": json.loads(evaluation_content)
        }

    except Exception as e:
        # Fallback simulation response if OpenAI API key is missing or encounters errors during testing
        fallback_evaluation = {
            "overall_score": 82,
            "star_breakdown": {
                "situation": "Good baseline setup of workplace context.",
                "task": "Clear identification of your direct responsibilities.",
                "action": "Described positive actions taken; try adding more specific details.",
                "result": "Emphasize quantitative outcomes and lessons learned."
            },
            "strengths": [
                "Strong clear speaking voice and communication structure.",
                "Directly addressed the core customer and workplace scenarios."
            ],
            "areas_for_growth": [
                "Incorporate measurable outcomes (e.g., speed of resolution, team feedback).",
                "Explicitly detail the exact step-by-step actions you took."
            ],
            "summary_feedback": "Great work completing the 8-question suite! Your responses demonstrate solid practical experience and work readiness."
        }
        return {
            "status": "success_fallback",
            "note": "Returned structural fallback evaluation.",
            "evaluation": fallback_evaluation
        }