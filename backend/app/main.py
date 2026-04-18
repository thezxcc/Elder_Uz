from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, select, text
from sqlalchemy.orm import Session
from sqladmin import Admin

from .admin import EventAdmin, GroupClassAdmin
from .database import Base, engine, get_db
from .models import Event, GroupClass
from .schemas import EventRead, GroupClassRead

EVENT_COLUMN_UPDATES: dict[str, str] = {
    "organizer": "VARCHAR(255) NOT NULL DEFAULT ''",
    "phone": "VARCHAR(50) NOT NULL DEFAULT ''",
    "image_url": (
        "VARCHAR(500) NOT NULL DEFAULT "
        "'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80'"
    ),
    "title_ru": "VARCHAR(255) NOT NULL DEFAULT ''",
    "title_uz": "VARCHAR(255) NOT NULL DEFAULT ''",
    "title_en": "VARCHAR(255) NOT NULL DEFAULT ''",
    "description_ru": "TEXT NOT NULL DEFAULT ''",
    "description_uz": "TEXT NOT NULL DEFAULT ''",
    "description_en": "TEXT NOT NULL DEFAULT ''",
    "location_ru": "VARCHAR(255) NOT NULL DEFAULT ''",
    "location_uz": "VARCHAR(255) NOT NULL DEFAULT ''",
    "location_en": "VARCHAR(255) NOT NULL DEFAULT ''",
    "organizer_ru": "VARCHAR(255) NOT NULL DEFAULT ''",
    "organizer_uz": "VARCHAR(255) NOT NULL DEFAULT ''",
    "organizer_en": "VARCHAR(255) NOT NULL DEFAULT ''",
}

GROUP_CLASS_COLUMN_UPDATES: dict[str, str] = {
    "organizer": "VARCHAR(255) NOT NULL DEFAULT ''",
    "phone": "VARCHAR(50) NOT NULL DEFAULT ''",
    "image_url": (
        "VARCHAR(500) NOT NULL DEFAULT "
        "'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=80'"
    ),
    "title_ru": "VARCHAR(255) NOT NULL DEFAULT ''",
    "title_uz": "VARCHAR(255) NOT NULL DEFAULT ''",
    "title_en": "VARCHAR(255) NOT NULL DEFAULT ''",
    "category_ru": "VARCHAR(200) NOT NULL DEFAULT ''",
    "category_uz": "VARCHAR(200) NOT NULL DEFAULT ''",
    "category_en": "VARCHAR(200) NOT NULL DEFAULT ''",
    "description_ru": "TEXT NOT NULL DEFAULT ''",
    "description_uz": "TEXT NOT NULL DEFAULT ''",
    "description_en": "TEXT NOT NULL DEFAULT ''",
    "location_ru": "VARCHAR(255) NOT NULL DEFAULT ''",
    "location_uz": "VARCHAR(255) NOT NULL DEFAULT ''",
    "location_en": "VARCHAR(255) NOT NULL DEFAULT ''",
    "days_of_week_ru": "VARCHAR(120) NOT NULL DEFAULT ''",
    "days_of_week_uz": "VARCHAR(120) NOT NULL DEFAULT ''",
    "days_of_week_en": "VARCHAR(120) NOT NULL DEFAULT ''",
    "organizer_ru": "VARCHAR(255) NOT NULL DEFAULT ''",
    "organizer_uz": "VARCHAR(255) NOT NULL DEFAULT ''",
    "organizer_en": "VARCHAR(255) NOT NULL DEFAULT ''",
}


def ensure_table_columns(table_name: str, columns: dict[str, str]) -> None:
    inspector = inspect(engine)
    if table_name not in set(inspector.get_table_names()):
        return

    existing_columns = {column["name"] for column in inspector.get_columns(table_name)}
    statements = [
        f"ALTER TABLE {table_name} ADD COLUMN {column_name} {column_def}"
        for column_name, column_def in columns.items()
        if column_name not in existing_columns
    ]

    if not statements:
        return

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


def ensure_schema_updates() -> None:
    ensure_table_columns("events", EVENT_COLUMN_UPDATES)
    ensure_table_columns("group_classes", GROUP_CLASS_COLUMN_UPDATES)


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    ensure_schema_updates()
    yield


app = FastAPI(title="Events App API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

admin = Admin(app, engine, title="Events Admin")
admin.add_view(EventAdmin)
admin.add_view(GroupClassAdmin)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/events", response_model=list[EventRead])
def list_events(db: Session = Depends(get_db)) -> list[Event]:
    return list(db.scalars(select(Event).order_by(Event.start_at.asc())).all())


@app.get("/api/group-classes", response_model=list[GroupClassRead])
def list_group_classes(db: Session = Depends(get_db)) -> list[GroupClass]:
    return list(db.scalars(select(GroupClass).order_by(GroupClass.title.asc())).all())
