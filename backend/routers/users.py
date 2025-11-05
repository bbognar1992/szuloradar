from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from database import get_db
from models.user import User, Children
from schemas.user import (
    UserResponse,
    UserUpdate,
    UserProfileUpdate,
    ChildrenCreate,
    ChildrenResponse,
    ChildrenUpdate
)
from auth import get_current_active_user

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_my_profile(current_user: User = Depends(get_current_active_user)):
    """Get current user's profile"""
    return current_user


@router.put("/me", response_model=UserResponse)
def update_my_profile(
    profile_data: UserProfileUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    # Update user fields
    if profile_data.first_name is not None:
        current_user.first_name = profile_data.first_name
    if profile_data.last_name is not None:
        current_user.last_name = profile_data.last_name
    if profile_data.phone is not None:
        current_user.phone = profile_data.phone
    if profile_data.profile_image_url is not None:
        current_user.profile_image_url = profile_data.profile_image_url
    if profile_data.subscription_type is not None:
        current_user.subscription_type = profile_data.subscription_type
    if profile_data.parent_count is not None:
        current_user.parent_count = profile_data.parent_count
    
    # Update children
    if profile_data.children is not None:
        # Delete existing children
        db.query(Children).filter(Children.user_id == current_user.id).delete()
        # Add new children
        for child_data in profile_data.children:
            child = Children(
                user_id=current_user.id,
                name=child_data.name,
                birth_year=child_data.birth_year
            )
            db.add(child)
    
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/me/children", response_model=list[ChildrenResponse])
def get_my_children(
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's children"""
    children = db.query(Children).filter(Children.user_id == current_user.id).all()
    return children


@router.post("/me/children", response_model=ChildrenResponse, status_code=status.HTTP_201_CREATED)
def create_child(
    child_data: ChildrenCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new child for current user"""
    child = Children(
        user_id=current_user.id,
        name=child_data.name,
        birth_year=child_data.birth_year
    )
    db.add(child)
    db.commit()
    db.refresh(child)
    return child


@router.put("/me/children/{child_id}", response_model=ChildrenResponse)
def update_child(
    child_id: UUID,
    child_data: ChildrenUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a child"""
    child = db.query(Children).filter(
        Children.id == child_id,
        Children.user_id == current_user.id
    ).first()
    
    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Child not found"
        )
    
    if child_data.name is not None:
        child.name = child_data.name
    if child_data.birth_year is not None:
        child.birth_year = child_data.birth_year
    
    db.commit()
    db.refresh(child)
    return child


@router.delete("/me/children/{child_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_child(
    child_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a child"""
    child = db.query(Children).filter(
        Children.id == child_id,
        Children.user_id == current_user.id
    ).first()
    
    if not child:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Child not found"
        )
    
    db.delete(child)
    db.commit()
    return None

