from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID
from decimal import Decimal


class SavedPlaceResponse(BaseModel):
    id: UUID
    place_id: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


class SavedPlaceWithDetails(BaseModel):
    saved_id: UUID
    created_at: datetime
    place: dict  # PlaceResponse as dict
    
    class Config:
        from_attributes = True


class PlaceRatingBase(BaseModel):
    rating: Decimal
    review_text: Optional[str] = None


class PlaceRatingCreate(PlaceRatingBase):
    place_id: UUID


class PlaceRatingUpdate(BaseModel):
    rating: Optional[Decimal] = None
    review_text: Optional[str] = None


class PlaceRatingResponse(PlaceRatingBase):
    id: UUID
    user_id: UUID
    place_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

