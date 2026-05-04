// Toggle theme
export function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

// Load saved theme
export function loadTheme() {
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const toggle = document.getElementById("themeToggle");

    const shouldBeDark = theme === "dark" || (!theme && prefersDark);

    if (shouldBeDark) {
        document.body.classList.add("dark");
        if (toggle) toggle.checked = true;
    }
}

// Initialize theme toggle
export function initThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    if (toggle) {
        toggle.addEventListener("change", toggleTheme);
    }
}
