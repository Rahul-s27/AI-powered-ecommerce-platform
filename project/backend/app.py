import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import ChatRequest, ChatResponse, TryOnResponse
from assistant import get_ai_response
from fastapi import FastAPI, UploadFile, File, Form, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routes.auth import router as auth_router
from visualsearch import router as visualsearch_router
from routes.visual_search import router as flipkart_router
from routes.tryon_route import router as tryon_router
from feeds.router import router as feeds_router

app = FastAPI()

# Add CORS middleware first
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(visualsearch_router)
app.include_router(flipkart_router)
app.include_router(auth_router, prefix="/api")
app.include_router(tryon_router)

# Include feeds router with proper prefix
app.include_router(feeds_router, prefix="/api/feeds", tags=["feeds"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    reply = await get_ai_response(req.message, req.model)
    return {"reply": reply}

from fastapi import Form
import requests

# @app.post("/api/tryon")
# Deprecated: All try-on and AI endpoints removed. Only frontend MediaPipe overlays are used.


# @app.post("/api/generate-clothing/")
# Deprecated: All try-on and AI endpoints removed. Only frontend MediaPipe overlays are used.
async def generate_clothing(request: Request):
    data = await request.json()
    prompt = data.get("prompt")
    if not prompt:
        return JSONResponse(status_code=400, content={"error": "Prompt required."})
    try:
        api_key = os.environ.get("OPENROUTER_API_KEY")
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "qwen/qwen2.5-vl-32b-instruct:free",
            "messages": [
                {"role": "user", "content": f"Generate a PNG or transparent clothing image for: {prompt}. Only output the image, no text."}
            ]
        }
        response = requests.post("https://openrouter.ai/api/v1/chat/completions", json=payload, headers=headers, timeout=60)
        if response.status_code != 200:
            return JSONResponse(status_code=500, content={"error": f"OpenRouter error: {response.text}"})
        result = response.json()
        # Extract image URL or base64 from OpenRouter response
        image_url = None
        import re
        choices = result.get("choices", [])
        for c in choices:
            content = c.get("message", {}).get("content", "")
            # Markdown image ![desc](url)
            md_img = re.search(r'!\[.*?\]\((https?://[^)]+\.(?:jpg|jpeg|png|webp|gif))\)', content)
            if md_img:
                image_url = md_img.group(1)
                break
            # Direct URL
            url_match = re.search(r'(https?://[^\s]+\.(?:jpg|jpeg|png|webp|gif))', content)
            if url_match:
                image_url = url_match.group(1)
                break
            # Base64 image
            base64_match = re.search(r'data:image/[^;]+;base64,([A-Za-z0-9+/=]+)', content)
            if base64_match:
                image_url = f"data:image/png;base64,{base64_match.group(1)}"
                break
        if not image_url:
            return JSONResponse(status_code=500, content={"error": "No image returned by OpenRouter."})
        return {"image_url": image_url}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/")
def root():
    return {"status": "ok", "message": "AI Assistant backend running."}
