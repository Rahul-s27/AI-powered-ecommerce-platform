import httpx
import os

import uuid
from fastapi.responses import FileResponse

async def tryon_with_lightx(user_image: bytes, user_filename: str, garment_image: bytes = None, garment_filename: str = None, clothing_prompt: str = None) -> str:
    api_key = os.getenv("LIGHTX_API_KEY")
    endpoint = 'https://api.lightxeditor.com/external/api/v2/tryon'  # Use the correct endpoint

    headers = {
        "Authorization": f"Bearer {api_key}"
    }

    files = {
        "user_image": (user_filename, user_image, "image/jpeg")
    }
    if garment_image and garment_filename:
        files["garment_image"] = (garment_filename, garment_image, "image/jpeg")
    if clothing_prompt:
        # For multipart, prompts usually go in 'data', not 'files'
        data = {"clothing_prompt": clothing_prompt}
    else:
        data = {}

    async with httpx.AsyncClient() as client:
        response = await client.post(endpoint, headers=headers, files=files, data=data)

    if response.status_code != 200:
        raise Exception(f"LightX API error: {response.status_code} {response.text}")

    # Assume the API returns the image as bytes
    content_type = response.headers.get("content-type", "")
    if "application/json" in content_type:
        result = response.json()
        # If base64 or URL is returned instead of image bytes
        if "result_url" in result:
            return result["result_url"]
        elif "output" in result:
            import base64
            img_bytes = base64.b64decode(result["output"])
        else:
            raise Exception("LightX API failed: " + str(result))
    else:
        img_bytes = response.content

    # Save the image to static/output/
    out_name = f"tryon_result_{uuid.uuid4().hex}.jpg"
    out_path = os.path.join(os.path.dirname(__file__), "static", "output", out_name)
    # If running from backend/, adjust path
    if not os.path.exists(os.path.dirname(out_path)):
        os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "wb") as f:
        f.write(img_bytes)

    # Return a URL relative to /static/output/
    return f"/static/output/{out_name}"
