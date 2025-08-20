import os
import io
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from config import settings

class PDFGenerator:
    @staticmethod
    def generate_report(patient_data: dict, transcription: str, file_id: str) -> str:
        os.makedirs(settings.reports_dir, exist_ok=True)
        report_path = f"{settings.reports_dir}/{file_id}_report.pdf"
        
        # Create PDF
        c = canvas.Canvas(report_path, pagesize=letter)
        width, height = letter
        
        # Title
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, height - 50, "Medical Report")
        
        # Patient details
        c.setFont("Helvetica-Bold", 12)
        y_position = height - 100
        c.drawString(50, y_position, "Patient Details:")
        
        c.setFont("Helvetica", 10)
        y_position -= 30
        c.drawString(50, y_position, f"Name: {patient_data['full_name']}")
        y_position -= 20
        c.drawString(50, y_position, f"Phone: {patient_data['phone']}")
        y_position -= 20
        c.drawString(50, y_position, f"Age: {patient_data['age']}")
        y_position -= 20
        c.drawString(50, y_position, f"Gender: {patient_data['gender']}")
        
        # Transcription
        c.setFont("Helvetica-Bold", 12)
        y_position -= 40
        c.drawString(50, y_position, "Session Transcription:")
        
        c.setFont("Helvetica", 10)
        y_position -= 30
        
        # Split transcription into lines
        words = transcription.split()
        lines = []
        current_line = ""
        
        for word in words:
            if len(current_line + " " + word) < 80:
                current_line += " " + word if current_line else word
            else:
                lines.append(current_line)
                current_line = word
        if current_line:
            lines.append(current_line)
        
        for line in lines:
            c.drawString(50, y_position, line)
            y_position -= 15
            if y_position < 50:
                c.showPage()
                y_position = height - 50
        
        c.save()
        return report_path
