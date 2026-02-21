/**
 * Debug Mode - 事件一致性检查工具
 * 遍历所有事件，分析effect与hint的一致性
 */


// Ensure we have access to globals defined in debug.html
const GameData = window.GameData;
const GameEvents = window.GameEvents;
const I18n = window.I18n;

const DebugTools = {
    // 分析结果存储
    analysisResults: [],

    // 统计数据
    stats: {
        totalEvents: 0,
        totalChoices: 0,
        matchCount: 0,
        mismatchCount: 0,
        uncertainCount: 0
    },

    /**
     * 初始化debug工具
     */
    init() {
        // Patch game object with calculateMedicalCost if missing
        const game = window.game;
        if (!game.calculateMedicalCost) {
            game.calculateMedicalCost = function (baseCost, isEmergency = false) {
                // Simplified mock implementation based on game.js
                // We assume this.state is set to the current simulation state
                const state = this.state || {};
                const planId = state.insurance ? state.insurance.healthPlanId : 'none';
                const plan = GameData.insuranceSystem.healthPlans[planId];

                // Medicaid
                if (plan && plan.id === 'medicaid') {
                    return { youPay: 0, insurancePays: baseCost, breakdown: '白卡报销', riskFactor: { isOutOfNetwork: false } };
                }

                // No insurance
                if (!plan || plan.type === 'none') {
                    return { youPay: baseCost, insurancePays: 0, breakdown: '自付', riskFactor: { isOutOfNetwork: false } };
                }

                // For debug purposes, we assume in-network unless explicitly testing logic
                // Simplified calculation
                let youPay = 0;
                let remainingCost = baseCost;

                // Deductible
                const deductiblePaid = state.insurance.healthDeductiblePaid || 0;
                const deductibleRemaining = Math.max(0, plan.deductible - deductiblePaid);

                if (deductibleRemaining > 0) {
                    const pay = Math.min(remainingCost, deductibleRemaining);
                    youPay += pay;
                    remainingCost -= pay;
                }

                // Coinsurance
                if (remainingCost > 0) {
                    const coinPay = remainingCost * plan.coinsurance;
                    youPay += coinPay;
                }

                return {
                    youPay: Math.round(youPay),
                    insurancePays: Math.round(baseCost - youPay),
                    breakdown: `Mock Calc: $${Math.round(youPay)}`,
                    riskFactor: { isOutOfNetwork: false }
                };
            };
        }

        this.bindEvents();
        this.runAnalysis();
    },

    /**
     * 绑定UI事件
     */
    bindEvents() {
        document.getElementById('analyzeBtn').addEventListener('click', () => this.runAnalysis());
        document.getElementById('exportJsonBtn').addEventListener('click', () => this.exportJSON());
        document.getElementById('exportCsvBtn').addEventListener('click', () => this.exportCSV());
        document.getElementById('filterType').addEventListener('change', () => this.applyFilters());
        document.getElementById('filterStatus').addEventListener('change', () => this.applyFilters());
        document.getElementById('searchInput').addEventListener('input', () => this.applyFilters());
    },

    /**
     * 运行完整分析
     */
    runAnalysis() {
        this.showLoading(true);

        // 保存上一次结果用于比对
        if (this.analysisResults && this.analysisResults.length > 0) {
            this.previousResults = JSON.parse(JSON.stringify(this.analysisResults));
        }

        this.analysisResults = [];
        this.stats = { totalEvents: 0, totalChoices: 0, matchCount: 0, mismatchCount: 0, uncertainCount: 0 };

        setTimeout(() => {
            try {
                this.analyzeAllEvents();

                // 执行差异比对
                if (this.previousResults) {
                    const diffs = this.compareResults(this.previousResults, this.analysisResults);
                    this.renderDiffReport(diffs);
                }

                this.renderResults();
                this.updateStats();
            } catch (error) {
                console.error('分析出错:', error);
                alert('分析过程出错: ' + error.message);
            } finally {
                this.showLoading(false);
            }
        }, 100);
    },

    /**
     * 比对分析结果差异
     */
    compareResults(prev, curr) {
        const diffs = [];
        const prevMap = new Map(prev.map(e => [e.id, e]));
        const currMap = new Map(curr.map(e => [e.id, e]));

        // Check for New Events
        for (const [id, event] of currMap) {
            if (!prevMap.has(id)) {
                diffs.push({ type: 'new_event', desc: `新增事件: ${event.title} (${id})`, isNew: true });
            } else {
                // Check Choices diff
                const prevEvent = prevMap.get(id);
                if (event.choices.length !== prevEvent.choices.length) {
                    diffs.push({ type: 'choice_count', desc: `事件 ${event.title} 选项数变化: ${prevEvent.choices.length} -> ${event.choices.length}` });
                } else {
                    // Same choice count, check status
                    for (let i = 0; i < event.choices.length; i++) {
                        const cChoice = event.choices[i];
                        const pChoice = prevEvent.choices[i];
                        if (cChoice.status !== pChoice.status) {
                            diffs.push({
                                type: 'status_change',
                                desc: `事件 ${event.title} 选项 "${cChoice.text}" 状态变更: ${pChoice.status} -> ${cChoice.status}`,
                                status: 'change'
                            });
                        }
                    }
                }
            }
        }

        // Check for Removed Events
        for (const [id, event] of prevMap) {
            if (!currMap.has(id)) {
                diffs.push({ type: 'removed_event', desc: `移除事件: ${event.title} (${id})`, isGone: true });
            }
        }

        return diffs;
    },

    /**
     * 渲染差异报告
     */
    renderDiffReport(diffs) {
        const container = document.getElementById('diffContainer');
        const content = document.getElementById('diffContent');
        const summary = document.getElementById('diffSummaryText');

        if (diffs.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        summary.textContent = `检测到 ${diffs.length} 处变动`;

        let html = '<ul class="diff-list">';
        for (const diff of diffs) {
            let badgeClass = 'diff-change';
            let badgeText = '变更';
            if (diff.isNew) { badgeClass = 'diff-new'; badgeText = '新增'; }
            if (diff.isGone) { badgeClass = 'diff-gone'; badgeText = '消失'; }
            if (diff.type === 'status_change') { badgeClass = 'diff-change'; badgeText = '状态'; }

            html += `
                <li class="diff-item">
                    <span class="diff-badge ${badgeClass}">${badgeText}</span>
                    <span class="diff-desc">${this.escapeHtml(diff.desc)}</span>
                </li>
            `;
        }
        html += '</ul>';
        content.innerHTML = html;
    },

    /**
     * 分析所有事件
     */
    analyzeAllEvents() {
        // 1. 获取基础静态事件
        let events = [...(GameEvents.events || [])];

        // 2. 注入模拟的动态事件
        events = this.injectDynamicEvents(events);

        this.stats.totalEvents = events.length;

        for (const event of events) {
            const eventResult = {
                id: event.id,
                type: event.type || 'unknown',
                period: event.period || 'any',
                title: this.resolveTitle(event),
                condition: this.resolveCondition(event.condition),
                choices: []
            };

            const choices = event.choices || [];
            for (let index = 0; index < choices.length; index++) {
                const choice = choices[index];
                const choiceResult = this.analyzeChoice(choice, event, index);
                eventResult.choices.push(choiceResult);
                this.stats.totalChoices++;

                // 更新统计
                if (choiceResult.status === 'match') this.stats.matchCount++;
                else if (choiceResult.status === 'mismatch') this.stats.mismatchCount++;
                else this.stats.uncertainCount++;
            }

            this.analysisResults.push(eventResult);
        }
    },

    /**
     * 注入动态事件
     */
    /**
     * 注入动态事件
     */
    injectDynamicEvents(baseEvents) {
        const events = [...baseEvents];
        const mockState = this.createMockState();

        // 0. Ensure mock game object exists for effects that rely on it
        if (typeof window.game === 'undefined') {
            window.game = {
                rng: { random: () => 0.5 }, // Fixed RNG
                assignNewTask: () => { },
                state: mockState
            };
        } else {
            // Force override RNG to be deterministic for analysis
            window.game.rng = { random: () => 0.5 };
        }

        // A. 注入通勤选项 (模拟 game.js handleChoice & events.js applyCommuteEffects)
        if (GameEvents.getAvailableCommuteOptions) {
            const commuteEvent = {
                id: 'commute_selector',
                type: 'daily',
                title: '🚗 通勤方式选择',
                choices: []
            };

            const commuteOptions = GameEvents.getAvailableCommuteOptions(mockState, { rng: { random: () => 0.5 } });

            for (const option of commuteOptions) {
                const key = option.key || option.id;
                let name = option.name;
                let hint = option.hint;
                if (key) {
                    const nameKey = `data.commuteOptions.${key}.name`;
                    const hintKey = `data.commuteOptions.${key}.hint`;
                    const resolvedName = I18n.t(nameKey);
                    const resolvedHint = I18n.t(hintKey, option);
                    if (resolvedName !== nameKey) name = resolvedName;
                    if (resolvedHint !== hintKey) hint = resolvedHint;
                }
                if (typeof name === 'function') name = name(option);
                if (typeof hint === 'function') hint = hint(option);
                commuteEvent.choices.push({
                    text: name,
                    hint: hint,
                    effect: (state) => {
                        // 模拟 applyCommuteEffects 和 handleChoice 逻辑
                        if (option.cost > 0) state.money -= option.cost;
                        if (option.healthEffect) state.health += option.healthEffect;

                        // 模拟迟到风险 (debug模式下取期望值/固定值?)
                        // 由于hint里常写 "20%概率迟到", 这里不模拟随机性以免造成 mismatch
                        // 仅模拟必然发生的属性变化

                        return { message: 'Commute choice analysis' };
                    }
                });
            }
            events.push(commuteEvent);
        }

        // B. 注入午餐选项 (模拟 game.js handleChoice)
        if (GameData.lunchOptions) {
            const lunchEvent = {
                id: 'lunch_selector',
                type: 'daily',
                title: '🍱 午餐选择',
                choices: []
            };
            for (const [key, option] of Object.entries(GameData.lunchOptions)) {
                let hintText = typeof option.hint === 'function' ? option.hint(option) : option.hint;
                if (key === 'fastfood') {
                    const tipRate = GameData.usaFeatures ? GameData.usaFeatures.tipRate : 0.18;
                    const totalCost = option.cost + Math.round(option.cost * tipRate);
                    const healthText = option.healthEffect >= 0 ? `健康+${option.healthEffect}` : `健康${option.healthEffect}`;
                    hintText = `${healthText}，-$${totalCost}`;
                }
                lunchEvent.choices.push({
                    text: option.name,
                    hint: hintText,
                    effect: (state) => {
                        let totalCost = option.cost || 0;
                        // 模拟小费
                        if (key === 'fastfood' && totalCost > 0) {
                            totalCost += Math.round(totalCost * (GameData.usaFeatures ? GameData.usaFeatures.tipRate : 0.18));
                        }

                        state.money -= totalCost;

                        if (option.healthEffect) state.health += option.healthEffect;
                        if (option.energyEffect) state.energy += option.energyEffect;
                        if (option.mentalEffect) state.mental += option.mentalEffect;
                        if (option.socialEffect) state.socialValue = (state.socialValue || 50) + option.socialEffect;

                        if (key === 'bento') state.ingredients--;

                        return { message: 'Lunch choice analysis' };
                    }
                });
            }
            events.push(lunchEvent);
        }

        // C. 注入动态工作选项 (替换原 day_work)
        const workEventIdx = events.findIndex(e => e.id === 'day_work');
        if (workEventIdx !== -1 && GameEvents.generateDailyWorkEvent) {
            try {
                // 需要更完善的 mock state
                const workState = this.createMockState();
                workState.job = 'fulltime';
                workState.workTask = { progress: 0, difficulty: 3, name: 'Debug Task' };
                // 暂时不设置 PIP，分析正常状态

                // generateDailyWorkEvent 签名是 (state, context)，返回 choices 数组
                const mockContext = {
                    rng: { random: () => 0.5 },
                    game: window.game,
                    successRate: 1.0
                };
                const dynamicChoices = GameEvents.generateDailyWorkEvent(workState, mockContext);
                if (dynamicChoices && dynamicChoices.length > 0) {
                    events[workEventIdx].choices = dynamicChoices;
                }
            } catch (e) {
                console.warn("Error generating work event:", e);
            }
        }

        // D. 注入夜间选项 (使用 GameEvents.getNightChoiceEvent)
        if (GameEvents.getNightChoiceEvent) {
            try {
                const nightState = this.createMockState();
                // 确保 mock state 符合 night choice 需求
                nightState.housing = 'apartment';
                nightState.ingredients = 5;

                const nightEvent = GameEvents.getNightChoiceEvent(nightState);
                if (nightEvent && nightEvent.choices) {
                    // 为每个 choice 注入 effect 函数 (从 GameData.nightChoices 获取)
                    for (const choice of nightEvent.choices) {
                        if (choice.nightAction && GameData.nightChoices && GameData.nightChoices[choice.nightAction]) {
                            const nightOption = GameData.nightChoices[choice.nightAction];
                            if (nightOption.effect) {
                                // 包装 effect 函数，传入必要的参数
                                const originalEffect = nightOption.effect;
                                choice.effect = (state) => {
                                    // 对于 sleep，需要传入 housingInfo
                                    if (choice.nightAction === 'sleep') {
                                        const housingInfo = GameData.housingTypes[state.housing] || { energyRecovery: 50 };
                                        return originalEffect(state, housingInfo);
                                    }
                                    return originalEffect(state);
                                };
                            }
                        }
                    }

                    // 检查是否已存在 (events.js 可能没有把 night_choice 放在 lists 里)
                    const existingIdx = events.findIndex(e => e.id === 'night_choice');
                    if (existingIdx !== -1) {
                        events[existingIdx] = nightEvent;
                    } else {
                        events.push(nightEvent);
                    }
                }
            } catch (e) {
                console.warn("Error generating night event:", e);
            }
        }

        // E. 注入工作突发事件 (workIncidents)
        if (GameEvents.workIncidents && GameEvents.workIncidents.length > 0) {
            const incidentsEvent = {
                id: 'work_incidents_collection',
                type: 'work',
                title: '🔔 工作突发事件',
                choices: []
            };

            for (const incident of GameEvents.workIncidents) {
                // 每个 incident 有自己的 choices 数组
                for (const choice of (incident.choices || [])) {
                    incidentsEvent.choices.push({
                        text: `[${incident.title}] ${choice.text}`,
                        hint: choice.hint,
                        effect: choice.effect
                    });
                }
            }

            if (incidentsEvent.choices.length > 0) {
                events.push(incidentsEvent);
            }
        }

        // F. 注入日常随机行动 (randomDailyActions)
        if (GameEvents.randomDailyActions && GameEvents.randomDailyActions.length > 0) {
            const dailyActionsEvent = {
                id: 'daily_actions_collection',
                type: 'daily',
                title: '🎲 日常随机行动',
                choices: []
            };

            for (const action of GameEvents.randomDailyActions) {
                dailyActionsEvent.choices.push({
                    text: action.text,
                    hint: action.hint,
                    effect: action.effect,
                    condition: action.condition
                });
            }

            if (dailyActionsEvent.choices.length > 0) {
                events.push(dailyActionsEvent);
            }
        }

        return events;
    },

    // NOTE: analyzeChoice has been moved and refactored below for multi-outcome support

    /**
     * 解析事件标题
     */
    resolveTitle(event) {
        if (typeof event.title === 'function') {
            try { return event.title(this.createMockState()); }
            catch { return '[动态标题]'; }
        }
        return event.title || event.id;
    },

    /**
     * 解析选择文本
     */
    resolveText(text) {
        if (typeof text === 'function') {
            try { return text(this.createMockState()); }
            catch { return '[动态文本]'; }
        }
        return text || '';
    },

    /**
     * 解析hint
     */
    resolveHint(hint) {
        if (typeof hint === 'function') {
            try { return hint(this.createMockState()); }
            catch { return '[动态hint]'; }
        }
        return hint || '';
    },

    /**
     * 解析前置条件函数为可读文本
     * @param {Function|undefined} condition - 条件函数
     * @returns {string|null} 条件描述，无条件时返回null
     */
    resolveCondition(condition) {
        if (!condition || typeof condition !== 'function') {
            return null;
        }

        // 获取函数源码
        const source = condition.toString();

        // 检测多行函数（使用 GameData.eventConfigs 的条件）
        // 例如: (state) => { const conf = GameData.eventConfigs.routine_events.day_rest.cook; return (state.ingredients || 0) >= conf.ingredientsCost; }
        const configConditionMatch = source.match(/GameData\.eventConfigs\.([a-zA-Z_.]+);\s*return\s+\(?\s*state\.(\w+)[^>=<]*([\>=<]+)\s*conf\.(\w+)/);
        if (configConditionMatch) {
            const configPath = configConditionMatch[1];
            const stateProperty = configConditionMatch[2];
            const operator = configConditionMatch[3];
            const configProperty = configConditionMatch[4];

            // 尝试从实际配置获取值
            try {
                const pathParts = configPath.split('.');
                let configValue = window.GameData?.eventConfigs;
                for (const part of pathParts) {
                    if (configValue && configValue[part] !== undefined) {
                        configValue = configValue[part];
                    } else {
                        configValue = undefined;
                        break;
                    }
                }

                if (configValue && configValue[configProperty] !== undefined) {
                    const actualValue = configValue[configProperty];
                    const propertyNames = {
                        'ingredients': '食材',
                        'money': '金钱',
                        'energy': '精力',
                        'health': '健康',
                        'mental': '精神'
                    };
                    const readableProperty = propertyNames[stateProperty] || stateProperty;
                    return `${readableProperty}${operator}${actualValue}`;
                }
            } catch (e) {
                console.warn('[resolveCondition] Failed to parse config path:', configPath, e);
            }
        }

        // 检测复杂动态条件（使用三元运算符或多变量计算）
        // 例如: (state) => { const conf = GameData.eventConfigs.xxx; const cost = ... ? conf.a : conf.b; return state.money >= cost; }
        const complexConfigMatch = source.match(/GameData\.eventConfigs\.([a-zA-Z_.\d]+)/);
        if (complexConfigMatch && source.includes('return') && (source.includes('?') || source.includes('const cost'))) {
            const configPath = complexConfigMatch[1];
            // 尝试提取最终比较的属性
            const finalCompareMatch = source.match(/return\s+state\.(\w+)\s*([\>=<]+)\s*(\w+)/);
            if (finalCompareMatch) {
                const stateProperty = finalCompareMatch[1];
                const operator = finalCompareMatch[2];
                const varName = finalCompareMatch[3];
                const propertyNames = {
                    'money': '金钱',
                    'energy': '精力',
                    'health': '健康',
                    'mental': '精神'
                };
                const readableProperty = propertyNames[stateProperty] || stateProperty;
                // 返回动态条件的描述
                return `${readableProperty}${operator}[动态${varName}]`;
            }
            // 如解析失败，返回配置路径的简化描述
            const pathParts = configPath.split('.');
            const shortPath = pathParts.slice(-2).join('.');
            return `[动态条件] ${shortPath}`;
        }

        // 处理简单的多行条件（包含 return 语句但没有 GameData 引用的情况）
        if (source.includes('{') && source.includes('return')) {
            // 提取 return 后的条件表达式
            const returnMatch = source.match(/return\s+(.+?);?\s*\}?\s*$/);
            if (returnMatch) {
                let returnExpr = returnMatch[1].trim();
                // 如果表达式太长，截断
                if (returnExpr.length > 60) {
                    returnExpr = returnExpr.substring(0, 57) + '...';
                }
                // 继续让下面的 patterns 处理这个表达式
            }
        }

        // 尝试简化常见条件模式
        const patterns = [
            // 工作状态检查
            { regex: /state\.job\s*===?\s*['"]fulltime['"]/g, text: '全职工作中' },
            { regex: /state\.job\s*===?\s*['"]unemployed['"]/g, text: '失业' },
            { regex: /state\.job\s*===?\s*['"]fired['"]/g, text: '被解雇' },
            { regex: /state\.job\s*!==?\s*['"]fulltime['"]/g, text: '非全职' },
            { regex: /state\.job\s*!==?\s*['"]unemployed['"]/g, text: '有工作' },

            // 住所检查
            { regex: /state\.housing\s*===?\s*['"]apartment['"]/g, text: '住公寓' },
            { regex: /state\.housing\s*===?\s*['"]homeless['"]/g, text: '无家可归' },
            { regex: /state\.housing\s*===?\s*['"]car['"]/g, text: '住车里' },
            { regex: /state\.housing\s*===?\s*['"]cheapRoom['"]/g, text: '廉租房' },

            // 数值条件
            { regex: /state\.energy\s*>=?\s*(\d+)/g, text: '精力≥$1' },
            { regex: /state\.energy\s*<=?\s*(\d+)/g, text: '精力≤$1' },
            { regex: /state\.energy\s*<\s*(\d+)/g, text: '精力<$1' },
            { regex: /state\.health\s*<\s*(\d+)/g, text: '健康<$1' },
            { regex: /state\.mental\s*<\s*(\d+)/g, text: '精神<$1' },
            { regex: /state\.money\s*>=?\s*(\d+)/g, text: '金钱≥$1' },
            { regex: /state\.money\s*<\s*(\d+)/g, text: '金钱<$1' },
            { regex: /state\.ingredients\s*>=?\s*(\d+)/g, text: '食材≥$1' },

            // 时间/日期条件
            { regex: /state\.day\s*%\s*GameData\.timeCycle\.weekDays\s*===?\s*GameData\.timeCycle\.restDayMod/g, text: '休息日' },
            { regex: /state\.day\s*%\s*GameData\.timeCycle\.weekDays\s*!==?\s*GameData\.timeCycle\.restDayMod/g, text: '工作日' },
            { regex: /state\.day\s*>\s*GameData\.newbieProtectionDays/g, text: '初始阶段后' },

            // 特殊状态
            { regex: /state\.pipActive/g, text: 'PIP中' },
            { regex: /!state\.pipActive/g, text: '非PIP状态' },
            { regex: /state\.hasCar/g, text: '有车' },
            { regex: /!state\.hasCar/g, text: '无车' },
            { regex: /state\.coffeeToday/g, text: '今日已喝咖啡' },
            { regex: /!state\.coffeeToday/g, text: '今日未喝咖啡' },
            { regex: /state\.healthStatus\s*===?\s*['"]sick['"]/g, text: '生病中' },
            { regex: /state\.healthStatus\s*===?\s*['"]cold['"]/g, text: '感冒中' },
            { regex: /state\.healthStatus\s*===?\s*['"]critical['"]/g, text: '危急状态' },
            { regex: /state\.hospitalDaysLeft\s*>\s*0/g, text: '住院中' },

            // 保险相关
            { regex: /state\.insurance\.healthPlanId\s*!==?\s*['"]medicaid['"]/g, text: '非白卡' },
            { regex: /!state\.insurance\.medicaidApplicationDays/g, text: '未申请白卡' },
            { regex: /!state\.insurance\.deniedMedicaid/g, text: '未被拒绝白卡' },

            // 随机条件
            { regex: /(?:game|context)\.rng\.random\(\)\s*<\s*([\d.]+)/g, text: '$1概率触发' }
        ];

        let result = source;

        // 删除函数声明部分，只保留条件逻辑
        result = result
            .replace(/^\s*\(?\s*(?:state|state\s*,\s*context)\s*\)?\s*=>\s*/i, '')
            .replace(/^\s*function\s*\([^)]*\)\s*\{\s*return\s+/i, '')
            .replace(/;\s*\}?\s*$/i, '')
            .trim();

        // 应用简化模式
        for (const pattern of patterns) {
            result = result.replace(pattern.regex, pattern.text);
        }

        // 简化逻辑运算符
        result = result
            .replace(/\s*&&\s*/g, ' 且 ')
            .replace(/\s*\|\|\s*/g, ' 或 ')
            .replace(/!/g, '非')
            .replace(/\(\s*|\s*\)/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // 如果结果太长，截断显示
        if (result.length > 80) {
            result = result.substring(0, 77) + '...';
        }

        return result;
    },

    /**
     * 从hint文本中提取数值
     */
    parseHintValues(hint) {
        if (!hint || typeof hint !== 'string') return [];

        const values = [];
        const consumedRanges = []; // 记录已消费的字符位置范围

        // 检查位置是否被消费
        const isConsumed = (start, end) => {
            return consumedRanges.some(range =>
                (start >= range.start && start < range.end) ||
                (end > range.start && end <= range.end)
            );
        };

        const patterns = [
            // 高优先级：Tomorrow Energy (必须先匹配，避免被通用精力规则抢走)
            {
                regex: /明天精力\s*([+-]?\d+)/gi,
                extract: (m) => ({
                    value: parseInt(m[1]),
                    property: 'energyRecoveryTomorrow',
                    raw: m[0]
                })
            },
            // Money: $50, -$50, +$50
            {
                regex: /([+-])?\$(\d+)/g,
                extract: (m) => ({
                    value: (m[1] === '-' ? -1 : 1) * parseInt(m[2]),
                    property: 'money',
                    raw: m[0]
                })
            },
            // Explicit Attribute (Chinese/English): 精力+10, Health -5
            {
                regex: /(精力|energy|健康|health|精神|mental|社交|social|工龄|tenure|食材|ingredients|PTO|病假|休假|PIP|pip|绩效)[：:\s]*([+-]?\d+)/gi,
                extract: (m) => {
                    const attrStr = m[1].toLowerCase();
                    let property = 'unknown';
                    if (attrStr.includes('精') || attrStr.includes('energy')) property = 'energy';
                    if (attrStr.includes('健') || attrStr.includes('health')) property = 'health';
                    if (attrStr.includes('神') || attrStr.includes('mental')) property = 'mental';
                    if (attrStr.includes('社') || attrStr.includes('social')) property = 'socialValue';
                    if (attrStr.includes('工') || attrStr.includes('tenure')) property = 'jobTenure';
                    if (attrStr.includes('食') || attrStr.includes('ingredient')) property = 'ingredients';
                    if (attrStr.includes('pto') || attrStr.includes('病假') || attrStr.includes('休假')) property = 'sickLeaveDays';
                    if (attrStr.includes('pip') || attrStr.includes('绩效')) property = 'pipPerformanceScore';
                    return { value: parseInt(m[2]), property: property, raw: m[0] };
                }
            },
            // Reverse Attribute: +10 Energy, +15精神
            {
                regex: /([+-]?\d+)\s*(精力|energy|健康|health|精神|mental|社交|social|工龄|tenure|食材|ingredients|PTO|病假|休假|PIP|pip|绩效)/gi,
                extract: (m) => {
                    const attrStr = m[2].toLowerCase();
                    let property = 'unknown';
                    if (attrStr.includes('精') || attrStr.includes('energy')) property = 'energy';
                    if (attrStr.includes('健') || attrStr.includes('health')) property = 'health';
                    if (attrStr.includes('神') || attrStr.includes('mental')) property = 'mental';
                    if (attrStr.includes('社') || attrStr.includes('social')) property = 'socialValue';
                    if (attrStr.includes('工') || attrStr.includes('tenure')) property = 'jobTenure';
                    if (attrStr.includes('食') || attrStr.includes('ingredient')) property = 'ingredients';
                    if (attrStr.includes('pto') || attrStr.includes('病假') || attrStr.includes('休假')) property = 'sickLeaveDays';
                    if (attrStr.includes('pip') || attrStr.includes('绩效')) property = 'pipPerformanceScore';
                    return { value: parseInt(m[1]), property: property, raw: m[0] };
                }
            }
        ];

        for (const pattern of patterns) {
            let match;
            pattern.regex.lastIndex = 0;
            while ((match = pattern.regex.exec(hint)) !== null) {
                const start = match.index;
                const end = start + match[0].length;

                // 跳过已被高优先级规则消费的位置
                if (isConsumed(start, end)) continue;

                const result = pattern.extract(match);
                if (result && !isNaN(result.value)) {
                    values.push(result);
                    consumedRanges.push({ start, end });
                }
            }
        }

        // DEBUG: 输出解析结果
        if (values.length > 0 || hint.includes('明天')) {
            console.log(`[parseHintValues] "${hint}" =>`, values);
        }

        return values;
    },

    /**
     * 解析effect函数源码
     */
    parseEffectSource(source) {
        const changes = [];

        // 匹配 state.property = value 或 state.property += value
        const assignPatterns = [
            /state\.(\w+)\s*-=\s*(\d+)/g,
            /state\.(\w+)\s*\+=\s*(\d+)/g,
            /state\.(\w+)\s*=\s*Math\.(min|max)\([^,]+,\s*state\.\w+\s*([+-])\s*(\d+)/g
        ];

        // 匹配减法
        let match;
        const decreasePattern = /state\.(\w+)\s*-=\s*(\d+)/g;
        while ((match = decreasePattern.exec(source)) !== null) {
            changes.push({
                property: match[1],
                change: -parseInt(match[2]),
                source: 'regex'
            });
        }

        // 匹配加法
        const increasePattern = /state\.(\w+)\s*\+=\s*(\d+)/g;
        while ((match = increasePattern.exec(source)) !== null) {
            changes.push({
                property: match[1],
                change: parseInt(match[2]),
                source: 'regex'
            });
        }

        // 匹配 conf.xxx 引用
        const confPattern = /conf\.(\w+)/g;
        while ((match = confPattern.exec(source)) !== null) {
            changes.push({
                property: 'config',
                change: match[1],
                source: 'config-ref'
            });
        }

        return changes;
    },

    /**
     * 模拟执行effect函数
     */
    simulateEffect(effectFn) {
        const scenarios = [
            { id: 'lucky', name: '大吉 (RNG=0)', rng: 0.0 },
            { id: 'unlucky', name: '大凶 (RNG≈1)', rng: 0.999999 }
        ];

        const outcomes = [];
        const serializedOutcomes = new Set();

        for (const scenario of scenarios) {
            // 强制覆盖 RNG
            if (window.game && window.game.rng) {
                window.game.rng.random = () => scenario.rng;
            }

            try {
                const beforeState = this.createMockState();
                const afterState = this.createMockState();

                // 强制 game.state 指向当前模拟状态，供 game.calculateMedicalCost 使用
                if (window.game) window.game.state = afterState;

                // 执行 effect - 传入正确的 context 对象
                const context = {
                    rng: { random: () => scenario.rng },
                    successRate: 1.0,
                    game: window.game,
                    GameData: window.GameData
                };
                const result = effectFn(afterState, context);

                // 比较状态变化
                const changes = [];
                const trackedProperties = ['money', 'health', 'mental', 'energy', 'socialValue', 'ingredients', 'jobTenure', 'sickLeaveDays', 'pipPerformanceScore', 'job'];

                for (const prop of trackedProperties) {
                    const before = beforeState[prop] !== undefined ? beforeState[prop] : (typeof afterState[prop] === 'string' ? '' : 0);
                    const after = afterState[prop] !== undefined ? afterState[prop] : (typeof beforeState[prop] === 'string' ? '' : 0);

                    // Handle both string and numeric comparisons
                    let hasChange = false;
                    if (typeof before === 'string' || typeof after === 'string') {
                        hasChange = before !== after;
                    } else {
                        hasChange = Math.abs(after - before) > 0.001;
                    }

                    if (hasChange) {
                        changes.push({
                            property: prop,
                            before: before,
                            after: after,
                            change: typeof after === 'number' ? (after - before) : `${before} -> ${after}`,
                            source: 'simulation'
                        });
                    }
                }

                // 捕获返回结果中的特殊属性（如 energyRecoveryTomorrow）
                if (result && typeof result === 'object') {
                    if (result.energyRecoveryTomorrow !== undefined) {
                        changes.push({
                            property: 'energyRecoveryTomorrow',
                            before: 0,
                            after: result.energyRecoveryTomorrow,
                            change: result.energyRecoveryTomorrow,
                            source: 'result'
                        });
                    }
                }

                // 序列化以去重 (Include message in key to distinguish different flavor texts with same state change)
                const sortedChanges = [...changes].sort((a, b) => a.property.localeCompare(b.property));
                const changeKey = sortedChanges.map(c => `${c.property}:${c.change}`).join('|');
                const messageKey = result ? result.message : 'no-message';
                const serialized = `${changeKey}__MSG__${messageKey}`;

                // DEBUG: Log deduplication info
                console.log(`[simulateEffect] Scenario: ${scenario.name}, Changes: ${changes.length}, Key: "${serialized.substring(0, 100)}..."`);

                if (!serializedOutcomes.has(serialized)) {
                    serializedOutcomes.add(serialized);
                    outcomes.push({
                        scenario: scenario.name,
                        changes: changes,
                        resultMessage: result ? result.message : null
                    });
                    console.log(`[simulateEffect] -> Added as new outcome`);
                } else {
                    console.log(`[simulateEffect] -> DEDUPLICATED (already exists)`);
                }
            } catch (error) {
                // 记录执行失败
                const errChange = [{
                    property: 'error',
                    change: 0,
                    msg: error.message,
                    source: 'simulation-error'
                }];
                outcomes.push({
                    scenario: scenario.name + ' (Error)',
                    changes: errChange
                });
            }
        }
        return outcomes;
    },

    /**
     * 创建mock状态对象
     */
    createMockState() {
        return {
            money: 10000,
            health: 70,
            mental: 70,
            energy: 100,
            socialValue: 50,
            ingredients: 5,
            job: 'fulltime',
            housing: 'apartment',
            housingCost: 800,
            hasCar: true,
            hasPreparedMeal: true,
            hospitalDaysLeft: 0,
            sickLeaveDays: 3,
            pipActive: false,
            pipDaysRemaining: 0,
            pipPerformanceScore: 50,
            workTask: { progress: 50, difficulty: 3, deadline: 5, name: '测试任务' },
            insurance: {
                healthPlanId: 'employer_basic',
                carPlanId: 'liability',
                hasRentersInsurance: true,
                pendingHealthPlan: null,
                pendingCarPlan: null
            },
            day: 10,
            fuelRemaining: 3,
            fuelCapacity: 4,
            refuelCost: 20,
            carBroken: false,
            maxMental: 100,
            maxHealth: 100,
            maxEnergy: 100,
            dailyFinancialReport: [],
            jobTenure: 10,
            consecutiveUnpaidDays: 0,
            // 日常选择
            selectedLunch: 'homemade',
            selectedCommute: 'bus',
            // 其他
            hasAttendedAMA: false,
            isLate: false,
            ptoDays: 5,
            // Medical
            medicalDebt: 2000,
            medicalDebtInstallment: false,
            // Assets
            assets: {
                car: { owned: true, value: 5000 }
            },
            phoneBillPaid: true, // Enable phone social events
        };
    },

    /**
     * 比较hint数值和effect变化 (支持多结果)
     */
    compareValues(hintValues, outcomes) {
        // 如果 outcomes 为空或出错，视为 mismatch
        if (!outcomes || outcomes.length === 0) {
            return { status: 'mismatch', diffs: [] };
        }

        // 收集所有 outcome 中出现过的属性变化
        const possibleChanges = new Map(); // key: property, value: Set(change values)

        for (const outcome of outcomes) {
            for (const change of outcome.changes) {
                if (change.source === 'simulation-error' || change.source === 'config-ref') continue;
                if (!possibleChanges.has(change.property)) {
                    possibleChanges.set(change.property, new Set());
                }
                possibleChanges.get(change.property).add(change.change);
            }
        }

        const missingInEffect = [];

        // 检查每个 Hint 数值是否在任一 outcome 中被满足
        for (const hintVal of hintValues) {
            if (hintVal.source === 'text_approx') continue;

            const prop = hintVal.property;
            const val = hintVal.value;
            let matchFound = false;

            if (possibleChanges.has(prop)) {
                const changes = possibleChanges.get(prop);
                // 允许误差
                for (const changeVal of changes) {
                    if (Math.abs(changeVal - val) < 0.1) {
                        matchFound = true;
                        break;
                    }
                }
            }

            if (!matchFound) {
                missingInEffect.push(`${prop}: ${val}`);
            }
        }

        // 检查是否有 effect 中有变动但 hint 中未提及的属性
        const extraInEffect = [];
        // 收集 hint 中提到的所有属性
        const hintProperties = new Set(hintValues.map(h => h.property));

        for (const [prop, changes] of possibleChanges.entries()) {
            if (prop === 'config' || prop === 'error' || prop === 'job') continue;
            if (!hintProperties.has(prop)) {
                // 如果变动极其微小（可能是浮点误差），忽略
                let significant = false;
                for (const change of changes) {
                    if (Math.abs(change) >= 1) { // 阈值可调，目前设为1
                        significant = true;
                        break;
                    }
                }
                if (significant) {
                    // 取其中一个变动值作为示例
                    const exampleVal = Array.from(changes)[0];
                    extraInEffect.push({ property: prop, change: exampleVal });
                }
            }
        }

        const allDiffs = [];
        if (missingInEffect.length > 0) {
            allDiffs.push(...missingInEffect.map(m => ({ type: 'hint-not-in-effect', desc: m })));
        }
        if (extraInEffect.length > 0) {
            allDiffs.push(...extraInEffect.map(m => ({
                type: 'effect-not-in-hint',
                property: m.property,
                change: m.change
            })));
        }

        if (allDiffs.length > 0) {
            return { status: 'mismatch', diffs: allDiffs };
        }

        return { status: 'match', diffs: [] };
    },

    /**
     * 单个事件分析
     */
    analyzeChoice(choice, event, index) {
        // 解析 hint 和 text (处理函数类型)
        const resolvedHint = this.resolveHint(choice.hint);
        const resolvedText = this.resolveText(choice.text);

        const hintValues = this.parseHintValues(resolvedHint, choice.hintType || 'neutral');

        let effectFn = choice.effect;
        if (!effectFn) effectFn = () => { };

        // 执行多结果模拟
        const outcomes = this.simulateEffect(effectFn);

        let status = 'match';
        let diffs = [];

        if (!resolvedHint) {
            const hasEffect = outcomes.some(o => o.changes.length > 0);
            status = hasEffect ? 'mismatch' : 'match';
        } else {
            const compareRes = this.compareValues(hintValues, outcomes);
            status = compareRes.status;
            diffs = compareRes.diffs;
        }

        // IMPROVEMENT: If we have multiple outcomes (RNG) and it's a mismatch, 
        // classify as 'uncertain' instead to verify manually.
        if (status === 'mismatch' && outcomes.length > 1) {
            status = 'uncertain';
        }

        return {
            choiceIndex: index,
            id: choice.id, // Pass through ID for search
            nightAction: choice.nightAction, // Pass through nightAction for search
            text: resolvedText,
            hint: resolvedHint,
            hintValues: hintValues,
            outcomes: outcomes,
            effectChanges: [],
            diffs: diffs,
            status: status,
            condition: this.resolveCondition(choice.condition)
        };
    },

    /**
     * 格式化effect源码（简化显示）
     */
    formatEffectSource(source) {
        // 移除外层函数声明，只保留核心逻辑
        return source
            .replace(/^[\s\S]*?=>\s*\{?/, '')
            .replace(/\}$/, '')
            .trim()
            .substring(0, 500); // 限制长度
    },

    /**
     * 渲染分析结果
     */
    renderResults() {
        const tbody = document.getElementById('eventsTableBody');
        tbody.innerHTML = '';

        for (const event of this.analysisResults) {
            for (const choice of event.choices) {
                const row = document.createElement('tr');
                row.className = `status-${choice.status}`;
                row.dataset.eventType = event.type;
                row.dataset.status = choice.status;
                // 构建搜索文本，包含 id, title, text 以及潜在的 choice id / nightAction
                const searchParts = [
                    event.id,
                    event.title,
                    event.period,
                    choice.text,
                    choice.id,
                    choice.nightAction
                ];
                row.dataset.searchText = searchParts.filter(Boolean).join(' ').toLowerCase();

                // 恢复之前的用户输入（如果有）
                const actionValue = choice.userAction || 'none';
                const noteValue = choice.userNote || '';

                // 构建效果列 HTML
                let effectHtml = '';
                if (choice.outcomes && choice.outcomes.length > 0) {
                    if (choice.outcomes.length === 1) {
                        // 只有一个结果 (无论是否随机，结果一致)
                        effectHtml = `<div class="effect-changes">
                            ${choice.outcomes[0].changes.map(c => this.renderEffectChange(c)).join('')}
                        </div>`;
                        if (choice.outcomes[0].resultMessage) {
                            effectHtml += `<div class="effect-message small text-muted">${this.escapeHtml(choice.outcomes[0].resultMessage)}</div>`;
                        }
                    } else {
                        // 多个结果，显示分支
                        effectHtml = choice.outcomes.map(outcome => `
                            <div class="outcome-block">
                                <div class="outcome-title ${outcome.scenario.includes('Lucky') || outcome.scenario.includes('吉') ? 'outcome-lucky' : 'outcome-unlucky'}">${outcome.scenario}</div>
                                <div class="effect-changes">
                                    ${outcome.changes.map(c => this.renderEffectChange(c)).join('')}
                                </div>
                                ${outcome.resultMessage ? `<div class="effect-message small text-muted">${this.escapeHtml(outcome.resultMessage)}</div>` : ''}
                            </div>
                        `).join('');
                    }
                } else {
                    effectHtml = '<span class="text-muted">无效果</span>';
                }

                // Diff html
                const diffHtml = (choice.diffs || []).map(d => this.renderDifference(d)).join('');

                row.innerHTML = `
                    <td class="col-status">
                        <span class="status-badge ${choice.status}">
                            ${choice.status === 'match' ? '✓' : choice.status === 'mismatch' ? '✗' : '?'}
                        </span>
                    </td>
                    <td class="col-event">
                        <div class="event-id">${event.id}</div>
                        <div class="event-title">${this.escapeHtml(event.title)}</div>
                        <span class="event-type-badge">${event.type}</span>
                        <span class="event-type-badge">period:${event.period}</span>
                        ${event.condition ? `<div class="event-condition" title="事件前置条件"><span class="condition-label">📋 事件条件:</span> ${this.escapeHtml(event.condition)}</div>` : ''}
                    </td>
                    <td class="col-choice">
                        <div class="choice-text">${this.escapeHtml(choice.text)}</div>
                        ${choice.condition ? `<div class="choice-condition" title="选项前置条件"><span class="condition-label">🔒</span> ${this.escapeHtml(choice.condition)}</div>` : ''}
                    </td>
                    <td class="col-hint">
                        <textarea class="hint-edit" style="width:100%; min-height:60px; font-size:12px; font-family:inherit; border:1px solid #444; background:#222; color:#ccc;"
                            onchange="DebugTools.handleActionChange('${event.id}', ${choice.choiceIndex}, 'hint', this.value)">${this.escapeHtml(choice.userHint !== undefined ? choice.userHint : choice.hint)}</textarea>
                        <div class="hint-values">
                            ${choice.hintValues.map(v => `<span class="value-tag">${v.raw}</span>`).join('')}
                        </div>
                    </td>
                    <td class="col-effect">
                        ${effectHtml}
                        <input type="text" class="effect-edit" placeholder="修正数值 (如 money:-10)" 
                            style="width:100%; margin-top:5px; font-size:12px; border:1px solid #444; background:#222; color:#ccc; padding:2px;"
                            value="${this.escapeHtml(choice.userEffect || '')}"
                            onchange="DebugTools.handleActionChange('${event.id}', ${choice.choiceIndex}, 'effect', this.value)">
                    </td>
                    <td class="col-diff">
                        ${diffHtml}
                    </td>
                    <td class="col-action">
                        <select class="action-select" onchange="DebugTools.handleActionChange('${event.id}', ${choice.choiceIndex}, 'action', this.value)">
                            <option value="none" ${actionValue === 'none' ? 'selected' : ''}>无需处理</option>
                            <option value="fix_desc" ${actionValue === 'fix_desc' ? 'selected' : ''}>修改描述 Text</option>
                            <option value="fix_data" ${actionValue === 'fix_data' ? 'selected' : ''}>修改属性 Data</option>
                            <option value="fix_logic" ${actionValue === 'fix_logic' ? 'selected' : ''}>修复逻辑 Logic</option>
                            <option value="fix_note" ${actionValue === 'fix_note' ? 'selected' : ''}>根据备注 Note</option>
                            <option value="ignore" ${actionValue === 'ignore' ? 'selected' : ''}>忽略 Ignore</option>
                        </select>
                        <input type="text" class="action-note" placeholder="备注..." 
                            value="${this.escapeHtml(noteValue)}"
                            onchange="DebugTools.handleActionChange('${event.id}', ${choice.choiceIndex}, 'note', this.value)">
                    </td>
                `;

                tbody.appendChild(row);
            }
        }
    },

    /**
     * 处理用户操作变更
     */
    handleActionChange(eventId, choiceIndex, field, value) {
        const event = this.analysisResults.find(e => e.id === eventId);
        if (event) {
            // 注意：因为 choice 可能是过滤后的，直接用 index 查找可能不准
            // 如果 event.choices 顺序未变，可以用 index。
            // 更稳妥的方式是给 choice 加 id，或者 trust index if we re-render full list.
            // 这里我们假设 index 是在 event.choices 中的索引
            if (event.choices[choiceIndex]) {
                console.log(`Updating ${eventId} choice ${choiceIndex}: ${field} = ${value}`);
                if (field === 'action') {
                    event.choices[choiceIndex].userAction = value;
                } else if (field === 'note') {
                    event.choices[choiceIndex].userNote = value;
                }
            } else {
                console.error(`Choice ${choiceIndex} not found in event ${eventId}`);
            }
        } else {
            console.error(`Event ${eventId} not found`);
        }
    },


    /**
     * 渲染单个effect变化
     */
    renderEffectChange(change) {
        if (change.source === 'simulation-error') {
            return `<span class="effect-error">❌ ${change.msg || 'Unknown Error'}</span>`;
        }
        if (change.source === 'config-ref') {
            return `<span class="effect-config">📋 conf.${change.change}</span>`;
        }
        const sign = change.change >= 0 ? '+' : '';
        return `<span class="effect-change ${change.change >= 0 ? 'positive' : 'negative'}">
            ${change.property}: ${sign}${change.change}
        </span>`;
    },

    /**
     * 渲染差异项
     */
    renderDifference(diff) {
        if (diff.type === 'hint-not-in-effect') {
            return `<div class="diff-item warning">${diff.desc || 'Hint数值未匹配'}</div>`;
        }
        if (diff.type === 'effect-not-in-hint') {
            return `<div class="diff-item info">effect: ${diff.property} ${diff.change > 0 ? '+' : ''}${diff.change} 未在hint中提及</div>`;
        }
        return '';
    },

    /**
     * 更新统计显示
     */
    updateStats() {
        document.getElementById('totalEvents').textContent = this.stats.totalEvents;
        document.getElementById('totalChoices').textContent = this.stats.totalChoices;
        document.getElementById('matchCount').textContent = this.stats.matchCount;
        document.getElementById('mismatchCount').textContent = this.stats.mismatchCount;
        document.getElementById('uncertainCount').textContent = this.stats.uncertainCount;
    },

    /**
     * 应用筛选
     */
    applyFilters() {
        const typeFilter = document.getElementById('filterType').value;
        const statusFilter = document.getElementById('filterStatus').value;
        const searchText = document.getElementById('searchInput').value.toLowerCase();

        const rows = document.querySelectorAll('#eventsTableBody tr');
        for (const row of rows) {
            const matchType = typeFilter === 'all' || row.dataset.eventType === typeFilter;
            const matchStatus = statusFilter === 'all' || row.dataset.status === statusFilter;
            const matchSearch = !searchText || row.dataset.searchText.includes(searchText);

            row.style.display = (matchType && matchStatus && matchSearch) ? '' : 'none';
        }
    },

    /**
     * 导出JSON
     */
    exportJSON() {
        const data = {
            exportTime: new Date().toISOString(),
            stats: this.stats,
            results: this.analysisResults.map(event => ({
                ...event,
                choices: event.choices.map(choice => ({
                    ...choice,
                    userAction: choice.userAction || 'none',
                    userNote: choice.userNote || ''
                }))
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, `event-analysis-${Date.now()}.json`);
    },

    /**
     * 导出CSV
     */
    exportCSV() {
        const headers = ['事件ID', '事件类型', '事件标题', '选择文本', 'Hint', 'UserHint', '状态', 'Effect变化', 'UserEffect', '差异', '处理建议', '备注'];
        const rows = [headers.join(',')];

        for (const event of this.analysisResults) {
            for (const choice of event.choices) {
                // 合并所有 outcomes 中的 changes
                let effectStr = '';
                if (choice.outcomes && choice.outcomes.length > 0) {
                    effectStr = choice.outcomes.flatMap(o =>
                        o.changes.filter(c => c.source !== 'simulation-error')
                            .map(c => `${c.property}:${c.change}`)
                    ).join('; ');
                }
                const diffStr = (choice.diffs || []).map(d => d.desc || d.type).join('; ');

                // 获取用户输入
                const actionMap = {
                    'none': '无',
                    'fix_desc': '修改描述',
                    'fix_data': '修改属性',
                    'fix_logic': '修复逻辑',
                    'fix_note': '根据备注',
                    'ignore': '忽略'
                };
                const action = actionMap[choice.userAction] || '无';
                const note = choice.userNote || '';

                const userHint = choice.userHint !== undefined ? choice.userHint : '';
                const userEffect = choice.userEffect !== undefined ? choice.userEffect : '';

                rows.push([
                    event.id,
                    event.type,
                    `"${this.escapeCSV(event.title)}"`,
                    `"${this.escapeCSV(choice.text)}"`,
                    `"${this.escapeCSV(choice.hint)}"`,
                    `"${this.escapeCSV(userHint)}"`,
                    choice.status,
                    `"${effectStr}"`,
                    `"${this.escapeCSV(userEffect)}"`,
                    `"${diffStr}"`,
                    `"${action}"`,
                    `"${this.escapeCSV(note)}"`
                ].join(','));
            }
        }

        const blob = new Blob(['\uFEFF' + rows.join('\n')], { type: 'text/csv;charset=utf-8' });
        this.downloadFile(blob, `event-analysis-${Date.now()}.csv`);
    },

    /**
     * 下载文件
     */
    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // 延迟释放 URL，解决部分浏览器(如Chrome)中点击后立即释放导致下载失败的问题
        setTimeout(() => URL.revokeObjectURL(url), 2000);
    },

    /**
     * HTML转义
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * CSV转义
     */
    escapeCSV(text) {
        if (!text) return '';
        return text.replace(/"/g, '""');
    },

    /**
     * 显示/隐藏加载状态
     */
    showLoading(show) {
        document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
    }
};

// 挂载到 window 供控制台调试和 HTML 端初始化
window.DebugTools = DebugTools;

