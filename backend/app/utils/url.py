from __future__ import annotations

from urllib.parse import parse_qsl, urlparse, urlunparse


def normalize_url(raw_url: str) -> str:
    """Return a normalized URL for deduplication."""
    parsed = urlparse(raw_url.strip())
    scheme = parsed.scheme.lower() or "http"
    netloc = parsed.netloc.lower()

    if not netloc and parsed.path:
        # Handle URLs without scheme (e.g., example.com)
        netloc = parsed.path.lower()
        path = ""
    else:
        path = parsed.path or ""

    if netloc.endswith(":80") and scheme == "http":
        netloc = netloc[:-3]
    elif netloc.endswith(":443") and scheme == "https":
        netloc = netloc[:-4]

    normalized_path = path.rstrip("/") or "/"
    # Remove default index pages for dedupe
    for suffix in ("/index.html", "/index.htm", "/index.php"):
        if normalized_path.endswith(suffix):
            normalized_path = normalized_path[: -len(suffix)] or "/"
            break

    query_pairs = sorted((k, v) for k, v in parse_qsl(parsed.query, keep_blank_values=True))
    query = "&".join(f"{k}={v}" for k, v in query_pairs)

    return urlunparse((scheme, netloc, normalized_path, "", query, ""))
