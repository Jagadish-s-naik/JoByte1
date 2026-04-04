"""
api.py
------
Flask server that exposes the matcher as HTTP endpoints.
The backend (Node.js/Express) calls these endpoints.

Endpoints:
  POST /match/jobs      → ranked jobs for a candidate
  POST /match/candidates → ranked candidates for a job (recruiter view)
  GET  /health          → liveness check

Run:
    python api.py
    # Runs on http://localhost:5001
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from matcher import match_candidate_to_jobs, match_job_to_candidates

load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow calls from frontend dev server and backend

PORT = int(os.getenv("ML_PORT", 5001))


# ── Health check ──────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    """Simple liveness probe. Backend pings this on startup."""
    return jsonify({"status": "ok", "service": "job-matcher-ml"}), 200


# ── Match jobs for a candidate ────────────────────────────────────────────────

@app.route("/match/jobs", methods=["POST"])
def match_jobs():
    """
    Request body:
    {
        "candidate": {
            "candidate_id": "abc123",
            "skills": ["Python", "React"],
            "experience": "2 years backend ...",
            "education": "B.Tech CS",
            "preferred_roles": ["Backend Developer"],
            "bio": "..."  (optional)
        },
        "jobs": [
            {
                "job_id": "xyz",
                "title": "...",
                "company": "...",
                "description": "...",
                "required_skills": [...],
                "experience_required": "2+ years"
            },
            ...
        ],
        "top_k": 10  (optional, default 10)
    }

    Response:
    {
        "matches": [
            {
                "job_id": "xyz",
                "title": "...",
                "company": "...",
                "description": "...",  (first 200 chars)
                "required_skills": [...],
                "score": 0.87
            },
            ...
        ]
    }
    """
    body = request.get_json(silent=True)

    if not body:
        return jsonify({"error": "Request body must be JSON"}), 400

    candidate = body.get("candidate")
    jobs = body.get("jobs", [])
    top_k = body.get("top_k", 10)

    if not candidate:
        return jsonify({"error": "Missing 'candidate' in request body"}), 400

    if not isinstance(jobs, list):
        return jsonify({"error": "'jobs' must be a list"}), 400

    try:
        matches = match_candidate_to_jobs(candidate, jobs, top_k=top_k)
        return jsonify({"matches": matches}), 200
    except Exception as e:
        app.logger.error(f"match_jobs error: {e}")
        return jsonify({"error": "Internal matcher error", "detail": str(e)}), 500


# ── Match candidates for a job (recruiter side) ───────────────────────────────

@app.route("/match/candidates", methods=["POST"])
def match_candidates():
    """
    Request body:
    {
        "job": {
            "job_id": "xyz",
            "title": "...",
            "description": "...",
            "required_skills": [...],
            "experience_required": "..."
        },
        "candidates": [
            {
                "candidate_id": "abc",
                "name": "...",
                "skills": [...],
                "experience": "...",
                "education": "..."
            },
            ...
        ],
        "top_k": 20  (optional, default 20)
    }

    Response:
    {
        "matches": [
            {
                "candidate_id": "abc",
                "name": "...",
                "skills": [...],
                "score": 0.91
            },
            ...
        ]
    }
    """
    body = request.get_json(silent=True)

    if not body:
        return jsonify({"error": "Request body must be JSON"}), 400

    job = body.get("job")
    candidates = body.get("candidates", [])
    top_k = body.get("top_k", 20)

    if not job:
        return jsonify({"error": "Missing 'job' in request body"}), 400

    if not isinstance(candidates, list):
        return jsonify({"error": "'candidates' must be a list"}), 400

    try:
        matches = match_job_to_candidates(job, candidates, top_k=top_k)
        return jsonify({"matches": matches}), 200
    except Exception as e:
        app.logger.error(f"match_candidates error: {e}")
        return jsonify({"error": "Internal matcher error", "detail": str(e)}), 500


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print(f"[api] Starting ML server on port {PORT}")
    # debug=False in production; set DEBUG=true in .env for dev
    app.run(host="0.0.0.0", port=PORT, debug=os.getenv("DEBUG", "false").lower() == "true")
