from sqlalchemy import create_engine, inspect
from database.models import Base
from database.db import DATABASE_URL, engine

def check_database():
    print("🔍 Checking database connection and tables...")
    
    # Create engine
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    
    # Create inspector
    inspector = inspect(engine)
    
    # Check if tables exist
    tables = inspector.get_table_names()
    print("\n📋 Found tables:", tables)
    
    # Check if fashion_news table exists
    if 'fashion_news' in tables:
        print("✅ Fashion news table exists")
        # Get column information
        columns = [c['name'] for c in inspector.get_columns('fashion_news')]
        print("   Columns:", columns)
    else:
        print("❌ Fashion news table does not exist")
        print("   Creating tables...")
        Base.metadata.create_all(bind=engine)
        print("   Tables created!")

if __name__ == "__main__":
    check_database()
