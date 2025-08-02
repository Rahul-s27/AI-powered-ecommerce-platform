import os
import replicate
from dotenv import load_dotenv

load_dotenv()

REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
REPLICATE_MODEL_ID = os.getenv("REPLICATE_MODEL_ID")

replicate_client = replicate.Client(api_token=REPLICATE_API_TOKEN)

def run_tryon(user_image_url: str, cloth_image_url: str) -> str:
    output = replicate_client.run(
        REPLICATE_MODEL_ID,
        input={
            "image": user_image_url,
            "cloth": cloth_image_url,
            "noise": 0.1
        }
    )
    return output
