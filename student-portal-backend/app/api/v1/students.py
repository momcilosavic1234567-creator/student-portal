from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user, get_db
from models.student_data import StudentData
from models.user import User
from schemas.user import StudentDataCreate, StudentDataRead

router = APIRouter()


@router.post("/", response_model=StudentDataRead, status_code=status.HTTP_201_CREATED)
def create_student_profile(
    student_in: StudentDataCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StudentData:
    statement = select(StudentData).where(StudentData.user_id == current_user.id)
    existing_profile = db.execute(statement).scalar_one_or_none()
    if existing_profile is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A student profile already exists for this user.",
        )

    profile = StudentData(user_id=current_user.id, **student_in.model_dump(exclude_unset=True))
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile


@router.get("/me", response_model=StudentDataRead)
def read_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StudentData:
    statement = select(StudentData).where(StudentData.user_id == current_user.id).options(selectinload(StudentData.owner))
    profile = db.execute(statement).scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found.")
    return profile


@router.get("/", response_model=list[StudentDataRead])
def list_student_profiles(db: Session = Depends(get_db)) -> list[StudentData]:
    statement = select(StudentData).options(selectinload(StudentData.owner))
    profiles = db.execute(statement).scalars().all()
    return profiles


@router.put("/me", response_model=StudentDataRead)
def update_my_profile(
    student_in: StudentDataCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> StudentData:
    statement = select(StudentData).where(StudentData.user_id == current_user.id)
    profile = db.execute(statement).scalar_one_or_none()
    if profile is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found.")

    for field, value in student_in.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)

    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile
