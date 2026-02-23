/**
 * Game 核心模块 - 构造函数、初始化、状态管理
 */
import { GameData } from '../data/index.js';
import { SeededRNG } from '../rng.js';
import { I18n } from '../i18n.js';
import { getArtifact, getRandomArtifacts } from '../data/artifacts.js';

/**
 * Game 基础类
 */
export class Game {
    constructor() {
        this.state = null;
        this.isRunning = false;
        this.currentEvent = null;
        this.pendingEnergyChange = 0;  // 明天的精力变化
        this.rng = null; // V2.11 随机数生成器
    }

    /**
     * 初始化新游戏
     */
    init(seed, artifactId = null, housingId = null) {
        // V2.11 初始化 RNG
        this.state = JSON.parse(JSON.stringify(GameData.initialState));
        if (seed) this.state.seed = seed;
        if (housingId) this.state.housing = housingId;
        this.rng = new SeededRNG(this.state.seed);

        const baseHousingCost = GameData.housingTypes[this.state.housing]?.cost || GameData.initialState.housingCost || 1000;
        this.state.housingCost = Math.floor(baseHousingCost * (this.state.rentIndex || 1));
        if (artifactId) {
            this.addArtifact(artifactId);
            console.log(`[Game] Artifact Equip: ${artifactId}`);
            this.triggerArtifacts('onInit', this.state); // 触发初始化效果
        }

        this.isRunning = true;
        this.currentEvent = null;
        this.pendingEnergyChange = 0;
        this.pendingInvestmentEffect = null; // V2.XX 待播放的投资情绪特效
        this.startedAt = Date.now();
        this.messageLog = []; // V2.XX 消息历史记录
        this.state.triggeredEndings = []; // V2.XX 已触发结局记录

        // V2.6 初始化保险状态
        if (!this.state.insurance) {
            this.state.insurance = JSON.parse(JSON.stringify(GameData.initialState.insurance));
        }

        if (!this.state.autoRepay || typeof this.state.autoRepay !== 'object') {
            this.state.autoRepay = { enabled: false, keepCash: 1000, maxDaily: 0 };
        }
        this.state.autoRepay.enabled = !!this.state.autoRepay.enabled;
        this.state.autoRepay.keepCash = Math.max(0, Math.round(this.state.autoRepay.keepCash || 0));
        this.state.autoRepay.maxDaily = Math.max(0, Math.round(this.state.autoRepay.maxDaily || 0));

        if (typeof this.state.autoRepaySetupPrompted !== 'boolean') {
            this.state.autoRepaySetupPrompted = false;
        }

        // V2.7 初始化工作任务
        this.assignNewTask();

        // V2.XX 初始化第一天市场新闻 (确保第一天必有新闻)
        if (typeof this.triggerMarketNews === 'function') {
            this.triggerMarketNews();
        }
    }

    /**
     * 提交搬家申请（下个房租周期生效）
     */
    requestHousingChange(newHousingId) {
        if (!newHousingId || !GameData.housingTypes[newHousingId]) {
            return false;
        }

        if (newHousingId === this.state.housing) {
            this.state.pendingHousing = null;
            return false;
        }

        // 现金门槛：申请搬家时，必须至少有“目标住所”的一个月房租现金
        const target = GameData.housingTypes[newHousingId];
        const rentIndex = this.state.rentIndex || 1;
        const requiredMonthly = Math.floor((target.cost || 0) * rentIndex);
        if ((this.state.money || 0) < requiredMonthly) {
            const msg = I18n.t('game.housing.insufficientCash', requiredMonthly);
            this.addLog({ key: 'game.housing.insufficientCash', args: [requiredMonthly], fallback: msg }, 'warning', { key: 'ui_static.game_header.housing', fallback: I18n.t('ui_static.game_header.housing') });
            return false;
        }

        this.state.pendingHousing = newHousingId;
        const houseName = this.getStatusDescriptionForState({ ...this.state, housing: newHousingId }).housing;
        this.addLog({ key: 'game.housing.nextCycleEffective', fallback: I18n.t('game.housing.nextCycleEffective') }, 'info', { key: 'ui_static.game_header.housing', fallback: I18n.t('ui_static.game_header.housing') });
        return true;
    }

    /**
     * 撤销搬家申请
     */
    cancelHousingChange() {
        if (!this.state.pendingHousing) return false;
        this.state.pendingHousing = null;
        this.addLog({ key: 'game.housing.changeCanceled', fallback: I18n.t('game.housing.changeCanceled') }, 'neutral', { key: 'ui_static.game_header.housing', fallback: I18n.t('ui_static.game_header.housing') });
        return true;
    }

    /**
     * 获取当前状态
     */
    getState() {
        return this.state;
    }

    /**
     * 限制数值范围
     */
    clampValues() {
        // 使用动态上限，回退到 100
        const maxEnergy = this.state.maxEnergy || 100;
        const maxMental = this.state.maxMental || 100;
        const maxHealth = this.state.maxHealth || 100;

        let minEnergy = 0;

        // V2.XX Fix: Set fainted flag BEFORE clamping to minEnergy if it dropped to <= 0
        // Only trigger if NOT in preview mode (isPreview is property of game instance, not state)
        if (this.state.energy <= 0 && !this.isPreview) {
            if (!this.state.faintedToday && this.hasArtifact && this.hasArtifact('coffee_drip')) {
                // Determine probability trigger
                const triggerChance = GameData.artifactConfig?.coffee_drip?.chance || 0.3;
                if (this.rng && this.rng.random() < triggerChance) {
                    minEnergy = GameData.artifactConfig?.coffee_drip?.minEnergy || 1;
                    this.addLog({ key: 'game.artifactTriggers.coffee_drip', fallback: '☕ 咖啡点滴生效，强行吊着一口气！' }, 'positive', { key: 'ui_static.finance.artifact', fallback: '神器' });
                }
            }
            if (minEnergy === 0) {
                this.state.faintedToday = true;
            }
        }

        this.state.energy = Math.max(minEnergy, Math.min(maxEnergy, this.state.energy));
        this.state.mental = Math.max(0, Math.min(maxMental, this.state.mental));
        this.state.health = Math.max(0, Math.min(maxHealth, this.state.health));
        if (this.state.money < 0) {
            const overflow = Math.abs(this.state.money);
            if (this.addDebt) {
                this.addDebt(overflow, 'overflow', { silent: true });
            }
            this.state.money = 0;
        }
        this.state.money = Math.max(0, this.state.money);
    }

    /**
     * 格式化金额
     */
    formatMoney(amount) {
        if (amount < 0) {
            return `-$${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
        }
        return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}`;
    }

    /**
     * 获取随机引用
     */
    getRandomQuote() {
        // V2.35 动态获取语录
        const list = GameData.sarcasmQuotes.list;
        if (!list || !Array.isArray(list)) return "System Error";
        return list[Math.floor(this.rng.random() * list.length)];
    }

    /**
     * 获取状态描述
     */
    getStatusDescription() {
        return this.getStatusDescriptionForState(this.state);
    }

    /**
     * 根据指定 state 构造状态描述 (用于 UI 预览)
     */
    getStatusDescriptionForState(state) {
        const jobInfo = GameData.jobTypes[state.job];
        const housingInfo = GameData.housingTypes[state.housing];
        const periodInfo = GameData.periods[state.period];

        return {
            money: this.formatMoney(state.money),
            housing: housingInfo ? (typeof housingInfo.name === 'function' ? housingInfo.name() : housingInfo.name) : '未知',
            housingCost: state.housingCost,
            job: jobInfo ? (typeof jobInfo.name === 'function' ? jobInfo.name() : jobInfo.name) : '未知',
            jobId: state.job, // 用于 UI 查找收入
            monthlyIncome: state.monthlyIncome,
            energy: state.energy,
            mental: state.mental,
            health: state.health,
            day: state.day,
            period: state.period,
            periodName: periodInfo ? (typeof periodInfo.name === 'function' ? periodInfo.name() : periodInfo.name) : '',
            periodIcon: periodInfo ? periodInfo.icon : '',
            daysUntilPayday: state.daysUntilPayday,
            daysUntilRent: state.daysUntilRent,
            daysUntilUtility: state.daysUntilUtility,
            utilityBill: state.utilityBill,
            ingredients: state.ingredients,
            hasPreparedMeal: state.hasPreparedMeal,
            isLowEnergy: state.energy < GameData.energyConfig.lowEnergyThreshold,
            dailyFinancialReport: state.dailyFinancialReport || [], // 暴露给 UI (V2.4)
            workTask: state.workTask, // V2.7 工作任务
            daysUntilInsurance: state.daysUntilInsurance, // 保险账单倒计时
            debt: this.formatMoney(state.debt || 0) // V2.XX 负债
        };
    }


    /**
     * 获取神器抽取候选项
     * @param {number} count - 数量
     * @returns {Array} - 神器对象数组
     */
    getArtifactDraftOptions(count = 3, excludedIds = []) {
        return getRandomArtifacts(count, this.rng, excludedIds);
    }

    /**
     * 触发神器效果钩子
     * @param {string} hookName - 钩子名称 (onDaily, onInit 等)
     * @param  {...any} args - 传递给钩子的参数
     * @returns {object|null} - 返回效果结果，如果没有触发或没有钩子则返回 null
     */
    triggerArtifacts(hookName, ...args) {
        if (!this.state || !Array.isArray(this.state.artifacts)) return [];

        const results = [];
        for (const id of this.state.artifacts) {
            const artifact = getArtifact(id);
            if (artifact && typeof artifact[hookName] === 'function') {
                console.log(`[Artifact] Trigger ${hookName} on ${artifact.id}`);
                const res = artifact[hookName](...args);
                if (res) {
                    if (typeof res === 'object') {
                        res.id = artifact.id;
                    }
                    results.push(res);
                }
            }
        }
        return results;
    }

    addArtifact(id) {
        const normalizedId = id === 'coffee_iv_drip' ? 'coffee_drip' : id;
        const maxSlots = GameData.artifactMaxSlots || 3;
        if (!this.state.artifacts) this.state.artifacts = [];
        if (this.state.artifacts.length >= maxSlots) return false;
        if (this.state.artifacts.includes(normalizedId)) return false;
        this.state.artifacts.push(normalizedId);
        return true;
    }

    removeArtifact(id) {
        if (!this.state.artifacts) return false;
        const index = this.state.artifacts.indexOf(id);
        if (index === -1) return false;
        this.state.artifacts.splice(index, 1);
        return true;
    }

    hasArtifact(id) {
        return Array.isArray(this.state.artifacts) && this.state.artifacts.includes(id);
    }

    /**
     * V2.XX 添加消息日志（支持 i18n key + args）
     * @param {string|object} message - 字符串或 { key, args, fallback }
     * @param {string} type - 消息类型 (normal, warning, positive, etc.)
     * @param {string|object|null} source - 字符串或 { key, args, fallback }
     */
    addLog(message, type = 'normal', source = null) {
        if (!this.state.messageLog) {
            this.state.messageLog = [];
        }

        const msgPayload = this._normalizeI18nPayload(message);
        const sourcePayload = this._normalizeI18nPayload(source);

        const logEntry = {
            day: this.state.day,
            period: this.state.period, // 'day', 'night', etc.
            message: msgPayload.text,
            messageKey: msgPayload.key,
            messageArgs: msgPayload.args,
            type: type,
            source: sourcePayload.text,
            sourceKey: sourcePayload.key,
            sourceArgs: sourcePayload.args,
            timestamp: Date.now()
        };

        this.state.messageLog.push(logEntry);

        // 内存优化：只保留最近 2 天的日志 (currentDay 和 currentDay - 1)
        const keepFromDay = this.state.day - 1;
        // 过滤掉旧日志，直接重置数组以释放内存
        if (this.state.messageLog.length > 0 && this.state.messageLog[0].day < keepFromDay) {
            this.state.messageLog = this.state.messageLog.filter(log => log.day >= keepFromDay);
        }
    }

    _normalizeI18nPayload(payload) {
        if (payload === null || payload === undefined) {
            return { text: null, key: null, args: [] };
        }
        if (typeof payload === 'string') {
            return { text: payload, key: null, args: [] };
        }
        if (typeof payload === 'object') {
            const key = typeof payload.key === 'string' ? payload.key : null;
            const args = Array.isArray(payload.args) ? payload.args : [];
            const fallback = typeof payload.fallback === 'string' ? payload.fallback : null;
            return { text: fallback, key, args };
        }
        return { text: String(payload), key: null, args: [] };
    }

    pushDailyReport(payload, state = this.state) {
        if (!state) return;
        if (!state.dailyFinancialReport) state.dailyFinancialReport = [];
        const normalized = this._normalizeI18nPayload(payload);
        state.dailyFinancialReport.push({
            text: normalized.text,
            key: normalized.key,
            args: normalized.args
        });
    }

    resolveDailyReportEntries(entries = []) {
        return entries.map((entry) => {
            const normalized = this._normalizeI18nPayload(entry);
            if (normalized.key) {
                const translated = I18n.t(normalized.key, ...(normalized.args || []));
                if (translated && translated !== normalized.key) return translated;
            }
            return normalized.text || '';
        }).filter(Boolean);
    }
}
