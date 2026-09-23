import json
import os
from pathlib import Path

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy import Column, Integer, String, create_engine, select
from sqlalchemy.orm import Session, declarative_base, sessionmaker

# The database file lives beside this Python file.
folder = Path(__file__).resolve().parent
database_url = os.getenv("DATABASE_URL", f"sqlite:///{folder / 'food.db'}")
engine = create_engine(database_url, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    category = Column(String, nullable=False)
    price_cents = Column(Integer, nullable=False)
    image_url = Column(String, nullable=False)


class FoodOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    category: str
    price_cents: int
    image_url: str


def initialize_database():
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        # Seed once. Restarting locally will not duplicate the rows.
        if db.scalar(select(Food.id).limit(1)) is None:
            rows = json.loads((folder / "foods.json").read_text())
            db.add_all([Food(**row) for row in rows])
            db.commit()


# For this tiny single-worker demo, initialize before accepting requests.
initialize_database()
app = FastAPI(title="FreshBites API")

origins = os.getenv(
    "FRONTEND_URL", "http://localhost:3000,http://127.0.0.1:3000"
).split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip().rstrip("/") for origin in origins],
    allow_methods=["GET"],
    allow_headers=["*"],
)


def get_db():
    with SessionLocal() as db:
        yield db


@app.get("/foods", response_model=list[FoodOut])
def get_foods(db: Session = Depends(get_db)):
    return db.scalars(select(Food).order_by(Food.id)).all()


@app.get("/health")
def health():
    return {"status": "ok"}
