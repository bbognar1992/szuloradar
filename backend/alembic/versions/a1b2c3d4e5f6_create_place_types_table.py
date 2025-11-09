"""add test data for place_types table

Revision ID: a1b2c3d4e5f6
Revises: 8c64a4102bae
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union
import uuid
from datetime import datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '8c64a4102bae'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    place_types_table = sa.table(
        'place_types',
        sa.column('id', sa.UUID()),
        sa.column('type_key', sa.String()),
        sa.column('display_name', sa.String()),
        sa.column('icon', sa.String()),
        sa.column('created_at', sa.DateTime(timezone=True)),
    )
    
    op.bulk_insert(
        place_types_table,
        [
            {
                'id': uuid.UUID('11111111-1111-1111-1111-111111111111'),
                'type_key': 'playground',
                'display_name': 'Playground',
                'icon': '🛝',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('22222222-2222-2222-2222-222222222222'),
                'type_key': 'park',
                'display_name': 'Park',
                'icon': '🌳',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('33333333-3333-3333-3333-333333333333'),
                'type_key': 'museum',
                'display_name': 'Museum',
                'icon': '🏛️',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('44444444-4444-4444-4444-444444444444'),
                'type_key': 'restaurant',
                'display_name': 'Restaurant',
                'icon': '🍽️',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('55555555-5555-5555-5555-555555555555'),
                'type_key': 'library',
                'display_name': 'Library',
                'icon': '📚',
                'created_at': datetime.utcnow(),
            },
        ]
    )


def downgrade() -> None:
    op.execute(
        sa.text("DELETE FROM place_types WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555')")
    )

