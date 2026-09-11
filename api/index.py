from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="WorkReady Portal Backend",
    version="1.0.0",
    description="Backend API for the WorkReady Portal."
)

# CORS (you can adjust origins later)
origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"status": "backend online", "message": "WorkReady Portal backend is running."}


@app.get("/health")
def health_check():
    return {"health": "ok"}
