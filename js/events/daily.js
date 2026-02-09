/**
 * Daily Routine Events & Mechanics
 */
import { I18n } from '../i18n.js';
import { GameData } from '../data/index.js';

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

export const dailyEvents = [
    // ============ V2.3 白天工作事件（非休息日）============
    {
        id: 'day_work',
        type: 'work',
        title: I18n.t('events.day_work.title'),
        description: I18n.t('events.day_work.description'),
        period: 'day',
        condition: (state) => state.job === 'fulltime' && state.day % GameData.timeCycle.weekDays !== GameData.timeCycle.restDayMod && (!state.hospitalDaysLeft || state.hospitalDaysLeft <= 0),
        weight: GameData.eventWeights.day_work,
        energyCost: GameData.eventConfigs.work_general.focus_work.energyCost,
        choices: [] // Dynamically generated
    },

    // ============ V2.3 休息日事件 ============
    {
        id: 'day_rest',
        type: 'daily',
        title: I18n.t('events.day_rest.title'),
        description: I18n.t('events.day_rest.description'),
        period: 'day',
        condition: (state) => state.day % GameData.timeCycle.weekDays === GameData.timeCycle.restDayMod && state.job !== 'unemployed' && (!state.hospitalDaysLeft || state.hospitalDaysLeft <= 0),
        weight: GameData.eventWeights.day_rest,
        choices: [
            {
                id: 'sleep',
                text: I18n.t('events.day_rest.choices.sleep.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.sleep;
                    return I18n.t('events.day_rest.choices.sleep.hint', conf.energyGain, conf.healthGain);
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.sleep;
                    state.energy = Math.min(GameData.initialState.maxEnergy, state.energy + conf.energyGain);
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);
                    return { message: I18n.t('events.day_rest.messages.sleep'), type: 'positive', ignoreLunch: true };
                }
            },
            {
                id: 'cook',
                text: I18n.t('events.day_rest.choices.cook.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.cook;
                    return I18n.t('events.day_rest.choices.cook.hint', conf.ingredientsCost, conf.healthGain, conf.mentalGain);
                },
                hintType: 'positive',
                condition: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.cook;
                    return (state.ingredients || 0) >= conf.ingredientsCost;
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.cook;
                    state.ingredients -= conf.ingredientsCost;
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);
                    state.mental = Math.min(state.maxMental || 100, state.mental + conf.mentalGain);
                    return { message: I18n.t('events.day_rest.messages.cook'), type: 'positive', ignoreLunch: true };
                }
            },
            {
                id: 'grocery',
                text: I18n.t('events.day_rest.choices.grocery.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.shop;
                    return I18n.t('events.day_rest.choices.grocery.hint', conf.cost, conf.ingredientsGain);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.shop;
                    if (context.game && context.game.deductMoney) {
                        context.game.deductMoney(conf.cost, 'daily');
                    } else {
                        state.money -= conf.cost;
                    }
                    state.ingredients = Math.min(10, (state.ingredients || 0) + conf.ingredientsGain);
                    return { message: I18n.t('events.day_rest.messages.grocery'), type: 'neutral' };
                }
            },
            {
                id: 'gig',
                text: I18n.t('events.day_rest.choices.gig.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.delivery;
                    return I18n.t('events.day_rest.choices.gig.hint', conf.cost, conf.energyCost);
                },
                hintType: 'energy',
                energyCost: GameData.eventConfigs.routine_events.day_rest.delivery.energyCost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.delivery;
                    state.money += conf.cost;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    return { message: I18n.t('events.day_rest.messages.gig', conf.cost), type: 'neutral' };
                }
            },
            {
                id: 'walk',
                text: I18n.t('events.day_rest.choices.walk.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.walk;
                    return I18n.t('events.day_rest.choices.walk.hint', conf.cost, conf.mentalGain, Math.round(conf.luckyChance * 100), conf.luckyMoney);
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.walk;
                    state.mental = Math.min(state.maxMental || 100, state.mental + conf.mentalGain);
                    if (context.game && context.game.deductMoney) {
                        context.game.deductMoney(conf.cost, 'daily');
                    } else {
                        state.money -= conf.cost;
                    }
                    if (context.rng.random() < conf.luckyChance) {
                        state.money += conf.luckyMoney;
                        return { message: I18n.t('events.day_rest.messages.walkLucky', conf.luckyMoney), type: 'positive' };
                    }
                    return { message: I18n.t('events.day_rest.messages.walk'), type: 'positive' };
                }
            },
            {
                id: 'hangout',
                text: I18n.t('events.day_rest.choices.hangout.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.hangout;
                    return I18n.t('events.day_rest.choices.hangout.hint', conf.cost, conf.energyCost, conf.socialGain, conf.mentalGain);
                },
                hintType: 'positive',
                energyCost: GameData.eventConfigs.routine_events.day_rest.hangout.energyCost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.hangout;
                    if (context.game && context.game.deductMoney) {
                        context.game.deductMoney(conf.cost, 'daily');
                    } else {
                        state.money -= conf.cost;
                    }
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
                    state.mental = Math.min(state.maxMental || 100, state.mental + conf.mentalGain);
                    return { message: I18n.t('events.day_rest.messages.hangout'), type: 'positive' };
                }
            },
            {
                id: 'deep_sleep',
                text: I18n.t('events.day_rest.choices.deep_sleep.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.deep_sleep;
                    return I18n.t('events.day_rest.choices.deep_sleep.hint', conf.socialLoss);
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.deep_sleep;
                    state.energy = GameData.initialState.maxEnergy;

                    state.maxHealth = Math.min(GameData.initialState.maxHealth, (state.maxHealth || 100) + conf.healthMaxGain);

                    state.socialValue = Math.max(0, (state.socialValue || 0) - conf.socialLoss);

                    return { message: I18n.t('events.day_rest.messages.deep_sleep'), type: 'positive', ignoreLunch: true };
                }
            },
            {
                id: 'massage',
                text: I18n.t('events.day_rest.choices.massage.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.massage;
                    return I18n.t('events.day_rest.choices.massage.hint', conf.cost, conf.healthGain, conf.healthMaxGain, conf.energyCost);
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.routine_events.day_rest.massage;

                    if (context.game && context.game.deductMoney) {
                        context.game.deductMoney(conf.cost, 'daily');
                    } else {
                        state.money -= conf.cost;
                    }

                    state.energy = Math.max(0, state.energy - conf.energyCost);

                    state.maxHealth = Math.min(GameData.initialState.maxHealth, (state.maxHealth || 100) + conf.healthMaxGain);

                    state.health = Math.min(state.maxHealth, state.health + conf.healthGain);

                    return { message: I18n.t('events.day_rest.messages.massage'), type: 'positive', ignoreLunch: true };
                }
            },
            // Mental Restoration Options
            {
                id: 'psychotherapy',
                text: I18n.t('data.mental_restoration.psychotherapy.title'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.mental_restoration.psychotherapy;
                    const insuranceCovered = state.insurance && state.insurance.healthPlanId !== 'none';
                    const cost = insuranceCovered ? conf.costInsurance : conf.costNoInsurance;
                    return I18n.t('data.mental_restoration.psychotherapy.hint', cost, conf.maxMentalGain, conf.mentalGain);
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.mental_restoration.psychotherapy;
                    const insuranceCovered = state.insurance && state.insurance.healthPlanId !== 'none';
                    const cost = insuranceCovered ? conf.costInsurance : conf.costNoInsurance;

                    if (context.game && context.game.deductMoney) {
                        context.game.deductMoney(cost, 'medical');
                    } else {
                        state.money -= cost;
                    }
                    state.energy = Math.max(0, state.energy - conf.energyCost);

                    const oldMax = state.maxMental;
                    state.maxMental = Math.min(GameData.initialState.maxMental, state.maxMental + conf.maxMentalGain);
                    const maxGain = state.maxMental - oldMax;
                    state.mental = Math.min(state.maxMental, state.mental + conf.mentalGain);

                    return { message: I18n.t('data.mental_restoration.psychotherapy.messages.success', maxGain), type: 'positive', ignoreLunch: true };
                }
            },
            {
                id: 'nature_retreat',
                text: I18n.t('data.mental_restoration.nature_retreat.title'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.mental_restoration.nature_retreat;
                    return I18n.t('data.mental_restoration.nature_retreat.hint', conf.cost, conf.energyCost, conf.maxMentalGain, conf.mentalGain);
                },
                hintType: 'positive',
                // Weekends only
                condition: (state) => state.energy >= GameData.eventConfigs.mental_restoration.nature_retreat.energyCost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.mental_restoration.nature_retreat;
                    if (context.game && context.game.deductMoney) {
                        context.game.deductMoney(conf.cost, 'daily');
                    } else {
                        state.money -= conf.cost;
                    }

                    state.energy = Math.max(0, state.energy - conf.energyCost);

                    const oldMax = state.maxMental;
                    state.maxMental = Math.min(GameData.initialState.maxMental, state.maxMental + conf.maxMentalGain);
                    const maxGain = state.maxMental - oldMax;

                    state.mental = Math.min(state.maxMental, state.mental + conf.mentalGain);
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);

                    return { message: I18n.t('data.mental_restoration.nature_retreat.messages.success', maxGain), type: 'positive', ignoreLunch: true };
                }
            },
            {
                id: 'volunteer_work',
                text: I18n.t('data.mental_restoration.volunteer_work.title'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.mental_restoration.volunteer_work;
                    return I18n.t('data.mental_restoration.volunteer_work.hint', conf.energyCost, conf.maxMentalGain, conf.socialGain);
                },
                hintType: 'social',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.mental_restoration.volunteer_work;
                    state.energy = Math.max(0, state.energy - conf.energyCost);

                    const oldMax = state.maxMental;
                    state.maxMental = Math.min(GameData.initialState.maxMental, state.maxMental + conf.maxMentalGain);
                    const maxGain = state.maxMental - oldMax;

                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);

                    return { message: I18n.t('data.mental_restoration.volunteer_work.messages.success', maxGain), type: 'positive', ignoreLunch: true };
                }
            }
        ]
    },

    {
        id: 'day_jobless',
        type: 'opportunity',
        title: I18n.t('events.day_jobless.title'),
        description: I18n.t('events.day_jobless.description'),
        period: 'day',
        condition: (state) => (state.job === 'unemployed' || state.job === 'fired') && (!state.hospitalDaysLeft || state.hospitalDaysLeft <= 0),
        weight: GameData.eventWeights.day_jobless,
        choices: [
            {
                text: I18n.t('events.day_jobless.choices.apply.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_jobless.apply;
                    const interviewConf = GameData.eventConfigs.afternoon_interview.tryHard;
                    // 工作能力影响简历通过率
                    const efficiency = state.workEfficiency || 100;
                    const efficiencyBonus = (efficiency - 100) * interviewConf.efficiencyBonusPerPoint;
                    const baseRate = conf.successMod + efficiencyBonus;
                    const finalRate = Math.max(0.1, Math.min(0.6, baseRate));
                    return I18n.t('events.day_jobless.choices.apply.hint', conf.energyCost, Math.round(finalRate * 100), conf.mentalLossFail);
                },
                hintType: 'energy',
                energyCost: GameData.eventConfigs.routine_events.day_jobless.apply.energyCost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.routine_events.day_jobless.apply;
                    const interviewConf = GameData.eventConfigs.afternoon_interview.tryHard;
                    state.energy = Math.max(0, state.energy - conf.energyCost);

                    const successRate = context.successRate || 0.5;
                    // 工作能力影响简历通过率
                    const efficiency = state.workEfficiency || 100;
                    const efficiencyBonus = (efficiency - 100) * interviewConf.efficiencyBonusPerPoint;
                    const baseRate = conf.successMod + efficiencyBonus;
                    const finalRate = Math.max(0.1, Math.min(0.6, baseRate));

                    if (context.rng.random() < successRate * finalRate) {
                        return {
                            message: I18n.t('events.day_jobless.messages.applySuccess'),
                            type: 'positive',
                            triggerEvent: 'afternoon_interview'
                        };
                    }
                    state.mental -= conf.mentalLossFail;
                    return { message: I18n.t('events.day_jobless.messages.applyFail'), type: 'negative' };
                }
            },
            {
                text: I18n.t('events.day_jobless.choices.relax.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_jobless.relax;
                    return I18n.t('events.day_jobless.choices.relax.hint', conf.mentalGain);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.routine_events.day_jobless.relax;
                    state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.mentalGain);
                    return { message: I18n.t('events.day_jobless.messages.relax'), type: 'neutral' };
                }
            },
            {
                text: I18n.t('events.day_jobless.choices.learn.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_jobless.learn;
                    return I18n.t('events.day_jobless.choices.learn.hint', conf.energyCost, conf.mentalCost, conf.workEfficiencyGain);
                },
                hintType: 'energy',
                energyCost: GameData.eventConfigs.routine_events.day_jobless.learn.energyCost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.routine_events.day_jobless.learn;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.mental -= conf.mentalCost;
                    state.workEfficiency = Math.min(GameData.initialState.maxWorkEfficiency, (state.workEfficiency || 100) + conf.workEfficiencyGain);
                    return { message: I18n.t('events.day_jobless.messages.learn'), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.day_jobless.choices.medicaid.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_jobless.medicaid;
                    return I18n.t('events.day_jobless.choices.medicaid.hint', conf.threshold, conf.energyCost);
                },
                hintType: 'neutral',
                energyCost: GameData.eventConfigs.routine_events.day_jobless.medicaid.energyCost,
                condition: (state) => {
                    const conf = GameData.eventConfigs.routine_events.day_jobless.medicaid;
                    return !state.insurance.medicaidApplicationDays && state.insurance.healthPlanId !== 'medicaid' && !state.insurance.deniedMedicaid && state.money < conf.threshold;
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.routine_events.day_jobless.medicaid;
                    state.energy = Math.max(0, state.energy - conf.energyCost);

                    if (state.money > conf.threshold) {
                        return { message: I18n.t('events.day_jobless.messages.medicaidTooRich', conf.threshold), type: 'negative' };
                    }

                    state.insurance.medicaidApplicationDays = 7;
                    return { message: I18n.t('events.day_jobless.messages.medicaidApplied', conf.waitMin, conf.waitMax), type: 'neutral' };
                }
            },
        ]
    },



    {
        id: 'afternoon_interview',
        type: 'opportunity',
        title: I18n.t('events.afternoon_interview.title'),
        description: I18n.t('events.afternoon_interview.description'),
        period: 'day',
        condition: (state) => (state.job === 'unemployed' || state.job === 'fired') && (!state.hospitalDaysLeft || state.hospitalDaysLeft <= 0),
        weight: GameData.eventWeights.afternoon_interview,
        choices: [
            {
                text: I18n.t('events.afternoon_interview.choices.tryHard.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.afternoon_interview.tryHard;

                    if (state.housing === 'homeless') {
                        return I18n.t('events.afternoon_interview.choices.tryHard.hint_homeless', conf.energyCost);
                    }

                    const energyConf = GameData.energyConfig;
                    let energyRate = 1.0;
                    // if (state.energy < energyConf.lowEnergyThreshold) {
                    //     energyRate -= energyConf.lowEnergyPenalty;
                    // }
                    energyRate = Math.max(0.1, energyRate);

                    const efficiency = state.workEfficiency || 100;
                    const efficiencyBonus = (efficiency - 100) * conf.efficiencyBonusPerPoint;
                    const baseRate = Math.min(conf.maxSuccessRate, Math.max(conf.minSuccessRate, conf.baseSuccessRate + efficiencyBonus));

                    let effectiveRate = baseRate * energyRate;
                    if (state.housing === 'car') effectiveRate *= 0.5;

                    const social = state.socialValue || 50;
                    let socialBonus = 0;
                    if (social >= 70) socialBonus = conf.socialBonusHigh;
                    else if (social >= 50) socialBonus = conf.socialBonusMid;
                    else if (social < 30) socialBonus = conf.socialBonusLow;

                    const finalRate = Math.min(conf.maxSuccessRate, Math.max(conf.minSuccessRate, effectiveRate + socialBonus));

                    return I18n.t(
                        'events.afternoon_interview.choices.tryHard.hint',
                        conf.energyCost,
                        Math.round(finalRate * 100),
                        conf.mentalGainSuccess,
                        conf.mentalLossFail
                    );
                },
                hintType: 'energy',
                energyCost: GameData.eventConfigs.afternoon_interview.tryHard.energyCost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.afternoon_interview.tryHard;
                    state.energy = Math.max(0, state.energy - conf.energyCost);

                    if (state.housing === 'homeless') {
                        return { message: I18n.t('events.afternoon_interview.messages.homelessReject'), type: 'negative' };
                    }

                    const successRate = context.successRate || 0.5;
                    const efficiency = state.workEfficiency || 100;
                    const efficiencyBonus = (efficiency - 100) * conf.efficiencyBonusPerPoint;
                    const baseRate = Math.min(conf.maxSuccessRate, Math.max(conf.minSuccessRate, conf.baseSuccessRate + efficiencyBonus));
                    let effectiveRate = baseRate * successRate;
                    if (state.housing === 'car') effectiveRate *= 0.5;

                    const social = state.socialValue || 50;
                    let socialBonus = 0;
                    if (social >= 70) socialBonus = conf.socialBonusHigh;
                    else if (social >= 50) socialBonus = conf.socialBonusMid;
                    else if (social < 30) socialBonus = conf.socialBonusLow;

                    const finalRate = Math.min(conf.maxSuccessRate, Math.max(conf.minSuccessRate, effectiveRate + socialBonus));
                    if (context.rng.random() < finalRate) {
                        state.job = 'fulltime';
                        state.jobTenure = 0;
                        state.monthlyIncome = GameData.jobTypes.fulltime.income;
                        state.sickLeaveDays = conf.initialSickLeaveDays;
                        state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.mentalGainSuccess);
                        return { message: I18n.t('events.afternoon_interview.messages.success'), type: 'positive' };
                    } else {
                        state.mental -= conf.mentalLossFail;
                        return { message: I18n.t('events.afternoon_interview.messages.fail'), type: 'negative' };
                    }
                }
            },
            {
                text: I18n.t('events.afternoon_interview.choices.casual.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.afternoon_interview.casual;
                    const tryHardConf = GameData.eventConfigs.afternoon_interview.tryHard;

                    const energyConf = GameData.energyConfig;
                    let energyRate = 1.0;
                    // if (state.energy < energyConf.lowEnergyThreshold) {
                    //     energyRate -= energyConf.lowEnergyPenalty;
                    // }
                    energyRate = Math.max(0.1, energyRate);

                    const efficiency = state.workEfficiency || 100;
                    const efficiencyBonus = (efficiency - 100) * tryHardConf.efficiencyBonusPerPoint;
                    const baseRate = Math.min(tryHardConf.maxSuccessRate, Math.max(tryHardConf.minSuccessRate, tryHardConf.baseSuccessRate + efficiencyBonus));
                    const casualRate = Math.max(conf.minSuccessRate, Math.min(baseRate * conf.rateMultiplier, baseRate - conf.maxRateGap));
                    const finalRate = casualRate * energyRate;
                    return I18n.t('events.afternoon_interview.choices.casual.hint', conf.energyCost, Math.round(finalRate * 100), conf.mentalGainSuccess);
                },
                hintType: 'energy',
                energyCost: GameData.eventConfigs.afternoon_interview.casual.energyCost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.afternoon_interview.casual;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    const successRate = context.successRate || 0.5;
                    const tryHardConf = GameData.eventConfigs.afternoon_interview.tryHard;
                    const efficiency = state.workEfficiency || 100;
                    const efficiencyBonus = (efficiency - 100) * tryHardConf.efficiencyBonusPerPoint;
                    const baseRate = Math.min(tryHardConf.maxSuccessRate, Math.max(tryHardConf.minSuccessRate, tryHardConf.baseSuccessRate + efficiencyBonus));
                    const casualRate = Math.max(conf.minSuccessRate, Math.min(baseRate * conf.rateMultiplier, baseRate - conf.maxRateGap));
                    const finalRate = casualRate * successRate;

                    if (context.rng.random() < finalRate) {
                        state.job = 'fulltime';
                        state.jobTenure = 0;
                        state.monthlyIncome = GameData.jobTypes.fulltime.income;
                        state.sickLeaveDays = tryHardConf.initialSickLeaveDays;
                        state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.mentalGainSuccess);
                        return { message: I18n.t('events.afternoon_interview.messages.casualSuccess'), type: 'positive' };
                    }
                    return { message: I18n.t('events.afternoon_interview.messages.casualFail'), type: 'neutral' };
                }
            }
        ]
    },



    {
        id: 'afternoon_gig',
        type: 'opportunity',
        title: I18n.t('events.afternoon_gig.title'),
        description: I18n.t('events.afternoon_gig.description'),
        period: 'day',
        condition: (state) => state.job !== 'fulltime' && (!state.hospitalDaysLeft || state.hospitalDaysLeft <= 0),
        weight: GameData.eventWeights.afternoon_gig,
        choices: [
            {
                text: I18n.t('events.afternoon_gig.choices.accept.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.afternoon_gig.accept;
                    return I18n.t('events.afternoon_gig.choices.accept.hint', conf.moneyGain, conf.energyCost);
                },
                hintType: 'energy',
                energyCost: GameData.eventConfigs.afternoon_gig.accept.energyCost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.afternoon_gig.accept;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    if (state.energy < conf.tiredThreshold) {
                        state.money += conf.tiredMoneyGain;
                        state.health -= conf.tiredHealthLoss;
                        return { message: I18n.t('events.afternoon_gig.messages.tooTired', conf.tiredMoneyGain), type: 'negative' };
                    }
                    state.money += conf.moneyGain;
                    return { message: I18n.t('events.afternoon_gig.messages.success', conf.moneyGain), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.afternoon_gig.choices.decline.text'),
                hint: I18n.t('events.afternoon_gig.choices.decline.hint'),
                hintType: 'neutral',
                effect: (state, context) => {
                    return { message: I18n.t('events.afternoon_gig.messages.decline'), type: 'neutral' };
                }
            }
        ]
    }
];

export const randomDailyActions = [
    {
        id: 'buy_coffee',
        text: I18n.t('events.daily_actions.buy_coffee.text'),
        hint: (state) => {
            const conf = GameData.eventConfigs.daily_actions.buy_coffee;
            return I18n.t('events.daily_actions.buy_coffee.hint', conf.cost, conf.energyGain);
        },
        hintType: 'energy',
        condition: (state) => {
            return !state.coffeeToday;
        },
        effect: (state, context) => {
            const conf = GameData.eventConfigs.daily_actions.buy_coffee;
            if (context.game && context.game.deductMoney) {
                context.game.deductMoney(conf.cost, 'daily');
            } else {
                state.money -= conf.cost;
            }
            state.energy = Math.min(GameData.initialState.maxEnergy, state.energy + conf.energyGain);
            state.coffeeToday = true;
            return { message: I18n.t('events.daily_actions.buy_coffee.message'), type: 'positive' };
        }
    },
    {
        id: 'take_walk',
        text: I18n.t('events.daily_actions.take_walk.text'),
        hint: (state) => {
            const conf = GameData.eventConfigs.daily_actions.take_walk;
            return I18n.t('events.daily_actions.take_walk.hint', conf.energyCost, conf.mentalGain, conf.healthGain);
        },
        hintType: 'positive',
        effect: (state, context) => {
            const conf = GameData.eventConfigs.daily_actions.take_walk;
            state.energy = Math.max(0, state.energy - conf.energyCost);
            state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.mentalGain);
            state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);
            return { message: I18n.t('events.daily_actions.take_walk.message'), type: 'positive' };
        }
    },
    {
        id: 'gossip',
        text: I18n.t('events.daily_actions.gossip.text'),
        hint: (state) => {
            const conf = GameData.eventConfigs.daily_actions.gossip;
            return I18n.t('events.daily_actions.gossip.hint', conf.energyCost, conf.socialGain);
        },
        hintType: 'neutral',
        // V2.55 修复：办公室八卦仅在工作日且有工作时可用
        condition: (state) => {
            return state.job !== 'unemployed' &&
                state.job !== 'fired' &&
                state.day % GameData.timeCycle.weekDays !== GameData.timeCycle.restDayMod;
        },
        energyCost: GameData.eventConfigs.daily_actions.gossip.energyCost,
        effect: (state, context) => {
            const conf = GameData.eventConfigs.daily_actions.gossip;
            state.energy = Math.max(0, state.energy - conf.energyCost);
            state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
            const rumor = getRumorLine(state, context);
            const baseMsg = I18n.t('events.daily_actions.gossip.message');
            return { message: rumor ? `${baseMsg}\n${rumor}` : baseMsg, type: 'neutral' };
        }
    },
    {
        id: 'short_nap',
        text: I18n.t('events.daily_actions.short_nap.text'),
        hint: (state) => {
            const conf = GameData.eventConfigs.daily_actions.short_nap;
            return I18n.t('events.daily_actions.short_nap.hint', conf.energyGain);
        },
        hintType: 'energy',
        effect: (state, context) => {
            const conf = GameData.eventConfigs.daily_actions.short_nap;
            state.energy = Math.min(GameData.initialState.maxEnergy, state.energy + conf.energyGain);
            return { message: I18n.t('events.daily_actions.short_nap.message'), type: 'positive' };
        }
    },
    {
        id: 'teamwork',
        text: I18n.t('events.daily_actions.teamwork.text'),
        hint: (state) => {
            const conf = GameData.eventConfigs.daily_actions.teamwork;
            return I18n.t('events.daily_actions.teamwork.hint', conf.energyCost, conf.socialGain, conf.workEfficiencyGain);
        },
        hintType: 'neutral',
        condition: (state, context) => state.energy >= 30 && context.rng.random() < 0.6,
        effect: (state, context) => {
            const conf = GameData.eventConfigs.daily_actions.teamwork;
            state.energy = Math.max(0, state.energy - conf.energyCost);
            state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
            state.workEfficiency = Math.min(GameData.initialState.maxWorkEfficiency, (state.workEfficiency || 100) + conf.workEfficiencyGain);
            return { message: I18n.t('events.daily_actions.teamwork.message'), type: 'positive' };
        }
    }
];

export function generateDailyWorkEvent(state, context) {
    const choices = [];
    const jobTenure = state.jobTenure || 0;
    const workMechanics = GameData.eventConfigs.work_mechanics;
    const workGeneral = GameData.eventConfigs.work_general;

    const baseEvent = dailyEvents.find(e => e.id === 'day_work');
    if (!baseEvent) return [];

    // 1. 专注工作
    choices.push({
        text: I18n.t('events.daily_work.focus_work.text'),
        hint: (state) => {
            const baseGain = state.workTask ? Math.round(GameData.initialState.workTask.maxProgress / state.workTask.difficulty) : 30;
            const efficiency = state.workEfficiency || 100;
            const progressGain = Math.round(baseGain * efficiency / 100);
            const conf = workGeneral.focus_work;
            return state.pipActive ? I18n.t('events.daily_work.focus_work.hint_pip', conf.pipEnergyCost, progressGain, conf.pipGain) : I18n.t('events.daily_work.focus_work.hint_normal', conf.energyCost, progressGain);
        },
        hintType: 'energy',
        energyCost: state.pipActive ? workGeneral.focus_work.pipEnergyCost : workGeneral.focus_work.energyCost,
        effect: (state, context) => {
            // Note: successRate passed in context usually
            const successRate = context.successRate || 1.0;
            const conf = workGeneral.focus_work;
            state.energy = Math.max(0, state.energy - (state.pipActive ? conf.pipEnergyCost : conf.energyCost));

            if (state.pipActive) {
                state.pipDaysRemaining = Math.max(0, (state.pipDaysRemaining || 0) - 1);
                if (context.rng.random() < successRate) {
                    let pipGain = conf.pipGain;
                    if ((state.socialValue || 50) >= 60) pipGain += conf.socialPipBonus;
                    state.pipPerformanceScore = Math.min(100, (state.pipPerformanceScore || 50) + pipGain);
                } else {
                    state.pipPerformanceScore = Math.max(0, (state.pipPerformanceScore || 50) - 5);
                }
            }

            if (state.workTask) {
                const baseGain = Math.round(GameData.initialState.workTask.maxProgress / state.workTask.difficulty);
                const efficiency = state.workEfficiency || 100;
                const gain = Math.round(baseGain * efficiency / 100);

                state.workTask.progress = Math.min(GameData.initialState.workTask.maxProgress, state.workTask.progress + gain);

                if (state.workTask.progress >= GameData.initialState.workTask.maxProgress) {
                    const completedTaskName = state.workTask.name;
                    // V2.41 修复：预览时不派发新任务，以便显示 100% 进度
                    if (!context.isPreview && context.game && context.game.assignNewTask) {
                        context.game.assignNewTask();
                    }
                    return { message: I18n.t('events.daily_work.focus_work.messages.complete', completedTaskName), type: 'positive' };
                }
                return { message: I18n.t('events.daily_work.focus_work.messages.progress', gain, state.workTask.progress), type: 'neutral' };
            }

            // Standard focus work without task
            if (context.rng.random() < successRate) {
                state.jobTenure = (state.jobTenure || 0) + 1;
                const tenure = state.jobTenure;
                const accrualRate = tenure <= workMechanics.tenure.newbieThreshold ? workMechanics.tenure.newbieAccrual : workMechanics.tenure.seniorAccrual;
                if (tenure % accrualRate === 0) {
                    state.sickLeaveDays = (state.sickLeaveDays || 0) + 1;
                    return { message: I18n.t('events.daily_work.focus_work.messages.success_pto'), type: 'neutral' };
                }
                return { message: I18n.t('events.daily_work.focus_work.messages.success'), type: 'neutral' };
            } else {
                state.mental -= workMechanics.focus_work.failMentalLoss;
                state.jobTenure = (state.jobTenure || 0) + 1;
                return { message: I18n.t('events.daily_work.focus_work.messages.fail'), type: 'negative' };
            }
        }
    });

    // 2. 摸鱼/划水
    choices.push({
        text: I18n.t('events.daily_work.slack_off.text'),
        hint: (state) => {
            const conf = workGeneral.slack_off;
            return state.pipActive ? I18n.t('events.daily_work.slack_off.hint_pip', conf.energyCost, conf.pipMentalGain, conf.pipLostScore, conf.pipRisk * 100) : I18n.t('events.daily_work.slack_off.hint_normal', conf.energyCost, conf.normalMentalGain, conf.normalRisk * 100);
        },
        hintType: 'neutral',
        energyCost: workGeneral.slack_off.energyCost,
        effect: (state, context) => {
            const conf = workGeneral.slack_off;
            state.energy = Math.max(0, state.energy - conf.energyCost);

            if (state.pipActive) {
                state.pipDaysRemaining = Math.max(0, (state.pipDaysRemaining || 0) - 1);
                state.pipPerformanceScore = Math.max(0, (state.pipPerformanceScore || 50) - conf.pipLostScore);

                if (context.rng.random() < conf.pipRisk) {
                    state.pipPerformanceScore = Math.max(0, (state.pipPerformanceScore || 50) - conf.pipCriticalScoreLoss);
                    state.mental -= conf.pipMentalLoss;
                    return { message: I18n.t('events.daily_work.slack_off.messages.main_pip_critical', conf.pipLostScore + conf.pipCriticalScoreLoss, state.pipDaysRemaining), type: 'negative' };
                }
                state.mental += conf.pipMentalGain;
                return { message: I18n.t('events.daily_work.slack_off.messages.main_pip_lucky', conf.pipLostScore, state.pipDaysRemaining), type: 'neutral' };
            }

            if (context.rng.random() < conf.normalRisk) {
                state.mental -= conf.normalMentalLoss;
                return { message: I18n.t('events.daily_work.slack_off.messages.caught_warning'), type: 'negative' };
            }
            state.mental += conf.normalMentalGain;
            return { message: I18n.t('events.daily_work.slack_off.messages.success', conf.normalMentalGain), type: 'positive' };
        }
    });

    return choices;
}


export function getAvailableDailyActions(state, context) {
    // V2.XX 统一的重病/住院/手术限制条件
    const isMedicalRestricted =
        state.hospitalDaysLeft > 0 ||
        state.health < 30 ||
        ((state.health < 50 && state.insurance.healthPlanId !== 'none') || // 需手术
            state.surgeryApprovalDaysLeft > 0 ||
            state.surgeryApprovalPending);

    if (isMedicalRestricted) {
        return [
            { id: 'none', text: I18n.t('events.daily_actions.none.text'), hint: I18n.t('events.daily_actions.none.hint'), hintType: 'neutral' }
        ];
    }

    const pool = [
        ...randomDailyActions.filter(a => !a.condition || a.condition(state, context))
    ];

    const shuffled = pool.sort(() => 0.5 - context.rng.random());
    const selected = shuffled.slice(0, 3);

    return [
        { id: 'none', text: I18n.t('events.daily_actions.none.text'), hint: I18n.t('events.daily_actions.none.hint'), hintType: 'neutral' },
        ...selected
    ];
}

export function getDailyActionById(id) {
    if (id === 'none') return null;
    return randomDailyActions.find(a => a.id === id);
}

export function getAvailableLunchOptions(state, context) {
    const options = [];
    const base = GameData.lunchOptions;

    // V2.XX 统一的重病/住院/手术限制条件
    const isMedicalRestricted =
        state.hospitalDaysLeft > 0 ||
        state.health < 30 ||
        ((state.health < 50 && state.insurance.healthPlanId !== 'none') || // 需手术
            state.surgeryApprovalDaysLeft > 0 ||
            state.surgeryApprovalPending);

    // Mod: Only restrict if hospitalized. Unblocks lunch for sick-but-free players.
    if ((state.hospitalDaysLeft || 0) > 0) {
        const allowed = (state.hospitalDaysLeft || 0) > 0
            ? ['hospital_cafeteria', 'skip']
            : ['skip'];
        for (const key of allowed) {
            if (base[key]) {
                const opt = { ...base[key], key: key };
                opt.name = I18n.t(`data.lunch.${key}.name`);
                if (key === 'hospital_cafeteria') {
                    opt.name = I18n.t('data.lunch.hospital_cafeteria.name');
                    opt.hint = I18n.t('data.lunch.hospital_cafeteria.hint', opt);
                } else if (key === 'skip') {
                    opt.name = I18n.t('data.lunch.skip.name');
                    opt.hint = I18n.t('data.lunch.skip.hint', opt);
                }
                options.push(opt);
            }
        }
        return options;
    }

    for (const [key, config] of Object.entries(base)) {
        if (key === 'hospital_cafeteria') continue;
        const opt = { ...config, key: key };

        // V2.XX Fix: Display full cost for fastfood including tip to match settlement logic
        if (key === 'fastfood' && GameData.usaFeatures) {
            opt.cost += Math.round(opt.cost * GameData.usaFeatures.tipRate);
        }

        opt.name = I18n.t(`data.lunch.${key}.name`);
        if (!opt.disabled) {
            opt.hint = I18n.t(`data.lunch.${key}.hint`, opt);
        }

        if (key === 'business') {
            if (state.job !== 'fulltime' || context.rng.random() > GameData.eventConfigs.lunch_mechanics.business.chance) continue;
        }

        if (config.condition && !config.condition(state)) {
            opt.disabled = true;
            if (key === 'bento') {
                opt.hint = I18n.t('data.lunch_hints.not_prepared');
            }
        }

        if (key === 'salad' && !opt.disabled) {
            if (context.rng.random() < GameData.eventConfigs.lunch_mechanics.salad.soldOutChance) {
                opt.disabled = true;
                opt.hint = I18n.t('data.lunch_hints.sold_out');
            }
        }

        if (key === 'fastfood' && !opt.disabled) {
            if (context.rng.random() < GameData.eventConfigs.lunch_mechanics.fastfood.soldOutChance) {
                opt.disabled = true;
                opt.hint = I18n.t('data.lunch_hints.restaurant_full');
            }
        }

        if (opt.cost > 0 && opt.cost > state.money && !opt.disabled) {
            opt.disabled = true;
            opt.hint = I18n.t('data.lunch_hints.too_expensive', opt.cost);
        }

        options.push(opt);
    }
    return options;
}

export function getAvailableCommuteOptions(state, context) {
    const options = [];
    const base = GameData.commuteOptions;

    if ((state.hospitalDaysLeft || 0) > 0) {
        if (base.hospital_stay) {
            const opt = { ...base.hospital_stay, key: 'hospital_stay' };
            opt.name = I18n.t('data.commuteOptions.hospital_stay.name');
            opt.hint = I18n.t('data.commuteOptions.hospital_stay.hint', opt);
            options.push(opt);
        }
        return options;
    }

    // 修复：失业或被裁后不需要通勤
    if (state.job === 'unemployed' || state.job === 'fired') {
        return [];
    }

    for (const [key, config] of Object.entries(base)) {
        if (key === 'hospital_stay') continue;

        if (key === 'car') {
            if (!state.hasCar) continue;
            if (state.carBroken) {
                const repairCost = state.insurance.carPlanId === 'full_coverage'
                    ? GameData.eventConfigs.commute_mechanics.car_repair.fullCoverageCost
                    : GameData.eventConfigs.commute_mechanics.car_repair.outOfPocketCost;
                const canAfford = state.money >= repairCost;
                const insuranceInfo = state.insurance.carPlanId === 'full_coverage' ? '(全险覆盖)' : '(自费)';
                options.push({
                    key: 'car_repair',
                    id: 'car_repair',
                    name: I18n.t('data.commute.car_repair.name'),
                    hint: canAfford ? I18n.t('data.commute.car_repair.hint', repairCost, insuranceInfo) : I18n.t('data.commute.too_expensive', repairCost),
                    cost: repairCost,
                    lateChance: 1.0,
                    healthEffect: 0,
                    disabled: !canAfford
                });
                continue;
            }

            const fuel = state.fuelRemaining || 0;
            const capacity = state.fuelCapacity || GameData.eventConfigs.commute_mechanics.car.defaultCapacity;
            const refuelCost = state.refuelCost || GameData.eventConfigs.commute_mechanics.car.defaultRefuelCost;

            if (fuel > 0) {
                options.push({
                    key: 'car',
                    id: 'car',
                    name: I18n.t('data.commute.car.name'),
                    hint: I18n.t('data.commute.car.hint', fuel, capacity),
                    cost: 0,
                    lateChance: 0,
                    healthEffect: 0,
                    disabled: false
                });
            } else {
                const canAfford = state.money >= refuelCost;
                options.push({
                    key: 'car_refuel',
                    id: 'car_refuel',
                    name: I18n.t('data.commute.car_refuel.name'),
                    hint: canAfford ? I18n.t('data.commute.car_refuel.hint', refuelCost) : I18n.t('data.commute.too_expensive', refuelCost),
                    cost: refuelCost,
                    lateChance: 0,
                    healthEffect: 0,
                    disabled: !canAfford
                });
            }
            continue;
        }

        const opt = { ...config, key: key };
        opt.name = I18n.t(`data.commuteOptions.${key}.name`);
        opt.hint = I18n.t(`data.commuteOptions.${key}.hint`, opt);

        if (config.condition && !config.condition(state)) {
            opt.disabled = true;
            opt.hint = I18n.t('data.commute.unavailable');
        }

        if (opt.cost > 0 && opt.cost > state.money && !opt.disabled) {
            opt.disabled = true;
            opt.hint = I18n.t('data.commute.too_expensive', opt.cost);
        }

        options.push(opt);
    }
    return options;
}

export function applyCommuteEffects(state, context) {
    const commuteId = state.selectedCommute;
    if (!commuteId) return null;

    const config = GameData.commuteOptions[commuteId];
    if (!config) return null;

    let messages = [];

    if (config.cost > 0) {
        state.money -= config.cost;
        messages.push(I18n.t('data.commute_messages.cost', config.cost));
    }

    if (config.healthEffect > 0) {
        state.health = Math.min(GameData.initialState.maxHealth, state.health + config.healthEffect);
        messages.push(I18n.t('data.commute_messages.health', config.healthEffect));
    }

    const isLate = context.rng.random() < config.lateChance;
    if (isLate) {
        const conf = GameData.eventConfigs.commute.late;
        state.energy = Math.max(0, state.energy - conf.energyLoss);
        state.mental = Math.max(0, state.mental - conf.mentalLoss);
        if (state.workTask) {
            state.workTask.progress = Math.max(0, state.workTask.progress - conf.progressLoss);
        }
        messages.push(I18n.t('data.commute_messages.late', conf.energyLoss, conf.mentalLoss, conf.progressLoss));

        if (state.pipActive) {
            state.pipPerformanceScore = Math.max(0, (state.pipPerformanceScore || 50) - conf.pipScoreLoss);
            messages.push(I18n.t('data.commute_messages.pip', conf.pipScoreLoss));
        }
    }

    state.currentCommuteOptions = null;

    if (messages.length > 0) {
        return { message: messages.join(', '), type: isLate ? 'negative' : 'neutral' };
    }
    return null;
}
