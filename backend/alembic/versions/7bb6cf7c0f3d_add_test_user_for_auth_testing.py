"""add test user for auth testing

Revision ID: 7bb6cf7c0f3d
Revises: 79b2562bbe52
Create Date: 2025-11-06 09:36:09.991810

"""
from typing import Sequence, Union
import uuid
from datetime import datetime

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '7bb6cf7c0f3d'
down_revision: Union[str, None] = '79b2562bbe52'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Test user credentials
TEST_USER_EMAIL = "test@example.com"
TEST_USER_PASSWORD = "TestPassword123!"  # Valid password: 16 chars, uppercase, lowercase, numbers, special char
TEST_USER_ID = "550e8400-e29b-41d4-a716-446655440000"  # Fixed UUID for test user


def upgrade() -> None:
    # Import here to avoid loading config.py at module level (which requires env vars)
    # This ensures the migration can be scanned by Alembic without needing env vars
    try:
        from auth import get_password_hash
    except ImportError:
        # Fallback: if import fails, add backend directory to path
        import sys
        import os
        # Migration file is in backend/alembic/versions/, so go up 3 levels to get backend/
        backend_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        if backend_dir not in sys.path:
            sys.path.insert(0, backend_dir)
        from auth import get_password_hash
    
    # Use the same password hashing function as auth.py
    # This ensures 100% compatibility between migration and authentication
    password_hash = get_password_hash(TEST_USER_PASSWORD)
    
    # Get users table
    users_table = sa.table(
        'users',
        sa.column('id', sa.UUID()),
        sa.column('email', sa.String()),
        sa.column('password_hash', sa.String()),
        sa.column('first_name', sa.String()),
        sa.column('last_name', sa.String()),
        sa.column('subscription_type', sa.String()),
        sa.column('parent_count', sa.Integer()),
        sa.column('is_active', sa.Boolean()),
        sa.column('created_at', sa.DateTime(timezone=True)),
        sa.column('updated_at', sa.DateTime(timezone=True)),
    )
    
    # Insert test user
    op.bulk_insert(
        users_table,
        [{
            'id': uuid.UUID(TEST_USER_ID),
            'email': TEST_USER_EMAIL,
            'password_hash': password_hash,
            'first_name': 'Test',
            'last_name': 'User',
            'subscription_type': 'free',
            'parent_count': 1,
            'is_active': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
        }]
    )


def downgrade() -> None:
    # Delete all users
    op.execute(
        sa.text("DELETE FROM users")
    )

