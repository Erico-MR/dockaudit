# DockAudit

**Audit your Docker infrastructure in seconds.**

Most Docker infrastructures are misconfigured. I built an open source tool to detect them. 
DockAudit unifies container security, performance, and reliability checks into a single, fast, beautifully rendered CLI tool, inspired by CIS Docker Benchmarks.

## Installation

```bash
pip install dockaudit
```

Or run via Docker:

```bash
docker run \
  -v /var/run/docker.sock:/var/run/docker.sock \
  ercdockercr/dockaudit scan
```

## Usage

```bash
dockaudit scan
```

**Output Example:**
```text
Infrastructure Score: 74/100

Security:
- container running as root
- exposed redis port

Performance:
- memory limit missing on 3 containers

Reliability:
- restart policy missing
```

## Features

- **Container Audit**: Privileged flags, root capabilities, read-only filesystems, resource limits.
- **Image Audit**: Vulnerabilities, outdated bases, layer bloat.
- **Network Audit**: Exposed ports, host network risks.
- **Host Audit**: Daemon security, TLS, user namespace.
- **Secrets Audit**: Detects credentials and tokens in environment variables.

## Development

1. Clone the repository: `git clone https://github.com/Erico-MR/dockaudit`
2. Install in editable mode: `pip install -e .`
3. Run `dockaudit --help`
