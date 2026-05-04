// Translations
const translations = {
    ua: {
        services: "Послуги",
        booking: "Резервація",
        contact: "Контакти",
        book: "Забронювати",
        name: "Ім'я",
        date: "Оберіть дату",
        min: "хв",
        gallery: "Мої роботи",
        about: "Про мене",
        about1: "Я — візажист і косметолог. Для мене макіяж — це більше, ніж техніка. Це мистецтво підкреслювати природну красу та дарувати впевненість у собі.",
        about2: "Від легких щоденних образів до вечірніх і весільних — кожна деталь має значення.",
        about3: "Кожен макіяж — це деталь, яка змінює відчуття себе.",
        about4: "Макіяж — це більше, ніж техніка",
        reviewsTitle: "Відгуки клієнтів",
        basedOn: "на основі ",
        reviews: "відгуків",
        reviewsError: "Помилка завантаження",
        fullName: "Ім'я та прізвище",
        yourReview: "Ваш відгук...",
        leaveReview: "Залишити відгук",
        bookBtn: "ЗАБРОНЮВАТИ →",
        language: "Мова",
        theme: "Тема",
        phone: "Номер телефону",
        contactTitle: "Контакти"
    },
    pl: {
        services: "Usługi",
        booking: "Rezerwacja",
        contact: "Kontakt",
        book: "Zarezerwuj",
        name: "Imię",
        date: "Wybierz datę",
        min: "min",
        gallery: "Moje prace",
        about: "O mnie",
        about1: "Jestem wizażystką i kosmetologiem. Dla mnie makijaż to coś więcej niż technika. To sztuka podkreślania naturalnego piękna i dodawania pewności siebie.",
        about2: "Od codziennych stylizacji po stylizacje wieczorowe i ślubne, każdy szczegół ma znaczenie.",
        about3: "Każdy makijaż to szczegół, który zmienia to, jak postrzegasz samą siebie.",
        about4: "Makijaż to coś więcej niż technika",
        reviewsTitle: "Opinie klientów",
        basedOn: "na podstawie ",
        reviews: "opinii",
        reviewsError: "Błąd ładowania",
        fullName: "Imię i nazwisko",
        yourReview: "Twoja opinia...",
        leaveReview: "Dodaj opinię",
        bookBtn: "ZAREZERWUJ →",
        language: "Język",
        theme: "Motyw",
        phone: "Numer telefonu",
        contactTitle: "Kontakt"
    },
    en: {
        services: "Services",
        booking: "Booking",
        contact: "Contact",
        book: "Book now",
        name: "Name",
        date: "Select date",
        min: "min",
        gallery: "My works",
        about: "About me",
        about1: "I am a makeup artist and cosmetologist. For me, makeup is more than a technique. It is the art of emphasizing natural beauty and giving self-confidence.",
        about2: "From easy everyday looks to evening and wedding looks, every detail matters.",
        about3: "Every makeup is a detail that changes the way you feel about yourself.",
        about4: "Makeup is more than technique",
        reviewsTitle: "Client reviews",
        basedOn: "based on ",
        reviews: "reviews",
        reviewsError: "Loading error",
        fullName: "Full name",
        yourReview: "Your review...",
        leaveReview: "Leave a review",
        bookBtn: "BOOK NOW →",
        language: "Language",
        theme: "Theme",
        phone: "Phone number",
        contactTitle: "Contact"
    }
};

// Set language
export function setLang(lang) {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;

    // Update text content
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang]?.[key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Update placeholders
    document.querySelectorAll("[data-placeholder]").forEach(el => {
        const key = el.getAttribute("data-placeholder");
        if (translations[lang]?.[key]) {
            el.placeholder = translations[lang][key];
        }
    });

    // Update durations
    document.querySelectorAll("[data-duration]").forEach(el => {
        const value = el.getAttribute("data-duration");
        el.textContent = `${value} ${translations[lang].min}`;
    });

    // Update flatpickr placeholder
    const dateInput = document.querySelector("#date");
    if (dateInput?._flatpickr?.altInput) {
        dateInput._flatpickr.altInput.placeholder = translations[lang].date;
    }

    // Update active button
    document.querySelectorAll(".lang-switch button").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });
}

// Detect browser language
export function detectLanguage() {
    const saved = localStorage.getItem("lang");
    if (saved) return saved;

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.includes("uk")) return "ua";
    if (browserLang.includes("pl")) return "pl";
    return "en";
}

// Get translation
export function t(key, lang = null) {
    const currentLang = lang || localStorage.getItem("lang") || "en";
    return translations[currentLang]?.[key] || key;
}
