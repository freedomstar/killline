/**
 * 存档模块 - 游戏保存与加载
 */
import { EventManager as GameEvents } from '../events/index.js';
import { SeededRNG } from '../rng.js';
import { GameData } from '../data/index.js';
import { I18n } from '../i18n.js';

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
            const savedCurrentEvent = parsed.currentEvent || null;

            // 恢复状态
            this.state = parsed.state;
            this.pendingEnergyChange = parsed.pendingEnergyChange || 0;
            this.isRunning = true;
            this.currentEvent = null; // 先置空，等 RNG 恢复后再重建事件

            // V2.XX 多神器存档兼容
            if (!Array.isArray(this.state.artifacts)) {
                if (this.state.artifact) {
                    this.state.artifacts = [this.state.artifact];
                } else {
                    this.state.artifacts = [];
                }
            }
            this.state.artifacts = this.state.artifacts.map(id => id === 'coffee_iv_drip' ? 'coffee_drip' : id);

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
            if (!this.state.autoRepay || typeof this.state.autoRepay !== 'object') {
                this.state.autoRepay = { enabled: false, keepCash: 1000, maxDaily: 0 };
            }
            this.state.autoRepay.enabled = !!this.state.autoRepay.enabled;
            this.state.autoRepay.keepCash = Math.max(0, Math.round(this.state.autoRepay.keepCash || 0));
            this.state.autoRepay.maxDaily = Math.max(0, Math.round(this.state.autoRepay.maxDaily || 0));
            if (typeof this.state.autoRepaySetupPrompted !== 'boolean') this.state.autoRepaySetupPrompted = false;
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

            // V2.XX 根因修复：统一重建读档事件（JSON 会丢失 function）
            const rehydrateEvent = (savedEvent) => {
                if (!savedEvent || !savedEvent.id) return savedEvent;

                if (savedEvent.id === 'day_work') {
                    const rebuiltChoices = GameEvents.generateDailyWorkEvent(this.state, {
                        game: this,
                        rng: this.rng,
                        successRate: GameEvents.calculateSuccessRate(this.state)
                    });
                    return {
                        ...savedEvent,
                        choices: rebuiltChoices
                    };
                }

                if (savedEvent.id === 'night_choice') {
                    return GameEvents.getNightChoiceEvent(this.state);
                }

                if (savedEvent.id === 'evening_dashboard') {
                    return null;
                }

                const baseEvent = GameEvents.events.find(e => e.id === savedEvent.id);
                if (!baseEvent) return savedEvent;

                const rebuilt = { ...savedEvent };

                if (typeof baseEvent.title === 'function') rebuilt.title = baseEvent.title;
                if (typeof baseEvent.description === 'function') rebuilt.description = baseEvent.description;
                if (typeof baseEvent.condition === 'function') rebuilt.condition = baseEvent.condition;
                if (baseEvent.type) rebuilt.type = baseEvent.type;
                if (baseEvent.period) rebuilt.period = baseEvent.period;

                if (typeof baseEvent.generateChoices === 'function') {
                    rebuilt.generateChoices = baseEvent.generateChoices;
                    rebuilt.choices = baseEvent.generateChoices(this.state, {
                        game: this,
                        rng: this.rng,
                        successRate: GameEvents.calculateSuccessRate(this.state)
                    }) || [];
                    return rebuilt;
                }

                if (Array.isArray(baseEvent.choices)) {
                    rebuilt.choices = baseEvent.choices.map((baseChoice, index) => {
                        const savedChoice = Array.isArray(savedEvent.choices) ? savedEvent.choices[index] : null;
                        return {
                            ...(savedChoice || {}),
                            ...baseChoice,
                            text: (savedChoice && savedChoice.text) ? savedChoice.text : baseChoice.text
                        };
                    });
                }

                return rebuilt;
            };

            if (Array.isArray(this.state.eventQueue) && this.state.eventQueue.length > 0) {
                this.state.eventQueue = this.state.eventQueue
                    .map(evt => rehydrateEvent(evt))
                    .filter(Boolean);
            }

            this.currentEvent = rehydrateEvent(savedCurrentEvent);

            // V2.XX 读档后按当前语言重建市场新闻/内幕提示，避免跨语言存档出现旧语言文本
            const rebuildNewsForCurrentLang = (savedNews) => {
                if (!savedNews || !savedNews.id) return savedNews;

                // 辟谣新闻
                if (savedNews.id.startsWith('denial_')) {
                    const baseId = savedNews.id.replace('denial_', '');
                    const baseNews = this.getMarketNewsById ? this.getMarketNewsById(baseId) : null;
                    const assetName = baseNews && baseNews.assetId
                        ? I18n.t(`data.assetNames.${baseNews.assetId}`)
                        : '';
                    return {
                        id: savedNews.id,
                        title: I18n.t('game.artifactDaily.ticker_news_title'),
                        description: I18n.t('game.log.marketDenial', assetName),
                        type: 'news',
                        stage: 'denied',
                        effect: {},
                        sentiment: 0
                    };
                }

                const baseNews = this.getMarketNewsById ? this.getMarketNewsById(savedNews.id) : null;
                if (!baseNews) return savedNews;

                if ((savedNews.stage === 'rumor' || savedNews.stage === 'confirmed') && this.createStagedNews) {
                    return this.createStagedNews(baseNews, savedNews.stage);
                }

                return {
                    id: baseNews.id,
                    title: baseNews.title,
                    description: baseNews.description || '',
                    effect: baseNews.effect,
                    sentiment: baseNews.sentiment,
                    stage: savedNews.stage,
                    type: savedNews.type
                };
            };

            if (this.state.currentNews) {
                this.state.currentNews = rebuildNewsForCurrentLang(this.state.currentNews);
            }

            if (this.state.dailyInsiderTip && this.state.dailyInsiderTip.assetId) {
                const assetId = this.state.dailyInsiderTip.assetId;
                const assetName = I18n.t(`data.assetNames.${assetId}`);
                this.state.dailyInsiderTip = {
                    ...this.state.dailyInsiderTip,
                    text: I18n.t('game.artifactDaily.insider_phone_tip', assetName),
                    details: I18n.t('game.artifactDaily.insider_phone_detail', assetName)
                };
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
