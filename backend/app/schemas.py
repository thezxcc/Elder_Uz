from datetime import datetime

from pydantic import BaseModel, ConfigDict


class EventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str
    location: str
    start_at: datetime
    end_at: datetime
    created_at: datetime


class GroupClassRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    category: str
    description: str
    location: str
    days_of_week: str
    start_time: str
    price_from: int | None
    organizer: str
    phone: str
    image_url: str
    created_at: datetime
