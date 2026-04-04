# ML Service — Job-Candidate Matcher

Semantic matching engine using **Sentence Transformers (SBERT)**.  
Exposes a Flask API that the backend calls to get ranked job/candidate matches.

---

## Why SBERT, not LSTM?

| Approach | Why not |
|---|---|
| LSTM | Built for sequential data (time-series, text generation). Not a similarity tool. |
| TF-IDF | Keyword overlap only. Misses semantic meaning ("ML Engineer" ≠ "machine learning role"). |
| **SBERT** ✅ | Encodes text into dense semantic vectors. Cosine similarity gives meaningful match scores. Fast. No training data needed. |

Model used: `all-MiniLM-L6-v2` — 80MB, runs on CPU, very fast inference.

---

## File Structure

```
ml/
├── matcher.py       # Core matching logic (import this in tests)
├── api.py           # Flask server — exposes /match/jobs and /match/candidates
├── evaluate.py      # F1, Precision, Recall, NDCG evaluation on synthetic data
├── requirements.txt
├── .env.example     # Copy to .env
└── README.md
```

---

## Setup

```bash
cd ml

# Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy env file
cp .env.example .env

# First run downloads the model (~80MB, one-time only)
python api.py
```

---

## Running the Server

```bash
python api.py
# → Running on http://localhost:5001
```

Health check:
```bash
curl http://localhost:5001/health
# {"status": "ok", "service": "job-matcher-ml"}
```

---

## API Reference

### `POST /match/jobs`
Returns ranked jobs for a candidate.

```json
Request:
{
  "candidate": {
    "candidate_id": "abc123",
    "skills": ["Python", "React"],
    "experience": "2 years backend development",
    "education": "B.Tech CS",
    "preferred_roles": ["Backend Developer"]
  },
  "jobs": [...],
  "top_k": 10
}

Response:
{
  "matches": [
    { "job_id": "xyz", "title": "...", "company": "...", "score": 0.87 },
    ...
  ]
}
```

### `POST /match/candidates`
Returns ranked candidates for a job (recruiter view).

```json
Request:
{
  "job": { "job_id": "xyz", "title": "...", "description": "...", "required_skills": [...] },
  "candidates": [...],
  "top_k": 20
}

Response:
{
  "matches": [
    { "candidate_id": "abc", "name": "...", "skills": [...], "score": 0.91 },
    ...
  ]
}
```

---

## Running Evaluation

```bash
python evaluate.py
```

Outputs Precision@K, Recall@K, F1@K, and NDCG@K on the synthetic dataset.  
To show judges: screenshot this output. It proves you understand model validation.

---

## How the Backend Calls This

In your Node.js backend (`backend/`), call the ML service like this:

```javascript
const axios = require('axios');

async function getMatchedJobs(candidate, jobs) {
  const res = await axios.post('http://localhost:5001/match/jobs', {
    candidate,
    jobs,
    top_k: 10
  });
  return res.data.matches;
}
```

---

## Improving Accuracy (post-hackathon)

1. **Collect implicit feedback** — if a candidate applies to a job, that's a positive signal. Fine-tune with this data.
2. **Add filters** — location, salary range, job type as hard filters before running matcher.
3. **Upgrade model** — swap `all-MiniLM-L6-v2` for `all-mpnet-base-v2` for ~5% better accuracy.
4. **Re-ranking** — use the base matcher to get top-50, then apply a cross-encoder for final top-10.
