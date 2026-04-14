import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputBase,
  Stack,
  SvgIcon,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";
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
const CLASS_CATEGORIES = [
  { value: "Все", label: "Все" },
  { value: "Творчество", label: "Творчество" },
  { value: "Спорт", label: "Спорт" },
  { value: "Образование", label: "Образование" },
];

const ALL_DISTRICTS_LABEL = "Все районы";
const TASHKENT_DISTRICTS = [
  "Алмазарский район",
  "Бектемирский район",
  "Мирабадский район",
  "Мирзо-Улугбекский район",
  "Сергелийский район",
  "Учтепинский район",
  "Чиланзарский район",
  "Шайхантахурский район",
  "Яшнабадский район",
  "Яккасарайский район",
  "Юнусабадский район",
  "Янгихаятский район",
];

const DISTRICT_KEYWORDS = [
  { district: "Мирзо-Улугбекский район", keywords: ["мирзо-улугбек", "мирзо улугбек", "навои"] },
  { district: "Мирабадский район", keywords: ["мирабад", "афросиаб"] },
  { district: "Шайхантахурский район", keywords: ["шайхантахур", "чорсу"] },
  { district: "Яккасарайский район", keywords: ["яккасарай", "бабура"] },
  { district: "Юнусабадский район", keywords: ["юнусабад", "библиотека №5"] },
  { district: "Чиланзарский район", keywords: ["чиланзар", "парк победы"] },
  { district: "Яшнабадский район", keywords: ["яшнабад"] },
  { district: "Сергелийский район", keywords: ["сергели", "sergeli"] },
  { district: "Учтепинский район", keywords: ["учтепа", "учтепин"] },
  { district: "Алмазарский район", keywords: ["алмазар"] },
  { district: "Бектемирский район", keywords: ["бектемир"] },
  { district: "Янгихаятский район", keywords: ["янгихаят", "yangi hayot"] },
];

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
    answer: "Выберите мероприятие в разделе «Афиша» и нажмите «Подробнее». Если нужно, позвоните организатору по указанному телефону.",
  },
  {
    question: "Как найти групповые занятия?",
    answer: "Откройте раздел «Групповые занятия» в верхнем меню. Выберите категорию и посмотрите подходящие занятия.",
  },
  {
    question: "Как пользоваться разделом «Рядом»?",
    answer: "Перейдите в раздел «Рядом» и выберите нужный район. Приложение покажет мероприятия и занятия, которые проходят поблизости.",
  },
  {
    question: "Как использовать поиск?",
    answer: "Нажмите на значок поиска вверху экрана. Введите название, место или организатора, и подходящие результаты появятся автоматически.",
  },
  {
    question: "Все мероприятия платные?",
    answer: "Нет. В ElderUZ есть бесплатные и платные мероприятия. Стоимость указана в карточке.",
  },
  {
    question: "Как связаться с организатором?",
    answer: "В карточке мероприятия или занятия указан телефон организатора. По нему можно сразу позвонить.",
  },
];
const ABOUT_PROJECT_SECTIONS = [
  {
    title: "Кто создал проект",
    text: "ElderUZ создан нашей командой из четырёх участниц TechnoVation Girls 2026, которым важно сделать технологии более доступными и полезными для старшего поколения.",
  },
  {
    title: "Почему создан проект",
    text: "Мы создали ElderUZ, чтобы помочь пожилым людям легче находить мероприятия, занятия и полезные контакты.",
  },
  {
    title: "Как проект помогает",
    text: "Приложение объединяет афишу, групповые занятия и контакты организаторов в одном простом и понятном интерфейсе.",
  },
  {
    title: "Наши ценности",
    text: "Нам важны доброжелательность, уважение, поддержка и волонтёрство.",
  },
  {
    title: "Связь с ЦУР ООН",
    text: "Проект поддерживает ЦУР 3 — хорошее здоровье и благополучие, ЦУР 10 — снижение неравенства, ЦУР 11 — устойчивые города и сообщества, а также ЦУР 17 — партнёрство ради устойчивого развития.",
  },
];

const CONTACT_SECTION = [
  {
    title: "Телефон поддержки",
    value: "+998 71 200 30 40",
    href: "tel:+998712003040",
  },
  {
    title: "Горячая линия",
    value: "+998 71 234 56 78",
    href: "tel:+998712345678",
  },
  {
    title: "Электронная почта",
    value: "elderuz.help@gmail.com",
    href: "mailto:elderuz.help@gmail.com",
  },
];

function normalizeDisplayText(value) {
  if (typeof value !== "string") {
    return value;
  }

  let result = value.trim();
  if (!result) {
    return result;
  }

  result = result.replace(/ганкачество/gi, "Творчество");

  if (/^[®r]$/i.test(result)) {
    return "Рисование";
  }

  if (result === "Я") {
    return "Описание";
  }

  if (result === "лон") {
    return "Телефон";
  }

  return result;
}

function normalizeCategoryValue(value) {
  const normalized = normalizeDisplayText(value);
  if (normalized === "Обучение") {
    return "Образование";
  }
  return normalized;
}

function normalizeForSearch(value) {
  if (value == null) {
    return "";
  }

  return normalizeDisplayText(String(value)).toLowerCase().replace(/\s+/g, " ").trim();
}

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
function normalizeDistrict(value) {
  return normalizeForSearch(value).replace(/район/g, "").trim();
}

function resolveDistrictByText(location, title = "", organizer = "") {
  const source = normalizeForSearch([location, title, organizer].filter(Boolean).join(" "));

  for (const rule of DISTRICT_KEYWORDS) {
    if (rule.keywords.some((keyword) => source.includes(normalizeForSearch(keyword)))) {
      return rule.district;
    }
  }

  if (!source) {
    return TASHKENT_DISTRICTS[0];
  }

  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }

  return TASHKENT_DISTRICTS[hash % TASHKENT_DISTRICTS.length];
}

function buildNearbyTimeLabel(itemType, data) {
  if (itemType === "event") {
    return `${formatEventDate(data.start_at)} • ${formatEventTimeRange(data.start_at, data.end_at)}`;
  }

  return `${normalizeDisplayText(data.days_of_week).replace(/,/g, ", ")} • ${data.start_time}`;
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

function BrandPinIcon(props) {
  return (
    <SvgIcon viewBox="2 1.5 20 21.5" {...props}>
      <path
        fill="currentColor"
        d="M12 2.2a7.2 7.2 0 0 0-7.2 7.2c0 5.28 6.18 11.5 6.44 11.76a1.08 1.08 0 0 0 1.52 0c.26-.26 6.44-6.48 6.44-11.76A7.2 7.2 0 0 0 12 2.2Z"
      />
      <path
        fill="#ffffff"
        d="M12 16.2c-.16 0-.32-.06-.44-.17l-2.27-2.08a2.9 2.9 0 0 1-.95-2.08c0-1.58 1.13-2.72 2.68-2.72.47 0 .93.12 1.34.36.41-.24.87-.36 1.34-.36 1.55 0 2.68 1.14 2.68 2.72 0 .8-.35 1.57-.95 2.08l-2.27 2.08c-.12.11-.28.17-.44.17Z"
      />
    </SvgIcon>
  );
}
function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const searchInputRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [groupClasses, setGroupClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeTab, setActiveTab] = useState("events");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [detailView, setDetailView] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(ALL_DISTRICTS_LABEL);
  const [isDistrictPickerOpen, setIsDistrictPickerOpen] = useState(false);

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

  useEffect(() => {
    if (!isSearchOpen) {
      return;
    }

    const timerId = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 80);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isSearchOpen]);

  const normalizedQuery = useMemo(() => normalizeForSearch(searchQuery), [searchQuery]);
  const isSearchActive = normalizedQuery.length > 0;

  const filteredClasses = useMemo(() => {
    return groupClasses.filter((groupClass) => {
      const safeCategory = normalizeCategoryValue(groupClass.category);
      const categoryOk = activeCategory === "Все" || safeCategory === activeCategory;
      if (!categoryOk) {
        return false;
      }

      if (!isSearchActive) {
        return true;
      }

      const searchableText = [
        groupClass.title,
        groupClass.location,
        groupClass.organizer,
        groupClass.category,
        groupClass.description,
      ]
        .map(normalizeForSearch)
        .join(" ");

      return searchableText.includes(normalizedQuery);
    });
  }, [groupClasses, activeCategory, isSearchActive, normalizedQuery]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      if (!isSearchActive) {
        return true;
      }

      const contact = getEventContact(event);
      const searchableText = [event.title, event.location, event.description, contact.organizer].map(normalizeForSearch).join(" ");

      return searchableText.includes(normalizedQuery);
    });
  }, [events, isSearchActive, normalizedQuery]);
  const nearbyItems = useMemo(() => {
    const nearbyEvents = events.map((event, index) => {
      const contact = getEventContact(event);
      return {
        key: `event-${event.id}`,
        type: "event",
        typeLabel: "Мероприятие",
        district: resolveDistrictByText(event.location, event.title, contact.organizer),
        title: normalizeDisplayText(event.title),
        location: normalizeDisplayText(event.location),
        organizer: normalizeDisplayText(contact.organizer),
        timeLabel: buildNearbyTimeLabel("event", event),
        eventData: event,
        eventIndex: index,
      };
    });

    const nearbyClasses = groupClasses.map((groupClass) => ({
      key: `class-${groupClass.id}`,
      type: "class",
      typeLabel: "Занятие",
      district: resolveDistrictByText(groupClass.location, groupClass.title, groupClass.organizer),
      title: normalizeDisplayText(groupClass.title),
      location: normalizeDisplayText(groupClass.location),
      organizer: normalizeDisplayText(groupClass.organizer),
      timeLabel: buildNearbyTimeLabel("class", groupClass),
      classData: groupClass,
    }));

    return [...nearbyEvents, ...nearbyClasses];
  }, [events, groupClasses]);

  const filteredNearbyItems = useMemo(() => {
    return nearbyItems.filter((item) => {
      const districtOk = selectedDistrict === ALL_DISTRICTS_LABEL || normalizeDistrict(item.district) === normalizeDistrict(selectedDistrict);
      if (!districtOk) {
        return false;
      }

      if (!isSearchActive) {
        return true;
      }

      const searchableText = [item.title, item.location, item.organizer, item.typeLabel, item.district]
        .map(normalizeForSearch)
        .join(" ");

      return searchableText.includes(normalizedQuery);
    });
  }, [nearbyItems, selectedDistrict, isSearchActive, normalizedQuery]);

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

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const resetSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();
  };

  const openInfoSection = (section) => {
    setIsInfoMenuOpen(false);

    if (section === "faq") {
      setIsFaqOpen(true);
      return;
    }

    if (section === "about") {
      setIsAboutOpen(true);
      return;
    }

    if (section === "contacts") {
      setIsContactsOpen(true);
    }
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
            <IconButton className="header-icon-btn" onClick={closeDetails} aria-label="Назад">
              <ArrowBackRoundedIcon />
            </IconButton>
            <Typography className="details-topbar-title">{detailView.type === "event" ? "Мероприятие" : "Занятие"}</Typography>
          </Box>

          <img
            className="details-image"
            src={detailView.type === "event" ? detailView.image : detailView.data.image_url}
            alt={normalizeDisplayText(detailView.data.title)}
          />

          <Box className="details-content">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
              <Typography className="details-title">{normalizeDisplayText(detailView.data.title)}</Typography>
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
                  <Typography>{normalizeDisplayText(detailView.data.location)}</Typography>
                </Stack>
              </>
            ) : (
              <>
                <Stack direction="row" spacing={1.2} alignItems="center" className="details-row">
                  <AccessTimeOutlinedIcon fontSize="small" color="primary" />
                  <Typography>
                    {normalizeDisplayText(detailView.data.days_of_week).replace(/,/g, ", ")} • {detailView.data.start_time}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.2} alignItems="center" className="details-row">
                  <LocationOnOutlinedIcon fontSize="small" color="primary" />
                  <Typography>{normalizeDisplayText(detailView.data.location)}</Typography>
                </Stack>
              </>
            )}

            <Typography className="details-section-title">{normalizeDisplayText("Описание")}</Typography>
            <Typography className="details-description">{normalizeDisplayText(detailView.data.description)}</Typography>

            <Box className="contact-card">
              <Stack direction="row" spacing={1.2} alignItems="center" className="contact-row">
                <PersonOutlineRoundedIcon fontSize="small" color="primary" />
                <Box>
                  <Typography className="contact-label">Организатор</Typography>
                  <Typography>
                    {detailView.type === "event"
                      ? normalizeDisplayText(detailView.contact.organizer)
                      : normalizeDisplayText(detailView.data.organizer)}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.2} alignItems="center" className="contact-row">
                <PhoneInTalkOutlinedIcon fontSize="small" color="primary" />
                <Box>
                  <Typography className="contact-label">{normalizeDisplayText("Телефон")}</Typography>
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
          <Stack direction="row" alignItems="center" spacing={1.05}>
            <BrandPinIcon sx={{ fontSize: isMobile ? 46 : 44, color: "primary.main", flexShrink: 0, transform: "translateY(1px)" }} aria-hidden="true" />
            <Typography className="brand-title">ElderUZ</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.8}>
            <IconButton
              className="header-icon-btn"
              aria-label={isSearchOpen ? "Закрыть поиск" : "Открыть поиск"}
              onClick={() => {
                if (isSearchOpen) {
                  closeSearch();
                  return;
                }
                openSearch();
              }}
            >
              {isSearchOpen ? <CloseRoundedIcon /> : <SearchRoundedIcon />}
            </IconButton>
            <Button
              variant="outlined"
              className="help-entry-btn"
              startIcon={<HelpOutlineRoundedIcon />}
              onClick={() => setIsInfoMenuOpen(true)}
            >
              Помощь
            </Button>
          </Stack>
        </Box>

        <Box className={`search-wrap ${isSearchOpen ? "search-wrap-open" : "search-wrap-closed"}`} aria-hidden={!isSearchOpen}>
          <Box className="search-bar">
            <SearchRoundedIcon className="search-bar-icon" />
            <InputBase
              className="search-input"
              placeholder="Введите название, место или организатора"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              inputRef={searchInputRef}
              inputProps={{ "aria-label": "Поиск" }}
            />
            {searchQuery && (
              <Button variant="text" className="search-clear-btn" onClick={resetSearch}>
                Очистить
              </Button>
            )}
          </Box>
          <Box className="search-actions-row">
            <Typography className="search-hint">Поиск работает по названию, месту, организатору и категории</Typography>
            <Button variant="text" className="search-close-btn" onClick={closeSearch}>
              Закрыть
            </Button>
          </Box>
        </Box>

        <Divider />

        <Box className="top-tabs-row">
          <Chip
            label="Афиша"
            clickable
            color={activeTab === "events" ? "primary" : "default"}
            onClick={() => setActiveTab("events")}
            className={`top-tab-chip ${activeTab === "events" ? "chip-active" : "chip-default"}`}
          />
          <Chip
            label="Групповые занятия"
            clickable
            color={activeTab === "classes" ? "primary" : "default"}
            onClick={() => setActiveTab("classes")}
            className={`top-tab-chip ${activeTab === "classes" ? "chip-active" : "chip-default"}`}
          />
          <Chip
            label="Рядом"
            clickable
            color={activeTab === "nearby" ? "primary" : "default"}
            onClick={() => setActiveTab("nearby")}
            className={`top-tab-chip ${activeTab === "nearby" ? "chip-active" : "chip-default"}`}
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

            {isSearchActive && (
              <Box className="search-results-bar">
                <Box>
                  <Typography className="search-results-title">Результаты поиска</Typography>
                  <Typography className="search-results-count">Найдено: {filteredEvents.length}</Typography>
                </Box>
                <Button variant="text" className="search-reset-btn" onClick={resetSearch}>
                  Сбросить
                </Button>
              </Box>
            )}

            {events.length > 0 && filteredEvents.length === 0 && (
              <Alert severity="info">Ничего не найдено. Попробуйте другое слово, место или организатора.</Alert>
            )}

            {events.length > 0 && filteredEvents.length > 0 && !isSearchActive && (
              <Typography className="section-title">Ближайшие мероприятия</Typography>
            )}

            <Stack spacing={2.5}>
              {filteredEvents.map((event, index) => {
                const badge = formatEventBadge(event.start_at);
                return (
                  <Box key={event.id} className="event-card" onClick={() => openEventDetails(event, index)}>
                    <Box className="event-image-wrap">
                      <img className="event-image" src={getEventImage(event, index)} alt={normalizeDisplayText(event.title)} />
                      <Box className="event-date-badge">
                        <Typography className="event-day">{badge.day}</Typography>
                        <Typography className="event-month">{badge.month}</Typography>
                      </Box>
                    </Box>

                    <Box className="event-card-content">
                      <Typography className="event-title">{normalizeDisplayText(event.title)}</Typography>
                      <Typography className="event-location">{normalizeDisplayText(event.location)}</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.5} gap={1.2}>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <AccessTimeOutlinedIcon fontSize="small" color="action" />
                          <Typography className="event-time-text">{formatEventTimeRange(event.start_at, event.end_at)}</Typography>
                        </Stack>
                        <Button
                          variant="contained"
                          size="medium"
                          className="primary-action-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEventDetails(event, index);
                          }}
                        >
                          Подробнее
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
                  key={category.value}
                  label={category.label}
                  clickable
                  onClick={() => setActiveCategory(category.value)}
                  className={`category-chip ${activeCategory === category.value ? "chip-active" : "chip-default"}`}
                />
              ))}
            </Box>

            {isSearchActive && (
              <Box className="search-results-bar">
                <Box>
                  <Typography className="search-results-title">Результаты поиска</Typography>
                  <Typography className="search-results-count">Найдено: {filteredClasses.length}</Typography>
                </Box>
                <Button variant="text" className="search-reset-btn" onClick={resetSearch}>
                  Сбросить
                </Button>
              </Box>
            )}

            {filteredClasses.length === 0 && (
              <Alert severity="info">
                {isSearchActive
                  ? "Ничего не найдено. Попробуйте другое слово, место или категорию."
                  : "Занятий по выбранному фильтру нет."}
              </Alert>
            )}

            {filteredClasses.length > 0 && !isSearchActive && <Typography className="section-title">Доступные занятия</Typography>}

            <Stack spacing={2.2} mt={2}>
              {filteredClasses.map((groupClass) => (
                <Box key={groupClass.id} className="class-card" onClick={() => openClassDetails(groupClass)}>
                  <Box className="class-image-wrap">
                    <img className="class-image" src={groupClass.image_url} alt={normalizeDisplayText(groupClass.title)} />
                  </Box>

                  <Box className="class-card-content">
                    <Typography className="class-title">{normalizeDisplayText(groupClass.title)}</Typography>

                    <Stack direction="row" spacing={0.8} alignItems="center" mt={0.8} className="class-meta-row">
                      <AccessTimeOutlinedIcon fontSize="small" className="class-meta-icon" />
                      <Typography className="class-meta">
                        {normalizeDisplayText(groupClass.days_of_week).replace(/,/g, ", ")} • {groupClass.start_time}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={0.8} alignItems="center" mt={0.55} className="class-meta-row">
                      <LocationOnOutlinedIcon fontSize="small" className="class-meta-icon" />
                      <Typography className="class-meta">{normalizeDisplayText(groupClass.location)}</Typography>
                    </Stack>

                    {groupClass.price_from && (
                      <Typography className="class-price">от {groupClass.price_from.toLocaleString("ru-RU")} сум</Typography>
                    )}

                    <Button
                      variant="outlined"
                      size="medium"
                      className="class-more-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openClassDetails(groupClass);
                      }}
                    >
                      Подробнее
                    </Button>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {!loading && !error && activeTab === "nearby" && (
          <Box className="content-wrap">
            <Box className="nearby-map-card">
              <Box className="nearby-map-pin nearby-map-pin-main" />
              <Box className="nearby-map-pin nearby-map-pin-a" />
              <Box className="nearby-map-pin nearby-map-pin-b" />
              <Typography className="nearby-map-caption">Район в Ташкенте</Typography>
              <Typography className="nearby-map-district">{selectedDistrict}</Typography>
              <Button variant="contained" className="nearby-map-action" onClick={() => setIsDistrictPickerOpen(true)}>
                Выбрать район
              </Button>
            </Box>

            {isSearchActive && (
              <Box className="search-results-bar">
                <Box>
                  <Typography className="search-results-title">Результаты поиска</Typography>
                  <Typography className="search-results-count">Найдено: {filteredNearbyItems.length}</Typography>
                </Box>
                <Button variant="text" className="search-reset-btn" onClick={resetSearch}>
                  Сбросить
                </Button>
              </Box>
            )}

            {filteredNearbyItems.length > 0 && !isSearchActive && (
              <Typography className="section-title">Рядом с вами</Typography>
            )}

            {filteredNearbyItems.length === 0 && (
              <Alert severity="info">По выбранному району пока нет мероприятий и занятий.</Alert>
            )}

            <Stack spacing={2.1} mt={1.2}>
              {filteredNearbyItems.map((item) => (
                <Box
                  key={item.key}
                  className="nearby-item-card"
                  onClick={() => {
                    if (item.type === "event") {
                      openEventDetails(item.eventData, item.eventIndex);
                      return;
                    }
                    openClassDetails(item.classData);
                  }}
                >
                  <Box className="nearby-item-top-row">
                    <Typography className="nearby-item-type">{item.typeLabel}</Typography>
                    <Typography className="nearby-item-district">{item.district}</Typography>
                  </Box>

                  <Typography className="nearby-item-title">{item.title}</Typography>

                  <Stack direction="row" spacing={0.8} alignItems="center" className="nearby-item-meta-row">
                    <LocationOnOutlinedIcon fontSize="small" className="nearby-item-meta-icon" />
                    <Typography className="nearby-item-meta">{item.location}</Typography>
                  </Stack>

                  <Stack direction="row" spacing={0.8} alignItems="center" className="nearby-item-meta-row">
                    <AccessTimeOutlinedIcon fontSize="small" className="nearby-item-meta-icon" />
                    <Typography className="nearby-item-meta">{item.timeLabel}</Typography>
                  </Stack>

                  <Button
                    variant="outlined"
                    className="nearby-item-action"
                    onClick={(event) => {
                      event.stopPropagation();
                      if (item.type === "event") {
                        openEventDetails(item.eventData, item.eventIndex);
                        return;
                      }
                      openClassDetails(item.classData);
                    }}
                  >
                    Подробнее
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        <Dialog
          open={isDistrictPickerOpen}
          onClose={() => setIsDistrictPickerOpen(false)}
          fullWidth
          maxWidth="sm"
          sx={{
            "& .MuiDialog-container": {
              alignItems: isMobile ? "flex-end" : "center",
            },
            "& .MuiPaper-root": {
              width: "100%",
              margin: isMobile ? 0 : undefined,
              borderRadius: isMobile ? "22px 22px 0 0" : 3,
              maxHeight: isMobile ? "82vh" : "80vh",
            },
          }}
        >
          <DialogTitle sx={{ px: 2.4, py: 1.5, borderBottom: "1px solid #e4e7f0" }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ fontWeight: 800, fontSize: "1.3rem" }}>Выберите район</Typography>
              <IconButton className="header-icon-btn" aria-label="Закрыть" onClick={() => setIsDistrictPickerOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent sx={{ px: 2.2, py: 1.8 }}>
            <Stack spacing={1}>
              {[ALL_DISTRICTS_LABEL, ...TASHKENT_DISTRICTS].map((district) => (
                <Button
                  key={district}
                  className={`district-option-btn ${selectedDistrict === district ? "district-option-btn-active" : ""}`}
                  onClick={() => {
                    setSelectedDistrict(district);
                    setIsDistrictPickerOpen(false);
                  }}
                >
                  {district}
                </Button>
              ))}
            </Stack>
          </DialogContent>
        </Dialog>
        <Dialog
          open={isInfoMenuOpen}
          onClose={() => setIsInfoMenuOpen(false)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          <DialogContent sx={{ px: 2.4, py: 1.6 }}>
            <Box className="info-menu-close-row">
              <IconButton className="header-icon-btn" aria-label="Закрыть" onClick={() => setIsInfoMenuOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>

            <Stack spacing={0.4}>
              <Button className="info-menu-item" onClick={() => openInfoSection("faq")} startIcon={<HelpOutlineRoundedIcon />}>
                Как пользоваться
              </Button>
              <Button className="info-menu-item" onClick={() => openInfoSection("about")} startIcon={<InfoOutlinedIcon />}>
                О проекте
              </Button>
              <Button className="info-menu-item" onClick={() => openInfoSection("contacts")} startIcon={<PhoneInTalkOutlinedIcon />}>
                Контакты
              </Button>
            </Stack>
          </DialogContent>
        </Dialog>

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
              <Typography sx={{ fontWeight: 800, fontSize: isMobile ? "1.35rem" : "1.5rem" }}>Как пользоваться</Typography>
              <IconButton className="header-icon-btn" aria-label="Закрыть" onClick={() => setIsFaqOpen(false)}>
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
            <Typography sx={{ mb: 2, fontSize: isMobile ? "1.1rem" : "1.05rem", color: "#2f3a52", lineHeight: 1.45 }}>
              Здесь собраны простые ответы, которые помогут вам пользоваться ElderUZ.
            </Typography>

            <Stack spacing={2.2}>
              {FAQ_ITEMS.map((item) => (
                <Box key={item.question}>
                  <Typography sx={{ fontWeight: 800, fontSize: isMobile ? "1.2rem" : "1.1rem", mb: 0.5 }}>{item.question}</Typography>
                  <Typography sx={{ fontSize: isMobile ? "1.05rem" : "1rem", color: "#2f3a52", lineHeight: 1.45 }}>{item.answer}</Typography>
                </Box>
              ))}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: isMobile ? 2 : 3, py: 1.5 }}>
            <Button onClick={() => setIsFaqOpen(false)} variant="contained" fullWidth={isMobile} className="primary-action-btn">
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
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
              <Typography sx={{ fontWeight: 800, fontSize: isMobile ? "1.35rem" : "1.5rem" }}>О проекте ElderUZ</Typography>
              <IconButton className="header-icon-btn" aria-label="Закрыть" onClick={() => setIsAboutOpen(false)}>
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
            <Stack spacing={2.1}>
              {ABOUT_PROJECT_SECTIONS.map((section) => (
                <Box key={section.title}>
                  <Typography sx={{ fontWeight: 800, fontSize: isMobile ? "1.2rem" : "1.1rem", mb: 0.5 }}>
                    {section.title}
                  </Typography>
                  <Typography sx={{ fontSize: isMobile ? "1.05rem" : "1rem", color: "#2f3a52", lineHeight: 1.45 }}>
                    {section.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: isMobile ? 2 : 3, py: 1.5 }}>
            <Button onClick={() => setIsAboutOpen(false)} variant="contained" fullWidth={isMobile} className="primary-action-btn">
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isContactsOpen}
          onClose={() => setIsContactsOpen(false)}
          fullWidth
          maxWidth="xs"
          PaperProps={{
            sx: {
              borderRadius: 3,
            },
          }}
        >
          <DialogTitle
            sx={{
              px: 2.4,
              py: 1.5,
              borderBottom: "1px solid #e4e7f0",
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ fontWeight: 800, fontSize: "1.3rem" }}>Контакты</Typography>
              <IconButton className="header-icon-btn" aria-label="Закрыть" onClick={() => setIsContactsOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent sx={{ px: 2.4, py: 2.2 }}>
            <Stack spacing={2}>
              {CONTACT_SECTION.map((item) => (
                <Box key={item.title}>
                  <Typography sx={{ fontWeight: 800, color: "#2b3348", fontSize: "1.05rem", mb: 0.35 }}>{item.title}</Typography>
                  <Typography
                    component="a"
                    href={item.href}
                    sx={{
                      color: "#5b42e8",
                      fontSize: "1.18rem",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 2.4, py: 1.5 }}>
            <Button onClick={() => setIsContactsOpen(false)} variant="contained" className="primary-action-btn" fullWidth>
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default App;






















