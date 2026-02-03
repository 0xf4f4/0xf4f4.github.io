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

const NAVBAR_H = document.querySelector('.navbar').offsetHeight;

document.querySelectorAll('.project-card').forEach(card => {
    const link = card.querySelector('h3 a');
    const img = card.querySelector('img');
    
    if (link && img) {
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => {
            window.location.href = link.href;
        });
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
    let isScrolling = false;

    const getCurrentSection = () => {
        const scrollPos = window.scrollY + window.innerHeight / 2;
        let currentSection = sections[0];
        
        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                currentSection = section;
            }
        });
        
        return currentSection;
    };

    const snapToSection = (direction) => {
        if (isScrolling) return;
        
        const current = getCurrentSection();
        const currentIndex = Array.from(sections).indexOf(current);
        const targetIndex = direction === 'down' ? Math.min(currentIndex + 1, sections.length - 1) : Math.max(currentIndex - 1, 0);

        if (targetIndex !== currentIndex) {
            isScrolling = true;
            scrollToSection(sections[targetIndex]);
            
            setTimeout(() => {
                isScrolling = false;
            }, 800);
        }
    };

    window.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (isScrolling) return;
        
        if (e.deltaY > 0) {
            snapToSection('down');
        } else if (e.deltaY < 0) {
            snapToSection('up');
        }
    }, { passive: false });
};

initSmartScrollSnapping();