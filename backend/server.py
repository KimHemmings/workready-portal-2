import os
from fastapi import FastAPI
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="WorkReady Portal API")

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "WorkReady Portal Backend is running successfully!"
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
