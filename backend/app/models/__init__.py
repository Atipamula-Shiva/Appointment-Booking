# import enum
# import uuid
# from datetime import datetime

# from sqlalchemy import (
#     Boolean, Column, DateTime, Enum, Float, ForeignKey,
#     Integer, String, Text,
# )
# from sqlalchemy.dialects.postgresql import UUID
# from sqlalchemy.orm import relationship
# from sqlalchemy.sql import func
# from app.database import Base


# # ─────────────────────────────────────────────
# # Enums
# # ─────────────────────────────────────────────

# class UserRole(str, enum.Enum):
#     SHOP_OWNER = "shop_owner"
#     CUSTOMER   = "customer"


# class OrderStatus(str, enum.Enum):
#     PENDING   = "pending"
#     CONFIRMED = "confirmed"
#     PREPARING = "preparing"
#     READY     = "ready"
#     DELIVERED = "delivered"
#     CANCELLED = "cancelled"


# # ─────────────────────────────────────────────
# # User  (shared for both roles)
# # ─────────────────────────────────────────────

# class User(Base):
#     __tablename__ = "users"
#     __table_args__ = {"schema": "abc"} 

#     id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     phone_number = Column(String(20), unique=True, nullable=False, index=True)
#     name         = Column(String(100), nullable=True)
#     role         = Column(Enum(UserRole), nullable=False)
#     is_verified  = Column(Boolean, default=False)
#     is_active    = Column(Boolean, default=True)
#     created_at   = Column(DateTime, default=datetime.utcnow)
#     updated_at   = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     # Relationships
#     otp     = relationship("OTP",   back_populates="user", uselist=False, cascade="all, delete-orphan")
#     shop    = relationship("Shop",  back_populates="owner", uselist=False)
#     orders  = relationship("Order", back_populates="customer")


# # ─────────────────────────────────────────────
# # OTP
# # ─────────────────────────────────────────────

# class OTP(Base):
#     __tablename__ = "otps"
#     __table_args__ = {"schema": "abc"} 

#     id         = Column(Integer, primary_key=True, autoincrement=True)
#     user_id    = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
#     code       = Column(String(6), nullable=False)
#     expires_at = Column(DateTime, nullable=False)
#     is_used    = Column(Boolean, default=False)
#     created_at = Column(DateTime, default=datetime.utcnow)

#     user = relationship("User", back_populates="otp")


# # ─────────────────────────────────────────────
# # Shop
# # ─────────────────────────────────────────────

# class Shop(Base):
#     __tablename__ = "shops"
#     __table_args__ = {"schema": "abc"} 

#     id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     owner_id    = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, unique=True)
#     name        = Column(String(150), nullable=False)
#     description = Column(Text, nullable=True)
#     address     = Column(Text, nullable=True)
#     phone       = Column(String(20), nullable=True)
#     image_url   = Column(String(500), nullable=True)
#     is_open     = Column(Boolean, default=True)
#     created_at  = Column(DateTime, default=datetime.utcnow)
#     updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     owner      = relationship("User",      back_populates="shop")
#     menu_items = relationship("MenuItem",  back_populates="shop", cascade="all, delete-orphan")
#     orders     = relationship("Order",     back_populates="shop")


# # ─────────────────────────────────────────────
# # Menu Item
# # ─────────────────────────────────────────────

# class MenuItem(Base):
#     __tablename__ = "menu_items"
#     __table_args__ = {"schema": "abc"} 

#     id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     shop_id     = Column(UUID(as_uuid=True), ForeignKey("shops.id", ondelete="CASCADE"), nullable=False)
#     name        = Column(String(150), nullable=False)
#     description = Column(Text, nullable=True)
#     price       = Column(Float, nullable=False)
#     category    = Column(String(80), nullable=True)
#     image_url   = Column(String(500), nullable=True)
#     is_available = Column(Boolean, default=True)
#     created_at  = Column(DateTime, default=datetime.utcnow)
#     updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     shop        = relationship("Shop",      back_populates="menu_items")
#     order_items = relationship("OrderItem", back_populates="menu_item")


# # ─────────────────────────────────────────────
# # Order
# # ─────────────────────────────────────────────

# class Order(Base):
#     __tablename__ = "orders"
#     __table_args__ = {"schema": "abc"} 

#     id            = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     customer_id   = Column(UUID(as_uuid=True), ForeignKey("users.id"),  nullable=False)
#     shop_id       = Column(UUID(as_uuid=True), ForeignKey("shops.id"),  nullable=False)
#     status        = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
#     total_amount  = Column(Float, nullable=False)
#     notes         = Column(Text, nullable=True)
#     created_at    = Column(DateTime, default=datetime.utcnow)
#     updated_at    = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

#     customer    = relationship("User",      back_populates="orders")
#     shop        = relationship("Shop",      back_populates="orders")
#     order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


# class OrderItem(Base):
#     __tablename__ = "order_items"
#     __table_args__ = {"schema": "abc"} 

#     id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     order_id     = Column(UUID(as_uuid=True), ForeignKey("orders.id",      ondelete="CASCADE"), nullable=False)
#     menu_item_id = Column(UUID(as_uuid=True), ForeignKey("menu_items.id"), nullable=False)
#     quantity     = Column(Integer, nullable=False, default=1)
#     unit_price   = Column(Float, nullable=False)

#     order     = relationship("Order",    back_populates="order_items")
#     menu_item = relationship("MenuItem", back_populates="order_items")
#12

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean, Column, DateTime, Enum, Float, ForeignKey,
    Integer, String, Text
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


# ─────────────────────────────────────────────
# Enums
# ─────────────────────────────────────────────

class UserRole(str, enum.Enum):
    SHOP_OWNER = "SHOP_OWNER"
    CUSTOMER   = "CUSTOMER"


class OrderStatus(str, enum.Enum):
    PENDING   = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY     = "ready"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


# ─────────────────────────────────────────────
# User
# ─────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "abc"}

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone_number = Column(String(20), unique=True, nullable=False, index=True)
    username     = Column(String(100), nullable=True)
    name         = Column(String(100), nullable=True)
    role         = Column(Enum(UserRole, name="user_role_enum"), nullable=False)
    is_verified  = Column(Boolean, default=False)
    is_active    = Column(Boolean, default=True)
    created_at   = Column(DateTime, server_default=func.now())
    updated_at   = Column(DateTime, server_default=func.now(), onupdate=func.now())
    password_hash = Column(String(255), nullable=True)  # Optional: for future password-based auth
    otp     = relationship("OTP", back_populates="user", uselist=False, cascade="all, delete-orphan")
    shop    = relationship("Shop", back_populates="owner", uselist=False)
    orders  = relationship("Order", back_populates="customer")
    


# ─────────────────────────────────────────────
# OTP
# ─────────────────────────────────────────────

class OTP(Base):
    __tablename__ = "otps"
    __table_args__ = {"schema": "abc"}

    id         = Column(Integer, primary_key=True, autoincrement=True)
    user_id    = Column(UUID(as_uuid=True), ForeignKey("abc.users.id", ondelete="CASCADE"), nullable=False)
    code       = Column(String(6), nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_used    = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="otp")


# ─────────────────────────────────────────────
# Shop
# ─────────────────────────────────────────────

class Shop(Base):
    __tablename__ = "shops"
    __table_args__ = {"schema": "abc"}

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id    = Column(UUID(as_uuid=True), ForeignKey("abc.users.id", ondelete="CASCADE"), nullable=False, unique=True)
    name        = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    address     = Column(Text, nullable=True)
    phone       = Column(String(20), nullable=True)
    image_url   = Column(String(500), nullable=True)
    is_open     = Column(Boolean, default=True)
    created_at  = Column(DateTime, server_default=func.now())
    updated_at  = Column(DateTime, server_default=func.now(), onupdate=func.now())

    owner      = relationship("User", back_populates="shop")
    menu_items = relationship("MenuItem", back_populates="shop", cascade="all, delete-orphan")
    orders     = relationship("Order", back_populates="shop")


# ─────────────────────────────────────────────
# Menu Item
# ─────────────────────────────────────────────

class MenuItem(Base):
    __tablename__ = "menu_items"
    __table_args__ = {"schema": "abc"}

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    shop_id      = Column(UUID(as_uuid=True), ForeignKey("abc.shops.id", ondelete="CASCADE"), nullable=False)
    name         = Column(String(150), nullable=False)
    description  = Column(Text, nullable=True)
    price        = Column(Float, nullable=False)
    category     = Column(String(80), nullable=True)
    image_url    = Column(String(500), nullable=True)
    is_available = Column(Boolean, default=True)
    created_at   = Column(DateTime, server_default=func.now())
    updated_at   = Column(DateTime, server_default=func.now(), onupdate=func.now())

    shop        = relationship("Shop", back_populates="menu_items")
    order_items = relationship("OrderItem", back_populates="menu_item")


# ─────────────────────────────────────────────
# Order
# ─────────────────────────────────────────────

class Order(Base):
    __tablename__ = "orders"
    __table_args__ = {"schema": "abc"}

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id  = Column(UUID(as_uuid=True), ForeignKey("abc.users.id", ondelete="CASCADE"), nullable=False)
    shop_id      = Column(UUID(as_uuid=True), ForeignKey("abc.shops.id", ondelete="CASCADE"), nullable=False)
    status       = Column(Enum(OrderStatus, name="order_status_enum"), default=OrderStatus.PENDING)
    total_amount = Column(Float, nullable=False)
    notes        = Column(Text, nullable=True)
    created_at   = Column(DateTime, server_default=func.now())
    updated_at   = Column(DateTime, server_default=func.now(), onupdate=func.now())

    customer    = relationship("User", back_populates="orders")
    shop        = relationship("Shop", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")


# ─────────────────────────────────────────────
# Order Item
# ─────────────────────────────────────────────

class OrderItem(Base):
    __tablename__ = "order_items"
    __table_args__ = {"schema": "abc"}

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id     = Column(UUID(as_uuid=True), ForeignKey("abc.orders.id", ondelete="CASCADE"), nullable=False)
    menu_item_id = Column(UUID(as_uuid=True), ForeignKey("abc.menu_items.id", ondelete="CASCADE"), nullable=False)
    quantity     = Column(Integer, nullable=False, default=1)
    unit_price   = Column(Float, nullable=False)

    order     = relationship("Order", back_populates="order_items")
    menu_item = relationship("MenuItem", back_populates="order_items")