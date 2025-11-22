from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, ForeignKey, Numeric, CheckConstraint, Table
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base


# Junction tables
place_amenities = Table(
    "place_amenities",
    Base.metadata,
    Column("place_id", UUID(as_uuid=True), ForeignKey("places.id", ondelete="CASCADE"), primary_key=True),
    Column("amenity_id", Integer, ForeignKey("amenities.id", ondelete="CASCADE"), primary_key=True),
)


class PlaceType(Base):
    __tablename__ = "place_types"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    type_key = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    icon = Column(String(10))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    places = relationship("Place", back_populates="place_type")
    recommendations = relationship("Recommendation", back_populates="place_type")


class Place(Base):
    __tablename__ = "places"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    type_id = Column(Integer, ForeignKey("place_types.id"), nullable=False, index=True)
    rating = Column(Numeric(3, 2), default=0.0, nullable=False)
    address = Column(Text, nullable=False)
    phone = Column(String(20))
    hours = Column(Text)
    description = Column(Text)
    maps_link = Column(Text)
    latitude = Column(Numeric(10, 8))
    longitude = Column(Numeric(11, 8))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_approved = Column(Boolean, default=False, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    place_type = relationship("PlaceType", back_populates="places")
    amenities = relationship("Amenity", secondary=place_amenities, back_populates="places")
    saved_by = relationship("SavedPlace", back_populates="place", cascade="all, delete-orphan")
    ratings = relationship("PlaceRating", back_populates="place", cascade="all, delete-orphan")
    
    __table_args__ = (
        CheckConstraint("rating >= 0.0 AND rating <= 5.0", name="check_rating"),
    )


class Amenity(Base):
    __tablename__ = "amenities"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    amenity_key = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    icon = Column(String(10))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    places = relationship("Place", secondary=place_amenities, back_populates="amenities")


# Junction table for recommendations and amenities
recommendation_amenities = Table(
    "recommendation_amenities",
    Base.metadata,
    Column("recommendation_id", UUID(as_uuid=True), ForeignKey("recommendations.id", ondelete="CASCADE"), primary_key=True),
    Column("amenity_id", Integer, ForeignKey("amenities.id", ondelete="CASCADE"), primary_key=True),
)

