from __future__ import annotations

import pytest
from fastapi.testclient import TestClient


@pytest.mark.parametrize("payload", [{"url": ""}, {"url": "   "}])
def test_create_link_requires_valid_url(client: TestClient, payload) -> None:
    response = client.post("/links", json=payload)
    assert response.status_code == 422
