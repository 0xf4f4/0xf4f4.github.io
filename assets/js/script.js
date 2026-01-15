// ===== DARK MODE TOGGLE =====
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