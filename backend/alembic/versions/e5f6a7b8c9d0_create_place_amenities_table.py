"""create place_amenities junction table (data loading moved to load_dev_data.py)

Revision ID: e5f6a7b8c9d0
Revises: d4e5f6a7b8c9
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'e5f6a7b8c9d0'
down_revision: Union[str, None] = 'd4e5f6a7b8c9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Migration no longer inserts test data
    # Test data (place amenities) is now loaded via load_dev_data.py script when LOAD_DEV_DATA=true
    # This keeps migrations clean and allows data to be loaded via the API
    pass


def downgrade() -> None:
    # No data to remove as migration no longer inserts test data
    pass
