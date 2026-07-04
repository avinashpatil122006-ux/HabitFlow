/**
 * HabitFlow - Calendar Module
 * Dynamic calendar generation and history tracking.
 */

document.addEventListener('DOMContentLoaded', () => {
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    const monthDisplay = document.getElementById('calendar-month-year');
    const calendarGrid = document.getElementById('calendar-grid');
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');

    function renderCalendar(month, year) {
        calendarGrid.innerHTML = '';
        const data = HabitStorage.init();
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        
        monthDisplay.textContent = `${monthNames[month]} ${year}`;

        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'calendar-day empty';
            calendarGrid.appendChild(emptyDiv);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'calendar-day';
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === DateUtils.getTodayString();
            
            if (isToday) dayDiv.classList.add('today');
            
            dayDiv.innerHTML = `<span>${day}</span>`;
            
            // Add status dot
            const logs = data.logs[dateStr] || [];
            const activeHabitsCount = data.habits.length; // Simplified: assumes all habits were active
            
            if (logs.length > 0) {
                const statusDot = document.createElement('div');
                statusDot.className = 'day-status';
                
                if (logs.length >= activeHabitsCount && activeHabitsCount > 0) {
                    statusDot.classList.add('perfect');
                } else {
                    statusDot.classList.add('partial');
                }
                dayDiv.appendChild(statusDot);
            } else if (new Date(dateStr) < new Date(DateUtils.getTodayString())) {
                 const statusDot = document.createElement('div');
                 statusDot.className = 'day-status none';
                 dayDiv.appendChild(statusDot);
            }

            dayDiv.onclick = () => showDayDetails(dateStr);
            calendarGrid.appendChild(dayDiv);
        }
    }

    function showDayDetails(dateStr) {
        const data = HabitStorage.init();
        const logs = data.logs[dateStr] || [];
        const detailsPanel = document.getElementById('day-details');
        const habitList = document.getElementById('details-habit-list');
        const dateHeader = document.getElementById('details-date');
        
        detailsPanel.style.display = 'block';
        dateHeader.textContent = DateUtils.formatPrettyDate(new Date(dateStr));
        habitList.innerHTML = '';
        
        if (data.habits.length === 0) {
            habitList.innerHTML = '<p>No habits tracked on this day.</p>';
            return;
        }

        data.habits.forEach(habit => {
            const isDone = logs.includes(habit.id);
            const item = document.createElement('div');
            item.className = 'details-habit-item';
            item.innerHTML = `
                <i data-lucide="${isDone ? 'check-circle' : 'circle'}" class="status-icon ${isDone ? 'completed' : 'missed'}"></i>
                <span>${habit.emoji} ${habit.name}</span>
            `;
            habitList.appendChild(item);
        });
        
        if (window.lucide) lucide.createIcons();
        detailsPanel.scrollIntoView({ behavior: 'smooth' });
    }

    prevBtn.onclick = () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        renderCalendar(currentMonth, currentYear);
    };

    nextBtn.onclick = () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        renderCalendar(currentMonth, currentYear);
    };

    renderCalendar(currentMonth, currentYear);
});
