from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_customer, require_shop_owner, get_current_user
from app.models import Booking, BookingStatus, Category, MenuItem, Order, OrderItem, OrderStatus, Service, Shop, TimeSlot, User
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate, OrderItemCreate, OrderItemResponse, OrderItemUpdate, OrderItemDelete, CategoryResponse, CategoryCreate, CategoryUpdate
from app.schemas.booking import BookingCreate, BookingResponse, SlotResponse
from app.utils.utils import haversine_distance
router = APIRouter(tags=["Orders"])


# ─────────────────────────────────────────────
# Customer – browse & order
# ─────────────────────────────────────────────

@router.get("/shops", response_model=list[dict], summary="Browse all open shops")
def list_shops(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    shops = db.query(Shop).filter(Shop.is_open == True).all()
    return [
        {
            "id": str(s.id),
            "name": s.name,
            "description": s.description,
            "address": s.address,
            "image_url": s.image_url,
        }
        for s in shops
    ]


@router.get("/shops/{shop_id}/menu", response_model=list[dict], summary="View menu of a shop")
def view_shop_menu(shop_id: UUID, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    items = db.query(MenuItem).filter(
        MenuItem.shop_id == shop_id, MenuItem.is_available == True
    ).all()
    return [
        {
            "id": str(i.id),
            "name": i.name,
            "description": i.description,
            "price": i.price,
            "category": i.category,
            "image_url": i.image_url,
        }
        for i in items
    ]


@router.post("/orders", response_model=OrderResponse, status_code=201, summary="Place an order")
def place_order(
    payload: OrderCreate,
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    shop = db.query(Shop).filter(Shop.id == payload.shop_id, Shop.is_open == True).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found or closed")

    total = 0.0
    order_items = []
    for item_req in payload.items:
        menu_item = db.query(MenuItem).filter(
            MenuItem.id == item_req.menu_item_id,
            MenuItem.shop_id == shop.id,
            MenuItem.is_available == True,
        ).first()
        if not menu_item:
            raise HTTPException(
                status_code=400,
                detail=f"Menu item {item_req.menu_item_id} not available",
            )
        subtotal = menu_item.price * item_req.quantity
        total += subtotal
        order_items.append(
            OrderItem(
                menu_item_id=menu_item.id,
                quantity=item_req.quantity,
                unit_price=menu_item.price,
            )
        )

    order = Order(
        customer_id=current_user.id,
        shop_id=shop.id,
        total_amount=round(total, 2),
        notes=payload.notes,
    )
    db.add(order)
    db.flush()   # get order.id

    for oi in order_items:
        oi.order_id = order.id
        db.add(oi)

    db.commit()
    db.refresh(order)
    return order


@router.get("/orders/my", response_model=list[OrderResponse], summary="Customer: my orders")
def my_orders(
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    return (
        db.query(Order)
        .filter(Order.customer_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


# ─────────────────────────────────────────────
# Shop Owner – manage incoming orders
# ─────────────────────────────────────────────

@router.get("/shop/orders", response_model=list[OrderResponse], summary="Shop: incoming orders")
def shop_orders(
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    shop = current_user.shop
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return (
        db.query(Order)
        .filter(Order.shop_id == shop.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.patch("/shop/orders/{order_id}", response_model=OrderResponse, summary="Shop: update order status")
def update_order_status(
    order_id: UUID,
    payload: OrderStatusUpdate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    try:
        new_status = OrderStatus(payload.status)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status '{payload.status}'")

    shop = current_user.shop
    order = db.query(Order).filter(Order.id == order_id, Order.shop_id == shop.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.status = new_status
    db.commit()
    db.refresh(order)
    return order

# ── Categories (public) ───────────────────────────────────

@router.post("/categories", response_model=CategoryResponse, status_code=201, summary="Create category")
def create_category(payload: CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(Category).filter(Category.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    cat = Category(**payload.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.get("/categories", summary="List categories")
def list_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()


# ── Customer – browse shops ───────────────────────────────

@router.get("/shops", response_model=list[dict], summary="Browse all open shops")
def list_shops(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    shops = db.query(Shop).filter(Shop.is_open == True).all()
    return [
        {
            "id": str(s.id),
            "name": s.name,
            "description": s.description,
            "address": s.address,
            "image_url": s.image_url,
            "latitude": s.latitude,
            "longitude": s.longitude,
        }
        for s in shops
    ]


@router.get("/shops/{shop_id}/menu", response_model=list[dict], summary="View menu of a shop")
def view_shop_menu(shop_id: UUID, db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    shop = db.query(Shop).filter(Shop.id == shop_id).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    items = db.query(MenuItem).filter(MenuItem.shop_id == shop_id, MenuItem.is_available == True).all()
    return [
        {
            "id": str(i.id),
            "name": i.name,
            "description": i.description,
            "price": i.price,
            "category": i.category,
            "image_url": i.image_url,
        }
        for i in items
    ]


# ── Customer – services & slots ───────────────────────────

@router.get("/services/{service_id}/slots", summary="Get available slots for a service")
def get_slots(
    service_id: UUID,
    date: str = Query(..., description="Date in YYYY-MM-DD format"),
    db: Session = Depends(get_db)
):
    slots = db.query(TimeSlot).filter(
        TimeSlot.service_id == service_id,
        TimeSlot.date == date,
    ).all()
    return [
        {
            "id": str(s.id),
            "date": str(s.date),
            "start_time": str(s.start_time),
            "end_time": str(s.end_time),
            "capacity": s.capacity,
            "booked": s.booked,
            "is_available": s.booked < s.capacity
        }
        for s in slots
    ]


# ── Customer – bookings ───────────────────────────────────

@router.post("/bookings", response_model=BookingResponse, status_code=201, summary="Book a slot")
def create_booking(
    payload: BookingCreate,
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db)
):
    slot = db.query(TimeSlot).filter(TimeSlot.id == payload.slot_id).first()
    if not slot:
        raise HTTPException(status_code=404, detail="Slot not found")
    if slot.booked >= slot.capacity:
        raise HTTPException(status_code=400, detail="Slot is fully booked")

    booking = Booking(
        customer_id=current_user.id,
        slot_id=slot.id,
        service_id=slot.service_id,
        notes=payload.notes,
        status=BookingStatus.PENDING
    )
    slot.booked += 1
    db.add(booking)
    db.commit()
    db.refresh(booking)
    return booking


@router.get("/bookings/my", response_model=list[BookingResponse], summary="Customer: my bookings")
def my_bookings(
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db)
):
    return db.query(Booking).filter(Booking.customer_id == current_user.id).order_by(Booking.created_at.desc()).all()


# ── Orders (existing) ─────────────────────────────────────

@router.post("/orders", response_model=OrderResponse, status_code=201, summary="Place an order")
def place_order(
    payload: OrderCreate,
    current_user: User = Depends(require_customer),
    db: Session = Depends(get_db),
):
    shop = db.query(Shop).filter(Shop.id == payload.shop_id, Shop.is_open == True).first()
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found or closed")

    total = 0.0
    order_items = []
    for item_req in payload.items:
        menu_item = db.query(MenuItem).filter(
            MenuItem.id == item_req.menu_item_id,
            MenuItem.shop_id == shop.id,
            MenuItem.is_available == True,
        ).first()
        if not menu_item:
            raise HTTPException(status_code=400, detail=f"Menu item {item_req.menu_item_id} not available")
        subtotal = menu_item.price * item_req.quantity
        total += subtotal
        order_items.append(OrderItem(menu_item_id=menu_item.id, quantity=item_req.quantity, unit_price=menu_item.price))

    order = Order(customer_id=current_user.id, shop_id=shop.id, total_amount=round(total, 2), notes=payload.notes)
    db.add(order)
    db.flush()

    for oi in order_items:
        oi.order_id = order.id
        db.add(oi)

    db.commit()
    db.refresh(order)
    return order


@router.get("/orders/my", response_model=list[OrderResponse], summary="Customer: my orders")
def my_orders(current_user: User = Depends(require_customer), db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.customer_id == current_user.id).order_by(Order.created_at.desc()).all()


@router.get("/shop/orders", response_model=list[OrderResponse], summary="Shop: incoming orders")
def shop_orders(current_user: User = Depends(require_shop_owner), db: Session = Depends(get_db)):
    shop = current_user.shop
    if not shop:
        raise HTTPException(status_code=404, detail="Shop not found")
    return db.query(Order).filter(Order.shop_id == shop.id).order_by(Order.created_at.desc()).all()


@router.patch("/shop/orders/{order_id}", response_model=OrderResponse, summary="Shop: update order status")
def update_order_status(
    order_id: UUID,
    payload: OrderStatusUpdate,
    current_user: User = Depends(require_shop_owner),
    db: Session = Depends(get_db),
):
    try:
        new_status = OrderStatus(payload.status)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid status '{payload.status}'")
    shop = current_user.shop
    order = db.query(Order).filter(Order.id == order_id, Order.shop_id == shop.id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = new_status
    db.commit()
    db.refresh(order)
    return order

# ── Search & Filter ───────────────────────────────────────

@router.get("/search", summary="Search shops, services, categories")
def search(
    q: str = Query(None, description="Search by name"),
    category_id: UUID = Query(None, description="Filter by category"),
    min_price: float = Query(None, description="Minimum price"),
    max_price: float = Query(None, description="Maximum price"),
    lat: float = Query(None, description="Customer latitude"),
    lng: float = Query(None, description="Customer longitude"),
    radius_km: float = Query(10.0, description="Search radius in km"),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user)
):
    # ── Step 1: Find matching services ───────────────────
    service_query = db.query(Service).join(Shop).filter(
        Shop.is_open == True,
        Service.is_available == True
    )

    if q:
        service_query = service_query.filter(
            Service.name.ilike(f"%{q}%") |
            Shop.name.ilike(f"%{q}%") |
            Service.description.ilike(f"%{q}%")
        )
    if category_id:
        service_query = service_query.filter(Service.category_id == category_id)
    if min_price is not None:
        service_query = service_query.filter(Service.price >= min_price)
    if max_price is not None:
        service_query = service_query.filter(Service.price <= max_price)

    services = service_query.all()

    # ── Step 2: Group services by shop ───────────────────
    shop_map = {}
    for service in services:
        shop = service.shop
        shop_id = str(shop.id)

        if shop_id not in shop_map:
            # Calculate distance if lat/lng provided
            distance = None
            if lat and lng and shop.latitude and shop.longitude:
                distance = round(haversine_distance(lat, lng, shop.latitude, shop.longitude), 2)
                if radius_km and distance > radius_km:
                    continue  # skip shops outside radius

            shop_map[shop_id] = {
                "shop_id": shop_id,
                "shop_name": shop.name,
                "shop_description": shop.description,
                "shop_address": shop.address,
                "shop_phone": shop.phone,
                "shop_image_url": shop.image_url,
                "shop_latitude": shop.latitude,
                "shop_longitude": shop.longitude,
                "distance_km": distance,
                "services": []
            }

        shop_map[shop_id]["services"].append({
            "service_id": str(service.id),
            "service_name": service.name,
            "description": service.description,
            "price": service.price,
            "duration_minutes": service.duration_minutes,
            "image_url": service.image_url,
            "category_id": str(service.category_id)
        })

    # ── Step 3: Sort shops by distance ───────────────────
    result = list(shop_map.values())

    if lat and lng:
        result.sort(key=lambda x: x["distance_km"] if x["distance_km"] is not None else 9999)

    # ── Step 4: Categories (for filter chips on frontend) ─
    cat_query = db.query(Category)
    if q:
        cat_query = cat_query.filter(Category.name.ilike(f"%{q}%"))
    categories = [
        {"id": str(c.id), "name": c.name, "icon_url": c.icon_url}
        for c in cat_query.all()
    ]

    return {
        "total_shops": len(result),
        "shops": result,          # ← sorted by distance, each with their services
        "categories": categories  # ← for filter chips
    }