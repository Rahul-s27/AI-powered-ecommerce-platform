from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional

from database.db import SessionLocal
from database.models import FashionNews

router = APIRouter(tags=["feeds"])

@router.get("/test")
async def test_endpoint():
    return {"message": "Test endpoint is working!"}

def get_db():
    """Dependency for getting DB session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def format_news_item(item):
    """Helper function to format news item"""
    return {
        "id": item.id,
        "title": item.title,
        "summary": item.summary,
        "link": item.link,
        "category": item.category,
        "image_url": item.image_url,
        "timestamp": item.timestamp.isoformat() if item.timestamp else None,
        "source": item.source or "Unknown"
    }

@router.get("", response_model=List[dict])
async def get_feeds(
    category: Optional[str] = Query(None, description="Filter by category"),
    search: Optional[str] = Query(None, description="Search in title, summary, or category"),
    db: Session = Depends(get_db)
):
    """
    Get a list of fashion news items with optional filtering and search.
    """
    try:
        query = db.query(FashionNews)
        
        # Apply category filter if provided
        if category and category.lower() != 'all':
            query = query.filter(FashionNews.category.ilike(f"%{category}%"))
        
        # Apply search filter if provided
        if search:
            search = f"%{search}%"
            query = query.filter(
                or_(
                    FashionNews.title.ilike(search),
                    FashionNews.summary.ilike(search),
                    FashionNews.category.ilike(search)
                )
            )
        
        # Execute query and format results
        results = query.order_by(FashionNews.timestamp.desc()).all()
        return [format_news_item(item) for item in results]
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while fetching news: {str(e)}"
        )
           
