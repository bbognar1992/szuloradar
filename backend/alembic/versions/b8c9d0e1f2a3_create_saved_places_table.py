"""create saved_places table (data loading moved to load_dev_data.py)

Revision ID: b8c9d0e1f2a3
Revises: a7b8c9d0e1f2
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'b8c9d0e1f2a3'
down_revision: Union[str, None] = 'a7b8c9d0e1f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Migration no longer inserts test data
    # Test data (saved_places) is now loaded via load_dev_data.py script when LOAD_DEV_DATA=true
    # This keeps migrations clean and allows data to be loaded via the API
    pass


def downgrade() -> None:
    # No data to remove as migration no longer inserts test data
    pass
