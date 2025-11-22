"""add test data for place_ratings table

Revision ID: c9d0e1f2a3b4
Revises: b8c9d0e1f2a3
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union
import uuid
from datetime import datetime
from decimal import Decimal

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'c9d0e1f2a3b4'
down_revision: Union[str, None] = 'b8c9d0e1f2a3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Test user ID from previous migration
TEST_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

# Place IDs from previous migration (using new restaurant place IDs)
RESTAURANT_PLACE_ID_1 = '00000000-0000-0000-0000-000000000001'  # LAMAREDA Étterem
RESTAURANT_PLACE_ID_2 = '00000000-0000-0000-0000-000000000003'  # Palffy Restaurant


def upgrade() -> None:
    # Remove any existing place_ratings that reference old place IDs
    op.execute(
        sa.text("DELETE FROM place_ratings WHERE place_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333')")
    )
    
    place_ratings_table = sa.table(
        'place_ratings',
        sa.column('id', sa.UUID()),
        sa.column('user_id', sa.UUID()),
        sa.column('place_id', sa.UUID()),
        sa.column('rating', sa.Numeric()),
        sa.column('review_text', sa.Text()),
        sa.column('created_at', sa.DateTime(timezone=True)),
        sa.column('updated_at', sa.DateTime(timezone=True)),
    )
    
    op.bulk_insert(
        place_ratings_table,
        [
            {
                'id': uuid.UUID('11111111-1111-1111-1111-111111111111'),
                'user_id': uuid.UUID(TEST_USER_ID),
                'place_id': uuid.UUID(RESTAURANT_PLACE_ID_1),
                'rating': Decimal('4.7'),
                'review_text': 'Excellent restaurant! Great food and very accommodating for families with children.',
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('22222222-2222-2222-2222-222222222222'),
                'user_id': uuid.UUID(TEST_USER_ID),
                'place_id': uuid.UUID(RESTAURANT_PLACE_ID_2),
                'rating': Decimal('4.3'),
                'review_text': 'Good food and very accommodating for families with children.',
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow(),
            },
        ]
    )


def downgrade() -> None:
    op.execute(
        sa.text("DELETE FROM place_ratings WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222')")
    )

