from sqlalchemy import Column, String, Text, DateTime, ForeignKey, Numeric, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base


class SavedPlace(Base):
    __tablename__ = "saved_places"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    place_id = Column(UUID(as_uuid=True), ForeignKey("places.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="saved_places")
    place = relationship("Place", back_populates="saved_by")
    
    __table_args__ = (
        UniqueConstraint("user_id", "place_id", name="uq_user_place"),
    )


class PlaceRating(Base):
    __tablename__ = "place_ratings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    place_id = Column(UUID(as_uuid=True), ForeignKey("places.id", ondelete="CASCADE"), nullable=False, index=True)
    rating = Column(Numeric(3, 2), nullable=False)
    review_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="place_ratings")
    place = relationship("Place", back_populates="ratings")
    
    __table_args__ = (
        UniqueConstraint("user_id", "place_id", name="uq_user_place_rating"),
        CheckConstraint("rating >= 0.0 AND rating <= 5.0", name="check_rating"),
    )

