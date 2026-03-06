from pydantic import BaseModel
from datetime import datetime
from typing import Any

class ScanHistoryBase(BaseModel):
    global_score: float
    security_score: float
    performance_score: float
    reliability_score: float
    findings_json: str

class ScanHistoryCreate(ScanHistoryBase):
    pass

class ScanHistoryResponse(ScanHistoryBase):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True
