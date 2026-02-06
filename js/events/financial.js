/**
 * Financial Crisis Events
 * 房租危机、信用崩塌等
 */
import { I18n } from '../i18n.js';
import { GameData } from '../data/index.js';

export const financialEvents = [
    // 1. 房租危机 (Rent Due / Eviction Risk)
    {
        id: 'rent_due',
        type: 'bill',
        title: I18n.t('events.rent_due.title'),
        description: (state) => I18n.t('events.rent_due.description', state.housingCost || 0),
        period: 'any', // 会在判定期间插入，不限时段
        weight: GameData.eventWeights.rent_due,
        isRandom: true,
        // 触发条件：连续没交租达到阈值且有住所
        condition: (state) => {
            const conf = GameData.eventConfigs.financial_crisis.rent_due;
            return (state.unpaidRentMonths || 0) >= conf.evictionThresholdMonths && // 连续欠租
                state.housing !== 'homeless' &&
                state.housing !== 'car' &&
                state.housing !== 'jail' &&
                (!state.rentCrisisToday); // 避免一天重复触发
        },
        choices: [
            {
                text: I18n.t('events.rent_due.choices.negotiate.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.rent_due.negotiate;
                    return I18n.t('events.rent_due.choices.negotiate.hint', conf.successChance * 100, conf.creditLoss, conf.mentalLoss);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.rent_due.negotiate;
                    const crisisConf = GameData.eventConfigs.financial_crisis.rent_due;
                    state.rentCrisisToday = true;

                    if (context.rng.random() < conf.successChance) {
                        state.creditScore = Math.max(300, state.creditScore - conf.creditLoss);
                        state.mental -= Math.floor(conf.mentalLoss / 2); // 成功也扣点压力
                        return { message: I18n.t('events.rent_due.messages.negotiateSuccess', conf.creditLoss), type: 'positive' };
                    } else {
                        // 失败：被赶走 (直接流浪，或者降级)
                        // 协商失败通常比较惨，直接赶走
                        state.housing = 'homeless';
                        state.housingCost = 0;
                        state.mental -= conf.mentalLoss;
                        state.creditScore -= conf.creditLoss * crisisConf.evictionCreditLossMultiplier;
                        return { message: I18n.t('events.rent_due.messages.negotiateFail'), type: 'negative' };
                    }
                }
            },
            {
                text: I18n.t('events.rent_due.choices.moveOut.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.rent_due.moveOut;
                    if (state.housing === 'apartment') {
                        // 降级为廉价房
                        const baseCost = GameData.housingTypes.cheapRoom?.cost || 500;
                        const newCost = Math.floor(baseCost * (state.rentIndex || 1));
                        return I18n.t('events.rent_due.choices.moveOut.hint', newCost, conf.mentalLoss);
                    }
                    // 已经是廉价房，只能流浪
                    return "无力支付，流落街头";
                },
                hintType: 'danger',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.rent_due.moveOut;
                    state.rentCrisisToday = true;

                    if (state.housing === 'apartment') {
                        state.housing = 'cheapRoom';
                        const baseCost = GameData.housingTypes.cheapRoom?.cost || 500;
                        state.housingCost = Math.floor(baseCost * (state.rentIndex || 1));
                        state.mental -= conf.mentalLoss;
                        return { message: I18n.t('events.rent_due.messages.moveOut'), type: 'negative' };
                    } else {
                        state.housing = 'homeless';
                        state.housingCost = 0;
                        state.mental -= conf.mentalLoss;
                        return { message: "你主动搬离了住所，现在无家可归。", type: 'negative' };
                    }
                }
            }
        ]
    },

    // 2. 信用崩塌 (Credit Collapse)
    {
        id: 'credit_collapse',
        type: 'bill',
        title: I18n.t('events.credit_collapse.title'),
        description: I18n.t('events.credit_collapse.description'),
        period: 'any',
        weight: GameData.eventWeights.credit_collapse,
        isRandom: true,
        // 触发条件：极低信用分且负债
        condition: (state) => {
            const conf = GameData.eventConfigs.financial_crisis.credit_collapse;
            return state.creditScore < conf.scoreThreshold && (state.debt || 0) > 0 && !state.creditCrisisToday;
        },
        choices: [
            {
                text: I18n.t('events.credit_collapse.choices.accept.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.credit_collapse.accept;
                    return I18n.t('events.credit_collapse.choices.accept.hint', conf.mentalLoss);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.credit_collapse.accept;
                    state.mental -= conf.mentalLoss;
                    state.creditCrisisToday = true;

                    // 连带驱逐判定
                    if (state.housing !== 'homeless' && state.housing !== 'car' &&
                        context.rng.random() < GameData.eventConfigs.probabilities.credit_collapse_eviction) {
                        state.housing = 'homeless';
                        state.housingCost = 0;
                        return { message: I18n.t('events.credit_collapse.messages.evicted'), type: 'negative' };
                    }

                    return { message: I18n.t('events.credit_collapse.messages.frozen'), type: 'neutral' };
                }
            },
            {
                text: I18n.t('events.credit_collapse.choices.fix.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.credit_collapse.fix;
                    return I18n.t('events.credit_collapse.choices.fix.hint', conf.cost, conf.creditGain, conf.energyCost, conf.mentalLoss);
                },
                hintType: 'money',
                condition: (state) => {
                    const conf = GameData.eventConfigs.financial_crisis.credit_collapse;
                    const maxDebt = Math.abs(conf.fixMinDebt || 0);
                    return (state.debt || 0) <= maxDebt; // 欠太多没法修
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.credit_collapse.fix;
                    context.game.deductMoney(conf.cost, 'daily', { state: context.game.state });
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.creditScore += conf.creditGain;
                    state.mental -= conf.mentalLoss;
                    state.creditCrisisToday = true;
                    return { message: I18n.t('events.credit_collapse.messages.fixed', conf.cost), type: 'neutral' };
                }
            }
        ]
    }
];
