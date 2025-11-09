"""add test data for recommendation_amenities junction table

Revision ID: a7b8c9d0e1f2
Revises: f6a7b8c9d0e1
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union
import uuid

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a7b8c9d0e1f2'
down_revision: Union[str, None] = 'f6a7b8c9d0e1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Recommendation IDs from previous migration
MUSEUM_RECOMMENDATION_ID = '11111111-1111-1111-1111-111111111111'
LIBRARY_RECOMMENDATION_ID = '22222222-2222-2222-2222-222222222222'

# Amenity IDs from previous migration
STROLLER_FRIENDLY_AMENITY_ID = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
PARKING_AMENITY_ID = 'ffffffff-ffff-ffff-ffff-ffffffffffff'


def upgrade() -> None:
    recommendation_amenities_table = sa.table(
        'recommendation_amenities',
        sa.column('recommendation_id', sa.UUID()),
        sa.column('amenity_id', sa.UUID()),
    )
    
    op.bulk_insert(
        recommendation_amenities_table,
        [
            # Children's Museum amenities
            {'recommendation_id': uuid.UUID(MUSEUM_RECOMMENDATION_ID), 'amenity_id': uuid.UUID(STROLLER_FRIENDLY_AMENITY_ID)},
            {'recommendation_id': uuid.UUID(MUSEUM_RECOMMENDATION_ID), 'amenity_id': uuid.UUID(PARKING_AMENITY_ID)},
            # Public Library amenities
            {'recommendation_id': uuid.UUID(LIBRARY_RECOMMENDATION_ID), 'amenity_id': uuid.UUID(STROLLER_FRIENDLY_AMENITY_ID)},
            {'recommendation_id': uuid.UUID(LIBRARY_RECOMMENDATION_ID), 'amenity_id': uuid.UUID(PARKING_AMENITY_ID)},
        ]
    )


def downgrade() -> None:
    op.execute(
        sa.text(f"DELETE FROM recommendation_amenities WHERE recommendation_id IN ('{MUSEUM_RECOMMENDATION_ID}', '{LIBRARY_RECOMMENDATION_ID}')")
    )

