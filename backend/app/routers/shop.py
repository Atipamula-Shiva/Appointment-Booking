# from uuid import UUID

# from fastapi import APIRouter, Depends, HTTPException, status
# from sqlalchemy.orm import Session

# from app.database import get_db
# from app.dependencies import require_shop_owner
# from app.models import Booking, BookingStatus, MenuItem, Shop, TimeSlot, User
# from app.schemas.shop import (
#     MenuItemCreate, MenuItemResponse, MenuItemUpdate,
#     ShopCreate, ShopResponse, ShopUpdate,
# )
# from app.schemas.booking import SlotCreate, BookingStatusUpdate, BookingResponse, SlotResponse 

# router = APIRouter(prefix="/shop", tags=["Shop Owner"])


# # ── Shop management ───────────────────────────────────────

# @router.post("", response_model=ShopResponse, status_code=201, summary="Create shop profile")
# def create_shop(
#     payload: ShopCreate,
#     current_user: User = Depends(require_shop_owner),
#     db: Session = Depends(get_db),
# ):
#     if current_user.shop:
#         raise HTTPException(status_code=400, detail="You already have a shop")
#     shop = Shop(owner_id=current_user.id, **payload.model_dump())
#     db.add(shop)
#     db.commit()
#     db.refresh(shop)
#     return shop


# @router.get("", response_model=ShopResponse, summary="Get my shop")
# def get_my_shop(
#     current_user: User = Depends(require_shop_owner),
#     db: Session = Depends(get_db),
# ):
#     if not current_user.shop:
#         raise HTTPException(status_code=404, detail="Shop not found. Please create one first.")
#     return current_user.shop


# @router.patch("", response_model=ShopResponse, summary="Update shop details")
# def update_shop(
#     payload: ShopUpdate,
#     current_user: User = Depends(require_shop_owner),
#     db: Session = Depends(get_db),
# ):
#     shop = current_user.shop
#     if not shop:
#         raise HTTPException(status_code=404, detail="Shop not found")
#     for field, value in payload.model_dump(exclude_none=True).items():
#         setattr(shop, field, value)
#     db.commit()
#     db.refresh(shop)
#     return shop


# # ── Menu management ───────────────────────────────────────

# @router.post("/menu", response_model=MenuItemResponse, status_code=201, summary="Add menu item")
# def add_menu_item(
#     payload: MenuItemCreate,
#     current_user: User = Depends(require_shop_owner),
#     db: Session = Depends(get_db),
# ):
#     shop = current_user.shop
#     if not shop:
#         raise HTTPException(status_code=404, detail="Create your shop first")
#     item = MenuItem(shop_id=shop.id, **payload.model_dump())
#     db.add(item)
#     db.commit()
#     db.refresh(item)
#     return item


# @router.get("/menu", response_model=list[MenuItemResponse], summary="List my menu items")
# def list_menu_items(
#     current_user: User = Depends(require_shop_owner),
#     db: Session = Depends(get_db),
# ):
#     shop = current_user.shop
#     if not shop:
#         raise HTTPException(status_code=404, detail="Shop not found")
#     return shop.menu_items


# @router.patch("/menu/{item_id}", response_model=MenuItemResponse, summary="Update menu item")
# def update_menu_item(
#     item_id: UUID,
#     payload: MenuItemUpdate,
#     current_user: User = Depends(require_shop_owner),
#     db: Session = Depends(get_db),
# ):
#     shop = current_user.shop
#     item = db.query(MenuItem).filter(MenuItem.id == item_id, MenuItem.shop_id == shop.id).first()
#     if not item:
#         raise HTTPException(status_code=404, detail="Menu item not found")
#     for field, value in payload.model_dump(exclude_none=True).items():
#         setattr(item, field, value)
#     db.commit()
#     db.refresh(item)
#     return item


# @router.delete("/menu/{item_id}", status_code=204, summary="Delete menu item")
# def delete_menu_item(
#     item_id: UUID,
#     current_user: User = Depends(require_shop_owner),
#     db: Session = Depends(get_db),
# ):
#     shop = current_user.shop
#     item = db.query(MenuItem).filter(MenuItem.id == item_id, MenuItem.shop_id == shop.id).first()
#     if not item:
#         raise HTTPException(status_code=404, detail="Menu item not found")
#     db.delete(item)
#     db.commit()

# # Owner creates time slots
# @router.post("/slots", status_code=201)
# def create_slot(payload: SlotCreate, current_user=Depends(require_shop_owner), db=Depends(get_db)):
#     shop = current_user.shop
#     slot = TimeSlot(shop_id=shop.id, **payload.model_dump())
#     db.add(slot)
#     db.commit()
#     db.refresh(slot)
#     return slot

# # Owner sees all bookings for their shop
# @router.get("/bookings")
# def get_shop_bookings(current_user=Depends(require_shop_owner), db=Depends(get_db)):
#     return db.query(Booking).filter(Booking.slot.has(shop_id=current_user.shop.id)).all()

# # Owner confirms or rejects booking
# @router.patch("/bookings/{booking_id}")
# def update_booking(booking_id: UUID, payload: BookingStatusUpdate,
#                    current_user=Depends(require_shop_owner), db=Depends(get_db)):
#     booking = db.query(Booking).filter(Booking.id == booking_id).first()
#     booking.status = BookingStatus(payload.status)
#     db.commit()
#     return booking


from math import radians, sin, cos, sqrt, atan2
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_shop_owner
from app.models import MenuItem, Shop, User, Service, TimeSlot, Booking, BookingStatus, Category
from app.schemas.shop import (
    MenuItemCreate, MenuItemResponse, MenuItemUpdate,
    ShopCreate, ShopResponse, ShopUpdate,
)
from app.utils.utils import haversine_distance
from app.schemas.booking import (
    SlotCreate, SlotResponse,
    BookingStatusUpdate, BookingResponse,
    ServiceCreate, ServiceUpdate, ServiceResponse,
    CategoryCreate, CategoryResponse
)

router = APIRouter(prefix="/shop", tags=["Shop Owner"])



# ── Shop management ───────────────────────────────────────

@router.post("", response_model=ShopResponse, status_code=201, summary="Create shop profile")
def create_shop(
    payload: ShopCreate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    if current_user.shop:
        raise HTTPException(status_code=400, detail="You already have a shop")
    shop = Shop(owner_id=current_user.id, **payload.model_dump())
    db.add(shop)
    db.commit()
    db.refresh(shop)
    return shop


@router.get("", response_model=ShopResponse, summary="Get my shop")
def get_my_shop(
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    if not current_user.shop:
        raise HTTPException(status_code=404, detail="Shop not found. Please create one first.")
    return current_user.shop


@router.patch("/shop_update/{shop_id}", response_model=ShopResponse, summary="Update shop details")
def update_shop(
    shop_id: UUID,
    payload: ShopUpdate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(shop, field, value)
    db.commit()
    db.refresh(shop)
    return shop


# ── Menu management ───────────────────────────────────────

@router.post("/menu", response_model=MenuItemResponse, status_code=201, summary="Add menu item")
def add_menu_item(
    payload: MenuItemCreate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    if not shop:
        raise HTTPException(status_code=404, detail="Create your shop first")
    item = MenuItem(shop_id=shop.id, **payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/menu", response_model=list[MenuItemResponse], summary="List my menu items")
def list_menu_items(
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return shop.menu_items


@router.patch("/menu/{item_id}", response_model=MenuItemResponse, summary="Update menu item")
def update_menu_item(
    item_id: UUID,
    payload: MenuItemUpdate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    item = db.query(MenuItem).filter(MenuItem.id == item_id, MenuItem.shop_id == shop.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/menu/{item_id}", status_code=204, summary="Delete menu item")
def delete_menu_item(
    item_id: UUID,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    item = db.query(MenuItem).filter(MenuItem.id == item_id, MenuItem.shop_id == shop.id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    db.delete(item)
    db.commit()


# ── Service management ────────────────────────────────────

@router.post("/services", response_model=ServiceResponse, status_code=201, summary="Add service")
def add_service(
    payload: ServiceCreate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    if not shop:
        raise HTTPException(status_code=404, detail="Create your shop first")
    service = Service(shop_id=shop.id, **payload.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.get("/services", response_model=list[ServiceResponse], summary="List my services")
def list_services(
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return shop.services


@router.patch("/services/{service_id}", response_model=ServiceResponse, summary="Update service")
def update_service(
    service_id: UUID,
    payload: ServiceUpdate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    service = db.query(Service).filter(Service.id == service_id, Service.shop_id == shop.id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(service, field, value)
    db.commit()
    db.refresh(service)
    return service


# ── Slot management ───────────────────────────────────────

# @router.post("/slots", response_model=SlotResponse, status_code=201, summary="Create slot")
# def create_slot(
#     payload: SlotCreate,
#     current_user: User = Depends(require_shop_owner),
#     db: Session = Depends(get_db),
# ):
#     shop = current_user.shop
#     if not shop:
#         raise HTTPException(status_code=404, detail="Create your shop first")
#     slot = TimeSlot(shop_id=shop.id, **payload.model_dump())
#     db.add(slot)
#     db.commit()
#     db.refresh(slot)
#     return slot

from datetime import datetime, timedelta, date as DateType
from app.models import Service, TimeSlot, Shop

# @router.post("/slots", status_code=201, summary="Auto-generate slots for a service on a date")
# def create_slot(
#     payload: SlotCreate,
#     current_user: User = Depends(require_shop_owner),
#     db: Session = Depends(get_db),
# ):
#     shop = current_user.shop
#     if not shop:
#         raise HTTPException(status_code=404, detail="Create your shop first")

#     if not shop.open_time or not shop.close_time:
#         raise HTTPException(
#             status_code=400,
#             detail="Set shop open_time and close_time first via PATCH /shop"
#         )

#     service = db.query(Service).filter(
#         Service.id == payload.service_id,
#         Service.shop_id == shop.id
#     ).first()
#     if not service:
#         raise HTTPException(status_code=404, detail="Service not found")

#     # Delete existing slots for this service+date (allow regeneration)
#     db.query(TimeSlot).filter(
#         TimeSlot.service_id == payload.service_id,
#         TimeSlot.date == payload.date,
#         TimeSlot.shop_id == shop.id
#     ).delete()

#     # Parse shop timings
#     slot_date = DateType.fromisoformat(payload.date)
#     open_dt  = datetime.strptime(f"{payload.date} {shop.open_time}",  "%Y-%m-%d %H:%M:%S" if len(shop.open_time) > 5 else "%Y-%m-%d %H:%M")
#     close_dt = datetime.strptime(f"{payload.date} {shop.close_time}", "%Y-%m-%d %H:%M:%S" if len(shop.close_time) > 5 else "%Y-%m-%d %H:%M")
#     duration = timedelta(minutes=service.duration_minutes)

#     # Generate slots
#     created_slots = []
#     current = open_dt
#     while current + duration <= close_dt:
#         slot = TimeSlot(
#             shop_id=shop.id,
#             service_id=service.id,
#             date=slot_date,
#             start_time=current.time(),
#             end_time=(current + duration).time(),
#             capacity=1,
#             booked=0,
#         )
#         db.add(slot)
#         db.flush()
#         created_slots.append({
#             "start_time": current.strftime("%H:%M"),
#             "end_time":   (current + duration).strftime("%H:%M"),
#         })
#         current += duration

#     db.commit()

#     return {
#         "message": f"{len(created_slots)} slots created for {payload.date}",
#         "service": service.name,
#         "duration_minutes": service.duration_minutes,
#         "shop_open": shop.open_time,
#         "shop_close": shop.close_time,
#         "slots_generated": created_slots
#     }

from datetime import datetime, timedelta, date as DateType
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session

@router.post("/slots", status_code=201, summary="Auto-generate slots for a service on a date")
def create_slot(
    payload: SlotCreate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    if not shop:
        raise HTTPException(status_code=404, detail="Create your shop first")

    if not shop.open_time or not shop.close_time:
        raise HTTPException(
            status_code=400,
            detail="Set shop open_time and close_time first via PATCH /shop"
        )

    service = db.query(Service).filter(
        Service.id == payload.service_id,
        Service.shop_id == shop.id
    ).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    # Check whether any existing slots for this service/date already have bookings
    existing_booked_slot = (
        db.query(TimeSlot)
        .filter(
            TimeSlot.service_id == payload.service_id,
            TimeSlot.date == payload.date,
            TimeSlot.shop_id == shop.id,
            TimeSlot.booked > 0
        )
        .first()
    )

    if existing_booked_slot:
        raise HTTPException(
            status_code=400,
            detail="Some slots for this date are already booked. Cannot regenerate slots."
        )

    # Delete only unbooked existing slots
    db.query(TimeSlot).filter(
        TimeSlot.service_id == payload.service_id,
        TimeSlot.date == payload.date,
        TimeSlot.shop_id == shop.id
    ).delete(synchronize_session=False)

    # Parse shop timings
    slot_date = DateType.fromisoformat(payload.date)

    open_time_str = str(shop.open_time)
    close_time_str = str(shop.close_time)

    open_dt = datetime.strptime(
        f"{payload.date} {open_time_str}",
        "%Y-%m-%d %H:%M:%S" if len(open_time_str) > 5 else "%Y-%m-%d %H:%M"
    )
    close_dt = datetime.strptime(
        f"{payload.date} {close_time_str}",
        "%Y-%m-%d %H:%M:%S" if len(close_time_str) > 5 else "%Y-%m-%d %H:%M"
    )

    duration = timedelta(minutes=service.duration_minutes)

    if open_dt >= close_dt:
        raise HTTPException(status_code=400, detail="Shop close_time must be after open_time")

    # Generate slots
    created_slots = []
    current = open_dt

    while current + duration <= close_dt:
        slot = TimeSlot(
            shop_id=shop.id,
            service_id=service.id,
            date=slot_date,
            start_time=current.time(),
            end_time=(current + duration).time(),
            capacity=1,
            booked=0,
        )
        db.add(slot)
        db.flush()  # Generates slot.id immediately

        created_slots.append({
            "slot_id": str(slot.id),
            "start_time": current.strftime("%H:%M"),
            "end_time": (current + duration).strftime("%H:%M"),
            "capacity": slot.capacity,
            "booked": slot.booked,
            "is_available": slot.is_available,
        })

        current += duration

    db.commit()

    return {
        "message": f"{len(created_slots)} slots created for {payload.date}",
        "service": service.name,
        "duration_minutes": service.duration_minutes,
        "shop_open": str(shop.open_time),
        "shop_close": str(shop.close_time),
        "slots_generated": created_slots
    }


@router.get("/slots", response_model=list[SlotResponse], summary="List my slots")
def list_slots(
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    return db.query(TimeSlot).filter(TimeSlot.shop_id == shop.id).all()


# ── Booking management ────────────────────────────────────

@router.get("/bookings", response_model=list[BookingResponse], summary="Get shop bookings")
def get_shop_bookings(
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return db.query(Booking).join(TimeSlot).filter(TimeSlot.shop_id == shop.id).all()


@router.patch("/bookings/{booking_id}", response_model=BookingResponse, summary="Update booking status")
def update_booking(
    booking_id: UUID,
    payload: BookingStatusUpdate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    booking = db.query(Booking).join(TimeSlot).filter(
        Booking.id == booking_id,
        TimeSlot.shop_id == shop.id
    ).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    try:
        booking.status = BookingStatus(payload.status)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status '{payload.status}'")
    db.commit()
    db.refresh(booking)
    return booking