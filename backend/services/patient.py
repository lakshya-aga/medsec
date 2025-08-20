from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.patient import Patient
from schemas.patient import PatientCreate, PatientUpdate

class PatientService:
    @staticmethod
    def create_patient(db: Session, patient_data: PatientCreate, doctor_id: int) -> Patient:
        # Check if patient exists
        existing_patient = db.query(Patient).filter(
            Patient.phone == patient_data.phone
        ).first()
        
        if existing_patient:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Patient with this phone number already exists"
            )
        
        # Generate queue number
        last_patient = db.query(Patient).order_by(Patient.queue_number.desc()).first()
        queue_number = (last_patient.queue_number + 1) if last_patient else 1
        
        db_patient = Patient(
            full_name=patient_data.full_name,
            phone=patient_data.phone,
            email=patient_data.email,
            age=patient_data.age,
            gender=patient_data.gender,
            queue_number=queue_number,
            doctor_id=doctor_id
        )
        
        db.add(db_patient)
        db.commit()
        db.refresh(db_patient)
        return db_patient
    
    @staticmethod
    def get_patients_by_doctor(db: Session, doctor_id: int) -> List[Patient]:
        return db.query(Patient).filter(Patient.doctor_id == doctor_id).all()
    
    @staticmethod
    def get_patient_by_queue(db: Session, queue_number: int, doctor_id: int) -> Patient:
        patient = db.query(Patient).filter(
            Patient.queue_number == queue_number,
            Patient.doctor_id == doctor_id
        ).first()
        
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found"
            )
        return patient
    
    @staticmethod
    def get_patient_by_phone(db: Session, phone: str) -> Patient:
        patient = db.query(Patient).filter(Patient.phone == phone).first()
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No patient record found"
            )
        return patient
    
    @staticmethod
    def update_patient(db: Session, patient_id: int, patient_data: PatientUpdate) -> Patient:
        patient = db.query(Patient).filter(Patient.id == patient_id).first()
        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found"
            )
        
        for field, value in patient_data.dict(exclude_unset=True).items():
            setattr(patient, field, value)
        
        db.commit()
        db.refresh(patient)
        return patient
