/**
 * HabitFlow - Storage Module
 * Handles all LocalStorage interactions and data persistence.
 */

const STORAGE_KEY = 'habitflow_data';

const INITIAL_DATA = {
    user: {
        name: 'Adventurer',
        level: 1,
        xp: 0,
        joinedDate: new Date().toISOString()
    },
    habits: [],
    logs: {}, // Format: { "YYYY-MM-DD": ["habit_id_1", "habit_id_2"] }
    achievements: [],
    settings: {
        theme: 'dark',
        accentColor: '#6366f1',
        notifications: true,
        animations: true
    }
};

const Storage = {
    /**
     * Initialize or load existing data
     */
    init() {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            this.save(INITIAL_DATA);
            return INITIAL_DATA;
        }
        return JSON.parse(data);
    },

    /**
     * Save full data object to LocalStorage
     */
    save(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * Update specific parts of the data
     */
    update(key, value) {
        const data = this.init();
        data[key] = value;
        this.save(data);
    },

    /**
     * Get a specific key from data
     */
    get(key) {
        const data = this.init();
        return data[key];
    },

    /**
     * Clear all data (Factory Reset)
     */
    clear() {
        localStorage.removeItem(STORAGE_KEY);
        window.location.reload();
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined') {
    module.exports = Storage;
} else {
    window.HabitStorage = Storage;
}
