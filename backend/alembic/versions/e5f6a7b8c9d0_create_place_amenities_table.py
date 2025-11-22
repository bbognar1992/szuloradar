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

# Cafe place IDs
JASMINE_CAFE_ID = '00000000-0000-0000-0000-000000000011'
KUTYA_MACSEKA_CAFE_ID = '00000000-0000-0000-0000-000000000012'
EDENKAPU_CAFE_ID = '00000000-0000-0000-0000-000000000015'

# Amenity IDs (integers from amenities migration)
# ID 2: pelenkazo, ID 3: jatszosarok
PELENKAZO_AMENITY_ID = 2
JATSZOSAROK_AMENITY_ID = 3

def upgrade() -> None:
    # Remove any old place_amenities data that might reference old place IDs
    op.execute(
        sa.text(
            "DELETE FROM place_amenities WHERE place_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333')"
        )
    )
    
    # Remove existing amenities for cafes to make migration idempotent
    op.execute(
        sa.text(
            f"DELETE FROM place_amenities WHERE place_id IN ('{JASMINE_CAFE_ID}', '{KUTYA_MACSEKA_CAFE_ID}', '{EDENKAPU_CAFE_ID}')"
        )
    )
    
    place_amenities_table = sa.table(
        'place_amenities',
        sa.column('place_id', sa.UUID()),
        sa.column('amenity_id', sa.Integer()),
    )
    
    op.bulk_insert(
        place_amenities_table,
        [
            # Jasmine's Fagyizó - játszósarok
            {'place_id': uuid.UUID(JASMINE_CAFE_ID), 'amenity_id': JATSZOSAROK_AMENITY_ID},
            # A Kutya meg a Macska - pelenkázó és játszósarok
            {'place_id': uuid.UUID(KUTYA_MACSEKA_CAFE_ID), 'amenity_id': PELENKAZO_AMENITY_ID},
            {'place_id': uuid.UUID(KUTYA_MACSEKA_CAFE_ID), 'amenity_id': JATSZOSAROK_AMENITY_ID},
            # Édenkapu Kávézó - játszósarok
            {'place_id': uuid.UUID(EDENKAPU_CAFE_ID), 'amenity_id': JATSZOSAROK_AMENITY_ID},
        ]
    )


def downgrade() -> None:
    op.execute(
        sa.text(
            f"DELETE FROM place_amenities WHERE place_id IN ('{JASMINE_CAFE_ID}', '{KUTYA_MACSEKA_CAFE_ID}', '{EDENKAPU_CAFE_ID}')"
        )
    )

