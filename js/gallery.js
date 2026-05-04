import { galleryImages } from './config.js';

let sliderIndex = 0;
let visibleSlides = 3;

// Initialize gallery slider
export function initGallerySlider() {
    const track = document.querySelector('.slider-track');
    const nextBtn = document.querySelector('.slider-btn.next');
    const prevBtn = document.querySelector('.slider-btn.prev');

    if (!track) return;

    // Add images
    galleryImages.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = "Makeup work";
        img.loading = "lazy";
        track.appendChild(img);
    });

    // Update visible slides based on screen width
    function updateVisibleSlides() {
        visibleSlides = window.innerWidth <= 768 ? 1 : 3;
        updateSlider();
    }

    function updateSlider() {
        const slideWidth = 100 / visibleSlides;
        track.style.transform = `translateX(-${sliderIndex * slideWidth}%)`;
    }

    // Navigation
    nextBtn?.addEventListener('click', () => {
        const maxIndex = galleryImages.length - visibleSlides;
        sliderIndex = sliderIndex >= maxIndex ? 0 : sliderIndex + 1;
        updateSlider();
    });

    prevBtn?.addEventListener('click', () => {
        const maxIndex = galleryImages.length - visibleSlides;
        sliderIndex = sliderIndex <= 0 ? maxIndex : sliderIndex - 1;
        updateSlider();
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        const threshold = 50;

        if (diff > threshold) {
            // Swipe left - next
            nextBtn?.click();
        } else if (diff < -threshold) {
            // Swipe right - prev
            prevBtn?.click();
        }
    }

    // Handle resize
    window.addEventListener('resize', updateVisibleSlides);
    updateVisibleSlides();
}

// Initialize lightbox
export function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    if (!lightbox || !lightboxImg) return;

    // Open lightbox on image click
    document.addEventListener('click', e => {
        if (e.target.matches('.gallery img, .slider-track img')) {
            lightboxImg.src = e.target.src;
            lightbox.style.display = "flex";
            document.body.style.overflow = "hidden";
        }
    });

    // Close lightbox
    lightbox.addEventListener("click", () => {
        lightbox.style.display = "none";
        document.body.style.overflow = "";
    });

    // Close on escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            lightbox.style.display = "none";
            document.body.style.overflow = "";
        }
    });
}
