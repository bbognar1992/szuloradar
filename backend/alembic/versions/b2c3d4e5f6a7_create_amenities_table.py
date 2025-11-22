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
    # Remove existing amenities and related data
    # Delete from junction tables first (CASCADE should handle this, but being explicit)
    op.execute(sa.text("DELETE FROM recommendation_amenities"))
    op.execute(sa.text("DELETE FROM place_amenities"))
    # Delete amenities
    op.execute(sa.text("DELETE FROM amenities"))
    
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
                'amenity_key': 'etetoszek',
                'display_name': 'Etetőszék',
                'icon': '🪑',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'),
                'amenity_key': 'pelenkazo',
                'display_name': 'Pelenkázó',
                'icon': '👶',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('cccccccc-cccc-cccc-cccc-cccccccccccc'),
                'amenity_key': 'jatszosarok',
                'display_name': 'Játszósarok',
                'icon': '🧸',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('dddddddd-dddd-dddd-dddd-dddddddddddd'),
                'amenity_key': 'babakocsi_kompatibilis',
                'display_name': 'Babakocsi-kompatibilis',
                'icon': '👶',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'),
                'amenity_key': 'gyerekmenu',
                'display_name': 'Gyerekmenü',
                'icon': '🍕',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('ffffffff-ffff-ffff-ffff-ffffffffffff'),
                'amenity_key': 'bebi_etel_melegitese',
                'display_name': 'Bébiétel melegítése',
                'icon': '🍼',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('11111111-1111-1111-1111-111111111111'),
                'amenity_key': 'szoptatos_sarok',
                'display_name': 'Szoptatós sarok',
                'icon': '🤱',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('22222222-2222-2222-2222-222222222222'),
                'amenity_key': 'kulteri_hely_arnyekkal',
                'display_name': 'Kültéri hely árnyékkal',
                'icon': '🌳',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('33333333-3333-3333-3333-333333333333'),
                'amenity_key': 'gyerekbarat_etkeszlet',
                'display_name': 'Gyerekbarát étkészlet',
                'icon': '🍴',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('44444444-4444-4444-4444-444444444444'),
                'amenity_key': 'szinezo_vagy_foglalkoztato',
                'display_name': 'Színező vagy foglalkoztató',
                'icon': '🎨',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('55555555-5555-5555-5555-555555555555'),
                'amenity_key': 'allergen_informaciok_jelolve',
                'display_name': 'Allergén-információk jelölve',
                'icon': '⚠️',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('66666666-6666-6666-6666-666666666666'),
                'amenity_key': 'babakocsi_barat_bejarat',
                'display_name': 'Babakocsi-barát bejárat',
                'icon': '🚪',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('77777777-7777-7777-7777-777777777777'),
                'amenity_key': 'gyors_kiszolgalas',
                'display_name': 'Gyors kiszolgálás',
                'icon': '⚡',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('88888888-8888-8888-8888-888888888888'),
                'amenity_key': 'jatszoszoba',
                'display_name': 'Játszószoba',
                'icon': '🎪',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('99999999-9999-9999-9999-999999999999'),
                'amenity_key': 'gyerekfelugyelet',
                'display_name': 'Gyerekfelügyelet',
                'icon': '👨‍👩‍👧',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'),
                'amenity_key': 'rovid_edzesprogram_szuloknek',
                'display_name': 'Rövid edzésprogram szülőknek',
                'icon': '💪',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('bbbbbbbb-cccc-dddd-eeee-ffffffffffff'),
                'amenity_key': 'mommy_and_me_ora',
                'display_name': '"Mommy & Me" óra',
                'icon': '👶',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('cccccccc-dddd-eeee-ffff-aaaaaaaaaaaa'),
                'amenity_key': 'gyerekmegfigyelo_plexi_ablak',
                'display_name': 'Gyerekmegfigyelő plexi ablak',
                'icon': '🪟',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('dddddddd-eeee-ffff-aaaa-bbbbbbbbbbbb'),
                'amenity_key': 'babakocsi_kompatibilis_ut',
                'display_name': 'Babakocsi-kompatibilis út',
                'icon': '🛤️',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('eeeeeeee-ffff-aaaa-bbbb-cccccccccccc'),
                'amenity_key': 'jatszoter',
                'display_name': 'Játszótér',
                'icon': '🛝',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('ffffffff-aaaa-bbbb-cccc-dddddddddddd'),
                'amenity_key': 'homokozo',
                'display_name': 'Homokozó',
                'icon': '🏖️',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('aaaaaaa1-bbbb-cccc-dddd-eeeeeeeeeeee'),
                'amenity_key': 'arnyekos_terulet',
                'display_name': 'Árnyékos terület',
                'icon': '🌳',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('bbbbbbb1-cccc-dddd-eeee-ffffffffffff'),
                'amenity_key': 'biztonsagos_kerites',
                'display_name': 'Biztonságos kerítés',
                'icon': '🚧',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('ccccccc1-dddd-eeee-ffff-aaaaaaaaaaaa'),
                'amenity_key': 'bicikli_roller_palya',
                'display_name': 'Bicikli / roller pálya',
                'icon': '🚴',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('ddddddd1-eeee-ffff-aaaa-bbbbbbbbbbbb'),
                'amenity_key': 'padok_szuloknek',
                'display_name': 'Padok szülőknek',
                'icon': '🪑',
                'created_at': datetime.utcnow(),
            },
            {
                'id': uuid.UUID('eeeeeee1-ffff-aaaa-bbbb-cccccccccccc'),
                'amenity_key': 'ivokut',
                'display_name': 'Ivókút',
                'icon': '🚰',
                'created_at': datetime.utcnow(),
            },
        ]
    )


def downgrade() -> None:
    op.execute(
        sa.text("DELETE FROM amenities WHERE id IN ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'ffffffff-ffff-ffff-ffff-ffffffffffff', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888888', '99999999-9999-9999-9999-999999999999', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'cccccccc-dddd-eeee-ffff-aaaaaaaaaaaa', 'dddddddd-eeee-ffff-aaaa-bbbbbbbbbbbb', 'eeeeeeee-ffff-aaaa-bbbb-cccccccccccc', 'ffffffff-aaaa-bbbb-cccc-dddddddddddd', 'aaaaaaa1-bbbb-cccc-dddd-eeeeeeeeeeee', 'bbbbbbb1-cccc-dddd-eeee-ffffffffffff', 'ccccccc1-dddd-eeee-ffff-aaaaaaaaaaaa', 'ddddddd1-eeee-ffff-aaaa-bbbbbbbbbbbb', 'eeeeeee1-ffff-aaaa-bbbb-cccccccccccc')")
    )

