"""add test data for place_amenities junction table

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union
import uuid

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5f6a7b8c9d0'
down_revision: Union[str, None] = 'd4e5f6a7b8c9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Place IDs from previous migration
PLAYGROUND_PLACE_ID = '11111111-1111-1111-1111-111111111111'
PARK_PLACE_ID = '22222222-2222-2222-2222-222222222222'
RESTAURANT_PLACE_ID = '33333333-3333-3333-3333-333333333333'

# Amenity IDs from previous migration
CHANGING_TABLE_AMENITY_ID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
STROLLER_FRIENDLY_AMENITY_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
HIGH_CHAIR_AMENITY_ID = 'cccccccc-cccc-cccc-cccc-cccccccccccc'
KIDS_MENU_AMENITY_ID = 'dddddddd-dddd-dddd-dddd-dddddddddddd'
PLAYGROUND_AMENITY_ID = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
PARKING_AMENITY_ID = 'ffffffff-ffff-ffff-ffff-ffffffffffff'


def upgrade() -> None:
    place_amenities_table = sa.table(
        'place_amenities',
        sa.column('place_id', sa.UUID()),
        sa.column('amenity_id', sa.UUID()),
    )
    
    op.bulk_insert(
        place_amenities_table,
        [
            # Central Park Playground amenities
            {'place_id': uuid.UUID(PLAYGROUND_PLACE_ID), 'amenity_id': uuid.UUID(PLAYGROUND_AMENITY_ID)},
            {'place_id': uuid.UUID(PLAYGROUND_PLACE_ID), 'amenity_id': uuid.UUID(STROLLER_FRIENDLY_AMENITY_ID)},
            {'place_id': uuid.UUID(PLAYGROUND_PLACE_ID), 'amenity_id': uuid.UUID(PARKING_AMENITY_ID)},
            # City Park amenities
            {'place_id': uuid.UUID(PARK_PLACE_ID), 'amenity_id': uuid.UUID(STROLLER_FRIENDLY_AMENITY_ID)},
            {'place_id': uuid.UUID(PARK_PLACE_ID), 'amenity_id': uuid.UUID(PARKING_AMENITY_ID)},
            # Family Friendly Restaurant amenities
            {'place_id': uuid.UUID(RESTAURANT_PLACE_ID), 'amenity_id': uuid.UUID(HIGH_CHAIR_AMENITY_ID)},
            {'place_id': uuid.UUID(RESTAURANT_PLACE_ID), 'amenity_id': uuid.UUID(KIDS_MENU_AMENITY_ID)},
            {'place_id': uuid.UUID(RESTAURANT_PLACE_ID), 'amenity_id': uuid.UUID(STROLLER_FRIENDLY_AMENITY_ID)},
            {'place_id': uuid.UUID(RESTAURANT_PLACE_ID), 'amenity_id': uuid.UUID(CHANGING_TABLE_AMENITY_ID)},
            {'place_id': uuid.UUID(RESTAURANT_PLACE_ID), 'amenity_id': uuid.UUID(PARKING_AMENITY_ID)},
        ]
    )


def downgrade() -> None:
    op.execute(
        sa.text(f"DELETE FROM place_amenities WHERE place_id IN ('{PLAYGROUND_PLACE_ID}', '{PARK_PLACE_ID}', '{RESTAURANT_PLACE_ID}')")
    )

