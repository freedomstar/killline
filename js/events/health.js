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
                    const res = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(opt.baseCost) : { youPay: opt.baseCost, insurancePays: 0 };
                    return I18n.t('events.feeling_under_weather.choices.clinic.hint', res.youPay, opt.effectiveness, opt.failHealthLoss, res.insurancePays, opt.baseCost);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const opt = GameData.medicalSystem.treatmentOptions.minuteClinic;
                    // V2.XX: 通用医疗费用计算（包含保险）
                    const result = context.game.calculateMedicalCost(opt.baseCost);
                    context.game.commitMedicalTransaction(result); // 实装免赔额/自付上限
                    context.game.deductMoney(result.youPay, 'medical', { state: context.game.state, allowInstallment: true });

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
                    context.game.deductMoney(conf.cost, 'medical', { state: context.game.state, allowInstallment: true });
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
    // 2. 症状加重 (Stage 2)
    {
        id: 'worsening_symptoms',
        type: 'health',
        title: I18n.t('events.worsening_symptoms.title'),
        description: I18n.t('events.worsening_symptoms.description'),
        period: 'any',
        condition: (state) => state.healthStatus === 'sick' || state.healthStatus === 'cold',
        weight: GameData.eventWeights.worsening_symptoms,
        isRandom: true,
        choices: [
            {
                text: I18n.t('events.worsening_symptoms.choices.urgentCare.text'),
                hint: (state) => {
                    const baseCost = GameData.medicalSystem.treatmentOptions.urgentCare.baseCost;
                    const res = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(baseCost, true) : { youPay: baseCost, insurancePays: 0 };
                    const conf = GameData.eventConfigs.worsening_symptoms.urgentCare;
                    return I18n.t('events.worsening_symptoms.choices.urgentCare.hint', res.youPay, conf.healthGain, res.insurancePays, baseCost);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const baseCost = GameData.medicalSystem.treatmentOptions.urgentCare.baseCost;
                    const conf = GameData.eventConfigs.worsening_symptoms.urgentCare;
                    const result = context.game.calculateMedicalCost(baseCost, true);
                    context.game.commitMedicalTransaction(result);
                    context.game.deductMoney(result.youPay, 'medical', { state: context.game.state, allowInstallment: true });
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);

                    let msg = I18n.t('events.worsening_symptoms.messages.urgentCareTreated', result.youPay);
                    if (result.riskFactor?.isOutOfNetwork) {
                        msg += I18n.t('events.worsening_symptoms.messages.urgentCareOutOfNetwork');
                        state.mental -= conf.oonMentalLoss;
                    }

                    return { message: msg + I18n.t('events.worsening_symptoms.messages.urgentCareResult'), type: result.riskFactor?.isOutOfNetwork ? 'negative' : 'neutral' };
                }
            },
            {
                text: I18n.t('events.worsening_symptoms.choices.pcp.text'),
                hint: (state) => {
                    const wait = state.insurance.healthPlanId === 'medicaid' ? '7-14' : '3-7';
                    return I18n.t('events.worsening_symptoms.choices.pcp.hint', wait);
                },
                hintType: 'warning',
                effect: (state, context) => {
                    const isMedicaid = state.insurance.healthPlanId === 'medicaid';
                    state.insurance.waitingForDoctor = isMedicaid ? (Math.floor(context.rng.random() * (14 - 7 + 1)) + 7) : (Math.floor(context.rng.random() * (7 - 3 + 1)) + 3);
                    state.pendingDoctorVisit = false;

                    return {
                        message: I18n.t('events.worsening_symptoms.messages.pcpBooked', state.insurance.waitingForDoctor),
                        type: 'neutral'
                    };
                }
            },
            {
                text: I18n.t('events.worsening_symptoms.choices.er.text'),
                hint: (state) => {
                    const baseCost = GameData.medicalSystem.treatmentOptions.er.baseCost;
                    const res = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(baseCost, true) : { youPay: baseCost, insurancePays: 0 };
                    const conf = GameData.eventConfigs.worsening_symptoms.er;
                    const healthDelta = conf.healthSetTo - (state.health || 0);
                    const signedDelta = healthDelta > 0 ? `+${healthDelta}` : `${healthDelta}`;
                    return I18n.t('events.worsening_symptoms.choices.er.hint', signedDelta, res.youPay, res.insurancePays, baseCost);
                },
                hintType: 'danger',
                condition: (state) => state.health <= 70,
                effect: (state, context) => {
                    const baseCost = GameData.medicalSystem.treatmentOptions.er.baseCost;
                    const conf = GameData.eventConfigs.worsening_symptoms.er;
                    const result = context.game.calculateMedicalCost(baseCost, true);
                    context.game.commitMedicalTransaction(result);
                    context.game.deductMoney(result.youPay, 'medical', { state: context.game.state, allowInstallment: true });

                    state.maxHealth = Math.max(state.maxHealth || 0, 80);
                    state.health = conf.healthSetTo;

                    let msg = I18n.t('events.worsening_symptoms.messages.erTreated', result.youPay);
                    if (result.riskFactor?.isDenied) msg += I18n.t('events.worsening_symptoms.messages.erDenied');

                    return { message: msg, type: 'neutral' };
                }
            }
        ]
    },

    // 3. 医疗紧急情况 (Stage 3)
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
                    const res = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(totalBase, true) : { youPay: totalBase, insurancePays: 0 };
                    const delta = emergConfig.erHealthRecovery - (state.health || 0);
                    const signedDelta = delta > 0 ? `+${delta}` : `${delta}`;
                    return I18n.t('events.medical_emergency.choices.ambulance.hint', signedDelta, emergConfig.ambulanceMentalLoss, res.youPay, res.insurancePays, totalBase);
                },
                hintType: 'danger',
                effect: (state, context) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    const emergConfig = GameData.healthConstants.medicalEmergency;
                    const ambulanceCost = hospConfig.ambulanceCost;
                    const erCost = GameData.medicalSystem.treatmentOptions.er.baseCost;

                    const totalBase = ambulanceCost + erCost;
                    const result = context.game.calculateMedicalCost(totalBase, true);
                    context.game.commitMedicalTransaction(result); // 实装免赔额/自付上限

                    context.game.deductMoney(result.youPay, 'medical', { state: context.game.state, allowInstallment: true });
                    state.health = emergConfig.erHealthRecovery;
                    state.mental -= emergConfig.ambulanceMentalLoss;

                    // 使用平均恢复值估算住院天数
                    const averageRecovery = (hospConfig.healthRecoveryMin + hospConfig.healthRecoveryMax) / 2;
                    const healthDeficit = hospConfig.dischargeHealthMin - state.health;
                    state.hospitalDaysLeft = Math.max(1, Math.ceil(healthDeficit / averageRecovery));

                    const dailyBase = hospConfig.dailyBaseCost;
                    const dailyResult = context.game.calculateMedicalCost(dailyBase, false);
                    context.game.commitMedicalTransaction(dailyResult); // 实装免赔额/自付上限
                    state.hospitalDailyCost = dailyResult.youPay;
                    state.hospitalDailyCost = dailyResult.youPay;
                    state.hospitalBill = 0;

                    // Surgery Approval Cancellation Logic
                    if (state.surgeryApprovalDaysLeft > 0 || state.surgeryApprovalPending) {
                        state.surgeryApprovalDaysLeft = 0;
                        state.surgeryApprovalPending = false;
                        if (state.eventQueue) {
                            state.eventQueue = state.eventQueue.filter(e => e.id !== 'surgery_approval');
                        }
                        context.game.pushDailyReport && context.game.pushDailyReport({
                            key: 'events.medical_emergency.messages.surgeryCancelled',
                            fallback: I18n.t('events.medical_emergency.messages.surgeryCancelled')
                        }, state);
                    }

                    return { message: I18n.t('events.medical_emergency.messages.ambulanceSaved', result.youPay, state.hospitalDaysLeft), type: 'negative' };
                }
            },
            {
                text: I18n.t('events.medical_emergency.choices.uber.text'),
                hint: (state) => {
                    const emergConfig = GameData.healthConstants.medicalEmergency;
                    const erCost = GameData.medicalSystem.treatmentOptions.er.baseCost;
                    const res = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(erCost, true) : { youPay: erCost, insurancePays: 0 };
                    const totalCost = res.youPay + emergConfig.uberCost;
                    const totalBase = erCost + emergConfig.uberCost;
                    const delta = emergConfig.erHealthRecovery - (state.health || 0);
                    const signedDelta = delta > 0 ? `+${delta}` : `${delta}`;
                    return I18n.t('events.medical_emergency.choices.uber.hint', totalCost, Math.round(emergConfig.uberDeathChance * 100), signedDelta, res.insurancePays, totalBase);
                },
                hintType: 'danger',
                effect: (state, context) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    const emergConfig = GameData.healthConstants.medicalEmergency;

                    if (context.rng.random() < emergConfig.uberDeathChance) {
                        state.health = 0;
                        state.forcedGameOver = true;
                        return { message: I18n.t('events.medical_emergency.messages.uberDied'), type: 'negative' };
                    }

                    const erCost = GameData.medicalSystem.treatmentOptions.er.baseCost;
                    const result = context.game.calculateMedicalCost(erCost, true);
                    context.game.commitMedicalTransaction(result); // 实装免赔额/自付上限

                    context.game.deductMoney(result.youPay + emergConfig.uberCost, 'medical', { state: context.game.state, allowInstallment: true });
                    state.health = emergConfig.erHealthRecovery;

                    // 使用平均恢复值估算住院天数
                    const averageRecovery = (hospConfig.healthRecoveryMin + hospConfig.healthRecoveryMax) / 2;
                    const healthDeficit = hospConfig.dischargeHealthMin - state.health;
                    state.hospitalDaysLeft = Math.max(1, Math.ceil(healthDeficit / averageRecovery));

                    const dailyBase = hospConfig.dailyBaseCost;
                    const dailyResult = context.game.calculateMedicalCost(dailyBase, false);
                    context.game.commitMedicalTransaction(dailyResult); // 实装免赔额/自付上限
                    state.hospitalDailyCost = dailyResult.youPay;
                    state.hospitalBill = 0;

                    // Surgery Approval Cancellation Logic
                    if (state.surgeryApprovalDaysLeft > 0 || state.surgeryApprovalPending) {
                        state.surgeryApprovalDaysLeft = 0;
                        state.surgeryApprovalPending = false;
                        if (state.eventQueue) {
                            state.eventQueue = state.eventQueue.filter(e => e.id !== 'surgery_approval');
                        }
                        context.game.pushDailyReport && context.game.pushDailyReport({
                            key: 'events.medical_emergency.messages.surgeryCancelled',
                            fallback: I18n.t('events.medical_emergency.messages.surgeryCancelled')
                        }, state);
                    }

                    return { message: I18n.t('events.medical_emergency.messages.uberSaved', result.youPay, state.hospitalDaysLeft), type: 'neutral' };
                }
            },
            {
                text: I18n.t('events.medical_emergency.choices.giveUp.text'),
                hint: (state) => I18n.t('events.medical_emergency.choices.giveUp.hint', state.health || 0),
                hintType: 'danger',
                effect: (state, context) => {
                    state.health = 0;
                    state.forcedGameOver = true;
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
        condition: (state) => state.health < 40 &&
            state.health >= 30 &&
            state.healthStatus !== 'critical' &&
            (state.hospitalDaysLeft || 0) <= 0 &&
            state.insurance.healthPlanId !== 'none',
        choices: [
            {
                text: I18n.t('events.emergency_oon.choices.nearest.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.special_events.emergency_oon.nearest;
                    const oonCost = conf.baseCost;
                    const res = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(conf.baseCost) : { youPay: conf.baseCost, insurancePays: 0 };
                    return I18n.t('events.emergency_oon.choices.nearest.hint', conf.oonChance * 100, conf.healthGain, conf.mentalCost, oonCost, res.youPay, res.insurancePays, conf.baseCost);
                },
                hintType: 'negative',
                condition: (state) => true,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.special_events.emergency_oon.nearest;
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);
                    if (context.rng.random() < conf.oonChance) {
                        const oonCost = conf.baseCost;
                        // OON treatment is usually not covered by insurance, so no commitMedicalTransaction
                        context.game.deductMoney(oonCost, 'medical', { state: context.game.state, allowInstallment: true });
                        state.mental -= conf.mentalCost;
                        return { message: I18n.t('events.emergency_oon.messages.oon', oonCost), type: 'negative' };
                    } else {
                        const result = context.game.calculateMedicalCost(conf.baseCost);
                        context.game.commitMedicalTransaction(result);
                        context.game.deductMoney(result.youPay, 'medical', { state: context.game.state, allowInstallment: true });
                        return { message: I18n.t('events.emergency_oon.messages.network', result.youPay), type: 'positive' };
                    }
                }
            },
            {
                text: I18n.t('events.emergency_oon.choices.inNetwork.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.special_events.emergency_oon.inNetwork;
                    const res = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(conf.baseCost) : { youPay: conf.baseCost, insurancePays: 0 };
                    return I18n.t('events.emergency_oon.choices.inNetwork.hint', conf.healthLoss, conf.mentalLoss, res.youPay, res.insurancePays, conf.baseCost);
                },
                hintType: 'negative',
                condition: (state) => true,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.special_events.emergency_oon.inNetwork;
                    state.health = Math.max(0, state.health - conf.healthLoss);
                    state.mental -= conf.mentalLoss;
                    const result = context.game.calculateMedicalCost(conf.baseCost);
                    context.game.commitMedicalTransaction(result);
                    context.game.deductMoney(result.youPay, 'medical', { state: context.game.state, allowInstallment: true });
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
                    // Urgent = Denied (No Prior Auth)
                    const risk = { isDenied: true, note: '未获审批' };
                    const res = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(conf.baseCost, false, risk) : { youPay: conf.baseCost, insurancePays: 0 };
                    return I18n.t('events.surgery_required.choices.urgent.hint', res.youPay, conf.healthGain, conf.mentalLoss, res.insurancePays, conf.baseCost);
                },
                hintType: 'negative',
                condition: (state) => true,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.surgery_required.urgent;
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);
                    // Urgent = Denied
                    const risk = { isDenied: true, note: '未获审批' };
                    const result = context.game.calculateMedicalCost(conf.baseCost, false, risk);
                    context.game.commitMedicalTransaction(result);
                    context.game.deductMoney(result.youPay, 'medical', { state: context.game.state, allowInstallment: true });
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
                    // Success: Approved (Standard Insurance)
                    const sRes = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(urgentConf.baseCost) : { youPay: urgentConf.baseCost, insurancePays: 0 };
                    // Fail: Denied (Full Cost)
                    const fRisk = { isDenied: true, note: '申诉失败' };
                    const fCost = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(conf.failCost, false, fRisk).youPay : conf.failCost;
                    return I18n.t('events.surgery_required.choices.fight.hint', conf.cost, conf.healthLoss, conf.successChance, sRes.youPay, fCost, sRes.insurancePays, urgentConf.baseCost);
                },
                hintType: 'neutral',
                condition: (state) => state.mental >= 40,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.surgery_required.fight;
                    state.mental -= conf.cost;
                    state.health -= conf.healthLoss;

                    // Whether approved or denied, the surgery is performed
                    const urgentConf = GameData.eventConfigs.surgery_required.urgent;
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + urgentConf.healthGain);

                    if (context.rng.random() < (conf.successChance / 100)) {
                        // Success: Approved!
                        const result = context.game.calculateMedicalCost(urgentConf.baseCost);
                        context.game.commitMedicalTransaction(result);
                        context.game.deductMoney(result.youPay, 'medical', { state: context.game.state, allowInstallment: true });
                        return { message: I18n.t('events.surgery_required.messages.fightSuccess', result.youPay), type: 'positive' };
                    } else {
                        // Fail: Denied
                        const risk = { isDenied: true, note: '申诉失败' };
                        const result = context.game.calculateMedicalCost(conf.failCost, false, risk);
                        context.game.commitMedicalTransaction(result);
                        context.game.deductMoney(result.youPay, 'medical', { state: context.game.state, allowInstallment: true });
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
                    const urgentConf = GameData.eventConfigs.surgery_required.urgent;

                    // Success: Approved (Standard Insurance Calculation)
                    const sRes = window.game?.calculateMedicalCost ? window.game.calculateMedicalCost(urgentConf.baseCost) : { youPay: urgentConf.baseCost, insurancePays: 0 };

                    return I18n.t(
                        'events.surgery_approval.choices.check.hint',
                        Math.round(conf.successChance * 100),
                        sRes.youPay,
                        conf.successHealthGain,
                        conf.failHealthGain,
                        conf.failMentalLoss,
                        sRes.insurancePays,
                        urgentConf.baseCost
                    );
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.surgery_required.approval;
                    const urgentConf = GameData.eventConfigs.surgery_required.urgent;
                    state.surgeryApprovalPending = false;
                    state.surgeryApprovalDaysLeft = 0;

                    if (context.rng.random() < conf.successChance) {
                        // Success: Approved!
                        const result = context.game.calculateMedicalCost(urgentConf.baseCost);
                        context.game.commitMedicalTransaction(result);
                        context.game.deductMoney(result.youPay, 'medical', { state: context.game.state, allowInstallment: true });
                        state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.successHealthGain);
                        return { message: I18n.t('events.surgery_approval.messages.approved', result.youPay, conf.successHealthGain), type: 'positive' };
                    }

                    // Fail: Denied
                    const failCost = Math.round(urgentConf.baseCost * conf.failCostMultiplier);
                    const risk = { isDenied: true, note: '审批拒绝' };
                    const failResult = context.game.calculateMedicalCost(failCost, false, risk);
                    context.game.commitMedicalTransaction(failResult);

                    context.game.deductMoney(failResult.youPay, 'medical', { state: context.game.state, allowInstallment: true });
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
                    return (state.money || 0) >= conf.moneyCost;
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.fastfood_warning.healthy;
                    context.game.deductMoney(conf.moneyCost, 'daily', { state: context.game.state });
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
        description: (state) => {
            const medicalDebt = (state.debtItems || [])
                .filter(item => item.source === 'medical')
                .reduce((sum, item) => sum + (item.amount || 0), 0);
            return I18n.t('events.medical_debt_collection.description', medicalDebt);
        },
        period: 'any',
        weight: GameData.eventWeights.medical_debt_collection,
        condition: (state) => {
            const medicalDebt = (state.debtItems || [])
                .filter(item => item.source === 'medical')
                .reduce((sum, item) => sum + (item.amount || 0), 0);
            return medicalDebt >= 500;
        },
        isRandom: true,
        choices: [
            {
                text: I18n.t('events.medical_debt_collection.choices.pay.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.medical_debt.collection;
                    const medicalDebt = (state.debtItems || [])
                        .filter(item => item.source === 'medical')
                        .reduce((sum, item) => sum + (item.amount || 0), 0);
                    return I18n.t('events.medical_debt_collection.choices.pay.hint', medicalDebt, conf.payCreditGain, conf.payMentalGain);
                },
                hintType: 'negative',
                condition: (state) => {
                    const medicalDebt = (state.debtItems || [])
                        .filter(item => item.source === 'medical')
                        .reduce((sum, item) => sum + (item.amount || 0), 0);
                    return (state.money || 0) >= medicalDebt;
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.medical_debt.collection;
                    const medicalDebt = (state.debtItems || [])
                        .filter(item => item.source === 'medical')
                        .reduce((sum, item) => sum + (item.amount || 0), 0);
                    const result = context.game.repayDebt(medicalDebt, { state: context.game.state });
                    state.creditScore = Math.min(850, (state.creditScore || 750) + conf.payCreditGain);
                    state.mental = Math.min(GameData.initialState.maxMental, (state.mental || 100) + conf.payMentalGain);
                    return { message: I18n.t('events.medical_debt_collection.messages.paid', result.paid || medicalDebt), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.medical_debt_collection.choices.installment.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.medical_debt.collection;
                    const monthlyAmount = GameData.debtConfig?.medicalInstallmentMonthly || conf.installmentAmount;
                    return I18n.t('events.medical_debt_collection.choices.installment.hint', monthlyAmount, conf.creditLoss, conf.installmentMentalLoss);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.medical_debt.collection;
                    const medicalDebt = (state.debtItems || [])
                        .filter(item => item.source === 'medical')
                        .reduce((sum, item) => sum + (item.amount || 0), 0);
                    const monthlyAmount = GameData.debtConfig?.medicalInstallmentMonthly || conf.installmentAmount;
                    // Note: Actual installment logic handled by addMedicalInstallment if used, 
                    // but here we manually split for legacy compatibility or direct debt management
                    context.game.addMedicalInstallment(medicalDebt, { state });

                    state.creditScore = Math.max(300, (state.creditScore || 750) - conf.creditLoss);
                    state.mental -= conf.installmentMentalLoss;
                    return { message: I18n.t('events.medical_debt_collection.messages.installment', monthlyAmount), type: 'neutral' };
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
                    state.creditScore = Math.max(300, (state.creditScore || 750) - conf.refuseCreditLoss);
                    state.mental -= conf.refuseMentalLoss;
                    return { message: I18n.t('events.medical_debt_collection.messages.refused'), type: 'negative' };
                }
            }
        ]
    }
];
