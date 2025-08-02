from pydantic import BaseModel

class TryOnRequest(BaseModel):
    user_image_url: str
    cloth_image_url: str
