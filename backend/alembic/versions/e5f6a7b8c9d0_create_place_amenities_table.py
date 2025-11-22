"""add test data for place_amenities junction table

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e5f6a7b8c9d0'
down_revision: Union[str, None] = 'd4e5f6a7b8c9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # The new restaurants from the places migration don't have amenities
    # This migration is kept for structure but doesn't insert any data
    # Remove any old place_amenities data that might reference old place IDs
    op.execute(
        sa.text(
            "DELETE FROM place_amenities WHERE place_id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333')"
        )
    )


def downgrade() -> None:
    # No data to remove since we're not inserting any amenities
    pass

