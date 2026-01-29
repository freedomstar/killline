/**
 * Hospitalization Events
 */
import { I18n } from '../i18n.js';
import { GameData } from '../data/index.js';

export const hospitalEvents = [
    {
        id: 'hospital_stay',
        type: 'special',
        title: I18n.t('events.hospital_stay.title'),
        description: (state) => {
            const daysLeft = state.hospitalDaysLeft || 1;
            const cost = state.hospitalDailyCost || 0;
            let desc = I18n.t('events.hospital_stay.description', daysLeft, cost);

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
        period: 'day', // Hospital stay is resolved during the day
        condition: (state) => (state.hospitalDaysLeft || 0) > 0,
        weight: GameData.eventWeights.hospital_stay,
        choices: [
            {
                text: I18n.t('events.hospital_stay_choices.paid_leave.text'),
                hint: (state) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    return I18n.t('events.hospital_stay_choices.paid_leave.hint', hospConfig.healthRecoveryPerDay, hospConfig.energyRecoveryPerDay);
                },
                hintType: 'positive',
                condition: (state) => state.job === 'fulltime' &&
                    state.day % GameData.timeCycle.weekDays !== GameData.timeCycle.restDayMod &&
                    (state.sickLeaveDays || 0) > 0,
                effect: (state, context) => {
                    state.hospitalDaysLeft--;
                    state.sickLeaveDays--;
                    state.hospitalBill = (state.hospitalBill || 0) + (state.hospitalDailyCost || 0);

                    // Recovery
                    const hospConfig = GameData.healthConstants.hospitalization;
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + hospConfig.healthRecoveryPerDay);
                    state.energy = Math.min(GameData.initialState.maxEnergy, state.energy + hospConfig.energyRecoveryPerDay);

                    return { message: I18n.t('events.hospital_stay_choices.paid_leave.message'), type: 'positive', ignoreLunch: true };
                }
            },
            {
                text: I18n.t('events.hospital_stay_choices.rest_day.text'),
                hint: (state) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    return I18n.t('events.hospital_stay_choices.rest_day.hint', hospConfig.healthRecoveryPerDay, hospConfig.energyRecoveryRestDay);
                },
                hintType: 'neutral',
                condition: (state) => state.day % GameData.timeCycle.weekDays === GameData.timeCycle.restDayMod,
                effect: (state, context) => {
                    state.hospitalDaysLeft--;
                    state.hospitalBill = (state.hospitalBill || 0) + (state.hospitalDailyCost || 0);

                    const hospConfig = GameData.healthConstants.hospitalization;
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + hospConfig.healthRecoveryPerDay);
                    state.energy = Math.min(GameData.initialState.maxEnergy, state.energy + hospConfig.energyRecoveryRestDay); // Rest day recovers more energy

                    return { message: I18n.t('events.hospital_stay_choices.rest_day.message'), type: 'neutral', ignoreLunch: true };
                }
            },
            {
                text: I18n.t('events.hospital_stay_choices.unpaid_leave.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.routine_events.hospital_stay.unpaid_leave;
                    const hospConfig = GameData.healthConstants.hospitalization;
                    return I18n.t('events.hospital_stay_choices.unpaid_leave.hint', conf.baseRisk, hospConfig.healthRecoveryPerDay);
                },
                hintType: 'danger',
                condition: (state) => state.job === 'fulltime' &&
                    state.day % GameData.timeCycle.weekDays !== GameData.timeCycle.restDayMod &&
                    (state.sickLeaveDays || 0) <= 0,
                effect: (state, context) => {
                    state.hospitalDaysLeft--;
                    state.hospitalBill = (state.hospitalBill || 0) + (state.hospitalDailyCost || 0);
                    state.consecutiveUnpaidDays = (state.consecutiveUnpaidDays || 0) + 1;

                    // Deduct pay (10% of monthly income per day)
                    const jobInfo = GameData.jobTypes[state.job];
                    const baseIncome = state.monthlyIncome || (jobInfo ? jobInfo.income : 0);
                    const dailyPay = baseIncome / 10;
                    state.dailyFinancialReport.push(I18n.t('events.hospital_stay_choices.unpaid_leave.report', dailyPay));

                    // Increase fire risk
                    const fireChance = state.consecutiveUnpaidDays * 0.15;

                    // Recovery
                    const hospConfig = GameData.healthConstants.hospitalization;
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + hospConfig.healthRecoveryPerDay);

                    if (context.rng.random() < fireChance) {
                        state.job = 'fired';
                        state.monthlyIncome = 0;
                        state.unemployedDays = 0;
                        if (state.insurance.healthPlanId === 'employer_basic' || state.insurance.healthPlanId === 'employer_premium') {
                            return { message: I18n.t('events.hospital_stay_choices.unpaid_leave.fired_no_ins'), type: 'danger', ignoreLunch: true };
                        }
                        return { message: I18n.t('events.hospital_stay_choices.unpaid_leave.fired'), type: 'danger', ignoreLunch: true };
                    }

                    return { message: I18n.t('events.hospital_stay_choices.unpaid_leave.message', Math.round(fireChance * 100)), type: 'negative', ignoreLunch: true };
                }
            },
            {
                text: I18n.t('events.hospital_stay_choices.out_of_pocket.text'),
                hint: (state) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    return I18n.t('events.hospital_stay_choices.out_of_pocket.hint', hospConfig.outOfPocketHealthGain);
                },
                hintType: 'neutral',
                condition: (state) => state.job !== 'fulltime', // Unemployed/Fired/Jobless
                effect: (state, context) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    state.hospitalDaysLeft--;
                    state.hospitalBill = (state.hospitalBill || 0) + (state.hospitalDailyCost || 0);
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + hospConfig.outOfPocketHealthGain);
                    return { message: I18n.t('events.hospital_stay_choices.out_of_pocket.message'), type: 'neutral', ignoreLunch: true };
                }
            },
            {
                text: I18n.t('events.hospital_stay_choices.ama.text'),
                hint: I18n.t('events.hospital_stay_choices.ama.hint', GameData.healthConstants.hospitalization.amaHealthMin, GameData.healthConstants.hospitalization.amaMentalPenalty),
                hintType: 'danger',
                condition: (state) => state.health >= GameData.healthConstants.hospitalization.amaHealthMin,
                effect: (state, context) => {
                    const hospConfig = GameData.healthConstants.hospitalization;
                    state.hospitalDaysLeft = 0;
                    state.health = Math.max(state.health, hospConfig.amaHealthMin);
                    state.mental -= hospConfig.amaMentalPenalty;
                    state.hospitalBill = (state.hospitalBill || 0) + hospConfig.amaExtraCost;
                    state.consecutiveUnpaidDays = 0;
                    return { message: I18n.t('events.hospital_stay_choices.ama.message'), type: 'negative', ignoreLunch: true };
                }
            }
        ]
    }
];
