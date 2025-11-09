"""add test data for saved_places table

Revision ID: b8c9d0e1f2a3
Revises: a7b8c9d0e1f2
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union
import uuid
from datetime import datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b8c9d0e1f2a3'
down_revision: Union[str, None] = 'a7b8c9d0e1f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Test user ID from previous migration
TEST_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

# Place IDs from previous migration
PLAYGROUND_PLACE_ID = '11111111-1111-1111-1111-111111111111'
PARK_PLACE_ID = '22222222-2222-2222-2222-222222222222'


def upgrade() -> None:
    saved_places_table = sa.table(
        'saved_places',
        sa.column('id', sa.UUID()),
        sa.column('user_id', sa.UUID()),
        sa.column('place_id', sa.UUID()),
        sa.column('created_at', sa.DateTime(timezone=True)),
    )
    
    op.bulk_insert(
        saved_places_table,
        [
            {
                'id': uuid.UUID('11111111-1111-1111-1111-111111111111'),
                'user_id': uuid.UUID(TEST_USER_ID),
                'place_id': uuid.UUID(PLAYGROUND_PLACE_ID),
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('22222222-2222-2222-2222-222222222222'),
                'user_id': uuid.UUID(TEST_USER_ID),
                'place_id': uuid.UUID(PARK_PLACE_ID),
                'created_at': datetime.utcnow(),
            },
        ]
    )


def downgrade() -> None:
    op.execute(
        sa.text("DELETE FROM saved_places WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222')")
    )

