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
        condition: (state) => state.day > GameData.newbieProtectionDays && state.hasCar && state.job === 'fulltime' && state.money < 5000,
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

                    if (planId === 'full_coverage') {
                        return { message: I18n.t('events.car_breakdown.messages.fullCoverage'), type: 'neutral' };
                    }
                    if (planId === 'liability') {
                        return { message: I18n.t('events.car_breakdown.messages.partialCoverage'), type: 'neutral' };
                    }
                    return { message: I18n.t('events.car_breakdown.messages.noFullCoverage'), type: 'negative' };
                }
            },
            {
                text: I18n.t('events.car_breakdown.choices.creditRepair.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.car_breakdown.repair;
                    const cost = getCarRepairCost(state);
                    const creditConf = GameData.eventConfigs.random_events_cleanup.car_breakdown.credit;
                    return I18n.t('events.car_breakdown.choices.creditRepair.hint', cost, creditConf.creditScoreLoss, creditConf.mentalLoss);
                },
                hintType: 'negative',
                condition: (state) => {
                    const cost = getCarRepairCost(state);
                    return state.money < cost && state.creditScore > 500;
                },
                effect: (state, context) => {
                    const creditConf = GameData.eventConfigs.random_events_cleanup.car_breakdown.credit;
                    const cost = getCarRepairCost(state);

                    state.money -= cost;
                    state.creditScore -= creditConf.creditScoreLoss;
                    state.mental -= creditConf.mentalLoss;
                    return { message: I18n.t('events.car_breakdown.messages.creditRepair'), type: 'negative' };
                }
            },
            {
                text: I18n.t('events.car_breakdown.choices.skip.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.car_breakdown.skip;
                    return I18n.t('events.car_breakdown.choices.skip.hint', conf.mentalLoss);
                },
                hintType: 'danger',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.car_breakdown.skip;
                    // V2.24 改为设置 carBroken 标记
                    state.carBroken = true;
                    state.mental -= conf.mentalLoss;
                    return {
                        message: I18n.t('events.car_breakdown.messages.skipRepair'),
                        type: 'negative'
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
        condition: (state, context) => state.insurance.hasRentersInsurance && state.day > GameData.newbieProtectionDays && (state.housing === 'apartment' || state.housing === 'cheapRoom') && context && context.rng && context.rng.random() < (state.housing === 'cheapRoom' ? GameData.eventConfigs.probabilities.burglary.cheapRoom : GameData.eventConfigs.probabilities.burglary.apartment),
        weight: GameData.eventWeights.burglary,
        choices: [
            {
                text: I18n.t('events.burglary.choices.report.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.burglary.report;
                    return I18n.t('events.burglary.choices.report.hintInsured', conf.insuredDeductible, conf.insuredMentalLoss);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.burglary.report;
                    const deductible = conf.insuredDeductible;
                    state.money -= deductible;
                    state.mental -= conf.insuredMentalLoss;
                    return {
                        message: I18n.t('events.burglary.messages.insured', deductible),
                        type: 'neutral'
                    };
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
        condition: (state, context) => state.insurance.hasRentersInsurance && state.day > GameData.newbieProtectionDays && (state.housing === 'apartment' || state.housing === 'cheapRoom') && context && context.rng && context.rng.random() < GameData.eventConfigs.probabilities.apartment_fire,
        weight: GameData.eventWeights.apartment_fire, // 罕见
        choices: [
            {
                text: I18n.t('events.apartment_fire.choices.escape.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.apartment_fire.escape;
                    return I18n.t('events.apartment_fire.choices.escape.hintInsured', conf.insuredDeductible, conf.insuredMentalLoss);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.apartment_fire.escape;
                    const deductible = conf.insuredDeductible;
                    state.money -= deductible;
                    state.mental -= conf.insuredMentalLoss;

                    const rehousingType = conf.rehousingType;
                    if (rehousingType && GameData.housingTypes[rehousingType]) {
                        state.housing = rehousingType;
                        state.housingCost = GameData.housingTypes[rehousingType].cost;
                        state.daysUntilRent = GameData.timeCycle.monthDays;
                    }

                    return {
                        message: I18n.t('events.apartment_fire.messages.insured', deductible),
                        type: 'neutral'
                    };
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
        condition: (state) => state.insurance.hasRentersInsurance && (state.housing === 'apartment' || state.housing === 'cheapRoom'),
        choices: [
            {
                text: I18n.t('events.apartment_accident.choices.insurance.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.apartment_accident.insurance;
                    return I18n.t(
                        'events.apartment_accident.choices.insurance.hint',
                        conf.deductible,
                        conf.insuredMentalLoss
                    );
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.apartment_accident.insurance;
                    state.money -= conf.deductible;
                    state.mental -= conf.insuredMentalLoss;
                    return { message: I18n.t('events.apartment_accident.messages.covered', conf.deductible), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.apartment_accident.choices.unlucky.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.apartment_accident.unlucky;
                    return I18n.t('events.apartment_accident.choices.unlucky.hint', conf.cost, conf.mentalLoss);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.apartment_accident.unlucky;
                    state.money -= conf.cost;
                    state.mental -= conf.mentalLoss;
                    return { message: I18n.t('events.apartment_accident.messages.unlucky', conf.cost), type: 'negative' };
                }
            }
        ]
    }
];
