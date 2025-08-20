from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SessionCreate(BaseModel):
    patient_id: int
    audio_file_path: str

class SessionResponse(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    audio_file_path: Optional[str]
    transcription: Optional[str]
    report_path: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
