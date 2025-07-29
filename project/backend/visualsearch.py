import os
import httpx
from fastapi import APIRouter, UploadFile, File
from fastapi.responses import PlainTextResponse

router = APIRouter()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

@router.post("/api/visualsearch")
async def visual_search(user_image: UploadFile = File(...)):
    import traceback, base64
    import requests
    from bs4 import BeautifulSoup
    try:
        api_key = os.getenv("OPENROUTER_API_KEY")
        if not api_key:
            return {"status": "error", "message": "OpenRouter API key not set."}
        img_bytes = await user_image.read()
        img_base64 = base64.b64encode(img_bytes).decode("utf-8")
        data_url = f"data:{user_image.content_type or 'image/jpeg'};base64,{img_base64}"
        # Step 1: Get detailed description from image
        desc_payload = {
            "model": "qwen/qwen2.5-vl-32b-instruct:free",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a fashion expert. Describe this clothing item in detail for an ecommerce listing. Include details like type, material, color, design, pattern, and use cases."
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": "Describe this clothing item in detail."},
                        {"type": "image_url", "image_url": data_url}
                    ]
                }
            ]
        }
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "RetailVerse Visual Search"
        }
        async with httpx.AsyncClient(timeout=60) as client:
            desc_resp = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=desc_payload)
        if desc_resp.status_code != 200:
            return {"status": "error", "message": desc_resp.text}
        desc_data = desc_resp.json()
        detailed_description = desc_data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        if not detailed_description:
            detailed_description = "No description generated."

        # Step 2: Extract main product name from description
        caption_payload = {
            "model": "qwen/qwen2.5-vl-32b-instruct:free",
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert fashion assistant. Extract the main clothing item name from the provided description in 2-3 words only."
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": f'From this text, extract the main clothing item name in 2-3 words only:\n"{detailed_description}"'}
                    ]
                }
            ]
        }
        async with httpx.AsyncClient(timeout=60) as client:
            caption_resp = await client.post("https://openrouter.ai/api/v1/chat/completions", headers=headers, json=caption_payload)
        if caption_resp.status_code != 200:
            return {"status": "error", "message": caption_resp.text}
        caption_data = caption_resp.json()
        caption = caption_data.get("choices", [{}])[0].get("message", {}).get("content", "").strip()
        if not caption:
            # fallback to old logic
            def generate_caption(ai_text: str) -> str:
                ai_text = ai_text.lower().strip()
                if "is a" in ai_text:
                    phrase = ai_text.split("is a")[-1].split(".")[0].strip()
                elif "shows a" in ai_text:
                    phrase = ai_text.split("shows a")[-1].split(".")[0].strip()
                else:
                    phrase = " ".join(ai_text.split()[:4])
                words = phrase.split()
                caption = " ".join(words[:3])
                return caption or "clothing"
            caption = generate_caption(detailed_description)

        def scrape_flipkart(search_term: str):
            url = f"https://www.flipkart.com/search?q={search_term.replace(' ', '+')}"
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
            }
            try:
                resp = requests.get(url, headers=headers)
                soup = BeautifulSoup(resp.text, "lxml")
                products = []
                for item in soup.select("div._1AtVbE"):
                    title = item.select_one("div._4rR01T") or item.select_one("a.IRpwTa")
                    price = item.select_one("div._30jeq3")
                    img = item.select_one("img._396cs4") or item.select_one("img._2r_T1I")
                    link = item.select_one("a._1fQZEK") or item.select_one("a.IRpwTa")
                    if title and price and img and link:
                        products.append({
                            "title": title.text.strip(),
                            "price": price.text.strip(),
                            "image": img["src"],
                            "link": "https://www.flipkart.com" + link["href"]
                        })
                return products
            except Exception as e:
                return []

        results = scrape_flipkart(caption)
        flipkart_link = f"https://www.flipkart.com/search?q={caption.replace(' ', '+')}"
        return {
            "status": "success",
            "detailed_description": detailed_description,
            "caption": caption,
            "results": results,
            "flipkart_link": flipkart_link if not results else None
        }
    except Exception as e:
        import traceback
        return {"status": "error", "message": str(e), "trace": traceback.format_exc()}
