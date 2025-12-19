#!/usr/bin/env python3
"""Script to load development data from JSON file using direct database insertion"""

import json
import os
import sys
from pathlib import Path
from decimal import Decimal
from typing import List, Dict, Any

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from database import SessionLocal
from models.place import Place, PlaceType, Amenity


def load_places_from_json(json_path: Path) -> List[Dict[str, Any]]:
    """Load places data from JSON file"""
    with open(json_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def bulk_insert_places_direct(places_data: List[Dict[str, Any]], db: SessionLocal) -> int:
    """Insert places directly into database (for dev data loading)"""
    # Get all unique type_keys and amenity_keys upfront for efficiency
    type_keys = {place["type_key"] for place in places_data}
    all_amenity_keys = set()
    for place in places_data:
        amenity_keys = place.get("amenity_keys", [])
        if amenity_keys:
            all_amenity_keys.update(amenity_keys)
    
    # Fetch all place types and amenities in one query
    place_types = {pt.type_key: pt for pt in db.query(PlaceType).filter(PlaceType.type_key.in_(type_keys)).all()}
    amenities_map = {}
    if all_amenity_keys:
        amenities_map = {a.amenity_key: a for a in db.query(Amenity).filter(Amenity.amenity_key.in_(all_amenity_keys)).all()}
    
    # Validate all place types exist
    missing_types = type_keys - set(place_types.keys())
    if missing_types:
        raise Exception(f"Place types not found: {', '.join(missing_types)}")
    
    # Create places
    created_count = 0
    for place_data in places_data:
        place_type = place_types[place_data["type_key"]]
        
        place = Place(
            name=place_data["name"],
            type_id=place_type.id,
            address=place_data["address"],
            phone=place_data.get("phone"),
            hours=place_data.get("hours"),
            description=place_data.get("description"),
            maps_link=place_data.get("maps_link"),
            latitude=Decimal(str(place_data["latitude"])) if place_data.get("latitude") else None,
            longitude=Decimal(str(place_data["longitude"])) if place_data.get("longitude") else None,
            is_approved=True,  # Auto-approve dev data
            is_active=True
        )
        db.add(place)
        db.flush()  # Flush to get the ID
        
        # Set amenities for this place
        amenity_keys = place_data.get("amenity_keys", [])
        if amenity_keys:
            place_amenities = [amenities_map[key] for key in amenity_keys if key in amenities_map]
            place.amenities = place_amenities
        
        created_count += 1
    
    db.commit()
    return created_count


def main():
    """Main function to load dev data"""
    # Check if we should load dev data
    load_dev_data = os.getenv("LOAD_DEV_DATA", "false").lower() in ("true", "1", "yes")
    
    if not load_dev_data:
        print("LOAD_DEV_DATA not set to true, skipping dev data load")
        return
    
    print("Loading development data...")
    
    # Get JSON file path
    json_path = backend_dir / "dev_data" / "places.json"
    
    if not json_path.exists():
        print(f"Warning: Dev data file not found at {json_path}, skipping")
        return
    
    try:
        # Load places from JSON
        print(f"Loading places from {json_path}...")
        places_data = load_places_from_json(json_path)
        print(f"Found {len(places_data)} places to insert")
        
        # Insert places directly into database
        db = SessionLocal()
        try:
            print(f"Inserting {len(places_data)} places into database...")
            created_count = bulk_insert_places_direct(places_data, db)
            print(f"Successfully inserted {created_count} places!")
        finally:
            db.close()
        
    except Exception as e:
        print(f"Error loading dev data: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

