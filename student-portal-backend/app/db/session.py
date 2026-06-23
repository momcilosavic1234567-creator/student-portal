from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.config import settings

db_url = settings.database_url
connect_args = {}

if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif db_url.startswith("postgresql://"):
    # SQLAlchemy uses 'postgresql+psycopg' to specify the psycopg 3 driver
    db_url = db_url.replace("postgresql://", "postgresql+psycopg://", 1)

engine = create_engine(db_url, connect_args=connect_args, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

