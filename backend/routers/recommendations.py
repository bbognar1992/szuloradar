from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from database import get_db
from models.user import User
from models.recommendation import Recommendation
from models.place import PlaceType, Amenity
from schemas.recommendation import (
    RecommendationCreate,
    RecommendationUpdate,
    RecommendationResponse,
    RecommendationListResponse
)
from auth import get_current_active_user_from_token
from dependencies import PaginationParams, get_pagination_info

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])


@router.post("", response_model=RecommendationResponse, status_code=status.HTTP_201_CREATED)
def create_recommendation(
    recommendation_data: RecommendationCreate,
    current_user: User = Depends(get_current_active_user_from_token),
    db: Session = Depends(get_db)
):
    """Create a new place recommendation"""
    # Get place type
    place_type = db.query(PlaceType).filter(PlaceType.type_key == recommendation_data.place_type_key).first()
    if not place_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Place type '{recommendation_data.place_type_key}' not found"
        )
    
    # Create recommendation
    recommendation = Recommendation(
        user_id=current_user.id,
        place_name=recommendation_data.place_name,
        place_type_id=place_type.id,
        recommendation_text=recommendation_data.recommendation_text,
        maps_link=recommendation_data.maps_link,
        address=recommendation_data.address,
        phone=recommendation_data.phone,
        status="pending"
    )
    db.add(recommendation)
    db.flush()
    
    # Add amenities
    if recommendation_data.amenity_keys:
        amenities = db.query(Amenity).filter(Amenity.amenity_key.in_(recommendation_data.amenity_keys)).all()
        recommendation.amenities = amenities
    
    db.commit()
    db.refresh(recommendation)
    
    return {
        "id": recommendation.id,
        "user_id": recommendation.user_id,
        "place_name": recommendation.place_name,
        "place_type_key": recommendation.place_type.type_key,
        "place_type_display_name": recommendation.place_type.display_name,
        "place_type_icon": recommendation.place_type.icon,
        "recommendation_text": recommendation.recommendation_text,
        "maps_link": recommendation.maps_link,
        "address": recommendation.address,
        "phone": recommendation.phone,
        "status": recommendation.status,
        "created_at": recommendation.created_at,
        "reviewed_at": recommendation.reviewed_at,
        "reviewed_by": recommendation.reviewed_by,
        "review_notes": recommendation.review_notes,
        "amenities": [
            {
                "id": amenity.id,
                "amenity_key": amenity.amenity_key,
                "display_name": amenity.display_name,
                "icon": amenity.icon
            }
            for amenity in recommendation.amenities
        ]
    }


@router.get("/me", response_model=dict)
def get_my_recommendations(
    pagination: PaginationParams = Depends(),
    current_user: User = Depends(get_current_active_user_from_token),
    db: Session = Depends(get_db)
):
    """Get current user's recommendations"""
    query = db.query(Recommendation).filter(Recommendation.user_id == current_user.id)
    total = query.count()
    
    recommendations = query.order_by(Recommendation.created_at.desc()).offset(pagination.skip).limit(pagination.limit).all()
    
    result = []
    for rec in recommendations:
        result.append({
            "id": rec.id,
            "user_id": rec.user_id,
            "place_name": rec.place_name,
            "place_type_key": rec.place_type.type_key,
            "place_type_display_name": rec.place_type.display_name,
            "place_type_icon": rec.place_type.icon,
            "recommendation_text": rec.recommendation_text,
            "maps_link": rec.maps_link,
            "address": rec.address,
            "phone": rec.phone,
            "status": rec.status,
            "created_at": rec.created_at,
            "reviewed_at": rec.reviewed_at,
            "reviewed_by": rec.reviewed_by,
            "review_notes": rec.review_notes,
            "amenities": [
                {
                    "id": amenity.id,
                    "amenity_key": amenity.amenity_key,
                    "display_name": amenity.display_name,
                    "icon": amenity.icon
                }
                for amenity in rec.amenities
            ]
        })
    
    pagination_info = get_pagination_info(total, pagination.page, pagination.page_size)
    
    return {
        "recommendations": result,
        **pagination_info
    }


@router.get("", response_model=dict)
def get_recommendations(
    pagination: PaginationParams = Depends(),
    status_filter: str = "pending",
    db: Session = Depends(get_db)
):
    """Get all recommendations (for admin review)"""
    query = db.query(Recommendation)
    
    if status_filter:
        query = query.filter(Recommendation.status == status_filter)
    
    total = query.count()
    recommendations = query.order_by(Recommendation.created_at.desc()).offset(pagination.skip).limit(pagination.limit).all()
    
    result = []
    for rec in recommendations:
        result.append({
            "id": rec.id,
            "user_id": rec.user_id,
            "place_name": rec.place_name,
            "place_type_key": rec.place_type.type_key,
            "place_type_display_name": rec.place_type.display_name,
            "place_type_icon": rec.place_type.icon,
            "recommendation_text": rec.recommendation_text,
            "maps_link": rec.maps_link,
            "address": rec.address,
            "phone": rec.phone,
            "status": rec.status,
            "created_at": rec.created_at,
            "reviewed_at": rec.reviewed_at,
            "reviewed_by": rec.reviewed_by,
            "review_notes": rec.review_notes,
            "amenities": [
                {
                    "id": amenity.id,
                    "amenity_key": amenity.amenity_key,
                    "display_name": amenity.display_name,
                    "icon": amenity.icon
                }
                for amenity in rec.amenities
            ]
        })
    
    pagination_info = get_pagination_info(total, pagination.page, pagination.page_size)
    
    return {
        "recommendations": result,
        **pagination_info
    }


@router.get("/{recommendation_id}", response_model=RecommendationResponse)
def get_recommendation(
    recommendation_id: UUID,
    db: Session = Depends(get_db)
):
    """Get a single recommendation by ID"""
    recommendation = db.query(Recommendation).filter(Recommendation.id == recommendation_id).first()
    
    if not recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommendation not found"
        )
    
    return {
        "id": recommendation.id,
        "user_id": recommendation.user_id,
        "place_name": recommendation.place_name,
        "place_type_key": recommendation.place_type.type_key,
        "place_type_display_name": recommendation.place_type.display_name,
        "place_type_icon": recommendation.place_type.icon,
        "recommendation_text": recommendation.recommendation_text,
        "maps_link": recommendation.maps_link,
        "address": recommendation.address,
        "phone": recommendation.phone,
        "status": recommendation.status,
        "created_at": recommendation.created_at,
        "reviewed_at": recommendation.reviewed_at,
        "reviewed_by": recommendation.reviewed_by,
        "review_notes": recommendation.review_notes,
        "amenities": [
            {
                "id": amenity.id,
                "amenity_key": amenity.amenity_key,
                "display_name": amenity.display_name,
                "icon": amenity.icon
            }
            for amenity in recommendation.amenities
        ]
    }


@router.put("/{recommendation_id}", response_model=RecommendationResponse)
def update_recommendation(
    recommendation_id: UUID,
    recommendation_data: RecommendationUpdate,
    current_user: User = Depends(get_current_active_user_from_token),
    db: Session = Depends(get_db)
):
    """Update a recommendation status (for admin review)"""
    recommendation = db.query(Recommendation).filter(Recommendation.id == recommendation_id).first()
    
    if not recommendation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recommendation not found"
        )
    
    if recommendation_data.status is not None:
        if recommendation_data.status not in ["pending", "approved", "rejected"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid status. Must be 'pending', 'approved', or 'rejected'"
            )
        recommendation.status = recommendation_data.status
        recommendation.reviewed_at = datetime.utcnow()
        recommendation.reviewed_by = current_user.id
    
    if recommendation_data.review_notes is not None:
        recommendation.review_notes = recommendation_data.review_notes
    
    db.commit()
    db.refresh(recommendation)
    
    return {
        "id": recommendation.id,
        "user_id": recommendation.user_id,
        "place_name": recommendation.place_name,
        "place_type_key": recommendation.place_type.type_key,
        "place_type_display_name": recommendation.place_type.display_name,
        "place_type_icon": recommendation.place_type.icon,
        "recommendation_text": recommendation.recommendation_text,
        "maps_link": recommendation.maps_link,
        "address": recommendation.address,
        "phone": recommendation.phone,
        "status": recommendation.status,
        "created_at": recommendation.created_at,
        "reviewed_at": recommendation.reviewed_at,
        "reviewed_by": recommendation.reviewed_by,
        "review_notes": recommendation.review_notes,
        "amenities": [
            {
                "id": amenity.id,
                "amenity_key": amenity.amenity_key,
                "display_name": amenity.display_name,
                "icon": amenity.icon
            }
            for amenity in recommendation.amenities
        ]
    }

