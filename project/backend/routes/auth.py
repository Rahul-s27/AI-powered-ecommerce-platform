from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
import os

router = APIRouter()

class Token(BaseModel):
    token: str

@router.post("/auth/google")
def google_auth(token: Token):
    CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID")
    if not CLIENT_ID:
        raise HTTPException(status_code=500, detail="Google Client ID not set in environment.")
    try:
        id_info = id_token.verify_oauth2_token(
            token.token, requests.Request(), CLIENT_ID
        )
        return {
            "email": id_info["email"],
            "name": id_info["name"],
            "picture": id_info["picture"],
        }
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid Google token")
