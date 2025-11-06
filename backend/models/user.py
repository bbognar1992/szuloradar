from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base


class User(Base):
    __tablename__ = "users"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    phone = Column(String(20))
    profile_image_url = Column(String)
    subscription_type = Column(String(20), default="free", nullable=False)
    parent_count = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Relationships
    children = relationship("Children", back_populates="user", cascade="all, delete-orphan")
    saved_places = relationship("SavedPlace", back_populates="user", cascade="all, delete-orphan")
    place_ratings = relationship("PlaceRating", back_populates="user", cascade="all, delete-orphan")
    recommendations = relationship(
        "Recommendation", 
        primaryjoin="User.id == Recommendation.user_id",
        back_populates="user"
    )
    
    __table_args__ = (
        CheckConstraint("subscription_type IN ('free', 'premium', 'family')", name="check_subscription_type"),
        CheckConstraint("parent_count >= 1", name="check_parent_count"),
    )


class Children(Base):
    __tablename__ = "children"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    birth_year = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="children")
    
    __table_args__ = (
        CheckConstraint("birth_year >= 1900 AND birth_year <= EXTRACT(YEAR FROM CURRENT_DATE)", name="check_birth_year"),
    )

