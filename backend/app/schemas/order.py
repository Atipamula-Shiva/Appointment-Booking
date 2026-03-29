# from typing import Optional
# from uuid import UUID
# from datetime import datetime
# from pydantic import BaseModel


# class OrderItemCreate(BaseModel):
#     menu_item_id: UUID
#     quantity: int = 1

# class OrderItemUpdate(BaseModel):          # ← add this
#     quantity: Optional[int] = None
#     menu_item_id: Optional[UUID] = None
    
# class OrderCreate(BaseModel):
#     shop_id: UUID
#     items: list[OrderItemCreate]
#     notes: str | None = None


# class OrderStatusUpdate(BaseModel):
#     status: str   # pending | confirmed | preparing | ready | delivered | cancelled


# class OrderItemResponse(BaseModel):
#     id: UUID
#     menu_item_id: UUID
#     quantity: int
#     unit_price: float

#     model_config = {"from_attributes": True}


# class OrderResponse(BaseModel):
#     id: UUID
#     customer_id: UUID
#     shop_id: UUID
#     status: str
#     total_amount: float
#     notes: str | None
#     order_items: list[OrderItemResponse]
#     created_at: datetime
#     updated_at: datetime

#     model_config = {"from_attributes": True}

from uuid import UUID
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class OrderItemCreate(BaseModel):
    menu_item_id: UUID
    quantity: int = 1


class OrderItemUpdate(BaseModel):
    quantity: Optional[int] = None
    menu_item_id: Optional[UUID] = None


class OrderItemDelete(BaseModel):
    menu_item_id: UUID


class OrderCreate(BaseModel):
    shop_id: UUID
    items: list[OrderItemCreate]
    notes: str | None = None


class OrderStatusUpdate(BaseModel):
    status: str


class OrderItemResponse(BaseModel):
    id: UUID
    menu_item_id: UUID
    quantity: int
    unit_price: float

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: UUID
    customer_id: UUID
    shop_id: UUID
    status: str
    total_amount: float
    notes: str | None
    order_items: list[OrderItemResponse]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class CategoryCreate(BaseModel):
    name: str
    icon_url: Optional[str] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    icon_url: Optional[str] = None


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    icon_url: Optional[str] = None

    model_config = {"from_attributes": True}