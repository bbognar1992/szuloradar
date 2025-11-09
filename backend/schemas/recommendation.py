from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from schemas.place import AmenityResponse


class RecommendationBase(BaseModel):
    place_name: str
    recommendation_text: str
    maps_link: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None


class RecommendationCreate(RecommendationBase):
    place_type_key: str
    amenity_keys: List[str] = []


class RecommendationUpdate(BaseModel):
    status: Optional[str] = None
    review_notes: Optional[str] = None


class RecommendationResponse(RecommendationBase):
    id: UUID
    user_id: Optional[UUID] = None
    place_type_key: str
    place_type_display_name: str
    place_type_icon: Optional[str] = None
    status: str
    created_at: datetime
    reviewed_at: Optional[datetime] = None
    reviewed_by: Optional[UUID] = None
    review_notes: Optional[str] = None
    amenities: List[AmenityResponse] = []
    
    class Config:
        from_attributes = True


class RecommendationListResponse(BaseModel):
    recommendations: List[RecommendationResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

