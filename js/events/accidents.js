/**
 * Accident Events
 */
import { I18n } from '../i18n.js';
import { GameData } from '../data/index.js';

const getCarRepairCost = (state) => {
    const conf = GameData.eventConfigs.random_events_cleanup.car_breakdown.repair;
    const planId = state.insurance.carPlanId || 'none';
    const coverageRate = conf.coverageRates[planId] ?? conf.coverageRates.none;
    let cost = Math.round(conf.baseCost * (1 - coverageRate));

    // Actuary Glasses: 50% discount on repair
    if (state.artifacts && state.artifacts.includes('actuary_glasses')) {
        const discount = GameData.artifactConfig.actuary_glasses.carRepairDiscount || 0.5;
        cost = Math.round(cost * (1 - discount));
    }

    return cost;
};

export const accidentEvents = [
    {
        id: 'car_breakdown',
        type: 'accident',
        title: I18n.t('events.car_breakdown.title'),
        description: I18n.t('events.car_breakdown.description'),
        period: 'any',
        isRandom: true,
        condition: (state) => state.day > GameData.newbieProtectionDays && state.hasCar && !state.carBroken && state.job === 'fulltime' && state.money < 5000,
        weight: GameData.eventWeights.car_breakdown, // 危机事件，权重较高
        choices: [
            {
                text: I18n.t('events.car_breakdown.choices.repairNow.text'),
                // 动态提示费用
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.car_breakdown.repair;
                    const cost = getCarRepairCost(state);
                    const planId = state.insurance.carPlanId || 'none';
                    if (planId === 'full_coverage') return I18n.t('events.car_breakdown.choices.repairNow.hintFull', cost, conf.mentalLoss);
                    if (planId === 'liability') return I18n.t('events.car_breakdown.choices.repairNow.hintPartial', cost, conf.mentalLoss);
                    return I18n.t('events.car_breakdown.choices.repairNow.hintOther', cost, conf.mentalLoss);
                },
                hintType: 'negative',
                // 动态判断条件
                condition: (state) => {
                    const cost = getCarRepairCost(state);
                    return state.money >= cost;
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.car_breakdown.repair;
                    const planId = state.insurance.carPlanId || 'none';
                    const cost = getCarRepairCost(state);

                    state.money -= cost;
                    state.mental -= conf.mentalLoss;

                    // Recover risk
                    state.carRepairRisk = Math.max(0.1, (state.carRepairRisk || 0.1) - (conf.riskRecovery || 0.1));
                    const riskPercent = Math.round(state.carRepairRisk * 100);

                    if (planId === 'full_coverage') {
                        return { message: I18n.t('events.car_breakdown.messages.fullCoverage', riskPercent), type: 'neutral' };
                    }
                    if (planId === 'liability') {
                        return { message: I18n.t('events.car_breakdown.messages.partialCoverage', riskPercent), type: 'neutral' };
                    }
                    return { message: I18n.t('events.car_breakdown.messages.noFullCoverage', riskPercent), type: 'negative' };
                }
            },
            {
                text: I18n.t('events.car_breakdown.choices.selfRepair.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.car_breakdown.self_repair;
                    const risk = state.carRepairRisk || 0.1;
                    return I18n.t('events.car_breakdown.choices.selfRepair.hint', conf.cost, conf.energyCost, conf.mentalLoss, risk);
                },
                hintType: 'energy',
                // Always available, money can go negative
                condition: (state) => true,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.car_breakdown.self_repair;

                    state.money -= conf.cost; // Allow negative
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.mental -= conf.mentalLoss;

                    const currentRisk = state.carRepairRisk || 0.1;
                    const isLate = context.rng.random() < currentRisk;

                    // Increase risk for next time
                    state.carRepairRisk = Math.min(conf.riskMax || 0.5, currentRisk + (conf.riskIncrement || 0.1));
                    const newRiskPercent = Math.round(state.carRepairRisk * 100);

                    if (isLate) {
                        // Trigger late penalty
                        const lateConf = GameData.eventConfigs.commute.late;
                        state.energy = Math.max(0, state.energy - lateConf.energyLoss);
                        state.mental = Math.max(0, state.mental - lateConf.mentalLoss);
                        if (state.workTask) {
                            state.workTask.progress = Math.max(0, state.workTask.progress - lateConf.progressLoss);
                        }
                        if (state.pipActive) {
                            state.pipPerformanceScore = Math.max(0, (state.pipPerformanceScore || 50) - lateConf.pipScoreLoss);
                        }
                        return {
                            message: I18n.t('events.car_breakdown.messages.selfRepairLate', newRiskPercent),
                            type: 'negative'
                        };
                    }

                    return {
                        message: I18n.t('events.car_breakdown.messages.selfRepairSuccess', newRiskPercent),
                        type: 'neutral'
                    };
                }
            }
        ]
    },

    // V2.24 租客保险事件: 入室盗窃
    {
        id: 'burglary',
        type: 'accident',
        title: I18n.t('events.burglary.title'),
        description: I18n.t('events.burglary.description'),
        period: 'any',
        isRandom: true,
        // 只有公寓或廉价房会发生，廉价房概率更高
        condition: (state, context) => state.day > GameData.newbieProtectionDays && (state.housing === 'apartment' || state.housing === 'cheapRoom') && context && context.rng && context.rng.random() < (state.housing === 'cheapRoom' ? GameData.eventConfigs.probabilities.burglary.cheapRoom : GameData.eventConfigs.probabilities.burglary.apartment),
        weight: GameData.eventWeights.burglary,
        choices: [
            {
                text: I18n.t('events.burglary.choices.report.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.burglary.report;
                    if (state.insurance.hasRentersInsurance) {
                        return I18n.t('events.burglary.choices.report.hintInsured', conf.insuredDeductible, conf.insuredMentalLoss);
                    }
                    return I18n.t('events.burglary.choices.report.hintUninsured', conf.uninsuredLoss, conf.uninsuredMentalLoss);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.burglary.report;
                    if (state.insurance.hasRentersInsurance) {
                        const deductible = conf.insuredDeductible;
                        state.money -= deductible;
                        state.mental -= conf.insuredMentalLoss;
                        return {
                            message: I18n.t('events.burglary.messages.insured', deductible),
                            type: 'neutral'
                        };
                    } else {
                        const loss = conf.uninsuredLoss;
                        state.money -= loss;
                        state.mental -= conf.uninsuredMentalLoss;
                        return {
                            message: I18n.t('events.burglary.messages.uninsured', loss),
                            type: 'negative'
                        };
                    }
                }
            }
        ]
    },

    // V2.24 租客保险事件: 公寓火灾
    {
        id: 'apartment_fire',
        type: 'accident',
        title: I18n.t('events.apartment_fire.title'),
        description: I18n.t('events.apartment_fire.description'),
        period: 'night',
        isRandom: true,
        // 极低概率
        condition: (state, context) => state.day > GameData.newbieProtectionDays && (state.housing === 'apartment' || state.housing === 'cheapRoom') && context && context.rng && context.rng.random() < GameData.eventConfigs.probabilities.apartment_fire,
        weight: GameData.eventWeights.apartment_fire, // 罕见
        choices: [
            {
                text: I18n.t('events.apartment_fire.choices.escape.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.apartment_fire.escape;
                    if (state.insurance.hasRentersInsurance) {
                        return I18n.t('events.apartment_fire.choices.escape.hintInsured', conf.insuredDeductible, conf.insuredMentalLoss);
                    }
                    return I18n.t('events.apartment_fire.choices.escape.hintUninsured', conf.uninsuredLoss, conf.uninsuredMentalLoss);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.apartment_fire.escape;

                    if (state.insurance.hasRentersInsurance) {
                        const deductible = conf.insuredDeductible;
                        state.money -= deductible;
                        state.mental -= conf.insuredMentalLoss;
                    } else {
                        const loss = conf.uninsuredLoss;
                        state.money -= loss;
                        state.mental -= conf.uninsuredMentalLoss;
                        if (conf.uninsuredHealthLoss) {
                            state.health -= conf.uninsuredHealthLoss;
                        }
                    }

                    const rehousingType = conf.rehousingType;
                    if (rehousingType && GameData.housingTypes[rehousingType]) {
                        state.housing = rehousingType;
                        state.housingCost = GameData.housingTypes[rehousingType].cost;
                        state.daysUntilRent = GameData.timeCycle.monthDays;
                    }

                    if (state.insurance.hasRentersInsurance) {
                        return {
                            message: I18n.t('events.apartment_fire.messages.insured', conf.insuredDeductible),
                            type: 'neutral'
                        };
                    } else {
                        return {
                            message: I18n.t('events.apartment_fire.messages.uninsured', conf.uninsuredLoss),
                            type: 'negative'
                        };
                    }
                }
            }
        ]
    },

    // 公寓意外事件 (实装租客保险)
    {
        id: 'apartment_accident',
        type: 'accident',
        title: I18n.t('events.apartment_accident.title'),
        description: I18n.t('events.apartment_accident.description'),
        period: 'any',
        isRandom: true,
        weight: GameData.eventWeights.apartment_accident,
        condition: (state) => state.day > GameData.newbieProtectionDays && (state.housing === 'apartment' || state.housing === 'cheapRoom'),
        choices: [
            {
                text: I18n.t('events.apartment_accident.choices.repair.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.apartment_accident;
                    if (state.insurance.hasRentersInsurance) {
                        return I18n.t(
                            'events.apartment_accident.choices.repair.hintInsured',
                            conf.insurance.deductible,
                            conf.insurance.insuredMentalLoss
                        );
                    }
                    return I18n.t(
                        'events.apartment_accident.choices.repair.hintUninsured',
                        conf.unlucky.cost,
                        conf.unlucky.mentalLoss
                    );
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.apartment_accident;
                    if (state.insurance.hasRentersInsurance) {
                        state.money -= conf.insurance.deductible;
                        state.mental -= conf.insurance.insuredMentalLoss;
                        return { message: I18n.t('events.apartment_accident.messages.insured', conf.insurance.deductible), type: 'neutral' };
                    } else {
                        state.money -= conf.unlucky.cost;
                        state.mental -= conf.unlucky.mentalLoss;
                        return { message: I18n.t('events.apartment_accident.messages.uninsured', conf.unlucky.cost), type: 'negative' };
                    }
                }
            }
        ]
    }
];
