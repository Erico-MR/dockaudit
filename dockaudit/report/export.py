import json

def export_json(scores: dict, sec_crit: list, sec_warn: list, perf_crit: list, perf_warn: list, rel_crit: list, rel_warn: list) -> str:
    """Export the findings to JSON."""
    report = {
        "scores": scores,
        "security": {"critical": sec_crit, "warnings": sec_warn},
        "performance": {"critical": perf_crit, "warnings": perf_warn},
        "reliability": {"critical": rel_crit, "warnings": rel_warn},
    }
    return json.dumps(report, indent=2)

def _map_to_sarif_results(criticals: list, warnings: list, category: str) -> list[dict]:
    results = []
    for c in criticals:
        results.append({
            "ruleId": f"DA-{category.upper()}-CRIT",
            "level": "error",
            "message": {"text": c["message"]},
            "locations": [{"physicalLocation": {"artifactLocation": {"uri": c["component"]}}}]
        })
    for w in warnings:
        results.append({
            "ruleId": f"DA-{category.upper()}-WARN",
            "level": "warning",
            "message": {"text": w["message"]},
            "locations": [{"physicalLocation": {"artifactLocation": {"uri": w["component"]}}}]
        })
    return results

def export_sarif(scores: dict, sec_crit: list, sec_warn: list, perf_crit: list, perf_warn: list, rel_crit: list, rel_warn: list) -> str:
    """Export the findings to SARIF format for CI/CD integration (e.g. GitHub Advanced Security)."""
    
    results = []
    results.extend(_map_to_sarif_results(sec_crit, sec_warn, "security"))
    results.extend(_map_to_sarif_results(perf_crit, perf_warn, "performance"))
    results.extend(_map_to_sarif_results(rel_crit, rel_warn, "reliability"))

    sarif = {
        "$schema": "https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json",
        "version": "2.1.0",
        "runs": [
            {
                "tool": {
                    "driver": {
                        "name": "DockAudit",
                        "informationUri": "https://github.com/Erico-MR/dockaudit",
                        "version": "1.0.2"
                    }
                },
                "results": results
            }
        ]
    }
    return json.dumps(sarif, indent=2)
