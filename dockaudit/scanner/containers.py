import docker

def scan_containers(client: docker.DockerClient) -> list[dict]:
    """Extract relevant security, performance, and reliability data from running containers."""
    containers_data = []
    try:
        containers = client.containers.list(all=True)
        for c in containers:
            attrs = c.attrs
            host_config = attrs.get("HostConfig", {})
            config = attrs.get("Config", {})
            network_settings = attrs.get("NetworkSettings", {})
            
            data = {
                "id": c.id,
                "name": c.name,
                "image": config.get("Image", ""),
                "status": attrs.get("State", {}).get("Status", ""),
                "labels": config.get("Labels", {}),
                "privileged": host_config.get("Privileged", False),
                "user": config.get("User", ""),
                "readonly_rootfs": host_config.get("ReadonlyRootfs", False),
                "cap_add": host_config.get("CapAdd") or [],
                "cap_drop": host_config.get("CapDrop") or [],
                "security_opt": host_config.get("SecurityOpt") or [],
                "env": config.get("Env", []),
                "mem_limit": host_config.get("Memory", 0),
                "cpu_shares": host_config.get("CpuShares", 0),
                "restart_policy": host_config.get("RestartPolicy", {}),
                "healthcheck": config.get("Healthcheck", None),
                "network_mode": host_config.get("NetworkMode", ""),
                "ports": network_settings.get("Ports", {}),
            }
            containers_data.append(data)
    except Exception:
        pass
    
    return containers_data
