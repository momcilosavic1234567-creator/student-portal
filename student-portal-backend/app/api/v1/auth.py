from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.security import create_access_token, get_password_hash, verify_password
from models.user import User
from schemas.token import Token
from schemas.user import UserCreate, UserRead

router = APIRouter()


def _authenticate_user(db: Session, email: str, password: str) -> User | None:
    statement = select(User).where(User.email == email)
    user = db.execute(statement).scalar_one_or_none()
    if user is None:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)) -> User:
    statement = select(User).where(User.email == user_in.email)
    existing_user = db.execute(statement).scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists.",
        )

    user = User(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> dict[str, str]:
    user = _authenticate_user(db, form_data.username, form_data.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=user.email, expires_delta=timedelta(minutes=60))
    return {"access_token": access_token, "token_type": "bearer"}
