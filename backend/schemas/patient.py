from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PatientBase(BaseModel):
    full_name: str
    phone: str
    age: int
    gender: str
    email: Optional[str] = None

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    email: Optional[str] = None

class PatientResponse(PatientBase):
    id: int
    queue_number: int
    created_at: datetime
    is_completed: bool
    
    class Config:
        from_attributes = True
