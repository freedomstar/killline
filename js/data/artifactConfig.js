/**
 * Artifact Configuration
 * Centralized numerical values for all artifacts.
 */
export const artifactConfig = {
    // 躺平流 (Passive Income)
    dropshipping_bot: {
        dailyIncome: 100,
        mentalCost: 5
    },

    // 啃老流 (Survival)
    mom_credit_card: {
        debtDiscount: 0.5, // 50% discount when money < 0
        luxuryThreshold: 50
    },

    // 卖血流 (Risk/Reward)
    gopro_camera: {
        healthLossReward: 20,
        medicalCostMultiplier: 1.5 // +50%
    },

    // 欧皇流 (Luck)
    lucky_ring: {
        successRateBonus: 0.25 // +25%
    },

    // 卷王流 (Grind)
    coffee_iv_drip: {
        energyRestoreTarget: 100,
        dailyHealthCost: 2
    }
};
