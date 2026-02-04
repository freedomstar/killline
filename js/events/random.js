/**
 * Random / Misc Events
 */
import { I18n } from '../i18n.js';
import { GameData } from '../data/index.js';
import { getArtifact } from '../data/artifacts.js';


export const rentIncreaseBonusEvent = {
    id: 'rent_increase_bonus',
    type: 'special',
    title: () => I18n.t('data.artifacts.rent_increase_bonus.title'),
    description: () => I18n.t('data.artifacts.rent_increase_bonus.description'),
    period: 'any',
    isRandom: false,
    isRandomEncounter: true,
    generateChoices: (state, context) => {
        const game = context.game;
        const artifacts = Array.isArray(state.artifacts) ? state.artifacts : [];
        const maxSlots = GameData.artifactMaxSlots || 3;
        const isFull = artifacts.length >= maxSlots;

        const excludeIds = artifacts;
        const options = game.getArtifactDraftOptions(2, excludeIds);

        if (!options || options.length === 0) {
            return [{
                text: "No more artifacts available",
                effect: (s) => ({ message: "Nothing found.", type: 'neutral', triggerEvent: 'FORCE_NEXT' })
            }];
        }

        return options.map(newArt => {
            let ownedArtName = "";
            let ownedArtId = "";
            if (isFull) {
                const idx = Math.floor(context.rng.random() * artifacts.length);
                ownedArtId = artifacts[idx];
                const ownedArt = getArtifact(ownedArtId);
                ownedArtName = ownedArt ? (typeof ownedArt.name === 'function' ? ownedArt.name() : ownedArt.name) : ownedArtId;
            }
            const newArtName = newArt.name();

            if (isFull) {
                return {
                    text: I18n.t('data.artifacts.rent_increase_bonus.choices.swap', ownedArtName, newArtName),
                    hint: newArt.description,
                    hintType: 'positive',
                    effect: (state, ctx) => {
                        if (ctx.isPreview) return { message: "Preview", type: 'neutral' };
                        game.removeArtifact(ownedArtId);
                        game.addArtifact(newArt.id);
                        game.triggerArtifacts('onInit', state);
                        return {
                            message: I18n.t('data.artifacts.rent_increase_bonus.messages.swap', ownedArtName, newArtName),
                            type: 'positive',
                            triggerEvent: 'FORCE_NEXT'
                        };
                    }
                };
            } else {
                return {
                    text: I18n.t('data.artifacts.rent_increase_bonus.choices.get', newArtName),
                    hint: newArt.description,
                    hintType: 'positive',
                    effect: (state, ctx) => {
                        if (ctx.isPreview) return { message: "Preview", type: 'neutral' };
                        game.addArtifact(newArt.id);
                        game.triggerArtifacts('onInit', state);
                        return {
                            message: I18n.t('data.artifacts.rent_increase_bonus.messages.get', newArtName),
                            type: 'positive',
                            triggerEvent: 'FORCE_NEXT'
                        };
                    }
                };
            }
        });
    },
    choices: []
};

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
        id: 'buy_used_car',
        type: 'opportunity',
        title: I18n.t('events.buy_used_car.title'),
        description: I18n.t('events.buy_used_car.description'),
        period: 'any',
        isRandom: true,
        condition: (state) => !state.hasCar && state.money >= 800,
        weight: GameData.eventWeights.buy_used_car,
        choices: [
            {
                text: I18n.t('events.buy_used_car.choices.deal.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.buy_used_car.deal;
                    return I18n.t('events.buy_used_car.choices.deal.hint', conf.cost, conf.mentalGain);
                },
                hintType: 'positive',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.buy_used_car.deal;
                    state.money -= conf.cost;
                    state.hasCar = true;
                    state.carBroken = false;
                    state.mental += conf.mentalGain;
                    // Reset fuel if bought? Usually default fuel.
                    state.fuelRemaining = GameData.initialState.fuelCapacity || 4;

                    return { message: I18n.t('events.buy_used_car.messages.deal'), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.buy_used_car.choices.ignore.text'),
                hint: I18n.t('events.buy_used_car.choices.ignore.hint'),
                hintType: 'neutral',
                effect: (state, context) => {
                    return { message: I18n.t('events.buy_used_car.messages.ignore'), type: 'neutral' };
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
    },
    {
        id: 'mysterious_trader',
        type: 'opportunity',
        title: () => I18n.t('events.mysterious_trader.title'),
        description: () => I18n.t('events.mysterious_trader.description'),
        period: 'any',
        isRandom: true,
        condition: (state) => Array.isArray(state.artifacts) && state.artifacts.length > 0,
        weight: 0.05, // Rare event
        generateChoices: (state, context) => {
            const game = context.game;
            const conf = GameData.eventConfigs.random_events_cleanup.mysterious_trader.swap;
            const artifacts = Array.isArray(state.artifacts) ? state.artifacts : [];

            const swapChoices = artifacts.map((id) => {
                const current = getArtifact(id);
                const currentName = current && typeof current.name === 'function' ? current.name() : (current?.name || id);
                return {
                    text: `${I18n.t('events.mysterious_trader.choices.swap.text')} (${currentName})`,
                    hint: I18n.t('events.mysterious_trader.choices.swap.hint'),
                    hintType: 'warning',
                    effect: (state, context) => {
                        if (context.isPreview) {
                            return { message: I18n.t('events.mysterious_trader.choices.swap.hint'), type: 'neutral' };
                        }
                        const excludeIds = artifacts.filter(existingId => existingId !== id);
                        const options = game.getArtifactDraftOptions(5, excludeIds);
                        const newArtifact = options.length > 0 ? options[0] : null;

                        if (newArtifact) {
                            game.removeArtifact(id);
                            game.addArtifact(newArtifact.id);
                            state.mental += conf.mentalGain;
                            game.triggerArtifacts('onInit', state);

                            return {
                                message: I18n.t('events.mysterious_trader.choices.swap.message', newArtifact.name()),
                                type: 'positive'
                            };
                        }

                        return { message: I18n.t('events.mysterious_trader.choices.swap.error'), type: 'neutral' };
                    }
                };
            });

            return [
                ...swapChoices,
                {
                    text: I18n.t('events.mysterious_trader.choices.refuse.text'),
                    hint: I18n.t('events.mysterious_trader.choices.refuse.hint'),
                    hintType: 'neutral',
                    effect: () => ({ message: I18n.t('events.mysterious_trader.choices.refuse.message'), type: 'neutral' })
                }
            ];
        },
        choices: []
    },
    {
        id: 'sell_artifact_crisis',
        type: 'opportunity',
        title: () => I18n.t('events.sell_artifact_crisis.title'),
        description: () => I18n.t('events.sell_artifact_crisis.description'),
        period: 'any',
        isRandom: true,
        condition: (state) => state.money < -500 && Array.isArray(state.artifacts) && state.artifacts.length > 0,
        weight: 0.1, // High chance when in crisis
        generateChoices: (state, context) => {
            const game = context.game;
            const sellConf = GameData.eventConfigs.random_events_cleanup.sell_artifact_crisis.sell;
            const keepConf = GameData.eventConfigs.random_events_cleanup.sell_artifact_crisis.keep;
            const artifacts = Array.isArray(state.artifacts) ? state.artifacts : [];

            const sellChoices = artifacts.map((id) => {
                const art = getArtifact(id);
                const artName = art && typeof art.name === 'function' ? art.name() : (art?.name || id);
                return {
                    text: `${I18n.t('events.sell_artifact_crisis.choices.sell.text')} (${artName})`,
                    hint: I18n.t('events.sell_artifact_crisis.choices.sell.hint', sellConf.moneyGain, sellConf.mentalLoss),
                    hintType: 'negative',
                    effect: (state) => {
                        if (context.isPreview) {
                            return { message: I18n.t('events.sell_artifact_crisis.choices.sell.hint', sellConf.moneyGain, sellConf.mentalLoss), type: 'negative' };
                        }
                        state.money += sellConf.moneyGain;
                        game.removeArtifact(id);
                        state.mental -= sellConf.mentalLoss;
                        return { message: I18n.t('events.sell_artifact_crisis.messages.sell', sellConf.moneyGain), type: 'negative' };
                    }
                };
            });

            return [
                ...sellChoices,
                {
                    text: I18n.t('events.sell_artifact_crisis.choices.keep.text'),
                    hint: I18n.t('events.sell_artifact_crisis.choices.keep.hint', keepConf.mentalGain),
                    hintType: 'positive',
                    effect: (state) => {
                        if (context.isPreview) {
                            return { message: I18n.t('events.sell_artifact_crisis.choices.keep.hint', keepConf.mentalGain), type: 'positive' };
                        }
                        state.mental += keepConf.mentalGain;
                        return { message: I18n.t('events.sell_artifact_crisis.messages.keep'), type: 'positive' };
                    }
                }
            ];
        },
        choices: []
    },
    {
        id: 'black_market_artifact',
        type: 'opportunity',
        title: () => I18n.t('events.black_market_artifact.title'),
        description: () => I18n.t('events.black_market_artifact.description'),
        period: 'any',
        isRandom: true,
        condition: (state) => Array.isArray(state.artifacts) && state.artifacts.length < (GameData.artifactMaxSlots || 3) && state.money >= 1000,
        weight: 0.05,
        choices: [
            {
                text: I18n.t('events.black_market_artifact.choices.buy.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.black_market_artifact.buy;
                    return I18n.t('events.black_market_artifact.choices.buy.hint', conf.cost);
                },
                hintType: 'warning',
                effect: (state, context) => {
                    const game = context.game;
                    const conf = GameData.eventConfigs.random_events_cleanup.black_market_artifact.buy;

                    if (context.isPreview) {
                        return { message: I18n.t('events.black_market_artifact.choices.buy.hint', conf.cost), type: 'neutral' };
                    }

                    state.money -= conf.cost;

                    const excludeIds = Array.isArray(state.artifacts) ? state.artifacts : [];
                    const options = game.getArtifactDraftOptions(1, excludeIds); // Get 1 random artifact
                    if (options && options.length > 0) {
                        const newArtifact = options[0];
                        game.addArtifact(newArtifact.id);
                        // Init hook
                        game.triggerArtifacts('onInit', state);
                        return { message: I18n.t('events.black_market_artifact.messages.buy', newArtifact.name()), type: 'positive' };
                    }
                    return { message: "Error: No artifact found", type: 'neutral' };
                }
            },
            {
                text: I18n.t('events.black_market_artifact.choices.leave.text'),
                hint: I18n.t('events.black_market_artifact.choices.leave.hint'),
                hintType: 'neutral',
                effect: (state, context) => {
                    return { message: I18n.t('events.black_market_artifact.messages.leave'), type: 'neutral' };
                }
            }
        ]
    },
    // Social Events implementation
    {
        id: 'team_lunch',
        type: 'opportunity',
        title: () => I18n.t('events.team_lunch.title'),
        description: () => I18n.t('events.team_lunch.description'),
        period: 'day',
        isRandom: true,
        condition: (state) => state.job !== 'unemployed' && state.money >= 30, // Basic check
        weight: 0.15,
        choices: [
            {
                text: I18n.t('events.team_lunch.choices.join.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.team_lunch.join;
                    return I18n.t('events.team_lunch.choices.join.hint', conf.cost, conf.socialGain, conf.workEfficiencyGain);
                },
                hintType: 'social',
                effect: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.team_lunch.join;
                    state.money -= conf.cost;
                    state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.socialGain);
                    state.workEfficiency = Math.min(GameData.initialState.maxWorkEfficiency, (state.workEfficiency || 100) + conf.workEfficiencyGain);
                    return { message: I18n.t('events.team_lunch.messages.join'), type: 'positive' };
                }
            },
            {
                text: I18n.t('events.team_lunch.choices.brown_bag.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.team_lunch.brown_bag;
                    return I18n.t('events.team_lunch.choices.brown_bag.hint', conf.ingredientsCost, conf.energyGain, conf.socialLoss);
                },
                hintType: 'neutral',
                condition: (state) => state.ingredients >= 1,
                effect: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.team_lunch.brown_bag;
                    state.ingredients -= conf.ingredientsCost;
                    state.energy = Math.min(GameData.initialState.maxEnergy, state.energy + conf.energyGain);
                    state.socialValue = Math.max(0, (state.socialValue || 0) - conf.socialLoss);
                    return { message: I18n.t('events.team_lunch.messages.brown_bag'), type: 'neutral' };
                }
            }
        ]
    },
    {
        id: 'after_work_drinks',
        type: 'opportunity',
        title: () => I18n.t('events.after_work_drinks.title'),
        description: () => I18n.t('events.after_work_drinks.description'),
        period: 'day', // late afternoon
        isRandom: true,
        condition: (state) => state.job !== 'unemployed' && state.money >= 50,
        weight: 0.12,
        choices: [
            {
                text: I18n.t('events.after_work_drinks.choices.network.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.after_work_drinks.network;
                    const baseRate = GameData.eventConfigs.random_events_cleanup.after_work_drinks.baseSuccessRate;
                    const socialBonus = GameData.eventConfigs.random_events_cleanup.after_work_drinks.socialBonus;
                    return I18n.t('events.after_work_drinks.choices.network.hint', conf.cost, conf.energyCost, baseRate, socialBonus, 0);
                },
                hintType: 'social',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.after_work_drinks.network;
                    const baseConf = GameData.eventConfigs.random_events_cleanup.after_work_drinks;

                    state.money -= conf.cost;
                    state.energy = Math.max(0, state.energy - conf.energyCost);

                    const successChance = baseConf.baseSuccessRate + ((state.socialValue || 0) * baseConf.socialBonus) + ((state.workEfficiency || 100) * baseConf.efficiencyBonus);

                    const rng = context.rng || Math;
                    if (rng.random() < successChance) {
                        state.workEfficiency = Math.min(GameData.initialState.maxWorkEfficiency, (state.workEfficiency || 100) + conf.successWorkEfficiencyGain);
                        state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.successMentalGain);
                        state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.successSocialGain);
                        return { message: I18n.t('events.after_work_drinks.messages.success', conf.successWorkEfficiencyGain, conf.successMentalGain, conf.successSocialGain), type: 'positive' };
                    } else {
                        state.mental = Math.max(0, state.mental - conf.failMentalLoss);
                        state.socialValue = Math.max(0, (state.socialValue || 0) - conf.failSocialLoss);
                        return { message: I18n.t('events.after_work_drinks.messages.fail', conf.failMentalLoss, conf.failSocialLoss), type: 'negative' };
                    }
                }
            },
            {
                text: I18n.t('events.after_work_drinks.choices.go_home.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.after_work_drinks.go_home;
                    return I18n.t('events.after_work_drinks.choices.go_home.hint', conf.energyGain, conf.socialLoss);
                },
                hintType: 'neutral',
                effect: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.after_work_drinks.go_home;
                    state.energy = Math.min(GameData.initialState.maxEnergy, state.energy + conf.energyGain);
                    state.socialValue = Math.max(0, (state.socialValue || 0) - conf.socialLoss);
                    return { message: I18n.t('events.after_work_drinks.messages.go_home'), type: 'neutral' };
                }
            }
        ]
    },
    {
        id: 'industry_mixer',
        type: 'opportunity',
        title: () => I18n.t('events.industry_mixer.title'),
        description: () => I18n.t('events.industry_mixer.description'),
        period: 'day',
        isRandom: true,
        condition: (state) => state.job === 'unemployed' && state.money >= 100,
        weight: 0.12,
        choices: [
            {
                text: I18n.t('events.industry_mixer.choices.network.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.industry_mixer.network;
                    return I18n.t('events.industry_mixer.choices.network.hint', conf.cost, conf.energyCost);
                },
                hintType: 'social',
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.industry_mixer.network;
                    const baseConf = GameData.eventConfigs.random_events_cleanup.industry_mixer;

                    state.money -= conf.cost;
                    state.energy = Math.max(0, state.energy - conf.energyCost);

                    const successChance = baseConf.baseSuccessRate + ((state.workEfficiency || 100) * baseConf.efficiencyBonus);

                    const rng = context.rng || Math;
                    if (rng.random() < successChance) {
                        state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.successSocialGain);
                        state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.successMentalGain);
                        return { message: I18n.t('events.industry_mixer.messages.success', conf.successSocialGain, conf.successMentalGain), type: 'positive' };
                    } else {
                        state.mental = Math.max(0, state.mental - conf.failMentalLoss);
                        return { message: I18n.t('events.industry_mixer.messages.fail', conf.failMentalLoss), type: 'negative' };
                    }
                }
            },
            {
                text: I18n.t('events.industry_mixer.choices.skip.text'),
                hint: I18n.t('events.industry_mixer.choices.skip.hint'),
                hintType: 'neutral',
                effect: (state) => {
                    return { message: I18n.t('events.industry_mixer.messages.skip'), type: 'neutral' };
                }
            }
        ]
    },
    {
        id: 'alumni_reunion',
        type: 'opportunity',
        title: () => I18n.t('events.alumni_reunion.title'),
        description: () => I18n.t('events.alumni_reunion.description'),
        period: 'day',
        isRandom: true,
        condition: (state) => state.job === 'unemployed',
        weight: 0.1,
        choices: [
            {
                text: I18n.t('events.alumni_reunion.choices.attend.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.alumni_reunion.attend;
                    return I18n.t('events.alumni_reunion.choices.attend.hint', conf.cost);
                },
                hintType: 'social',
                condition: (state) => state.money >= GameData.eventConfigs.random_events_cleanup.alumni_reunion.attend.cost,
                effect: (state, context) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.alumni_reunion.attend;
                    const baseConf = GameData.eventConfigs.random_events_cleanup.alumni_reunion;

                    state.money -= conf.cost;

                    const successChance = baseConf.baseSuccessRate + ((state.socialValue || 0) * baseConf.socialBonus);

                    const rng = context.rng || Math;
                    if (rng.random() < successChance) {
                        state.mental = Math.min(GameData.initialState.maxMental, state.mental + conf.successMentalGain);
                        state.socialValue = Math.min(GameData.initialState.maxSocialValue, (state.socialValue || 0) + conf.successSocialGain);
                        return { message: I18n.t('events.alumni_reunion.messages.success', conf.successMentalGain, conf.successSocialGain), type: 'positive' };
                    } else {
                        state.mental = Math.max(0, state.mental - conf.failMentalLoss);
                        state.socialValue = Math.max(0, (state.socialValue || 0) - conf.failSocialLoss);
                        return { message: I18n.t('events.alumni_reunion.messages.fail', conf.failMentalLoss, conf.failSocialLoss), type: 'negative' };
                    }
                }
            },
            {
                text: I18n.t('events.alumni_reunion.choices.ignore.text'),
                hint: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.alumni_reunion.ignore;
                    return I18n.t('events.alumni_reunion.choices.ignore.hint', conf.mentalLoss);
                },
                hintType: 'negative',
                effect: (state) => {
                    const conf = GameData.eventConfigs.random_events_cleanup.alumni_reunion.ignore;
                    state.mental = Math.max(0, state.mental - conf.mentalLoss);
                    return { message: I18n.t('events.alumni_reunion.messages.ignore'), type: 'negative' };
                }
            }
        ]
    }
];
