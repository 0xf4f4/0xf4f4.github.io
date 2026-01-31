const themeToggle = document.getElementById('light-dark');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 
                   (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

function applyTheme(theme) {
    if (theme === 'dark') {
        htmlElement.classList.add('dark-mode');
        themeToggle.checked = true;
    } else {
        htmlElement.classList.remove('dark-mode');
        themeToggle.checked = false;
    }
}

applyTheme(savedTheme);

themeToggle.addEventListener('change', () => {
    const isDark = htmlElement.classList.contains('dark-mode');
    const newTheme = isDark ? 'light' : 'dark';
    
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1
});

const revealElements = document.querySelectorAll('.reveal');
revealElements.forEach((el) => observer.observe(el));

const scrollArrow = document.querySelector('.scroll-indicator');

if (scrollArrow) {
    scrollArrow.addEventListener('click', () => {
        const projectSection = document.querySelector('.project');
        if (projectSection) {
            projectSection.scrollIntoView({ behavior: 'smooth' });
        }
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            scrollArrow.style.opacity = '0';
            scrollArrow.style.pointerEvents = 'none';
        } else {
            scrollArrow.style.opacity = '0.6';
            scrollArrow.style.pointerEvents = 'auto';
        }
    });
}