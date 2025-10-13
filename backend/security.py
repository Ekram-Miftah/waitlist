

import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials, OAuth2PasswordBearer
from dotenv import load_dotenv
import secrets

load_dotenv()

ADMIN_USERNAME = "admin" 

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD") 



security = HTTPBasic() 

def authenticate_admin(credentials: HTTPBasicCredentials = Depends(security)):
    """
    Checks the username and password against the configured admin credentials.
    This is typically used for a Basic Auth endpoint, NOT a token endpoint.
    """
    
    if not ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server Misconfiguration: Admin password not set.",
        )

    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin credentials.",
            headers={"WWW-Authenticate": "Basic"},
        )
    
   
    return credentials.username