from sqlalchemy import Column, String, Text, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base
from models.place import recommendation_amenities, Amenity


class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    place_name = Column(String(255), nullable=False)
    place_type_id = Column(UUID(as_uuid=True), ForeignKey("place_types.id"), nullable=False, index=True)
    recommendation_text = Column(Text, nullable=False)
    maps_link = Column(Text)
    address = Column(Text)
    phone = Column(String(20))
    status = Column(String(20), default="pending", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    reviewed_at = Column(DateTime(timezone=True))
    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    review_notes = Column(Text)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="recommendations")
    reviewer = relationship("User", foreign_keys=[reviewed_by])
    place_type = relationship("PlaceType", back_populates="recommendations")
    amenities = relationship("Amenity", secondary=recommendation_amenities)
    
    __table_args__ = (
        CheckConstraint("status IN ('pending', 'approved', 'rejected')", name="check_status"),
    )

