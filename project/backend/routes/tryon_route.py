from fastapi import APIRouter
from models.tryon_model import TryOnRequest
from replicate_client import run_tryon

router = APIRouter()

@router.post("/api/tryon")
async def tryon_handler(payload: TryOnRequest):
    result_url = run_tryon(payload.user_image_url, payload.cloth_image_url)
    return {"result_url": result_url}
