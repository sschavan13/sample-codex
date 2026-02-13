from __future__ import annotations

from collections.abc import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from app.core.config import get_settings
from app.core.security import decode_access_token
from app.db.engine import engine
from app.models.user import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def get_current_user(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
) -> User:
    settings = get_settings()
    if not settings.enable_auth:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Authentication disabled")

    subject = decode_access_token(token, secret_key=settings.jwt_secret, algorithm=settings.jwt_algorithm)
    if not subject:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")

    user = session.exec(select(User).where(User.email == subject)).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive user")
    return user
