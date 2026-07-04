/**
 * HabitFlow - Habits Module
 * Logic for managing habits and dashboard interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    const habitList = document.getElementById('habit-list');
    const habitForm = document.getElementById('habit-form');
    const habitModal = document.getElementById('habit-modal');
    const fabAdd = document.getElementById('fab-add-habit');
    const closeBtn = document.getElementById('close-modal');
    
    // Initial Render
    renderHabits();
    updateDashboardStats();

    // Modal Events
    fabAdd.addEventListener('click', () => habitModal.classList.add('show'));
    closeBtn.addEventListener('click', () => habitModal.classList.remove('show'));
    document.getElementById('cancel-habit').addEventListener('click', () => habitModal.classList.remove('show'));

    // Handle Form Submission
    habitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newHabit = {
            id: 'habit_' + Date.now(),
            name: document.getElementById('habit-name').value,
            category: document.getElementById('habit-category').value,
            emoji: document.getElementById('habit-emoji').value || '✨',
            difficulty: document.getElementById('habit-difficulty').value,
            priority: document.getElementById('habit-priority').value,
            goal: document.getElementById('habit-goal').value,
            createdAt: new Date().toISOString()
        };

        const data = HabitStorage.init();
        data.habits.push(newHabit);
        
        // Award XP for creating habit
        data.user.xp += 20;
        
        HabitStorage.save(data);
        renderHabits();
        updateDashboardStats();
        
        habitModal.classList.remove('show');
        habitForm.reset();
        
        if (window.showToast) showToast('New habit created! +20 XP');
    });

    // Update Date in Header
    const dateEl = document.getElementById('current-date');
    if (dateEl) dateEl.textContent = DateUtils.formatPrettyDate(new Date());
});

/**
 * Renders the habit list for today
 */
function renderHabits() {
    const list = document.getElementById('habit-list');
    const data = HabitStorage.init();
    const today = DateUtils.getTodayString();
    const completions = data.logs[today] || [];
    
    if (data.habits.length === 0) {
        list.innerHTML = `<div class="empty-state"><p>No habits yet. Start by adding one!</p></div>`;
        return;
    }

    list.innerHTML = '';
    data.habits.forEach(habit => {
        const isCompleted = completions.includes(habit.id);
        const card = document.createElement('div');
        card.className = `habit-card ${isCompleted ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="habit-left">
                <div class="habit-emoji">${habit.emoji}</div>
                <div class="habit-details">
                    <h4>${habit.name}</h4>
                    <div class="habit-meta">
                        <span class="badge badge-${habit.category.toLowerCase()}">${habit.category}</span>
                        <span>${habit.difficulty}</span>
                    </div>
                </div>
            </div>
            <div class="habit-right">
                <button class="btn-complete" onclick="toggleHabit('${habit.id}')">
                    <i data-lucide="check"></i>
                </button>
                <button class="btn-delete" onclick="deleteHabit('${habit.id}')">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
        list.appendChild(card);
    });
    
    if (window.lucide) lucide.createIcons();
}

/**
 * Toggles habit completion
 */
function toggleHabit(habitId) {
    const data = HabitStorage.init();
    const today = DateUtils.getTodayString();
    
    if (!data.logs[today]) data.logs[today] = [];
    
    const index = data.logs[today].indexOf(habitId);
    if (index === -1) {
        // Complete habit
        data.logs[today].push(habitId);
        data.user.xp += 10;
        if (window.showToast) showToast('Habit completed! +10 XP', 'success');
    } else {
        // Uncomplete
        data.logs[today].splice(index, 1);
        data.user.xp = Math.max(0, data.user.xp - 10);
    }
    
    HabitStorage.save(data);
    renderHabits();
    updateDashboardStats();
    checkLevelUp(data);
}

/**
 * Deletes a habit
 */
function deleteHabit(habitId) {
    if (!confirm('Are you sure you want to delete this habit?')) return;
    
    const data = HabitStorage.init();
    data.habits = data.habits.filter(h => h.id !== habitId);
    
    // Also remove from logs to keep it clean
    Object.keys(data.logs).forEach(date => {
        data.logs[date] = data.logs[date].filter(id => id !== habitId);
    });
    
    HabitStorage.save(data);
    renderHabits();
    updateDashboardStats();
}

/**
 * Updates stats and progress ring
 */
function updateDashboardStats() {
    const data = HabitStorage.init();
    const today = DateUtils.getTodayString();
    const total = data.habits.length;
    const completed = (data.logs[today] || []).length;
    
    // Update Text Stats
    const completedEl = document.getElementById('stat-completed');
    const xpEl = document.getElementById('stat-xp');
    if (completedEl) completedEl.textContent = completed;
    if (xpEl) xpEl.textContent = data.user.xp;
    
    // Update Progress Ring
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    const percentEl = document.getElementById('progress-percent');
    const ringCircle = document.getElementById('progress-ring-circle');
    
    if (percentEl) percentEl.textContent = `${percentage}%`;
    if (ringCircle) {
        const circumference = 2 * Math.PI * 65; // r=65
        const offset = circumference - (percentage / 100) * circumference;
        ringCircle.style.strokeDashoffset = offset;
    }

    // Check for "Perfect Day" (all completed)
    if (total > 0 && completed === total) {
        triggerConfettiEffect();
    }
}

/**
 * Simple XP-to-Level logic
 */
function checkLevelUp(data) {
    const nextLevelXP = data.user.level * 200;
    if (data.user.xp >= nextLevelXP) {
        data.user.level++;
        HabitStorage.save(data);
        if (window.showToast) showToast(`LEVEL UP! You are now Level ${data.user.level}`, 'success');
        updateUserStats(data.user);
    }
}

/**
 * Placeholder for confetti (will integrate a simple CSS one or library later)
 */
function triggerConfettiEffect() {
    console.log('CONFETTI! Perfect Day!');
}
