import docker

def scan_images(client: docker.DockerClient) -> list[dict]:
    """Extract metadata and attributes for all local Docker images."""
    images_data = []
    try:
        images = client.images.list()
        for i in images:
            attrs = i.attrs
            data = {
                "id": i.id,
                "tags": i.tags,
                "labels": attrs.get("Config", {}).get("Labels", {}) or {},
                "size": attrs.get("Size", 0),
                "virtual_size": attrs.get("VirtualSize", 0),
                "created": attrs.get("Created", ""),
                "architecture": attrs.get("Architecture", ""),
                "os": attrs.get("Os", ""),
            }
            images_data.append(data)
    except Exception as e:
        pass
        
    return images_data
