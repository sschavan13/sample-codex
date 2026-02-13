from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from sqlalchemy import Column, String, Text
from sqlmodel import Field, Relationship, SQLModel


class LinkTag(SQLModel, table=True):
    link_id: int = Field(foreign_key="link.id", primary_key=True)
    tag_id: int = Field(foreign_key="tag.id", primary_key=True)


class Tag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(sa_column=Column(String(50), unique=True, index=True, nullable=False))

    links: List["Link"] = Relationship(back_populates="tags", link_model=LinkTag)


class Link(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    url: str = Field(sa_column=Column(String(1024), nullable=False, index=True))
    normalized_url: str = Field(sa_column=Column(String(1024), nullable=False, unique=True, index=True))
    title: Optional[str] = Field(default=None, sa_column=Column(String(512), nullable=True))
    description: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))
    image_url: Optional[str] = Field(default=None, sa_column=Column(String(1024), nullable=True))
    notes: Optional[str] = Field(default=None, sa_column=Column(Text, nullable=True))
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    tags: List[Tag] = Relationship(back_populates="links", link_model=LinkTag)

    def touch(self) -> None:
        self.updated_at = datetime.utcnow()
