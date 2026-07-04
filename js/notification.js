/**
 * HabitFlow - Notification Module
 * Browser-native reminders.
 */

const HabitNotifications = {
    async requestPermission() {
        if (!("Notification" in window)) return false;
        
        const permission = await Notification.requestPermission();
        return permission === "granted";
    },

    sendReminder(title, body) {
        if (Notification.permission === "granted") {
            new Notification(`HabitFlow: ${title}`, {
                body,
                icon: 'assets/icons/zap.png' // Ensure path is correct or use generic
            });
        }
    },

    /**
     * Check if any habits need notification (simplistic check)
     */
    checkReminders(habits) {
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        habits.forEach(habit => {
            if (habit.reminderTime === timeStr) {
                this.sendReminder(`Time for ${habit.name}!`, `Don't break your streak. ${habit.emoji}`);
            }
        });
    }
};

// Start a timer to check every minute
setInterval(() => {
    const data = HabitStorage.init();
    if (data.settings.notifications) {
        HabitNotifications.checkReminders(data.habits);
    }
}, 60000);

window.HabitNotifications = HabitNotifications;
