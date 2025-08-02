import feedparser
from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from database.models import FashionNews
from database.db import SessionLocal
import newspaper
from newspaper import Article


# Placeholder guess_category function (should be improved or imported from categories.py)
# Source-to-category mapping
RSS_FEEDS = {
    "vogue": ("https://www.vogue.com/feed/rss", "womenswear"),
    "elle": ("https://www.elle.com/rss/all.xml", "womenswear"),
    "fashionunited": ("https://fashionunited.com/rss", "general"),
    "wwd": ("https://wwd.com/feed/", "general")
}

def get_article_summary(url):
    try:
        article = Article(url)
        article.download()
        article.parse()
        article.nlp()
        return article.summary, article.top_image
    except Exception:
        return None, None

def store_news_item(session: Session, item: dict) -> Optional[FashionNews]:
    # Prevent duplicates by link
    exists = session.query(FashionNews).filter_by(link=item["link"]).first()
    if exists:
        return None
    news = FashionNews(
        title=item["title"],
        summary=item.get("summary"),
        category=item.get("category"),
        image_url=item.get("image_url"),
        link=item["link"]
    )
    session.add(news)
    session.commit()
    session.refresh(news)
    return news

# Legacy fetch_feeds retained for compatibility

def fetch_feeds(store_to_db: bool = False) -> List[Dict]:
    all_items = []
    session = SessionLocal() if store_to_db else None
    try:
        for _, (url, category) in RSS_FEEDS.items():
            feed = feedparser.parse(url)
            for entry in feed.entries:
                item = {
                    "title": entry.title,
                    "summary": getattr(entry, "summary", ""),
                    "link": entry.link,
                    "image_url": getattr(entry, "media_content", [{}])[0].get("url") if hasattr(entry, "media_content") and entry.media_content else None,
                    "category": category,
                }
                all_items.append(item)
                if session:
                    store_news_item(session, item)
    finally:
        if session:
            session.close()
    return all_items


from feeds.summarizer import summarize

def fetch_and_store_all():
    db = SessionLocal()
    for source, (url, category) in RSS_FEEDS.items():
        feed = feedparser.parse(url)
        for entry in feed.entries:
            title = entry.get("title", "")
            link = entry.get("link", "")
            if not link:
                continue
            summary, image_url = get_article_summary(link)
            # Fallback to RSS summary if article extraction fails
            if not summary:
                summary = getattr(entry, "summary", "")
            # AI summarization
            ai_summary = summarize(summary or title)
            if ai_summary:
                summary = ai_summary
            if not image_url:
                image_url = getattr(entry, "media_content", [{}])[0].get("url") if hasattr(entry, "media_content") and entry.media_content else None
            item = {
                "title": title,
                "summary": summary,
                "category": category,
                "image_url": image_url,
                "link": link
            }
            store_news_item(db, item)
    db.close()
    print("✅ Fetched, AI-summarized, and stored latest fashion news.")

if __name__ == "__main__":
    fetch_and_store_all()
