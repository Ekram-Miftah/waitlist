from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import os
from dotenv import load_dotenv

from database import create_tables, get_db, WaitlistEntry
from security import authenticate_admin
from email_service import send_confirmation_email 

# --- Configuration ---
load_dotenv()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD") # Used by security.py

# --- App Initialization ---
app = FastAPI(
    title="Waitlist Assessment API",
    description="FastAPI Backend for the Full-Stack Waitlist Application.",
    version="1.0.0"
)

# Run once at startup to ensure the table exists (Good practice)
create_tables()

# --- Pydantic Schemas (Data validation) ---

# Defines the expected data when a user signs up
class SignupRequest(BaseModel):
    email: EmailStr 

# Defines the data returned for a waitlist entry
class WaitlistEntryResponse(BaseModel):
    id: int
    email: EmailStr
    signup_date: str 
    
# Defines the successful response for admin login (Frontend expects a 'token')
class AdminLoginResponse(BaseModel):
    message: str
    token: str # Placeholder token for successful admin session

# --- CORS Middleware (Crucial for connecting Frontend/Backend) ---

origins = [
    "http://localhost:3000", # Allows local Next.js development
   "https://waitfront.vercel.app/"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------------------
# --- 1. Public Routes ---
# ----------------------------------------

@app.get("/api/v1/health")
def health_check():
    return {"status": "ok", "message": "API is running."}

@app.post("/api/v1/signup", status_code=status.HTTP_201_CREATED)
def waitlist_signup(
    request: SignupRequest, 
    db: Session = Depends(get_db)
):
    # 1. Check for Duplicate Email
    existing_entry = db.query(WaitlistEntry).filter(WaitlistEntry.email == request.email).first()
    if existing_entry:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered on the waitlist."
        )

    # 2. Create and Save New Entry (SQLAlchemy ORM)
    new_entry = WaitlistEntry(email=request.email)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    try:
        send_confirmation_email(request.email)
    except Exception as e:
        print(f"Error sending email to {request.email}: {e}")

    return {"message": "Success! Welcome to the waitlist. Check your email."}

# ----------------------------------------
# --- 2. Admin Routes (Authentication Required) ---
# ----------------------------------------

# 🚨 THIS IS THE MISSING ROUTE THAT FIXES THE 404 ERROR 🚨
@app.post("/api/v1/admin/login", response_model=AdminLoginResponse)
def admin_login(
    # This dependency handles the Basic Auth check. If successful, it passes.
    auth_user: str = Depends(authenticate_admin) 
):
    """
    Handles admin login. Success is determined by the `authenticate_admin` dependency.
    Returns a success message and a placeholder token required by the frontend store.
    """
    # In a real application, you would generate a JWT here.
    return AdminLoginResponse(
        message=f"Admin '{auth_user}' logged in successfully.", 
        token="placeholder-admin-session-token-12345" 
    )


@app.get("/api/v1/waitlist", response_model=list[WaitlistEntryResponse])
def get_all_waitlist_entries(
    # This dependency ensures only authenticated users can access this route
    auth_user: str = Depends(authenticate_admin),
    db: Session = Depends(get_db)
):
    """Fetches all waitlist entries for the admin dashboard."""
    
    entries = db.query(WaitlistEntry).order_by(WaitlistEntry.signup_date.desc()).all()
    
    # Format data for the frontend
    response_data = []
    for entry in entries:
        response_data.append(WaitlistEntryResponse(
            id=entry.id,
            email=entry.email,
            signup_date=entry.signup_date.strftime("%Y-%m-%d %H:%M:%S") 
        ))

    return response_data