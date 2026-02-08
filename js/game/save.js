/**
 * 存档模块 - 游戏保存与加载
 */
import { EventManager as GameEvents } from '../events/index.js';
import { SeededRNG } from '../rng.js';
import { GameData } from '../data/index.js';

/**
 * 存档相关方法的 Mixin
 */
export const SaveMixin = {
    /**
     * 获取存档槽位信息
     */
    getSlotInfo(slotId) {
        const key = `killzone_save_${slotId}`;
        const savedData = localStorage.getItem(key);
        if (!savedData) return null;

        try {
            const parsed = JSON.parse(savedData);
            // V2.XX: 优先显示原始种子字符串 -> state.seed -> rngInitialSeed (兼容旧存档)
            let displaySeed = parsed.rngOriginalSeed;
            if (!displaySeed) displaySeed = parsed.state.seed;
            if (!displaySeed) displaySeed = parsed.rngInitialSeed;

            return {
                slotId: slotId,
                day: parsed.state.day,
                money: parsed.state.money,
                job: parsed.state.job,
                savedAt: parsed.savedAt,
                seed: displaySeed
            };
        } catch (e) {
            console.error(`[Game] 读取存档槽 ${slotId} 失败:`, e);
            return null;
        }
    },

    /**
     * 获取所有存档槽位信息
     */
    getAllSlotInfo() {
        return [0, 1, 2, 3].map(slotId => this.getSlotInfo(slotId));
    },

    /**
     * 保存游戏
     */
    saveGame(slotId) {
        if (slotId < 0 || slotId > 3) {
            console.error('[Game] 无效的存档槽位:', slotId);
            return false;
        }

        const key = `killzone_save_${slotId}`;
        const saveData = {
            state: JSON.parse(JSON.stringify(this.state)),
            rngSeed: this.rng.seed, // 当前 RNG 内部种子
            rngInitialSeed: this.rng.initialSeed,
            rngOriginalSeed: this.rng.originalSeed, // V2.XX 保存原始种子字符串
            pendingEnergyChange: this.pendingEnergyChange,
            currentEvent: this.currentEvent, // V2.12: 保存当前事件以保证读档后选项一致
            savedAt: new Date().toISOString()
        };

        try {
            localStorage.setItem(key, JSON.stringify(saveData));
            console.log(`[Game] 游戏已保存到槽位 ${slotId}`);
            return true;
        } catch (e) {
            console.error('[Game] 保存失败:', e);
            return false;
        }
    },

    /**
     * 加载游戏
     */
    loadGame(slotId) {
        const key = `killzone_save_${slotId}`;
        const savedData = localStorage.getItem(key);

        if (!savedData) {
            console.error(`[Game] 槽位 ${slotId} 没有存档`);
            return false;
        }

        try {
            const parsed = JSON.parse(savedData);

            // 恢复状态
            this.state = parsed.state;
            this.pendingEnergyChange = parsed.pendingEnergyChange || 0;
            this.isRunning = true;
            this.currentEvent = parsed.currentEvent || null; // V2.12: 恢复当前事件

            // V2.XX 多神器存档兼容
            if (!Array.isArray(this.state.artifacts)) {
                if (this.state.artifact) {
                    this.state.artifacts = [this.state.artifact];
                } else {
                    this.state.artifacts = [];
                }
            }
            this.state.artifacts = this.state.artifacts.map(id => id === 'coffee_iv_drip' ? 'coffee_drip' : id);

            // V2.13: 修复读档后 event.choices 丢失 function 的问题
            if (this.currentEvent) {
                if (this.currentEvent.id === 'day_work') {
                    // 特殊处理 day_work: 它是动态生成的
                    // 注意: generateDailyWorkEvent 返回的是 choices 数组，不是事件对象
                    const dummyState = JSON.parse(JSON.stringify(this.state));
                    const tempChoices = GameEvents.generateDailyWorkEvent(dummyState, { game: this, rng: this.rng });

                    // 恢复 choice.effect 和 hint
                    this.currentEvent.choices.forEach((c, i) => {
                        if (tempChoices[i]) {
                            c.effect = tempChoices[i].effect;
                            c.hint = tempChoices[i].hint;
                            c.hintType = tempChoices[i].hintType;
                        }
                    });
                } else if (this.currentEvent.id === 'night_choice') {
                    // 特殊处理 night_choice
                    const tempEvent = GameEvents.getNightChoiceEvent(this.state);
                    this.currentEvent.choices.forEach(c => {
                        if (c.nightAction) {
                            const match = tempEvent.choices.find(tc => tc.nightAction === c.nightAction);
                            if (match) {
                                c.effect = match.effect;
                                c.hint = match.hint;
                            }
                        }
                    });
                } else {
                    // 标准静态事件
                    const baseEvent = GameEvents.events.find(e => e.id === this.currentEvent.id);
                    if (baseEvent) {
                        // 恢复动态描述和标题
                        if (typeof baseEvent.description === 'function') this.currentEvent.description = baseEvent.description;
                        if (typeof baseEvent.title === 'function') this.currentEvent.title = baseEvent.title;

                        this.currentEvent.choices.forEach((c, i) => {
                            // 尝试按索引匹配
                            if (baseEvent.choices[i]) {
                                c.effect = baseEvent.choices[i].effect;
                                c.hint = baseEvent.choices[i].hint;
                                c.hintType = baseEvent.choices[i].hintType;
                                // 尽量也恢复 condition
                                if (baseEvent.choices[i].condition) c.condition = baseEvent.choices[i].condition;
                            }
                        });
                    }
                }
            }
            // V2.13: 修复读档后 dailyActions/incidents 丢失 function 的问题
            if (this.state.currentDailyActions) {
                this.state.currentDailyActions.forEach(action => {
                    if (action.id === 'none') return;
                    const baseAction = GameEvents.getDailyActionById(action.id);
                    if (baseAction) {
                        action.hint = baseAction.hint;
                        action.effect = baseAction.effect;
                        action.hintType = baseAction.hintType;
                    }
                });
            }

            if (this.state.activeIncidents) {
                this.state.activeIncidents.forEach(incident => {
                    const baseIncident = GameEvents.getIncidentById(incident.id);
                    if (baseIncident) {
                        incident.choices.forEach(c => {
                            const baseChoice = baseIncident.choices.find(bc => bc.id === c.id);
                            if (baseChoice) {
                                c.hint = baseChoice.hint;
                                c.effect = baseChoice.effect;
                            }
                        });
                    }
                });
            }

            // V2.13: 兼容旧存档 stats
            if (!this.state.stats) {
                this.state.stats = { maxWealth: this.state.money };
            }

            if (!this.state.randomEventsToday) {
                this.state.randomEventsToday = [];
            }
            if (typeof this.state.randomEventsTodayCount !== 'number') {
                this.state.randomEventsTodayCount = 0;
            }
            if (!this.state.randomEventLastDay) {
                this.state.randomEventLastDay = {};
            }

            if (!('pendingHousing' in this.state)) {
                this.state.pendingHousing = null;
            }

            // 内幕电话/市场传闻兼容字段（旧存档迁移）
            if (!('marketRumorId' in this.state)) this.state.marketRumorId = null;
            if (typeof this.state.marketRumorConfirmDay !== 'number') this.state.marketRumorConfirmDay = 0;
            if (typeof this.state.isInsiderRumor !== 'boolean') this.state.isInsiderRumor = false;
            if (!('dailyInsiderTip' in this.state)) this.state.dailyInsiderTip = null;
            if (typeof this.state.insiderPhoneCD !== 'number') this.state.insiderPhoneCD = 0;

            if (!this.state.housing || typeof this.state.housingCost !== 'number' || this.state.housingCost < 0) {
                this.state.housing = this.state.housing || 'apartment';
                const baseCost = GameData.housingTypes?.[this.state.housing]?.cost || 1000;
                this.state.housingCost = Math.floor(baseCost * (this.state.rentIndex || 1));
            }

            // 债务系统存档迁移
            if (typeof this.state.debt !== 'number') this.state.debt = 0;
            if (!Array.isArray(this.state.debtItems)) this.state.debtItems = [];
            if (typeof this.state.debtInterestAccrued !== 'number') this.state.debtInterestAccrued = 0;
            if (!Array.isArray(this.state.pendingMedicalInstallments)) this.state.pendingMedicalInstallments = [];
            if (typeof this.state.unpaidRentMonths !== 'number') this.state.unpaidRentMonths = 0;

            if (this.state.money < 0) {
                const overflow = Math.abs(this.state.money);
                this.state.money = 0;
                this.state.debt += overflow;
                this.state.debtItems.push({ source: 'overflow', amount: Math.round(overflow), day: this.state.day || 0 });
            }

            if (this.state.medicalDebt > 0) {
                const legacyMedical = Math.round(this.state.medicalDebt);
                this.state.debt += legacyMedical;
                this.state.debtItems.push({ source: 'medical', amount: legacyMedical, day: this.state.day || 0 });
                this.state.medicalDebt = 0;
            }
            if (this.state.medicalDebtInstallment) {
                this.state.medicalDebtInstallment = false;
            }

            // V2.11 恢复 RNG 状态
            if (parsed.rngSeed !== undefined && parsed.rngInitialSeed !== undefined) {
                this.rng = new SeededRNG();
                this.rng.seed = parsed.rngSeed;
                this.rng.initialSeed = parsed.rngInitialSeed;
                if (parsed.rngOriginalSeed) {
                    this.rng.originalSeed = parsed.rngOriginalSeed;
                }
            } else {
                // Fallback for older saves without explicit RNG state
                this.rng = new SeededRNG(parsed.state.seed);
            }

            console.log(`[Game] 已从槽位 ${slotId} 加载存档, 第 ${this.state.day} 天`);
            return true;
        } catch (e) {
            console.error('[Game] 加载失败:', e);
            return false;
        }
    },

    /**
     * 删除存档
     */
    deleteSlot(slotId) {
        if (slotId === 0) {
            console.warn('[Game] 无法删除自动存档');
            return;
        }
        const key = `killzone_save_${slotId}`;
        localStorage.removeItem(key);
        console.log(`[Game] 槽位 ${slotId} 存档已删除`);
    }
};
