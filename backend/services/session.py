import os
import uuid
from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from models.session import Session as SessionModel
from models.patient import Patient
from services.pdf_generator import PDFGenerator
from config import settings

class SessionService:
    @staticmethod
    async def create_session(
        db: Session, 
        queue_number: int, 
        doctor_id: int, 
        audio_file: UploadFile
    ) -> SessionModel:
        # Get patient
        patient = db.query(Patient).filter(
            Patient.queue_number == queue_number,
            Patient.doctor_id == doctor_id
        ).first()
        
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found"
            )
        
        # Save audio file
        os.makedirs(settings.upload_dir, exist_ok=True)
        file_id = str(uuid.uuid4())
        audio_path = f"{settings.upload_dir}/{file_id}_{audio_file.filename}"
        
        with open(audio_path, "wb") as buffer:
            content = await audio_file.read()
            buffer.write(content)
        
        # Mock transcription (replace with actual transcription service)
        transcription = "This is a mock transcription. In production, this would be the actual transcribed text from the audio file."
        
        # Generate PDF report
        patient_data = {
            "full_name": patient.full_name,
            "phone": patient.phone,
            "age": patient.age,
            "gender": patient.gender
        }
        
        report_path = PDFGenerator.generate_report(patient_data, transcription, file_id)
        
        # Create session
        db_session = SessionModel(
            patient_id=patient.id,
            doctor_id=doctor_id,
            audio_file_path=audio_path,
            transcription=transcription,
            report_path=report_path
        )
        
        db.add(db_session)
        
        # Mark patient as completed
        patient.is_completed = True
        
        db.commit()
        db.refresh(db_session)
        
        return db_session
    
    @staticmethod
    def get_patient_sessions(db: Session, patient_id: int) -> List[SessionModel]:
        return db.query(SessionModel).filter(SessionModel.patient_id == patient_id).all()
    
    @staticmethod
    def get_session_by_id(db: Session, session_id: int, patient_id: int) -> SessionModel:
        session = db.query(SessionModel).filter(
            SessionModel.id == session_id,
            SessionModel.patient_id == patient_id
        ).first()
        
        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
        return session