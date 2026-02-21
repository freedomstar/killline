/**
 * 事件模块 - 事件获取与玩家选择处理
 */
import { GameData } from '../data/index.js';
import { EventManager as GameEvents } from '../events/index.js';
import { nightChoices } from '../events/nightChoices.js';
import { I18n } from '../i18n.js';
import { getArtifact, processArtifactReactions } from '../data/artifacts.js';

/**
 * 事件相关方法的 Mixin
 */
export const EventsMixin = {
    _applyDynamicChoices(event, context) {
        if (!event) return event;
        if (typeof event.generateChoices !== 'function') return event;
        const choices = event.generateChoices(this.state, context) || [];
        return { ...event, choices };
    },
    recordRandomEvent(event) {
        if (!event || !event.isRandom) return;
        if (!this.state.randomEventsToday) this.state.randomEventsToday = [];
        if (typeof this.state.randomEventsTodayCount !== 'number') this.state.randomEventsTodayCount = 0;
        if (!this.state.randomEventLastDay) this.state.randomEventLastDay = {};

        if (!this.state.randomEventsToday.includes(event.id)) {
            this.state.randomEventsToday.push(event.id);
            this.state.randomEventsTodayCount += 1;
        }
        this.state.randomEventLastDay[event.id] = this.state.day;
    },

    /**
     * V2.7 分配新工作任务
     */
    assignNewTask() {
        const localizedTaskNames = I18n.t('game.taskNames');
        const fallbackTaskNames = ['项目开发', '报告撰写', '数据分析', '客户方案', '系统维护', '代码审查'];
        const taskNames = Array.isArray(localizedTaskNames) && localizedTaskNames.length > 0
            ? localizedTaskNames
            : fallbackTaskNames;
        // 使用配置中的任务参数
        const taskConfig = GameData.workTaskConfig || {
            // Fallback default if config missing
            difficultyMin: 30, difficultyMax: 60,
            deadlineMin: 3, deadlineMax: 7
        };
        const difficulty = this.rng.range(taskConfig.difficultyMin, taskConfig.difficultyMax);
        const deadline = this.rng.range(taskConfig.deadlineMin, taskConfig.deadlineMax);

        this.state.workTask = {
            difficulty: difficulty,
            deadline: deadline,
            progress: 0,
            overdueDays: 0,
            name: taskNames[Math.floor(this.rng.random() * taskNames.length)]
        };
        console.log(`[Game] 新任务: ${this.state.workTask.name}, 难度${difficulty}, 期限${deadline}天`);
    },

    // Helper: Create a state proxy to intercept artifact effects (e.g. Mom Credit Card)
    _getReactiveState(baseState) {
        if (this.isPreview) return baseState;
        if (!baseState || !Array.isArray(baseState.artifacts) || !baseState.artifacts.includes('mom_credit_card')) return baseState;

        // V2.8 Change: Condition - Only active when money < 500
        if ((baseState.money || 0) >= 500) return baseState;

        const discount = GameData.artifactConfig?.mom_credit_card?.debtDiscount || 0.5;

        // Capture 'this' for proxy handler
        const self = this;

        return new Proxy(baseState, {
            set(target, prop, value) {
                if (prop === 'money') {
                    const oldVal = target[prop];
                    const diff = value - oldVal;
                    // Intercept Spending (diff < 0)
                    if (diff < 0 && typeof diff === 'number') {
                        const discountedDiff = diff * discount;
                        target[prop] = oldVal + discountedDiff;

                        // V2.XX: Record trigger for UI feedback
                        if (self._tempArtifactTriggers) {
                            const savedAmount = Math.round(Math.abs(diff - discountedDiff));
                            self._tempArtifactTriggers.push({
                                id: 'mom_credit_card',
                                amount: savedAmount, // Store usage amount for aggregation
                                message: I18n.t('game.artifactTriggers.mom_credit_card', savedAmount)
                            });
                        }
                        return true;
                    }
                }
                target[prop] = value;
                return true;
            }
        });
    },

    _getArtifactSnapshot(state) {
        return {
            money: state.money || 0,
            energy: state.energy || 0,
            mental: state.mental || 0,
            health: state.health || 0,
            workProgress: state.workTask ? state.workTask.progress : 0,
            maxWorkProgress: state.workTask ? state.workTask.maxProgress : GameData.initialState.workTask.maxProgress,
            investment: this._calculatePortfolioValue(state)
        };
    },

    _calculatePortfolioValue(state) {
        const prices = state.marketPrices || {};
        const holdings = state.holdings || {};
        let portfolioValue = 0;
        Object.keys(holdings).forEach(id => {
            const holding = holdings[id];
            if (holding && prices[id]) {
                portfolioValue += holding.quantity * prices[id].price;
            }
        });
        return portfolioValue;
    },

    _computeArtifactDelta(before, after) {
        const workProgress = after.workTask ? after.workTask.progress : 0;
        return {
            money: (after.money || 0) - (before.money || 0),
            energy: (after.energy || 0) - (before.energy || 0),
            mental: (after.mental || 0) - (before.mental || 0),
            health: (after.health || 0) - (before.health || 0),
            workProgress: workProgress - (before.workProgress || 0),
            investment: (after.investment || 0) - (before.investment || 0)
        };
    },

    _applyArtifactActionEffects(baseDelta, actionInfo, context) {
        if (!Array.isArray(this.state.artifacts) || this.state.artifacts.length === 0) {
            return { triggers: [], layers: [] };
        }

        const artifacts = this.state.artifacts;
        const actionDelta = { ...baseDelta };
        const triggers = [];
        const isWork = actionInfo.type === 'work' || actionInfo.id === 'day_work';

        const addTrigger = (id, message) => {
            if (!message) return;
            triggers.push({ id, message });
        };

        // 使用临时 state 副本进行 processArtifactReactions 计算
        // 这样可以获取增量而不直接修改真实 state
        const tempState = {
            ...this.state,
            health: 0,
            mental: 0,
            energy: 0,
            money: 0
        };

        // 调用 processArtifactReactions 处理 onModifyBase 循环
        const { logs, triggeredIds, layers, totalDelta } = processArtifactReactions(
            tempState,
            actionDelta,
            null // 无初始触发源，允许所有神器参与
        );

        // 将 logs 转换为 triggers 格式
        logs.forEach((msg, idx) => {
            if (msg && triggeredIds[idx]) {
                addTrigger(triggeredIds[idx], msg);
            }
        });

        // 从 totalDelta 计算神器产生的调整量
        const artifactAdjustments = {
            money: (totalDelta.money || 0) - (actionDelta.money || 0),
            energy: (totalDelta.energy || 0) - (actionDelta.energy || 0),
            mental: (totalDelta.mental || 0) - (actionDelta.mental || 0),
            health: (totalDelta.health || 0) - (actionDelta.health || 0),
            workProgress: (totalDelta.workProgress || 0) - (actionDelta.workProgress || 0)
        };

        // 更新 actionDelta 为 totalDelta
        Object.keys(totalDelta).forEach(key => {
            actionDelta[key] = totalDelta[key];
        });

        // 临时应用 onModifyBase 产生的金钱变化到 state，
        // 以便 onModifyMult（如 bull_plushie）可以基于正确的存款金额计算乘数
        const baseMoneyChange = actionDelta.money - baseDelta.money;
        this.state.money += baseMoneyChange;

        // Apply multiplicative modifiers
        if (actionDelta.money !== 0) {
            let positiveMult = 1;
            let negativeMult = 1;

            artifacts.forEach((id) => {
                const artifact = getArtifact(id);
                if (!artifact || typeof artifact.onModifyMult !== 'function') return;
                const res = artifact.onModifyMult(this.state, actionInfo, actionDelta, context);
                if (!res || !res.multiplier) return;

                // V2.XX: Check for significant impact (>= 0.1)
                const currentMult = (actionDelta.money > 0) ? positiveMult : negativeMult;
                const projectedImpact = Math.abs(actionDelta.money * currentMult * (res.multiplier - 1));
                if (projectedImpact < 0.1) return;

                const appliesTo = res.appliesTo || 'positive';
                if (appliesTo === 'all') {
                    positiveMult *= res.multiplier;
                    negativeMult *= res.multiplier;
                } else if (appliesTo === 'negative') {
                    negativeMult *= res.multiplier;
                } else {
                    positiveMult *= res.multiplier;
                }

                if (res.message) addTrigger(id, res.message);
            });

            if (actionDelta.money > 0) {
                actionDelta.money = Math.round(actionDelta.money * positiveMult * 10) / 10;
            } else if (actionDelta.money < 0) {
                actionDelta.money = Math.round(actionDelta.money * negativeMult * 10) / 10;
            }
        }

        // 恢复临时应用的金钱变化（最终调整会在下面统一应用）
        this.state.money -= baseMoneyChange;

        // Apply adjustments
        const adjustments = {
            money: actionDelta.money - baseDelta.money,
            energy: actionDelta.energy - baseDelta.energy,
            mental: actionDelta.mental - baseDelta.mental,
            health: actionDelta.health - baseDelta.health,
            workProgress: actionDelta.workProgress - baseDelta.workProgress
        };

        if (adjustments.money) this.state.money += adjustments.money;
        if (adjustments.energy) this.state.energy += adjustments.energy;
        if (adjustments.mental) this.state.mental += adjustments.mental;
        if (adjustments.health) this.state.health += adjustments.health;
        if (adjustments.workProgress && this.state.workTask) {
            const maxProgress = this.state.workTask.maxProgress || GameData.initialState.workTask.maxProgress;
            this.state.workTask.progress = Math.min(maxProgress, this.state.workTask.progress + adjustments.workProgress);
        }

        // Track daily spend
        if (baseDelta.money < 0) {
            this.state.spentMoneyToday = true;
        }

        // Update work history
        if (isWork && actionInfo.choiceId && baseDelta.workProgress > 0) {
            this.state.lastWorkChoiceId = actionInfo.choiceId;
            this.state.lastWorkProgressGain = baseDelta.workProgress;
        }

        return { triggers, layers };
    },

    /**
     * V2.XX 计算当前的裁员风险百分比
     */
    calculateLayoffRisk() {
        if (!this.state || (this.state.job !== 'fulltime' && this.state.job !== 'intern')) return 0;

        // 如果已经有待处理的 PIP 预兆，下个工作日几乎必发，直接显示 100%
        if (this.state.pendingPipWarning) return 100;

        // 裁员风险由两部分组成：
        // 1. 系统性权重风险 (社交值、工作效率带来的随机事件权重占比)
        // 2. 行为性触发风险 (任务逾期带来的滚雪球风险)

        const period = this.state.period;
        const availableEvents = GameEvents.getAvailableEvents(this.state, period, this.rng);

        // 优先处理强制事件，如果强制事件中有裁员类，风险会显著升高
        const mandatoryEvents = availableEvents.filter(e => e.mandatory === true);
        let layoffWeight = 0;
        let totalWeight = 0;

        if (mandatoryEvents.length > 0) {
            totalWeight = mandatoryEvents.reduce((sum, e) => sum + (typeof e.weight === 'function' ? e.weight(this.state) : (e.weight || 0)), 0);
            layoffWeight = mandatoryEvents
                .filter(e => e.type === 'layoff' || e.id === 'pip_warning' || e.id === 'sudden_layoff')
                .reduce((sum, e) => sum + (typeof e.weight === 'function' ? e.weight(this.state) : (e.weight || 0)), 0);
        } else {
            totalWeight = availableEvents.reduce((sum, e) => sum + (typeof e.weight === 'function' ? e.weight(this.state) : (e.weight || 0)), 0);
            layoffWeight = availableEvents
                .filter(e => e.type === 'layoff' || e.id === 'pip_warning' || e.id === 'sudden_layoff')
                .reduce((sum, e) => sum + (typeof e.weight === 'function' ? e.weight(this.state) : (e.weight || 0)), 0);
        }

        let weightProbability = totalWeight > 0 ? (layoffWeight / totalWeight) : 0;

        // 额外风险：任务逾期的独立触发概率 (time.js 中的逻辑)
        const overdueDays = (this.state.workTask && this.state.workTask.overdueDays) || 0;
        let taskRisk = 0;
        if (overdueDays > 0) {
            // time.js 中每超时一天增加 10% 概率触发 pendingPipWarning
            taskRisk = Math.min(1.0, overdueDays * 0.1);
        }

        // 最终风险 = 1 - (不发生权重裁员的概率 * 不发生逾期裁员的概率)
        const totalRisk = 1 - (1 - weightProbability) * (1 - taskRisk);

        return Math.round(totalRisk * 100);
    },

    _applyLunchSettlement(baseState, result) {
        const state = this._getReactiveState(baseState);
        const lunchType = state.lunchType || 'skip';
        const lunchOpt = GameData.lunchOptions[lunchType];
        if (!lunchOpt) return;

        let totalCost = lunchOpt.cost;
        let tipAmount = 0;
        if (lunchType === 'fastfood' && lunchOpt.cost > 0) {
            tipAmount = Math.round(lunchOpt.cost * GameData.usaFeatures.tipRate);
            totalCost += tipAmount;
        }
        this.deductMoney(totalCost, 'daily', { state: baseState });

        if (lunchOpt.healthEffect) state.health = Math.max(0, Math.min(state.maxHealth || 100, state.health + lunchOpt.healthEffect));
        if (lunchOpt.energyEffect) state.energy = Math.min(state.maxEnergy || 100, state.energy + lunchOpt.energyEffect);
        if (lunchOpt.mentalEffect) state.mental = Math.min(state.maxMental || 100, state.mental + lunchOpt.mentalEffect);
        if (lunchOpt.socialEffect) state.socialValue = Math.min(100, (state.socialValue || 50) + lunchOpt.socialEffect);

        if (lunchType === 'bento') state.hasPreparedMeal = false;
        const lunchName = typeof lunchOpt.name === 'function' ? lunchOpt.name() : lunchOpt.name;
        result.message += `\n🍱 ${I18n.t('ui.side.lunchLabel')}: ${lunchName}${totalCost > 0 ? ` -$${totalCost}` : ''}`;
    },

    _isLunchPhase(state) {
        if (!state) return false;
        return state.period === 'day' && !state.dayLunchDone;
    },

    _createLunchEvent() {
        const lunchOptions = GameEvents.getAvailableLunchOptions(this.state, { game: this, rng: this.rng }) || [];
        const availableChoices = lunchOptions
            .filter(opt => !opt.disabled)
            .map((opt) => ({
                id: `lunch_${opt.key}`,
                text: opt.name,
                hint: opt.hint,
                hintType: 'neutral',
                effect: (state) => {
                    state.lunchType = opt.key;
                    state.dayLunchDone = true;
                    const lunchResult = { message: '', type: 'neutral' };
                    this._applyLunchSettlement(state, lunchResult);
                    state.sideActionsLocked = false;
                    lunchResult.triggerEvent = 'FORCE_NEXT';
                    return lunchResult;
                }
            }));

        if (availableChoices.length === 0) {
            availableChoices.push({
                id: 'lunch_skip_fallback',
                text: I18n.t('data.lunch.skip.name'),
                hint: I18n.t('data.lunch.skip.hint', GameData.lunchOptions.skip || {}),
                hintType: 'neutral',
                effect: (state) => {
                    state.lunchType = 'skip';
                    state.dayLunchDone = true;
                    const lunchResult = { message: '', type: 'neutral' };
                    this._applyLunchSettlement(state, lunchResult);
                    state.sideActionsLocked = false;
                    lunchResult.triggerEvent = 'FORCE_NEXT';
                    return lunchResult;
                }
            });
        }

        return {
            id: 'day_lunch',
            type: 'daily',
            title: I18n.t('ui.side.lunchLabel'),
            description: I18n.t('ui.side.lunchLabel'),
            period: 'day',
            choices: availableChoices
        };
    },


    /**
     * Get event by ID (Wrapper to support synthetic events and standard lookup)
     */
    getEventById(id) {
        if (id === 'day_lunch') {
            return this._createLunchEvent();
        }
        if (id === 'FORCE_NEXT') {
            return this.getNextEvent();
        }
        const event = GameEvents.events.find(e => e.id === id);
        this.recordRandomEvent(event);
        return this._applyDynamicChoices(event, { game: this, rng: this.rng });
    },

    /**
     * 获取下一个事件
     */
    getNextEvent() {
        const period = this.state.period;

        if (period === 'day' && this._isLunchPhase(this.state) && !this.state.dayLunchDone) {
            this.currentEvent = this._createLunchEvent();
            this.state.sideActionsLocked = true;
            return this.currentEvent;
        }


        // V2.35 检查事件队列 (傍晚事件) - 优先于所有夜间/日常事件
        if (this.state.eventQueue && this.state.eventQueue.length > 0) {
            // 夜晚只消费 period=night 的队列事件，避免 any 事件顶替 night_choice。
            const queuedEvents = period === 'night'
                ? this.state.eventQueue.filter(evt => evt && evt.period === 'night')
                : this.state.eventQueue;

            if (queuedEvents.length > 0) {
                // 如果只有一个事件，直接触发
                if (queuedEvents.length === 1) {
                    const evt = queuedEvents[0];
                    const idx = this.state.eventQueue.findIndex(e => e.id === evt.id);
                    if (idx >= 0) this.state.eventQueue.splice(idx, 1);
                    this.currentEvent = this._applyDynamicChoices(evt, { game: this, rng: this.rng, successRate: GameEvents.calculateSuccessRate(this.state) });
                    this.recordRandomEvent(evt);
                    return this.currentEvent;
                }

                // 如果有多个事件，生成 Dashboard
                console.log('[Game] Multiple events pending, showing dashboard.');
                const dashboardEvent = {
                    id: 'evening_dashboard',
                    title: '待处理事项',
                    description: '今晚有几件事需要你处理...',
                    period: 'night',
                    choices: queuedEvents.map((evt, index) => {
                        return {
                            text: `处理: ${evt.title}`,
                            effect: (state) => {
                                // 从队列中找到并移除该事件
                                const qIdx = state.eventQueue.findIndex(e => e.id === evt.id);
                                if (qIdx >= 0) {
                                    state.eventQueue.splice(qIdx, 1);
                                }
                                // 触发该事件
                                return {
                                    triggerEvent: evt.id,
                                    message: `正在处理: ${evt.title}`
                                };
                            }
                        };
                    })
                };
                this.currentEvent = dashboardEvent;
                return dashboardEvent;
            }
        }

        // 夜间特殊处理：先处理强制夜宿，其次进入“夜间选择”(深夜随机事件放到 deep_night)
        if (period === 'night') {
            // 检查是否有强制事件（如流浪/睡车里）
            const context = { rng: this.rng };
            const forcedEvent = GameEvents.events.find(e =>
                (e.id === 'homeless_night' || e.id === 'car_night') &&
                e.period === 'night' &&
                e.condition && e.condition(this.state, context)
            );
            if (forcedEvent) {
                this.currentEvent = this._applyDynamicChoices(forcedEvent, { game: this, rng: this.rng, successRate: GameEvents.calculateSuccessRate(this.state) });
                return this.currentEvent;
            }

            this.currentEvent = GameEvents.getNightChoiceEvent(this.state);
            return this.currentEvent;
        }

        // 深夜特殊处理：深夜随机事件阶段
        if (period === 'deep_night') {
            console.log('[Game] Checking for random deep night events...');
            const allDeepNightEvents = GameEvents.getAvailableEvents(this.state, 'deep_night', this.rng);
            // 排除 any 事件，避免账单/机会类在深夜触发
            const availableDeepNightEvents = allDeepNightEvents.filter(e => e.period === 'deep_night');
            const deepNightRandomEvent = GameEvents.selectRandomEvent(availableDeepNightEvents, this.rng);

            if (deepNightRandomEvent) {
                this.currentEvent = { ...deepNightRandomEvent, isRandomEncounter: true };
                this.recordRandomEvent(deepNightRandomEvent);
                return this.currentEvent;
            }

            // 深夜没有随机事件：交给控制器自动推进到下一天
            this.currentEvent = null;
            return null;
        }

        // 强制事件优先（如医疗紧急情况）
        const mandatoryEvents = GameEvents.getMandatoryEvents(this.state, period, this.rng);
        if (mandatoryEvents && mandatoryEvents.length > 0) {
            const mandatoryEvent = GameEvents.selectRandomEvent(mandatoryEvents, this.rng);
            this.currentEvent = this._applyDynamicChoices(mandatoryEvent, { game: this, rng: this.rng, successRate: GameEvents.calculateSuccessRate(this.state) });
            this.recordRandomEvent(this.currentEvent);
            return this.currentEvent;
        }

        // 随机选择事件
        const availableEvents = GameEvents.getAvailableEvents(this.state, period, this.rng);
        let selectedEvent = GameEvents.selectRandomEvent(availableEvents, this.rng);

        // V2.42+：白天主事件优先级
        // - 工作日：优先 day_work
        // - 休息日：优先 day_rest
        // 其它白天随机/机会事件不应顶替主事件：允许进入队列，傍晚再处理。
        if (period === 'day' && selectedEvent) {
            const workEvent = availableEvents.find(e => e.id === 'day_work');
            const restEvent = availableEvents.find(e => e.id === 'day_rest');

            // day_rest 与 day_work 在条件上应互斥；这里按“哪个存在就优先哪个”处理。
            const preferred = restEvent || workEvent;

            if (preferred && selectedEvent.id !== preferred.id) {
                console.log(`[Game] Conflict: Picked ${selectedEvent.id} but should be ${preferred.id}. Queueing event.`);

                // 确保队列存在
                if (!this.state.eventQueue) this.state.eventQueue = [];

                // 只有非强制事件，或者显式允许排队的强制事件才通过队列延后
                if (!selectedEvent.mandatory || selectedEvent.allowQueue) {
                    this.state.eventQueue.push(selectedEvent);
                    selectedEvent = preferred;
                }
            }
        }

        // 特殊处理：如果是工作事件，需要动态生成选项
        if (selectedEvent && selectedEvent.id === 'day_work') {
            this.currentEvent = { ...selectedEvent };
            if (this.state.pendingPipWarning) {
                this.currentEvent.description = I18n.t('game.foreseeing.workMoodWarning', this.currentEvent.description);
                this.state.pendingPipWarning = false;
            }
            this.currentEvent.choices = GameEvents.generateDailyWorkEvent(this.state, { game: this, rng: this.rng, successRate: GameEvents.calculateSuccessRate(this.state) });
            return this.currentEvent;
        }

        this.currentEvent = this._applyDynamicChoices(selectedEvent, { game: this, rng: this.rng, successRate: GameEvents.calculateSuccessRate(this.state) });
        this.recordRandomEvent(this.currentEvent);
        return this.currentEvent;
    },

    /**
     * 处理玩家选择
     */
    _applyDaytimeSideSettlements(baseState, context, result) {
        // V2.XX Wrap state with proxy for side settlements too
        // Note: baseState here might be this.state or a simulation copy.
        // If it is a simulation copy, _getReactiveState will wrap the copy.
        const state = this._getReactiveState(baseState);

        // V2.55 Fix: 如果侧边行动已锁定（已在同一时段的前一个事件中结算），不再重复执行
        if (state.sideActionsLocked) return;
        // V2.46 Fix: 如果是随机事件 (isRandom / isRandomEncounter)，忽略侧边行动 (DailyAction/Commute)
        // 防止用户在主界面选择了动作后，弹出随机事件时，后台依然扣除了该动作的资源
        if (this.currentEvent && (this.currentEvent.isRandom || this.currentEvent.isRandomEncounter)) {
            // 午餐通常是必选项，且随机事件可能发生在午饭前/后
            // 但如果这是一个"突发遭遇"，通常它打断了正常流程。
            // 为安全起见，且根据 bug 报告 (afternoon_exercise)，我们主要想阻止 DailyAction。
            // 简单策略：随机事件不结算侧边栏。
            // (注意：如果随机事件本身就是 lunch 相关的，它自然会处理饿不饿的问题，这里仅负责 Dashboard Sidebars)
            return;
        }

        if (this.currentEvent && this.currentEvent.id === 'medical_emergency') {
            return;
        }

        // 只有在真正执行结算时才锁定，避免随机/插队事件导致侧边栏被永久锁死到当天结束
        state.sideActionsLocked = true; // 结算开始，锁定选择器

        if (!result.ignoreLunch && !this._isLunchPhase(state)) {
            this._applyLunchSettlement(baseState, result);
        }

        // 1. 结算日常侧边行动
        if (state.selectedDailyAction && state.selectedDailyAction !== 'none') {
            const dailyAction = GameEvents.getDailyActionById(state.selectedDailyAction);
            if (dailyAction) {
                const dailyRes = dailyAction.effect(state, context);
                result.message += `\n✨ ${dailyAction.text}: ${dailyRes.message}`;
            }
        }

        // 2. 结算突发事件处理
        if (state.selectedIncident && state.selectedIncident !== 'none') {
            const [incidentId, optionId] = state.selectedIncident.split(':');
            const incident = GameEvents.getIncidentById(incidentId);
            if (incident) {
                const option = incident.choices.find(c => c.id === optionId);
                if (option) {
                    const incidentRes = option.effect(state, context);
                    result.message += `\n⚠️ ${incident.title}: ${incidentRes.message}`;
                }
            }
        }


    },

    /**
     * 仅预览白天侧边选项(午餐/通勤/额外行动/突发)的影响
     */
    previewDaySideSelections() {
        const baseState = JSON.parse(JSON.stringify(this.state));
        const previewKeys = ['money', 'energy', 'mental', 'health', 'socialValue', 'workEfficiency'];

        const runSample = (forcedRandom = null) => {
            const sim = new this.constructor();
            sim.state = JSON.parse(JSON.stringify(this.state));
            sim.currentEvent = this.currentEvent;
            sim.pendingEnergyChange = this.pendingEnergyChange;
            sim.rng = this.rng ? this.rng.clone() : null;
            sim.isPreview = true;

            const rngTracker = { used: false };
            if (sim.rng && typeof sim.rng.random === 'function') {
                const originalRandom = sim.rng.random.bind(sim.rng);
                sim.rng.random = () => {
                    rngTracker.used = true;
                    if (forcedRandom === null) return originalRandom();
                    return forcedRandom;
                };
            }

            const context = { game: sim, rng: sim.rng, isPreview: true };
            const result = { message: '', type: 'neutral' };
            sim._applyDaytimeSideSettlements(sim.state, context, result);
            sim.clampValues();

            return { result, state: sim.state, pendingEnergyChange: sim.pendingEnergyChange, usedRng: rngTracker.used };
        };

        // first: 使用真实 RNG 流（克隆）获得真实预览结果
        const first = runSample(null);
        if (!first.usedRng) {
            return {
                result: first.result,
                state: first.state,
                pendingEnergyChange: first.pendingEnergyChange,
                usedRng: false,
                deterministic: true,
                maskedPreview: false,
                maskedKeys: [],
                maskedState: first.state
            };
        }

        // 用极值 RNG（0 / 0.999999）探测随机影响：只预览稳定不变的字段，避免“剧透”随机数值
        const low = runSample(0);
        const high = runSample(0.999999);

        const maskedState = JSON.parse(JSON.stringify(baseState));
        const maskedKeys = [];

        for (const key of previewKeys) {
            const lowVal = low && low.state && typeof low.state[key] === 'number' ? Math.round(low.state[key]) : 0;
            const highVal = high && high.state && typeof high.state[key] === 'number' ? Math.round(high.state[key]) : 0;
            if (lowVal === highVal) {
                maskedState[key] = first.state[key];
            } else {
                maskedKeys.push(key);
            }
        }

        const maskedPreview = maskedKeys.length > 0;

        return {
            result: first.result,
            state: first.state,
            pendingEnergyChange: first.pendingEnergyChange,
            usedRng: true,
            deterministic: !maskedPreview,
            maskedPreview,
            maskedKeys,
            maskedState
        };
    },

    previewChoice(choiceIndex) {
        if (!this.currentEvent || !this.currentEvent.choices || !this.currentEvent.choices[choiceIndex]) {
            return null;
        }

        const baseState = JSON.parse(JSON.stringify(this.state));
        const previewKeys = ['money', 'energy', 'mental', 'health', 'socialValue', 'workEfficiency'];

        const runSample = (forcedRandom = null) => {
            const sim = new this.constructor();
            sim.state = JSON.parse(JSON.stringify(this.state));
            sim.currentEvent = this.currentEvent;
            sim.pendingEnergyChange = this.pendingEnergyChange;
            sim.rng = this.rng ? this.rng.clone() : null;
            sim.isPreview = true;

            const rngTracker = { used: false };
            if (sim.rng && typeof sim.rng.random === 'function') {
                const originalRandom = sim.rng.random.bind(sim.rng);
                sim.rng.random = () => {
                    rngTracker.used = true;
                    if (forcedRandom === null) return originalRandom();
                    return forcedRandom;
                };
            }

            const result = sim.handleChoice(choiceIndex);
            if (!result) return null;

            return {
                result,
                state: sim.state,
                pendingEnergyChange: sim.pendingEnergyChange,
                usedRng: rngTracker.used
            };
        };

        // first: 使用真实 RNG 流（克隆）获得真实预览结果（用于后续确认时展示）
        const first = runSample(null);
        if (!first) return null;

        if (!first.usedRng) {
            return {
                result: first.result,
                state: first.state,
                pendingEnergyChange: first.pendingEnergyChange,
                usedRng: false,
                deterministic: true,
                maskedPreview: false,
                maskedKeys: [],
                maskedState: first.state
            };
        }

        // 用极值 RNG（0 / 0.999999）探测随机影响：只预览稳定不变的字段，避免“剧透”随机数值
        const low = runSample(0);
        const high = runSample(0.999999);

        const maskedState = JSON.parse(JSON.stringify(baseState));
        const maskedKeys = [];

        for (const key of previewKeys) {
            const lowVal = low && low.state && typeof low.state[key] === 'number' ? Math.round(low.state[key]) : 0;
            const highVal = high && high.state && typeof high.state[key] === 'number' ? Math.round(high.state[key]) : 0;
            if (lowVal === highVal) {
                maskedState[key] = first.state[key];
            } else {
                maskedKeys.push(key);
            }
        }

        const maskedPreview = maskedKeys.length > 0;

        return {
            result: first.result,
            state: first.state,
            pendingEnergyChange: first.pendingEnergyChange,
            usedRng: true,
            deterministic: !maskedPreview,
            maskedPreview,
            maskedKeys,
            maskedState
        };
    },

    handleChoice(choiceIndex) {
        if (!this.currentEvent || !this.currentEvent.choices[choiceIndex]) {
            return null;
        }

        const choice = this.currentEvent.choices[choiceIndex];

        const beforeSnapshot = this._getArtifactSnapshot(this.state);
        const beforeJob = this.state.job;
        const beforeIncome = this.state.monthlyIncome;

        // 计算成功率（受精力影响）
        const successRate = GameEvents.calculateSuccessRate(this.state);

        let result;

        // V2.6: Create context object for dependency injection
        const context = {
            game: this,
            rng: this.rng,
            successRate: successRate,
            isPreview: !!this.isPreview,
            GameData: GameData
        };


        // V2.XX Intercept State for Artifacts (Mom Credit Card)
        const processingState = this._getReactiveState(this.state);

        // 处理夜间选择
        if (choice.nightAction) {
            const nightOption = nightChoices[choice.nightAction];
            const housingInfo = GameData.housingTypes[this.state.housing];
            // Use processingState
            const effectResult = nightOption.effect(processingState, housingInfo);
            if (typeof effectResult === 'string') {
                result = { message: effectResult };
            } else {
                result = effectResult;
            }
            // Checking nightChoices.js: effect: (state, housingInfo) => ...
            // Valid.

            // 处理精力恢复
            if (result.energyRecoveryTomorrow !== undefined) {
                this.pendingEnergyChange = result.energyRecoveryTomorrow;
            }
        } else {
            // 普通选择
            // V2.XX 修改：先结算侧边选项，再执行主选项
            // 这样精力预览更准确地反映实际消耗差异
            const isDaytime = (this.state.period === 'day' && !choice.nightAction);

            // 初始化 result 对象用于收集侧边选项消息
            result = { message: '' };

            // V2.XX Initialize temp triggers for reactive state
            this._tempArtifactTriggers = [];

            // V2.35 修复: 傍晚事件 (Rent, Friend Help) 不应直接推进到下一天
            if (this.state.period === 'night' &&
                !choice.nightAction &&
                this.currentEvent.id !== 'homeless_night' &&
                this.currentEvent.id !== 'car_night') {
                result.triggerEvent = 'FORCE_NEXT';
            }

            // V2.XX 先结算侧边选项（仅限白天且无触发事件时）
            if (isDaytime && this.currentEvent.id !== 'day_lunch' && !result.triggerEvent) {
                this._applyDaytimeSideSettlements(this.state, context, result);
            } else if (isDaytime && result.triggerEvent) {
                // 如果触发了子事件，防止之后的事件重复显示选择器
                this.state.sideActionsLocked = true;
            }

            // V2.XX修复: 防御性恢复丢失的 effect 函数 (读档后可能发生)
            if (typeof choice.effect !== 'function') {
                console.warn(`[Event] Choice effect missing for event ${this.currentEvent.id}, choice ${choiceIndex}. Attempting restore.`);
                const baseEvent = GameEvents.events.find(e => e.id === this.currentEvent.id);
                if (baseEvent && baseEvent.choices && baseEvent.choices[choiceIndex]) {
                    choice.effect = baseEvent.choices[choiceIndex].effect;
                    // Also restore other props if needed
                    if (!choice.hint && baseEvent.choices[choiceIndex].hint) choice.hint = baseEvent.choices[choiceIndex].hint;
                }
            }

            if (typeof choice.effect !== 'function') {
                console.error(`[Event] Critical: Cannot restore effect for ${this.currentEvent.id}`);
                return { message: "系统错误: 事件数据丢失，请尝试刷新或重新读档。" };
            }

            // 再执行主选项的 effect
            const mainResult = choice.effect(processingState, context);

            // 合并结果：主选项结果优先，消息追加
            if (mainResult) {
                const sideMessage = result.message;
                result = { ...mainResult };
                // 侧边消息追加到主消息后面
                if (sideMessage) {
                    result.message = (result.message || '') + sideMessage;
                }
            }

            // 处理精力恢复
            if (result.energyRecoveryTomorrow !== undefined) {
                this.pendingEnergyChange = result.energyRecoveryTomorrow;
            }
        }

        // Artifact action effects (skip preview)
        if (!context.isPreview) {
            const actionInfo = {
                id: this.currentEvent ? this.currentEvent.id : '',
                type: this.currentEvent ? this.currentEvent.type : '',
                choiceId: choice.id || choice.nightAction || null
            };
            const baseDelta = this._computeArtifactDelta(beforeSnapshot, this.state);
            const artifactResult = this._applyArtifactActionEffects(baseDelta, actionInfo, context);
            if (artifactResult && artifactResult.triggers && artifactResult.triggers.length > 0) {
                result.artifactTriggers = artifactResult.triggers;
            }
            // 传递 layers 供 UI 逐层显示
            if (artifactResult && artifactResult.layers && artifactResult.layers.length > 0) {
                result.artifactLayers = artifactResult.layers;
            }

            // Intern badge rescue from layoff
            if (this.hasArtifact && this.hasArtifact('intern_badge')) {
                const isLayoffEvent = this.currentEvent && this.currentEvent.type === 'layoff';
                if (isLayoffEvent && this.state.job === 'fired' && beforeJob !== 'fired' && !result.triggerEvent && this.currentEvent.id !== 'intern_badge_decision') {
                    this.state.pendingInternBadge = {
                        previousJob: beforeJob,
                        previousIncome: beforeIncome
                    };
                    result.triggerEvent = 'intern_badge_decision';
                }
            }
        }

        // V2.XX: Append reactive triggers (mom_credit_card)
        // V2.XX: Append reactive triggers (mom_credit_card) with aggregation
        if (this._tempArtifactTriggers && this._tempArtifactTriggers.length > 0) {
            if (!result.artifactTriggers) result.artifactTriggers = [];

            // Aggregate mom_credit_card triggers
            let momCardTotal = 0;
            const otherTriggers = [];

            this._tempArtifactTriggers.forEach(t => {
                if (t.id === 'mom_credit_card' && typeof t.amount === 'number') {
                    momCardTotal += t.amount;
                } else {
                    otherTriggers.push(t);
                }
            });

            if (momCardTotal > 0) {
                result.artifactTriggers.push({
                    id: 'mom_credit_card',
                    message: I18n.t('game.artifactTriggers.mom_credit_card', momCardTotal)
                });
            }

            if (otherTriggers.length > 0) {
                result.artifactTriggers = result.artifactTriggers.concat(otherTriggers);
            }

            this._tempArtifactTriggers = []; // Clear after consuming
        }

        // V2.35 队列接续处理
        // 夜晚只在存在 night 队列事件时接续，避免重复触发 night_choice。
        const hasFollowupQueue = Array.isArray(this.state.eventQueue) && this.state.eventQueue.length > 0 && (
            this.state.period !== 'night' || this.state.eventQueue.some(evt => evt && evt.period === 'night')
        );
        if (hasFollowupQueue && !result.triggerEvent) {
            console.log('[Game] Event finished, continuing queue...');
            result.triggerEvent = 'FORCE_NEXT';
        }

        // 确保数值在范围内
        this.clampValues();

        // 检查结局
        const ending = this.checkEnding();

        return {
            ...result,
            ending: ending,
            successRate: successRate
        };
    }
};
