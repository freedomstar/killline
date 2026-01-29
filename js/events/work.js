/**
 * Work Related Events
 */
/**
 * Work Related Events
 */
import { I18n } from '../i18n.js';
import { GameData } from '../data/index.js';

export const workEvents = [
    // PIP警告 - 进入观察期
    {
        id: 'pip_warning',
        type: 'layoff',
        title: I18n.t('events.pip_warning.title'),
        description: I18n.t('events.pip_warning.description'),
        period: 'any',
        isRandom: true,
        mandatory: false,
        condition: (state) => state.day > GameData.newbieProtectionDays && state.job === 'fulltime' && !state.pipActive && state.day % GameData.timeCycle.weekDays !== GameData.timeCycle.restDayMod,
        weight: GameData.eventWeights.pip_warning,
        choices: [
            {
                text: I18n.t('events.pip_warning.choices.accept.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.pip_warning.accept;
                    return I18n.t('events.pip_warning.choices.accept.hint', conf.pipDays, conf.mentalLoss);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.pip_warning.accept;
                    state.pipActive = true;
                    state.pipDaysRemaining = conf.pipDays;
                    state.pipPerformanceScore = conf.pipScore;
                    state.mental -= conf.mentalLoss;
                    return { message: I18n.t('events.pip_warning.messages.start'), type: 'negative' };
                }
            },
            {
                text: I18n.t('events.pip_warning.choices.quit.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.pip_warning.quit;
                    const currentScore = state.pipPerformanceScore || GameData.eventConfigs.pip_warning.accept.pipScore;
                    const efficiency = (state.workEfficiency || 100) / 100;
                    const efficiencyFactor = Math.min(conf.raiseEfficiencyMax, Math.max(conf.raiseEfficiencyMin, efficiency));
                    const raisePct = conf.raiseBasePct * efficiencyFactor;
                    const pipDelta = -conf.failScoreLoss;

                    // Success rate is also affected by low energy (EventManager.calculateSuccessRate).
                    // Keep the hint consistent with the actual effect probability.
                    const energyConf = GameData.energyConfig;
                    let energyRate = 1.0;
                    if (state.energy < energyConf.lowEnergyThreshold) {
                        energyRate -= energyConf.lowEnergyPenalty;
                    }
                    energyRate = Math.max(0.1, energyRate);
                    const chancePct = Math.round(energyRate * conf.successMod * 100);

                    return I18n.t(
                        'events.pip_warning.choices.quit.hint',
                        conf.energyCost,
                        chancePct,
                        Math.round(raisePct * 100),
                        conf.mentalGainSuccess,
                        conf.mentalLossFail,
                        pipDelta
                    );
                },
                hintType: 'neutral',
                energyCost: GameData.eventConfigs.pip_warning.quit.energyCost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.pip_warning.quit;
                    state.energy = Math.max(0, state.energy - conf.energyCost);

                    const successRate = context.successRate || 0.5; // Context must provide this if needed, or we calculate locally? 
                    // Calculate locally? No, Game.handleChoice usage passes successRate.
                    // But wait, standard effect signature in Game.js handles successRate calculation.

                    if (context.rng.random() < successRate * conf.successMod) {
                        const baseIncome = state.monthlyIncome || GameData.jobTypes.fulltime.income;
                        const efficiency = (state.workEfficiency || 100) / 100;
                        const efficiencyFactor = Math.min(conf.raiseEfficiencyMax, Math.max(conf.raiseEfficiencyMin, efficiency));
                        const raisePct = conf.raiseBasePct * efficiencyFactor;
                        state.monthlyIncome = Math.round(baseIncome * (1 + raisePct));
                        state.jobTenure = 0;
                        state.mental += conf.mentalGainSuccess;
                        return { message: I18n.t('events.pip_warning.messages.quitSuccess'), type: 'positive' };
                    }
                    state.pipActive = true;
                    state.pipDaysRemaining = GameData.eventConfigs.pip_warning.accept.pipDays;
                    const currentScore = state.pipPerformanceScore || GameData.eventConfigs.pip_warning.accept.pipScore;
                    state.pipPerformanceScore = Math.max(0, currentScore - conf.failScoreLoss);
                    state.mental -= conf.mentalLossFail;
                    return { message: I18n.t('events.pip_warning.messages.quitFail'), type: 'negative' };
                }
            }
        ]
    },

    // PIP结算 - 观察期结束
    {
        id: 'pip_result',
        type: 'layoff',
        title: I18n.t('events.pip_result.title'),
        description: I18n.t('events.pip_result.description'),
        period: 'any',
        condition: (state) => state.pipActive && state.pipDaysRemaining <= 0 && state.day % GameData.timeCycle.weekDays !== GameData.timeCycle.restDayMod,
        weight: GameData.eventWeights.pip_result,
        mandatory: true,
        allowQueue: true,
        choices: [
            {
                text: I18n.t('events.pip_result.choices.enter.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.pip_result;
                    return I18n.t('events.pip_result.choices.enter.hint', conf.mentalGainPass, conf.mentalLossFail);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.pip_result;
                    const score = state.pipPerformanceScore || 50;
                    const passChance = Math.min(conf.passChanceCap, Math.max(conf.passChanceMin, score / 100));

                    state.pipActive = false;
                    state.pipDaysRemaining = 0;
                    state.pipPerformanceScore = 0;

                    if (context.rng.random() < passChance) {
                        state.mental += conf.mentalGainPass;
                        return {
                            message: I18n.t('events.pip_result.messages.passed'),
                            type: 'positive'
                        };
                    } else {
                        state.job = 'fired';
                        state.monthlyIncome = 0;
                        state.mental -= conf.mentalLossFail;
                        return {
                            message: I18n.t('events.pip_result.messages.failed'),
                            type: 'negative'
                        };
                    }
                }
            }
        ]
    },

    // 突然被裁 - 无预警裁员
    {
        id: 'sudden_layoff',
        type: 'layoff',
        title: I18n.t('events.sudden_layoff.title'),
        description: I18n.t('events.sudden_layoff.description'),
        period: 'any',
        mandatory: false,
        condition: (state) => state.day > GameData.newbieProtectionDays && state.job === 'fulltime' && !state.pipActive && state.day % GameData.timeCycle.weekDays !== GameData.timeCycle.restDayMod,
        weight: GameData.eventWeights.sudden_layoff,
        isRandom: true,
        choices: [
            {
                text: I18n.t('events.sudden_layoff.choices.accept.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.sudden_layoff.accept;
                    const baseIncome = state.monthlyIncome || GameData.jobTypes.fulltime.income;
                    const severancePay = Math.round(baseIncome * conf.severanceMonths);
                    return I18n.t('events.sudden_layoff.choices.accept.hint', severancePay, conf.mentalLoss);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.sudden_layoff.accept;
                    const baseIncome = state.monthlyIncome || GameData.jobTypes.fulltime.income;
                    const severancePay = Math.round(baseIncome * conf.severanceMonths);
                    state.money += severancePay;
                    state.job = 'fired';
                    state.monthlyIncome = 0;
                    state.mental -= conf.mentalLoss;
                    return { message: I18n.t('events.sudden_layoff.messages.accept', severancePay), type: 'negative' };
                }
            },
            {
                text: I18n.t('events.sudden_layoff.choices.fight.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.sudden_layoff.fight;
                    const baseIncome = state.monthlyIncome || GameData.jobTypes.fulltime.income;
                    const baseConf = GameData.eventConfigs.sudden_layoff.accept;
                    const successSeverance = Math.round(baseIncome * conf.successSeveranceMonths);
                    const failSeverance = Math.round(baseIncome * conf.failSeveranceMonths);
                    return I18n.t(
                        'events.sudden_layoff.choices.fight.hint',
                        conf.energyCost,
                        conf.mentalLossSuccess,
                        conf.mentalLossFail,
                        successSeverance,
                        failSeverance
                    );
                },
                hintType: 'neutral',
                energyCost: GameData.eventConfigs.sudden_layoff.fight.energyCost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.sudden_layoff.fight;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    const baseIncome = state.monthlyIncome || GameData.jobTypes.fulltime.income;
                    state.job = 'fired';
                    state.monthlyIncome = 0;

                    const successRate = context.successRate || 0.5;

                    if (context.rng.random() < successRate * conf.successMod) {
                        const bonusPay = Math.round(baseIncome * conf.successSeveranceMonths);
                        if (bonusPay > 0) state.money += bonusPay;
                        state.mental -= conf.mentalLossSuccess;
                        return { message: I18n.t('events.sudden_layoff.messages.fightSuccess', bonusPay), type: 'positive' };
                    } else {
                        const failPay = Math.round(baseIncome * conf.failSeveranceMonths);
                        if (failPay > 0) state.money += failPay;
                        state.mental -= conf.mentalLossFail;
                        return { message: I18n.t('events.sudden_layoff.messages.fightFail', failPay), type: 'negative' };
                    }
                }
            }
        ]
    }
];

export const workIncidents = [
    {
        id: 'urgent_meeting',
        title: I18n.t('events.work_incidents.urgent_meeting.title'),
        choices: [
            {
                id: 'attend', text: I18n.t('events.work_incidents.urgent_meeting.choices.attend.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.urgent_meeting.attend;
                    return I18n.t('events.work_incidents.urgent_meeting.choices.attend.hint', conf.energyCost, conf.baseSocialGain, conf.workEfficiencyGain);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.urgent_meeting.attend;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    const social = state.socialValue || 50;
                    let gain = conf.baseSocialGain;
                    if (social >= conf.highSocialThreshold) gain += conf.highSocialGain;
                    else if (social < conf.lowSocialThreshold) gain = Math.floor(gain / 2);
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + gain);
                    state.workEfficiency = Math.min(GameData.initialState.maxWorkEfficiency, (state.workEfficiency || 100) + conf.workEfficiencyGain);
                    const msg = social >= conf.highSocialThreshold
                        ? I18n.t('events.work_incidents.urgent_meeting.messages.attendHighSocial')
                        : I18n.t('events.work_incidents.urgent_meeting.messages.attend');
                    return { message: msg, type: 'positive' };
                }
            },
            {
                id: 'ignore', text: I18n.t('events.work_incidents.urgent_meeting.choices.ignore.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.urgent_meeting.ignore;
                    return I18n.t('events.work_incidents.urgent_meeting.choices.ignore.hint', conf.energyCost, conf.workEfficiencyLoss);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.urgent_meeting.ignore;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.workEfficiency = Math.max(0, (state.workEfficiency || 100) - conf.workEfficiencyLoss);
                    return { message: I18n.t('events.work_incidents.urgent_meeting.messages.ignore'), type: 'neutral' };
                }
            }
        ]
    },
    {
        id: 'colleague_help',
        title: I18n.t('events.work_incidents.colleague_help.title'),
        choices: [
            {
                id: 'help', text: I18n.t('events.work_incidents.colleague_help.choices.help.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.colleague_help.help;
                    return I18n.t('events.work_incidents.colleague_help.choices.help.hint', conf.energyCost, conf.socialGain);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.colleague_help.help;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
                    return { message: I18n.t('events.work_incidents.colleague_help.messages.help'), type: 'positive' };
                }
            },
            {
                id: 'decline', text: I18n.t('events.work_incidents.colleague_help.choices.decline.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.colleague_help.decline;
                    return I18n.t('events.work_incidents.colleague_help.choices.decline.hint', conf.mentalGain, conf.socialLoss, conf.workEfficiencyLoss);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.colleague_help.decline;
                    state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.mentalGain);
                    state.socialValue = Math.max(0, (state.socialValue || 0) - conf.socialLoss);
                    state.workEfficiency = Math.max(0, (state.workEfficiency || 100) - conf.workEfficiencyLoss);
                    return { message: I18n.t('events.work_incidents.colleague_help.messages.decline'), type: 'neutral' };
                }
            }
        ]
    },
    {
        id: 'overtime_request',
        title: I18n.t('events.work_incidents.overtime_request.title'),
        choices: [
            {
                id: 'accept', text: I18n.t('events.work_incidents.overtime_request.choices.accept.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.overtime_request.accept;
                    return I18n.t('events.work_incidents.overtime_request.choices.accept.hint', conf.energyCost, conf.workEfficiencyGain);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.overtime_request.accept;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.workEfficiency = Math.min(GameData.initialState.maxWorkEfficiency, (state.workEfficiency || 100) + conf.workEfficiencyGain);
                    return { message: I18n.t('events.work_incidents.overtime_request.messages.accept'), type: 'positive' };
                }
            },
            {
                id: 'refuse', text: I18n.t('events.work_incidents.overtime_request.choices.refuse.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.overtime_request.refuse;
                    return I18n.t('events.work_incidents.overtime_request.choices.refuse.hint', conf.socialLoss, conf.workEfficiencyLoss);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.overtime_request.refuse;
                    state.socialValue = Math.max(0, (state.socialValue || 0) - conf.socialLoss);
                    state.workEfficiency = Math.max(0, (state.workEfficiency || 100) - conf.workEfficiencyLoss);
                    return { message: I18n.t('events.work_incidents.overtime_request.messages.refuse'), type: 'negative' };
                }
            }
        ]
    },
    {
        id: 'system_crash',
        title: I18n.t('events.work_incidents.system_crash.title'),
        choices: [
            {
                id: 'rest', text: I18n.t('events.work_incidents.system_crash.choices.rest.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.system_crash.rest;
                    return I18n.t('events.work_incidents.system_crash.choices.rest.hint', conf.energyGain);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.system_crash.rest;
                    state.energy = Math.min(GameData.initialState.maxEnergy, state.energy + conf.energyGain);
                    return { message: I18n.t('events.work_incidents.system_crash.messages.rest'), type: 'positive' };
                }
            },
            {
                id: 'help', text: I18n.t('events.work_incidents.system_crash.choices.help.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.system_crash.help;
                    return I18n.t('events.work_incidents.system_crash.choices.help.hint', conf.energyCost, conf.socialGain);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.system_crash.help;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
                    return { message: I18n.t('events.work_incidents.system_crash.messages.help'), type: 'positive' };
                }
            }
        ]
    },
    {
        id: 'client_meeting',
        title: I18n.t('events.work_incidents.client_meeting.title'),
        choices: [
            {
                id: 'prepare', text: I18n.t('events.work_incidents.client_meeting.choices.prepare.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.client_meeting.prepare;
                    return I18n.t('events.work_incidents.client_meeting.choices.prepare.hint', conf.energyCost, conf.baseSocialGain);
                },
                condition: (state) => (state.workEfficiency || 100) > GameData.eventConfigs.client_meeting.prepare.minEfficiency,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.client_meeting.prepare;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    const social = state.socialValue || 50;
                    let gain = conf.baseSocialGain;
                    if (social >= conf.highSocialThreshold) gain += conf.highSocialGain;
                    else if (social < conf.lowSocialThreshold) gain = Math.floor(gain / 2);
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + gain);
                    const msg = social >= conf.highSocialThreshold
                        ? I18n.t('events.work_incidents.client_meeting.messages.prepareHighSocial')
                        : I18n.t('events.work_incidents.client_meeting.messages.prepare');
                    return { message: msg, type: 'positive' };
                }
            },
            {
                id: 'wing_it', text: I18n.t('events.work_incidents.client_meeting.choices.wing_it.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.client_meeting.wing_it;
                    return I18n.t('events.work_incidents.client_meeting.choices.wing_it.hint', conf.mentalGain, conf.socialLoss);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.client_meeting.wing_it;
                    state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.mentalGain);
                    const efficiency = state.workEfficiency || 100;
                    const risk = Math.max(0.05, Math.min(0.9, conf.baseRisk - (efficiency - 100) * conf.efficiencyImpact));
                    if (context.rng.random() < risk) {
                        state.socialValue = Math.max(0, (state.socialValue || 0) - conf.socialLoss);
                        return { message: I18n.t('events.work_incidents.client_meeting.messages.wing_it_bad'), type: 'negative' };
                    }
                    return { message: I18n.t('events.work_incidents.client_meeting.messages.wing_it_ok'), type: 'neutral' };
                }
            }
        ]
    },
    {
        id: 'office_drama',
        title: I18n.t('events.work_incidents.office_drama.title'),
        choices: [
            {
                id: 'listen', text: I18n.t('events.work_incidents.office_drama.choices.listen.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.office_drama.listen;
                    return I18n.t('events.work_incidents.office_drama.choices.listen.hint', conf.mentalGain, conf.energyCost, conf.socialGain);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.office_drama.listen;
                    state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.mentalGain);
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
                    return { message: I18n.t('events.work_incidents.office_drama.messages.listen'), type: 'neutral' };
                }
            },
            {
                id: 'avoid', text: I18n.t('events.work_incidents.office_drama.choices.avoid.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.office_drama.avoid;
                    return I18n.t('events.work_incidents.office_drama.choices.avoid.hint', conf.healthGain, conf.socialLoss);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.office_drama.avoid;
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);
                    state.socialValue = Math.max(0, (state.socialValue || 0) - conf.socialLoss);
                    return { message: I18n.t('events.work_incidents.office_drama.messages.avoid'), type: 'positive' };
                }
            }
        ]
    },
    {
        id: 'presentation',
        title: I18n.t('events.work_incidents.presentation.title'),
        choices: [
            {
                id: 'lead', text: I18n.t('events.work_incidents.presentation.choices.lead.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.presentation.lead;
                    return I18n.t('events.work_incidents.presentation.choices.lead.hint', conf.energyCost, conf.baseSocialGain, conf.workEfficiencyGain);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.presentation.lead;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    const social = state.socialValue || 50;
                    let gain = conf.baseSocialGain;
                    if (social >= conf.highSocialThreshold) gain += conf.highSocialGain;
                    else if (social < conf.lowSocialThreshold) gain = Math.floor(gain / 2);
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + gain);
                    state.workEfficiency = Math.min(GameData.initialState.maxWorkEfficiency, (state.workEfficiency || 100) + conf.workEfficiencyGain);
                    const msg = social >= conf.highSocialThreshold
                        ? I18n.t('events.work_incidents.presentation.messages.leadHighSocial')
                        : I18n.t('events.work_incidents.presentation.messages.lead');
                    return { message: msg, type: 'positive' };
                }
            },
            {
                id: 'support', text: I18n.t('events.work_incidents.presentation.choices.support.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.presentation.support;
                    return I18n.t('events.work_incidents.presentation.choices.support.hint', conf.energyCost, conf.socialGain, conf.workEfficiencyGain);
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.presentation.support;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
                    state.workEfficiency = Math.min(GameData.initialState.maxWorkEfficiency, (state.workEfficiency || 100) + conf.workEfficiencyGain);
                    return { message: I18n.t('events.work_incidents.presentation.messages.support'), type: 'neutral' };
                }
            }
        ]
    }
];

export function getAvailableIncidents(state, context) {
    if (state.period !== 'day' || state.job !== 'fulltime') return [];
    // V2.55 修复：工作突发事件仅在工作日触发
    if (state.day % GameData.timeCycle.weekDays === GameData.timeCycle.restDayMod) return [];
    if (context.rng.random() < 0.4) {
        const available = workIncidents.filter((incident) => !incident.condition || incident.condition(state, context));
        if (available.length === 0) return [];
        const incident = available[Math.floor(context.rng.random() * available.length)];
        return [incident];
    }
    return [];
}

export function getIncidentById(incidentId) {
    return workIncidents.find(i => i.id === incidentId);
}
