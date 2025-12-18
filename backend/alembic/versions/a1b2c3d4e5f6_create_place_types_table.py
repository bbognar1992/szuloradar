"""add test data for place_types table

Revision ID: a1b2c3d4e5f6
Revises: 8c64a4102bae
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union
from datetime import datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '7bb6cf7c0f3d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Remove existing place types and related data
    # Delete from junction tables first
    op.execute(sa.text("DELETE FROM recommendation_amenities"))
    op.execute(sa.text("DELETE FROM place_amenities"))
    # Delete from tables that reference place_types
    op.execute(sa.text("DELETE FROM recommendations"))
    op.execute(sa.text("DELETE FROM places"))
    # Finally delete place types
    op.execute(sa.text("DELETE FROM place_types"))
    
    place_types_table = sa.table(
        'place_types',
        sa.column('id', sa.Integer()),
        sa.column('type_key', sa.String()),
        sa.column('display_name', sa.String()),
        sa.column('icon', sa.String()),
        sa.column('created_at', sa.DateTime(timezone=True)),
    )
    
    op.bulk_insert(
        place_types_table,
        [
            {
                'id': 1,
                'type_key': 'kavezo',
                'display_name': 'Kávézó',
                'icon': '☕',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 2,
                'type_key': 'etterem',
                'display_name': 'Étterem',
                'icon': '🍽️',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 3,
                'type_key': 'edzoterem',
                'display_name': 'Edzőterem',
                'icon': '💪',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 4,
                'type_key': 'park',
                'display_name': 'Park',
                'icon': '🌳',
                'created_at': datetime.utcnow(),
            },
        ]
    )
    
    # Reset sequence to continue from 4
    op.execute(sa.text("SELECT setval('place_types_id_seq', 4, true)"))


def downgrade() -> None:
    op.execute(sa.text("DELETE FROM place_types WHERE id IN (1, 2, 3, 4)"))

