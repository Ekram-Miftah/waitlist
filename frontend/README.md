Full-Stack Waitlist Application: Assessment Submission
This project fully implements the required Waitlist & Admin Dashboard using FastAPI (Backend) and Next.js (Frontend).

🚀 Live Access
Detail Value
Live Frontend URL https://waitfront.vercel.app
LIVE FRONTED ADMIN lOGIN url https://waitfront.vercel.app/admin/login
Live Backend API URL https://waitlist-3-dmcw.onrender.com
Admin Dashboard Password ADMIN_PASSWORD
GitHub Repository (https://github.com/Ekram-Miftah/waitlist)

✨ Core Features
Feature Notes
Waitlist Signup Public page with email validation. Handles duplicate entries (HTTP 409) gracefully.
Email Confirmation Sends a "Welcome" email via Resend API upon successful signup.
Admin Dashboard Password-protected view of all waitlist entries, including signup date.
Stack Backend: FastAPI (SQLAlchemy). Frontend: Next.js (Tailwind CSS).
Deployment Vercel (Frontend) and Render (Backend/Database).

Export to Sheets
⚙️ Local Setup
Prerequisites
Python 3.9+

Node.js (LTS) & npm

PostgreSQL DB

Resend API Key

1. Backend (FastAPI)
   Navigate to /backend.

Create .env with DATABASE_URL, ADMIN_PASSWORD, and RESEND_API_KEY.

Run: pip install -r requirements.txt then uvicorn main:app --reload

2. Frontend (Next.js)
   Navigate to /frontend.

Create .env.local: NEXT_PUBLIC_API_BASE_URL="http://localhost:8000"

Run: npm install then npm run dev
