import os
import resend # <--- CHANGE 1: Import the module directly
from dotenv import load_dotenv

load_dotenv()

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL") 

# 1. Initialize Resend (Set the API key on the module itself)
if RESEND_API_KEY:
    resend.api_key = RESEND_API_KEY # <--- CHANGE 2: Assign API key directly
else:
    # Handle case where API key is not set (for local testing without email)
    # We set it to None so the sending function can check it
    resend.api_key = None 

# 2. Define the sending function
def send_confirmation_email(recipient_email: str):
    """Sends a 'Welcome to the waitlist!' confirmation email."""

    # Check the API key on the module
    if not resend.api_key:
        print(f"RESEND_API_KEY not set. Skipping email to {recipient_email}.")
        return

    try:
        # Note: resend.emails.send is the correct method call
        resend.emails.send({
            "from": f"Luminary Labs <{SENDER_EMAIL}>",
            "to": [recipient_email],
            "subject": "✅ You're on the Waitlist for Luminary Labs!",
            "html": f"""
                <p>Hi there,</p>
                <p>You've successfully joined the waitlist for **Luminary Labs**! We're excited to have you.</p>
                <p>We'll notify you as soon as we launch and you can start exploring future efficiency.</p>
                <p>Best regards,<br>The Luminary Labs Team</p>
            """
        })
        print(f"Confirmation email successfully sent to {recipient_email}")
    except Exception as e:
        print(f"Failed to send email to {recipient_email}: {e}")
        # IMPORTANT: In a production app, you might log this error, but
        # the main signup process should not fail just because the email did.