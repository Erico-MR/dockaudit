def _compute_category_score(criticals: list[dict], warnings: list[dict]) -> int:
    """Compute a score from 0 to 100 based on findings."""
    base_score = 100
    
    # Heuristic penalty: critical = -15, warning = -5
    penalty = (len(criticals) * 15) + (len(warnings) * 5)
    
    score = max(0, base_score - penalty)
    return score

def calculate_infrastructure_scores(
    sec_crit: list[dict], sec_warn: list[dict],
    perf_crit: list[dict], perf_warn: list[dict],
    rel_crit: list[dict], rel_warn: list[dict]
) -> dict[str, int]:
    """Calculate scores for the three pillars: Security, Performance, and Reliability."""
    
    sec_score = _compute_category_score(sec_crit, sec_warn)
    perf_score = _compute_category_score(perf_crit, perf_warn)
    rel_score = _compute_category_score(rel_crit, rel_warn)
    
    # Global score is a weighted average heavily favoring security
    # 50% security, 25% performance, 25% reliability
    global_score = int((sec_score * 0.5) + (perf_score * 0.25) + (rel_score * 0.25))
    
    return {
        "global": global_score,
        "security": sec_score,
        "performance": perf_score,
        "reliability": rel_score
    }
