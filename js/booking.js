import { API_URL, TIME_SLOTS } from './config.js';
import { showToast, showLoader, hideLoader } from './ui.js';

let selectedTime = null;
let availabilityMap = {};

// Select service
export function selectService(id) {

const serviceSelect = document.getElementById("serviceId");
if (serviceSelect){
serviceSelect.value = id;
}

loadAvailableSlots();

document
.getElementById("booking")
.scrollIntoView({
behavior:"smooth"
});

serviceSelect.classList.add("selected-glow");

setTimeout(()=>{
serviceSelect.classList.remove("selected-glow");
},1200);

}

// Get selected service ID
export function getSelectedServiceId() {
    return document.getElementById("serviceId")?.value || "1";
}

// Load available time slots
export async function loadAvailableSlots() {
    const date = document.getElementById("date")?.value;
    const serviceId = getSelectedServiceId();
    const container = document.getElementById("timeSlots");

    if (!date || !serviceId || !container) return;

    try {
        const res = await fetch(
            `${API_URL}/api/booking/available?date=${date}&serviceId=${serviceId}`
        );

        if (!res.ok) {
            container.innerHTML = "<p>Помилка завантаження</p>";
            return;
        }

        const availableSlots = await res.json();
        renderSlots(container, availableSlots);

    } catch (err) {
        console.error(err);
        container.innerHTML = "<p>Помилка сервера</p>";
    }
}

// Render time slots
function renderSlots(container, availableSlots) {
    container.innerHTML = "";
    selectedTime = null;

    TIME_SLOTS.forEach(time => {
        const btn = document.createElement("div");
        btn.textContent = time;

        if (availableSlots.includes(time)) {
            btn.className = "slot";

            btn.addEventListener("click", () => {
                document.querySelectorAll(".slot")
                    .forEach(s => s.classList.remove("active"));

                btn.classList.add("active");
                selectedTime = time;
            });

        } else {
            btn.className = "slot disabled"; // 🔥 зайнятий
        }

        container.appendChild(btn);
    });
}

// Load month availability for calendar
export async function loadMonthAvailability(year, month, serviceId) {
    try {
        const res = await fetch(
            `${API_URL}/api/booking/month?year=${year}&month=${month}&serviceId=${serviceId}`
        );

        if (!res.ok) return;

        availabilityMap = await res.json();

    } catch (err) {
        console.error(err);
    }
}

// Get availability map
export function getAvailabilityMap() {
    return availabilityMap;
}

// Submit booking
// Submit booking
export async function submitBooking(e) {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const date = document.getElementById("date")?.value;
    const phone = document.getElementById("phone")?.value.trim();
    const serviceId = getSelectedServiceId();

    if (!selectedTime) {
        showToast("❌ Оберіть час", "error");
        return;
    }

    if (!name) {
        showToast("❌ Введіть ім'я", "error");
        return;
    }

    // Надійна перевірка формату email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        showToast("❌ Введіть коректний email", "error");
        return;
    }

    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    showLoader();

    try {
        const res = await fetch(`${API_URL}/api/booking`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                name,
                email,
                phone,
                date: `${date}T${selectedTime}:00`,
                serviceId: parseInt(serviceId)
            })
        });

        if (res.ok) {
            showToast("✅ Запис створено");

            const currentDate = date; // 🔥 запам’ятали дату

            document.getElementById("bookingForm")?.reset();

            document.getElementById("date").value = currentDate; // 🔥 повернули дату назад

            await loadAvailableSlots(); // 🔥 тепер точно оновиться

            selectedTime = null;
        } else if (res.status === 409) {
            showToast("❌ Цей час уже зайнятий", "error");
            await loadAvailableSlots(); // 🔥 ОЦЕ КРИТИЧНО
        } else if (res.status === 400) {
            showToast("❌ Некоректні дані", "error");
        } else {
            showToast("❌ Помилка сервера", "error");
        }
    } catch (err) {
        console.error(err);
        showToast("❌ Сервер не відповідає", "error");
    } finally {
        hideLoader();
    }
}


// Load admin bookings
export async function loadBookings() {
    const token = localStorage.getItem("token");
    const container = document.getElementById("bookingsList");

    if (!token || !container) return;

    try {
        const res = await fetch(`${API_URL}/api/booking`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
            container.innerHTML = "<p>Нема доступу</p>";
            return;
        }

        const data = await res.json();
        renderBookings(container, data);

    } catch {
        showToast("❌ Помилка сервера", "error");
    }
}

// Render admin bookings
function renderBookings(container, bookings) {
    container.innerHTML = "";

    bookings.forEach(b => {
        const div = document.createElement("div");
        div.innerHTML = `
            <b>${b.name}</b><br>
            📅 ${new Date(b.date).toLocaleString()}<br>
            💄 ${b.service?.name || "Без послуги"}<br>
            <button onclick="window.deleteBooking(${b.id})">❌ Видалити</button>
        `;
        container.appendChild(div);
    });
}

// Delete booking (admin)
export async function deleteBooking(id) {
    const token = localStorage.getItem("token");
    if (!confirm("Видалити запис?")) return;

    try {
        const res = await fetch(`${API_URL}/api/booking/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
            showToast("✅ Видалено");
            loadBookings();
            loadAvailableSlots();
        }
    } catch {
        showToast("❌ Помилка", "error");
    }
}

// Initialize flatpickr
export function initDatePicker() {
const dateInput = document.getElementById("date");
if (!dateInput || typeof flatpickr === "undefined") return;

flatpickr(dateInput,{
    minDate:"today",
    dateFormat:"Y-m-d",
    altInput:true,
    altFormat:"d M Y",
    disableMobile:true,

    onReady(selectedDates,dateStr,instance){
        loadMonthAvailability(
            instance.currentYear,
            instance.currentMonth + 1,
            getSelectedServiceId()
        );
    },

    onMonthChange(selectedDates,dateStr,instance){
        loadMonthAvailability(
            instance.currentYear,
            instance.currentMonth + 1,
            getSelectedServiceId()
        );
    },

    onDayCreate(dObj,dStr,fp,dayElem){
        const date=dayElem.dateObj.toISOString().split("T")[0];
        const slots=availabilityMap[date];

        if(slots===undefined) return;

        if(slots===0){
            dayElem.classList.add("day-full");
        } else if(slots<=3){
            dayElem.classList.add("day-few");
        } else {
            dayElem.classList.add("day-available");
        }
    },

    onChange: loadAvailableSlots
});
}

// Make deleteBooking global for onclick
window.deleteBooking = deleteBooking;
window.selectService = selectService;