import docker

def scan_volumes(client: docker.DockerClient) -> list[dict]:
    """Extract Docker volume details for security auditing."""
    volumes_data = []
    try:
        volumes = client.volumes.list()
        for v in volumes:
            attrs = v.attrs
            data = {
                "name": v.name,
                "driver": attrs.get("Driver", ""),
                "mountpoint": attrs.get("Mountpoint", ""),
                "labels": attrs.get("Labels", {}) or {},
                "options": attrs.get("Options", {}) or {},
                "scope": attrs.get("Scope", "local"),
            }
            volumes_data.append(data)
    except Exception:
        pass
        
    return volumes_data
