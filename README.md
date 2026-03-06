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

To export findings for CI/CD or automated pipelines:
```bash
dockaudit scan --format json
dockaudit scan --format sarif
```

**Output Example:**
```text
⠴ Scanning containers...
⠴ Scanning images...
⠴ Scanning networks...
⠴ Scanning daemon...

Security Findings:
- container prici-web-1 running as root ✖
- exposed redis port ✖
- OSV API: alpine:3.14 vulnerabilities detected ✖

Performance Findings:
- memory limit missing on 3 containers ✖

Reliability Findings:
- restart policy missing ✖

Infrastructure Score: 74/100
Security: 40/100
Performance: 90/100
Reliability: 90/100
```

## Features

- **Container Audit**: Privileged flags, root capabilities, read-only filesystems, resource limits.
- **Image Audit**: Vulnerabilities (via the official Google OSV API database), outdated bases, layer bloat.
- **Network Audit**: Exposed ports, host network risks.
- **Host Audit**: Daemon security, TLS, user namespace.
- **Secrets Audit**: Detects credentials and tokens in environment variables.
- **CI/CD Integration**: Export to SARIF / JSON directly to GitHub Advanced Security or custom dev security pipelines.

## Development

1. Clone the repository: `git clone https://github.com/Erico-MR/dockaudit`
2. Install in editable mode: `pip install -e .`
3. Run `dockaudit --help`
