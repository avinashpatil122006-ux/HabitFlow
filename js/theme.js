/**
 * HabitFlow - Theme Module
 * Handles accent colors and runtime theme switching.
 */

function updateAccentColor(color) {
    document.documentElement.style.setProperty('--primary', color);
    // Darken for hover states
    const darker = adjustColor(color, -20);
    document.documentElement.style.setProperty('--primary-dark', darker);
}

/**
 * Utility to darken/lighten a hex color
 */
function adjustColor(color, percent) {
    var num = parseInt(color.replace("#",""),16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<0?0:R:255)*0x10000 + (G<255?G<0?0:G:255)*0x100 + (B<255?B<0?0:B:255)).toString(16).slice(1);
}

document.addEventListener('DOMContentLoaded', () => {
    const data = HabitStorage.init();
    if (data.settings.accentColor) {
        updateAccentColor(data.settings.accentColor);
    }
    
    const accentPicker = document.getElementById('accent-picker');
    if (accentPicker) {
        accentPicker.value = data.settings.accentColor;
        accentPicker.addEventListener('change', (e) => {
            updateAccentColor(e.target.value);
            HabitStorage.update('settings', { ...HabitStorage.get('settings'), accentColor: e.target.value });
        });
    }
});
