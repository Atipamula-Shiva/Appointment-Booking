from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class OrderItemCreate(BaseModel):
    menu_item_id: UUID
    quantity: int = 1


class OrderCreate(BaseModel):
    shop_id: UUID
    items: list[OrderItemCreate]
    notes: str | None = None


class OrderStatusUpdate(BaseModel):
    status: str   # pending | confirmed | preparing | ready | delivered | cancelled


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
