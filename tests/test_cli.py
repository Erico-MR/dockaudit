from typer.testing import CliRunner
from dockaudit.cli import app

runner = CliRunner()

def test_app_help():
    """Test the CLI help command."""
    result = runner.invoke(app, ["--help"])
    assert result.exit_code == 0
    assert "DockAudit - Audit your Docker infrastructure in seconds" in result.stdout
    assert "scan" in result.stdout
    assert "doctor" in result.stdout

def test_doctor_command(monkeypatch):
    """Test doctor command output conceptually."""
    # This just ensures the command schema is properly hooked up
    # We fake the docker client logic if we wanted to unit test it purely
    result = runner.invoke(app, ["doctor", "--help"])
    assert result.exit_code == 0
    assert "Check if DockAudit is configured correctly" in result.stdout
