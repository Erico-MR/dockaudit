def analyze_containers_reliability(containers: list[dict]) -> tuple[list[dict], list[dict]]:
    """Analyze containers for reliability features."""
    critical = []
    warnings = []
    
    for c in containers:
        name = c["name"]
        
        # 1. Missing Restart Policy
        restart_policy = c.get("restart_policy", {})
        policy_name = restart_policy.get("Name", "no")
        
        if not policy_name or policy_name == "no" or policy_name == "":
            warnings.append({"component": name, "rule": "No restart policy", "message": f"Container {name} doesn't have a configured restart policy (like 'always' or 'unless-stopped').", "type": "container"})
            
        # 2. Missing Healthcheck
        health = c.get("healthcheck")
        if not health or not health.get("Test"):
            warnings.append({"component": name, "rule": "No healthcheck", "message": f"Container {name} does not have a HEALTHCHECK instruction defined.", "type": "container"})

    return critical, warnings

def analyze_daemon_reliability(daemon: dict) -> tuple[list[dict], list[dict]]:
    """Analyze daemon for reliability misconfigurations."""
    warnings = []
    
    if not daemon:
        return [], []
        
    if not daemon.get("live_restore"):
        warnings.append({"component": "daemon", "rule": "Live restore disabled", "message": "Docker daemon live-restore is disabled. Containers will stop if the daemon restarts.", "type": "daemon"})
        
    return [], warnings
