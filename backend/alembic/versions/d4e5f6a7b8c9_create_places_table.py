"""add test data for places table

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union
import uuid
from datetime import datetime
from decimal import Decimal

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd4e5f6a7b8c9'
down_revision: Union[str, None] = 'c3d4e5f6a7b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Place type IDs (integers from place_types migration: 1=kavezo, 2=etterem, 3=edzoterem, 4=park)
PLAYGROUND_TYPE_ID = 4  # park
PARK_TYPE_ID = 4  # park
RESTAURANT_TYPE_ID = 2  # etterem


def upgrade() -> None:
    places_table = sa.table(
        'places',
        sa.column('id', sa.UUID()),
        sa.column('name', sa.String()),
        sa.column('type_id', sa.Integer()),
        sa.column('rating', sa.Numeric()),
        sa.column('address', sa.Text()),
        sa.column('phone', sa.String()),
        sa.column('hours', sa.Text()),
        sa.column('description', sa.Text()),
        sa.column('maps_link', sa.Text()),
        sa.column('latitude', sa.Numeric()),
        sa.column('longitude', sa.Numeric()),
        sa.column('created_at', sa.DateTime(timezone=True)),
        sa.column('updated_at', sa.DateTime(timezone=True)),
        sa.column('is_approved', sa.Boolean()),
        sa.column('is_active', sa.Boolean()),
    )
    
    op.bulk_insert(
        places_table,
        [
            {
                'id': uuid.UUID('11111111-1111-1111-1111-111111111111'),
                'name': 'Central Park Playground',
                'type_id': PLAYGROUND_TYPE_ID,
                'rating': Decimal('4.5'),
                'address': '123 Main Street, Budapest',
                'phone': '+36-1-123-4567',
                'hours': 'Mon-Sun: 8:00-20:00',
                'description': 'A wonderful playground for children of all ages',
                'maps_link': 'https://maps.google.com/?q=123+Main+Street',
                'latitude': Decimal('47.4979'),
                'longitude': Decimal('19.0402'),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'is_approved': True,
                'is_active': True,
            },
            {
                'id': uuid.UUID('22222222-2222-2222-2222-222222222222'),
                'name': 'City Park',
                'type_id': PARK_TYPE_ID,
                'rating': Decimal('4.8'),
                'address': '456 Park Avenue, Budapest',
                'phone': '+36-1-234-5678',
                'hours': 'Open 24/7',
                'description': 'Large park with walking paths and picnic areas',
                'maps_link': 'https://maps.google.com/?q=456+Park+Avenue',
                'latitude': Decimal('47.5079'),
                'longitude': Decimal('19.0502'),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'is_approved': True,
                'is_active': True,
            },
            {
                'id': uuid.UUID('33333333-3333-3333-3333-333333333333'),
                'name': 'Family Friendly Restaurant',
                'type_id': RESTAURANT_TYPE_ID,
                'rating': Decimal('4.2'),
                'address': '789 Restaurant Row, Budapest',
                'phone': '+36-1-345-6789',
                'hours': 'Mon-Sun: 11:00-22:00',
                'description': 'Kid-friendly restaurant with high chairs and kids menu',
                'maps_link': 'https://maps.google.com/?q=789+Restaurant+Row',
                'latitude': Decimal('47.5179'),
                'longitude': Decimal('19.0602'),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
                'is_approved': True,
                'is_active': True,
            },
        ]
    )


def downgrade() -> None:
    op.execute(
        sa.text("DELETE FROM places WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333')")
    )

