/**
 * HabitFlow - Achievement Module
 * Defines badges and logic to unlock them.
 */

const BADGES = [
    { id: 'first_habit', title: 'First Habit', desc: 'Create your very first habit tracking goal.', icon: '🏆', condition: (data) => data.habits.length > 0 },
    { id: 'seven_day', title: '7 Day Streak', desc: 'Maintain a consistent streak for one full week.', icon: '🔥', condition: (data) => StatsEngine.calculateGlobalStreak(data.logs) >= 7 },
    { id: 'perfect_day', title: 'Perfect Day', desc: 'Complete all your daily habits in a single day.', icon: '💯', condition: (data) => {
        const today = DateUtils.getTodayString();
        return data.habits.length > 0 && (data.logs[today] || []).length === data.habits.length;
    }},
    { id: 'warrior', title: '30 Day Warrior', desc: 'Maintain a 30-day streak of consistency.', icon: '💪', condition: (data) => StatsEngine.calculateGlobalStreak(data.logs) >= 30 },
    { id: 'level_10', title: 'Level 10', desc: 'Reach Level 10 by earning XP through habits.', icon: '🚀', condition: (data) => data.user.level >= 10 },
    { id: 'century', title: '100 Completions', desc: 'Complete a total of 100 individual habit tasks.', icon: '👑', condition: (data) => Object.values(data.logs).reduce((s, d) => s + d.length, 0) >= 100 }
];

document.addEventListener('DOMContentLoaded', () => {
    renderBadges();
});

function renderBadges() {
    const grid = document.getElementById('badges-grid');
    const data = HabitStorage.init();
    
    grid.innerHTML = '';
    
    BADGES.forEach(badge => {
        const isUnlocked = badge.condition(data);
        const card = document.createElement('div');
        card.className = `badge-card glass-card ${isUnlocked ? 'unlocked' : ''}`;
        
        card.innerHTML = `
            <div class="badge-icon">${badge.icon}</div>
            <h3>${badge.title}</h3>
            <p>${badge.desc}</p>
            ${isUnlocked ? '<span class="unlock-date">Unlocked</span>' : ''}
        `;
        grid.appendChild(card);
    });
}
