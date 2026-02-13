FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml ./
COPY ruff.toml ./
COPY alembic.ini ./
COPY README.md ./
COPY app ./app
COPY alembic ./alembic

RUN pip install --upgrade pip \
    && pip install --no-cache-dir -e .

COPY start.sh ./start.sh
RUN chmod +x start.sh

CMD ["./start.sh"]
