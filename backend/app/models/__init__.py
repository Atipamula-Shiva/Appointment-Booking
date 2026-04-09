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
    Integer, String, Text, Date, Time,
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

class BookingStatus(str, enum.Enum):
    PENDING   = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

# ─────────────────────────────────────────────
# User
# ─────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"
    __table_args__ = {"schema": "abc"}

    id           = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phone_number = Column(String(20), unique=True, nullable=False, index=True)
    username     = Column(String(100), nullable=True)
    email = Column(String, unique=True, nullable=True)
    role         = Column(Enum(UserRole, name="user_role_enum"), nullable=False)
    is_verified  = Column(Boolean, default=False)
    is_active    = Column(Boolean, default=True)
    created_at   = Column(DateTime, server_default=func.now())
    updated_at   = Column(DateTime, server_default=func.now(), onupdate=func.now())
    password_hash = Column(String(255), nullable=True)  # Optional: for future password-based auth
    otp     = relationship("OTP", back_populates="user", uselist=False, cascade="all, delete-orphan")
    shop    = relationship("Shop", back_populates="owner", uselist=False)
    orders  = relationship("Order", back_populates="customer")
    latitude    = Column(Float, nullable=True)  
    longitude   = Column(Float, nullable=True)   
    


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

class OTPStore(Base):
    __tablename__ = "otp_store"
    __table_args__ = {"schema": "abc"}

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True, nullable=False)
    otp = Column(String, nullable=False)
    purpose = Column(String, nullable=False)  # "register" | "reset_password" | "forgot_username"
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)

# ─────────────────────────────────────────────
# Shop
# ─────────────────────────────────────────────

# class Shop(Base):
#     __tablename__ = "shops"
#     __table_args__ = {"schema": "abc"}

#     id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
#     owner_id    = Column(UUID(as_uuid=True), ForeignKey("abc.users.id", ondelete="CASCADE"), nullable=False, unique=True)
#     name        = Column(String(150), nullable=False)
#     description = Column(Text, nullable=True)
#     address     = Column(Text, nullable=True)
#     phone       = Column(String(20), nullable=True)
#     image_url   = Column(String(500), nullable=True)
#     is_open     = Column(Boolean, default=True)
#     created_at  = Column(DateTime, server_default=func.now())
#     updated_at  = Column(DateTime, server_default=func.now(), onupdate=func.now())
#     latitude    = Column(Float, nullable=True)  
#     longitude   = Column(Float, nullable=True) 

#     owner      = relationship("User", back_populates="shop")
#     menu_items = relationship("MenuItem", back_populates="shop", cascade="all, delete-orphan")
#     orders     = relationship("Order", back_populates="shop")
#     services   = relationship("Service", back_populates="shop", cascade="all, delete-orphan") 

class Shop(Base):
    __tablename__ = "shops"
    __table_args__ = {"schema": "abc"}

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id    = Column(UUID(as_uuid=True), ForeignKey("abc.users.id"), nullable=False, unique=True)
    name        = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    address     = Column(Text, nullable=True)
    phone       = Column(String(20), nullable=True)
    image_url   = Column(String(500), nullable=True)
    is_open     = Column(Boolean, default=True)
    latitude    = Column(Float, nullable=True)
    longitude   = Column(Float, nullable=True)
    open_time   = Column(String(8), nullable=True)   # "09:00:00"
    close_time  = Column(String(8), nullable=True)   # "16:00:00"
    created_at  = Column(DateTime, server_default=func.now())
    updated_at  = Column(DateTime, server_default=func.now(), onupdate=func.now())

    owner      = relationship("User",     back_populates="shop")
    menu_items = relationship("MenuItem", back_populates="shop", cascade="all, delete-orphan")
    orders     = relationship("Order",    back_populates="shop")
    services   = relationship("Service",  back_populates="shop", cascade="all, delete-orphan")
    slots      = relationship("TimeSlot", back_populates="shop", cascade="all, delete-orphan")
    
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


class Category(Base):
    __tablename__ = "categories"
    __table_args__ = {"schema": "abc"}

    id   = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)  # "Video Editing", "Cleaning"
    icon_url = Column(String(500), nullable=True)

    services = relationship("Service", back_populates="category")


class Service(Base):  # replaces MenuItem
    __tablename__ = "services"
    __table_args__ = {"schema": "abc"}

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    shop_id     = Column(UUID(as_uuid=True), ForeignKey("abc.shops.id", ondelete="CASCADE"))
    category_id = Column(UUID(as_uuid=True), ForeignKey("abc.categories.id"))
    name        = Column(String(150), nullable=False)   # "30-sec Reel Edit"
    description = Column(Text, nullable=True)
    price       = Column(Float, nullable=False)
    duration_minutes = Column(Integer, nullable=False)  # how long the service takes
    is_available = Column(Boolean, default=True)
    image_url        = Column(String(500), nullable=True)

    shop     = relationship("Shop", back_populates="services")
    category = relationship("Category", back_populates="services")
    slots    = relationship("TimeSlot", back_populates="service")


class TimeSlot(Base):
    __tablename__ = "time_slots"
    __table_args__ = {"schema": "abc"}

    id         = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    shop_id    = Column(UUID(as_uuid=True), ForeignKey("abc.shops.id", ondelete="CASCADE"))
    service_id = Column(UUID(as_uuid=True), ForeignKey("abc.services.id", ondelete="CASCADE"))
    date       = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time   = Column(Time, nullable=False)
    capacity   = Column(Integer, default=1)   # how many bookings allowed in this slot
    booked     = Column(Integer, default=0)   # current bookings count

    shop     = relationship("Shop")
    service  = relationship("Service", back_populates="slots")
    bookings = relationship("Booking", back_populates="slot")

    @property
    def is_available(self):
        return self.booked < self.capacity


class Booking(Base):
    __tablename__ = "bookings"
    __table_args__ = {"schema": "abc"}

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    customer_id = Column(UUID(as_uuid=True), ForeignKey("abc.users.id"))
    slot_id     = Column(UUID(as_uuid=True), ForeignKey("abc.time_slots.id"))
    service_id  = Column(UUID(as_uuid=True), ForeignKey("abc.services.id"))
    status      = Column(Enum(BookingStatus), default=BookingStatus.PENDING)
    notes       = Column(Text, nullable=True)
    created_at  = Column(DateTime, server_default=func.now())
    shop_id     = Column(UUID(as_uuid=True), ForeignKey("abc.shops.id"), nullable=True)  # Added shop_id to Booking
    service_name = Column(String(150), nullable=True)  # Store service name for easy access in responses
    customer = relationship("User")
    slot     = relationship("TimeSlot", back_populates="bookings")
    service  = relationship("Service")
