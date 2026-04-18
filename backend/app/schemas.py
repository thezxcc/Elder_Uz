from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    title_ru: str
    title_uz: str
    title_en: str
    description: str
    description_ru: str
    description_uz: str
    description_en: str
    location: str
    location_ru: str
    location_uz: str
    location_en: str
    start_at: datetime
    end_at: datetime
    image_url: str
    organizer: str
    organizer_ru: str
    organizer_uz: str
    organizer_en: str
    phone: str
    created_at: datetime


class GroupClassRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    title_ru: str
    title_uz: str
    title_en: str
    category: str
    category_ru: str
    category_uz: str
    category_en: str
    description: str
    description_ru: str
    description_uz: str
    description_en: str
    location: str
    location_ru: str
    location_uz: str
    location_en: str
    days_of_week: str
    days_of_week_ru: str
    days_of_week_uz: str
    days_of_week_en: str
    start_time: str
    price_from: int | None
    organizer: str
    organizer_ru: str
    organizer_uz: str
    organizer_en: str
    phone: str
    image_url: str
    created_at: datetime
