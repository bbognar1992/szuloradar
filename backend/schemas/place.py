from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from decimal import Decimal


class PlaceTypeResponse(BaseModel):
    id: UUID
    type_key: str
    display_name: str
    icon: Optional[str] = None
    
    class Config:
        from_attributes = True


class AmenityResponse(BaseModel):
    id: UUID
    amenity_key: str
    display_name: str
    icon: Optional[str] = None
    
    class Config:
        from_attributes = True


class PlaceBase(BaseModel):
    name: str
    address: str
    phone: Optional[str] = None
    hours: Optional[str] = None
    description: Optional[str] = None
    maps_link: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None


class PlaceCreate(PlaceBase):
    type_key: str
    amenity_keys: List[str] = []


class PlaceUpdate(BaseModel):
    name: Optional[str] = None
    type_key: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    hours: Optional[str] = None
    description: Optional[str] = None
    maps_link: Optional[str] = None
    latitude: Optional[Decimal] = None
    longitude: Optional[Decimal] = None
    amenity_keys: Optional[List[str]] = None
    is_approved: Optional[bool] = None
    is_active: Optional[bool] = None


class PlaceResponse(PlaceBase):
    id: UUID
    type_key: str
    type_display_name: str
    type_icon: Optional[str] = None
    rating: Decimal
    is_approved: bool
    is_active: bool
    created_at: datetime
    updated_at: datetime
    amenities: List[AmenityResponse] = []
    
    class Config:
        from_attributes = True


class PlaceListResponse(BaseModel):
    places: List[PlaceResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

