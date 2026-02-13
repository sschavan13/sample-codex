from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from app.api.deps import get_session
from app.core.config import get_settings
from app.models.link import Link, LinkTag, Tag
from app.schemas.link import LinkCreate, LinkRead, LinksResponse, LinkUpdate
from app.services.link_service import search_link_ids, sync_link_tags, update_link_search_index
from app.services.metadata import fetch_metadata
from app.utils.url import normalize_url

router = APIRouter(prefix="/links", tags=["links"])


def _serialize_link(link: Link) -> LinkRead:
    return LinkRead(
        id=link.id,
        url=link.url,
        title=link.title,
        description=link.description,
        image_url=link.image_url,
        notes=link.notes,
        tags=[tag.name for tag in link.tags],
    )


@router.post("", response_model=LinkRead, status_code=status.HTTP_201_CREATED)
async def create_link(payload: LinkCreate, session: Session = Depends(get_session)) -> LinkRead:
    normalized = normalize_url(payload.url)
    existing = session.exec(select(Link).where(Link.normalized_url == normalized).options(selectinload(Link.tags))).first()
    if existing:
        if payload.tags:
            sync_link_tags(session, existing, payload.tags)
        if payload.notes is not None:
            existing.notes = payload.notes
        session.commit()
        session.refresh(existing)
        update_link_search_index(session, existing)
        session.commit()
        session.refresh(existing)
        return _serialize_link(existing)

    metadata = await fetch_metadata(payload.url)
    link = Link(
        url=payload.url.strip(),
        normalized_url=normalized,
        title=metadata.title,
        description=metadata.description,
        image_url=metadata.image_url,
        notes=payload.notes,
    )
    session.add(link)
    session.flush()
    if payload.tags:
        sync_link_tags(session, link, payload.tags)
    session.commit()
    session.refresh(link)
    update_link_search_index(session, link)
    session.commit()
    session.refresh(link)
    return _serialize_link(link)


@router.get("", response_model=LinksResponse)
def list_links(
    session: Session = Depends(get_session),
    search: Optional[str] = Query(default=None, description="Full text search across title, description, and URL"),
    tag: Optional[str] = Query(default=None, description="Filter by tag name"),
    page: int = Query(default=1, ge=1),
    size: Optional[int] = Query(default=None, ge=1),
) -> LinksResponse:
    settings = get_settings()
    page_size = size or settings.page_size_default
    page_size = min(page_size, settings.page_size_max)

    statement = select(Link.id, Link.created_at)

    if tag:
        tag_filters = [t.strip().lower() for t in tag.split(",") if t.strip()]
        if tag_filters:
            statement = (
                statement.join(LinkTag, LinkTag.link_id == Link.id)
                .join(Tag, Tag.id == LinkTag.tag_id)
                .where(Tag.name.in_(tag_filters))
            )

    ids_with_date = session.exec(statement.distinct().order_by(Link.created_at.desc())).all()
    link_ids = [row[0] for row in ids_with_date]

    if search:
        search_ids = set(search_link_ids(session, search))
        link_ids = [link_id for link_id in link_ids if link_id in search_ids]

    total = len(link_ids)
    start = (page - 1) * page_size
    end = start + page_size
    paged_ids = link_ids[start:end]

    if not paged_ids:
        return LinksResponse(items=[], total=total, page=page, size=page_size)

    links = session.exec(
        select(Link)
        .options(selectinload(Link.tags))
        .where(Link.id.in_(paged_ids))
        .order_by(Link.created_at.desc())
    ).all()

    serialized = sorted(links, key=lambda link: paged_ids.index(link.id))
    return LinksResponse(
        items=[_serialize_link(link) for link in serialized],
        total=total,
        page=page,
        size=page_size,
    )


@router.patch("/{link_id}", response_model=LinkRead)
def update_link(link_id: int, payload: LinkUpdate, session: Session = Depends(get_session)) -> LinkRead:
    link = session.exec(select(Link).where(Link.id == link_id).options(selectinload(Link.tags))).first()
    if not link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Link not found")

    updated = False
    if payload.notes is not None:
        link.notes = payload.notes
        updated = True
    if payload.tags is not None:
        sync_link_tags(session, link, payload.tags)
        updated = True

    if updated:
        link.touch()
        session.add(link)
        session.commit()
        session.refresh(link)
        update_link_search_index(session, link)
        session.commit()
        session.refresh(link)

    return _serialize_link(link)
