import docker

def scan_daemon(client: docker.DockerClient) -> dict:
    """Extract Docker daemon attributes."""
    daemon_data = {}
    try:
        info = client.info()
        daemon_data = {
            "id": info.get("ID", ""),
            "name": info.get("Name", ""),
            "server_version": info.get("ServerVersion", ""),
            "operating_system": info.get("OperatingSystem", ""),
            "security_options": info.get("SecurityOptions", []),
            "experimental_build": info.get("ExperimentalBuild", False),
            "live_restore": info.get("LiveRestoreEnabled", False),
            "isolation": info.get("Isolation", ""),
            "cgroup_driver": info.get("CgroupDriver", ""),
            "default_runtime": info.get("DefaultRuntime", ""),
            "swarm_status": info.get("Swarm", {}).get("LocalNodeState", "inactive")
        }
    except Exception as e:
        pass
        
    return daemon_data
