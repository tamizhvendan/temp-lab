import secrets

from fastapi import Request
from config import settings
from starlette.middleware.base import BaseHTTPMiddleware

admin_sessions = {}

def authenticate_admin(username, password):
    correct_username = secrets.compare_digest(username, settings.ADMIN_USERNAME)
    correct_password = secrets.compare_digest(password, settings.ADMIN_PASSWORD)
    if correct_username and correct_password:
        token = secrets.token_hex(16) 
        admin_sessions[token] = True
        return token
    else:
        return None
    
def is_admin(admin_session_token):
    return admin_session_token in admin_sessions 

class AdminAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        admin_session_token = request.cookies.get("admin_session")
        if is_admin(admin_session_token):
            request.state.is_admin = True
        response = await call_next(request)
        return response