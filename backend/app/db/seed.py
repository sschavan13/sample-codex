from __future__ import annotations

from sqlmodel import Session, select

from app.core.config import get_settings
from app.db.engine import engine
from app.db.init_db import init_db
from app.models.link import Link
from app.services.link_service import sync_link_tags, update_link_search_index
from app.services.user_service import ensure_default_user
from app.utils.url import normalize_url

SEED_LINKS = [
    {
        "url": "https://fastapi.tiangolo.com/",
        "title": "FastAPI",
        "description": "FastAPI framework, high performance, easy to learn, fast to code, ready for production",
        "image_url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png",
        "tags": ["python", "backend"],
        "notes": "Official FastAPI documentation.",
    },
    {
        "url": "https://react.dev/",
        "title": "React",
        "description": "The library for web and native user interfaces",
        "image_url": "https://react.dev/images/og-home.png",
        "tags": ["javascript", "frontend"],
        "notes": "React documentation",
    },
]


def run() -> None:
    settings = get_settings()
    init_db()
    with Session(engine) as session:
        if settings.enable_auth:
            ensure_default_user(session)
        for item in SEED_LINKS:
            normalized = normalize_url(item["url"])
            existing = session.exec(select(Link).where(Link.normalized_url == normalized)).first()
            if existing:
                continue
            link = Link(
                url=item["url"],
                normalized_url=normalized,
                title=item.get("title"),
                description=item.get("description"),
                image_url=item.get("image_url"),
                notes=item.get("notes"),
            )
            session.add(link)
            session.flush()
            if item.get("tags"):
                sync_link_tags(session, link, item["tags"])
            session.commit()
            session.refresh(link)
            update_link_search_index(session, link)
            session.commit()


if __name__ == "__main__":
    run()
