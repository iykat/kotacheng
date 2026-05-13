// Dev banner — always shown (non-dismissable)
const devBanner = document.getElementById('devBanner');

function updateDevBannerHeight() {
    if (!devBanner || devBanner.hidden) return;
    const h = devBanner.offsetHeight;
    document.documentElement.style.setProperty('--dev-banner-height', h + 'px');
}

if (devBanner) {
    devBanner.hidden = false;
    document.body.classList.add('has-dev-banner');
    updateDevBannerHeight();
}

// Clear stale dismissal flag from previous version so returning users see the banner
try {
    localStorage.removeItem('kotacheng-dev-banner-dismissed');
} catch (_) { /* localStorage unavailable */ }

// Re-measure banner height on resize (font load / orientation change can shift it)
window.addEventListener('resize', updateDevBannerHeight, { passive: true });
window.addEventListener('load', updateDevBannerHeight);

// Sticky header on scroll
const stickyHeader = document.getElementById('stickyHeader');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 500) {
        stickyHeader.classList.add('visible');
    } else {
        stickyHeader.classList.remove('visible');
    }

    lastScroll = currentScroll;
});

// Exit intent popup
let exitShown = false;

// Desktop: trigger on mouse leave
document.addEventListener('mouseout', (e) => {
    if (!exitShown && e.clientY < 10 && e.relatedTarget === null) {
        showExitPopup();
    }
});

// Mobile: trigger when user scrolls up quickly (intent to leave)
let lastScrollY = window.scrollY;
let scrollUpCount = 0;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // Detect rapid scroll up at top of page (mobile exit intent)
    if (currentScrollY < lastScrollY && currentScrollY < 200) {
        scrollUpCount++;
        if (scrollUpCount > 3 && !exitShown) {
            showExitPopup();
        }
    } else {
        scrollUpCount = 0;
    }

    lastScrollY = currentScrollY;
}, { passive: true });

function showExitPopup() {
    if (!exitShown) {
        document.getElementById('exitPopup').classList.add('active');
        exitShown = true;
        // Prevent body scroll when popup is open
        document.body.style.overflow = 'hidden';
    }
}

function closeExitPopup() {
    document.getElementById('exitPopup').classList.remove('active');
    // Restore body scroll
    document.body.style.overflow = '';
}

// Close popup on escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeExitPopup();
    }
});

// Close popup on backdrop click
document.getElementById('exitPopup').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        closeExitPopup();
    }
});

// Form submission (demo)
document.getElementById('leadForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you! We\'ll be in touch within 2 business hours.');
});

document.getElementById('exitForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Check your email for the guide!');
    closeExitPopup();
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
