import docker

def scan_networks(client: docker.DockerClient) -> list[dict]:
    """Extract Docker network details."""
    networks_data = []
    try:
        networks = client.networks.list()
        for n in networks:
            attrs = n.attrs
            data = {
                "id": n.id,
                "name": n.name,
                "driver": attrs.get("Driver", ""),
                "scope": attrs.get("Scope", ""),
                "internal": attrs.get("Internal", False),
                "labels": attrs.get("Labels", {}) or {},
                "containers": list(attrs.get("Containers", {}).keys()),
            }
            networks_data.append(data)
    except Exception:
        pass
        
    return networks_data
