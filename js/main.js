import { setLang, detectLanguage } from './lang.js';
import { loadTheme, initThemeToggle } from './theme.js';
import { checkAdmin, toggleLogoutButton, logout } from './auth.js';
import { selectService, submitBooking, initDatePicker, loadBookings } from './booking.js';
import { loadReviews, submitReview, initRatingSelect } from './reviews.js';
import { initGallerySlider, initLightbox } from './gallery.js';
import { initMenuBackdrop, initNavScroll, initSmoothScroll } from './ui.js';

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
    // Language
    const lang = detectLanguage();
    setLang(lang);

    // Theme
    loadTheme();
    initThemeToggle();

    // Auth
    checkAdmin();
    toggleLogoutButton();

    // Navigation
    initNavScroll();
    initMenuBackdrop();
    initSmoothScroll();
    // Booking
    initDatePicker();
    
    const bookingForm = document.getElementById("bookingForm");
    bookingForm?.addEventListener("submit", submitBooking);

    const serviceSelect = document.getElementById("serviceId");
    serviceSelect?.addEventListener("change", () => {
        const activeService = document.querySelector(`.service[onclick*="selectService(${serviceSelect.value}"]`);
        selectService(parseInt(serviceSelect.value));
    });

    // Reviews
    loadReviews();
    initRatingSelect();
    
    const reviewForm = document.getElementById("reviewForm");
    reviewForm?.addEventListener("submit", submitReview);

    // Gallery
    initGallerySlider();
    initLightbox();

    // Admin bookings listener
    document.addEventListener('loadAdminBookings', loadBookings);
});

// Global functions for HTML onclick
window.logout = logout;
window.setLang = (lang) => {
   setLang(lang);
   loadReviews(); 
};
