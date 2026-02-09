/**
 * Event Detailed Configurations
 */
export const eventConfigs = {
    // Morning
    morning_coffee: {
        buy: { cost: 6, energyGain: 10, healthLoss: 2 }
    },
    // Afternoon
    afternoon_interview: {
        tryHard: {
            energyCost: 50,
            baseSuccessRate: 0.5,
            minSuccessRate: 0.2,
            maxSuccessRate: 0.85,
            efficiencyBonusPerPoint: 0.003,
            socialBonusHigh: 0.15,
            socialBonusMid: 0.05,
            socialBonusLow: -0.10,
            mentalGainSuccess: 10,
            mentalLossFail: 30,
            initialSickLeaveDays: 3
        },
        casual: {
            energyCost: 25,
            rateMultiplier: 0.6,
            maxRateGap: 0.05,
            minSuccessRate: 0.05,
            mentalGainSuccess: 20
        }
    },
    afternoon_exercise: {
        gym: { energyCost: 30, mentalGain: 10, healthGain: 5 },
        walk: { energyCost: 20, mentalGain: 5 }
    },
    afternoon_gig: {
        accept: { energyCost: 50, moneyGain: 150, tiredThreshold: 20, tiredMoneyGain: 80, tiredHealthLoss: 5 }
    },
    // Random / Special
    pip_warning: {
        accept: { pipDays: 5, pipScore: 50, mentalLoss: 15 },
        quit: {
            energyCost: 40,
            successMod: 0.35,
            raiseBasePct: 0.1,
            raiseEfficiencyMin: 0.8,
            raiseEfficiencyMax: 1.2,
            mentalGainSuccess: 10,
            mentalLossFail: 20,
            failScoreLoss: 10
        }
    },
    pip_result: {
        passChanceCap: 0.9,
        passChanceMin: 0.1,
        mentalGainPass: 10,
        mentalLossFail: 45
    },
    sudden_layoff: {
        accept: { severanceMonths: 1, mentalLoss: 50 },
        fight: { energyCost: 50, successMod: 0.4, successSeveranceMonths: 2, failSeveranceMonths: 0, mentalLossSuccess: 40, mentalLossFail: 50 }
    },
    // Work Incidents
    urgent_meeting: {
        attend: { energyCost: 35, baseSocialGain: 5, highSocialGain: 3, highSocialThreshold: 60, lowSocialThreshold: 30, workEfficiencyGain: 2 },
        ignore: { energyCost: 5, workEfficiencyLoss: 10 }
    },
    colleague_help: {
        help: { energyCost: 20, socialGain: 10 },
        decline: { mentalGain: 3, socialLoss: 5, workEfficiencyLoss: 10 }
    },
    overtime_request: {
        accept: { energyCost: 20, workEfficiencyGain: 5 },
        refuse: { socialLoss: 5, workEfficiencyLoss: 10 }
    },
    system_crash: {
        rest: { energyGain: 10 },
        help: { energyCost: 15, socialGain: 5 }
    },
    client_meeting: {
        prepare: { energyCost: 20, baseSocialGain: 5, highSocialGain: 3, highSocialThreshold: 60, lowSocialThreshold: 30, minEfficiency: 90 },
        wing_it: { mentalGain: 5, energyCost: 10, socialLoss: 5, baseRisk: 0.3, efficiencyImpact: 0.002 }
    },
    office_drama: {
        listen: { mentalGain: 5, energyCost: 15, socialGain: 3 },
        avoid: { healthGain: 2, socialLoss: 3 }
    },
    presentation: {
        lead: { energyCost: 20, baseSocialGain: 10, highSocialGain: 3, highSocialThreshold: 60, lowSocialThreshold: 30, workEfficiencyGain: 5 },
        support: { energyCost: 10, socialGain: 3, workEfficiencyGain: 2 }
    },
    work_general: {
        focus_work: { energyCost: 70, pipEnergyCost: 60, pipGain: 15, socialPipBonus: 5 },
        slack_off: {
            energyCost: 30,
            pipMentalGain: 5,
            normalMentalGain: 5,
            pipLostScore: 10,
            pipCriticalScoreLoss: 15,
            pipRisk: 0.5,
            normalRisk: 0.3,
            pipMentalLoss: 20,
            normalMentalLoss: 15
        }
    },
    // Commute Messages - These were hardcoded in data.js applyCommuteEffects
    commute: {
        late: { energyLoss: 10, mentalLoss: 5, progressLoss: 5, pipScoreLoss: 10 }
    },
    // Phase 2: Financial Events
    utility_bill: {
        billAmount: 150,
        delay: { mentalPenalty: 10 }
    },
    phone_bill: {
        billAmount: 60,
        pay: { mentalCost: 0 } // placeholder if needed
    },
    credit_collapse: {
        accept: { mentalLoss: 30 },
        fix: { cost: 200, energyCost: 30, creditGain: 30, mentalLoss: 15 }
    },
    medical_debt: {
        collection: { installmentAmount: 100, energyCost: 10, refuseMentalLoss: 10, creditLoss: 10, refuseCreditLoss: 50, payCreditGain: 20, payMentalGain: 5, installmentMentalLoss: 20 },
        installment: { amount: 100, creditLoss: 20, mentalLoss: 15, interestRate: 0.1 }
    },
    fastfood_warning: {
        healthy: { moneyCost: 20, energyCost: 20, ingredientsGain: 3, ingredientsMax: 10, healthGain: 5 },
        ignore: { healthLoss: 20, mentalLoss: 20 }
    },
    apartment_accident: {
        insurance: { deductible: 250, notCoveredCost: 0, insuredMentalLoss: 10, uninsuredMentalLoss: 20 },
        unlucky: { cost: 700, mentalLoss: 15 }
    },

    // 交通意外配置
    traffic_accident: {
        chance: 0.05, // 5% 概率
        moneyCost: 500, // 维修费
        healthLoss: 10, // 轻伤
        mentalLoss: 20, // 惊吓/压力
        carBroken: true // 车辆损坏
    },

    // 医疗事件配置
    worsening_symptoms: {
        urgentCare: { healthGain: 25, oonMentalLoss: 20 },
        er: { healthSetTo: 80 }
    },
    medical_emergency: {
        er: { healthGain: 40, mentalLoss: 30 },
        stubborn: { healthLoss: 30, mentalGain: 10 }
    },
    surgery_required: {
        urgent: { baseCost: 1000, healthGain: 30, mentalLoss: 15 },
        wait: { healthLoss: 10, mentalLoss: 20, waitDaysMin: 2, waitDaysMax: 5, dailyHealthLoss: 4 },
        approval: { successChance: 0.6, successHealthGain: 30, failHealthGain: 30, failMentalLoss: 25, failCostMultiplier: 1.0 },
        fight: { cost: 20, healthLoss: 5, successChance: 60, failCost: 1000 }
    },

    cold_weather: {
        temp: -5,
        heat: { moneyCost: 80, energyCost: 5, mentalGain: 5, energyRecoveryTomorrow: 10 },
        wear: { moneyCost: 0, energyCost: 20, mentalLoss: 10, healthLoss: 20, energyRecoveryTomorrow: -30 },
        gym: { moneyCost: 20, energyCost: 20, energyRecoveryTomorrow: 10, healthGain: 0 }
    },

    // Mental Restoration Events
    mental_restoration: {
        psychotherapy: {
            costInsurance: 40,
            costNoInsurance: 200,
            energyCost: 30,
            maxMentalGain: 5, // Capped restoration
            mentalGain: 20
        },
        nature_retreat: {
            cost: 100,
            energyCost: 80,
            maxMentalGain: 2, // Nerfed from 10 per user feedback
            mentalGain: 30,
            healthGain: 5
        },
        meditation_insight: {
            maxMentalGain: 3
        },
        volunteer_work: {
            energyCost: 40,
            maxMentalGain: 2,
            socialGain: 10
        }
    },

    // Phase 2: Unemployment
    unemployment: {
        benefit: { amount: 400, weeks: 4 },
        payment: { amount: 400 }
    },
    // Phase 2: Daily Actions
    daily_actions: {
        buy_coffee: { cost: 6, energyGain: 10 },
        take_walk: { energyCost: 15, mentalGain: 2, healthGain: 2 },
        gossip: { energyCost: 10, socialGain: 5 },
        short_nap: { energyGain: 5 },
        teamwork: { energyCost: 15, socialGain: 3, workEfficiencyGain: 2 }
    },
    // Phase 3: Night & Special Events
    night_events: {
        homeless: {
            street: { mentalCost: 30, healthCost: 15, energyRecoveryTomorrow: -20 },
            shelter: { successChance: 0.5, failMentalCost: 30, failHealthCost: 20, successMentalCost: 15, successEnergyRecovery: 10, failEnergyRecovery: -40 }
        },
        car: {
            hide: { mentalCost: 30, energyRecoveryTomorrow: 10 },
            park_close: { kickOutChance: 0.3, kickOutMentalCost: 20, safeMentalCost: 10, kickOutEnergyRecovery: -20, safeEnergyRecovery: 10 }
        },
        hot_weather: {
            ac: { billCost: 50, mentalGain: 5, energyRecoveryTomorrow: 10 },
            fan: { billCost: 10, mentalCost: 5, energyRecoveryTomorrow: -20 },
            none: { mentalCost: 10, healthCost: 5, energyRecoveryTomorrow: -30 }
        },
        insomnia: {
            pills: { cost: 2, healthCost: 5, energyRecoveryTomorrow: -10 },
            phone: { mentalGain: 5, energyRecoveryTomorrow: -30 },
            meditate: { successChance: 0.5, mentalGain: 5, successEnergyRecovery: 10, failEnergyRecovery: -30 }
        },
        neighbor_noise: {
            complain: { successChance: 0.7, failMentalCost: 25, successEnergyRecovery: 10, failEnergyRecovery: -30 },
            early_plugs: { mentalCost: 0, energyRecoveryTomorrow: -40 },
            police: { socialCost: 10, energyRecoveryTomorrow: 0 }
        },
        craving: {
            order: { cost: 25, mentalGain: 10, healthCost: 3, energyRecoveryTomorrow: 0 },
            cook: { ingredientsCost: 1, energyCost: 0, healthGain: 5, energyRecoveryTomorrow: 0 },
            water: { mentalCost: 5, energyRecoveryTomorrow: 0 }
        },
        nightmare: {
            breathe: { failChance: 0.4, failMentalCost: 10, successEnergyRecovery: -10, failEnergyRecovery: -30 },
            get_up: { energyCost: 0, mentalGain: 5, energyRecoveryTomorrow: -30 }
        },
        loneliness: {
            contact: { cost: 20, socialGain: 15, mentalGain: 10, energyRecoveryTomorrow: -20 },
            social_media: { socialGain: 5, mentalCost: 5, energyRecoveryTomorrow: -10 },
            bear: { mentalCost: 20, energyRecoveryTomorrow: 0 }
        }
    },
    special_events: {
        boss_late: {
            reply: { socialGain: 3, mentalCost: 5, energyRecoveryTomorrow: -30 },
            ignore: { energyRecoveryTomorrow: 0 },
            prepare: { energyCost: 0, socialGain: 10, energyRecoveryTomorrow: -30 }
        },
        emergency_oon: {
            nearest: { oonChance: 0.6, mentalCost: 40, baseCost: 2000, healthGain: 25 },
            inNetwork: { healthLoss: 25, mentalLoss: 20, baseCost: 2000 }
        }
    },
    // Phase 4: Final Cleanup
    routine_events: {
        hospital_stay: {
            unpaid_leave: { baseRisk: 10 } // Hint uses 10, logic uses consecutiveUnpaidDays * 0.15
        },
        day_rest: {
            sleep: { energyGain: 30, healthGain: 5 },
            cook: { ingredientsCost: 1, healthGain: 5, mentalGain: 5 },
            shop: { cost: 30, energyCost: 30, ingredientsGain: 5 },
            delivery: { cost: 200, energyCost: 45 },
            walk: { cost: 20, mentalGain: 5, luckyMoney: 50, luckyChance: 0.2 },
            hangout: { cost: 30, energyCost: 45, socialGain: 5, mentalGain: 5 },
            deep_sleep: { healthMaxGain: 1, socialLoss: 5 },
            massage: { cost: 50, energyCost: 20, healthMaxGain: 3, healthGain: 10 }
        },
        day_jobless: {
            apply: { energyCost: 40, mentalLossFail: 20, successMod: 0.45 },
            relax: { mentalGain: 5, energyCost: 15 },
            learn: { energyCost: 50, mentalCost: 5, workEfficiencyGain: 2 },
            medicaid: { threshold: 500, waitMin: 7, waitMax: 14, energyCost: 30 }
        }
    },
    random_events_cleanup: {
        car_breakdown: {
            repair: {
                baseCost: 1200,
                coverageRates: { full_coverage: 0.6, liability: 0.4, none: 0 },
                mentalLoss: 10
            },
            credit: { creditScoreLoss: 30, mentalLoss: 15 },
            skip: { mentalLoss: 25 }
        },
        burglary: {
            report: { insuredDeductible: 250, uninsuredLoss: 2000, insuredMentalLoss: 15, uninsuredMentalLoss: 30 }
        },
        apartment_fire: {
            escape: { insuredDeductible: 250, uninsuredLoss: 5000, insuredMentalLoss: 40, uninsuredMentalLoss: 50, uninsuredHealthLoss: 10, rehousingType: 'cheapRoom' }
        },
        feeling_under_weather: {
            otc: { cost: 15, healthDiff: 5, failChance: 0.3 },
            ignore: { healthLoss: 20, mentalLoss: 20 }
        },
        rent_due: {
            // 房租到期 / 驱逐风险：扩展“主动退出”路径
            negotiate: { successChance: 0.5, creditLoss: 20, mentalLoss: 20 },
            moveOut: { mentalLoss: 30 },
            carDwelling: { mentalLoss: 15, creditLoss: 0 },
            homelessNow: { mentalLoss: 20, creditLoss: 5 }
        },
        friend_help: {
            accept: { moneyGain: 300, mentalGain: 15, mentalGainShelter: 25 },
            decline: { mentalGain: 5, socialGain: 5 }
        },
        sell_car_emergency: {
            sell: { moneyGain: 500, mentalLoss: 15 },
            keep: { mentalLoss: 20 }
        },
        buy_used_car: {
            deal: { cost: 800, mentalGain: 10 },
            ignore: { mentalGain: 0 }
        },
        mysterious_trader: {
            swap: { mentalGain: 5 },
            refuse: { mentalGain: 0 }
        },
        sell_artifact_crisis: {
            sell: { moneyGain: 500, mentalLoss: 30 },
            keep: { mentalGain: 5 }
        },
        black_market_artifact: {
            buy: { cost: 1000 },
            leave: { mentalGain: 0 }
        },
        // Social Events
        team_lunch: {
            join: { cost: 25, socialGain: 5, workEfficiencyGain: 1 },
            brown_bag: { ingredientsCost: 1, energyGain: 5, socialLoss: 2 }
        },
        after_work_drinks: {
            baseSuccessRate: 0.25,
            socialBonus: 0.003, // 0.3% per point
            efficiencyBonus: 0.002, // 0.2% per point
            network: { cost: 40, energyCost: 20, successWorkEfficiencyGain: 5, successMentalGain: 15, successSocialGain: 5, failMentalLoss: 10, failSocialLoss: 5 },
            go_home: { energyGain: 10, socialLoss: 2 }
        },
        industry_mixer: {
            baseSuccessRate: 0.20,
            efficiencyBonus: 0.005, // 0.5% per point
            network: { cost: 50, energyCost: 15, successSocialGain: 10, successMentalGain: 10, failMentalLoss: 5 },
            skip: {}
        },
        alumni_reunion: {
            baseSuccessRate: 0.20,
            socialBonus: 0.005, // 0.5% per point
            attend: { cost: 100, successMentalGain: 20, successSocialGain: 5, failMentalLoss: 10, failSocialLoss: 2 },
            ignore: { mentalLoss: 5 }
        },
    },
    financial_crisis: {
        rent_due: {
            debtThreshold: -500,
            evictionCreditLossMultiplier: 2,
            evictionThresholdMonths: 2
        },
        credit_collapse: {
            scoreThreshold: 450,
            fixMinDebt: -500
        }
    },
    probabilities: {
        burglary: { cheapRoom: 0.05, apartment: 0.02 },
        apartment_fire: 0.005,
        feeling_under_weather: 0.25,
        hot_weather: 0.15,
        insomnia: 0.15,
        neighbor_noise: 0.10,
        boss_late_message: 0.15,
        late_night_craving: 0.18,
        nightmare: 0.08,
        loneliness: 0.25,
        cold_weather: 0.18,
        credit_collapse_eviction: 0.3
    },
    night_events_recovery: {
        craving: { order: 50, cook: 50, water: 45 },
        nightmare: { sleepBad: 30, sleepTerrible: 15, distract: 25 },
        loneliness: { contact: 50, socialMedia: 35, bear: 25 }
    },
    lunch_mechanics: {
        business: { chance: 0.2 },
        salad: { soldOutChance: 0.3 },
        fastfood: { soldOutChance: 0.1 }
    },
    commute_mechanics: {
        car_repair: { fullCoverageCost: 500, outOfPocketCost: 1200 },
        car: { defaultCapacity: 4, defaultRefuelCost: 20 }
    },
    work_mechanics: {
        tenure: { newbieThreshold: 30, newbieAccrual: 20, seniorAccrual: 15 },
        focus_work: { failMentalLoss: 5 },
        slack_off: { caughtJobTenure: 1, successJobTenure: 1 }
    },
    night_choice_hints: {
        sleep: { energyRecoveryTomorrow: 30 },
        phone: { mentalGain: 5, energyRecoveryTomorrow: -30 },
        overtime: { money: 100, energyRecoveryTomorrow: -40, stress: 30 },
        entertainment: { money: 50, mental: 10, energyRecoveryTomorrow: -10 },
        prepareMeal: { cost: 1, energyRecoveryTomorrow: 20, mentalGain: 5 },
        grocery: { money: 20, ingredients: 3, energyRecoveryTomorrow: 10 },
        phone_social: { socialGain: 5, mentalGain: 5, energyRecoveryTomorrow: -20 }
    },
    // 社交值与工作效率影响裁员机制
    layoff_social_modifiers: {
        pip_trigger: {
            highSocialThreshold: 85,
            highSocialMod: 0.5,
            midSocialThreshold: 50,
            lowSocialThreshold: 30,
            lowSocialMod: 1.0,
            veryLowSocialMod: 2.0
        },
        pip_result: {
            efficiencyBonusPerPoint: 0.0075
        },
        sudden_layoff: {
            highSocialThreshold: 85,
            highSocialMod: 0.5,
            lowSocialThreshold: 30,
            lowSocialMod: 2.0,
            highEfficiencyThreshold: 120,
            highEfficiencyMod: 0.5,
            lowEfficiencyThreshold: 80,
            lowEfficiencyMod: 1.5
        },
        fight: {
            highSocialThreshold: 85,
            highSocialBonus: 0.15,
            midSocialThreshold: 50,
            midSocialBonus: 0.05,
            lowSocialThreshold: 30,
            lowSocialPenalty: -0.10
        }
    }
};
