# LinkLens

LinkLens is a full-stack bookmarking application built with FastAPI, SQLModel, and React. It lets you capture links, enrich them with metadata, tag them, and search with SQLite FTS5.

## Stack

- **Backend:** FastAPI, SQLModel (SQLite), Alembic, JWT auth (optional), pytest
- **Frontend:** React + TypeScript, Vite, Tailwind CSS, React Query, Axios
- **Tooling:** Docker, docker-compose, Makefile helpers, black/isort/ruff, Vitest + Testing Library

## Quick start

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build
```

- Frontend: http://localhost:5173
- API docs: http://localhost:8000/docs

Run tests locally:

```bash
make test
```

Format & lint:

```bash
make fmt
make lint
```

Seed sample links:

```bash
make seed
```

## API examples

```bash
# Create a link
curl -X POST http://localhost:8000/links \
  -H 'Content-Type: application/json' \
  -d '{"url": "https://example.com", "tags": ["example"], "notes": "Sample"}'

# List links with search and pagination
curl 'http://localhost:8000/links?search=fastapi&page=1&size=10'

# Filter by tag
curl 'http://localhost:8000/links?tag=python'

# Update tags/notes
curl -X PATCH http://localhost:8000/links/1 \
  -H 'Content-Type: application/json' \
  -d '{"tags": ["reference"], "notes": "Updated note"}'
```
