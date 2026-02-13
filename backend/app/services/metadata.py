from __future__ import annotations

from html.parser import HTMLParser
from typing import Optional

import httpx
from pydantic import BaseModel

from app.core.config import get_settings


class LinkMetadata(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None


class _MetadataParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title: Optional[str] = None
        self.description: Optional[str] = None
        self.image: Optional[str] = None
        self._collect_title = False

    def handle_starttag(self, tag: str, attrs):
        if tag == "title":
            self._collect_title = True
        if tag == "meta":
            attr_dict = {key.lower(): value for key, value in attrs if key and value}
            name = attr_dict.get("name", "").lower()
            prop = attr_dict.get("property", "").lower()
            content = attr_dict.get("content")
            if content:
                if name == "description" and not self.description:
                    self.description = content.strip()
                if prop in {"og:description", "twitter:description"} and not self.description:
                    self.description = content.strip()
                if prop in {"og:image", "twitter:image"} and not self.image:
                    self.image = content.strip()

    def handle_endtag(self, tag: str) -> None:
        if tag == "title":
            self._collect_title = False

    def handle_data(self, data: str) -> None:
        if self._collect_title:
            current = (self.title or "") + data
            self.title = current.strip()


async def fetch_metadata(url: str) -> LinkMetadata:
    settings = get_settings()
    headers = {
        "User-Agent": settings.metadata_user_agent,
        "Accept": "text/html,application/xhtml+xml",
    }
    try:
        async with httpx.AsyncClient(timeout=settings.metadata_timeout, follow_redirects=True) as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
    except httpx.HTTPError:
        return LinkMetadata()

    parser = _MetadataParser()
    parser.feed(response.text)
    return LinkMetadata(
        title=parser.title,
        description=parser.description,
        image_url=parser.image,
    )
