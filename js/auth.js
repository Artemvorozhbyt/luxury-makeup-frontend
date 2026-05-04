import { API_URL } from './config.js';

// Get user role from JWT token
export function getUserRole() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payloadBase64 = token.split(".")[1];
        const decoded = JSON.parse(atob(payloadBase64));
        return decoded["[schemas.microsoft.com](http://schemas.microsoft.com/ws/2008/06/identity/claims/role)"];
    } catch (e) {
        console.error("Invalid token", e);
        return null;
    }
}

// Check if user is admin
export function isAdmin() {
    return getUserRole() === "Admin";
}

// Check if user is logged in
export function isLoggedIn() {
    return !!localStorage.getItem("token");
}

// Logout
export function logout() {
    localStorage.removeItem("token");
    window.location.reload();
}

// Toggle logout button visibility
export function toggleLogoutButton() {
    const btn = document.getElementById("logoutBtn");
    if (!btn) return;
    btn.style.display = isLoggedIn() ? "block" : "none";
}

// Check admin panel visibility
export function checkAdmin() {
    const adminPanel = document.getElementById("adminPanel");
    if (!adminPanel) return;

    if (isAdmin()) {
        adminPanel.style.display = "block";
        // Trigger bookings load if needed
        const event = new CustomEvent('loadAdminBookings');
        document.dispatchEvent(event);
    } else {
        adminPanel.style.display = "none";
    }
}

// Login function (for login page)
export async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            return { success: true };
        } else {
            return { success: false, error: "Invalid credentials" };
        }
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, error: "Server error" };
    }
}
