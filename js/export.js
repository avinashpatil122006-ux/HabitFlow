/**
 * HabitFlow - Export/Import Module
 * Handles JSON data movement for backup and sync.
 */

document.addEventListener('DOMContentLoaded', () => {
    const exportBtn = document.getElementById('export-json');
    const importBtn = document.getElementById('import-btn');
    const importInput = document.getElementById('import-json');

    if (exportBtn) {
        exportBtn.onclick = () => {
            const data = HabitStorage.init();
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `habitflow-backup-${DateUtils.getTodayString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        };
    }

    if (importBtn) {
        importBtn.onclick = () => importInput.click();
    }

    if (importInput) {
        importInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    // Basic validation
                    if (data.habits && data.logs && data.user) {
                        HabitStorage.save(data);
                        alert('Data imported successfully! The page will now reload.');
                        window.location.reload();
                    } else {
                        alert('Invalid HabitFlow file format.');
                    }
                } catch (err) {
                    alert('Error reading file: ' + err.message);
                }
            };
            reader.readAsText(file);
        };
    }
});
