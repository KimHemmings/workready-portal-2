import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

app = FastAPI(
    title="WorkReady Portal API",
    description="Backend API supporting Supabase database and OpenAI integrations",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production to restrict domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Supabase Client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client | None = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize Supabase client: {e}")

# Initialize OpenAI Client
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
openai_client: OpenAI | None = None

if OPENAI_API_KEY:
    try:
        openai_client = OpenAI(api_key=OPENAI_API_KEY)
    except Exception as e:
        print(f"Warning: Failed to initialize OpenAI client: {e}")


@app.get("/")
def read_root():
    """Base endpoint to verify backend deployment status."""
    return {
        "status": "online",
        "message": "WorkReady Portal Backend is running successfully!",
        "services": {
            "supabase_configured": supabase is not None,
            "openai_configured": openai_client is not None
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint for Vercel monitoring."""
    return {"status": "ok"}
