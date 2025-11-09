"""add test data for amenities table

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union
import uuid
from datetime import datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    amenities_table = sa.table(
        'amenities',
        sa.column('id', sa.UUID()),
        sa.column('amenity_key', sa.String()),
        sa.column('display_name', sa.String()),
        sa.column('icon', sa.String()),
        sa.column('created_at', sa.DateTime(timezone=True)),
    )
    
    op.bulk_insert(
        amenities_table,
        [
            {
                'id': uuid.UUID('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
                'amenity_key': 'changing_table',
                'display_name': 'Changing Table',
                'icon': '👶',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
                'amenity_key': 'stroller_friendly',
                'display_name': 'Stroller Friendly',
                'icon': '👶',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('cccccccc-cccc-cccc-cccc-cccccccccccc'),
                'amenity_key': 'high_chair',
                'display_name': 'High Chair',
                'icon': '🪑',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('dddddddd-dddd-dddd-dddd-dddddddddddd'),
                'amenity_key': 'kids_menu',
                'display_name': 'Kids Menu',
                'icon': '🍕',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
                'amenity_key': 'playground',
                'display_name': 'Playground',
                'icon': '🛝',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('ffffffff-ffff-ffff-ffff-ffffffffffff'),
                'amenity_key': 'parking',
                'display_name': 'Parking',
                'icon': '🅿️',
                'created_at': datetime.utcnow(),
            },
        ]
    )


def downgrade() -> None:
    op.execute(
        sa.text("DELETE FROM amenities WHERE id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ffffffff-ffff-ffff-ffff-ffffffffffff')")
    )

