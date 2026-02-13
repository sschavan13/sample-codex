
from __future__ import annotations

from typing import List, Sequence

from sqlalchemy import text
from sqlmodel import Session, select

from app.models.link import Link, Tag


def get_or_create_tags(session: Session, tag_names: Sequence[str]) -> List[Tag]:
    cleaned = sorted({tag.strip().lower() for tag in tag_names if tag.strip()})
    if not cleaned:
        return []

    existing_tags = session.exec(select(Tag).where(Tag.name.in_(cleaned))).all()
    existing_map = {tag.name: tag for tag in existing_tags}
    tags: List[Tag] = []
    for name in cleaned:
        tag = existing_map.get(name)
        if not tag:
            tag = Tag(name=name)
            session.add(tag)
        tags.append(tag)
    session.flush()
    return tags


def sync_link_tags(session: Session, link: Link, tag_names: Sequence[str]) -> None:
    tags = get_or_create_tags(session, tag_names)
    link.tags = tags
    session.flush()


def update_link_search_index(session: Session, link: Link) -> None:
    if not link.id:
        session.flush()
    session.exec(text("DELETE FROM link_fts WHERE rowid = :rowid"), {"rowid": link.id})
    session.exec(
        text(
            "INSERT INTO link_fts(rowid, title, description, url) VALUES (:rowid, :title, :description, :url)"
        ),
        {
            "rowid": link.id,
            "title": link.title or "",
            "description": link.description or "",
            "url": link.url,
        },
    )


def search_link_ids(session: Session, query: str) -> list[int]:
    result = session.exec(
        text("SELECT rowid FROM link_fts WHERE link_fts MATCH :query"),
        {"query": query},
    )
    return [row[0] for row in result]
