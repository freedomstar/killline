/**
 * Night Choices Logic
 */
import { I18n } from '../i18n.js';
import { GameData } from '../data/index.js'; // Use GameData as eventConfigs is now aggregated there

const getRumorLine = (state, context) => {
    if (!context || !context.rng) return '';
    const foreseeing = GameData.foreseeingConfig || {};
    if ((state.lastRumorDay || 0) === state.day) return '';
    const social = state.socialValue || 50;
    if (social < 60) return '';
    if (context.rng.random() >= (foreseeing.rumorChance || 0.35)) return '';
    const rumors = I18n.t('game.foreseeing.rumors');
    if (!Array.isArray(rumors) || rumors.length === 0) return '';
    const rumor = rumors[Math.floor(context.rng.random() * rumors.length)];
    state.lastRumorDay = state.day;
    return I18n.t('game.foreseeing.rumorLine', rumor);
};

export const nightChoices = {
    sleep: {
        id: 'sleep',
        condition: (housing) => true,
        hint: () => I18n.t('data.night_choices.sleep.hint',
            GameData.eventConfigs.night_choice_hints.sleep.energyRecoveryTomorrow
        ),
        effect: (state, context) => {
            const recovery = GameData.eventConfigs.night_choice_hints.sleep.energyRecoveryTomorrow;
            return {
                message: I18n.t('game.nightResults.sleep', recovery),
                energyRecoveryTomorrow: recovery
            };
        }
    },
    phone: {
        id: 'phone',
        condition: (housing) => true,
        hint: () => I18n.t('data.night_choices.phone.hint',
            GameData.eventConfigs.night_choice_hints.phone.mentalGain,
            GameData.eventConfigs.night_choice_hints.phone.energyRecoveryTomorrow
        ),
        effect: (state, context) => {
            const cfg = GameData.eventConfigs.night_choice_hints.phone;
            state.mental = Math.min(state.maxMental, (state.mental || 0) + cfg.mentalGain);
            return {
                message: I18n.t('game.nightResults.phone'),
                energyRecoveryTomorrow: cfg.energyRecoveryTomorrow
            };
        }
    },
    phone_social: {
        id: 'phone_social',
        condition: (housing, state) => state && state.phoneBillPaid, // 只有交了话费才能打
        hint: () => I18n.t('data.night_choices.phone_social.hint',
            GameData.eventConfigs.night_choice_hints.phone_social.socialGain,
            GameData.eventConfigs.night_choice_hints.phone_social.mentalGain,
            GameData.eventConfigs.night_choice_hints.phone_social.energyRecoveryTomorrow
        ),
        effect: (state, context) => {
            const cfg = GameData.eventConfigs.night_choice_hints.phone_social;
            state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + cfg.socialGain);
            state.mental = Math.min(state.maxMental, (state.mental || 0) + cfg.mentalGain);
            const rumor = getRumorLine(state, context);
            const baseMsg = I18n.t('game.nightResults.phone_social');
            return {
                message: rumor ? `${baseMsg}\n${rumor}` : baseMsg,
                energyRecoveryTomorrow: cfg.energyRecoveryTomorrow
            };
        }
    },
    overtime: {
        id: 'overtime',
        condition: (housing, state) => state && state.job === 'fulltime',
        hint: () => I18n.t('data.night_choices.overtime.hint',
            GameData.eventConfigs.night_choice_hints.overtime.money,
            GameData.eventConfigs.night_choice_hints.overtime.stress,
            0.1,
            GameData.eventConfigs.night_choice_hints.overtime.energyRecoveryTomorrow
        ),
        effect: (state, context) => {
            const cfg = GameData.eventConfigs.night_choice_hints.overtime;
            if (context.game && context.game.deductMoney) {
                // earning money, so standard addition is fine, but maybe we want to log it?
                // actually overtime earns money, so we don't need deductMoney.
                // But we definitely need context.game for work progress.
                state.money += cfg.money;
            } else {
                state.money += cfg.money;
            }
            state.mental = Math.max(0, (state.mental || 0) - cfg.stress);

            // 任务进度 (需 context.game 支持)
            let extraMsg = "";
            if (context && context.game && typeof context.game.checkTaskProgress === 'function') {
                const progressGain = 10;
                context.game.checkTaskProgress(progressGain);
                extraMsg = I18n.t('game.nightResults.overtimeProgress', state.workTask.progress, progressGain);
                if (state.workTask.progress >= 100) {
                    extraMsg += I18n.t('game.nightResults.overtimeComplete');
                }
            } else if (state.workTask) {
                // Fallback if function missing but we have state
                state.workTask.progress = Math.min(100, (state.workTask.progress || 0) + 10);
            }

            return {
                message: I18n.t('game.nightResults.overtime', cfg.money, extraMsg),
                energyRecoveryTomorrow: cfg.energyRecoveryTomorrow
            };
        }
    },
    entertainment: {
        id: 'entertainment',
        condition: (housing) => housing !== 'homeless' && housing !== 'car',
        hint: () => I18n.t('data.night_choices.entertainment.hint',
            GameData.eventConfigs.night_choice_hints.entertainment.money,
            GameData.eventConfigs.night_choice_hints.entertainment.mental,
            GameData.eventConfigs.night_choice_hints.entertainment.energyRecoveryTomorrow
        ),
        effect: (state, context) => {
            const cfg = GameData.eventConfigs.night_choice_hints.entertainment;
            if (context.game && context.game.deductMoney) {
                context.game.deductMoney(cfg.money, 'daily');
            } else {
                state.money -= cfg.money;
            }
            state.mental = Math.min(state.maxMental, (state.mental || 0) + cfg.mental);
            return {
                message: I18n.t('game.nightResults.entertainment', cfg.money),
                energyRecoveryTomorrow: cfg.energyRecoveryTomorrow
            };
        }
    },
    prepareMeal: {
        id: 'prepareMeal',
        condition: (housing) => housing === 'apartment' || housing === 'cheapRoom',
        hint: () => I18n.t('data.night_choices.prepareMeal.hint',
            GameData.eventConfigs.night_choice_hints.prepareMeal.cost,
            GameData.eventConfigs.night_choice_hints.prepareMeal.energyRecoveryTomorrow,
            GameData.eventConfigs.night_choice_hints.prepareMeal.mentalGain
        ),
        effect: (state, context) => {
            const cfg = GameData.eventConfigs.night_choice_hints.prepareMeal;
            if (state.ingredients >= cfg.cost) {
                state.ingredients -= cfg.cost;
                state.hasPreparedMeal = true;
                if (cfg.mentalGain) {
                    state.mental = Math.min(state.maxMental, (state.mental || 0) + cfg.mentalGain);
                }
                return {
                    message: I18n.t('game.nightResults.prepareMeal'),
                    energyRecoveryTomorrow: cfg.energyRecoveryTomorrow
                };
            }
            return {
                message: '食材不足'
            };
        }
    },
    grocery: {
        id: 'grocery',
        condition: (housing) => true,
        hint: () => I18n.t('data.night_choices.grocery.hint',
            GameData.eventConfigs.night_choice_hints.grocery.money,
            GameData.eventConfigs.night_choice_hints.grocery.ingredients,
            GameData.eventConfigs.night_choice_hints.grocery.energyRecoveryTomorrow
        ),
        effect: (state, context) => {
            const cfg = GameData.eventConfigs.night_choice_hints.grocery;
            if (context.game && context.game.deductMoney) {
                context.game.deductMoney(cfg.money, 'daily');
            } else {
                state.money -= cfg.money;
            }
            state.ingredients = (state.ingredients || 0) + cfg.ingredients;
            return {
                message: I18n.t('game.nightResults.grocery'),
                energyRecoveryTomorrow: cfg.energyRecoveryTomorrow
            };
        }
    }
};
