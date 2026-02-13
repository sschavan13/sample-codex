.PHONY: dev test fmt lint seed

DEV_COMPOSE ?= docker compose

dev:
	$(DEV_COMPOSE) up --build

test:
	cd backend && pytest
	cd frontend && npm test -- --run

fmt:
	cd backend && black app tests && isort app tests
	cd frontend && npm run format

lint:
	cd backend && ruff check app tests && black --check app tests && isort --check-only app tests
	cd frontend && npm run lint

seed:
	cd backend && python -m app.db.seed
