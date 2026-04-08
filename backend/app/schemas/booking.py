from uuid import UUID
from datetime import date, time, datetime
from typing import Optional
from pydantic import BaseModel, field_validator


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


class ServiceCreate(BaseModel):
    category_id: UUID
    name: str
    description: Optional[str] = None
    price: float
    duration_minutes: int
    image_url: Optional[str] = None


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration_minutes: Optional[int] = None
    is_available: Optional[bool] = None


class ServiceResponse(BaseModel):
    id: UUID
    shop_id: UUID
    category_id: UUID
    name: str
    description: Optional[str]
    price: float
    duration_minutes: int
    is_available: bool

    model_config = {"from_attributes": True}


from datetime import date as DateType

class SlotCreate(BaseModel):
    service_id: UUID
    date: str        # "2026-04-07"

    @field_validator("date")
    @classmethod
    def check_date(cls, v):
        try:
            DateType.fromisoformat(v)
        except ValueError:
            raise ValueError("Date must be YYYY-MM-DD format")
        return v


class SlotResponse(BaseModel):
    id: UUID
    shop_id: UUID
    service_id: UUID
    date: date
    start_time: time
    end_time: time
    capacity: int
    booked: int
    is_available: bool

    model_config = {"from_attributes": True}


class BookingCreate(BaseModel):
    slot_id: UUID
    service_id: UUID
    date: str
    start_time: str
    end_time: str
    notes: Optional[str] = None
    



class BookingStatusUpdate(BaseModel):
    status: str


class BookingResponse(BaseModel):
    id: UUID
    customer_id: UUID
    slot_id: UUID
    service_id: UUID
    status: str
    notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}