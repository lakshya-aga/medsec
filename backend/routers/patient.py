from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from services.patient import PatientService
from services.session import SessionService
from dependencies import get_current_patient

router = APIRouter(prefix="/patient", tags=["patient"])

@router.get("/reports")
async def get_patient_reports(
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    patient = PatientService.get_patient_by_phone(db, current_user.phone)
    sessions = SessionService.get_patient_sessions(db, patient.id)
    
    reports = []
    for session in sessions:
        reports.append({
            "id": session.id,
            "created_at": session.created_at,
            "doctor_name": session.doctor.full_name,
            "report_available": bool(session.report_path)
        })
    
    return {
        "patient_name": patient.full_name,
        "reports": reports
    }

@router.get("/report/{session_id}")
async def get_report(
    session_id: int,
    current_user: User = Depends(get_current_patient),
    db: Session = Depends(get_db)
):
    patient = PatientService.get_patient_by_phone(db, current_user.phone)
    session = SessionService.get_session_by_id(db, session_id, patient.id)
    
    return {
        "report_path": session.report_path,
        "transcription": session.transcription,
        "created_at": session.created_at
    }
