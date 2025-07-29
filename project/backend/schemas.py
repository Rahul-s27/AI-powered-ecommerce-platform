from pydantic import BaseModel
from pydantic import Field
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    model: Optional[str] = Field(default="deepseek/deepseek-r1-0528-qwen3-8b:free")
    # Supported models (frontend dropdown):
    # - gemini
    # - deepseek/deepseek-r1-0528-qwen3-8b:free
    # - mistralai/mistral-nemo:free
    # - meta-llama/llama-3.3-70b-instruct:free
    # - huggingfaceh4/zephyr-7b-beta

class ChatResponse(BaseModel):
    reply: str

class TryOnResponse(BaseModel):
    result_image_url: str  # Could also be base64 if LightX returns image blob
