"""
matcher.py
----------
Core job-candidate matching engine using Sentence Transformers (SBERT).

Why SBERT over LSTM?
- LSTM is for sequential prediction (time-series, text generation).
- Matching is a SIMILARITY problem: how close is profile X to job Y?
- SBERT encodes both into dense vectors; cosine similarity gives the score.
- 'all-MiniLM-L6-v2' is fast, lightweight, and semantically powerful enough
  for hackathon scale. Swap for 'all-mpnet-base-v2' for better accuracy
  if latency is not a concern.
"""

from sentence_transformers import SentenceTransformer, util
import numpy as np


# ── Model (loaded once, reused across all requests) ──────────────────────────
MODEL_NAME = "all-MiniLM-L6-v2"
_model: SentenceTransformer | None = None


def get_model() -> SentenceTransformer:
    """Lazy-load the model so import is instant."""
    global _model
    if _model is None:
        print(f"[matcher] Loading model '{MODEL_NAME}' …")
        _model = SentenceTransformer(MODEL_NAME)
        print("[matcher] Model ready.")
    return _model


# ── Text builders ─────────────────────────────────────────────────────────────

def build_candidate_text(candidate: dict) -> str:
    """
    Combine candidate fields into a single string for embedding.
    The richer this text, the better the match quality.

    Expected candidate dict shape:
    {
        "name": str,
        "skills": ["Python", "React", ...],
        "experience": "3 years backend development ...",
        "education": "B.Tech Computer Science",
        "preferred_roles": ["Backend Developer", "ML Engineer"],
        "bio": str  (optional)
    }
    """
    parts = []

    if candidate.get("preferred_roles"):
        parts.append("Looking for: " + ", ".join(candidate["preferred_roles"]))

    if candidate.get("skills"):
        parts.append("Skills: " + ", ".join(candidate["skills"]))

    if candidate.get("experience"):
        parts.append("Experience: " + candidate["experience"])

    if candidate.get("education"):
        parts.append("Education: " + candidate["education"])

    if candidate.get("bio"):
        parts.append(candidate["bio"])

    return ". ".join(parts)


def build_job_text(job: dict) -> str:
    """
    Combine job fields into a single string for embedding.

    Expected job dict shape:
    {
        "title": str,
        "company": str,
        "description": str,
        "required_skills": ["Python", "MongoDB", ...],
        "nice_to_have": ["Docker", ...],  (optional)
        "experience_required": "2+ years",
        "role_type": "Full-time"
    }
    """
    parts = []

    if job.get("title"):
        parts.append("Role: " + job["title"])

    if job.get("description"):
        parts.append(job["description"])

    if job.get("required_skills"):
        parts.append("Required skills: " + ", ".join(job["required_skills"]))

    if job.get("nice_to_have"):
        parts.append("Nice to have: " + ", ".join(job["nice_to_have"]))

    if job.get("experience_required"):
        parts.append("Experience required: " + job["experience_required"])

    return ". ".join(parts)


# ── Core matching function ────────────────────────────────────────────────────

def match_candidate_to_jobs(
    candidate: dict,
    job_listings: list[dict],
    top_k: int = 10,
) -> list[dict]:
    """
    Given a candidate profile and a list of jobs, return the top_k
    most relevant jobs ranked by semantic similarity score.

    Returns a list of dicts:
    [
        {
            "job_id": str,
            "title": str,
            "company": str,
            "score": float  (0.0 – 1.0)
        },
        ...
    ]
    """
    if not job_listings:
        return []

    model = get_model()

    candidate_text = build_candidate_text(candidate)
    job_texts = [build_job_text(j) for j in job_listings]

    # Encode
    candidate_vec = model.encode(candidate_text, convert_to_tensor=True)
    job_vecs = model.encode(job_texts, convert_to_tensor=True)

    # Cosine similarity: shape (1, num_jobs)
    scores = util.cos_sim(candidate_vec, job_vecs)[0].cpu().numpy()

    # Pair jobs with scores and sort descending
    paired = [
        {
            "job_id": str(job.get("_id", job.get("job_id", i))),
            "title": job.get("title", ""),
            "company": job.get("company", ""),
            "description": job.get("description", "")[:200],  # brief preview
            "required_skills": job.get("required_skills", []),
            "score": round(float(scores[i]), 4),
        }
        for i, job in enumerate(job_listings)
    ]

    paired.sort(key=lambda x: x["score"], reverse=True)

    return paired[:top_k]


def match_job_to_candidates(
    job: dict,
    candidates: list[dict],
    top_k: int = 20,
) -> list[dict]:
    """
    Given a job listing and a list of candidate profiles, return the
    top_k best-fit candidates. Used by recruiters to pre-screen.

    Returns:
    [
        {
            "candidate_id": str,
            "name": str,
            "score": float
        },
        ...
    ]
    """
    if not candidates:
        return []

    model = get_model()

    job_text = build_job_text(job)
    candidate_texts = [build_candidate_text(c) for c in candidates]

    job_vec = model.encode(job_text, convert_to_tensor=True)
    candidate_vecs = model.encode(candidate_texts, convert_to_tensor=True)

    scores = util.cos_sim(job_vec, candidate_vecs)[0].cpu().numpy()

    paired = [
        {
            "candidate_id": str(c.get("_id", c.get("candidate_id", i))),
            "name": c.get("name", "Anonymous"),
            "skills": c.get("skills", []),
            "score": round(float(scores[i]), 4),
        }
        for i, c in enumerate(candidates)
    ]

    paired.sort(key=lambda x: x["score"], reverse=True)

    return paired[:top_k]
