"""
evaluate.py
-----------
Evaluates the job-candidate matcher on the full synthetic dataset.

Metrics:
  Precision@K  - of the top-K results, what fraction are actually relevant?
  Recall@K     - of all relevant jobs, what fraction did we find in top-K?
  F1@K         - harmonic mean of Precision and Recall.
  NDCG@K       - rewards ranking relevant results higher (standard IR metric).

Run:
    python evaluate.py           # runs K=3, 5, 10
    python evaluate.py --k 5    # specific K
    python evaluate.py --quiet  # aggregate only
"""

import argparse
import numpy as np
from matcher import match_candidate_to_jobs
from dataset import EVAL_DATA


def precision_at_k(predicted, relevant, k):
    hits = sum(1 for jid in predicted[:k] if jid in relevant)
    return hits / k if k > 0 else 0.0


def recall_at_k(predicted, relevant, k):
    hits = sum(1 for jid in predicted[:k] if jid in relevant)
    return hits / len(relevant) if relevant else 0.0


def f1_at_k(predicted, relevant, k):
    p = precision_at_k(predicted, relevant, k)
    r = recall_at_k(predicted, relevant, k)
    return 2 * p * r / (p + r) if (p + r) > 0 else 0.0


def ndcg_at_k(predicted, relevant, k):
    top_k = predicted[:k]
    dcg = sum(
        (1 / np.log2(i + 2)) if top_k[i] in relevant else 0
        for i in range(len(top_k))
    )
    n_ideal = min(len(relevant), k)
    idcg = sum(1 / np.log2(i + 2) for i in range(n_ideal))
    return dcg / idcg if idcg > 0 else 0.0


def evaluate_candidate(entry, k, verbose):
    candidate = entry["candidate"]
    jobs = entry["jobs"]
    relevant = set(entry["relevant_job_ids"])

    results = match_candidate_to_jobs(candidate, jobs, top_k=len(jobs))
    predicted = [r["job_id"] for r in results]

    p    = precision_at_k(predicted, relevant, k)
    r    = recall_at_k(predicted, relevant, k)
    f1   = f1_at_k(predicted, relevant, k)
    ndcg = ndcg_at_k(predicted, relevant, k)

    if verbose:
        tag = lambda jid: "+" if jid in relevant else "-"
        top_tagged = [f"{jid}({tag(jid)})" for jid in predicted[:k]]
        print(f"  {candidate['name']:<22} | top-{k}: {', '.join(top_tagged)}")
        print(f"  {'':22}   P={p:.3f}  R={r:.3f}  F1={f1:.3f}  NDCG={ndcg:.3f}")
        print()

    return {"precision": p, "recall": r, "f1": f1, "ndcg": ndcg}


def run_evaluation(k=3, verbose=True):
    print(f"\n{'='*65}")
    print(f"  EVALUATION  |  {len(EVAL_DATA)} candidates  |  K={k}")
    print(f"{'='*65}\n")

    all_p, all_r, all_f1, all_ndcg = [], [], [], []

    for entry in EVAL_DATA:
        m = evaluate_candidate(entry, k=k, verbose=verbose)
        all_p.append(m["precision"])
        all_r.append(m["recall"])
        all_f1.append(m["f1"])
        all_ndcg.append(m["ndcg"])

    summary = {
        f"mean_precision@{k}": round(float(np.mean(all_p)), 4),
        f"mean_recall@{k}":    round(float(np.mean(all_r)), 4),
        f"mean_f1@{k}":        round(float(np.mean(all_f1)), 4),
        f"mean_ndcg@{k}":      round(float(np.mean(all_ndcg)), 4),
    }

    print(f"{'─'*65}")
    print(f"  AGGREGATE  (n={len(EVAL_DATA)})")
    print(f"{'─'*65}")
    for metric, val in summary.items():
        bar = "=" * int(val * 30) + "." * (30 - int(val * 30))
        print(f"  {metric:<25} {val:.4f}  [{bar}]")
    print(f"{'='*65}\n")
    return summary


def run_all_k(verbose=True):
    results = {}
    for k in [3, 5, 10]:
        results[k] = run_evaluation(k=k, verbose=(verbose and k == 3))

    print(f"\n{'='*65}")
    print(f"  SUMMARY ACROSS K VALUES")
    print(f"{'─'*65}")
    print(f"  {'Metric':<20} {'K=3':>8} {'K=5':>8} {'K=10':>8}")
    print(f"{'─'*65}")
    for m in ["precision", "recall", "f1", "ndcg"]:
        row = f"  {m:<20}"
        for k in [3, 5, 10]:
            row += f"  {results[k][f'mean_{m}@{k}']:>6.4f}"
        print(row)
    print(f"{'='*65}\n")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--k", type=int, default=None)
    parser.add_argument("--quiet", action="store_true")
    args = parser.parse_args()

    if args.k:
        run_evaluation(k=args.k, verbose=not args.quiet)
    else:
        run_all_k(verbose=not args.quiet)
