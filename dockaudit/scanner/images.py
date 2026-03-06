import docker

def scan_images(client: docker.DockerClient, image_name: str = None) -> list[dict]:
    """Extract metadata and attributes for local Docker images."""
    images_data = []
    
    if image_name:
        # Let ImageNotFound bubble up to the CLI for proper error handling
        images = [client.images.get(image_name)]
    else:
        try:
            images = client.images.list()
        except Exception:
            images = []
            
    for i in images:
        try:
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
        except Exception:
            pass
        
    return images_data
