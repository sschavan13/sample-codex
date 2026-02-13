from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from app.services.metadata import LinkMetadata


async def _fake_metadata(url: str) -> LinkMetadata:
    return LinkMetadata(title=f"Title for {url}", description="Description", image_url=None)


def test_create_link_fetches_metadata(client: TestClient, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("app.api.routes.links.fetch_metadata", _fake_metadata)

    response = client.post("/links", json={"url": "https://example.com", "tags": ["News"]})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Title for https://example.com"
    assert "news" in data["tags"]


def test_deduplicated_links_return_existing(client: TestClient, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("app.api.routes.links.fetch_metadata", _fake_metadata)

    first = client.post("/links", json={"url": "https://example.com"})
    assert first.status_code == 201

    second = client.post("/links", json={"url": "https://example.com", "tags": ["Tech"]})
    assert second.status_code == 201
    data = second.json()
    assert "tech" in data["tags"]


def test_search_and_tag_filtering(client: TestClient, monkeypatch: pytest.MonkeyPatch) -> None:
    async def metadata_factory(url: str) -> LinkMetadata:
        title = "FastAPI" if "fastapi" in url else "React"
        return LinkMetadata(title=title, description="", image_url=None)

    monkeypatch.setattr("app.api.routes.links.fetch_metadata", metadata_factory)

    client.post("/links", json={"url": "https://fastapi.tiangolo.com", "tags": ["python"]})
    client.post("/links", json={"url": "https://react.dev", "tags": ["frontend"]})

    response = client.get("/links", params={"search": "fastapi"})
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "FastAPI"

    response = client.get("/links", params={"tag": "frontend"})
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 1
    assert data["items"][0]["title"] == "React"


def test_update_link_notes_and_tags(client: TestClient, monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setattr("app.api.routes.links.fetch_metadata", _fake_metadata)

    create_response = client.post("/links", json={"url": "https://example.com"})
    link_id = create_response.json()["id"]

    patch = client.patch(
        f"/links/{link_id}",
        json={"notes": "Great resource", "tags": ["reference"]},
    )
    assert patch.status_code == 200
    data = patch.json()
    assert data["notes"] == "Great resource"
    assert data["tags"] == ["reference"]
