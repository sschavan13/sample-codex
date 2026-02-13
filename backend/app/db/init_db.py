from __future__ import annotations

from sqlalchemy import text
from sqlmodel import SQLModel

from app.db.engine import engine


def init_db() -> None:
    SQLModel.metadata.create_all(engine)
    with engine.begin() as connection:
        connection.execute(text("PRAGMA foreign_keys=ON"))
        connection.execute(
            text(
                """
                CREATE VIRTUAL TABLE IF NOT EXISTS link_fts
                USING fts5(title, description, url)
                """
            )
        )
