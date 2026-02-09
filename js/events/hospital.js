/**
 * Hospitalization Events
 */
import { I18n } from '../i18n.js';
import { GameData } from '../data/index.js';

const finalizeHospitalDischarge = (state, context) => {
    if ((state.hospitalDaysLeft || 0) > 0) return;
    const bill = state.hospitalBill || 0;
    if (bill > 0) {
        if (context && context.game && context.game.addMedicalInstallment) {
            context.game.addMedicalInstallment(bill, { state });
        } else {
            state.debt = (state.debt || 0) + bill;
            if (!Array.isArray(state.debtItems)) state.debtItems = [];
            state.debtItems.push({ source: 'medical', amount: Math.round(bill), day: state.day || 0 });
        }
    }
    state.hospitalBill = 0;
    state.hospitalDailyCost = 0;
    state.consecutiveUnpaidDays = 0;
};

// 计算随机健康恢复值
const getRandomHealthRecovery = (context) => {
    const hospConfig = GameData.healthConstants.hospitalization;
    const range = hospConfig.healthRecoveryMax - hospConfig.healthRecoveryMin;
    return hospConfig.healthRecoveryMin + Math.floor(context.rng.random() * (range + 1));
};

// 应用健康恢复并检查出院条件
const applyHealthRecoveryAndCheckDischarge = (state, context) => {
    const hospConfig = GameData.healthConstants.hospitalization;
    const recoveryAmount = getRandomHealthRecovery(context);
    state.health = Math.min(GameData.initialState.maxHealth, state.health + recoveryAmount);

    // 检查是否达到出院健康值
    if (state.health >= hospConfig.dischargeHealthMin) {
        state.hospitalDaysLeft = 0;
    } else {
        // 更新估算剩余天数
        const averageRecovery = (hospConfig.healthRecoveryMin + hospConfig.healthRecoveryMax) / 2;
        const healthDeficit = hospConfig.dischargeHealthMin - state.health;
        state.hospitalDaysLeft = Math.max(1, Math.ceil(healthDeficit / averageRecovery));
    }

    return recoveryAmount;
};

export const hospitalEvents = [
    {
        id: 'hospital_stay',
        type: 'special',
        title: I18n.t('events.hospital_stay.title'),
        description: (state) => {
            const hospConfig = GameData.healthConstants.hospitalization;
            const daysLeft = state.hospitalDaysLeft || 1;
            const cost = state.hospitalDailyCost || 0;
            let desc = I18n.t('events.hospital_stay.description', state.health, hospConfig.dischargeHealthMin, daysLeft, cost);

            if (state.job === 'fulltime') {
                if (state.day % GameData.timeCycle.weekDays === GameData.timeCycle.restDayMod) {
                    desc += I18n.t('events.hospital_stay.descRestDay');
                } else if ((state.sickLeaveDays || 0) > 0) {
                    desc += I18n.t('events.hospital_stay.descPtoAvailable', state.sickLeaveDays);
                } else {
                    desc += I18n.t('events.hospital_stay.descPtoWarning');
                }
            }
            return desc;
        },
        period: 'day',
        condition: (state) => (state.hospitalDaysLeft || 0) > 0,
        weight: GameData.eventWeights.hospital_stay,
        choices: [
            {
                text: I18n.t('events.hospital_stay_choices.paid_leave.text'),
                hint: (state) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    return I18n.t('events.hospital_stay_choices.paid_leave.hint', hospConfig.healthRecoveryMin, hospConfig.healthRecoveryMax, hospConfig.energyRecoveryPerDay);
                },
                hintType: 'positive',
                condition: (state) => state.job === 'fulltime' &&
                    state.day % GameData.timeCycle.weekDays !== GameData.timeCycle.restDayMod &&
                    (state.sickLeaveDays || 0) > 0,
                effect: (state, context) => {
                    state.sickLeaveDays--;
                    state.hospitalBill = (state.hospitalBill || 0) + (state.hospitalDailyCost || 0);

                    const hospConfig = GameData.healthConstants.hospitalization;
                    const recoveredHealth = applyHealthRecoveryAndCheckDischarge(state, context);
                    state.energy = Math.min(GameData.initialState.maxEnergy, state.energy + hospConfig.energyRecoveryPerDay);

                    finalizeHospitalDischarge(state, context);
                    return { message: I18n.t('events.hospital_stay_choices.paid_leave.message', recoveredHealth), type: 'positive', ignoreLunch: true };
                }
            },
            {
                text: I18n.t('events.hospital_stay_choices.rest_day.text'),
                hint: (state) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    return I18n.t('events.hospital_stay_choices.rest_day.hint', hospConfig.healthRecoveryMin, hospConfig.healthRecoveryMax, hospConfig.energyRecoveryRestDay);
                },
                hintType: 'neutral',
                condition: (state) => state.day % GameData.timeCycle.weekDays === GameData.timeCycle.restDayMod,
                effect: (state, context) => {
                    state.hospitalBill = (state.hospitalBill || 0) + (state.hospitalDailyCost || 0);

                    const hospConfig = GameData.healthConstants.hospitalization;
                    const recoveredHealth = applyHealthRecoveryAndCheckDischarge(state, context);
                    state.energy = Math.min(GameData.initialState.maxEnergy, state.energy + hospConfig.energyRecoveryRestDay);

                    finalizeHospitalDischarge(state, context);
                    return { message: I18n.t('events.hospital_stay_choices.rest_day.message', recoveredHealth), type: 'neutral', ignoreLunch: true };
                }
            },
            {
                text: I18n.t('events.hospital_stay_choices.unpaid_leave.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.hospital_stay.unpaid_leave;
                    const hospConfig = GameData.healthConstants.hospitalization;
                    return I18n.t('events.hospital_stay_choices.unpaid_leave.hint', conf.baseRisk, hospConfig.healthRecoveryMin, hospConfig.healthRecoveryMax);
                },
                hintType: 'danger',
                condition: (state) => state.job === 'fulltime' &&
                    state.day % GameData.timeCycle.weekDays !== GameData.timeCycle.restDayMod &&
                    (state.sickLeaveDays || 0) <= 0,
                effect: (state, context) => {
                    state.hospitalBill = (state.hospitalBill || 0) + (state.hospitalDailyCost || 0);
                    state.consecutiveUnpaidDays = (state.consecutiveUnpaidDays || 0) + 1;

                    // Deduct pay
                    const jobInfo = GameData.jobTypes[state.job];
                    const baseIncome = state.monthlyIncome || (jobInfo ? jobInfo.income : 0);
                    const dailyPay = baseIncome / 10;
                    context.game.pushDailyReport && context.game.pushDailyReport({
                        key: 'events.hospital_stay_choices.unpaid_leave.report',
                        args: [dailyPay],
                        fallback: I18n.t('events.hospital_stay_choices.unpaid_leave.report', dailyPay)
                    }, state);

                    const fireChance = state.consecutiveUnpaidDays * 0.15;

                    const recoveredHealth = applyHealthRecoveryAndCheckDischarge(state, context);

                    if (context.rng.random() < fireChance) {
                        state.job = 'fired';
                        state.monthlyIncome = 0;
                        state.unemployedDays = 0;
                        if (state.insurance.healthPlanId === 'employer_basic' || state.insurance.healthPlanId === 'employer_premium') {
                            finalizeHospitalDischarge(state, context);
                            return { message: I18n.t('events.hospital_stay_choices.unpaid_leave.fired_no_ins'), type: 'danger', ignoreLunch: true };
                        }
                        finalizeHospitalDischarge(state, context);
                        return { message: I18n.t('events.hospital_stay_choices.unpaid_leave.fired'), type: 'danger', ignoreLunch: true };
                    }

                    finalizeHospitalDischarge(state, context);
                    return { message: I18n.t('events.hospital_stay_choices.unpaid_leave.message', recoveredHealth, Math.round(fireChance * 100)), type: 'negative', ignoreLunch: true };
                }
            },
            {
                text: I18n.t('events.hospital_stay_choices.out_of_pocket.text'),
                hint: (state) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    return I18n.t('events.hospital_stay_choices.out_of_pocket.hint', hospConfig.healthRecoveryMin, hospConfig.healthRecoveryMax);
                },
                hintType: 'neutral',
                condition: (state) => state.job !== 'fulltime',
                effect: (state, context) => {
                    state.hospitalBill = (state.hospitalBill || 0) + (state.hospitalDailyCost || 0);
                    const recoveredHealth = applyHealthRecoveryAndCheckDischarge(state, context);
                    finalizeHospitalDischarge(state, context);
                    return { message: I18n.t('events.hospital_stay_choices.out_of_pocket.message', recoveredHealth), type: 'neutral', ignoreLunch: true };
                }
            },
            {
                text: I18n.t('events.hospital_stay_choices.ama.text'),
                hint: (state) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    return I18n.t('events.hospital_stay_choices.ama.hint', hospConfig.amaHealthMin, hospConfig.amaMentalPenalty);
                },
                hintType: 'danger',
                // AMA只在健康值介于 amaHealthMin 和 dischargeHealthMin 之间时可用
                condition: (state) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    return state.health >= hospConfig.amaHealthMin && state.health < hospConfig.dischargeHealthMin;
                },
                effect: (state, context) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    state.hospitalDaysLeft = 0;
                    state.mental -= hospConfig.amaMentalPenalty;
                    state.hospitalBill = (state.hospitalBill || 0) + hospConfig.amaExtraCost;
                    finalizeHospitalDischarge(state, context);
                    return { message: I18n.t('events.hospital_stay_choices.ama.message'), type: 'negative', ignoreLunch: true };
                }
            }
        ]
    }
];
