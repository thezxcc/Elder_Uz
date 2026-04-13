from sqladmin import ModelView

from .models import Event, GroupClass


class EventAdmin(ModelView, model=Event):
    name = "Event"
    name_plural = "Events"
    icon = "fa-solid fa-calendar-days"

    column_list = [Event.id, Event.title, Event.location, Event.start_at, Event.end_at]
    column_searchable_list = [Event.title, Event.location]
    column_sortable_list = [Event.id, Event.start_at, Event.end_at]


class GroupClassAdmin(ModelView, model=GroupClass):
    name = "Group class"
    name_plural = "Group classes"
    icon = "fa-solid fa-people-group"

    column_list = [
        GroupClass.id,
        GroupClass.title,
        GroupClass.category,
        GroupClass.days_of_week,
        GroupClass.start_time,
        GroupClass.location,
    ]
    column_searchable_list = [GroupClass.title, GroupClass.category, GroupClass.location]
    column_sortable_list = [GroupClass.id, GroupClass.title, GroupClass.category]
