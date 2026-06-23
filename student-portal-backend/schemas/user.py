from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional


class StudentDataBase(BaseModel):
    major: Optional[str] = None
    gpa: Optional[float] = Field(None, ge=0.0, le=4.0)
    year: Optional[int] = Field(None, ge=1, le=8)
    bio: Optional[str] = None


class StudentDataCreate(StudentDataBase):
    pass


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)


class StudentDataRead(StudentDataBase):
    id: int
    user_id: int
    owner: Optional[UserRead] = None

    model_config = ConfigDict(from_attributes=True)
