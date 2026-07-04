/**
 * HabitFlow - Reports Module
 * Orchestrates Chart.js rendering and Heatmap generation.
 */

document.addEventListener('DOMContentLoaded', () => {
    const data = HabitStorage.init();
    
    // Update Metrics
    document.getElementById('report-total-habits').textContent = data.habits.length;
    document.getElementById('report-success-rate').textContent = `${StatsEngine.getSuccessRate(data.habits, data.logs)}%`;
    document.getElementById('report-best-streak').textContent = StatsEngine.calculateGlobalStreak(data.logs);
    document.getElementById('report-total-completions').textContent = Object.values(data.logs).reduce((s, d) => s + d.length, 0);

    initCharts(data);
    initHeatmap(data);
});

function initCharts(data) {
    // Weekly Trend Chart
    const weeklyData = StatsEngine.getWeeklyTrend(data.logs);
    const ctxTrend = document.getElementById('weeklyTrendChart').getContext('2d');
    new Chart(ctxTrend, {
        type: 'line',
        data: {
            labels: weeklyData.labels,
            datasets: [{
                label: 'Completions',
                data: weeklyData.values,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { grid: { display: false } }
            }
        }
    });

    // Category Doughnut Chart
    const catData = StatsEngine.getCategoryDistribution(data.habits, data.logs);
    const ctxCat = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctxCat, {
        type: 'doughnut',
        data: {
            labels: catData.labels,
            datasets: [{
                data: catData.values,
                backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { color: '#94a3b8', padding: 20 } }
            }
        }
    });
}

function initHeatmap(data) {
    const grid = document.getElementById('heatmap-grid');
    if (!grid) return;

    // We render 1 year (53 weeks)
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Find the starting Sunday
    const start = new Date(oneYearAgo);
    start.setDate(start.getDate() - start.getDay());

    for (let i = 0; i < 53 * 7; i++) {
        const d = new Date(start);
        d.setDate(d.getDate() + i);
        
        const dateStr = d.toISOString().split('T')[0];
        const completions = (data.logs[dateStr] || []).length;
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'heatmap-day';
        dayDiv.title = `${dateStr}: ${completions} completions`;
        
        // Level calculation (0-4)
        let level = 0;
        if (completions > 0) level = 1;
        if (completions > 2) level = 2;
        if (completions > 4) level = 3;
        if (completions >= data.habits.length && data.habits.length > 0) level = 4;
        
        dayDiv.classList.add(`level-${level}`);
        grid.appendChild(dayDiv);
    }
}
