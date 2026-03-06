import json
import typer
import docker
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress, SpinnerColumn, TextColumn

from dockaudit.scanner import containers as scan_containers
from dockaudit.scanner import images as scan_images
from dockaudit.scanner import network as scan_networks
from dockaudit.scanner import daemon as scan_daemon

from dockaudit.analyzer import security as sec_analyzer
from dockaudit.analyzer import performance as perf_analyzer
from dockaudit.analyzer import reliability as rel_analyzer

from dockaudit.scoring.score import calculate_infrastructure_scores

app = typer.Typer(help="DockAudit - Audit your Docker infrastructure in seconds.")
console = Console()

def print_findings_table(title: str, criticals: list, warnings: list, color: str):
    if not criticals and not warnings:
        console.print(f"[{color}]✔ No issues found for {title}[/{color}]")
        return
        
    table = Table(title=title, show_header=True, header_style="bold magenta")
    table.add_column("Level", style="dim")
    table.add_column("Component", style="cyan")
    table.add_column("Rule", style="yellow")
    table.add_column("Message")
    
    for c in criticals:
        table.add_row("[red]CRITICAL[/red]", c["component"], c["rule"], c["message"])
        
    for w in warnings:
        table.add_row("[yellow]WARNING[/yellow]", w["component"], w["rule"], w["message"])
        
    console.print(table)

@app.command()
def scan(
    json_output: bool = typer.Option(False, "--json", help="Output report in JSON format"),
    fail_on: str = typer.Option("none", "--fail-on", help="Exit with code 1 if issues of this level or higher are found (high, critical)")
):
    """
    Audit the local Docker infrastructure (Host, Containers, Images, Networks).
    """
    try:
        client = docker.from_env()
    except Exception as e:
        console.print(f"[red]Error connecting to Docker daemon: {str(e)}[/red]")
        raise typer.Exit(code=1)

    with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        transient=True,
    ) as progress:
        
        # Scanning Phase
        progress.add_task(description="Scanning containers...", total=None)
        c_data = scan_containers.scan_containers(client)
        
        progress.add_task(description="Scanning images...", total=None)
        i_data = scan_images.scan_images(client)
        
        progress.add_task(description="Scanning networks...", total=None)
        _ = scan_networks.scan_networks(client) # Data collected but not scored yet
        
        progress.add_task(description="Scanning daemon...", total=None)
        d_data = scan_daemon.scan_daemon(client)
        
        # Analysis Phase
        progress.add_task(description="Analyzing security rules...", total=None)
        sec_c_crit, sec_c_warn = sec_analyzer.analyze_containers_security(c_data)
        sec_i_crit, sec_i_warn = sec_analyzer.analyze_images_security(i_data)
        sec_d_crit, sec_d_warn = sec_analyzer.analyze_daemon_security(d_data)
        sec_crit = sec_c_crit + sec_i_crit + sec_d_crit
        sec_warn = sec_c_warn + sec_i_warn + sec_d_warn
        
        progress.add_task(description="Analyzing performance rules...", total=None)
        perf_c_crit, perf_c_warn = perf_analyzer.analyze_containers_performance(c_data)
        perf_i_crit, perf_i_warn = perf_analyzer.analyze_images_performance(i_data)
        perf_crit = perf_c_crit + perf_i_crit
        perf_warn = perf_c_warn + perf_i_warn
        
        progress.add_task(description="Analyzing reliability rules...", total=None)
        rel_c_crit, rel_c_warn = rel_analyzer.analyze_containers_reliability(c_data)
        rel_d_crit, rel_d_warn = rel_analyzer.analyze_daemon_reliability(d_data)
        rel_crit = rel_c_crit + rel_d_crit
        rel_warn = rel_c_warn + rel_d_warn
        
        scores = calculate_infrastructure_scores(
            sec_crit, sec_warn,
            perf_crit, perf_warn,
            rel_crit, rel_warn
        )

    if json_output:
        report = {
            "scores": scores,
            "security": {"critical": sec_crit, "warnings": sec_warn},
            "performance": {"critical": perf_crit, "warnings": perf_warn},
            "reliability": {"critical": rel_crit, "warnings": rel_warn},
        }
        console.print_json(json.dumps(report))
    else:
        # Beautiful CLI Report
        score_panel = Panel(
            f"[bold white]Infrastructure Score:[/bold white] {scores['global']}/100\n"
            f"[bold red]Security:[/bold red]    {scores['security']}/100\n"
            f"[bold green]Performance:[/bold green] {scores['performance']}/100\n"
            f"[bold blue]Reliability:[/bold blue] {scores['reliability']}/100",
            title="DockAudit Results",
            expand=False,
            border_style="cyan"
        )
        console.print(score_panel)
        console.print("")
        
        print_findings_table("Security Findings", sec_crit, sec_warn, "red")
        console.print("")
        print_findings_table("Performance Findings", perf_crit, perf_warn, "green")
        console.print("")
        print_findings_table("Reliability Findings", rel_crit, rel_warn, "blue")

    # Fail logic
    if fail_on == "critical" and (sec_crit or perf_crit or rel_crit):
        raise typer.Exit(code=1)
    if fail_on == "high" and (sec_crit or perf_crit or rel_crit or sec_warn or perf_warn or rel_warn):
        raise typer.Exit(code=1)

@app.command()
def image(image_name: str = typer.Argument(..., help="Docker image name to audit")):
    """Audit a specific Docker image."""
    console.print(f"Auditing image: {image_name}")
    console.print("This command is a placeholder. For full analysis, use 'dockaudit scan'.")

@app.command()
def swarm():
    """Audit a Docker Swarm cluster."""
    console.print("Swarm auditing is coming in v0.2!")

@app.command()
def doctor():
    """Check if DockAudit is configured correctly and can communicate with the Docker daemon."""
    console.print("Checking Docker connection...")
    try:
        client = docker.from_env()
        info = client.info()
        console.print(f"[green]✔ Connected successfully to Docker daemon (Server Version: {info.get('ServerVersion')})[/green]")
    except Exception as e:
        console.print(f"[red]✖ Failed to connect to Docker daemon: {str(e)}[/red]")
        raise typer.Exit(code=1)

if __name__ == "__main__":
    app()
