from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
import json
import docker

from app import models, schemas, database
from app.database import engine

# Import dockaudit core
from dockaudit.scanner import containers as scan_containers
from dockaudit.scanner import images as scan_images
from dockaudit.scanner import network as scan_networks
from dockaudit.scanner import daemon as scan_daemon
from dockaudit.analyzer import security as sec_analyzer
from dockaudit.analyzer import performance as perf_analyzer
from dockaudit.analyzer import reliability as rel_analyzer
from dockaudit.analyzer import vulnerabilities as vuln_analyzer
from dockaudit.scoring.score import calculate_infrastructure_scores

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="DockAudit Dashboard API")

# Allow CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, restrict this.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "DockAudit API is running"}

@app.post("/api/scan", response_model=schemas.ScanHistoryResponse)
def trigger_scan(db: Session = Depends(database.get_db)):
    """Triggers a live Docker scan, calculates score, and saves to DB."""
    try:
        client = docker.from_env()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cannot connect to Docker daemon: {str(e)}")

    # Scanning Phase
    c_data = scan_containers.scan_containers(client)
    i_data = scan_images.scan_images(client)
    _ = scan_networks.scan_networks(client)
    d_data = scan_daemon.scan_daemon(client)
    
    # Analysis Phase
    sec_c_crit, sec_c_warn = sec_analyzer.analyze_containers_security(c_data)
    sec_i_crit, sec_i_warn = sec_analyzer.analyze_images_security(i_data)
    osv_i_crit, osv_i_warn = vuln_analyzer.scan_os_vulnerabilities(i_data)
    sec_d_crit, sec_d_warn = sec_analyzer.analyze_daemon_security(d_data)
    
    sec_crit = sec_c_crit + sec_i_crit + sec_d_crit + osv_i_crit
    sec_warn = sec_c_warn + sec_i_warn + sec_d_warn + osv_i_warn
    
    perf_c_crit, perf_c_warn = perf_analyzer.analyze_containers_performance(c_data)
    perf_i_crit, perf_i_warn = perf_analyzer.analyze_images_performance(i_data)
    perf_crit = perf_c_crit + perf_i_crit
    perf_warn = perf_c_warn + perf_i_warn
    
    rel_c_crit, rel_c_warn = rel_analyzer.analyze_containers_reliability(c_data)
    rel_d_crit, rel_d_warn = rel_analyzer.analyze_daemon_reliability(d_data)
    rel_crit = rel_c_crit + rel_d_crit
    rel_warn = rel_c_warn + rel_d_warn
    
    scores = calculate_infrastructure_scores(
        sec_crit, sec_warn, perf_crit, perf_warn, rel_crit, rel_warn
    )
    
    report = {
        "security": {"critical": sec_crit, "warnings": sec_warn},
        "performance": {"critical": perf_crit, "warnings": perf_warn},
        "reliability": {"critical": rel_crit, "warnings": rel_warn},
    }
    
    # Save to SQLite
    db_scan = models.ScanHistory(
        global_score=scores["global"],
        security_score=scores["security"],
        performance_score=scores["performance"],
        reliability_score=scores["reliability"],
        findings_json=json.dumps(report)
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    
    return db_scan

@app.get("/api/scans/history", response_model=list[schemas.ScanHistoryResponse])
def get_scan_history(skip: int = 0, limit: int = 20, db: Session = Depends(database.get_db)):
    """Retrieve historical scan records."""
    return db.query(models.ScanHistory).order_by(models.ScanHistory.timestamp.desc()).offset(skip).limit(limit).all()

@app.get("/api/scans/latest", response_model=schemas.ScanHistoryResponse)
def get_latest_scan(db: Session = Depends(database.get_db)):
    """Retrieve the most recent scan."""
    scan = db.query(models.ScanHistory).order_by(models.ScanHistory.timestamp.desc()).first()
    if not scan:
        raise HTTPException(status_code=404, detail="No scans found")
    return scan
