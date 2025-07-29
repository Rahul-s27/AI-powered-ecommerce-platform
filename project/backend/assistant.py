import os
import httpx
from dotenv import load_dotenv

load_dotenv()
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Gemini logic (restored)
async def get_gemini_response(prompt: str) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Sorry, Gemini AI service is not configured."
    url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
    headers = {"Content-Type": "application/json"}
    params = {"key": api_key}
    payload = {
        "contents": [
            {"parts": [{"text": prompt}]}
        ]
    }
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.post(url, headers=headers, params=params, json=payload)
            data = response.json()
            return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        return "Sorry, I couldn't get a response from Gemini. Please try again later."

# OpenRouter logic (existing)
async def get_openrouter_response(prompt: str, model: str) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    print(f"[DEBUG] OPENROUTER_API_KEY loaded: {api_key}")  # Remove after confirming
    if not api_key:
        return "Sorry, OpenRouter AI service is not configured."
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",  # or your frontend domain if deployed
        "X-Title": "SparkathonAssistant"     # your app/project name
    }
    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                json=payload,
                headers=headers
            )
            data = response.json()
            if "choices" in data:
                return data["choices"][0]["message"]["content"]
            elif "error" in data:
                print(f"[OpenRouter Error] {data['error'].get('message', 'Unknown error')}")
                return f"OpenRouter error: {data['error'].get('message', 'Unknown error')}"
            else:
                print(f"[OpenRouter Error] Unexpected response: {response.text}")
                return "Unexpected response from OpenRouter."
    except httpx.RequestError as e:
        print(f"[OpenRouter Network Error] {str(e)}")
        return f"Network error: {str(e)}"
    except Exception as e:
        print(f"[OpenRouter Exception] {str(e)}")
        return f"Unexpected error: {str(e)}"

# Unified dispatcher
async def get_ai_response(prompt: str, model: str) -> str:
    if model == "gemini":
        return await get_gemini_response(prompt)
    else:
        return await get_openrouter_response(prompt, model)
