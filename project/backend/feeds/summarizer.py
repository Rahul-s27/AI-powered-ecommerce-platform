import os
import requests
from typing import Optional

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"
MODEL = "qwen/qwen3-30b-a3b:free"

HEADERS = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json"
}

SYSTEM_PROMPT = "Summarize the following fashion news article or summary in 1-2 short sentences. Output only the summary, no commentary."

def summarize(text: str) -> Optional[str]:
    if not OPENROUTER_API_KEY:
        raise ValueError("OPENROUTER_API_KEY not set in environment variables.")
    payload = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": text}
        ],
        "max_tokens": 128,
        "temperature": 0.7
    }
    try:
        response = requests.post(OPENROUTER_API_URL, headers=HEADERS, json=payload)
        response.raise_for_status()
        data = response.json()
        # The structure may differ, adjust if necessary
        summary = data["choices"][0]["message"]["content"].strip()
        return summary
    except Exception as e:
        print(f"Summarization error: {e}")
        return None
