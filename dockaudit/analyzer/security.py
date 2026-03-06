import re

DANGEROUS_PORTS = {
    "22/tcp": "SSH",
    "3306/tcp": "MySQL",
    "5432/tcp": "PostgreSQL",
    "6379/tcp": "Redis",
    "27017/tcp": "MongoDB",
    "9200/tcp": "Elasticsearch",
}

SECRET_REGEX = re.compile(r"(?i)(password|secret|token|api_key|cert|key)=")

def analyze_containers_security(containers: list[dict]) -> tuple[list[dict], list[dict]]:
    """Analyze containers for security misconfigurations."""
    critical = []
    warnings = []
    
    for c in containers:
        name = c["name"]
        
        # 1. Privileged mode
        if c.get("privileged"):
            critical.append({"component": name, "rule": "Privileged container", "message": f"Container {name} is running in privileged mode. This grants it root-level access to the host.", "type": "container"})
            
        # 2. Root user
        user = c.get("user", "")
        if not user or user == "root" or user == "0":
            warnings.append({"component": name, "rule": "Root user", "message": f"Container {name} is running as root. Best practice is to run as a non-root user.", "type": "container"})
            
        # 3. Readonly rootfs
        if not c.get("readonly_rootfs"):
            warnings.append({"component": name, "rule": "Writable root filesystem", "message": f"Container {name} does not have a read-only root filesystem.", "type": "container"})
            
        # 4. Capabilities
        cap_add = c.get("cap_add", [])
        for cap in cap_add:
            if cap in ["SYS_ADMIN", "NET_ADMIN", "ALL"]:
                critical.append({"component": name, "rule": "Dangerous capability", "message": f"Container {name} has dangerous capability added: {cap}", "type": "container"})
                
        # 5. Secrets in ENV
        envs = c.get("env", [])
        for env in envs:
            if SECRET_REGEX.search(env):
                critical.append({"component": name, "rule": "Secret in environment variable", "message": f"Container {name} likely exposes a secret in environment variables: {env.split('=')[0]}", "type": "container"})
                
        # 6. Exposed dangerous ports
        ports = c.get("ports", {})
        for port, bindings in ports.items():
            if not bindings:
                continue
            for bind in bindings:
                if bind.get("HostIp") == "0.0.0.0" and port in DANGEROUS_PORTS:
                    critical.append({"component": name, "rule": "Exposed dangerous port", "message": f"Container {name} exposes {DANGEROUS_PORTS[port]} port {port} to the public internet (0.0.0.0).", "type": "container"})

    return critical, warnings

def analyze_images_security(images: list[dict]) -> tuple[list[dict], list[dict]]:
    """Analyze images for security misconfigurations."""
    warnings = []
    
    for i in images:
        for tag in i.get("tags", []):
            if ":latest" in tag:
                warnings.append({"component": tag.split(':')[0], "rule": "'latest' tag used", "message": f"Image {tag} uses the 'latest' tag. Pinned versions are recommended for reproducible builds.", "type": "image"})
                break
                
    return [], warnings

def analyze_daemon_security(daemon: dict) -> tuple[list[dict], list[dict]]:
    """Analyze docker daemon for security misconfigurations."""
    warnings = []
    
    if not daemon:
        return [], []
        
    opts = daemon.get("security_options", [])
    has_userns = False
    for opt in opts:
        if "name=userns" in opt:
            has_userns = True
            
    if not has_userns:
        warnings.append({"component": "daemon", "rule": "User namespaces disabled", "message": "Docker daemon does not have user namespace remapping enabled. This risks root escalation.", "type": "daemon"})
        
    return [], warnings
