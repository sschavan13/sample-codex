from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.api.deps import get_session
from app.core.config import get_settings
from app.core.security import create_access_token, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, Token

router = APIRouter(tags=["auth"])


@router.post("/auth/login", response_model=Token)
def login(payload: LoginRequest, session: Session = Depends(get_session)) -> Token:
    settings = get_settings()
    if not settings.enable_auth:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Authentication is disabled")

    user = session.exec(select(User).where(User.email == payload.email.lower())).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    token = create_access_token(
        subject=user.email,
        secret_key=settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
        expires_minutes=settings.access_token_expire_minutes,
    )
    return Token(access_token=token)
