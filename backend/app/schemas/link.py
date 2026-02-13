from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field, validator


class LinkBase(BaseModel):
    url: str = Field(..., example="https://example.com")
    tags: List[str] = Field(default_factory=list)

    @validator("url")
    def validate_url(cls, value: str) -> str:
        if not value or not value.strip():
            raise ValueError("URL is required")
        return value.strip()


class LinkCreate(LinkBase):
    notes: Optional[str] = Field(default=None)


class LinkUpdate(BaseModel):
    tags: Optional[List[str]] = Field(default=None)
    notes: Optional[str] = Field(default=None)


class LinkRead(BaseModel):
    id: int
    url: str
    title: Optional[str]
    description: Optional[str]
    image_url: Optional[str]
    notes: Optional[str]
    tags: List[str]

    class Config:
        orm_mode = True


class LinksResponse(BaseModel):
    items: List[LinkRead]
    total: int
    page: int
    size: int
