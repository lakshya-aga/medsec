from typing import List
from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.patient import PatientCreate, PatientResponse
from services.patient import PatientService
from services.session import SessionService
from dependencies import get_current_doctor

router = APIRouter(prefix="/doctor", tags=["doctor"])

@router.post("/patients", response_model=PatientResponse)
async def create_patient(
    patient: PatientCreate,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    return PatientService.create_patient(db, patient, current_user.id)

@router.get("/patients", response_model=List[PatientResponse])
async def get_patients(
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    return PatientService.get_patients_by_doctor(db, current_user.id)

@router.get("/patient/{queue_number}", response_model=PatientResponse)
async def get_patient_by_queue(
    queue_number: int,
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    return PatientService.get_patient_by_queue(db, queue_number, current_user.id)

@router.post("/session/{queue_number}")
async def create_session(
    queue_number: int,
    audio_file: UploadFile = File(...),
    current_user: User = Depends(get_current_doctor),
    db: Session = Depends(get_db)
):
    session = await SessionService.create_session(
        db, queue_number, current_user.id, audio_file
    )
    
    return {
        "message": "Session created successfully",
        "session_id": session.id,
        "transcription": session.transcription
    }
