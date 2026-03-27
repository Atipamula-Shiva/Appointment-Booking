# 🍽️ Food Ordering Backend — FastAPI + PostgreSQL + OTP Auth

A production-ready REST API with **two separate roles**: Shop Owners and Customers, authenticated via phone OTP (Twilio).

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, router registration
│   ├── database.py          # SQLAlchemy engine & session
│   ├── dependencies.py      # JWT guards (get_current_user, require_shop_owner, require_customer)
│   ├── core/
│   │   ├── config.py        # Pydantic settings (.env loader)
│   │   └── security.py      # JWT create/decode
│   ├── models/
│   │   └── __init__.py      # All SQLAlchemy models (User, OTP, Shop, MenuItem, Order, OrderItem)
│   ├── schemas/
│   │   ├── auth.py          # Request/response schemas for auth
│   │   ├── shop.py          # Shop & menu item schemas
│   │   └── order.py         # Order schemas
│   ├── routers/
│   │   ├── auth.py          # POST /auth/send-otp, POST /auth/verify-otp
│   │   ├── shop.py          # Shop owner: CRUD shop + menu
│   │   └── orders.py        # Both roles: browse, place, manage orders
│   └── services/
│       └── otp.py           # OTP generation + Twilio SMS sender
├── requirements.txt
├── alembic.ini
└── .env.example
```

---

## ⚡ Quick Start

### 1. Clone & install dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL URL and Twilio credentials
```

### 3. Create PostgreSQL database
```sql
CREATE DATABASE foodapp_db;
```

### 4. Run the server
```bash
uvicorn app.main:app --reload
```

Visit **http://localhost:8000/docs** for interactive Swagger UI.

---

## 🔐 Auth Flow (Both Roles)

```
1.  POST /auth/send-otp        { phone_number, role, name? }
        → creates user if new, sends SMS OTP via Twilio

2.  POST /auth/verify-otp      { phone_number, code }
        → verifies OTP → returns { access_token, role, user_id }

3.  All protected routes require:
        Authorization: Bearer <access_token>
```

---

## 🏪 Shop Owner Endpoints

| Method | Endpoint             | Description               |
|--------|----------------------|---------------------------|
| POST   | /shop                | Create shop profile       |
| GET    | /shop                | Get my shop               |
| PATCH  | /shop                | Update shop details       |
| POST   | /shop/menu           | Add menu item             |
| GET    | /shop/menu           | List my menu items        |
| PATCH  | /shop/menu/{id}      | Update menu item          |
| DELETE | /shop/menu/{id}      | Delete menu item          |
| GET    | /shop/orders         | View incoming orders      |
| PATCH  | /shop/orders/{id}    | Update order status       |

---

## 🛒 Customer Endpoints

| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------|
| GET    | /shops                 | Browse all open shops    |
| GET    | /shops/{id}/menu       | View shop menu           |
| POST   | /orders                | Place an order           |
| GET    | /orders/my             | View my orders           |

---

## 📦 Order Status Flow

```
PENDING → CONFIRMED → PREPARING → READY → DELIVERED
                  ↘                    ↗
                    CANCELLED
```

---

## 🛠️ Tech Stack

| Layer        | Tech                        |
|--------------|-----------------------------|
| Framework    | FastAPI                     |
| Database     | PostgreSQL + SQLAlchemy 2.0 |
| Migrations   | Alembic                     |
| Auth         | OTP via Twilio + JWT        |
| Validation   | Pydantic v2                 |

---

## 📋 Environment Variables

| Variable                  | Description                          |
|---------------------------|--------------------------------------|
| `DATABASE_URL`            | PostgreSQL connection string         |
| `SECRET_KEY`              | JWT signing key (keep secret!)       |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry (default 7 days)   |
| `TWILIO_ACCOUNT_SID`      | Twilio account SID                   |
| `TWILIO_AUTH_TOKEN`       | Twilio auth token                    |
| `TWILIO_PHONE_NUMBER`     | Your Twilio phone number (+E.164)    |
| `OTP_EXPIRE_MINUTES`      | OTP validity window (default 10 min) |
