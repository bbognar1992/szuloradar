from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import NullPool
from config import settings

# Determine if using Supabase pooler (port 6543) or direct connection (port 5432)
database_url = settings.database_url
is_pooler_connection = ":6543" in database_url or "pooler.supabase.com" in database_url

# Configure engine based on connection type
# For pooler connections (transaction mode), use NullPool as recommended by Supabase
# For direct connections (stationary servers), use regular pooling
if is_pooler_connection:
    engine = create_engine(
        database_url,
        poolclass=NullPool,
        pool_pre_ping=True,
        client_encoding='utf8'
    )
else:
    # For direct connections on stationary servers, use regular pooling
    # Adjust pool_size and max_overflow based on your needs
    # Recommended: limit to 40% of available connections if using REST Client,
    # or up to 80% otherwise
    engine = create_engine(
        database_url,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency for getting database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

