from .auth import router as auth_router
from .doctor import router as doctor_router
from .patient import router as patient_router

__all__ = ["auth_router", "doctor_router", "patient_router"]
