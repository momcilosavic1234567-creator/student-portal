import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from app.api.v1 import auth, students, ai_assistant
from app.db.base_class import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        Base.metadata.create_all(bind=engine)
    except Exception:
        logging.exception("Unable to initialize database schema. Ensure DATABASE_URL is reachable.")
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title="Student Portal",
        description="A lightweight student portal backend with authentication, student profiles, and a simple AI assistant.",
        version="0.1.0",
        lifespan=lifespan,
    )

    app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
    app.include_router(students.router, prefix="/api/v1/students", tags=["students"])
    app.include_router(ai_assistant.router, prefix="/api/v1/ai", tags=["ai"])

    @app.get("/", summary="Health check")
    async def health_check() -> dict[str, str]:
        return {"message": "Student Portal backend is running"}

    return app


app = create_app()

