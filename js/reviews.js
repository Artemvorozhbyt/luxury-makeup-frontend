import { API_URL } from './config.js';
import { showToast } from './ui.js';

let selectedRating = 5;

const reviewFallback = {
    ua: {
        title: "Відгуки скоро з'являться",
        text: "Система відгуків тимчасово оновлюється. Зв'яжіться через Instagram або WhatsApp для відгуків клієнтів."
    },

    pl: {
        title: "Opinie pojawią się wkrótce",
        text: "System opinii jest tymczasowo aktualizowany. Skontaktuj się przez Instagram lub WhatsApp, aby zobaczyć opinie klientek."
    },

    en: {
        title: "Reviews Coming Soon",
        text: "Our review system is being updated. Contact us via Instagram or WhatsApp to see client feedback."
    }
};
// Load reviews
export async function loadReviews() {
    const container = document.getElementById("reviewsContainer");
    if (!container) return;

    try {
        const res = await fetch(`${API_URL}/api/reviews`);
        const data = await res.json();

        // Handle .NET serialization
        const reviews = Array.isArray(data) ? data : data.$values || [];

        if (!reviews.length) {
            container.innerHTML = "<p>Ще немає відгуків</p>";
            updateAverageRating(0, 0);
            return;
        }

        renderReviews(container, reviews);
        
        const avg = reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
        updateAverageRating(avg, reviews.length);

    } 
    catch (err) {
    console.error(err);

    const lang =
      document.documentElement.lang ||
      localStorage.getItem("lang") ||
      "ua";

    const t = reviewFallback[lang] || reviewFallback.ua;

    container.innerHTML = `
      <div class="reviews-fallback">
         <div class="fallback-stars">★★★★★</div>
         <h3>${t.title}</h3>
         <p>${t.text}</p>
      </div>
    `;
}

}

// Render reviews
function renderReviews(container, reviews) {
    container.innerHTML = "";

    reviews.forEach(r => {
        const div = document.createElement("div");
        div.className = "review";
        div.innerHTML = `
            <div class="stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
            <p>${escapeHtml(r.text)}</p>
            <b>— ${escapeHtml(r.name)}</b>
        `;
        container.appendChild(div);
    });
}

// Update average rating display
function updateAverageRating(avg, count) {
    const avgEl = document.getElementById("avgRating");
    const countEl = document.getElementById("reviewCount");
    const starsEl = document.getElementById("avgStars");

    if (avgEl) avgEl.textContent = avg.toFixed(1);
    if (countEl) countEl.textContent = count;
    if (starsEl) starsEl.textContent = "★".repeat(Math.round(avg));
}

// Submit review
export async function submitReview(e) {
    e.preventDefault();

    const name = document.getElementById("reviewName")?.value.trim();
    const text = document.getElementById("reviewText")?.value.trim();

    if (!name || !text) {
        showToast("Заповніть всі поля", "error");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/api/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, text, rating: selectedRating })
        });

        if (res.ok) {
            showToast("💎 Відгук додано");
            e.target.reset();
            resetRatingSelect();
            loadReviews();
        } else {
            showToast("❌ Помилка", "error");
        }

    } catch (err) {
        console.error(err);
        showToast("❌ Сервер не відповідає", "error");
    }
}

// Initialize rating select
export function initRatingSelect() {
    const container = document.getElementById("ratingSelect");
    if (!container) return;

    const stars = container.querySelectorAll("span");

    stars.forEach((star, index) => {
        star.addEventListener("click", () => {
            selectedRating = index + 1;
            updateStarsDisplay(stars, selectedRating);
        });

        star.addEventListener("mouseenter", () => {
            updateStarsDisplay(stars, index + 1, true);
        });

        star.addEventListener("mouseleave", () => {
            updateStarsDisplay(stars, selectedRating);
        });
    });

    // Set initial state
    updateStarsDisplay(stars, selectedRating);
}

// Update stars display
function updateStarsDisplay(stars, rating, isHover = false) {
    stars.forEach((s, i) => {
        s.classList.toggle("active", i < rating);
        s.classList.toggle("hover", isHover && i < rating);
    });
}

// Reset rating select
function resetRatingSelect() {
    selectedRating = 5;
    const stars = document.querySelectorAll("#ratingSelect span");
    updateStarsDisplay(stars, selectedRating);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
