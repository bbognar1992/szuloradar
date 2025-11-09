from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from uuid import UUID
from database import get_db
from models.user import User
from models.interaction import SavedPlace, PlaceRating
from models.place import Place
from schemas.interaction import (
    SavedPlaceResponse,
    SavedPlaceWithDetails,
    PlaceRatingCreate,
    PlaceRatingUpdate,
    PlaceRatingResponse
)
from schemas.place import PlaceResponse
from auth import get_current_active_user
from dependencies import PaginationParams, get_pagination_info

router = APIRouter(prefix="/api/interactions", tags=["Interactions"])


# ==================== Saved Places ====================

@router.get("/saved", response_model=dict)
def get_saved_places(
    pagination: PaginationParams = Depends(),
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's saved places"""
    query = db.query(SavedPlace).filter(SavedPlace.user_id == current_user.id)
    total = query.count()
    
    saved_places = query.order_by(SavedPlace.created_at.desc()).offset(pagination.skip).limit(pagination.limit).all()
    
    result = []
    for saved_place in saved_places:
        place = saved_place.place
        result.append({
            "saved_id": saved_place.id,
            "created_at": saved_place.created_at,
            "place": {
                "id": place.id,
                "name": place.name,
                "type_key": place.place_type.type_key,
                "type_display_name": place.place_type.display_name,
                "type_icon": place.place_type.icon,
                "rating": place.rating,
                "address": place.address,
                "phone": place.phone,
                "hours": place.hours,
                "description": place.description,
                "maps_link": place.maps_link,
                "latitude": place.latitude,
                "longitude": place.longitude,
                "is_approved": place.is_approved,
                "is_active": place.is_active,
                "created_at": place.created_at,
                "updated_at": place.updated_at,
                "amenities": [
                    {
                        "id": amenity.id,
                        "amenity_key": amenity.amenity_key,
                        "display_name": amenity.display_name,
                        "icon": amenity.icon
                    }
                    for amenity in place.amenities
                ]
            }
        })
    
    pagination_info = get_pagination_info(total, pagination.page, pagination.page_size)
    
    return {
        "saved_places": result,
        **pagination_info
    }


@router.post("/saved/{place_id}", response_model=SavedPlaceResponse, status_code=status.HTTP_201_CREATED)
def save_place(
    place_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Save a place to user's favorites"""
    # Check if place exists
    place = db.query(Place).filter(Place.id == place_id, Place.is_active == True).first()
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Place not found"
        )
    
    # Check if already saved
    existing = db.query(SavedPlace).filter(
        SavedPlace.user_id == current_user.id,
        SavedPlace.place_id == place_id
    ).first()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Place already saved"
        )
    
    saved_place = SavedPlace(
        user_id=current_user.id,
        place_id=place_id
    )
    db.add(saved_place)
    db.commit()
    db.refresh(saved_place)
    return saved_place


@router.delete("/saved/{place_id}", status_code=status.HTTP_204_NO_CONTENT)
def unsave_place(
    place_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Remove a place from user's favorites"""
    saved_place = db.query(SavedPlace).filter(
        SavedPlace.user_id == current_user.id,
        SavedPlace.place_id == place_id
    ).first()
    
    if not saved_place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saved place not found"
        )
    
    db.delete(saved_place)
    db.commit()
    return None


@router.get("/saved/{place_id}/check")
def check_if_saved(
    place_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Check if a place is saved by current user"""
    saved_place = db.query(SavedPlace).filter(
        SavedPlace.user_id == current_user.id,
        SavedPlace.place_id == place_id
    ).first()
    
    return {"is_saved": saved_place is not None}


# ==================== Ratings ====================

@router.post("/ratings", response_model=PlaceRatingResponse, status_code=status.HTTP_201_CREATED)
def create_rating(
    rating_data: PlaceRatingCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create or update a rating for a place"""
    # Check if place exists
    place = db.query(Place).filter(Place.id == rating_data.place_id, Place.is_active == True).first()
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Place not found"
        )
    
    # Check if rating already exists
    existing_rating = db.query(PlaceRating).filter(
        PlaceRating.user_id == current_user.id,
        PlaceRating.place_id == rating_data.place_id
    ).first()
    
    if existing_rating:
        # Update existing rating
        existing_rating.rating = rating_data.rating
        if rating_data.review_text is not None:
            existing_rating.review_text = rating_data.review_text
        db.commit()
        db.refresh(existing_rating)
        return existing_rating
    else:
        # Create new rating
        rating = PlaceRating(
            user_id=current_user.id,
            place_id=rating_data.place_id,
            rating=rating_data.rating,
            review_text=rating_data.review_text
        )
        db.add(rating)
        db.commit()
        db.refresh(rating)
        return rating


@router.put("/ratings/{place_id}", response_model=PlaceRatingResponse)
def update_rating(
    place_id: UUID,
    rating_data: PlaceRatingUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a rating for a place"""
    rating = db.query(PlaceRating).filter(
        PlaceRating.user_id == current_user.id,
        PlaceRating.place_id == place_id
    ).first()
    
    if not rating:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rating not found"
        )
    
    if rating_data.rating is not None:
        rating.rating = rating_data.rating
    if rating_data.review_text is not None:
        rating.review_text = rating_data.review_text
    
    db.commit()
    db.refresh(rating)
    return rating


@router.delete("/ratings/{place_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rating(
    place_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a rating for a place"""
    rating = db.query(PlaceRating).filter(
        PlaceRating.user_id == current_user.id,
        PlaceRating.place_id == place_id
    ).first()
    
    if not rating:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rating not found"
        )
    
    db.delete(rating)
    db.commit()
    return None


@router.get("/ratings/{place_id}")
def get_my_rating(
    place_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's rating for a place"""
    rating = db.query(PlaceRating).filter(
        PlaceRating.user_id == current_user.id,
        PlaceRating.place_id == place_id
    ).first()
    
    if not rating:
        return {"rating": None, "review_text": None}
    
    return {
        "rating": rating.rating,
        "review_text": rating.review_text,
        "created_at": rating.created_at,
        "updated_at": rating.updated_at
    }

