"""create places table (data loading moved to load_dev_data.py)

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'd4e5f6a7b8c9'
down_revision: Union[str, None] = 'c3d4e5f6a7b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Migration no longer inserts test data
    # Test data is now loaded via load_dev_data.py script when LOAD_DEV_DATA=true
    # This keeps migrations clean and allows data to be loaded via the API
    pass


def downgrade() -> None:
    # No data to remove as migration no longer inserts test data
    pass
