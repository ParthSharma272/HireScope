# backend/models/schemas.py
from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class HeatmapEntry(BaseModel):
    sentence: str
    score: float
    start: int
    end: int

class Scores(BaseModel):
    role: str
    structural: float
    keyword: float
    semantic: float
    readability: float
    tone: float
    composite: float

class ResumeResponse(BaseModel):
    id: str
    metadata: Dict[str, Any]
    sections: Dict[str, str]
    scores: Scores
    keywords: Dict[str, Any]
    heatmap: List[HeatmapEntry]
    insight: str
    report_url: Optional[str]
