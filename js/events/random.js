/**
 * Random / Misc Events
 */
import { I18n } from '../i18n.js';
import { GameData } from '../data/index.js';

export const randomEvents = [




    {
        id: 'friend_help',
        type: 'opportunity',
        title: I18n.t('events.friend_help.title'),
        description: I18n.t('events.friend_help.description'),
        period: 'any',
        isRandom: true,
        condition: (state) => state.money < 200 && (state.socialValue || 50) >= 40,
        weight: GameData.eventWeights.friend_help,
        choices: [
            {
                text: I18n.t('events.friend_help.choices.accept.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.friend_help.accept;
                    return I18n.t('events.friend_help.choices.accept.hint', conf.moneyGain, conf.mentalGain, conf.mentalGainShelter);
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.friend_help.accept;

                    if (state.housing === 'homeless' || state.housing === 'car') {
                        state.housing = 'cheapRoom';
                        state.mental += conf.mentalGainShelter;
                        return { message: I18n.t('events.friend_help.messages.shelter'), type: 'positive' };
                    }
                    state.money += conf.moneyGain;
                    state.mental += conf.mentalGain;
                    return { message: I18n.t('events.friend_help.messages.money', conf.moneyGain), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.friend_help.choices.decline.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.friend_help.decline;
                    return I18n.t('events.friend_help.choices.decline.hint', conf.mentalGain, conf.socialGain);
                },
                hintType: 'neutral',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.friend_help.decline;
                    state.mental += conf.mentalGain;
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
                    return { message: I18n.t('events.friend_help.messages.decline', conf.mentalGain), type: 'positive' };
                }
            }
        ]
    },
    {
        id: 'sell_car_emergency',
        type: 'opportunity',
        title: I18n.t('events.sell_car_emergency.title'),
        description: I18n.t('events.sell_car_emergency.description'),
        period: 'any',
        isRandom: true,
        condition: (state) => state.money < 0 && state.hasCar,
        weight: GameData.eventWeights.sell_car_emergency,
        choices: [
            {
                text: I18n.t('events.sell_car_emergency.choices.sell.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.sell_car_emergency.sell;
                    return I18n.t('events.sell_car_emergency.choices.sell.hint', conf.moneyGain, conf.mentalLoss);
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.sell_car_emergency.sell;
                    state.money += conf.moneyGain;
                    state.hasCar = false;
                    state.carBroken = false;
                    state.fuelRemaining = 0;
                    state.mental -= conf.mentalLoss;

                    if (state.housing === 'car') {
                        state.housing = 'homeless';
                    }

                    return { message: I18n.t('events.sell_car_emergency.messages.sell'), type: 'neutral' };
                }
            },
            {
                text: I18n.t('events.sell_car_emergency.choices.keep.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.sell_car_emergency.keep;
                    return I18n.t('events.sell_car_emergency.choices.keep.hint', conf.mentalLoss);
                },
                hintType: 'negative',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.sell_car_emergency.keep;
                    state.mental -= conf.mentalLoss;
                    return { message: I18n.t('events.sell_car_emergency.messages.keep'), type: 'negative' };
                }
            }
        ]
    },
    {
        id: 'morning_coffee',
        type: 'daily',
        title: I18n.t('events.morning_coffee.title'),
        description: I18n.t('events.morning_coffee.description'),
        period: 'day',
        isRandom: true,
        condition: (state) => !state.coffeeToday && state.energy < 70,
        weight: GameData.eventWeights.morning_coffee,
        choices: [
            {
                text: I18n.t('events.morning_coffee.choices.buy.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.morning_coffee.buy;
                    return I18n.t('events.morning_coffee.choices.buy.hint', conf.cost, conf.energyGain, conf.healthLoss);
                },
                hintType: 'energy',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.morning_coffee.buy;
                    state.money -= conf.cost;
                    state.energy = Math.min(GameData.initialState.maxEnergy, state.energy + conf.energyGain);
                    state.health = Math.max(0, state.health - conf.healthLoss);
                    state.coffeeToday = true;
                    return { message: I18n.t('events.morning_coffee.messages.buy'), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.morning_coffee.choices.skip.text'),
                hint: I18n.t('events.morning_coffee.choices.skip.hint'),
                hintType: 'neutral',
                effect: (state, context) => {
                    return { message: I18n.t('events.morning_coffee.messages.skip', GameData.eventConfigs.morning_coffee.buy.cost), type: 'neutral' };
                }
            }
        ]
    },

    {
        id: 'afternoon_exercise',
        type: 'daily',
        title: I18n.t('events.afternoon_exercise.title'),
        description: I18n.t('events.afternoon_exercise.description'),
        period: 'day',
        isRandom: true,
        condition: (state) => state.energy >= 20,
        weight: GameData.eventWeights.afternoon_exercise,
        choices: [
            {
                text: I18n.t('events.afternoon_exercise.choices.gym.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.afternoon_exercise.gym;
                    return I18n.t('events.afternoon_exercise.choices.gym.hint', conf.energyCost, conf.mentalGain, conf.healthGain);
                },
                hintType: 'neutral',
                energyCost: GameData.eventConfigs.afternoon_exercise.gym.energyCost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.afternoon_exercise.gym;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.mentalGain);
                    state.health = Math.min(GameData.initialState.maxHealth, state.health + conf.healthGain);
                    return { message: I18n.t('events.afternoon_exercise.messages.gym'), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.afternoon_exercise.choices.walk.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.afternoon_exercise.walk;
                    return I18n.t('events.afternoon_exercise.choices.walk.hint', conf.energyCost, conf.mentalGain);
                },
                hintType: 'positive',
                energyCost: GameData.eventConfigs.afternoon_exercise.walk.energyCost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.afternoon_exercise.walk;
                    state.energy = Math.max(0, state.energy - conf.energyCost);
                    state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.mentalGain);
                    return { message: I18n.t('events.afternoon_exercise.messages.walk'), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.afternoon_exercise.choices.skip.text'),
                hint: I18n.t('events.afternoon_exercise.choices.skip.hint'),
                hintType: 'neutral',
                effect: (state, context) => {
                    return { message: I18n.t('events.afternoon_exercise.messages.skip'), type: 'neutral' };
                }
            }
        ]
    }
];
