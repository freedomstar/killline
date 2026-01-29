/**
 * Health Related Events
 */
import { I18n } from '../i18n.js';
import { GameData } from '../data/index.js';

export const healthEvents = [
    // 1. 轻微不适 (Stage 1)
    {
        id: 'feeling_under_weather',
        type: 'health',
        title: I18n.t('events.feeling_under_weather.title'),
        description: I18n.t('events.feeling_under_weather.description'),
        period: 'any',
        condition: (state, context) => state.day > GameData.newbieProtectionDays && state.healthStatus === 'normal' && (state.energy < 30 || context.rng.random() < GameData.eventConfigs.probabilities.feeling_under_weather),
        weight: GameData.eventWeights.feeling_under_weather,
        isRandom: true,
        choices: [
            {
                text: I18n.t('events.feeling_under_weather.choices.clinic.text'),
                hint: (state) => {
                    const opt = GameData.medicalSystem.treatmentOptions.minuteClinic;
                    return I18n.t('events.feeling_under_weather.choices.clinic.hint', opt.baseCost, opt.effectiveness, opt.failHealthLoss);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const opt = GameData.medicalSystem.treatmentOptions.minuteClinic;
                    state.money -= opt.baseCost;

                    // 治疗效果
                    if (context.rng.random() < opt.risk) { // 误诊
                        state.health -= opt.failHealthLoss;
                        return { message: I18n.t('events.feeling_under_weather.messages.clinicFail'), type: 'negative' };
                    }

                    state.health = Math.min(GameData.initialState.maxHealth, state.health + opt.effectiveness);
                    return { message: I18n.t('events.feeling_under_weather.messages.clinicSuccess'), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.feeling_under_weather.choices.otc.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.feeling_under_weather.otc;
                    return I18n.t('events.feeling_under_weather.choices.otc.hint', conf.cost, conf.healthDiff);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.feeling_under_weather.otc;
                    state.money -= conf.cost;
                    if (context.rng.random() < conf.failChance) {
                        state.health -= conf.healthDiff;
                        return { message: I18n.t('events.feeling_under_weather.messages.otcFail'), type: 'negative' };
                    }
                    state.health += conf.healthDiff;
                    return { message: I18n.t('events.feeling_under_weather.messages.otcSuccess'), type: 'neutral' };
                }
            },
            {
                text: I18n.t('events.feeling_under_weather.choices.ignore.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.feeling_under_weather.ignore;
                    return I18n.t('events.feeling_under_weather.choices.ignore.hint', conf.healthLoss, conf.mentalLoss);
                },
                hintType: 'danger',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.feeling_under_weather.ignore;
                    state.health -= conf.healthLoss;
                    state.mental -= conf.mentalLoss;
                    return { message: I18n.t('events.feeling_under_weather.messages.ignore'), type: 'negative' };
                }
            }
        ]
    },

    // 2. 医疗紧急情况 (Stage 3)
    {
        id: 'medical_emergency',
        type: 'health',
        title: I18n.t('events.medical_emergency.title'),
        description: I18n.t('events.medical_emergency.description'),
        period: 'any',
        mandatory: true,
        condition: (state) => (state.health < 30 || state.healthStatus === 'critical') && (!state.hospitalDaysLeft || state.hospitalDaysLeft <= 0),
        weight: GameData.eventWeights.medical_emergency,
        choices: [
            {
                text: I18n.t('events.medical_emergency.choices.ambulance.text'),
                hint: (state) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    const emergConfig = GameData.healthConstants.medicalEmergency;
                    const erCost = GameData.medicalSystem.treatmentOptions.er.baseCost;
                    const totalBase = hospConfig.ambulanceCost + erCost;
                    const cost = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(totalBase, true).youPay : totalBase;
                    const delta = emergConfig.erHealthRecovery - (state.health || 0);
                    const signedDelta = delta > 0 ? `+${delta}` : `${delta}`;
                    return I18n.t('events.medical_emergency.choices.ambulance.hint', signedDelta, emergConfig.ambulanceMentalLoss, cost);
                },
                hintType: 'danger',
                effect: (state, context) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    const emergConfig = GameData.healthConstants.medicalEmergency;
                    const ambulanceCost = hospConfig.ambulanceCost;
                    const erCost = GameData.medicalSystem.treatmentOptions.er.baseCost;

                    const totalBase = ambulanceCost + erCost;
                    const result = context.game.calculateMedicalCost(totalBase, true);

                    state.money -= result.youPay;
                    state.health = emergConfig.erHealthRecovery;
                    state.mental -= emergConfig.ambulanceMentalLoss;

                    state.hospitalDaysLeft = Math.floor(context.rng.random() * (hospConfig.emergencyDaysMax - hospConfig.emergencyDaysMin + 1)) + hospConfig.emergencyDaysMin;
                    const dailyBase = hospConfig.dailyBaseCost;
                    const dailyResult = context.game.calculateMedicalCost(dailyBase, false);
                    state.hospitalDailyCost = dailyResult.youPay;

                    return { message: I18n.t('events.medical_emergency.messages.ambulanceSaved', result.youPay, state.hospitalDaysLeft), type: 'negative' };
                }
            },
            {
                text: I18n.t('events.medical_emergency.choices.uber.text'),
                hint: (state) => {
                    const emergConfig = GameData.healthConstants.medicalEmergency;
                    const erCost = GameData.medicalSystem.treatmentOptions.er.baseCost;
                    const erPay = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(erCost, true).youPay : erCost;
                    const totalCost = erPay + emergConfig.uberCost;
                    const delta = emergConfig.erHealthRecovery - (state.health || 0);
                    const signedDelta = delta > 0 ? `+${delta}` : `${delta}`;
                    return I18n.t('events.medical_emergency.choices.uber.hint', totalCost, Math.round(emergConfig.uberDeathChance * 100), signedDelta);
                },
                hintType: 'danger',
                effect: (state, context) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    const emergConfig = GameData.healthConstants.medicalEmergency;

                    if (context.rng.random() < emergConfig.uberDeathChance) {
                        state.health = 0;
                        return { message: I18n.t('events.medical_emergency.messages.uberDied'), type: 'negative' };
                    }

                    const erCost = GameData.medicalSystem.treatmentOptions.er.baseCost;
                    const result = context.game.calculateMedicalCost(erCost, true);

                    state.money -= result.youPay + emergConfig.uberCost;
                    state.health = emergConfig.erHealthRecovery;

                    state.hospitalDaysLeft = Math.floor(context.rng.random() * (hospConfig.emergencyDaysMax - hospConfig.emergencyDaysMin + 1)) + hospConfig.emergencyDaysMin;
                    const dailyBase = hospConfig.dailyBaseCost;
                    const dailyResult = context.game.calculateMedicalCost(dailyBase, false);
                    state.hospitalDailyCost = dailyResult.youPay;

                    return { message: I18n.t('events.medical_emergency.messages.uberSaved', result.youPay, state.hospitalDaysLeft), type: 'neutral' };
                }
            },
            {
                text: I18n.t('events.medical_emergency.choices.giveUp.text'),
                hint: (state) => I18n.t('events.medical_emergency.choices.giveUp.hint', state.health || 0),
                hintType: 'danger',
                effect: (state, context) => {
                    state.health = 0;
                    return { message: I18n.t('events.medical_emergency.messages.died'), type: 'negative' };
                }
            }
        ]
    },

    // V2.6 保险拒赔事件
    {
        id: 'emergency_oon',
        type: 'health',
        title: I18n.t('events.emergency_oon.title'),
        description: I18n.t('events.emergency_oon.description'),
        period: 'any',
        weight: GameData.eventWeights.emergency_oon,
        energyCost: 0,
        condition: (state) => state.health < 40 && state.insurance.healthPlanId !== 'none',
        choices: [
            {
                text: I18n.t('events.emergency_oon.choices.nearest.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.special_events.emergency_oon.nearest;
                    const oonCost = Math.round(conf.baseCost * 0.8);
                    const inNetworkCost = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(conf.baseCost).youPay : conf.baseCost;
                    return I18n.t('events.emergency_oon.choices.nearest.hint', conf.oonChance * 100, conf.healthGain, conf.mentalCost, oonCost, inNetworkCost);
                },
                hintType: 'negative',
                condition: (state) => true,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.special_events.emergency_oon.nearest;
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);
                    if (context.rng.random() < conf.oonChance) {
                        const oonCost = Math.round(conf.baseCost * 0.8);
                        state.money -= oonCost;
                        state.mental -= conf.mentalCost;
                        return { message: I18n.t('events.emergency_oon.messages.oon', oonCost), type: 'negative' };
                    } else {
                        const result = context.game.calculateMedicalCost(conf.baseCost);
                        state.money -= result.youPay;
                        return { message: I18n.t('events.emergency_oon.messages.network', result.youPay), type: 'positive' };
                    }
                }
            },
            {
                text: I18n.t('events.emergency_oon.choices.inNetwork.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.special_events.emergency_oon.inNetwork;
                    const cost = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(conf.baseCost).youPay : conf.baseCost;
                    return I18n.t('events.emergency_oon.choices.inNetwork.hint', conf.healthLoss, conf.mentalLoss, cost);
                },
                hintType: 'negative',
                condition: (state) => true,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.special_events.emergency_oon.inNetwork;
                    state.health = Math.max(0, state.health - conf.healthLoss);
                    state.mental -= conf.mentalLoss;
                    const result = context.game.calculateMedicalCost(conf.baseCost);
                    state.money -= result.youPay;
                    return { message: I18n.t('events.emergency_oon.messages.delay', result.youPay), type: 'negative' };
                }
            }
        ]
    },

    {
        id: 'surgery_required',
        type: 'health',
        title: I18n.t('events.surgery_required.title'),
        description: I18n.t('events.surgery_required.description'),
        period: 'any',
        weight: GameData.eventWeights.surgery_required,
        energyCost: 0,
        condition: (state) => state.health < 50 && state.insurance.healthPlanId !== 'none',
        choices: [
            {
                text: I18n.t('events.surgery_required.choices.urgent.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.surgery_required.urgent;
                    const cost = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(conf.baseCost).youPay : conf.baseCost;
                    return I18n.t('events.surgery_required.choices.urgent.hint', cost, conf.healthGain, conf.mentalLoss);
                },
                hintType: 'negative',
                condition: (state) => true,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.surgery_required.urgent;
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);
                    const result = context.game.calculateMedicalCost(conf.baseCost);
                    state.money -= result.youPay;
                    state.mental -= conf.mentalLoss;
                    return { message: I18n.t('events.surgery_required.messages.denied', result.youPay), type: 'negative' };
                }
            },
            {
                text: I18n.t('events.surgery_required.choices.wait.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.surgery_required.wait;
                    return I18n.t('events.surgery_required.choices.wait.hint', conf.healthLoss, conf.mentalLoss, conf.waitDaysMin, conf.waitDaysMax);
                },
                hintType: 'neutral',
                condition: (state) => true,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.surgery_required.wait;
                    state.health = Math.max(0, state.health - conf.healthLoss);
                    state.mental -= conf.mentalLoss;
                    state.surgeryApprovalDaysLeft = Math.floor(context.rng.random() * (conf.waitDaysMax - conf.waitDaysMin + 1)) + conf.waitDaysMin;
                    state.surgeryApprovalPending = false;
                    return { message: I18n.t('events.surgery_required.messages.wait', state.surgeryApprovalDaysLeft), type: 'neutral' };
                }
            },
            {
                text: I18n.t('events.surgery_required.choices.fight.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.surgery_required.fight;
                    const urgentConf = GameData.eventConfigs.surgery_required.urgent;
                    const successCost = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(urgentConf.baseCost).youPay : urgentConf.baseCost;
                    const failCost = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(conf.failCost).youPay : conf.failCost;
                    return I18n.t('events.surgery_required.choices.fight.hint', conf.cost, conf.healthLoss, conf.successChance, successCost, failCost);
                },
                hintType: 'neutral',
                condition: (state) => state.mental >= 40,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.surgery_required.fight;
                    state.mental -= conf.cost;
                    state.health -= conf.healthLoss;

                    if (context.rng.random() < (conf.successChance / 100)) {
                        const urgentConf = GameData.eventConfigs.surgery_required.urgent;
                        const result = context.game.calculateMedicalCost(urgentConf.baseCost);
                        state.money -= result.youPay;
                        return { message: I18n.t('events.surgery_required.messages.fightSuccess', result.youPay), type: 'positive' };
                    } else {
                        const result = context.game.calculateMedicalCost(conf.failCost);
                        state.money -= result.youPay;
                        return { message: I18n.t('events.surgery_required.messages.fightFail', result.youPay), type: 'negative' };
                    }
                }
            }
        ]
    },

    {
        id: 'surgery_approval',
        type: 'health',
        title: I18n.t('events.surgery_approval.title'),
        description: I18n.t('events.surgery_approval.description'),
        period: 'day',
        condition: (state) => state.surgeryApprovalPending,
        weight: GameData.eventWeights.surgery_approval,
        mandatory: true,
        allowQueue: true,
        choices: [
            {
                text: I18n.t('events.surgery_approval.choices.check.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.surgery_required.approval;
                    return I18n.t(
                        'events.surgery_approval.choices.check.hint',
                        Math.round(conf.successChance * 100),
                        conf.successHealthGain,
                        conf.failHealthGain,
                        conf.failMentalLoss
                    );
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.surgery_required.approval;
                    const urgentConf = GameData.eventConfigs.surgery_required.urgent;
                    state.surgeryApprovalPending = false;
                    state.surgeryApprovalDaysLeft = 0;

                    if (context.rng.random() < conf.successChance) {
                        const result = context.game.calculateMedicalCost(urgentConf.baseCost);
                        state.money -= result.youPay;
                        state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.successHealthGain);
                        return { message: I18n.t('events.surgery_approval.messages.approved', result.youPay, conf.successHealthGain), type: 'positive' };
                    }

                    const failCost = Math.round(urgentConf.baseCost * conf.failCostMultiplier);
                    const failResult = context.game.calculateMedicalCost(failCost);
                    state.money -= failResult.youPay;
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.failHealthGain);
                    state.mental = Math.max(0, state.mental - conf.failMentalLoss);
                    return { message: I18n.t('events.surgery_approval.messages.denied', failResult.youPay, conf.failHealthGain, conf.failMentalLoss), type: 'negative' };
                }
            }
        ]
    },

    // 连续快餐惩罚
    {
        id: 'fastfood_warning',
        type: 'health',
        title: I18n.t('events.fastfood_warning.title'),
        description: (state) => I18n.t('events.fastfood_warning.description', state.consecutiveFastFood),
        period: 'day',
        weight: GameData.eventWeights.fastfood_warning,
        condition: (state) => state.consecutiveFastFood >= 3,
        isRandom: true,
        choices: [
            {
                text: I18n.t('events.fastfood_warning.choices.healthy.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.fastfood_warning.healthy;
                    return I18n.t('events.fastfood_warning.choices.healthy.hint', conf.moneyCost, conf.healthGain, conf.ingredientsGain);
                },
                hintType: 'positive',
                condition: (state) => {
                    const conf = GameData.eventConfigs.fastfood_warning.healthy;
                    return state.money >= conf.moneyCost;
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.fastfood_warning.healthy;
                    state.money -= conf.moneyCost;
                    state.consecutiveFastFood = 0;
                    state.ingredients = Math.min(conf.ingredientsMax, state.ingredients + conf.ingredientsGain);
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);
                    return { message: I18n.t('events.fastfood_warning.messages.healthy'), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.fastfood_warning.choices.ignore.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.fastfood_warning.ignore;
                    return I18n.t('events.fastfood_warning.choices.ignore.hint', conf.healthLoss, conf.mentalLoss);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.fastfood_warning.ignore;
                    state.health = Math.max(0, state.health - conf.healthLoss);
                    state.mental = Math.max(0, state.mental - conf.mentalLoss);
                    return { message: I18n.t('events.fastfood_warning.messages.ignore'), type: 'negative' };
                }
            }
        ]
    },

    // 医疗债务催收
    {
        id: 'medical_debt_collection',
        type: 'bill',
        title: I18n.t('events.medical_debt_collection.title'),
        description: (state) => I18n.t('events.medical_debt_collection.description', state.medicalDebt),
        period: 'any',
        weight: GameData.eventWeights.medical_debt_collection,
        condition: (state) => state.medicalDebt >= 500,
        isRandom: true,
        choices: [
            {
                text: I18n.t('events.medical_debt_collection.choices.pay.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.medical_debt.collection;
                    return I18n.t('events.medical_debt_collection.choices.pay.hint', state.medicalDebt, conf.payCreditGain, conf.payMentalGain);
                },
                hintType: 'negative',
                condition: (state) => state.money >= state.medicalDebt,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.medical_debt.collection;
                    const debt = state.medicalDebt;
                    state.money -= debt;
                    state.medicalDebt = 0;
                    state.creditScore = Math.min(850, state.creditScore + conf.payCreditGain);
                    state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.payMentalGain);
                    return { message: I18n.t('events.medical_debt_collection.messages.paid', debt), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.medical_debt_collection.choices.installment.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.medical_debt.collection;
                    return I18n.t('events.medical_debt_collection.choices.installment.hint', conf.installmentAmount, conf.creditLoss, conf.installmentMentalLoss);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.medical_debt.collection;
                    state.medicalDebtInstallment = true;
                    state.creditScore = Math.max(300, state.creditScore - conf.creditLoss);
                    state.mental -= conf.installmentMentalLoss;
                    return { message: I18n.t('events.medical_debt_collection.messages.installment', conf.installmentAmount), type: 'neutral' };
                }
            },
            {
                text: I18n.t('events.medical_debt_collection.choices.refuse.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.medical_debt.collection;
                    return I18n.t('events.medical_debt_collection.choices.refuse.hint', conf.refuseCreditLoss, conf.refuseMentalLoss);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.medical_debt.collection;
                    state.creditScore = Math.max(300, state.creditScore - conf.refuseCreditLoss);
                    state.mental -= conf.refuseMentalLoss;
                    return { message: I18n.t('events.medical_debt_collection.messages.refused'), type: 'negative' };
                }
            }
        ]
    },

    // 医疗债务分期还款
    {
        id: 'medical_debt_installment',
        type: 'bill',
        title: I18n.t('events.medical_debt_installment.title'),
        description: I18n.t('events.medical_debt_installment.description'),
        period: 'day',
        weight: GameData.eventWeights.medical_debt_installment,
        condition: (state) => state.medicalDebtInstallment && state.medicalDebt > 0 && state.day % GameData.timeCycle.monthDays === 0,
        isRandom: true,
        choices: [
            {
                text: (state) => {
                    const conf = GameData.eventConfigs.medical_debt.installment;
                    return I18n.t('events.medical_debt_installment.choices.pay.text', conf.amount);
                },
                hint: (state) => {
                    const conf = GameData.eventConfigs.medical_debt.installment;
                    return I18n.t('events.medical_debt_installment.choices.pay.hint', conf.amount, Math.max(0, state.medicalDebt - conf.amount));
                },
                hintType: 'neutral',
                condition: (state) => {
                    const conf = GameData.eventConfigs.medical_debt.installment;
                    return state.money >= conf.amount;
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.medical_debt.installment;
                    state.money -= conf.amount;
                    state.medicalDebt = Math.max(0, state.medicalDebt - conf.amount);
                    if (state.medicalDebt <= 0) {
                        state.medicalDebtInstallment = false;
                        return { message: I18n.t('events.medical_debt_installment.messages.paidFinished'), type: 'positive' };
                    }
                    return { message: I18n.t('events.medical_debt_installment.messages.paid', conf.amount, state.medicalDebt), type: 'neutral' };
                }
            },
            {
                text: I18n.t('events.medical_debt_installment.choices.cantPay.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.medical_debt.installment;
                    return I18n.t('events.medical_debt_installment.choices.cantPay.hint', conf.creditLoss, conf.mentalLoss);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.medical_debt.installment;
                    state.creditScore = Math.max(300, state.creditScore - conf.creditLoss);
                    state.mental -= conf.mentalLoss;
                    const interest = Math.round(state.medicalDebt * conf.interestRate);
                    state.medicalDebt += interest;
                    return { message: I18n.t('events.medical_debt_installment.messages.cantPay', state.medicalDebt), type: 'negative' };
                }
            }
        ]
    }
];
