from __future__ import annotations

from sqlmodel import Session, select

from app.core.config import get_settings
from app.core.security import get_password_hash
from app.models.user import User


def ensure_default_user(session: Session) -> User:
    settings = get_settings()
    email = settings.default_user_email.lower()
    user = session.exec(select(User).where(User.email == email)).first()
    if user:
        return user

    user = User(
        email=email,
        full_name="Demo User",
        hashed_password=get_password_hash(settings.default_user_password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user
