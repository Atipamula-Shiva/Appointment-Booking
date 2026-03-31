import profile

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import *  # noqa: F401, F403 – ensure models are registered
from app.routers import auth, shop, orders, auth_password
from app.routers import profile as profile_router

# Create all tables on startup (use Alembic in production)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Food Ordering API",
    description=(
        "Backend for a food ordering platform.\n\n"
        "**Two roles:**\n"
        "- 🏪 **Shop Owner** – manage shop, menu, and orders\n"
        "- 🛒 **Customer** – browse shops, place orders\n\n"
        "**Auth flow:** `POST /auth/send-otp` → receive SMS → `POST /auth/verify-otp` → get JWT → use as `Bearer` token."
    ),
    version="1.0.0",
)

origins = [
    "https://www.spotlo.in",  # Frontend URL (adjust in production)
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # restrict to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_password.router)
app.include_router(auth.router) 
app.include_router(shop.router)
app.include_router(orders.router)
app.include_router(profile_router.router)


@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "Food Ordering API"}
