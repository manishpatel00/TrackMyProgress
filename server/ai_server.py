#!/usr/bin/env python3
"""AI endpoints removed

This server previously hosted AI-related endpoints. The AI toolset has been
removed from the UI and documentation; the file has been retained and simplified
to avoid accidental exposure of generative endpoints.

If you intend to reintroduce AI features, restore a proper implementation
behind secure server-side controls and update documentation accordingly.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.environ.get("VITE_API_BASE_ORIGIN", "*")],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/ai/health")
def ai_removed_health():
    return {"status": "removed", "message": "AI endpoints have been removed from this deployment."}


@app.post("/api/ai/{path}")
def ai_removed(path: str):
    raise HTTPException(status_code=410, detail="AI endpoints have been removed from this application.")


@app.post("/api/feedback")
def feedback_stub():
    return {"status": "deprecated", "message": "Feedback endpoint is not available in this trimmed build."}


@app.post("/api/contact")
def contact_stub():
    return {"status": "deprecated", "message": "Contact endpoint is not available in this trimmed build."}


if __name__ == '__main__':
    import uvicorn
    port = int(os.environ.get("PORT", 4000))
    uvicorn.run("ai_server:app", host="0.0.0.0", port=port, log_level="info")
