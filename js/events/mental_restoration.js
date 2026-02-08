/**
 * Mental Restoration Events
 * Events focused on restoring maxMental cap.
 */
import { I18n } from '../i18n.js';
import { GameData } from '../data/index.js';

export const mentalRestorationEvents = [
    // 1. Psychotherapy (Action)
    {
        id: 'psychotherapy',
        type: 'action', // Custom type, handled by daily/weekend logic manually
        title: I18n.t('data.mental_restoration.psychotherapy.title'),
        description: I18n.t('data.mental_restoration.psychotherapy.description'),
        // No specific period/condition here as it's added as a choice in daily.js
        effect: (state, context) => {
            const conf = GameData.eventConfigs.mental_restoration.psychotherapy;
            const insuranceCovered = state.insurance && state.insurance.healthPlanId !== 'none';
            const cost = insuranceCovered ? conf.costInsurance : conf.costNoInsurance;

            if (state.money < cost) {
                return { message: I18n.t('data.mental_restoration.psychotherapy.messages.tooPoor'), type: 'neutral' };
            }

            state.money -= cost;
            state.energy = Math.max(0, state.energy - conf.energyCost);

            // Restore Max Mental
            const oldMax = state.maxMental;
            state.maxMental = Math.min(GameData.initialState.maxMental, state.maxMental + conf.maxMentalGain);
            const maxGain = state.maxMental - oldMax;

            // Restore Current Mental
            state.mental = Math.min(state.maxMental, state.mental + conf.mentalGain);

            return {
                message: I18n.t('data.mental_restoration.psychotherapy.messages.success', maxGain),
                type: 'positive'
            };
        }
    },

    // 2. Nature Retreat (Weekend Action)
    {
        id: 'nature_retreat',
        type: 'action',
        title: I18n.t('data.mental_restoration.nature_retreat.title'),
        description: I18n.t('data.mental_restoration.nature_retreat.description'),
        effect: (state, context) => {
            const conf = GameData.eventConfigs.mental_restoration.nature_retreat;

            if (state.money < conf.cost) {
                return { message: I18n.t('data.mental_restoration.nature_retreat.messages.tooPoor'), type: 'neutral' };
            }
            state.money -= conf.cost;
            state.energy = Math.max(0, state.energy - conf.energyCost);

            // Restore Max Mental
            const oldMax = state.maxMental;
            state.maxMental = Math.min(GameData.initialState.maxMental, state.maxMental + conf.maxMentalGain);
            const maxGain = state.maxMental - oldMax;

            // Restore Stats
            state.mental = Math.min(state.maxMental, state.mental + conf.mentalGain);
            if (conf.healthGain) {
                state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);
            }

            return {
                message: I18n.t('data.mental_restoration.nature_retreat.messages.success', maxGain),
                type: 'positive'
            };
        }
    },

    // 3. Meditation Insight (Random Event)
    {
        id: 'meditation_insight',
        type: 'opportunity',
        title: () => I18n.t('data.mental_restoration.meditation_insight.title'),
        description: () => I18n.t('data.mental_restoration.meditation_insight.description'),
        period: 'any',
        isRandom: true,
        weight: 0.05, // 5% chance as requested
        choices: [
            {
                text: I18n.t('data.mental_restoration.meditation_insight.choices.embrace.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.mental_restoration.meditation_insight;
                    return I18n.t('data.mental_restoration.meditation_insight.choices.embrace.hint', conf.maxMentalGain);
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.mental_restoration.meditation_insight;

                    const oldMax = state.maxMental;
                    state.maxMental = Math.min(GameData.initialState.maxMental, state.maxMental + conf.maxMentalGain);
                    const maxGain = state.maxMental - oldMax;

                    return {
                        message: I18n.t('data.mental_restoration.meditation_insight.messages.success', maxGain),
                        type: 'positive'
                    };
                }
            }
        ]
    },

    // 4. Volunteer Work (Weekend Action)
    {
        id: 'volunteer_work',
        type: 'action',
        title: I18n.t('data.mental_restoration.volunteer_work.title'),
        description: I18n.t('data.mental_restoration.volunteer_work.description'),
        effect: (state, context) => {
            const conf = GameData.eventConfigs.mental_restoration.volunteer_work;

            state.energy = Math.max(0, state.energy - conf.energyCost);

            // Restore Max Mental
            const oldMax = state.maxMental;
            state.maxMental = Math.min(GameData.initialState.maxMental, state.maxMental + conf.maxMentalGain);
            const maxGain = state.maxMental - oldMax;

            state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);

            return {
                message: I18n.t('data.mental_restoration.volunteer_work.messages.success', maxGain),
                type: 'positive'
            };
        }
    }
];
