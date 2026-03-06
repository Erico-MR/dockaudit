def analyze_containers_performance(containers: list[dict]) -> tuple[list[dict], list[dict]]:
    """Analyze containers for performance and resource limits."""
    critical = []
    warnings = []
    
    for c in containers:
        name = c["name"]
        
        # 1. Missing Memory Limit
        mem_limit = c.get("mem_limit", 0)
        if mem_limit == 0:
            warnings.append({"component": name, "rule": "No memory limit", "message": f"Container {name} has no memory limit set. It could consume host resources uncontrollably.", "type": "container"})
            
        # 2. Missing CPU Shares/Quota
        cpu_shares = c.get("cpu_shares", 0)
        if cpu_shares == 0:
            warnings.append({"component": name, "rule": "No CPU limit", "message": f"Container {name} has no CPU limits or shares defined.", "type": "container"})

    return critical, warnings

def analyze_images_performance(images: list[dict]) -> tuple[list[dict], list[dict]]:
    """Analyze images for performance (e.g. bloated sizes)."""
    warnings = []
    
    LARGE_IMAGE_THRESHOLD = 1024 * 1024 * 1024  # 1GB
    
    for i in images:
        size = i.get("size", 0)
        tags = i.get("tags", [])
        name = tags[0] if tags else i.get("id")[:12]
        
        if size > LARGE_IMAGE_THRESHOLD:
            size_gb = size / (1024 * 1024 * 1024)
            warnings.append({"component": name, "rule": "Bloated image size", "message": f"Image {name} is unusually large ({size_gb:.2f} GB). Consider using a slim or alpine base image.", "type": "image"})
            
    return [], warnings
