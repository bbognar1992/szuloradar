"""add test data for amenities table

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union
from datetime import datetime

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b2c3d4e5f6a7'
down_revision: Union[str, None] = 'a1b2c3d4e5f6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Remove existing amenities and related data
    # Delete from junction tables first (CASCADE should handle this, but being explicit)
    op.execute(sa.text("DELETE FROM recommendation_amenities"))
    op.execute(sa.text("DELETE FROM place_amenities"))
    # Delete amenities
    op.execute(sa.text("DELETE FROM amenities"))
    
    amenities_table = sa.table(
        'amenities',
        sa.column('id', sa.Integer()),
        sa.column('amenity_key', sa.String()),
        sa.column('display_name', sa.String()),
        sa.column('icon', sa.String()),
        sa.column('created_at', sa.DateTime(timezone=True)),
    )
    
    op.bulk_insert(
        amenities_table,
        [
            {
                'id': 1,
                'amenity_key': 'etetoszek',
                'display_name': 'Etetőszék',
                'icon': '🪑',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 2,
                'amenity_key': 'pelenkazo',
                'display_name': 'Pelenkázó',
                'icon': '👶',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 3,
                'amenity_key': 'jatszosarok',
                'display_name': 'Játszósarok',
                'icon': '🧸',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 4,
                'amenity_key': 'babakocsi_kompatibilis',
                'display_name': 'Babakocsi-kompatibilis',
                'icon': '👶',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 5,
                'amenity_key': 'gyerekmenu',
                'display_name': 'Gyerekmenü',
                'icon': '🍕',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 6,
                'amenity_key': 'bebi_etel_melegitese',
                'display_name': 'Bébiétel melegítése',
                'icon': '🍼',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 7,
                'amenity_key': 'szoptatos_sarok',
                'display_name': 'Szoptatós sarok',
                'icon': '🤱',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 8,
                'amenity_key': 'kulteri_hely_arnyekkal',
                'display_name': 'Kültéri hely árnyékkal',
                'icon': '🌳',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 9,
                'amenity_key': 'gyerekbarat_etkeszlet',
                'display_name': 'Gyerekbarát étkészlet',
                'icon': '🍴',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 10,
                'amenity_key': 'szinezo_vagy_foglalkoztato',
                'display_name': 'Színező vagy foglalkoztató',
                'icon': '🎨',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 11,
                'amenity_key': 'allergen_informaciok_jelolve',
                'display_name': 'Allergén-információk jelölve',
                'icon': '⚠️',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 12,
                'amenity_key': 'babakocsi_barat_bejarat',
                'display_name': 'Babakocsi-barát bejárat',
                'icon': '🚪',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 13,
                'amenity_key': 'gyors_kiszolgalas',
                'display_name': 'Gyors kiszolgálás',
                'icon': '⚡',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 14,
                'amenity_key': 'jatszoszoba',
                'display_name': 'Játszószoba',
                'icon': '🎪',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 15,
                'amenity_key': 'gyerekfelugyelet',
                'display_name': 'Gyerekfelügyelet',
                'icon': '👨‍👩‍👧',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 16,
                'amenity_key': 'rovid_edzesprogram_szuloknek',
                'display_name': 'Rövid edzésprogram szülőknek',
                'icon': '💪',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 17,
                'amenity_key': 'mommy_and_me_ora',
                'display_name': '"Mommy & Me" óra',
                'icon': '👶',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 18,
                'amenity_key': 'gyerekmegfigyelo_plexi_ablak',
                'display_name': 'Gyerekmegfigyelő plexi ablak',
                'icon': '🪟',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 19,
                'amenity_key': 'babakocsi_kompatibilis_ut',
                'display_name': 'Babakocsi-kompatibilis út',
                'icon': '🛤️',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 20,
                'amenity_key': 'jatszoter',
                'display_name': 'Játszótér',
                'icon': '🛝',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 21,
                'amenity_key': 'homokozo',
                'display_name': 'Homokozó',
                'icon': '🏖️',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 22,
                'amenity_key': 'arnyekos_terulet',
                'display_name': 'Árnyékos terület',
                'icon': '🌳',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 23,
                'amenity_key': 'biztonsagos_kerites',
                'display_name': 'Biztonságos kerítés',
                'icon': '🚧',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 24,
                'amenity_key': 'bicikli_roller_palya',
                'display_name': 'Bicikli / roller pálya',
                'icon': '🚴',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 25,
                'amenity_key': 'padok_szuloknek',
                'display_name': 'Padok szülőknek',
                'icon': '🪑',
                'created_at': datetime.utcnow(),
            },
            {
                'id': 26,
                'amenity_key': 'ivokut',
                'display_name': 'Ivókút',
                'icon': '🚰',
                'created_at': datetime.utcnow(),
            },
        ]
    )
    
    # Reset sequence to continue from 26
    op.execute(sa.text("SELECT setval('amenities_id_seq', 26, true)"))


def downgrade() -> None:
    op.execute(sa.text("DELETE FROM amenities WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26)"))

