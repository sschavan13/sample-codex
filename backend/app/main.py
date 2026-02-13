from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

from app.api.routes import auth, links
from app.core.config import get_settings
from app.db.engine import engine
from app.db.init_db import init_db
from app.services.user_service import ensure_default_user

settings = get_settings()

app = FastAPI(title="linklens", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(links.router)
app.include_router(auth.router)


@app.on_event("startup")
def on_startup() -> None:
    init_db()
    if settings.enable_auth:
        with Session(engine) as session:
            ensure_default_user(session)


@app.get("/health", tags=["system"])
def health_check() -> dict[str, str]:
    return {"status": "ok"}
