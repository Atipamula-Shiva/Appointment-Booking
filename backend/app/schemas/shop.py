from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


# ── Shop ─────────────────────────────────────────────────

# class ShopCreate(BaseModel):
#     name: str
#     description: str | None = None
#     address: str | None = None
#     phone: str | None = None
#     image_url: str | None = None
#     latitude: float | None = None     
#     longitude: float | None = None



# class ShopUpdate(BaseModel):
#     name: str | None = None
#     description: str | None = None
#     address: str | None = None
#     phone: str | None = None
#     image_url: str | None = None
#     is_open: bool | None = None
#     latitude: float | None = None      
#     longitude: float | None = None


# class ShopResponse(BaseModel):
#     id: UUID
#     owner_id: UUID
#     name: str
#     description: str | None
#     address: str | None
#     phone: str | None
#     image_url: str | None
#     is_open: bool
#     created_at: datetime
#     latitude: float | None = None      
#     longitude: float | None = None

#     model_config = {"from_attributes": True}

class ShopCreate(BaseModel):
    name: str
    description: str | None = None
    address: str | None = None
    phone: str | None = None
    image_url: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    open_time: str | None = None    # "09:00"
    close_time: str | None = None   # "16:00"
    is_open: bool | None = None

class ShopUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    address: str | None = None
    phone: str | None = None
    image_url: str | None = None
    is_open: bool | None = None
    latitude: float | None = None
    longitude: float | None = None
    open_time: str | None = None
    close_time: str | None = None


class ShopResponse(BaseModel):
    id: UUID
    owner_id: UUID
    name: str
    description: str | None
    address: str | None
    phone: str | None
    image_url: str | None
    is_open: bool
    latitude: float | None
    longitude: float | None
    open_time: str | None
    close_time: str | None
    created_at: datetime

    model_config = {"from_attributes": True}

# ── Menu Item ─────────────────────────────────────────────

class MenuItemCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    category: str | None = None
    image_url: str | None = None


class MenuItemUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    price: float | None = None
    category: str | None = None
    image_url: str | None = None
    is_available: bool | None = None


class MenuItemResponse(BaseModel):
    id: UUID
    shop_id: UUID
    name: str
    description: str | None
    price: float
    category: str | None
    image_url: str | None
    is_available: bool
    created_at: datetime

    model_config = {"from_attributes": True}
