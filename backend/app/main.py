from contextlib import asynccontextmanager
from datetime import datetime

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqladmin import Admin

from .admin import EventAdmin, GroupClassAdmin
from .database import Base, SessionLocal, engine, get_db
from .models import Event, GroupClass
from .schemas import EventRead, GroupClassRead


def seed_events(db: Session) -> None:
    has_events = db.scalar(select(Event.id).limit(1))
    if has_events:
        return

    initial_events = [
        Event(
            title="Мастер-класс по кулинарии",
            description=(
                "Приглашаем на увлекательный мастер-класс по узбекской кухне. "
                "Вы научитесь готовить традиционные блюда и познакомитесь с новыми людьми."
            ),
            location="Кулинарная студия, ул. Навои, 15",
            start_at=datetime(2026, 4, 25, 10, 0),
            end_at=datetime(2026, 4, 25, 12, 0),
        ),
        Event(
            title="Концерт «Золотые хиты»",
            description=(
                "Музыкальный вечер с любимыми песнями 70-х и 80-х годов. "
                "Тёплая атмосфера и живое исполнение."
            ),
            location="Дом культуры, Мирзо-Улугбек, 34",
            start_at=datetime(2026, 4, 27, 18, 0),
            end_at=datetime(2026, 4, 27, 20, 0),
        ),
        Event(
            title="Вечер настольных игр",
            description=(
                "Дружеская встреча с настольными играми для активного отдыха "
                "и новых знакомств."
            ),
            location="Центр досуга, ул. Бабура, 8",
            start_at=datetime(2026, 4, 30, 16, 0),
            end_at=datetime(2026, 4, 30, 18, 30),
        ),
    ]
    db.add_all(initial_events)
    db.commit()


def seed_group_classes(db: Session) -> None:
    has_classes = db.scalar(select(GroupClass.id).limit(1))
    if has_classes:
        return

    initial_classes = [
        GroupClass(
            title="Рисование",
            category="Творчество",
            description=(
                "Занятия по рисованию для начинающих и опытных художников. "
                "Изучаем разные техники, работаем с акварелью, маслом и акрилом."
            ),
            location="Центр творчества, ул. Бабура, 12",
            days_of_week="Пн, Ср, Пт",
            start_time="10:00",
            price_from=50000,
            organizer='Центр творчества "Искусство жизни"',
            phone="+998 71 234 56 78",
            image_url="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1000&q=80",
        ),
        GroupClass(
            title="Скандинавская ходьба",
            category="Спорт",
            description=(
                "Оздоровительные прогулки на свежем воздухе с инструктором. "
                "Подходит для любого уровня подготовки."
            ),
            location="Парк Победы",
            days_of_week="Вт, Чт",
            start_time="08:00",
            price_from=None,
            organizer="Клуб активного долголетия",
            phone="+998 71 223 11 22",
            image_url="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
        ),
        GroupClass(
            title="Английский язык",
            category="Образование",
            description=(
                "Практический английский для общения в поездках и повседневной жизни. "
                "Небольшие группы и дружелюбная атмосфера."
            ),
            location="Библиотека №5",
            days_of_week="Пн, Ср",
            start_time="14:00",
            price_from=70000,
            organizer="Языковой центр Start",
            phone="+998 71 200 30 40",
            image_url="https://images.unsplash.com/photo-1580894908361-967195033215?auto=format&fit=crop&w=1000&q=80",
        ),
    ]
    db.add_all(initial_classes)
    db.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_events(db)
        seed_group_classes(db)
    finally:
        db.close()
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
