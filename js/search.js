/**
 * HabitFlow - Search Module
 * Local real-time filtering for habits on the dashboard.
 */

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const filterPills = document.querySelectorAll('.filter-pill');
    
    // Add Search Input dynamic creation (since it's not in HTML by default)
    if (searchBtn) {
        searchBtn.onclick = () => {
            let input = document.getElementById('search-input-dynamic');
            if (input) {
                input.focus();
            } else {
                input = document.createElement('input');
                input.id = 'search-input-dynamic';
                input.type = 'text';
                input.placeholder = 'Search habits...';
                input.className = 'search-input glass-card';
                
                document.querySelector('.top-bar').appendChild(input);
                input.focus();
                
                input.oninput = (e) => {
                    const query = e.target.value.toLowerCase();
                    filterHabits(query);
                };
            }
        };
    }

    // Filter Pills logic
    filterPills.forEach(pill => {
        pill.onclick = () => {
            filterPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const filterType = pill.dataset.filter;
            filterHabitsByStatus(filterType);
        };
    });
});

function filterHabits(query) {
    const cards = document.querySelectorAll('.habit-card');
    cards.forEach(card => {
        const name = card.querySelector('h4').textContent.toLowerCase();
        const category = card.querySelector('.badge').textContent.toLowerCase();
        if (name.includes(query) || category.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterHabitsByStatus(status) {
    const cards = document.querySelectorAll('.habit-card');
    cards.forEach(card => {
        const isDone = card.classList.contains('completed');
        if (status === 'all') {
            card.style.display = 'flex';
        } else if (status === 'completed' && isDone) {
            card.style.display = 'flex';
        } else if (status === 'pending' && !isDone) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}
