// Toast notification
export function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.className = `show ${type}`;

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

// Loader
export function showLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "flex";
}

export function hideLoader() {
    const loader = document.getElementById("loader");
    if (loader) loader.style.display = "none";
}

// Toggle mobile menu
export function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    const backdrop = document.getElementById("menuBackdrop");

    menu?.classList.toggle("active");
    backdrop?.classList.toggle("active");
}

// Close menu on backdrop click
export function initMenuBackdrop() {
    const backdrop = document.getElementById("menuBackdrop");
    
    backdrop?.addEventListener('click', () => {
        document.getElementById("mobileMenu")?.classList.remove("active");
        backdrop.classList.remove("active");
    });

    // Close menu when clicking a link
    document.querySelectorAll('#mobileMenu a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById("mobileMenu")?.classList.remove("active");
            backdrop?.classList.remove("active");
        });
    });
}

// Nav scroll effect
export function initNavScroll() {
    const nav = document.querySelector("nav:not(#mobileMenu)");
    
    if (!nav) return;

    // Show nav on load
    nav.classList.add("show");

    // Scroll effect
    window.addEventListener("scroll", () => {
        nav.classList.toggle("scrolled", window.scrollY > 50);
    }, { passive: true });
}

// Smooth scroll for anchor links
export function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Make toggleMenu global for onclick
window.toggleMenu = toggleMenu;
