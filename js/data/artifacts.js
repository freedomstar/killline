/**
 * Roguelike Artifacts Registry
 * 
 * Artifacts are powerful, game-changing items that define a "run".
 * Player selects ONE at the start of the game.
 * 
 * Hooks:
 * - onDaily(state): Triggered every morning.
 * - onStatsChange(state, changes): Triggered when stats (health/money/etc) change. return modified changes.
 * - onInit(state): Triggered when game starts with this artifact.
 */
import { I18n } from '../i18n.js';
import { artifactConfig } from './artifactConfig.js';

// Helper to process artifact reactions (Synergy System)
// 返回分层结构，支持 UI 逐层显示连锁触发效果
export function processArtifactReactions(state, initialDelta, sourceId) {
    let delta = { ...initialDelta };
    const layers = []; // 分层记录每层触发的神器

    // 1. Recursive Loop for Base Modifiers
    let layerInput = { ...initialDelta };
    let totalDelta = { ...initialDelta };
    let depth = 0;
    const MAX_DEPTH = 100;

    // 从配置获取最大触发次数限制
    const animConfig = artifactConfig?.animation || {};
    const MAX_TOTAL_TRIGGERS = animConfig.maxTotalTriggers || 50;
    let totalTriggerCount = 0;

    // Helper to calculate difference between two deltas
    const getDiff = (before, after) => {
        const diff = {};
        const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
        keys.forEach(key => {
            const v1 = before[key] || 0;
            const v2 = after[key] || 0;
            if (Math.abs(v2 - v1) > 0.001) diff[key] = v2 - v1;
        });
        return diff;
    };

    while (depth < MAX_DEPTH) {
        // 如果已达到最大触发次数，停止循环
        if (totalTriggerCount >= MAX_TOTAL_TRIGGERS) break;

        let layerHasChange = false;
        const layerWorking = { ...layerInput };
        // 每层新建一个集合，只记录本层内已触发的神奇（防止同一层自触发）
        const triggeredThisLayer = new Set();
        if (sourceId) triggeredThisLayer.add(sourceId); // 始终排除初始触发源

        // 本层触发记录
        const layerTriggers = [];

        // Context for this layer
        const layerContext = depth === 0
            ? { type: 'daily', id: sourceId }
            : { type: 'reaction', parentId: sourceId };

        if (state.artifacts && state.artifacts.length > 0) {
            state.artifacts.forEach(id => {
                // 如果已达到最大触发次数，跳过
                if (totalTriggerCount >= MAX_TOTAL_TRIGGERS) return;

                // 只排除同一层内刚触发过的和初始触发源
                if (triggeredThisLayer.has(id)) return;

                const artifact = artifacts[id];
                if (artifact && artifact.onModifyBase) {
                    const preArtifact = { ...layerWorking };
                    const res = artifact.onModifyBase(layerWorking, layerContext);

                    // V2.XX: Round logic implementation
                    const rawDiff = getDiff(preArtifact, layerWorking);
                    const validDiff = {};
                    let hasValidChange = false;

                    Object.keys(rawDiff).forEach(key => {
                        const val = rawDiff[key];
                        // 1. Round to 1 decimal
                        const rounded = Math.round(val * 10) / 10;

                        // 2. Filter insignificant changes (< 0.1)
                        if (Math.abs(rounded) >= 0.1) {
                            validDiff[key] = rounded;
                            hasValidChange = true;
                        }
                    });

                    if (hasValidChange) {
                        // Apply rounded values to ensure state consistency
                        // Revert any changes that were filtered out
                        Object.keys(rawDiff).forEach(key => {
                            const baseVal = preArtifact[key] !== undefined ? preArtifact[key] : 0;
                            if (validDiff[key] !== undefined) {
                                layerWorking[key] = baseVal + validDiff[key];
                            } else {
                                layerWorking[key] = baseVal;
                            }
                        });

                        layerTriggers.push({
                            id: id,
                            message: (res && res.message) ? res.message : null,
                            delta: validDiff
                        });
                        layerHasChange = true;
                        triggeredThisLayer.add(id);
                        totalTriggerCount++;
                    } else {
                        // Revert all changes if no valid change found
                        if (Object.keys(rawDiff).length > 0) {
                            Object.assign(layerWorking, preArtifact);
                        }
                    }
                }
            });
        }

        if (!layerHasChange) break;

        // 记录本层
        layers.push({
            depth: depth,
            triggers: layerTriggers
        });

        const layerOutput = getDiff(layerInput, layerWorking);

        // Update Total Delta
        Object.keys(layerOutput).forEach(key => {
            totalDelta[key] = (totalDelta[key] || 0) + layerOutput[key];
        });

        // 下一层使用本层产出的增量作为输入
        layerInput = layerOutput;
        depth++;
    }

    // Sync local delta variable to totalDelta
    delta = totalDelta;

    // 2. Run onModifyMult (Multipliers) - 作为最终层
    const multTriggers = [];
    if (state.artifacts && state.artifacts.length > 0) {
        state.artifacts.forEach(id => {
            if (id === sourceId) return;

            const artifact = artifacts[id];
            if (artifact && artifact.onModifyMult) {
                const res = artifact.onModifyMult(state, { type: 'daily', id: sourceId }, delta);

                if (res && res.multiplier) {
                    let applied = false;
                    const preMult = { ...delta };

                    Object.keys(delta).forEach(key => {
                        const val = delta[key];
                        if (typeof val === 'number') {
                            const rawImpact = Math.abs(val * (res.multiplier - 1));

                            // V2.XX: Filter insignificant multiplier effects (< 0.1)
                            if (rawImpact < 0.1) return;

                            if (res.appliesTo === 'positive' && val > 0) {
                                delta[key] = Math.round(val * res.multiplier * 10) / 10;
                                applied = true;
                            } else if (res.appliesTo === 'negative' && val < 0) {
                                delta[key] = Math.round(val * res.multiplier * 10) / 10;
                                applied = true;
                            }
                        }
                    });

                    if (applied) {
                        const multDelta = getDiff(preMult, delta);
                        multTriggers.push({
                            id: id,
                            message: res.message || null,
                            delta: multDelta
                        });
                    }
                }
            }
        });
    }

    // 如果有乘数触发，添加为最后一层
    if (multTriggers.length > 0) {
        layers.push({
            depth: layers.length,
            triggers: multTriggers,
            isMultiplier: true
        });
    }

    // 3. Apply Final Delta to State
    // V2.XX: Ensure final values are rounded to 1 decimal
    // Apply Max Stat Changes First
    if (delta.maxHealth !== undefined) {
        state.maxHealth = (state.maxHealth || 100) + delta.maxHealth;
    }
    if (delta.maxMental !== undefined) {
        state.maxMental = (state.maxMental || 100) + delta.maxMental;
    }
    if (delta.maxEnergy !== undefined) {
        state.maxEnergy = (state.maxEnergy || 100) + delta.maxEnergy;
    }

    // Apply Current Stat Changes
    if (delta.health !== undefined) {
        const newVal = (state.health || 0) + delta.health;
        state.health = Math.min(state.maxHealth || 100, Math.max(0, Math.round(newVal * 10) / 10));
    }
    if (delta.mental !== undefined) {
        const newVal = (state.mental || 0) + delta.mental;
        state.mental = Math.min(state.maxMental || 100, Math.max(0, Math.round(newVal * 10) / 10));
    }
    if (delta.energy !== undefined) {
        const newVal = (state.energy || 0) + delta.energy;
        state.energy = Math.min(state.maxEnergy || 100, Math.max(0, Math.round(newVal * 10) / 10));
    }
    if (delta.money !== undefined) {
        const newVal = (state.money || 0) + delta.money;
        state.money = Math.round(newVal * 10) / 10;
    }

    // 兼容旧接口：生成扁平的 logs 和 triggeredIds
    const logs = [];
    const triggeredIds = [];
    layers.forEach(layer => {
        layer.triggers.forEach(t => {
            if (t.message) logs.push(t.message);
            triggeredIds.push(t.id);
        });
    });

    // 返回分层结构 + 兼容旧接口
    return { logs, triggeredIds, layers, totalDelta: delta };
}


export const artifacts = {
    // --- 躺平流 (Passive Income) ---
    dropshipping_bot: {
        id: 'dropshipping_bot',
        name: () => I18n.t('data.artifacts.dropshipping_bot.name'),
        description: () => I18n.t('data.artifacts.dropshipping_bot.description', artifactConfig.dropshipping_bot.dailyIncome, artifactConfig.dropshipping_bot.mentalCost),
        icon: '🤖',
        rarity: 'common',
        onDaily: (state) => {
            const { dailyIncome, mentalCost } = artifactConfig.dropshipping_bot;
            const delta = { money: dailyIncome, mental: -mentalCost };

            const { logs, triggeredIds, layers } = processArtifactReactions(state, delta, 'dropshipping_bot');

            let log = I18n.t('data.artifacts.dropshipping_bot.log', dailyIncome, mentalCost);

            return {
                triggered: true,
                log: log,
                secondaryTriggers: triggeredIds,
                layers: layers,
                delta: delta
            };
        }
    },

    // --- 啃老流 (Survival) ---
    mom_credit_card: {
        id: 'mom_credit_card',
        name: () => I18n.t('data.artifacts.mom_credit_card.name'),
        description: () => I18n.t('data.artifacts.mom_credit_card.description', (artifactConfig.mom_credit_card.debtDiscount * 100), artifactConfig.mom_credit_card.threshold),
        icon: '💳',
        rarity: 'rare',
        onDaily: (state) => {
            // Logic handled in EventManager Proxy (consumption reduction)
        },
        // Loop hook to check transactions? (Implemented in core logic restriction)
    },

    // --- 卖血流 (Risk/Reward) ---
    gopro_camera: {
        id: 'gopro_camera',
        name: () => I18n.t('data.artifacts.gopro_camera.name'),
        description: () => I18n.t('data.artifacts.gopro_camera.description', artifactConfig.gopro_camera.healthLossReward, artifactConfig.gopro_camera.medicalCostMultiplier),
        icon: '📹',
        rarity: 'uncommon',
        // gopro_camera fix
        onModifyBase: (delta, actionInfo) => {
            if (!delta.health || delta.health >= 0) return null;
            const reward = Math.abs(delta.health) * artifactConfig.gopro_camera.healthLossReward;
            if (reward <= 0) return null;
            delta.money += reward;
            return { message: I18n.t('game.artifactTriggers.gopro_camera', Math.round(reward * 10) / 10) };
        },
        onModifyMult: (state, actionInfo, delta) => {
            if (!delta.money || delta.money >= 0) return null;
            const isMedical = actionInfo.type === 'health' || actionInfo.type === 'hospital'
                || (actionInfo.id && (actionInfo.id.includes('medical') || actionInfo.id.includes('hospital')));
            if (!isMedical) return null;
            return {
                multiplier: artifactConfig.gopro_camera.medicalCostMultiplier,
                appliesTo: 'negative',
                message: I18n.t('game.artifactTriggers.gopro_camera_medical')
            };
        }
    },

    // --- 欧皇流 (Luck) ---
    lucky_ring: {
        id: 'lucky_ring',
        name: () => I18n.t('data.artifacts.lucky_ring.name'),
        description: () => I18n.t('data.artifacts.lucky_ring.description', (artifactConfig.lucky_ring.successRateBonus * 100)),
        icon: '💍',
        rarity: 'legendary',
        onDaily: (state) => {
            // Passive effect: Increased success rate in EventManager.calculateSuccessRate
        }
    },

    // --- 卷王流 (Grind) ---
    coffee_drip: {
        id: 'coffee_drip',
        name: () => I18n.t('data.artifacts.coffee_drip.name'),
        description: () => I18n.t('data.artifacts.coffee_drip.description', artifactConfig.coffee_drip.minEnergy),
        icon: '☕',
        rarity: 'common'
    },

    side_job_bot: {
        id: 'side_job_bot',
        name: () => I18n.t('data.artifacts.side_job_bot.name'),
        description: () => I18n.t('data.artifacts.side_job_bot.description', artifactConfig.side_job_bot.moneyBonus),
        icon: '🤖',
        rarity: 'common',
        onModifyBase: (delta) => {
            if (!delta.money || delta.money <= 0) return null;
            delta.money += artifactConfig.side_job_bot.moneyBonus;
            return { message: I18n.t('game.artifactTriggers.side_job_bot', artifactConfig.side_job_bot.moneyBonus) };
        }
    },

    gig_cap: {
        id: 'gig_cap',
        name: () => I18n.t('data.artifacts.gig_cap.name'),
        description: () => I18n.t('data.artifacts.gig_cap.description', artifactConfig.gig_cap.moneyBonus),
        icon: '🧢',
        rarity: 'uncommon',
        onModifyBase: (delta) => {
            if (!delta.energy || delta.energy >= 0) return null;
            delta.money += artifactConfig.gig_cap.moneyBonus;
            return { message: I18n.t('game.artifactTriggers.gig_cap', artifactConfig.gig_cap.moneyBonus) };
        }
    },

    piggy_bank: {
        id: 'piggy_bank',
        name: () => I18n.t('data.artifacts.piggy_bank.name'),
        description: () => I18n.t('data.artifacts.piggy_bank.description', artifactConfig.piggy_bank.dailyBonus),
        icon: '🪙',
        rarity: 'uncommon'
    },

    bull_plushie: {
        id: 'bull_plushie',
        name: () => I18n.t('data.artifacts.bull_plushie.name'),
        description: () => I18n.t('data.artifacts.bull_plushie.description', Math.round(artifactConfig.bull_plushie.percentPerHundred * 100), artifactConfig.bull_plushie.divisor),
        icon: '🐂',
        rarity: 'rare',
        onModifyMult: (state, actionInfo, delta) => {
            if (!delta.money || delta.money <= 0) return null;
            const steps = Math.floor((state.money || 0) / artifactConfig.bull_plushie.divisor);
            if (steps <= 0) return null;
            const multiplier = 1 + steps * artifactConfig.bull_plushie.percentPerHundred;
            return {
                multiplier,
                appliesTo: 'positive',
                message: I18n.t('game.artifactTriggers.bull_plushie', Math.round(steps * artifactConfig.bull_plushie.percentPerHundred * 100))
            };
        }
    },

    grinder_tie: {
        id: 'grinder_tie',
        name: () => I18n.t('data.artifacts.grinder_tie.name'),
        description: () => I18n.t('data.artifacts.grinder_tie.description', artifactConfig.grinder_tie.mentalRestore, artifactConfig.grinder_tie.healthLossMultiplier),
        icon: '👔',
        rarity: 'rare',
        onModifyBase: (delta, actionInfo) => {
            if (actionInfo.type !== 'work' && actionInfo.id !== 'day_work') return null;
            delta.mental = (delta.mental || 0) + artifactConfig.grinder_tie.mentalRestore;
            if (delta.health && delta.health < 0) {
                delta.health = Math.round(delta.health * artifactConfig.grinder_tie.healthLossMultiplier);
            }
            return { message: I18n.t('game.artifactTriggers.grinder_tie', artifactConfig.grinder_tie.mentalRestore) };
        }
    },

    blood_contract: {
        id: 'blood_contract',
        name: () => I18n.t('data.artifacts.blood_contract.name'),
        description: () => I18n.t('data.artifacts.blood_contract.description', Math.round(artifactConfig.blood_contract.threshold * 100), artifactConfig.blood_contract.multiplier),
        icon: '📝',
        rarity: 'epic',
        onModifyMult: (state, actionInfo, delta) => {
            if (!delta.money || delta.money <= 0) return null;
            const healthRatio = (state.health || 0) / (state.maxHealth || 100);
            if (healthRatio >= artifactConfig.blood_contract.threshold) return null;
            return {
                multiplier: artifactConfig.blood_contract.multiplier,
                appliesTo: 'positive',
                message: I18n.t('game.artifactTriggers.blood_contract')
            };
        }
    },

    jammed_copier: {
        id: 'jammed_copier',
        name: () => I18n.t('data.artifacts.jammed_copier.name'),
        description: () => I18n.t('data.artifacts.jammed_copier.description'),
        icon: '🖨️',
        rarity: 'rare',
        onModifyBase: (delta, actionInfo, state) => {
            const isWork = actionInfo.type === 'work' || actionInfo.id === 'day_work';
            if (!isWork || !actionInfo.choiceId) return null;
            if (state.lastWorkChoiceId !== actionInfo.choiceId) return null;
            const extra = state.lastWorkProgressGain || 0;
            if (extra <= 0) return null;
            delta.workProgress += extra;
            return { message: I18n.t('game.artifactTriggers.jammed_copier', Math.round(extra * 10) / 10) };
        }
    },

    intern_badge: {
        id: 'intern_badge',
        name: () => I18n.t('data.artifacts.intern_badge.name'),
        description: () => I18n.t('data.artifacts.intern_badge.description', artifactConfig.intern_badge.socialLoss),
        icon: '📛',
        rarity: 'epic'
    },

    // --- 养生流 (Wellness) ---
    wellness_tea: {
        id: 'wellness_tea',
        name: () => I18n.t('data.artifacts.wellness_tea.name'),
        description: () => I18n.t('data.artifacts.wellness_tea.description', artifactConfig.wellness_tea.healthGain, artifactConfig.wellness_tea.mentalGain),
        icon: '🍵',
        rarity: 'common',
        onDaily: (state) => {
            const { healthGain, mentalGain } = artifactConfig.wellness_tea;

            const delta = { health: healthGain, mental: mentalGain };
            const { logs, triggeredIds, layers } = processArtifactReactions(state, delta, 'wellness_tea');

            let log = I18n.t('data.artifacts.wellness_tea.log', healthGain, mentalGain);

            return {
                triggered: true,
                log: log,
                secondaryTriggers: triggeredIds,
                layers: layers,
                delta: delta
            };
        }
    },

    // --- 赛博修仙流 (Cyber-Enhancement) ---
    neural_chip: {
        id: 'neural_chip',
        name: () => I18n.t('data.artifacts.neural_chip.name'),
        description: () => I18n.t('data.artifacts.neural_chip.description', artifactConfig.neural_chip.healthCost, artifactConfig.neural_chip.energyGain, artifactConfig.neural_chip.workProgressBonus),
        icon: '💾',
        rarity: 'epic',
        onDaily: (state) => {
            const { healthCost, energyGain } = artifactConfig.neural_chip;

            const delta = { health: -healthCost, energy: energyGain };
            const { logs, triggeredIds, layers } = processArtifactReactions(state, delta, 'neural_chip');

            let log = I18n.t('data.artifacts.neural_chip.log', healthCost, energyGain);

            return {
                triggered: true,
                log: log,
                secondaryTriggers: triggeredIds,
                layers: layers,
                delta: delta  // V2.XX: Return delta for UI shake
            };
        },
        onModifyBase: (delta, actionInfo) => {
            const isWork = actionInfo.type === 'work' || actionInfo.id === 'day_work';
            if (isWork && delta.workProgress > 0) {
                const bonus = artifactConfig.neural_chip.workProgressBonus;
                delta.workProgress += bonus;
                return { message: I18n.t('game.artifactTriggers.neural_chip', bonus) };
            }
            return null;
        }
    },

    leverage_jack: {
        id: 'leverage_jack',
        name: () => I18n.t('data.artifacts.leverage_jack.name'),
        description: () => I18n.t('data.artifacts.leverage_jack.description', artifactConfig.leverage_jack.multiplier),
        icon: '🔧',
        rarity: 'legendary'
    },

    insider_phone: {
        id: 'insider_phone',
        name: () => I18n.t('data.artifacts.insider_phone.name'),
        description: () => I18n.t('data.artifacts.insider_phone.description', Math.round(artifactConfig.insider_phone.tipChance * 100), Math.round(artifactConfig.insider_phone.accuracy * 100)),
        icon: '📱',
        rarity: 'epic'
    },

    golden_parachute: {
        id: 'golden_parachute',
        name: () => I18n.t('data.artifacts.golden_parachute.name'),
        description: () => I18n.t('data.artifacts.golden_parachute.description', artifactConfig.golden_parachute.stopLossThreshold),
        icon: '🪂',
        rarity: 'legendary'
    },

    actuary_glasses: {
        id: 'actuary_glasses',
        name: () => I18n.t('data.artifacts.actuary_glasses.name'),
        description: () => I18n.t('data.artifacts.actuary_glasses.description'),
        icon: '👓',
        rarity: 'epic'
    },

    // --- 精神回复流 (Mental Gain) ---
    quantum_meditation_mat: {
        id: 'quantum_meditation_mat',
        name: () => I18n.t('data.artifacts.quantum_meditation_mat.name'),
        description: () => I18n.t('data.artifacts.quantum_meditation_mat.description', artifactConfig.quantum_meditation_mat.healthRestoreRatio, artifactConfig.quantum_meditation_mat.unit),
        icon: '🧘',
        rarity: 'rare',
        onModifyBase: (delta) => {
            if (!delta.mental || delta.mental <= 0) return null;
            const gain = delta.mental * artifactConfig.quantum_meditation_mat.healthRestoreRatio;
            if (gain < 0.1) return null;
            // Round to 1 decimal
            const actualGain = Math.round(gain * 10) / 10;
            delta.health = (delta.health || 0) + actualGain;
            return { message: I18n.t('game.artifactTriggers.quantum_meditation_mat', actualGain) };
        }
    },

    streamer_mic: {
        id: 'streamer_mic',
        name: () => I18n.t('data.artifacts.streamer_mic.name'),
        description: () => I18n.t('data.artifacts.streamer_mic.description', artifactConfig.streamer_mic.moneyPerMental, artifactConfig.streamer_mic.unit),
        icon: '🎤',
        rarity: 'common',
        onModifyBase: (delta) => {
            console.log('[StreamerMic] Checking delta:', JSON.stringify(delta));
            if (!delta.mental || delta.mental <= 0) return null;
            const conf = artifactConfig.streamer_mic;
            if (!conf) { console.error('[StreamerMic] Missing config!'); return null; }

            const gain = delta.mental * conf.moneyPerMental;
            console.log(`[StreamerMic] Gain: ${gain}`);
            if (gain <= 0) return null;

            delta.money = (delta.money || 0) + gain;
            return { message: I18n.t('game.artifactTriggers.streamer_mic', Math.round(gain * 10) / 10) };
        }
    },

    super_vitamin: {
        id: 'super_vitamin',
        name: () => I18n.t('data.artifacts.super_vitamin.name'),
        description: () => I18n.t('data.artifacts.super_vitamin.description', artifactConfig.super_vitamin.mentalRestoreRatio, artifactConfig.super_vitamin.unit),
        icon: '💊',
        rarity: 'rare',
        onModifyBase: (delta) => {
            if (!delta.health || delta.health <= 0) return null;
            const gain = delta.health * artifactConfig.super_vitamin.mentalRestoreRatio;
            if (gain < 0.1) return null;
            // Round to 1 decimal
            const actualGain = Math.round(gain * 10) / 10;
            delta.mental = (delta.mental || 0) + actualGain;
            return { message: I18n.t('game.artifactTriggers.super_vitamin', actualGain) };
        }
    },

    // 治愈流 (Healing)
    stray_cat: {
        id: 'stray_cat',
        name: () => I18n.t('data.artifacts.stray_cat.name'),
        description: () => I18n.t('data.artifacts.stray_cat.description', artifactConfig.stray_cat.dailyCost, artifactConfig.stray_cat.dailyMentalGain, artifactConfig.stray_cat.interval, artifactConfig.stray_cat.maxMentalGain),
        icon: '🐱',
        rarity: 'uncommon',
        onDaily: (state) => {
            const { dailyCost, dailyMentalGain, interval, maxMentalGain } = artifactConfig.stray_cat;
            const delta = {
                money: -dailyCost,
                mental: dailyMentalGain
            };

            // Periodic max mental gain
            if (state.day > 0 && state.day % interval === 0) {
                delta.maxMental = maxMentalGain;
            }

            const { logs, triggeredIds, layers } = processArtifactReactions(state, delta, 'stray_cat');

            let log = I18n.t('data.artifacts.stray_cat.log', dailyCost, dailyMentalGain);
            if (delta.maxMental) {
                log += '\n' + I18n.t('data.artifacts.stray_cat.log_max', maxMentalGain);
            }

            return {
                triggered: true,
                log: log,
                secondaryTriggers: triggeredIds,
                layers: layers,
                delta: delta
            };
        }
    }
};

export const getArtifact = (id) => artifacts[id];

export const getRandomArtifacts = (count = 3, rng, excludedIds = []) => {
    let keys = Object.keys(artifacts);

    // Filter out excluded artifacts
    if (Array.isArray(excludedIds) && excludedIds.length > 0) {
        const excludeSet = new Set(excludedIds);
        keys = keys.filter(id => !excludeSet.has(id));
    }

    const result = [];
    const tempKeys = [...keys];
    const random = rng && typeof rng.random === 'function' ? () => rng.random() : () => 0.5;

    for (let i = 0; i < count; i++) {
        if (tempKeys.length === 0) break;
        const randomIndex = Math.floor(random() * tempKeys.length);
        result.push(artifacts[tempKeys[randomIndex]]);
        tempKeys.splice(randomIndex, 1);
    }
    return result;
};
