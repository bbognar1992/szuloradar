#!/usr/bin/env python3
"""Script to add Budapest places to the database"""

import sys
import os
sys.path.insert(0, '/app')

from database import SessionLocal
from models.place import Place, PlaceType
from decimal import Decimal

# Budapest places to add
budapest_places = [
    {
        "name": "Gerbeaud Cukrászda",
        "type_key": "kavezo",
        "address": "1051 Budapest, Vörösmarty tér 7-8",
        "description": "Híres budapesti cukrászda a Vörösmarty téren, családias hangulattal.",
        "rating": 4.5,
        "phone": "+36 1 429 9000",
        "hours": "H-P: 9:00-21:00, Szo-Vas: 9:00-22:00"
    },
    {
        "name": "Gundel Étterem",
        "type_key": "etterem",
        "address": "1146 Budapest, Állatkerti körút 2",
        "description": "Híres magyar étterem a Városligetben, hagyományos magyar konyha.",
        "rating": 4.7,
        "phone": "+36 1 468 4040",
        "hours": "H-Vas: 12:00-23:00"
    },
    {
        "name": "Margitsziget Játszótér",
        "type_key": "park",
        "address": "1138 Budapest, Margitsziget",
        "description": "Nagy játszótér a Margitszigeten, tökéletes családoknak.",
        "rating": 4.8,
        "hours": "Nyitva: napkelte-napnyugta"
    },
    {
        "name": "New York Café",
        "type_key": "kavezo",
        "address": "1073 Budapest, Erzsébet körút 9-11",
        "description": "Luxus kávézó a belvárosban, gyönyörű belső térrel.",
        "rating": 4.6,
        "phone": "+36 1 886 6167",
        "hours": "H-Vas: 8:00-00:00"
    },
    {
        "name": "Városliget Játszótér",
        "type_key": "park",
        "address": "1146 Budapest, Városliget",
        "description": "Nagy játszótér a Városligetben, sok játékfelszereléssel.",
        "rating": 4.5,
        "hours": "Nyitva: napkelte-napnyugta"
    },
    {
        "name": "Bors GasztroBar",
        "type_key": "etterem",
        "address": "1073 Budapest, Kazinczy u. 10",
        "description": "Népszerű street food hely a belvárosban, finom levesekkel.",
        "rating": 4.4,
        "hours": "H-Vas: 11:00-22:00"
    }
]

def main():
    db = SessionLocal()
    try:
        # Get place types
        place_types = {pt.type_key: pt for pt in db.query(PlaceType).all()}
        
        added_count = 0
        for place_data in budapest_places:
            # Check if place already exists
            existing = db.query(Place).filter(
                Place.name == place_data["name"],
                Place.address == place_data["address"]
            ).first()
            
            if existing:
                print(f"Place already exists: {place_data['name']}")
                continue
            
            # Get place type
            place_type = place_types.get(place_data["type_key"])
            if not place_type:
                print(f"Place type not found: {place_data['type_key']}")
                continue
            
            # Create place
            place = Place(
                name=place_data["name"],
                type_id=place_type.id,
                address=place_data["address"],
                phone=place_data.get("phone"),
                hours=place_data.get("hours"),
                description=place_data.get("description"),
                rating=Decimal(str(place_data.get("rating", 0.0))),
                is_approved=True,  # Auto-approve for testing
                is_active=True
            )
            
            db.add(place)
            added_count += 1
            print(f"Added: {place_data['name']}")
        
        db.commit()
        print(f"\nSuccessfully added {added_count} Budapest places!")
        
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    main()

