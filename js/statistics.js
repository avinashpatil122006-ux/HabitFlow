/**
 * HabitFlow - Statistics Module
 * Helper functions to calculate streaks, completion rates, etc.
 */

const StatsEngine = {
    /**
     * Calculate current streak for the overall profile
     */
    calculateGlobalStreak(logs) {
        const sortedDates = Object.keys(logs).sort((a, b) => new Date(b) - new Date(a));
        if (sortedDates.length === 0) return 0;

        let streak = 0;
        let today = new Date();
        today.setHours(0,0,0,0);
        
        let currentDate = today;
        
        // Loop backwards from today
        while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (logs[dateStr] && logs[dateStr].length > 0) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                // If it's today and empty, check yesterday to continue streak
                if (dateStr === today.toISOString().split('T')[0]) {
                    currentDate.setDate(currentDate.getDate() - 1);
                    continue; 
                }
                break;
            }
        }
        return streak;
    },

    /**
     * Get weekly completion counts for Chart.js
     */
    getWeeklyTrend(logs) {
        const labels = [];
        const values = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            values.push(logs[dateStr] ? logs[dateStr].length : 0);
        }
        
        return { labels, values };
    },

    /**
     * Get category-wise completion distribution
     */
    getCategoryDistribution(habits, logs) {
        const counts = {};
        const allCompletions = Object.values(logs).flat();
        
        allCompletions.forEach(id => {
            const habit = habits.find(h => h.id === id);
            if (habit) {
                counts[habit.category] = (counts[habit.category] || 0) + 1;
            }
        });
        
        return {
            labels: Object.keys(counts),
            values: Object.values(counts)
        };
    },

    /**
     * Get overall success rate percentage
     */
    getSuccessRate(habits, logs) {
        if (habits.length === 0) return 0;
        
        const totalPossible = habits.length * Object.keys(logs).length;
        if (totalPossible === 0) return 0;
        
        const totalDone = Object.values(logs).reduce((sum, day) => sum + day.length, 0);
        return Math.round((totalDone / totalPossible) * 100);
    }
};

window.StatsEngine = StatsEngine;
