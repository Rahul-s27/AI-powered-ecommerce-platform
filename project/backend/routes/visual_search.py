from fastapi import APIRouter, Query
import requests
from bs4 import BeautifulSoup

router = APIRouter()

@router.get("/api/visual-search")
def visual_search(query: str = Query(...)):
    try:
        search_url = f"https://www.flipkart.com/search?q={query.replace(' ', '+')}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        }
        response = requests.get(search_url, headers=headers)
        if response.status_code != 200:
            return {"status": "error", "message": "Failed to fetch Flipkart page"}
        soup = BeautifulSoup(response.text, "lxml")
        products = []
        for item in soup.select("div._1AtVbE"):
            title = item.select_one("div._4rR01T") or item.select_one("a.IRpwTa")
            price = item.select_one("div._30jeq3")
            img = item.select_one("img._396cs4")
            link = item.select_one("a._1fQZEK") or item.select_one("a.IRpwTa")
            if title and price and img and link:
                products.append({
                    "title": title.text.strip(),
                    "price": price.text.strip(),
                    "image": img["src"],
                    "link": "https://www.flipkart.com" + link["href"]
                })
        return {
            "status": "success",
            "search_query": query,
            "flipkart_link": search_url,
            "results": products if products else []
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
