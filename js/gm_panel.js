import { game } from './game.js';
import { UI } from './ui.js';
import { I18n } from './i18n.js';

/**
 * GM Panel / Dev Tools Logic
 */
export function initGMPanel() {
    console.log('[GMPanel] Initializing...');

    // Keyboard shortcut to toggle panel: F9 (or Backtick ` if preferred, but F9 is safer)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F9') {
            toggleGMPanel();
        }
    });

    // Also bind to the existing "close" button if UI hasn't bound it (UI usually binds generic close buttons, but let's be safe)
    const closeBtn = document.getElementById('close-dev-editor');
    const modal = document.getElementById('dev-editor-modal');
    const saveBtn = document.getElementById('dev-save-btn');

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden');
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveGMChanges);
    }
}

function toggleGMPanel() {
    const modal = document.getElementById('dev-editor-modal');
    if (!modal) return;

    if (modal.classList.contains('hidden')) {
        openGMPanel();
    } else {
        modal.classList.add('hidden');
    }
}

function openGMPanel() {
    const modal = document.getElementById('dev-editor-modal');
    if (!modal) return;

    const state = game.getState();

    // Helper to safely set value
    const setValue = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
    };

    // Populate simple fields
    setValue('dev-input-money', state.money);
    setValue('dev-input-energy', Math.round(state.energy));
    setValue('dev-input-mental', Math.round(state.mental));
    setValue('dev-input-health', Math.round(state.health));
    setValue('dev-input-social', Math.round(state.socialValue || 50));
    setValue('dev-input-efficiency', Math.round(state.workEfficiency || 0));
    setValue('dev-input-ingredients', state.ingredients || 0);

    // Job Status
    const jobSelect = document.getElementById('dev-input-job');
    if (jobSelect) {
        // Try to set the value directly. 
        // If state.job matches one of the options, it will be selected.
        jobSelect.value = state.job;
    }

    // PIP Status
    const pipCheckbox = document.getElementById('dev-input-pip');
    if (pipCheckbox) {
        pipCheckbox.checked = !!state.pipActive;
    }

    modal.classList.remove('hidden');
}

function saveGMChanges() {
    const state = game.getState();

    // Read values
    const getValue = (id, type = 'float') => {
        const el = document.getElementById(id);
        if (!el) return null;
        if (type === 'int') return parseInt(el.value);
        if (type === 'float') return parseFloat(el.value);
        return el.value;
    };

    const money = getValue('dev-input-money');
    const energy = getValue('dev-input-energy');
    const mental = getValue('dev-input-mental');
    const health = getValue('dev-input-health');
    const social = getValue('dev-input-social');
    const efficiency = getValue('dev-input-efficiency');
    const ingredients = getValue('dev-input-ingredients', 'int');

    // Apply numeric changes
    if (money !== null && !isNaN(money)) state.money = money;
    if (energy !== null && !isNaN(energy)) state.energy = energy;
    if (mental !== null && !isNaN(mental)) state.mental = mental;
    if (health !== null && !isNaN(health)) state.health = health;
    if (social !== null && !isNaN(social)) state.socialValue = social;
    if (efficiency !== null && !isNaN(efficiency)) state.workEfficiency = efficiency;
    if (ingredients !== null && !isNaN(ingredients)) state.ingredients = ingredients;

    // Job changes
    const jobSelect = document.getElementById('dev-input-job');
    if (jobSelect && jobSelect.value) {
        state.job = jobSelect.value;

        // Side effects for job change?
        // Usually job change might reset salary or other flags, but GM tool implies direct state edit.
        // We might want to ensure consistency.
        if (state.job === 'unemployed' || state.job === 'fired') {
            if (!state.unemployedDays) state.unemployedDays = 0;
        } else {
            state.unemployedDays = 0;
        }
    }

    // PIP changes
    const pipCheckbox = document.getElementById('dev-input-pip');
    if (pipCheckbox) {
        state.pipActive = pipCheckbox.checked;
        if (state.pipActive && !state.pipPerformanceScore) {
            state.pipPerformanceScore = 50; // Default score if activating PIP
        }
    }

    // Clamp values to ensure validity
    game.clampValues();

    // Refresh UI
    UI.updateStatusBar(game.getStatusDescription());

    // Close modal
    document.getElementById('dev-editor-modal').classList.add('hidden');

    // Show toast
    UI.showToast(I18n.t('ui.toast.gmSaved'), "success");
}

// Expose globally for console debugging
window.openGMPanel = openGMPanel;
