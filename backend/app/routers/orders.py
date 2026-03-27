from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_customer, require_shop_owner, get_current_user
from app.models import MenuItem, Order, OrderItem, OrderStatus, Shop, User
from app.schemas.order import OrderCreate, OrderResponse, OrderStatusUpdate

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
