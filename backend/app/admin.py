from sqladmin import ModelView

from .models import Event, GroupClass


class EventAdmin(ModelView, model=Event):
    name = "Event"
    name_plural = "Events"
    icon = "fa-solid fa-calendar-days"

    column_list = [
        Event.id,
        Event.title_ru,
        Event.title_uz,
        Event.title_en,
        Event.start_at,
        Event.end_at,
        Event.location_ru,
        Event.phone,
        Event.created_at,
    ]
    column_searchable_list = [
        Event.title_ru,
        Event.title_uz,
        Event.title_en,
        Event.location_ru,
        Event.location_uz,
        Event.location_en,
        Event.organizer_ru,
        Event.organizer_uz,
        Event.organizer_en,
        Event.phone,
    ]
    column_sortable_list = [Event.id, Event.start_at, Event.end_at, Event.created_at]

    form_columns = [
        Event.title_ru,
        Event.title_uz,
        Event.title_en,
        Event.description_ru,
        Event.description_uz,
        Event.description_en,
        Event.location_ru,
        Event.location_uz,
        Event.location_en,
        Event.start_at,
        Event.end_at,
        Event.image_url,
        Event.organizer_ru,
        Event.organizer_uz,
        Event.organizer_en,
        Event.phone,
    ]
    column_labels = {
        Event.title_ru: "Title (RU)",
        Event.title_uz: "Title (UZ)",
        Event.title_en: "Title (EN)",
        Event.description_ru: "Description (RU)",
        Event.description_uz: "Description (UZ)",
        Event.description_en: "Description (EN)",
        Event.location_ru: "Address (RU)",
        Event.location_uz: "Address (UZ)",
        Event.location_en: "Address (EN)",
        Event.organizer_ru: "Organizer (RU)",
        Event.organizer_uz: "Organizer (UZ)",
        Event.organizer_en: "Organizer (EN)",
        Event.image_url: "Image URL",
        Event.phone: "Phone",
        Event.start_at: "Start",
        Event.end_at: "End",
        Event.created_at: "Created at",
    }

    async def on_model_change(self, data, model, is_created, request):
        model.title = data.get("title_ru", model.title)
        model.description = data.get("description_ru", model.description)
        model.location = data.get("location_ru", model.location)
        model.organizer = data.get("organizer_ru", model.organizer)


class GroupClassAdmin(ModelView, model=GroupClass):
    name = "Group class"
    name_plural = "Group classes"
    icon = "fa-solid fa-people-group"

    column_list = [
        GroupClass.id,
        GroupClass.title_ru,
        GroupClass.title_uz,
        GroupClass.title_en,
        GroupClass.category_ru,
        GroupClass.start_time,
        GroupClass.location_ru,
        GroupClass.phone,
        GroupClass.created_at,
    ]
    column_searchable_list = [
        GroupClass.title_ru,
        GroupClass.title_uz,
        GroupClass.title_en,
        GroupClass.category_ru,
        GroupClass.category_uz,
        GroupClass.category_en,
        GroupClass.location_ru,
        GroupClass.location_uz,
        GroupClass.location_en,
        GroupClass.organizer_ru,
        GroupClass.organizer_uz,
        GroupClass.organizer_en,
        GroupClass.phone,
    ]
    column_sortable_list = [GroupClass.id, GroupClass.title_ru, GroupClass.start_time, GroupClass.created_at]

    form_columns = [
        GroupClass.title_ru,
        GroupClass.title_uz,
        GroupClass.title_en,
        GroupClass.category_ru,
        GroupClass.category_uz,
        GroupClass.category_en,
        GroupClass.description_ru,
        GroupClass.description_uz,
        GroupClass.description_en,
        GroupClass.location_ru,
        GroupClass.location_uz,
        GroupClass.location_en,
        GroupClass.days_of_week_ru,
        GroupClass.days_of_week_uz,
        GroupClass.days_of_week_en,
        GroupClass.start_time,
        GroupClass.price_from,
        GroupClass.image_url,
        GroupClass.organizer_ru,
        GroupClass.organizer_uz,
        GroupClass.organizer_en,
        GroupClass.phone,
    ]
    column_labels = {
        GroupClass.title_ru: "Title (RU)",
        GroupClass.title_uz: "Title (UZ)",
        GroupClass.title_en: "Title (EN)",
        GroupClass.category_ru: "Category (RU)",
        GroupClass.category_uz: "Category (UZ)",
        GroupClass.category_en: "Category (EN)",
        GroupClass.description_ru: "Description (RU)",
        GroupClass.description_uz: "Description (UZ)",
        GroupClass.description_en: "Description (EN)",
        GroupClass.location_ru: "Address (RU)",
        GroupClass.location_uz: "Address (UZ)",
        GroupClass.location_en: "Address (EN)",
        GroupClass.days_of_week_ru: "Days of week (RU)",
        GroupClass.days_of_week_uz: "Days of week (UZ)",
        GroupClass.days_of_week_en: "Days of week (EN)",
        GroupClass.start_time: "Start time",
        GroupClass.price_from: "Price from (UZS)",
        GroupClass.organizer_ru: "Organizer (RU)",
        GroupClass.organizer_uz: "Organizer (UZ)",
        GroupClass.organizer_en: "Organizer (EN)",
        GroupClass.image_url: "Image URL",
        GroupClass.phone: "Phone",
        GroupClass.created_at: "Created at",
    }

    async def on_model_change(self, data, model, is_created, request):
        model.title = data.get("title_ru", model.title)
        model.category = data.get("category_ru", model.category)
        model.description = data.get("description_ru", model.description)
        model.location = data.get("location_ru", model.location)
        model.days_of_week = data.get("days_of_week_ru", model.days_of_week)
        model.organizer = data.get("organizer_ru", model.organizer)
