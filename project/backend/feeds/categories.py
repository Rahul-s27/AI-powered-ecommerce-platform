CATEGORIES = [
    "shoes", "womenswear", "menswear", "accessories", "luxury", "sustainable", "footwear", "bags", "general"
]

def guess_category(title: str) -> str:
    title_lower = title.lower()
    for cat in CATEGORIES:
        if cat in title_lower:
            return cat
    return "general"
