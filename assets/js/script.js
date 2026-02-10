const themeToggle = document.getElementById('light-dark');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

const applyTheme = (theme) => {
    if (theme === 'dark') {
        htmlElement.classList.add('dark-mode');
        themeToggle.checked = true;
    } else {
        htmlElement.classList.remove('dark-mode');
        themeToggle.checked = false;
    }
};

applyTheme(savedTheme);

themeToggle.addEventListener('change', () => {
    const isDark = htmlElement.classList.contains('dark-mode');
    const newTheme = isDark ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

const getNavbarHeight = () => {
    const navbar = document.querySelector('.navbar');
    return navbar ? navbar.offsetHeight : 70;
};

const NAVBAR_H = getNavbarHeight();

document.addEventListener('click', (e) => {
    const img = e.target.closest('.project-card img');
    if (img) {
        const card = img.closest('.project-card');
        const link = card ? card.querySelector('h3 a') : null;
        if (link) {
            window.location.href = link.href;
        }
    }
});

const scrollToSection = (el) => {
    const snapActive = getComputedStyle(document.documentElement).scrollSnapType !== 'none';
    if (snapActive) {
        el.scrollIntoView({ behavior: 'smooth' });
    } else {
        window.scrollTo({ top: el.offsetTop - NAVBAR_H, behavior: 'smooth' });
    }
};

const scrollArrows = document.querySelectorAll('.scroll-indicator');
scrollArrows.forEach(arrow => {
    arrow.addEventListener('click', () => {
        const targetSelector = arrow.getAttribute('data-target');
        const targetSection = document.querySelector(targetSelector);
        if (targetSection) scrollToSection(targetSection);
    });
});

const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = document.querySelector(link.getAttribute('href'));
        if (targetSection) scrollToSection(targetSection);
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const initSmartScrollSnapping = () => {
    if (window.innerWidth <= 768) return;
    
    const sections = document.querySelectorAll('.hero, .about, .project');
    if (sections.length === 0) return;
    
    let isScrolling = false;
    let lastScrollTime = 0;
    const SCROLL_COOLDOWN = 800;

    const getCurrentSectionIndex = () => {
        const scrollPos = window.scrollY + window.innerHeight / 2;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            if (sections[i].offsetTop <= scrollPos) {
                return i;
            }
        }
        return 0;
    };

    const snapToSection = (targetIndex) => {
        if (targetIndex < 0 || targetIndex >= sections.length) return;
        
        isScrolling = true;
        sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
        
        setTimeout(() => {
            isScrolling = false;
        }, SCROLL_COOLDOWN);
    };

    window.addEventListener('wheel', (e) => {
        const now = Date.now();
        
        if (isScrolling) {
            e.preventDefault();
            return;
        }
        
        if (now - lastScrollTime < SCROLL_COOLDOWN) {
            e.preventDefault();
            return;
        }
        
        e.preventDefault();
        lastScrollTime = now;
        
        const currentIndex = getCurrentSectionIndex();
        const direction = e.deltaY > 0 ? 1 : -1;
        const targetIndex = currentIndex + direction;
        
        snapToSection(targetIndex);
        
    }, { passive: false });
};

initSmartScrollSnapping();