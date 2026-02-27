/**
 * Night Events
 */
import { I18n } from '../i18n.js';
import { GameData } from '../data/index.js';
import { nightChoices } from './nightChoices.js';

export const nightEvents = [
    {
        id: 'night_choice',
        type: 'night',
        title: I18n.t('events.night_choice.title'),
        description: I18n.t('events.night_choice.description'),
        period: 'night',
        condition: (state) => true,
        weight: GameData.eventWeights.night_choice,
        isNightChoice: true,
        choices: [] // Generated dynamically
    },

    {
        id: 'homeless_night',
        type: 'system',
        title: I18n.t('events.homeless_night.title'),
        description: I18n.t('events.homeless_night.description'),
        period: 'night',
        condition: (state) => state.housing === 'homeless',
        weight: GameData.eventWeights.homeless_night,
        choices: [
            {
                text: I18n.t('events.homeless_night.choices.street.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.homeless.street;
                    return I18n.t('events.homeless_night.choices.street.hint', conf.mentalCost, conf.healthCost, conf.energyRecoveryTomorrow);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.homeless.street;
                    state.mental -= conf.mentalCost;
                    state.health -= conf.healthCost;
                    return {
                        message: I18n.t('events.homeless_night.messages.street'),
                        type: 'negative',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.homeless_night.choices.shelter.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.homeless.shelter;
                    return I18n.t(
                        'events.homeless_night.choices.shelter.hint',
                        conf.successChance * 100,
                        conf.successMentalCost,
                        conf.failMentalCost,
                        conf.failHealthCost,
                        conf.successEnergyRecovery,
                        conf.failEnergyRecovery
                    );
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.homeless.shelter;
                    const successRate = context.successRate || 1.0;
                    if (context.rng.random() < successRate * conf.successChance) {
                        state.mental -= conf.successMentalCost;
                        return {
                            message: I18n.t('events.homeless_night.messages.shelterSuccess'),
                            type: 'positive',
                            energyRecoveryTomorrow: conf.successEnergyRecovery
                        };
                    }
                    state.mental -= conf.failMentalCost;
                    state.health -= conf.failHealthCost;
                    return {
                        message: I18n.t('events.homeless_night.messages.shelterFail'),
                        type: 'negative',
                        energyRecoveryTomorrow: conf.failEnergyRecovery
                    };
                }
            }
        ]
    },

    {
        id: 'car_night',
        type: 'system',
        title: I18n.t('events.car_night.title'),
        description: I18n.t('events.car_night.description'),
        period: 'night',
        condition: (state) => state.housing === 'car',
        weight: GameData.eventWeights.car_night,
        choices: [
            {
                text: I18n.t('events.car_night.choices.hide.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.car.hide;
                    return I18n.t('events.car_night.choices.hide.hint', conf.mentalCost, conf.energyRecoveryTomorrow);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.car.hide;
                    state.mental -= conf.mentalCost;
                    return {
                        message: I18n.t('events.car_night.messages.safe'),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.car_night.choices.parkClose.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.car.park_close;
                    return I18n.t(
                        'events.car_night.choices.parkClose.hint',
                        conf.kickOutMentalCost,
                        conf.safeMentalCost,
                        conf.kickOutEnergyRecovery,
                        conf.safeEnergyRecovery
                    );
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.car.park_close;
                    if (context.rng.random() < conf.kickOutChance) {
                        state.mental -= conf.kickOutMentalCost;
                        return {
                            message: I18n.t('events.car_night.messages.kickedOut'),
                            type: 'negative',
                            energyRecoveryTomorrow: conf.kickOutEnergyRecovery
                        };
                    }
                    state.mental -= conf.safeMentalCost;
                    return {
                        message: I18n.t('events.car_night.messages.safeNight'),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.safeEnergyRecovery
                    };
                }
            }
        ]
    },

    {
        id: 'hot_weather',
        type: 'daily',
        title: I18n.t('events.hot_weather.title'),
        description: I18n.t('events.hot_weather.description'),
        period: 'deep_night',
        isRandom: true,
        condition: (state, context) => state.day > GameData.newbieProtectionDays && context && context.rng && context.rng.random() < GameData.eventConfigs.probabilities.hot_weather && state.housing !== 'homeless',
        weight: GameData.eventWeights.hot_weather,
        choices: [
            {
                text: I18n.t('events.hot_weather.choices.ac.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.hot_weather.ac;
                    return I18n.t('events.hot_weather.choices.ac.hint', conf.mentalGain, conf.billCost, conf.energyRecoveryTomorrow);
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.hot_weather.ac;
                    state.mental = Math.min(state.maxMental || 100, state.mental + conf.mentalGain);
                    state.utilityBill += conf.billCost;
                    state.sleptWell = true;
                    return {
                        message: I18n.t('events.hot_weather.messages.ac', conf.billCost),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.hot_weather.choices.fan.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.hot_weather.fan;
                    return I18n.t('events.hot_weather.choices.fan.hint', conf.mentalCost, conf.billCost, conf.energyRecoveryTomorrow);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.hot_weather.fan;
                    state.mental = Math.max(0, state.mental - conf.mentalCost);
                    state.utilityBill += conf.billCost;
                    state.sleptWell = false;
                    return {
                        message: I18n.t('events.hot_weather.messages.fan'),
                        type: 'negative',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.hot_weather.choices.none.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.hot_weather.none;
                    return I18n.t('events.hot_weather.choices.none.hint', conf.mentalCost, conf.healthCost, conf.energyRecoveryTomorrow);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.hot_weather.none;
                    state.mental = Math.max(0, state.mental - conf.mentalCost);
                    state.health = Math.max(0, state.health - conf.healthCost);
                    state.sleptWell = false;
                    return {
                        message: I18n.t('events.hot_weather.messages.none'),
                        type: 'negative',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            }
        ]
    },

    {
        id: 'cold_weather',
        type: 'daily',
        title: I18n.t('events.cold_weather.title'),
        description: I18n.t('events.cold_weather.description', GameData.eventConfigs.cold_weather.temp),
        period: 'deep_night',
        isRandom: true,
        condition: (state, context) => state.day > GameData.newbieProtectionDays && context && context.rng && context.rng.random() < GameData.eventConfigs.probabilities.cold_weather && state.housing !== 'homeless',
        weight: GameData.eventWeights.cold_weather,
        choices: [
            {
                text: I18n.t('events.cold_weather.choices.heatHigh.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.cold_weather.heat;
                    return I18n.t('events.cold_weather.choices.heatHigh.hint', conf.moneyCost, conf.energyCost);
                },
                hintType: 'money',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.cold_weather.heat;
                    state.money -= conf.moneyCost;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    return { message: I18n.t('events.cold_weather.messages.heatHigh'), type: 'neutral' };
                }
            },
            {
                text: I18n.t('events.cold_weather.choices.wearMore.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.cold_weather.wear;
                    return I18n.t('events.cold_weather.choices.wearMore.hint', conf.energyCost, conf.healthLoss);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.cold_weather.wear;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.health = Math.max(0, state.health - conf.healthLoss);
                    return { message: I18n.t('events.cold_weather.messages.wearMore'), type: 'neutral' };
                }
            },
            {
                text: I18n.t('events.cold_weather.choices.gym.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.cold_weather.gym;
                    return I18n.t('events.cold_weather.choices.gym.hint', conf.moneyCost, conf.energyCost, conf.healthGain);
                },
                hintType: 'money',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.cold_weather.gym;
                    state.money -= conf.moneyCost;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.health = Math.min(state.maxHealth || 100, state.health + conf.healthGain);
                    return { message: I18n.t('events.cold_weather.messages.gym'), type: 'positive' };
                }
            }
        ]
    },

    {
        id: 'insomnia',
        type: 'daily',
        title: I18n.t('events.insomnia.title'),
        description: I18n.t('events.insomnia.description'),
        period: 'deep_night',
        isRandom: true,
        condition: (state, context) => state.day > GameData.newbieProtectionDays && context && context.rng && context.rng.random() < GameData.eventConfigs.probabilities.insomnia && state.mental < 60,
        weight: GameData.eventWeights.insomnia,
        choices: [
            {
                text: I18n.t('events.insomnia.choices.pills.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.insomnia.pills;
                    return I18n.t('events.insomnia.choices.pills.hint', conf.cost, conf.healthCost, conf.energyRecoveryTomorrow);
                },
                hintType: 'neutral',
                condition: (state) => {
                    const conf = GameData.eventConfigs.night_events.insomnia.pills;
                    return state.money >= conf.cost;
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.insomnia.pills;
                    state.money -= conf.cost;
                    state.health = Math.max(0, state.health - conf.healthCost);
                    state.sleptWell = true;
                    return {
                        message: I18n.t('events.insomnia.messages.pills'),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.insomnia.choices.phone.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.insomnia.phone;
                    return I18n.t('events.insomnia.choices.phone.hint', conf.mentalGain, conf.energyRecoveryTomorrow);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.insomnia.phone;
                    state.mental = Math.min(state.maxMental || 100, state.mental + conf.mentalGain);
                    state.sleptWell = false;
                    return {
                        message: I18n.t('events.insomnia.messages.phone'),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.insomnia.choices.meditate.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.insomnia.meditate;
                    return I18n.t(
                        'events.insomnia.choices.meditate.hint',
                        conf.successChance * 100,
                        conf.mentalGain,
                        conf.successEnergyRecovery,
                        conf.failEnergyRecovery
                    );
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.insomnia.meditate;
                    state.mental = Math.min(state.maxMental || 100, state.mental + conf.mentalGain);
                    if (context.rng.random() < conf.successChance) {
                        state.sleptWell = true;
                        return {
                            message: I18n.t('events.insomnia.messages.meditateSuccess'),
                            type: 'positive',
                            energyRecoveryTomorrow: conf.successEnergyRecovery
                        };
                    }
                    state.sleptWell = false;
                    return {
                        message: I18n.t('events.insomnia.messages.meditateFail'),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.failEnergyRecovery
                    };
                }
            }
        ]
    },

    {
        id: 'neighbor_noise',
        type: 'daily',
        title: I18n.t('events.neighbor_noise.title'),
        description: I18n.t('events.neighbor_noise.description'),
        period: 'deep_night',
        isRandom: true,
        condition: (state, context) => state.day > GameData.newbieProtectionDays && context && context.rng && context.rng.random() < GameData.eventConfigs.probabilities.neighbor_noise && (state.housing === 'apartment' || state.housing === 'cheapRoom'),
        weight: GameData.eventWeights.neighbor_noise,
        choices: [
            {
                text: I18n.t('events.neighbor_noise.choices.complain.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.neighbor_noise.complain;
                    return I18n.t(
                        'events.neighbor_noise.choices.complain.hint',
                        conf.successChance * 100,
                        conf.failMentalCost,
                        conf.successEnergyRecovery,
                        conf.failEnergyRecovery
                    );
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.neighbor_noise.complain;
                    if (context.rng.random() < conf.successChance) {
                        state.sleptWell = true;
                        return {
                            message: I18n.t('events.neighbor_noise.messages.complainSuccess'),
                            type: 'positive',
                            energyRecoveryTomorrow: conf.successEnergyRecovery
                        };
                    }
                    state.mental = Math.max(0, state.mental - conf.failMentalCost);
                    state.sleptWell = false;
                    return {
                        message: I18n.t('events.neighbor_noise.messages.complainFail'),
                        type: 'negative',
                        energyRecoveryTomorrow: conf.failEnergyRecovery
                    };
                }
            },
            {
                text: I18n.t('events.neighbor_noise.choices.earplugs.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.neighbor_noise.early_plugs;
                    return I18n.t('events.neighbor_noise.choices.earplugs.hint', conf.energyRecoveryTomorrow);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.neighbor_noise.early_plugs;
                    state.sleptWell = false;
                    return {
                        message: I18n.t('events.neighbor_noise.messages.earplugs'),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.neighbor_noise.choices.police.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.neighbor_noise.police;
                    return I18n.t('events.neighbor_noise.choices.police.hint', 100, conf.socialCost, conf.energyRecoveryTomorrow);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.neighbor_noise.police;
                    state.socialValue = Math.max(0, (state.socialValue || 0) - conf.socialCost);
                    state.sleptWell = true;
                    return {
                        message: I18n.t('events.neighbor_noise.messages.police'),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            }
        ]
    },

    {
        id: 'boss_late_message',
        type: 'work',
        title: I18n.t('events.boss_late_message.title'),
        description: I18n.t('events.boss_late_message.description'),
        period: 'deep_night',
        isRandom: true,
        condition: (state, context) => context && context.rng && context.rng.random() < GameData.eventConfigs.probabilities.boss_late_message && state.job === 'fulltime',
        weight: GameData.eventWeights.boss_late_message,
        choices: [
            {
                text: I18n.t('events.boss_late_message.choices.reply.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.special_events.boss_late.reply;
                    return I18n.t('events.boss_late_message.choices.reply.hint', conf.socialGain, conf.mentalCost, conf.energyRecoveryTomorrow);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.special_events.boss_late.reply;
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
                    state.mental = Math.max(0, state.mental - conf.mentalCost);
                    state.sleptWell = false;
                    return {
                        message: I18n.t('events.boss_late_message.messages.reply'),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.boss_late_message.choices.ignore.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.special_events.boss_late.ignore;
                    return I18n.t('events.boss_late_message.choices.ignore.hint');
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.special_events.boss_late.ignore;
                    state.sleptWell = true;
                    return {
                        message: I18n.t('events.boss_late_message.messages.ignore'),
                        type: 'positive',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.boss_late_message.choices.prepare.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.special_events.boss_late.prepare;
                    return I18n.t('events.boss_late_message.choices.prepare.hint', conf.socialGain, conf.energyRecoveryTomorrow);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.special_events.boss_late.prepare;
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
                    state.sleptWell = false;
                    return {
                        message: I18n.t('events.boss_late_message.messages.prepare'),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            }
        ]
    },

    {
        id: 'late_night_craving',
        type: 'daily',
        title: I18n.t('events.late_night_craving.title'),
        description: I18n.t('events.late_night_craving.description'),
        period: 'deep_night',
        isRandom: true,
        condition: (state, context) => context && context.rng && context.rng.random() < GameData.eventConfigs.probabilities.late_night_craving,
        weight: GameData.eventWeights.late_night_craving,
        choices: [
            {
                text: I18n.t('events.late_night_craving.choices.order.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.craving.order;
                    return I18n.t('events.late_night_craving.choices.order.hint', conf.cost, conf.mentalGain, conf.healthCost, conf.energyRecoveryTomorrow);
                },
                hintType: 'neutral',
                condition: (state) => {
                    const conf = GameData.eventConfigs.night_events.craving.order;
                    return state.money >= conf.cost;
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.craving.order;
                    state.money -= conf.cost;
                    state.mental = Math.min(state.maxMental || 100, state.mental + conf.mentalGain);
                    state.health = Math.max(0, state.health - conf.healthCost);
                    state.sleptWell = true;
                    return {
                        message: I18n.t('events.late_night_craving.messages.order'),
                        type: 'positive',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.late_night_craving.choices.cook.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.craving.cook;
                    return I18n.t('events.late_night_craving.choices.cook.hint', conf.ingredientsCost, conf.healthGain, conf.energyRecoveryTomorrow);
                },
                hintType: 'neutral',
                condition: (state) => {
                    const conf = GameData.eventConfigs.night_events.craving.cook;
                    return state.ingredients >= conf.ingredientsCost;
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.craving.cook;
                    state.ingredients -= conf.ingredientsCost;
                    state.health = Math.min(state.maxHealth || 100, state.health + conf.healthGain);
                    state.sleptWell = true;
                    return {
                        message: I18n.t('events.late_night_craving.messages.cook'),
                        type: 'positive',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.late_night_craving.choices.water.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.craving.water;
                    return I18n.t('events.late_night_craving.choices.water.hint', conf.mentalCost, conf.energyRecoveryTomorrow);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.craving.water;
                    state.mental = Math.max(0, state.mental - conf.mentalCost);
                    state.sleptWell = true;
                    return {
                        message: I18n.t('events.late_night_craving.messages.water'),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            }
        ]
    },

    {
        id: 'nightmare',
        type: 'daily',
        title: I18n.t('events.nightmare.title'),
        description: I18n.t('events.nightmare.description'),
        period: 'deep_night',
        isRandom: true,
        condition: (state, context) => state.day > GameData.newbieProtectionDays && context && context.rng && context.rng.random() < GameData.eventConfigs.probabilities.nightmare && (state.mental < 50 || state.money < 2000),
        weight: GameData.eventWeights.nightmare,
        choices: [
            {
                text: I18n.t('events.nightmare.choices.breathe.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.nightmare.breathe;
                    return I18n.t('events.nightmare.choices.breathe.hint', conf.failMentalCost, conf.successEnergyRecovery, conf.failEnergyRecovery);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.nightmare.breathe;
                    if (context.rng.random() < (1 - conf.failChance)) {
                        state.sleptWell = false;
                        return {
                            message: I18n.t('events.nightmare.messages.sleepBad'),
                            type: 'neutral',
                            energyRecoveryTomorrow: conf.successEnergyRecovery
                        };
                    }
                    state.mental = Math.max(0, state.mental - conf.failMentalCost);
                    state.sleptWell = false;
                    return {
                        message: I18n.t('events.nightmare.messages.sleepTerrible'),
                        type: 'negative',
                        energyRecoveryTomorrow: conf.failEnergyRecovery
                    };
                }
            },
            {
                text: I18n.t('events.nightmare.choices.getUp.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.nightmare.get_up;
                    return I18n.t('events.nightmare.choices.getUp.hint', conf.mentalGain, conf.energyRecoveryTomorrow);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.nightmare.get_up;
                    state.mental = Math.min(state.maxMental || 100, state.mental + conf.mentalGain);
                    state.sleptWell = false;
                    return {
                        message: I18n.t('events.nightmare.messages.distract'),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            }
        ]
    },

    {
        id: 'loneliness',
        type: 'daily',
        title: I18n.t('events.loneliness.title'),
        description: I18n.t('events.loneliness.description'),
        period: 'deep_night',
        isRandom: true,
        condition: (state, context) => (state.socialValue || 50) < 20 && context && context.rng && context.rng.random() < GameData.eventConfigs.probabilities.loneliness,
        weight: GameData.eventWeights.loneliness,
        choices: [
            {
                text: I18n.t('events.loneliness.choices.contact.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.loneliness.contact;
                    return I18n.t('events.loneliness.choices.contact.hint', conf.cost, conf.socialGain, conf.mentalGain, conf.energyRecoveryTomorrow);
                },
                hintType: 'positive',
                condition: (state) => {
                    const conf = GameData.eventConfigs.night_events.loneliness.contact;
                    return state.money >= conf.cost && state.phoneBillPaid;
                },
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.loneliness.contact;
                    state.money -= conf.cost;
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
                    state.mental = Math.min(state.maxMental || 100, state.mental + conf.mentalGain);
                    state.sleptWell = true;
                    return {
                        message: I18n.t('events.loneliness.messages.contact'),
                        type: 'positive',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.loneliness.choices.socialMedia.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.loneliness.social_media;
                    return I18n.t('events.loneliness.choices.socialMedia.hint', conf.socialGain, conf.mentalCost, conf.energyRecoveryTomorrow);
                },
                hintType: 'neutral',
                condition: (state) => state.phoneBillPaid,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.loneliness.social_media;
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
                    state.mental = Math.max(0, state.mental - conf.mentalCost);
                    state.sleptWell = false;
                    return {
                        message: I18n.t('events.loneliness.messages.socialMedia'),
                        type: 'neutral',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            },
            {
                text: I18n.t('events.loneliness.choices.bear.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.night_events.loneliness.bear;
                    return I18n.t('events.loneliness.choices.bear.hint', conf.mentalCost);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.night_events.loneliness.bear;
                    state.mental = Math.max(0, state.mental - conf.mentalCost);
                    state.sleptWell = false;
                    return {
                        message: I18n.t('events.loneliness.messages.bear'),
                        type: 'negative',
                        energyRecoveryTomorrow: conf.energyRecoveryTomorrow
                    };
                }
            }
        ]
    }
];

export function getNightChoiceEvent(state) {
    const nightEvent = nightEvents.find(e => e.id === 'night_choice');
    console.log('[Night] getNightChoiceEvent called. Found event:', !!nightEvent);
    if (!nightEvent) {
        console.error('[Night] Critical: night_choice event not found in nightEvents array!', nightEvents);
        return null;
    }

    const isHospitalized = (state.hospitalDaysLeft || 0) > 0;
    const allowedNightActions = isHospitalized ? new Set(['sleep', 'phone']) : null;
    const choices = [];
    console.log('[Night] Generating choices from:', Object.keys(nightChoices));
    for (const [key, option] of Object.entries(nightChoices)) {
        if (allowedNightActions && !allowedNightActions.has(key)) continue;
        // Pass both housing and state to condition, as nightChoices expects (housing, state)
        if (!option.condition || option.condition(state.housing, state)) {
            const text = isHospitalized && key === 'sleep'
                ? I18n.t('events.hospital_stay.title')
                : I18n.t(`data.night_choices.${key}.text`);
            choices.push({
                id: option.id,
                text,
                hint: option.hint, // Use the hint function defined in nightChoices.js
                hintType: 'neutral',
                nightAction: key
            });
        }
    }

    return { ...nightEvent, choices };
}
