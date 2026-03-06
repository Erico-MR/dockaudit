import docker

def scan_swarm(client: docker.DockerClient) -> dict:
    """Extract Swarm mode details and Node inventory."""
    swarm_info = {}
    try:
        if client.swarm.attrs:
            swarm_info = {
                "active": True,
                "id": client.swarm.attrs.get("ID"),
                "spec": client.swarm.attrs.get("Spec", {}),
                "nodes": [],
                "unlock_key_set": client.swarm.attrs.get("Spec", {}).get("EncryptionConfig", {}).get("AutoLockManagers", False)
            }
            # List nodes if manager
            try:
                nodes = client.nodes.list()
                for n in nodes:
                    swarm_info["nodes"].append({
                        "id": n.id,
                        "role": n.attrs.get("Spec", {}).get("Role", "worker"),
                        "status": n.attrs.get("Status", {}).get("State", "unknown"),
                        "addr": n.attrs.get("Status", {}).get("Addr", ""),
                        "engine_version": n.attrs.get("Description", {}).get("Engine", {}).get("EngineVersion", "")
                    })
            except Exception:
                pass
    except Exception:
        swarm_info = {"active": False}
        
    return swarm_info

def scan_configs(client: docker.DockerClient) -> list[dict]:
    """Extract Docker configs metadata."""
    configs_data = []
    try:
        # Check if version supports configs (Swarm only)
        configs = client.configs.list()
        for c in configs:
            attrs = c.attrs
            configs_data.append({
                "id": c.id,
                "name": attrs.get("Spec", {}).get("Name", ""),
                "labels": attrs.get("Spec", {}).get("Labels", {}) or {},
                "created": attrs.get("CreatedAt", "")
            })
    except Exception:
        pass
    return configs_data

def scan_secrets(client: docker.DockerClient) -> list[dict]:
    """Extract Docker secrets metadata (names/labels only)."""
    secrets_data = []
    try:
        secrets = client.secrets.list()
        for s in secrets:
            attrs = s.attrs
            secrets_data.append({
                "id": s.id,
                "name": attrs.get("Spec", {}).get("Name", ""),
                "labels": attrs.get("Spec", {}).get("Labels", {}) or {},
                "created": attrs.get("CreatedAt", "")
            })
    except Exception:
        pass
    return secrets_data
