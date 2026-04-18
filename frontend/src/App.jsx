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
  FormControl,
  IconButton,
  InputBase,
  MenuItem,
  Select,
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
const LANGUAGE_STORAGE_KEY = "elderuz_language";

const LANGUAGE_OPTIONS = [
  { value: "ru", short: "RU", label: "Русский" },
  { value: "uz", short: "UZ", label: "O‘zbekcha" },
  { value: "en", short: "EN", label: "English" },
];

const LANGUAGE_LOCALES = {
  ru: "ru-RU",
  uz: "uz-UZ",
  en: "en-US",
};

const MONTHS_SHORT = {
  ru: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
  uz: ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
};

const CLASS_CATEGORY_KEYS = ["all", "creativity", "sport", "education"];

const CATEGORY_LABELS = {
  ru: {
    all: "Все",
    creativity: "Творчество",
    sport: "Спорт",
    education: "Образование",
  },
  uz: {
    all: "Barchasi",
    creativity: "Ijod",
    sport: "Sport",
    education: "Ta'lim",
  },
  en: {
    all: "All",
    creativity: "Creativity",
    sport: "Sports",
    education: "Education",
  },
};

const CATEGORY_ALIASES = {
  creativity: ["творчество", "ganqachestvo", "ганкачество", "ijod", "creativity"],
  sport: ["спорт", "sport", "sports", "движение", "harakat", "movement"],
  education: ["образование", "обучение", "education", "learning", "ta'lim", "talim"],
};

const DISTRICTS = [
  "all",
  "almazar",
  "bektemir",
  "mirabad",
  "mirzo_ulugbek",
  "sergeli",
  "uchtepa",
  "chilanzar",
  "shaykhantakhur",
  "yashnabad",
  "yakkasaray",
  "yunusabad",
  "yangihayot",
];

const DISTRICT_LABELS = {
  ru: {
    all: "Все районы",
    almazar: "Алмазарский район",
    bektemir: "Бектемирский район",
    mirabad: "Мирабадский район",
    mirzo_ulugbek: "Мирзо-Улугбекский район",
    sergeli: "Сергелийский район",
    uchtepa: "Учтепинский район",
    chilanzar: "Чиланзарский район",
    shaykhantakhur: "Шайхантахурский район",
    yashnabad: "Яшнабадский район",
    yakkasaray: "Яккасарайский район",
    yunusabad: "Юнусабадский район",
    yangihayot: "Янгихаятский район",
  },
  uz: {
    all: "Barcha tumanlar",
    almazar: "Olmazor tumani",
    bektemir: "Bektemir tumani",
    mirabad: "Mirobod tumani",
    mirzo_ulugbek: "Mirzo-Ulug‘bek tumani",
    sergeli: "Sergeli tumani",
    uchtepa: "Uchtepa tumani",
    chilanzar: "Chilonzor tumani",
    shaykhantakhur: "Shayxontohur tumani",
    yashnabad: "Yashnobod tumani",
    yakkasaray: "Yakkasaroy tumani",
    yunusabad: "Yunusobod tumani",
    yangihayot: "Yangihayot tumani",
  },
  en: {
    all: "All districts",
    almazar: "Almazar District",
    bektemir: "Bektemir District",
    mirabad: "Mirabad District",
    mirzo_ulugbek: "Mirzo-Ulugbek District",
    sergeli: "Sergeli District",
    uchtepa: "Uchtepa District",
    chilanzar: "Chilanzar District",
    shaykhantakhur: "Shaykhantakhur District",
    yashnabad: "Yashnabad District",
    yakkasaray: "Yakkasaray District",
    yunusabad: "Yunusabad District",
    yangihayot: "Yangihayot District",
  },
};

const DISTRICT_KEYWORDS = [
  { district: "mirzo_ulugbek", keywords: ["мирзо-улугбек", "mirzo-ulugbek", "mirzo ulugbek", "навои", "navoi"] },
  { district: "mirabad", keywords: ["мирабад", "mirobod", "mirabad", "афросиаб", "afrosiyob"] },
  { district: "shaykhantakhur", keywords: ["шайхантахур", "shayxontohur", "чорсу", "chorsu"] },
  { district: "yakkasaray", keywords: ["яккасарай", "yakkasaroy", "бабура", "bobur"] },
  { district: "yunusabad", keywords: ["юнусабад", "yunusobod", "библиотека №5", "library no. 5"] },
  { district: "chilanzar", keywords: ["чиланзар", "chilonzor", "парк победы", "g'alaba bog'i", "victory park"] },
  { district: "yashnabad", keywords: ["яшнабад", "yashnobod"] },
  { district: "sergeli", keywords: ["сергели", "sergeli"] },
  { district: "uchtepa", keywords: ["учтепа", "учтепин", "uchtepa"] },
  { district: "almazar", keywords: ["алмазар", "olmazor"] },
  { district: "bektemir", keywords: ["бектемир", "bektemir"] },
  { district: "yangihayot", keywords: ["янгихаят", "yangihayot", "yangi hayot"] },
];

const EVENT_IMAGES = [
  "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&w=1200&q=80",
];

const UI_TEXT = {
  ru: {
    loadFailed: "Не удалось загрузить данные. Проверьте, что backend запущен.",
    detailEventTitle: "Мероприятие",
    detailClassTitle: "Занятие",
    back: "Назад",
    searchOpen: "Открыть поиск",
    searchClose: "Закрыть поиск",
    searchAria: "Поиск",
    searchPlaceholder: "Введите название, место или организатора",
    searchClear: "Очистить",
    searchHint: "Поиск работает по названию, месту, организатору и категории",
    close: "Закрыть",
    help: "Помощь",
    tabEvents: "Афиша",
    tabClasses: "Групповые занятия",
    tabNearby: "Рядом",
    noEvents: "Событий пока нет.",
    searchResults: "Результаты поиска",
    found: "Найдено",
    reset: "Сбросить",
    noSearchEvents: "Ничего не найдено. Попробуйте другое слово, место или организатора.",
    upcomingEvents: "Ближайшие мероприятия",
    details: "Подробнее",
    classesAvailable: "Доступные занятия",
    noSearchClasses: "Ничего не найдено. Попробуйте другое слово, место или категорию.",
    noClassesByFilter: "Занятий по выбранному фильтру нет.",
    nearbyCaption: "Район в Ташкенте",
    chooseDistrict: "Выбрать район",
    nearbyWithYou: "Рядом с вами",
    noNearby: "По выбранному району пока нет мероприятий и занятий.",
    nearbyTypeEvent: "Мероприятие",
    nearbyTypeClass: "Занятие",
    districtPickerTitle: "Выберите район",
    howToUse: "Как пользоваться",
    aboutProject: "О проекте",
    contacts: "Контакты",
    faqIntro: "Здесь собраны простые ответы, которые помогут вам пользоваться ElderUZ.",
    aboutTitle: "О проекте ElderUZ",
    description: "Описание",
    organizer: "Организатор",
    phone: "Телефон",
  },
  uz: {
    loadFailed: "Ma'lumotlarni yuklab bo'lmadi. Backend ishga tushganini tekshiring.",
    detailEventTitle: "Tadbir",
    detailClassTitle: "Mashg'ulot",
    back: "Ortga",
    searchOpen: "Qidiruvni ochish",
    searchClose: "Qidiruvni yopish",
    searchAria: "Qidiruv",
    searchPlaceholder: "Nom, joy yoki tashkilotchini kiriting",
    searchClear: "Tozalash",
    searchHint: "Qidiruv nom, joy, tashkilotchi va toifa bo'yicha ishlaydi",
    close: "Yopish",
    help: "Yordam",
    tabEvents: "Afisha",
    tabClasses: "Guruh mashg'ulotlari",
    tabNearby: "Yaqin",
    noEvents: "Hozircha tadbirlar yo'q.",
    searchResults: "Qidiruv natijalari",
    found: "Topildi",
    reset: "Qayta tiklash",
    noSearchEvents: "Hech narsa topilmadi. Boshqa so'z, joy yoki tashkilotchini sinab ko'ring.",
    upcomingEvents: "Yaqin tadbirlar",
    details: "Batafsil",
    classesAvailable: "Mavjud mashg'ulotlar",
    noSearchClasses: "Hech narsa topilmadi. Boshqa so'z, joy yoki toifani sinab ko'ring.",
    noClassesByFilter: "Tanlangan filtr bo'yicha mashg'ulotlar yo'q.",
    nearbyCaption: "Toshkent tumani",
    chooseDistrict: "Tumanni tanlash",
    nearbyWithYou: "Sizga yaqin",
    noNearby: "Tanlangan tumanda hozircha tadbir yoki mashg'ulot yo'q.",
    nearbyTypeEvent: "Tadbir",
    nearbyTypeClass: "Mashg'ulot",
    districtPickerTitle: "Tumanni tanlang",
    howToUse: "Qanday foydalanish",
    aboutProject: "Loyiha haqida",
    contacts: "Kontaktlar",
    faqIntro: "Bu yerda ElderUZ'dan foydalanishga yordam beradigan sodda javoblar jamlangan.",
    aboutTitle: "ElderUZ loyihasi haqida",
    description: "Tavsif",
    organizer: "Tashkilotchi",
    phone: "Telefon",
  },
  en: {
    loadFailed: "Failed to load data. Please check that the backend is running.",
    detailEventTitle: "Event",
    detailClassTitle: "Class",
    back: "Back",
    searchOpen: "Open search",
    searchClose: "Close search",
    searchAria: "Search",
    searchPlaceholder: "Enter title, place, or organizer",
    searchClear: "Clear",
    searchHint: "Search works by title, place, organizer, and category",
    close: "Close",
    help: "Help",
    tabEvents: "Events",
    tabClasses: "Group Classes",
    tabNearby: "Nearby",
    noEvents: "No events yet.",
    searchResults: "Search results",
    found: "Found",
    reset: "Reset",
    noSearchEvents: "Nothing found. Try another word, place, or organizer.",
    upcomingEvents: "Upcoming events",
    details: "More details",
    classesAvailable: "Available classes",
    noSearchClasses: "Nothing found. Try another word, place, or category.",
    noClassesByFilter: "No classes for the selected filter.",
    nearbyCaption: "District in Tashkent",
    chooseDistrict: "Choose district",
    nearbyWithYou: "Near you",
    noNearby: "No events or classes in this district yet.",
    nearbyTypeEvent: "Event",
    nearbyTypeClass: "Class",
    districtPickerTitle: "Choose district",
    howToUse: "How to use",
    aboutProject: "About project",
    contacts: "Contacts",
    faqIntro: "Here are simple answers to help you use ElderUZ.",
    aboutTitle: "About ElderUZ",
    description: "Description",
    organizer: "Organizer",
    phone: "Phone",
  },
};
const FAQ_ITEMS = {
  ru: [
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
  ],
  uz: [
    {
      question: "Tadbirga qanday yozilaman?",
      answer: "«Afisha» bo'limida tadbirni tanlang va «Batafsil» tugmasini bosing. Kerak bo'lsa, ko'rsatilgan raqam orqali tashkilotchiga qo'ng'iroq qiling.",
    },
    {
      question: "Guruh mashg'ulotlarini qanday topaman?",
      answer: "Yuqori menyuda «Guruh mashg'ulotlari» bo'limini oching. Toifani tanlab, mos mashg'ulotlarni ko'ring.",
    },
    {
      question: "«Yaqin» bo'limidan qanday foydalanaman?",
      answer: "«Yaqin» bo'limiga o'ting va kerakli tumanni tanlang. Ilova yaqin atrofdagi tadbir va mashg'ulotlarni ko'rsatadi.",
    },
    {
      question: "Qidiruvdan qanday foydalanaman?",
      answer: "Ekran yuqorisidagi qidiruv belgisi ustiga bosing. Nom, joy yoki tashkilotchini kiritsangiz, mos natijalar avtomatik chiqadi.",
    },
    {
      question: "Barcha tadbirlar pullikmi?",
      answer: "Yo'q. ElderUZ'da bepul ham, pullik ham tadbirlar bor. Narx kartochkada ko'rsatilgan.",
    },
    {
      question: "Tashkilotchi bilan qanday bog'lanaman?",
      answer: "Har bir tadbir yoki mashg'ulot kartochkasida tashkilotchi telefoni bor. Shu raqam orqali darhol qo'ng'iroq qilishingiz mumkin.",
    },
  ],
  en: [
    {
      question: "How do I sign up for an event?",
      answer: "Choose an event in the “Events” section and tap “More details.” If needed, call the organizer at the listed phone number.",
    },
    {
      question: "How do I find group classes?",
      answer: "Open the “Group Classes” section in the top menu. Select a category and view suitable classes.",
    },
    {
      question: "How do I use the “Nearby” section?",
      answer: "Go to “Nearby” and choose a district. The app will show events and classes close to that area.",
    },
    {
      question: "How do I use search?",
      answer: "Tap the search icon at the top. Enter a title, place, or organizer and matching results will appear automatically.",
    },
    {
      question: "Are all events paid?",
      answer: "No. ElderUZ includes both free and paid events. Price information is shown on each card.",
    },
    {
      question: "How do I contact an organizer?",
      answer: "Each event or class card includes the organizer’s phone number. You can call directly.",
    },
  ],
};

const ABOUT_PROJECT_SECTIONS = {
  ru: [
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
  ],
  uz: [
    {
      title: "Loyihani kim yaratdi",
      text: "ElderUZ loyihasini TechnoVation Girls 2026 tanlovining to'rt nafar ishtirokchisidan iborat jamoamiz yaratdi. Biz katta avlod uchun texnologiyalarni tushunarli va foydali qilishni istaymiz.",
    },
    {
      title: "Nega loyiha yaratildi",
      text: "ElderUZ keksalar tadbirlar, mashg'ulotlar va foydali aloqalarni oson topishi uchun yaratildi.",
    },
    {
      title: "Loyiha qanday yordam beradi",
      text: "Ilova afisha, guruh mashg'ulotlari va tashkilotchilar kontaktlarini bitta sodda interfeysda birlashtiradi.",
    },
    {
      title: "Qadriyatlarimiz",
      text: "Biz uchun mehribonlik, hurmat, qo'llab-quvvatlash va volontyorlik muhim.",
    },
    {
      title: "BMT BRM bilan bog'liqlik",
      text: "Loyiha BRM 3 (sog'liq va farovonlik), BRM 10 (tengsizlikni kamaytirish), BRM 11 (barqaror shaharlar) va BRM 17 (hamkorlik) maqsadlarini qo'llab-quvvatlaydi.",
    },
  ],
  en: [
    {
      title: "Who built the project",
      text: "ElderUZ was created by our team of four TechnoVation Girls 2026 participants who want to make technology more accessible and useful for older adults.",
    },
    {
      title: "Why the project was created",
      text: "We created ElderUZ to help seniors find events, classes, and useful contacts more easily.",
    },
    {
      title: "How the project helps",
      text: "The app combines event listings, group classes, and organizer contacts in one simple and clear interface.",
    },
    {
      title: "Our values",
      text: "We believe in kindness, respect, support, and volunteering.",
    },
    {
      title: "UN SDG alignment",
      text: "The project supports SDG 3 (Good Health and Well-Being), SDG 10 (Reduced Inequalities), SDG 11 (Sustainable Cities and Communities), and SDG 17 (Partnerships for the Goals).",
    },
  ],
};

const CONTACT_SECTION = {
  ru: [
    { title: "Телефон поддержки", value: "+998 XX XXX XX XX", href: "tel:+998712003040" },
    { title: "Горячая линия", value: "+998 XX XXX XX XX", href: "tel:+998712345678" },
    { title: "Электронная почта", value: "help@elder.uz", href: "mailto:help@elder.uz" },
  ],
  uz: [
    { title: "Yordam telefoni", value: "+998 XX XXX XX XX", href: "tel:+998712003040" },
    { title: "Ishonch telefoni", value: "+998 XX XXX XX XX", href: "tel:+998712345678" },
    { title: "Elektron pochta", value: "help@elder.uz", href: "mailto:help@elder.uz" },
  ],
  en: [
    { title: "Support phone", value: "+998 XX XXX XX XX", href: "tel:+998712003040" },
    { title: "Hotline", value: "+998 XX XXX XX XX", href: "tel:+998712345678" },
    { title: "Email", value: "help@elder.uz", href: "mailto:help@elder.uz" },
  ],
};

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

function normalizeForSearch(value) {
  if (value == null) {
    return "";
  }

  return normalizeDisplayText(String(value)).toLowerCase().replace(/\s+/g, " ").trim();
}

function splitCsv(value) {
  if (!value || typeof value !== "string") {
    return [];
  }
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getLocalizedField(item, baseField, language) {
  const orderedLanguages = [language, "ru", "uz", "en"];
  const checked = new Set();

  for (const lang of orderedLanguages) {
    const fieldName = `${baseField}_${lang}`;
    if (checked.has(fieldName)) {
      continue;
    }
    checked.add(fieldName);
    const value = item?.[fieldName];
    if (typeof value === "string" && value.trim()) {
      return normalizeDisplayText(value);
    }
  }

  const fallback = item?.[baseField];
  if (typeof fallback === "string") {
    return normalizeDisplayText(fallback);
  }

  return fallback;
}

function getAllLocalizedVariants(item, baseField) {
  const values = [item?.[baseField], item?.[`${baseField}_ru`], item?.[`${baseField}_uz`], item?.[`${baseField}_en`]];
  return values
    .filter((value) => typeof value === "string" && value.trim())
    .map((value) => normalizeDisplayText(value));
}

function detectCategoryKey(rawCategory) {
  const token = normalizeForSearch(rawCategory).replace(/[’'`]/g, "");
  if (!token) {
    return null;
  }

  for (const [key, aliases] of Object.entries(CATEGORY_ALIASES)) {
    if (aliases.some((alias) => normalizeForSearch(alias).replace(/[’'`]/g, "") === token)) {
      return key;
    }
  }

  return null;
}

function getClassCategoryKeys(groupClass) {
  const keys = [];
  const rawVariants = [
    ...getAllLocalizedVariants(groupClass, "category"),
    ...(typeof groupClass?.category === "string" ? splitCsv(groupClass.category) : []),
  ];

  for (const rawValue of rawVariants) {
    for (const token of splitCsv(rawValue)) {
      const key = detectCategoryKey(token);
      if (key && !keys.includes(key)) {
        keys.push(key);
      }
    }
  }

  return keys;
}

function formatEventBadge(dateValue, language) {
  const date = new Date(dateValue);
  const languageMonths = MONTHS_SHORT[language] || MONTHS_SHORT.ru;
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: languageMonths[date.getMonth()],
  };
}

function formatEventDate(dateValue, language) {
  const locale = LANGUAGE_LOCALES[language] || LANGUAGE_LOCALES.ru;
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateValue));
}

function formatEventTimeRange(startAt, endAt, language) {
  const locale = LANGUAGE_LOCALES[language] || LANGUAGE_LOCALES.ru;
  const timeFmt = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${timeFmt.format(new Date(startAt))} - ${timeFmt.format(new Date(endAt))}`;
}

function formatPrice(priceFrom, language) {
  if (!priceFrom) {
    return "";
  }

  const locale = LANGUAGE_LOCALES[language] || LANGUAGE_LOCALES.ru;
  const amount = Number(priceFrom).toLocaleString(locale);

  if (language === "en") {
    return `from ${amount} UZS`;
  }
  if (language === "uz") {
    return `${amount} so'mdan`;
  }
  return `от ${amount} сум`;
}

function districtLabel(districtKey, language) {
  return DISTRICT_LABELS[language]?.[districtKey] || DISTRICT_LABELS.ru[districtKey] || DISTRICT_LABELS.ru.all;
}

function resolveDistrictByText(location, title = "", organizer = "") {
  const source = normalizeForSearch([location, title, organizer].filter(Boolean).join(" "));

  for (const rule of DISTRICT_KEYWORDS) {
    if (rule.keywords.some((keyword) => source.includes(normalizeForSearch(keyword)))) {
      return rule.district;
    }
  }

  if (!source) {
    return "mirzo_ulugbek";
  }

  let hash = 0;
  for (let i = 0; i < source.length; i += 1) {
    hash = (hash * 31 + source.charCodeAt(i)) >>> 0;
  }

  return DISTRICTS[1 + (hash % (DISTRICTS.length - 1))];
}

function buildNearbyTimeLabel(itemType, data, language) {
  if (itemType === "event") {
    return `${formatEventDate(data.start_at, language)} • ${formatEventTimeRange(data.start_at, data.end_at, language)}`;
  }

  return `${getLocalizedField(data, "days_of_week", language).replace(/,/g, ", ")} • ${data.start_time}`;
}

function getEventImage(event, index) {
  if (typeof event?.image_url === "string" && event.image_url.trim()) {
    return event.image_url;
  }
  return EVENT_IMAGES[index % EVENT_IMAGES.length];
}

function getEventContactInfo(event, language) {
  return {
    organizer: getLocalizedField(event, "organizer", language) || "",
    phone: normalizeDisplayText(event?.phone || "+998 XX XXX XX XX"),
  };
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

  const [language, setLanguage] = useState(() => {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === "ru" || stored === "uz" || stored === "en") {
      return stored;
    }
    return "ru";
  });

  const [activeTab, setActiveTab] = useState("events");
  const [activeCategory, setActiveCategory] = useState("all");
  const [detailView, setDetailView] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInfoMenuOpen, setIsInfoMenuOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isContactsOpen, setIsContactsOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [isDistrictPickerOpen, setIsDistrictPickerOpen] = useState(false);

  const text = UI_TEXT[language] || UI_TEXT.ru;
  const faqItems = FAQ_ITEMS[language] || FAQ_ITEMS.ru;
  const aboutSections = ABOUT_PROJECT_SECTIONS[language] || ABOUT_PROJECT_SECTIONS.ru;
  const contacts = CONTACT_SECTION[language] || CONTACT_SECTION.ru;

  useEffect(() => {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  }, [language]);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [eventsResponse, classesResponse] = await Promise.all([fetch(EVENTS_API), fetch(CLASSES_API)]);

        if (!eventsResponse.ok || !classesResponse.ok) {
          throw new Error("load_failed");
        }

        const [eventsData, classesData] = await Promise.all([eventsResponse.json(), classesResponse.json()]);

        if (isMounted) {
          setEvents(eventsData);
          setGroupClasses(classesData);
        }
      } catch {
        if (isMounted) {
          setError("load_failed");
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

  const classCategories = useMemo(
    () =>
      CLASS_CATEGORY_KEYS.map((key) => ({
        key,
        label: CATEGORY_LABELS[language]?.[key] || CATEGORY_LABELS.ru[key],
      })),
    [language],
  );

  const normalizedQuery = useMemo(() => normalizeForSearch(searchQuery), [searchQuery]);
  const isSearchActive = normalizedQuery.length > 0;

  const filteredClasses = useMemo(() => {
    return groupClasses.filter((groupClass) => {
      const categoryKeys = getClassCategoryKeys(groupClass);
      const categoryOk = activeCategory === "all" || categoryKeys.includes(activeCategory);
      if (!categoryOk) {
        return false;
      }

      if (!isSearchActive) {
        return true;
      }

      const searchableText = [
        ...getAllLocalizedVariants(groupClass, "title"),
        ...getAllLocalizedVariants(groupClass, "location"),
        ...getAllLocalizedVariants(groupClass, "organizer"),
        ...getAllLocalizedVariants(groupClass, "category"),
        ...getAllLocalizedVariants(groupClass, "description"),
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

      const searchableText = [
        ...getAllLocalizedVariants(event, "title"),
        ...getAllLocalizedVariants(event, "location"),
        ...getAllLocalizedVariants(event, "description"),
        ...getAllLocalizedVariants(event, "organizer"),
        event.phone,
      ]
        .map(normalizeForSearch)
        .join(" ");

      return searchableText.includes(normalizedQuery);
    });
  }, [events, isSearchActive, normalizedQuery]);

  const nearbyItems = useMemo(() => {
    const nearbyEvents = events.map((event, index) => {
      const districtSource = [
        ...getAllLocalizedVariants(event, "location"),
        ...getAllLocalizedVariants(event, "title"),
        ...getAllLocalizedVariants(event, "organizer"),
      ].join(" ");

      return {
        key: `event-${event.id}`,
        type: "event",
        districtKey: resolveDistrictByText(districtSource),
        title: getLocalizedField(event, "title", language),
        location: getLocalizedField(event, "location", language),
        organizer: getLocalizedField(event, "organizer", language),
        timeLabel: buildNearbyTimeLabel("event", event, language),
        eventData: event,
        eventIndex: index,
      };
    });

    const nearbyClasses = groupClasses.map((groupClass) => {
      const districtSource = [
        ...getAllLocalizedVariants(groupClass, "location"),
        ...getAllLocalizedVariants(groupClass, "title"),
        ...getAllLocalizedVariants(groupClass, "organizer"),
      ].join(" ");

      return {
        key: `class-${groupClass.id}`,
        type: "class",
        districtKey: resolveDistrictByText(districtSource),
        title: getLocalizedField(groupClass, "title", language),
        location: getLocalizedField(groupClass, "location", language),
        organizer: getLocalizedField(groupClass, "organizer", language),
        timeLabel: buildNearbyTimeLabel("class", groupClass, language),
        classData: groupClass,
      };
    });

    return [...nearbyEvents, ...nearbyClasses];
  }, [events, groupClasses, language]);

  const filteredNearbyItems = useMemo(() => {
    return nearbyItems.filter((item) => {
      const districtOk = selectedDistrict === "all" || item.districtKey === selectedDistrict;
      if (!districtOk) {
        return false;
      }

      if (!isSearchActive) {
        return true;
      }

      const searchableText = [
        item.title,
        item.location,
        item.organizer,
        item.type === "event" ? text.nearbyTypeEvent : text.nearbyTypeClass,
        districtLabel(item.districtKey, language),
      ]
        .map(normalizeForSearch)
        .join(" ");

      return searchableText.includes(normalizedQuery);
    });
  }, [nearbyItems, selectedDistrict, isSearchActive, normalizedQuery, text, language]);

  const openEventDetails = (event, index) => {
    setDetailView({
      type: "event",
      data: event,
      image: getEventImage(event, index),
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
    const eventContact = detailView.type === "event" ? getEventContactInfo(detailView.data, language) : null;

    return (
      <Box className="outer-shell">
        <Box className="phone-shell">
          <Box className="details-topbar">
            <IconButton className="header-icon-btn" onClick={closeDetails} aria-label={text.back}>
              <ArrowBackRoundedIcon />
            </IconButton>
            <Typography className="details-topbar-title">{detailView.type === "event" ? text.detailEventTitle : text.detailClassTitle}</Typography>
          </Box>

          <img
            className="details-image"
            src={detailView.type === "event" ? detailView.image : detailView.data.image_url}
            alt={getLocalizedField(detailView.data, "title", language)}
          />

          <Box className="details-content">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
              <Typography className="details-title">{getLocalizedField(detailView.data, "title", language)}</Typography>
              {detailView.type === "class" && detailView.data.price_from && (
                <Typography className="details-price">{formatPrice(detailView.data.price_from, language)}</Typography>
              )}
            </Stack>

            {detailView.type === "event" ? (
              <>
                <Stack direction="row" spacing={1.2} alignItems="center" className="details-row">
                  <AccessTimeOutlinedIcon fontSize="small" color="primary" />
                  <Box>
                    <Typography>{formatEventDate(detailView.data.start_at, language)}</Typography>
                    <Typography className="muted-text">{formatEventTimeRange(detailView.data.start_at, detailView.data.end_at, language)}</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1.2} alignItems="center" className="details-row">
                  <LocationOnOutlinedIcon fontSize="small" color="primary" />
                  <Typography>{getLocalizedField(detailView.data, "location", language)}</Typography>
                </Stack>
              </>
            ) : (
              <>
                <Stack direction="row" spacing={1.2} alignItems="center" className="details-row">
                  <AccessTimeOutlinedIcon fontSize="small" color="primary" />
                  <Typography>
                    {getLocalizedField(detailView.data, "days_of_week", language).replace(/,/g, ", ")} • {detailView.data.start_time}
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1.2} alignItems="center" className="details-row">
                  <LocationOnOutlinedIcon fontSize="small" color="primary" />
                  <Typography>{getLocalizedField(detailView.data, "location", language)}</Typography>
                </Stack>
              </>
            )}

            <Typography className="details-section-title">{text.description}</Typography>
            <Typography className="details-description">{getLocalizedField(detailView.data, "description", language)}</Typography>

            <Box className="contact-card">
              <Stack direction="row" spacing={1.2} alignItems="center" className="contact-row">
                <PersonOutlineRoundedIcon fontSize="small" color="primary" />
                <Box>
                  <Typography className="contact-label">{text.organizer}</Typography>
                  <Typography>{detailView.type === "event" ? eventContact?.organizer : getLocalizedField(detailView.data, "organizer", language)}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.2} alignItems="center" className="contact-row">
                <PhoneInTalkOutlinedIcon fontSize="small" color="primary" />
                <Box>
                  <Typography className="contact-label">{text.phone}</Typography>
                  <Typography className="phone-text">{detailView.type === "event" ? eventContact?.phone : detailView.data.phone}</Typography>
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

          <Stack direction="row" alignItems="center" spacing={0.65} className="header-actions-right">
            <IconButton
              className="header-icon-btn header-action-btn"
              aria-label={isSearchOpen ? text.searchClose : text.searchOpen}
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

            <FormControl size="small" className="language-select-wrap">
              <Select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="language-select"
                inputProps={{ "aria-label": "Language" }}
                renderValue={(value) => LANGUAGE_OPTIONS.find((option) => option.value === value)?.short || "RU"}
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="outlined"
              className="help-entry-btn"
              startIcon={<HelpOutlineRoundedIcon />}
              onClick={() => setIsInfoMenuOpen(true)}
            >
              {text.help}
            </Button>
          </Stack>
        </Box>

        <Box className={`search-wrap ${isSearchOpen ? "search-wrap-open" : "search-wrap-closed"}`} aria-hidden={!isSearchOpen}>
          <Box className="search-bar">
            <SearchRoundedIcon className="search-bar-icon" />
            <InputBase
              className="search-input"
              placeholder={text.searchPlaceholder}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              inputRef={searchInputRef}
              inputProps={{ "aria-label": text.searchAria }}
            />
            {searchQuery && (
              <Button variant="text" className="search-clear-btn" onClick={resetSearch}>
                {text.searchClear}
              </Button>
            )}
          </Box>
          <Box className="search-actions-row">
            <Typography className="search-hint">{text.searchHint}</Typography>
            <Button variant="text" className="search-close-btn" onClick={closeSearch}>
              {text.close}
            </Button>
          </Box>
        </Box>

        <Divider />

        <Box className="top-tabs-row">
          <Chip
            label={text.tabEvents}
            clickable
            color={activeTab === "events" ? "primary" : "default"}
            onClick={() => setActiveTab("events")}
            className={`top-tab-chip ${activeTab === "events" ? "chip-active" : "chip-default"}`}
          />
          <Chip
            label={text.tabClasses}
            clickable
            color={activeTab === "classes" ? "primary" : "default"}
            onClick={() => setActiveTab("classes")}
            className={`top-tab-chip ${activeTab === "classes" ? "chip-active" : "chip-default"}`}
          />
          <Chip
            label={text.tabNearby}
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
            <Alert severity="error">{text.loadFailed}</Alert>
          </Box>
        )}

        {!loading && !error && activeTab === "events" && (
          <Box className="content-wrap">
            {events.length === 0 && <Alert severity="info">{text.noEvents}</Alert>}

            {isSearchActive && (
              <Box className="search-results-bar">
                <Box>
                  <Typography className="search-results-title">{text.searchResults}</Typography>
                  <Typography className="search-results-count">
                    {text.found}: {filteredEvents.length}
                  </Typography>
                </Box>
                <Button variant="text" className="search-reset-btn" onClick={resetSearch}>
                  {text.reset}
                </Button>
              </Box>
            )}

            {events.length > 0 && filteredEvents.length === 0 && <Alert severity="info">{text.noSearchEvents}</Alert>}

            {events.length > 0 && filteredEvents.length > 0 && !isSearchActive && (
              <Typography className="section-title">{text.upcomingEvents}</Typography>
            )}

            <Stack spacing={2.5}>
              {filteredEvents.map((event, index) => {
                const badge = formatEventBadge(event.start_at, language);
                return (
                  <Box key={event.id} className="event-card" onClick={() => openEventDetails(event, index)}>
                    <Box className="event-image-wrap">
                      <img className="event-image" src={getEventImage(event, index)} alt={getLocalizedField(event, "title", language)} />
                      <Box className="event-date-badge">
                        <Typography className="event-day">{badge.day}</Typography>
                        <Typography className="event-month">{badge.month}</Typography>
                      </Box>
                    </Box>

                    <Box className="event-card-content">
                      <Typography className="event-title">{getLocalizedField(event, "title", language)}</Typography>
                      <Typography className="event-location">{getLocalizedField(event, "location", language)}</Typography>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.5} gap={1.2}>
                        <Stack direction="row" spacing={0.8} alignItems="center">
                          <AccessTimeOutlinedIcon fontSize="small" color="action" />
                          <Typography className="event-time-text">{formatEventTimeRange(event.start_at, event.end_at, language)}</Typography>
                        </Stack>
                        <Button
                          variant="contained"
                          size="medium"
                          className="primary-action-btn"
                          onClick={(eventClick) => {
                            eventClick.stopPropagation();
                            openEventDetails(event, index);
                          }}
                        >
                          {text.details}
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
              {classCategories.map((category) => (
                <Chip
                  key={category.key}
                  label={category.label}
                  clickable
                  onClick={() => setActiveCategory(category.key)}
                  className={`category-chip ${activeCategory === category.key ? "chip-active" : "chip-default"}`}
                />
              ))}
            </Box>

            {isSearchActive && (
              <Box className="search-results-bar">
                <Box>
                  <Typography className="search-results-title">{text.searchResults}</Typography>
                  <Typography className="search-results-count">
                    {text.found}: {filteredClasses.length}
                  </Typography>
                </Box>
                <Button variant="text" className="search-reset-btn" onClick={resetSearch}>
                  {text.reset}
                </Button>
              </Box>
            )}

            {filteredClasses.length === 0 && (
              <Alert severity="info">{isSearchActive ? text.noSearchClasses : text.noClassesByFilter}</Alert>
            )}

            {filteredClasses.length > 0 && !isSearchActive && <Typography className="section-title">{text.classesAvailable}</Typography>}

            <Stack spacing={2.2} mt={2}>
              {filteredClasses.map((groupClass) => (
                <Box key={groupClass.id} className="class-card" onClick={() => openClassDetails(groupClass)}>
                  <Box className="class-image-wrap">
                    <img className="class-image" src={groupClass.image_url} alt={getLocalizedField(groupClass, "title", language)} />
                  </Box>

                  <Box className="class-card-content">
                    <Typography className="class-title">{getLocalizedField(groupClass, "title", language)}</Typography>

                    <Stack direction="row" spacing={0.8} alignItems="center" mt={0.8} className="class-meta-row">
                      <AccessTimeOutlinedIcon fontSize="small" className="class-meta-icon" />
                      <Typography className="class-meta">
                        {getLocalizedField(groupClass, "days_of_week", language).replace(/,/g, ", ")} • {groupClass.start_time}
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={0.8} alignItems="center" mt={0.55} className="class-meta-row">
                      <LocationOnOutlinedIcon fontSize="small" className="class-meta-icon" />
                      <Typography className="class-meta">{getLocalizedField(groupClass, "location", language)}</Typography>
                    </Stack>

                    {groupClass.price_from && <Typography className="class-price">{formatPrice(groupClass.price_from, language)}</Typography>}

                    <Button
                      variant="outlined"
                      size="medium"
                      className="class-more-button"
                      onClick={(eventClick) => {
                        eventClick.stopPropagation();
                        openClassDetails(groupClass);
                      }}
                    >
                      {text.details}
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
              <Typography className="nearby-map-caption">{text.nearbyCaption}</Typography>
              <Typography className="nearby-map-district">{districtLabel(selectedDistrict, language)}</Typography>
              <Button variant="contained" className="nearby-map-action" onClick={() => setIsDistrictPickerOpen(true)}>
                {text.chooseDistrict}
              </Button>
            </Box>

            {isSearchActive && (
              <Box className="search-results-bar">
                <Box>
                  <Typography className="search-results-title">{text.searchResults}</Typography>
                  <Typography className="search-results-count">
                    {text.found}: {filteredNearbyItems.length}
                  </Typography>
                </Box>
                <Button variant="text" className="search-reset-btn" onClick={resetSearch}>
                  {text.reset}
                </Button>
              </Box>
            )}

            {filteredNearbyItems.length > 0 && !isSearchActive && <Typography className="section-title">{text.nearbyWithYou}</Typography>}

            {filteredNearbyItems.length === 0 && <Alert severity="info">{text.noNearby}</Alert>}

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
                    <Typography className="nearby-item-type">{item.type === "event" ? text.nearbyTypeEvent : text.nearbyTypeClass}</Typography>
                    <Typography className="nearby-item-district">{districtLabel(item.districtKey, language)}</Typography>
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
                    onClick={(eventClick) => {
                      eventClick.stopPropagation();
                      if (item.type === "event") {
                        openEventDetails(item.eventData, item.eventIndex);
                        return;
                      }
                      openClassDetails(item.classData);
                    }}
                  >
                    {text.details}
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
              <Typography sx={{ fontWeight: 800, fontSize: "1.3rem" }}>{text.districtPickerTitle}</Typography>
              <IconButton className="header-icon-btn" aria-label={text.close} onClick={() => setIsDistrictPickerOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent sx={{ px: 2.2, py: 1.8 }}>
            <Stack spacing={1}>
              {DISTRICTS.map((districtKey) => (
                <Button
                  key={districtKey}
                  className={`district-option-btn ${selectedDistrict === districtKey ? "district-option-btn-active" : ""}`}
                  onClick={() => {
                    setSelectedDistrict(districtKey);
                    setIsDistrictPickerOpen(false);
                  }}
                >
                  {districtLabel(districtKey, language)}
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
              <IconButton className="header-icon-btn" aria-label={text.close} onClick={() => setIsInfoMenuOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </Box>

            <Stack spacing={0.4}>
              <Button className="info-menu-item" onClick={() => openInfoSection("faq")} startIcon={<HelpOutlineRoundedIcon />}>
                {text.howToUse}
              </Button>
              <Button className="info-menu-item" onClick={() => openInfoSection("about")} startIcon={<InfoOutlinedIcon />}>
                {text.aboutProject}
              </Button>
              <Button className="info-menu-item" onClick={() => openInfoSection("contacts")} startIcon={<PhoneInTalkOutlinedIcon />}>
                {text.contacts}
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
              <Typography sx={{ fontWeight: 800, fontSize: isMobile ? "1.35rem" : "1.5rem" }}>{text.howToUse}</Typography>
              <IconButton className="header-icon-btn" aria-label={text.close} onClick={() => setIsFaqOpen(false)}>
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
            <Typography sx={{ mb: 2, fontSize: isMobile ? "1.1rem" : "1.05rem", color: "#2f3a52", lineHeight: 1.45 }}>{text.faqIntro}</Typography>

            <Stack spacing={2.2}>
              {faqItems.map((item) => (
                <Box key={item.question}>
                  <Typography sx={{ fontWeight: 800, fontSize: isMobile ? "1.2rem" : "1.1rem", mb: 0.5 }}>{item.question}</Typography>
                  <Typography sx={{ fontSize: isMobile ? "1.05rem" : "1rem", color: "#2f3a52", lineHeight: 1.45 }}>{item.answer}</Typography>
                </Box>
              ))}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: isMobile ? 2 : 3, py: 1.5 }}>
            <Button onClick={() => setIsFaqOpen(false)} variant="contained" fullWidth={isMobile} className="primary-action-btn">
              {text.close}
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
              <Typography sx={{ fontWeight: 800, fontSize: isMobile ? "1.35rem" : "1.5rem" }}>{text.aboutTitle}</Typography>
              <IconButton className="header-icon-btn" aria-label={text.close} onClick={() => setIsAboutOpen(false)}>
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
              {aboutSections.map((section) => (
                <Box key={section.title}>
                  <Typography sx={{ fontWeight: 800, fontSize: isMobile ? "1.2rem" : "1.1rem", mb: 0.5 }}>{section.title}</Typography>
                  <Typography sx={{ fontSize: isMobile ? "1.05rem" : "1rem", color: "#2f3a52", lineHeight: 1.45 }}>{section.text}</Typography>
                </Box>
              ))}
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: isMobile ? 2 : 3, py: 1.5 }}>
            <Button onClick={() => setIsAboutOpen(false)} variant="contained" fullWidth={isMobile} className="primary-action-btn">
              {text.close}
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
              <Typography sx={{ fontWeight: 800, fontSize: "1.3rem" }}>{text.contacts}</Typography>
              <IconButton className="header-icon-btn" aria-label={text.close} onClick={() => setIsContactsOpen(false)}>
                <CloseRoundedIcon />
              </IconButton>
            </Stack>
          </DialogTitle>

          <DialogContent sx={{ px: 2.4, py: 2.2 }}>
            <Stack spacing={2}>
              {contacts.map((item) => (
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
              {text.close}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

export default App;

