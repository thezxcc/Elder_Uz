from datetime import datetime

from sqlalchemy import DateTime, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from .database import Base


class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    title_ru: Mapped[str] = mapped_column(String(255), nullable=False)
    title_uz: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    description_ru: Mapped[str] = mapped_column(Text, nullable=False)
    description_uz: Mapped[str] = mapped_column(Text, nullable=False)
    description_en: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    location_ru: Mapped[str] = mapped_column(String(255), nullable=False)
    location_uz: Mapped[str] = mapped_column(String(255), nullable=False)
    location_en: Mapped[str] = mapped_column(String(255), nullable=False)
    start_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    end_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    organizer: Mapped[str] = mapped_column(String(255), nullable=False)
    organizer_ru: Mapped[str] = mapped_column(String(255), nullable=False)
    organizer_uz: Mapped[str] = mapped_column(String(255), nullable=False)
    organizer_en: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )


class GroupClass(Base):
    __tablename__ = "group_classes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    title_ru: Mapped[str] = mapped_column(String(255), nullable=False)
    title_uz: Mapped[str] = mapped_column(String(255), nullable=False)
    title_en: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    category_ru: Mapped[str] = mapped_column(String(200), nullable=False)
    category_uz: Mapped[str] = mapped_column(String(200), nullable=False)
    category_en: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    description_ru: Mapped[str] = mapped_column(Text, nullable=False)
    description_uz: Mapped[str] = mapped_column(Text, nullable=False)
    description_en: Mapped[str] = mapped_column(Text, nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    location_ru: Mapped[str] = mapped_column(String(255), nullable=False)
    location_uz: Mapped[str] = mapped_column(String(255), nullable=False)
    location_en: Mapped[str] = mapped_column(String(255), nullable=False)
    days_of_week: Mapped[str] = mapped_column(String(120), nullable=False)
    days_of_week_ru: Mapped[str] = mapped_column(String(120), nullable=False)
    days_of_week_uz: Mapped[str] = mapped_column(String(120), nullable=False)
    days_of_week_en: Mapped[str] = mapped_column(String(120), nullable=False)
    start_time: Mapped[str] = mapped_column(String(20), nullable=False)
    price_from: Mapped[int] = mapped_column(Integer, nullable=True)
    organizer: Mapped[str] = mapped_column(String(255), nullable=False)
    organizer_ru: Mapped[str] = mapped_column(String(255), nullable=False)
    organizer_uz: Mapped[str] = mapped_column(String(255), nullable=False)
    organizer_en: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )
