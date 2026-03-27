from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_shop_owner
from app.models import MenuItem, Shop, User
from app.schemas.shop import (
    MenuItemCreate, MenuItemResponse, MenuItemUpdate,
    ShopCreate, ShopResponse, ShopUpdate,
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
