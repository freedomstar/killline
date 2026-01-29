/**
 * 事件模块 - 事件获取与玩家选择处理
 */
import { GameData } from '../data/index.js';
import { EventManager as GameEvents } from '../events/index.js';
import { nightChoices } from '../events/nightChoices.js';

/**
 * 事件相关方法的 Mixin
 */
export const EventsMixin = {
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
        const taskNames = ['项目开发', '报告撰写', '数据分析', '客户方案', '系统维护', '代码审查'];
        // 使用配置中的任务参数
        const taskConfig = GameData.workTaskConfig;
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

    /**
     * Get event by ID (Wrapper to support synthetic events and standard lookup)
     */
    getEventById(id) {
        if (id === 'FORCE_NEXT') {
            return this.getNextEvent();
        }
        const event = GameEvents.events.find(e => e.id === id);
        this.recordRandomEvent(event);
        return event;
    },

    /**
     * 获取下一个事件
     */
    getNextEvent() {
        const period = this.state.period;
        console.log(`[Game] 请求事件, 当前时段: ${period}`);


        // V2.35 检查事件队列 (傍晚事件) - 优先于所有夜间/日常事件
        if (this.state.eventQueue && this.state.eventQueue.length > 0) {

            // 如果只有一个事件，直接触发
            if (this.state.eventQueue.length === 1) {
                const evt = this.state.eventQueue[0];
                // 从队列移除
                this.state.eventQueue.shift();
                this.currentEvent = evt;
                this.recordRandomEvent(evt);
                return evt;
            }

            // 如果有多个事件，生成 Dashboard
            console.log('[Game] Multiple events pending, showing dashboard.');
            const dashboardEvent = {
                id: 'evening_dashboard',
                title: '待处理事项',
                description: '今晚有几件事需要你处理...',
                period: 'night',
                choices: this.state.eventQueue.map((evt, index) => {
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
                this.currentEvent = forcedEvent;
                return forcedEvent;
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

        // 随机选择事件
        const availableEvents = GameEvents.getAvailableEvents(this.state, period, this.rng);
        let selectedEvent = GameEvents.selectRandomEvent(availableEvents, this.rng);

        // V2.42 修复：工作日优先工作，随机事件（如朋友援助）加入队列在傍晚触发
        if (period === 'day' && selectedEvent && selectedEvent.id !== 'day_work') {
            const workEvent = availableEvents.find(e => e.id === 'day_work');
            if (workEvent) {
                console.log(`[Game] Conflict: Picked ${selectedEvent.id} but should work. Queueing random event.`);

                // 确保队列存在
                if (!this.state.eventQueue) this.state.eventQueue = [];

                // 只有非强制事件，或者显式允许排队的强制事件才通过队列延后
                // 朋友援助(friend_help) isRandom=true, 且非 mandatory
                if (!selectedEvent.mandatory || selectedEvent.allowQueue) {
                    this.state.eventQueue.push(selectedEvent);
                    selectedEvent = workEvent;
                }
            }
        }

        // 特殊处理：如果是工作事件，需要动态生成选项
        if (selectedEvent && selectedEvent.id === 'day_work') {
            this.currentEvent = { ...selectedEvent };
            this.currentEvent.choices = GameEvents.generateDailyWorkEvent(this.state, { game: this, rng: this.rng, successRate: GameEvents.calculateSuccessRate(this.state) });
            return this.currentEvent;
        }

        this.currentEvent = selectedEvent;
        this.recordRandomEvent(this.currentEvent);
        return this.currentEvent;
    },

    /**
     * 处理玩家选择
     */
    _applyDaytimeSideSettlements(state, context, result) {
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

        // 1. 结算午餐
        if (!result.ignoreLunch) {
            const lunchOpt = GameData.lunchOptions[state.lunchType];
            if (lunchOpt) {
                let totalCost = lunchOpt.cost;
                let tipAmount = 0;
                if (state.lunchType === 'fastfood' && lunchOpt.cost > 0) {
                    tipAmount = Math.round(lunchOpt.cost * GameData.usaFeatures.tipRate);
                    totalCost += tipAmount;
                }
                state.money -= totalCost;
                state.health = Math.max(0, Math.min(100, state.health + lunchOpt.healthEffect));
                if (state.lunchType === 'bento') state.hasPreparedMeal = false;
                const lunchName = typeof lunchOpt.name === 'function' ? lunchOpt.name() : lunchOpt.name;
                result.message += `\n🍱 午餐：${lunchName}${totalCost > 0 ? ` -$${totalCost}` : ''}`;
            }
        }

        // 2. 结算日常侧边行动
        if (state.selectedDailyAction && state.selectedDailyAction !== 'none') {
            const dailyAction = GameEvents.getDailyActionById(state.selectedDailyAction);
            if (dailyAction) {
                const dailyRes = dailyAction.effect(state, context);
                result.message += `\n✨ ${dailyAction.text}：${dailyRes.message}`;
            }
        }

        // 3. 结算突发事件处理
        if (state.selectedIncident && state.selectedIncident !== 'none') {
            const [incidentId, optionId] = state.selectedIncident.split(':');
            const incident = GameEvents.getIncidentById(incidentId);
            if (incident) {
                const option = incident.choices.find(c => c.id === optionId);
                if (option) {
                    const incidentRes = option.effect(state, context);
                    result.message += `\n⚠️ ${incident.title}：${incidentRes.message}`;
                }
            }
        }

        // 4. 结算通勤费用（公交、步行等）
        const commuteId = state.selectedCommute;
        if (commuteId && commuteId !== 'car' && commuteId !== 'car_refuel' && commuteId !== 'car_repair') {
            const commuteConfig = GameData.commuteOptions[commuteId];
            if (commuteConfig) {
                if (commuteConfig.cost > 0) {
                    state.money -= commuteConfig.cost;
                    const commuteName = typeof commuteConfig.name === 'function' ? commuteConfig.name() : commuteConfig.name;
                    result.message += `\n🚌 ${commuteName}：-$${commuteConfig.cost}`;
                }

                if (commuteConfig.healthEffect > 0) {
                    state.health = Math.min(100, state.health + commuteConfig.healthEffect);
                    const commuteNameWalk = typeof commuteConfig.name === 'function' ? commuteConfig.name() : commuteConfig.name;
                    result.message += `\n🚶 ${commuteNameWalk}：健康 +${commuteConfig.healthEffect}`;
                }

                // 预览模式：不执行通勤“迟到”随机判定，避免随机罚值影响确定性预览
                const isLate = (context && context.isPreview)
                    ? false
                    : (context.rng.random() < commuteConfig.lateChance);
                if (isLate) {
                    state.energy = Math.max(0, state.energy - 10);
                    state.mental = Math.max(0, state.mental - 5);
                    if (state.workTask) {
                        state.workTask.progress = Math.max(0, state.workTask.progress - 5);
                    }
                    result.message += `\n⏰ 迟到了！精力-10, 精神-5`;
                    if (state.pipActive) {
                        state.pipPerformanceScore = Math.max(0, (state.pipPerformanceScore || 50) - 10);
                        result.message += `, PIP评分-10`;
                    }
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


        // 处理夜间选择
        if (choice.nightAction) {
            const nightOption = nightChoices[choice.nightAction];
            const housingInfo = GameData.housingTypes[this.state.housing];
            const effectResult = nightOption.effect(this.state, housingInfo);
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
            // Update to pass context
            if (choice.effect.length > 1 || true) { // Always pass context
                result = choice.effect(this.state, context);
            } else {
                // Fallback? No, new events use context.
                result = choice.effect(this.state, context);
            }

            // V2.10 并行结算逻辑 (仅限白天时段)
            const isDaytime = (this.state.period === 'day' && !choice.nightAction);

            // V2.35 修复: 傍晚事件 (Rent, Friend Help) 不应直接推进到下一天
            // 识别方法: period=night, 但不是 nightAction, 且不是 homeless/car_night
            // 如果是这种情况，强制续接 -> getNextEvent (它会检查队列或进入 Night Choice)
            if (this.state.period === 'night' &&
                !choice.nightAction &&
                this.currentEvent.id !== 'homeless_night' &&
                this.currentEvent.id !== 'car_night') {

                if (!result.triggerEvent) {
                    console.log(`[Game] Evening event ${this.currentEvent.id} finished. Continuing to Night Routine.`);
                    result.triggerEvent = 'FORCE_NEXT';
                }
            }

            console.log(`[Game] handleChoice: period=${this.state.period}, isDaytime=${isDaytime}, triggerEvent=${result.triggerEvent}`);
            if (isDaytime && !result.triggerEvent) {
                this._applyDaytimeSideSettlements(this.state, context, result);
            }

            // 处理精力恢复
            if (result.energyRecoveryTomorrow !== undefined) {
                this.pendingEnergyChange = result.energyRecoveryTomorrow;
            }
        }

        // V2.35 队列接续处理
        if (this.state.eventQueue && this.state.eventQueue.length > 0 && !result.triggerEvent) {
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
