from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from uuid import UUID
from typing import Optional, List
import re
from database import get_db
from models.user import User
from models.place import Place, PlaceType, Amenity
from models.interaction import PlaceRating
from schemas.place import (
    PlaceCreate,
    PlaceUpdate,
    PlaceResponse,
    PlaceListResponse,
    PlaceTypeResponse,
    AmenityResponse
)
from auth import get_current_active_user, get_current_user
from dependencies import PaginationParams, get_pagination_info

router = APIRouter(prefix="/api/places", tags=["Places"])


@router.get("/types", response_model=list[PlaceTypeResponse])
def get_place_types(db: Session = Depends(get_db)):
    """Get all place types"""
    types = db.query(PlaceType).all()
    return types


@router.get("/amenities", response_model=list[AmenityResponse])
def get_amenities(db: Session = Depends(get_db)):
    """Get all amenities"""
    amenities = db.query(Amenity).all()
    return amenities


@router.get("/cities", response_model=List[str])
def get_cities(db: Session = Depends(get_db)):
    """Get list of unique cities from places addresses"""
    places = db.query(Place.address).filter(Place.is_active == True).distinct().all()
    cities = set()
    
    # Extract city from address (format: "9022 Győr, Apáca u. 4." or "Győr, ...")
    for (address,) in places:
        if not address:
            continue
        # Try to match pattern: "XXXX City," or "City,"
        match = re.search(r'\d{4}\s+([^,]+),|^([^,]+),', address)
        if match:
            city = match.group(1) or match.group(2)
            if city:
                cities.add(city.strip())
        else:
            # If no comma pattern, try to extract first word after postal code
            match = re.search(r'\d{4}\s+(\w+)', address)
            if match:
                cities.add(match.group(1).strip())
    
    return sorted(list(cities))


@router.get("", response_model=PlaceListResponse)
def get_places(
    pagination: PaginationParams = Depends(),
    type_key: Optional[int] = Query(None, description="Filter by place type ID"),
    search: Optional[str] = Query(None, description="Search in name and description"),
    city: Optional[str] = Query(None, description="Filter by city name"),
    min_rating: Optional[float] = Query(None, ge=0, le=5, description="Minimum rating"),
    is_approved: Optional[bool] = Query(True, description="Filter by approval status"),
    db: Session = Depends(get_db)
):
    """Get list of places with filtering and pagination"""
    query = db.query(Place).options(joinedload(Place.place_type), joinedload(Place.amenities)).filter(Place.is_active == True)
    
    # Filter by type ID
    if type_key is not None:
        query = query.filter(Place.type_id == type_key)
    
    # Filter by city
    if city:
        # Match city in address (format: "9022 Győr," or "Győr,")
        city_pattern = f"%{city}%"
        query = query.filter(Place.address.ilike(city_pattern))
    
    # Filter by approval status
    if is_approved is not None:
        query = query.filter(Place.is_approved == is_approved)
    
    # Filter by minimum rating
    if min_rating is not None:
        query = query.filter(Place.rating >= min_rating)
    
    # Search
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Place.name.ilike(search_term),
                Place.description.ilike(search_term),
                Place.address.ilike(search_term)
            )
        )
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    places = query.offset(pagination.skip).limit(pagination.limit).all()
    
    # Format response
    place_responses = []
    for place in places:
        place_dict = {
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
        place_responses.append(place_dict)
    
    pagination_info = get_pagination_info(total, pagination.page, pagination.page_size)
    
    return {
        "places": place_responses,
        **pagination_info
    }


@router.get("/{place_id}", response_model=PlaceResponse)
def get_place(place_id: UUID, db: Session = Depends(get_db)):
    """Get a single place by ID"""
    place = db.query(Place).options(joinedload(Place.place_type), joinedload(Place.amenities)).filter(
        Place.id == place_id,
        Place.is_active == True
    ).first()
    
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Place not found"
        )
    
    return {
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


@router.post("/bulk_insert", response_model=List[PlaceResponse], status_code=status.HTTP_201_CREATED)
def bulk_insert(
    places_data: List[PlaceCreate],
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Bulk insert multiple places"""
    if not places_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Empty list of places provided"
        )
    
    # Get all unique type_keys and amenity_keys upfront for efficiency
    type_keys = {place.type_key for place in places_data}
    all_amenity_keys = set()
    for place in places_data:
        all_amenity_keys.update(place.amenity_keys)
    
    # Fetch all place types and amenities in one query
    place_types = {pt.type_key: pt for pt in db.query(PlaceType).filter(PlaceType.type_key.in_(type_keys)).all()}
    amenities_map = {a.amenity_key: a for a in db.query(Amenity).filter(Amenity.amenity_key.in_(all_amenity_keys)).all()}
    
    # Validate all place types exist
    missing_types = type_keys - set(place_types.keys())
    if missing_types:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Place types not found: {', '.join(missing_types)}"
        )
    
    # Create places
    created_places = []
    
    for place_data in places_data:
        place_type = place_types[place_data.type_key]
        
        place = Place(
            name=place_data.name,
            type_id=place_type.id,
            address=place_data.address,
            phone=place_data.phone,
            hours=place_data.hours,
            description=place_data.description,
            maps_link=place_data.maps_link,
            latitude=place_data.latitude,
            longitude=place_data.longitude,
            is_approved=False  # Needs approval
        )
        db.add(place)
        db.flush()  # Flush to get the ID
        
        # Set amenities for this place
        if place_data.amenity_keys:
            place_amenities = [amenities_map[key] for key in place_data.amenity_keys if key in amenities_map]
            place.amenities = place_amenities
        
        created_places.append(place)
    
    # Commit all places at once
    db.commit()
    
    # Reload all places with relationships
    place_ids = [place.id for place in created_places]
    places = db.query(Place).options(
        joinedload(Place.place_type),
        joinedload(Place.amenities)
    ).filter(Place.id.in_(place_ids)).all()
    
    # Format response
    place_responses = []
    for place in places:
        place_responses.append({
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
        })
    
    return place_responses


@router.post("", response_model=PlaceResponse, status_code=status.HTTP_201_CREATED)
def create_place(
    place_data: PlaceCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new place (admin only - simplified for now)"""
    # Get place type
    place_type = db.query(PlaceType).filter(PlaceType.type_key == place_data.type_key).first()
    if not place_type:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Place type '{place_data.type_key}' not found"
        )
    
    # Create place
    place = Place(
        name=place_data.name,
        type_id=place_type.id,
        address=place_data.address,
        phone=place_data.phone,
        hours=place_data.hours,
        description=place_data.description,
        maps_link=place_data.maps_link,
        latitude=place_data.latitude,
        longitude=place_data.longitude,
        is_approved=False  # Needs approval
    )
    db.add(place)
    db.flush()
    
    # Add amenities
    if place_data.amenity_keys:
        amenities = db.query(Amenity).filter(Amenity.amenity_key.in_(place_data.amenity_keys)).all()
        place.amenities = amenities
    
    db.commit()
    db.refresh(place)
    # Reload with relationships
    place = db.query(Place).options(joinedload(Place.place_type), joinedload(Place.amenities)).filter(Place.id == place.id).first()
    
    return {
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


@router.put("/{place_id}", response_model=PlaceResponse)
def update_place(
    place_id: UUID,
    place_data: PlaceUpdate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a place (admin only - simplified for now)"""
    place = db.query(Place).options(joinedload(Place.amenities)).filter(Place.id == place_id).first()
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Place not found"
        )
    
    # Update fields
    if place_data.name is not None:
        place.name = place_data.name
    if place_data.address is not None:
        place.address = place_data.address
    if place_data.phone is not None:
        place.phone = place_data.phone
    if place_data.hours is not None:
        place.hours = place_data.hours
    if place_data.description is not None:
        place.description = place_data.description
    if place_data.maps_link is not None:
        place.maps_link = place_data.maps_link
    if place_data.latitude is not None:
        place.latitude = place_data.latitude
    if place_data.longitude is not None:
        place.longitude = place_data.longitude
    if place_data.is_approved is not None:
        place.is_approved = place_data.is_approved
    if place_data.is_active is not None:
        place.is_active = place_data.is_active
    
    # Update type if provided
    if place_data.type_key is not None:
        place_type = db.query(PlaceType).filter(PlaceType.type_key == place_data.type_key).first()
        if place_type:
            place.type_id = place_type.id
    
    # Update amenities if provided
    if place_data.amenity_keys is not None:
        amenities = db.query(Amenity).filter(Amenity.amenity_key.in_(place_data.amenity_keys)).all()
        place.amenities = amenities
    
    db.commit()
    db.refresh(place)
    # Reload with relationships
    place = db.query(Place).options(joinedload(Place.place_type), joinedload(Place.amenities)).filter(Place.id == place.id).first()
    
    return {
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


@router.delete("/{place_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_place(
    place_id: UUID,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a place (soft delete by setting is_active=False)"""
    place = db.query(Place).filter(Place.id == place_id).first()
    if not place:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Place not found"
        )
    
    place.is_active = False
    db.commit()
    return None

