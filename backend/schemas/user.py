from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class ChildrenBase(BaseModel):
    name: str
    birth_year: Optional[int] = None


class ChildrenCreate(ChildrenBase):
    pass


class ChildrenUpdate(BaseModel):
    name: Optional[str] = None
    birth_year: Optional[int] = None


class ChildrenResponse(ChildrenBase):
    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    subscription_type: Optional[str] = "free"


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    profile_image_url: Optional[str] = None
    subscription_type: Optional[str] = None
    parent_count: Optional[int] = None


class UserResponse(UserBase):
    id: UUID
    profile_image_url: Optional[str] = None
    subscription_type: str
    parent_count: int
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime] = None
    is_active: bool
    children: List[ChildrenResponse] = []
    
    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    profile_image_url: Optional[str] = None
    subscription_type: Optional[str] = None
    parent_count: Optional[int] = None
    children: List[ChildrenCreate] = []

