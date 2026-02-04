/**
 * Artifact Configuration
 * Centralized numerical values for all artifacts.
 */
export const artifactConfig = {
    // 动画相关配置
    animation: {
        initialDelay: 200,           // 动画初始延迟 (ms)
        legacyTriggerInterval: 250,  // 旧版触发间隔 (ms)
        initialGap: 400,             // 层间初始间隙/动画时长 (ms)
        minGap: 50,                 // 最小间隙/动画时长 (ms)
        gapDecay: 25,                // 每层递减量 (ms)
        layerGapRatio: 0.2,          // 层间隙占动画时长的比例
        maxTotalTriggers: 30,        // 神器触发动画的最大总次数
        shakeThreshold: 15           // 触发持续震屏的阈值
    },

    // 躺平流 (Passive Income)
    dropshipping_bot: {
        dailyIncome: 100,
        mentalCost: 5
    },

    // 啃老流 (Survival)
    mom_credit_card: {
        debtDiscount: 0.5, // 50% discount on spending
    },

    // 卖血流 (Risk/Reward)
    gopro_camera: {
        healthLossReward: 50,
        medicalCostMultiplier: 1.2 // +50%
    },

    // 欧皇流 (Luck)
    lucky_ring: {
        successRateBonus: 0.25 // +25%
    },

    // 卷王流 (Grind)
    coffee_drip: {
        minEnergy: 1
    },

    side_job_bot: {
        moneyBonus: 5
    },

    gig_cap: {
        moneyBonus: 30
    },

    piggy_bank: {
        dailyBonus: 50
    },

    bull_plushie: {
        percentPerHundred: 0.01
    },

    grinder_tie: {
        mentalRestore: 5,
        healthLossMultiplier: 2
    },

    blood_contract: {
        multiplier: 2
    },

    jammed_copier: {
    },

    // 养生流 (Wellness)
    wellness_tea: {
        healthGain: 2,
        mentalGain: 2
    },

    super_vitamin: {
        mentalRestoreRatio: 0.5 // Recover 0.2 Mental per 1 Health
    },

    // 赛博修仙流 (Cyber-Enhancement)
    neural_chip: {
        healthCost: 3,
        energyGain: 10,
        workProgressBonus: 5
    },

    intern_badge: {
        socialLoss: 10
    },

    leverage_jack: {
        multiplier: 3
    },

    insider_phone: {
        tipChance: 0.5,
        fineChance: 0.1,
        fineRate: 0.3,
        socialGain: 5,
        cooldownDays: 5
    },

    golden_parachute: {
        stopLossThreshold: 0.2
    },

    actuary_glasses: {
        denialImmunity: true,
        outOfNetworkImmunity: true,
        carRepairDiscount: 0.5
    },

    // 精神回复流 (Mental Gain)
    quantum_meditation_mat: {
        healthRestoreRatio: 0.5 // Recover 0.5 Health per 1 Mental
    },

    streamer_mic: {
        moneyPerMental: 2 // $2 per 1 Mental
    }
};
