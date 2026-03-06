import docker

def scan_networks(client: docker.DockerClient) -> list[dict]:
    """Extract Docker network details."""
    networks_data = []
    try:
        networks = client.networks.list()
        for n in networks:
            attrs = n.attrs
            options = attrs.get("Options", {})
            data = {
                "id": n.id,
                "name": n.name,
                "driver": attrs.get("Driver", ""),
                "scope": attrs.get("Scope", ""),
                "internal": attrs.get("Internal", False),
                "options": options,
                "icc": options.get("com.docker.network.bridge.enable_icc", "true").lower() == "true",
                "encrypted": options.get("encrypted") is not None,
                "labels": attrs.get("Labels", {}) or {},
                "containers": list(attrs.get("Containers", {}).keys()),
            }
            networks_data.append(data)
    except Exception:
        pass
        
    return networks_data
