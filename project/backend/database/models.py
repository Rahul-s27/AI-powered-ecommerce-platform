from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from .db import Base

class FashionNews(Base):
    __tablename__ = "fashion_news"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    summary = Column(Text, nullable=True)
    category = Column(String(50), nullable=True)
    image_url = Column(String(500), nullable=True)
    link = Column(String(500), nullable=False, unique=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
