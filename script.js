// Preloader
const preloader = document.getElementById('preloader');
window.addEventListener('load', () => {
    setTimeout(() => {
        if (preloader) preloader.classList.add('hidden');
    }, 800);
});

// Gerenciamento de Imagens do Portfólio
const portfolioImages = [
    { src: 'imagens/project_data.png', title: 'Data Analytics', desc: 'Dashboards estratégicos e análise de dados complexos.' },
    { src: 'imagens/project_marketing.png', title: 'Marketing Digital', desc: 'Estratégias de tráfego e conversão de alta performance.' },
    { src: 'imagens/project_web.png', title: 'Soluções Web', desc: 'Desenvolvimento de plataformas que impulsionam marcas.' }
];

// Carousel Logic
const track = document.getElementById('carousel-track');
const nextBtn = document.querySelector('.next-btn');
const prevBtn = document.querySelector('.prev-btn');
const dotsContainer = document.getElementById('carousel-dots');
const progressFill = document.getElementById('carousel-progress-fill');

const slides = track ? Array.from(track.querySelectorAll('.carousel-slide')) : [];
const SLIDE_WIDTH = 364;
const AUTOPLAY_MS = 1000;
let currentIndex = 0;
let autoplayTimer = null;

// Build dots
slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    if (dotsContainer) dotsContainer.appendChild(dot);
});

function getDots() {
    return dotsContainer ? Array.from(dotsContainer.querySelectorAll('.carousel-dot')) : [];
}

function updateCarousel() {
    if (!track) return;
    track.style.transform = `translateX(-${currentIndex * SLIDE_WIDTH}px)`;

    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentIndex));
    getDots().forEach((dot, i) => dot.classList.toggle('is-active', i === currentIndex));

    // Restart progress bar
    if (progressFill) {
        progressFill.classList.remove('is-animating');
        void progressFill.offsetWidth;
        progressFill.classList.add('is-animating');
    }
}

function goTo(i) {
    currentIndex = ((i % slides.length) + slides.length) % slides.length;
    updateCarousel();
}

function startAutoplay() {
    autoplayTimer = setInterval(() => goTo(currentIndex + 1), AUTOPLAY_MS);
}

function stopAutoplay() {
    clearInterval(autoplayTimer);
}

function resetAutoplay() {
    stopAutoplay();
    startAutoplay();
}

if (nextBtn) nextBtn.addEventListener('click', () => { goTo(currentIndex + 1); resetAutoplay(); });
if (prevBtn) prevBtn.addEventListener('click', () => { goTo(currentIndex - 1); resetAutoplay(); });

// Pause auto-play on hover
if (track) {
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
}

// Init
if (slides.length) {
    updateCarousel();
    startAutoplay();
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const themeToggle = document.getElementById('theme-toggle');

function updateThemeIcon() {
    if (!themeToggle) return;
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀' : '☾';
}

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
    updateThemeIcon();
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcon();
    });
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// Close menu on link click and smooth scroll
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // If it's an anchor link, handle it manually to avoid security issues on file://
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }

        if (navLinks) navLinks.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
    });
});

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');

document.querySelectorAll('.carousel-slide[data-lightbox]').forEach(slide => {
    slide.addEventListener('click', () => {
        lightboxImg.src = slide.dataset.lightbox;
        lightboxImg.alt = slide.dataset.caption || '';
        lightboxCaption.textContent = slide.dataset.caption || '';
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    });
});

function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
}

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        closeModal();
        closeSobre();
        closePortfolio();
    }
});

// Modal Sobre
const modalSobre = document.getElementById('modal-sobre');
const btnSobre = document.getElementById('btn-sobre');
const sobreClose = document.getElementById('sobre-close');

function openSobre() {
    modalSobre.classList.add('is-open');
    document.body.style.overflow = 'hidden';

    // Animate cards with staggered delay
    setTimeout(() => {
        document.querySelectorAll('.sobre-card--animate').forEach(el => {
            const delay = parseInt(el.dataset.delay || 0);
            setTimeout(() => el.classList.add('is-visible'), delay);
        });

        // Animate skill bars
        document.querySelectorAll('.skill-fill').forEach(bar => {
            const w = bar.dataset.width;
            setTimeout(() => { bar.style.width = w + '%'; }, 400);
        });
    }, 200);
}

function closeSobre() {
    modalSobre.classList.remove('is-open');
    document.body.style.overflow = '';
    document.querySelectorAll('.sobre-card--animate').forEach(el => el.classList.remove('is-visible'));
    document.querySelectorAll('.skill-fill').forEach(bar => { bar.style.width = '0%'; });
}

if (btnSobre) btnSobre.addEventListener('click', e => { e.preventDefault(); openSobre(); });
if (sobreClose) sobreClose.addEventListener('click', closeSobre);
if (modalSobre) modalSobre.addEventListener('click', e => { if (e.target === modalSobre) closeSobre(); });

// Modal Portfólio
const modalPortfolio = document.getElementById('modal-portfolio');
const btnPortfolio = document.getElementById('btn-portfolio');
const pfClose = document.getElementById('pf-close');
const pfContent = document.getElementById('pf-content');

function openPortfolio() {
    if (!modalPortfolio) return;
    modalPortfolio.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    if (pfContent) pfContent.scrollTop = 0;

    setTimeout(() => {
        document.querySelectorAll('#modal-portfolio .pf-skill-fill').forEach(bar => {
            const w = bar.dataset.w;
            if (w) bar.style.width = w + '%';
        });
        updatePfNav();
    }, 300);
}

function closePortfolio() {
    if (!modalPortfolio) return;
    modalPortfolio.classList.remove('is-open');
    document.body.style.overflow = '';
    document.querySelectorAll('#modal-portfolio .pf-skill-fill').forEach(bar => {
        bar.style.width = '0%';
    });
}

function updatePfNav() {
    if (!pfContent) return;
    const sections = pfContent.querySelectorAll('[id^="pf-"]');
    const links = document.querySelectorAll('.pf-nav-link');
    let active = sections[0];
    sections.forEach(sec => {
        if (pfContent.scrollTop + 60 >= sec.offsetTop) active = sec;
    });
    links.forEach(l => {
        l.classList.toggle('is-active', l.getAttribute('href') === '#' + (active ? active.id : ''));
    });
}

if (pfContent) pfContent.addEventListener('scroll', updatePfNav);

if (btnPortfolio) btnPortfolio.addEventListener('click', e => { e.preventDefault(); openPortfolio(); });

if (pfClose) pfClose.addEventListener('click', closePortfolio);
if (modalPortfolio) modalPortfolio.addEventListener('click', e => { if (e.target === modalPortfolio) closePortfolio(); });

document.querySelectorAll('.pf-nav-link').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        if (target && pfContent) {
            pfContent.scrollTo({ top: target.offsetTop - 20, behavior: 'smooth' });
        }
    });
});



// Simple Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});
