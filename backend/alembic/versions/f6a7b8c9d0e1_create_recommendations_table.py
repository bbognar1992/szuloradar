"""add test data for recommendations table

Revision ID: f6a7b8c9d0e1
Revises: e5f6a7b8c9d0
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union
import uuid
from datetime import datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f6a7b8c9d0e1'
down_revision: Union[str, None] = 'e5f6a7b8c9d0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Test user ID from previous migration
TEST_USER_ID = "550e8400-e29b-41d4-a716-446655440000"

# Place type IDs (integers from place_types migration: 1=kavezo, 2=etterem, 3=edzoterem, 4=park)
# Note: These old place types (museum, library) don't exist in new schema, using arbitrary IDs
# They will be deleted when place_types migration runs anyway
MUSEUM_TYPE_ID = 1  # kavezo (temporary mapping)
LIBRARY_TYPE_ID = 1  # kavezo (temporary mapping)


def upgrade() -> None:
    recommendations_table = sa.table(
        'recommendations',
        sa.column('id', sa.UUID()),
        sa.column('user_id', sa.UUID()),
        sa.column('place_name', sa.String()),
        sa.column('place_type_id', sa.Integer()),
        sa.column('recommendation_text', sa.Text()),
        sa.column('maps_link', sa.Text()),
        sa.column('address', sa.Text()),
        sa.column('phone', sa.String()),
        sa.column('status', sa.String()),
        sa.column('created_at', sa.DateTime(timezone=True)),
        sa.column('reviewed_at', sa.DateTime(timezone=True)),
        sa.column('reviewed_by', sa.UUID()),
        sa.column('review_notes', sa.Text()),
    )
    
    op.bulk_insert(
        recommendations_table,
        [
            {
                'id': uuid.UUID('11111111-1111-1111-1111-111111111111'),
                'user_id': uuid.UUID(TEST_USER_ID),
                'place_name': 'Children\'s Museum',
                'place_type_id': MUSEUM_TYPE_ID,
                'recommendation_text': 'Great interactive museum for kids with hands-on exhibits',
                'maps_link': 'https://maps.google.com/?q=Children+Museum',
                'address': '321 Museum Street, Budapest',
                'phone': '+36-1-456-7890',
                'status': 'pending',
                'created_at': datetime.utcnow(),
                'reviewed_at': None,
                'reviewed_by': None,
                'review_notes': None,
            },
            {
                'id': uuid.UUID('22222222-2222-2222-2222-222222222222'),
                'user_id': uuid.UUID(TEST_USER_ID),
                'place_name': 'Public Library - Children\'s Section',
                'place_type_id': LIBRARY_TYPE_ID,
                'recommendation_text': 'Wonderful children\'s section with story time and reading corner',
                'maps_link': 'https://maps.google.com/?q=Public+Library',
                'address': '654 Library Lane, Budapest',
                'phone': '+36-1-567-8901',
                'status': 'approved',
                'created_at': datetime.utcnow(),
                'reviewed_at': datetime.utcnow(),
                'reviewed_by': uuid.UUID(TEST_USER_ID),
                'review_notes': 'Approved - great resource for families',
            },
        ]
    )


def downgrade() -> None:
    op.execute(
        sa.text("DELETE FROM recommendations WHERE id IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222')")
    )

