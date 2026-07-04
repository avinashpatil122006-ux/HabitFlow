/**
 * HabitFlow - Main App Module
 * Handles shared UI components like Sidebar, Theme, and Navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize storage
    const data = HabitStorage.init();
    
    // Initialize UI Components
    initTheme(data.settings.theme);
    initSidebar();
    updateUserStats(data.user);
    
    // Render Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }
});

/**
 * Applies the stored theme to the body
 */
function initTheme(theme) {
    document.body.setAttribute('data-theme', theme);
}

/**
 * Highlights the active menu item in the sidebar
 */
function initSidebar() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (currentPath.includes(href) && href !== '#') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

/**
 * Updates small user stats in sidebar/topbar
 */
function updateUserStats(user) {
    const levelElement = document.getElementById('user-level');
    const xpElement = document.getElementById('user-xp');
    const nameElement = document.getElementById('user-name');
    
    if (levelElement) levelElement.textContent = `Lvl ${user.level}`;
    if (xpElement) xpElement.textContent = `${user.xp} XP`;
    if (nameElement) nameElement.textContent = user.name;
}

/**
 * Utility for formatting dates
 */
const DateUtils = {
    getTodayString() {
        const date = new Date();
        return date.toISOString().split('T')[0];
    },
    formatPrettyDate(date) {
        return new Intl.DateTimeFormat('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
        }).format(date);
    }
};

// Global level-up/feedback toast (simplified)
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }, 100);
}
