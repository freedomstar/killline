/**
 * Roguelike Artifacts Registry
 * 
 * Artifacts are powerful, game-changing items that define a "run".
 * Player selects ONE at the start of the game.
 * 
 * Hooks:
 * - onDaily(state): Triggered every morning.
 * - onStatsChange(state, changes): Triggered when stats (health/money/etc) change. return modified changes.
 * - onInit(state): Triggered when game starts with this artifact.
 */
import { I18n } from '../i18n.js';
import { artifactConfig } from './artifactConfig.js';

export const artifacts = {
    // --- 躺平流 (Passive Income) ---
    dropshipping_bot: {
        id: 'dropshipping_bot',
        name: () => I18n.t('data.artifacts.dropshipping_bot.name'),
        name: () => I18n.t('data.artifacts.dropshipping_bot.name'),
        description: () => I18n.t('data.artifacts.dropshipping_bot.description', artifactConfig.dropshipping_bot.dailyIncome, artifactConfig.dropshipping_bot.mentalCost),
        icon: '🤖',
        rarity: 'common',
        onDaily: (state) => {
            const { dailyIncome, mentalCost } = artifactConfig.dropshipping_bot;
            state.money += dailyIncome;
            state.mental -= mentalCost;
            return {
                triggered: true,
                log: I18n.t('data.artifacts.dropshipping_bot.log', dailyIncome, mentalCost)
            };
        }
    },

    // --- 啃老流 (Survival) ---
    mom_credit_card: {
        id: 'mom_credit_card',
        name: () => I18n.t('data.artifacts.mom_credit_card.name'),
        name: () => I18n.t('data.artifacts.mom_credit_card.name'),
        description: () => I18n.t('data.artifacts.mom_credit_card.description', (artifactConfig.mom_credit_card.debtDiscount * 100), artifactConfig.mom_credit_card.luxuryThreshold),
        icon: '💳',
        rarity: 'rare',
        onDaily: (state) => {
            // Logic handled in EventManager Proxy (consumption reduction)
        },
        // Loop hook to check transactions? (Implemented in core logic restriction)
    },

    // --- 卖血流 (Risk/Reward) ---
    gopro_camera: {
        id: 'gopro_camera',
        name: () => I18n.t('data.artifacts.gopro_camera.name'),
        name: () => I18n.t('data.artifacts.gopro_camera.name'),
        description: () => I18n.t('data.artifacts.gopro_camera.description', artifactConfig.gopro_camera.healthLossReward, artifactConfig.gopro_camera.medicalCostMultiplier),
        icon: '📹',
        rarity: 'uncommon',
        // Hook handled in core.js: deductHealth()
    },

    // --- 欧皇流 (Luck) ---
    lucky_ring: {
        id: 'lucky_ring',
        name: () => I18n.t('data.artifacts.lucky_ring.name'),
        name: () => I18n.t('data.artifacts.lucky_ring.name'),
        description: () => I18n.t('data.artifacts.lucky_ring.description', (artifactConfig.lucky_ring.successRateBonus * 100)),
        icon: '💍',
        rarity: 'legendary',
        onDaily: (state) => {
            // Passive effect: Increased success rate in EventManager.calculateSuccessRate
        }
    },

    // --- 卷王流 (Grind) ---
    coffee_iv_drip: {
        id: 'coffee_iv_drip',
        name: () => I18n.t('data.artifacts.coffee_iv_drip.name'),
        name: () => I18n.t('data.artifacts.coffee_iv_drip.name'),
        description: () => I18n.t('data.artifacts.coffee_iv_drip.description', artifactConfig.coffee_iv_drip.energyRestoreTarget, artifactConfig.coffee_iv_drip.dailyHealthCost),
        icon: '☕',
        rarity: 'common',
        onDaily: (state) => {
            const { energyRestoreTarget, dailyHealthCost } = artifactConfig.coffee_iv_drip;
            state.energy = energyRestoreTarget;
            state.health -= dailyHealthCost;
            return {
                triggered: true,
                log: I18n.t('data.artifacts.coffee_iv_drip.log')
            };
        }
    }
};

export const getArtifact = (id) => artifacts[id];

export const getRandomArtifacts = (count = 3, rng) => {
    const keys = Object.keys(artifacts);
    const result = [];
    const tempKeys = [...keys];
    const random = rng ? () => rng.random() : () => Math.random();

    for (let i = 0; i < count; i++) {
        if (tempKeys.length === 0) break;
        const randomIndex = Math.floor(random() * tempKeys.length);
        result.push(artifacts[tempKeys[randomIndex]]);
        tempKeys.splice(randomIndex, 1);
    }
    return result;
};
