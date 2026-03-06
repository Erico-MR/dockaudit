from sqlalchemy import Column, Integer, String, Float, DateTime
from app.database import Base
from datetime import datetime, timezone

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    global_score = Column(Float, index=True)
    security_score = Column(Float)
    performance_score = Column(Float)
    reliability_score = Column(Float)
    
    # We store the raw JSON string of the findings for detailed view
    findings_json = Column(String)
