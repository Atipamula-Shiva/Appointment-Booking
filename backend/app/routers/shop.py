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
from app.schemas.booking import (
    SlotCreate, SlotResponse,
    BookingStatusUpdate, BookingResponse,
    ServiceCreate, ServiceUpdate, ServiceResponse,
    CategoryCreate, CategoryResponse
)

router = APIRouter(prefix="/shop", tags=["Shop Owner"])


def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat, dlon = lat2 - lat1, lon2 - lon1
    a = sin(dlat/2)**2 + cos(lat1)*cos(lat2)*sin(dlon/2)**2
    return R * 2 * atan2(sqrt(a), sqrt(1 - a))


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


@router.patch("", response_model=ShopResponse, summary="Update shop details")
def update_shop(
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


# ── Nearby shops (customer uses this) ────────────────────

@router.get("/nearby", summary="Get nearby shops sorted by distance")
def get_nearby_shops(
    lat: float = Query(..., description="Customer latitude"),
    lng: float = Query(..., description="Customer longitude"),
    radius_km: float = Query(10.0, description="Search radius in km"),
    db: Session = Depends(get_db),
):
    shops = db.query(Shop).filter(
        Shop.is_open == True,
        Shop.latitude.isnot(None),
        Shop.longitude.isnot(None)
    ).all()

    result = []
    for shop in shops:
        distance = haversine_distance(lat, lng, shop.latitude, shop.longitude)
        if distance <= radius_km:
            result.append({
                "id": str(shop.id),
                "name": shop.name,
                "description": shop.description,
                "address": shop.address,
                "phone": shop.phone,
                "image_url": shop.image_url,
                "is_open": shop.is_open,
                "latitude": shop.latitude,
                "longitude": shop.longitude,
                "distance_km": round(distance, 2)
            })

    result.sort(key=lambda x: x["distance_km"])
    return {"total": len(result), "shops": result}


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

@router.post("/slots", response_model=SlotResponse, status_code=201, summary="Create slot")
def create_slot(
    payload: SlotCreate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    if not shop:
        raise HTTPException(status_code=404, detail="Create your shop first")
    slot = TimeSlot(shop_id=shop.id, **payload.model_dump())
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot


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