"""add test data for places table

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2025-11-09 14:00:00.000000

"""
from typing import Sequence, Union
import uuid
from datetime import datetime
from decimal import Decimal

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd4e5f6a7b8c9'
down_revision: Union[str, None] = 'c3d4e5f6a7b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Place type IDs (integers from place_types migration: 1=kavezo, 2=etterem, 3=edzoterem, 4=park)
RESTAURANT_TYPE_ID = 2  # etterem


def upgrade() -> None:
    # Remove existing places and related data to avoid duplicates
    # Delete in order to respect foreign key constraints
    op.execute(sa.text("DELETE FROM place_ratings"))
    op.execute(sa.text("DELETE FROM saved_places"))
    op.execute(sa.text("DELETE FROM place_amenities"))
    op.execute(sa.text("DELETE FROM places"))
    
    places_table = sa.table(
        'places',
        sa.column('id', sa.UUID()),
        sa.column('name', sa.String()),
        sa.column('type_id', sa.Integer()),
        sa.column('rating', sa.Numeric()),
        sa.column('address', sa.Text()),
        sa.column('phone', sa.String()),
        sa.column('hours', sa.Text()),
        sa.column('description', sa.Text()),
        sa.column('maps_link', sa.Text()),
        sa.column('latitude', sa.Numeric()),
        sa.column('longitude', sa.Numeric()),
        sa.column('created_at', sa.DateTime(timezone=True)),
        sa.column('updated_at', sa.DateTime(timezone=True)),
        sa.column('is_approved', sa.Boolean()),
        sa.column('is_active', sa.Boolean()),
    )
    
    now = datetime.utcnow()
    
    op.bulk_insert(
        places_table,
        [
            {
                'id': uuid.UUID('00000000-0000-0000-0000-000000000001'),
                'name': 'LAMAREDA Étterem és Bisztró',
                'type_id': RESTAURANT_TYPE_ID,
                'rating': Decimal('4.7'),
                'address': '9022 Győr, Apáca u. 4.',
                'phone': '+36 30 910-1099',
                'hours': 'Hétfő–Vasárnap: 11:00-23:00',
                'description': 'Magas színvonalú modern magyar bisztró, Michelin-ajánlott.',
                'maps_link': 'https://maps.google.com/?q=Győr+Apáca+u.+4',
                'latitude': Decimal('47.6870'),
                'longitude': Decimal('17.6380'),
                'created_at': now,
                'updated_at': now,
                'is_approved': True,
                'is_active': True,
            },
            {
                'id': uuid.UUID('00000000-0000-0000-0000-000000000002'),
                'name': 'Westy Hajó Étterem & Pub',
                'type_id': RESTAURANT_TYPE_ID,
                'rating': Decimal('4.5'),
                'address': '9022 Győr, Móricz Zsigmond rkp. 2',
                'phone': '+36 96 337-700',
                'hours': 'Hétfő–Vasárnap: 11:30-23:00',
                'description': 'Hangulatos hajó-étterem a Rába partján, családi és turistabarát hely.',
                'maps_link': 'https://maps.google.com/?q=Győr+Móricz+Zsigmond+rkp.+2',
                'latitude': Decimal('47.6900'),
                'longitude': Decimal('17.6270'),
                'created_at': now,
                'updated_at': now,
                'is_approved': True,
                'is_active': True,
            },
            {
                'id': uuid.UUID('00000000-0000-0000-0000-000000000003'),
                'name': 'Palffy Restaurant',
                'type_id': RESTAURANT_TYPE_ID,
                'rating': Decimal('4.3'),
                'address': '9022 Győr, Jedlik Ányos u. 19',
                'phone': None,
                'hours': 'Minden nap: 09:00-23:00',
                'description': 'Központi elhelyezkedésű étterem, térhez közel, nagy vendéglétszámra is.',
                'maps_link': 'https://maps.google.com/?q=Győr+Jedlik+Ányos+u.+19',
                'latitude': Decimal('47.6865'),
                'longitude': Decimal('17.6375'),
                'created_at': now,
                'updated_at': now,
                'is_approved': True,
                'is_active': True,
            },
            {
                'id': uuid.UUID('00000000-0000-0000-0000-000000000004'),
                'name': 'Komédiás Étterem',
                'type_id': RESTAURANT_TYPE_ID,
                'rating': Decimal('4.6'),
                'address': '9022 Győr, Czuczor Gergely u. 30',
                'phone': None,
                'hours': 'Csütörtöktől–Szombatig: 11:00-24:00',
                'description': 'Családias hangulatú, sok értékeléssel rendelkező étterem a belvárosban.',
                'maps_link': 'https://maps.google.com/?q=Győr+Czuczor+Gergely+u.+30',
                'latitude': Decimal('47.6868'),
                'longitude': Decimal('17.6360'),
                'created_at': now,
                'updated_at': now,
                'is_approved': True,
                'is_active': True,
            },
            {
                'id': uuid.UUID('00000000-0000-0000-0000-000000000005'),
                'name': 'La Dolce Vita Ristorante – Étterem Pizzéria',
                'type_id': RESTAURANT_TYPE_ID,
                'rating': Decimal('3.9'),
                'address': '9022 Győr, Schweidel u. 23.',
                'phone': None,
                'hours': 'Kedd–Vasárnap: 11:00-15:00, 18:00-23:00',
                'description': 'Olaszos pizzéria-étterem a belvárosban – könnyű választás családoknak.',
                'maps_link': 'https://maps.google.com/?q=Győr+Schweidel+u.+23',
                'latitude': Decimal('47.6872'),
                'longitude': Decimal('17.6383'),
                'created_at': now,
                'updated_at': now,
                'is_approved': True,
                'is_active': True,
            },
            {
                'id': uuid.UUID('00000000-0000-0000-0000-000000000006'),
                'name': 'Tres Amigos Mexikói Étterem',
                'type_id': RESTAURANT_TYPE_ID,
                'rating': Decimal('4.7'),
                'address': '9022 Győr, Liszt Ferenc u. 3',
                'phone': None,
                'hours': 'Szombat: 12:00-22:00; Vasárnap: 12:00-16:00; egyéb napokon 16:00-22:00',
                'description': 'Mexikói konyha Győrben, különleges választás azoknak, akik kipróbálnának mást.',
                'maps_link': 'https://maps.google.com/?q=Győr+Liszt+Ferenc+u.+3',
                'latitude': Decimal('47.6850'),
                'longitude': Decimal('17.6390'),
                'created_at': now,
                'updated_at': now,
                'is_approved': True,
                'is_active': True,
            },
            {
                'id': uuid.UUID('00000000-0000-0000-0000-000000000007'),
                'name': 'Marcal Étterem',
                'type_id': RESTAURANT_TYPE_ID,
                'rating': Decimal('4.6'),
                'address': '9024 Győr, Déry Tibor u. 11/A',
                'phone': None,
                'hours': 'Hétköznap: 10:00-15:00',
                'description': 'Családias hangulatú étterem kedvező áron.',
                'maps_link': 'https://maps.google.com/?q=Győr+Déry+Tibor+u.+11/A',
                'latitude': Decimal('47.6940'),
                'longitude': Decimal('17.6500'),
                'created_at': now,
                'updated_at': now,
                'is_approved': True,
                'is_active': True,
            },
            {
                'id': uuid.UUID('00000000-0000-0000-0000-000000000008'),
                'name': 'Crystal Restaurant / Kristály Étterem',
                'type_id': RESTAURANT_TYPE_ID,
                'rating': Decimal('4.4'),
                'address': '9023 Győr, Bartók Béla utca 9',
                'phone': None,
                'hours': 'Szombat: 11:00-01:00, hétfőtől péntekig: 11:00-22:00',
                'description': 'Kissé különlegesebb esti helyszín, bár családok is járnak.',
                'maps_link': 'https://maps.google.com/?q=Győr+Bartók+Béla+utca+9',
                'latitude': Decimal('47.6825'),
                'longitude': Decimal('17.6350'),
                'created_at': now,
                'updated_at': now,
                'is_approved': True,
                'is_active': True,
            },
            {
                'id': uuid.UUID('00000000-0000-0000-0000-000000000009'),
                'name': 'Marha Jó Steak Bar',
                'type_id': RESTAURANT_TYPE_ID,
                'rating': Decimal('4.8'),
                'address': '9022 Győr, Rákóczi Ferenc u. 9',
                'phone': None,
                'hours': 'Mindennap 11:30-22:00',
                'description': 'Steak-specialista hely Győr belvárosában – húsimádóknak ideális.',
                'maps_link': 'https://maps.google.com/?q=Győr+Rákóczi+Ferenc+u.+9',
                'latitude': Decimal('47.6878'),
                'longitude': Decimal('17.6379'),
                'created_at': now,
                'updated_at': now,
                'is_approved': True,
                'is_active': True,
            },
            {
                'id': uuid.UUID('00000000-0000-0000-0000-000000000010'),
                'name': 'Zöldfa Étterem',
                'type_id': RESTAURANT_TYPE_ID,
                'rating': Decimal('4.0'),
                'address': '9024 Győr, Hunyadi utca 2.',
                'phone': None,
                'hours': 'Hétfőtől Keddig: 11:00-15:30; Szerda–Péntek: 11:00-21:00; Szombat: 11:00-24:00; Vasárnap: 11:00-15:00',
                'description': 'Hangulatos, csendesebb utcai hely, jó választás étkezésre lazább tempóban.',
                'maps_link': 'https://maps.google.com/?q=Győr+Hunyadi+utca+2',
                'latitude': Decimal('47.6930'),
                'longitude': Decimal('17.6450'),
                'created_at': now,
                'updated_at': now,
                'is_approved': True,
                'is_active': True,
            },
        ]
    )


def downgrade() -> None:
    place_ids = [
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000006',
        '00000000-0000-0000-0000-000000000007',
        '00000000-0000-0000-0000-000000000008',
        '00000000-0000-0000-0000-000000000009',
        '00000000-0000-0000-0000-000000000010',
    ]
    place_ids_str = "', '".join(place_ids)
    op.execute(
        sa.text(f"DELETE FROM places WHERE id IN ('{place_ids_str}')")
    )

