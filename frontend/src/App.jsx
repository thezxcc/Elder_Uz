import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  DialogActions,
  Dialog,
  DialogContent,
  DialogTitle,
  InputBase,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const EVENTS_API = `${API_BASE}/api/events`;
const CLASSES_API = `${API_BASE}/api/group-classes`;

const MONTHS_RU_SHORT = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"];
const CLASS_CATEGORIES = ["Все", "Творчество", "Спорт", "Образование"];

const EVENT_IMAGES = [
  "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80",
];

const EVENT_CONTACTS = {
  "Мастер-класс по кулинарии": {
    organizer: 'Центр культуры "Навруз"',
    phone: "+998 71 234 56 78",
  },
  "Концерт «Золотые хиты»": {
    organizer: "Дом культуры Мирзо-Улугбек",
    phone: "+998 71 210 21 22",
  },
  "Вечер настольных игр": {
    organizer: "Центр досуга для старшего поколения",
    phone: "+998 71 300 44 55",
  },
};

const FAQ_ITEMS = [
  {
    question: "Как записаться на мероприятие?",
    answer:
      'Нажмите на интересующее вас мероприятие в разделе "Афиша", затем нажмите кнопку "Записаться". Вы можете позвонить по указанному номеру телефона для подтверждения.',
  },
  {
    question: "Как найти групповые занятия?",
    answer:
      "Перейдите в раздел \"Групповые занятия\" через верхнее меню. Вы можете фильтровать занятия по категориям: Творчество, Спорт, Обучение.",
  },
  {
    question: "Как использовать поиск?",
    answer:
      "Нажмите на иконку поиска в правом верхнем углу. Введите название мероприятия и результаты появятся автоматически.",
  },
  {
    question: "Все мероприятия платные?",
    answer:
      "Нет, многие мероприятия бесплатные. Информация о стоимости указана на карточке каждого мероприятия или занятия.",
  },
  {
    question: "Как связаться с организатором?",
    answer:
      "На странице каждого мероприятия или занятия указан номер телефона организатора. Вы можете позвонить напрямую, нажав на номер телефона.",
  },
];

function formatEventBadge(dateValue) {
  const date = new Date(dateValue);
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: MONTHS_RU_SHORT[date.getMonth()],
  };
}

function formatEventDate(dateValue) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

function formatEventTimeRange(startAt, endAt) {
  const timeFmt = new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${timeFmt.format(new Date(startAt))} - ${timeFmt.format(new Date(endAt))}`;
}

function getEventImage(event, index) {
  return EVENT_IMAGES[index % EVENT_IMAGES.length];
}

function getEventContact(event) {
  return (
    EVENT_CONTACTS[event.title] || {
      organizer: "Организатор мероприятия",
      phone: "+998 71 000 00 00",
    }
  );
}

function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [events, setEvents] = useState([]);
  const [groupClasses, setGroupClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("events");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [detailView, setDetailView] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [eventsResponse, classesResponse] = await Promise.all([fetch(EVENTS_API), fetch(CLASSES_API)]);

        if (!eventsResponse.ok || !classesResponse.ok) {
          throw new Error("Не удалось загрузить данные. Проверьте, что backend запущен.");
        }

        const [eventsData, classesData] = await Promise.all([eventsResponse.json(), classesResponse.json()]);

        if (isMounted) {
          setEvents(eventsData);
          setGroupClasses(classesData);
        }
      } catch (loadError) {
        if (isMounted) {
          setError(loadError.message || "Ошибка загрузки.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredClasses = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return groupClasses.filter((groupClass) => {
      const categoryOk = activeCategory === "Все" || groupClass.category === activeCategory;
      const titleOk = groupClass.title.toLowerCase().includes(normalizedQuery);
      return categoryOk && titleOk;
    });
  }, [groupClasses, activeCategory, searchQuery]);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    return events.filter((event) => event.title.toLowerCase().includes(normalizedQuery));
  }, [events, searchQuery]);

  const openEventDetails = (event, index) => {
    setDetailView({
      type: "event",
      data: event,
      image: getEventImage(event, index),
      contact: getEventContact(event),
    });
  };

  const openClassDetails = (groupClass) => {
    setDetailView({
      type: "class",
      data: groupClass,
    });
  };

  const closeDetails = () => {
    setDetailView(null);
  };

  const handleHorizontalWheel = (event) => {
    const container = event.currentTarget;
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      container.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  };

  if (detailView) {
    return (
      <Box className="outer-shell">
        <Box className="phone-shell">
          <Box className="details-topbar">
            <IconButton onClick={closeDetails} aria-label="Назад">
              <ArrowBackRoundedIcon />
            </IconButton>
            <Typography className="details-topbar-title">{detailView.type === "event" ? "Мероприятие" : "Занятие"}</Typography>
          </Box>

          <img
            className="details-image"
            src={detailView.type === "event" ? detailView.image : detailView.data.image_url}
            alt={detailView.data.title}
          />

          <Box className="details-content">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
              <Typography className="details-title">{detailView.data.title}</Typography>
              {detailView.type === "class" && detailView.data.price_from && (
                <Typography className="details-price">от {detailView.data.price_from.toLocaleString("ru-RU")} сум</Typography>
              )}
            </Stack>

            {detailView.type === "event" ? (
              <>
                <Stack direction="row" spacing={1.2} alignItems="center" className="details-row">
                  <AccessTimeOutlinedIcon fontSize="small" color="primary" />
                  <Box>
                    <Typography>{formatEventDate(detailView.data.start_at)}</Typography>
                    <Typography className="muted-text">{formatEventTimeRange(detailView.data.start_at, detailView.data.end_at)}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.2} alignItems="center" className="details-row">
                  <LocationOnOutlinedIcon fontSize="small" color="primary" />
                  <Typography>{detailView.data.location}</Typography>
                </Stack>
              </>
            ) : (
              <>
                <Stack direction="row" spacing={1.2} alignItems="center" className="details-row">
                  <AccessTimeOutlinedIcon fontSize="small" color="primary" />
                  <Typography>
                    {detailView.data.days_of_week.replace(/,/g, ", ")} | {detailView.data.start_time}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.2} alignItems="center" className="details-row">
                  <LocationOnOutlinedIcon fontSize="small" color="primary" />
                  <Typography>{detailView.data.location}</Typography>
                </Stack>
              </>
            )}

            <Typography className="details-section-title">Описание</Typography>
            <Typography className="details-description">{detailView.data.description}</Typography>

            <Box className="contact-card">
              <Stack direction="row" spacing={1.2} alignItems="center" className="contact-row">
                <PersonOutlineRoundedIcon fontSize="small" color="primary" />
                <Box>
                  <Typography className="contact-label">Организатор</Typography>
                  <Typography>
                    {detailView.type === "event" ? detailView.contact.organizer : detailView.data.organizer}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.2} alignItems="center" className="contact-row">
                <PhoneInTalkOutlinedIcon fontSize="small" color="primary" />
                <Box>
                  <Typography className="contact-label">Телефон</Typography>
                  <Typography className="phone-text">
                    {detailView.type === "event" ? detailView.contact.phone : detailView.data.phone}
                  </Typography>
                </Box>
              </Stack>
            </Box>

          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="outer-shell">
      <Box className="phone-shell">
        <Box className="home-header">
          <Stack direction="row" alignItems="center" spacing={1.3}>
            <FavoriteRoundedIcon color="primary" />
            <Typography className="brand-title">ElderUZ</Typography>
          </Stack>

          <Stack direction="row" alignItems="center">
            <IconButton
              aria-label="Поиск"
              onClick={() => {
                setIsSearchOpen((current) => {
                  const next = !current;
                  if (!next) {
                    setSearchQuery("");
                  }
                  return next;
                });
              }}
            >
              {isSearchOpen ? <CloseRoundedIcon /> : <SearchRoundedIcon />}
            </IconButton>
            <IconButton aria-label="Информация" onClick={() => setIsFaqOpen(true)}>
              <InfoOutlinedIcon />
            </IconButton>
          </Stack>
        </Box>

        {isSearchOpen && (
          <Box className="search-wrap">
            <InputBase
              className="search-input"
              placeholder={activeTab === "events" ? "Поиск мероприятий по названию" : "Поиск занятий по названию"}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              inputProps={{ "aria-label": "Поиск по названию" }}
              autoFocus
            />
          </Box>
        )}

        <Divider />

        <Box className="top-tabs-row">
          <Chip
            label="Афиша"
            clickable
            color={activeTab === "events" ? "primary" : "default"}
            onClick={() => setActiveTab("events")}
            className={activeTab === "events" ? "chip-active" : "chip-default"}
          />
          <Chip
            label="Групповые занятия"
            clickable
            color={activeTab === "classes" ? "primary" : "default"}
            onClick={() => setActiveTab("classes")}
            className={activeTab === "classes" ? "chip-active" : "chip-default"}
          />
        </Box>

        <Divider />

        {loading && (
          <Box className="loading-wrap">
            <CircularProgress color="primary" />
          </Box>
        )}

        {error && (
          <Box className="content-wrap">
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {!loading && !error && activeTab === "events" && (
          <Box className="content-wrap">
            {events.length === 0 && <Alert severity="info">Событий пока нет.</Alert>}
            {events.length > 0 && filteredEvents.length === 0 && (
              <Alert severity="info">По вашему запросу ничего не найдено.</Alert>
            )}

            <Stack spacing={2.5}>
              {filteredEvents.map((event, index) => {
                const badge = formatEventBadge(event.start_at);
                return (
                  <Box key={event.id} className="event-card" onClick={() => openEventDetails(event, index)}>
                    <Box className="event-image-wrap">
                      <img className="event-image" src={getEventImage(event, index)} alt={event.title} />
                      <Box className="event-date-badge">
                        <Typography className="event-day">{badge.day}</Typography>
                        <Typography className="event-month">{badge.month}</Typography>
                      </Box>
                    </Box>

                    <Box className="event-card-content">
                      <Typography className="event-title">{event.title}</Typography>
                      <Typography className="event-location">{event.location}</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.2}>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <AccessTimeOutlinedIcon fontSize="small" color="action" />
                          <Typography className="event-time-text">{formatEventTimeRange(event.start_at, event.end_at)}</Typography>
                        </Stack>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEventDetails(event, index);
                          }}
                        >
                          подробнее
                        </Button>
                      </Stack>
                    </Box>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        )}

        {!loading && !error && activeTab === "classes" && (
          <Box className="content-wrap">
            <Box className="chips-scroll category-scroll" onWheel={handleHorizontalWheel}>
              {CLASS_CATEGORIES.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  clickable
                  onClick={() => setActiveCategory(category)}
                  className={`category-chip ${activeCategory === category ? "chip-active" : "chip-default"}`}
                />
              ))}
            </Box>

            {filteredClasses.length === 0 && (
              <Alert severity="info">
                {searchQuery ? "По вашему запросу ничего не найдено." : "Занятий по выбранному фильтру нет."}
              </Alert>
            )}

            <Stack spacing={2} mt={2}>
              {filteredClasses.map((groupClass) => (
                <Box key={groupClass.id} className="class-card" onClick={() => openClassDetails(groupClass)}>
                  <Box className="class-image-wrap">
                    <img className="class-image" src={groupClass.image_url} alt={groupClass.title} />
                  </Box>

                  <Box className="class-card-content">
                    <Typography className="class-title">{groupClass.title}</Typography>

                    <Stack direction="row" spacing={0.8} alignItems="center" mt={0.6} className="class-meta-row">
                      <AccessTimeOutlinedIcon fontSize="small" className="class-meta-icon" />
                      <Typography className="class-meta">
                        {groupClass.days_of_week.replace(/,/g, ", ")} | {groupClass.start_time}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={0.8} alignItems="center" mt={0.4} className="class-meta-row">
                      <LocationOnOutlinedIcon fontSize="small" className="class-meta-icon" />
                      <Typography className="class-meta">{groupClass.location}</Typography>
                    </Stack>

                    {groupClass.price_from && (
                      <Typography className="class-price">от {groupClass.price_from.toLocaleString("ru-RU")} сум</Typography>
                    )}

                    <Button
                      variant="outlined"
                      size="small"
                      className="class-more-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openClassDetails(groupClass);
                      }}
                    >
                      подробнее
                    </Button>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <Dialog
          open={isFaqOpen}
          onClose={() => setIsFaqOpen(false)}
          fullWidth
          maxWidth="sm"
          fullScreen={isMobile}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? 0 : 3,
            },
          }}
        >
          <DialogTitle
            sx={{
              px: isMobile ? 2 : 3,
              py: 1.5,
              borderBottom: "1px solid #e4e7f0",
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ fontWeight: 800, fontSize: isMobile ? "1.35rem" : "1.5rem" }}>
                Часто задаваемые вопросы
              </Typography>
              <IconButton aria-label="Закрыть" onClick={() => setIsFaqOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent
            dividers
            sx={{
              px: isMobile ? 2 : 3,
              py: isMobile ? 2 : 2.5,
            }}
          >
            <Typography sx={{ mb: 2, fontSize: isMobile ? "1.1rem" : "1.05rem", color: "#2f3a52" }}>
              Здесь вы найдёте ответы на основные вопросы по использованию сайта.
            </Typography>

            <Stack spacing={2}>
              {FAQ_ITEMS.map((item) => (
                <Box key={item.question}>
                  <Typography sx={{ fontWeight: 800, fontSize: isMobile ? "1.2rem" : "1.1rem", mb: 0.5 }}>
                    {item.question}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? "1.05rem" : "1rem", color: "#2f3a52", lineHeight: 1.45 }}>
                    {item.answer}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: isMobile ? 2 : 3, py: 1.5 }}>
            <Button onClick={() => setIsFaqOpen(false)} variant="contained" fullWidth={isMobile}>
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default App;

