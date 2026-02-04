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
    init(seed, artifactId = null) {
        // V2.11 初始化 RNG
        this.rng = new SeededRNG(seed);
        console.log(`[Game] 初始化, 种子: ${this.rng.originalSeed || this.rng.initialSeed}`);

        this.state = JSON.parse(JSON.stringify(GameData.initialState));
        // V2.XX: 保存原始种子字符串，确保复制后可复现
        this.state.seed = this.rng.originalSeed || this.rng.initialSeed;
        this.state.artifacts = Array.isArray(this.state.artifacts) ? this.state.artifacts : [];
        if (artifactId) {
            this.addArtifact(artifactId);
            console.log(`[Game] Artifact Equip: ${artifactId}`);
            this.triggerArtifacts('onInit', this.state); // 触发初始化效果
        }

        this.isRunning = true;
        this.currentEvent = null;
        this.pendingEnergyChange = 0;
        this.pendingInvestmentEffect = null; // V2.XX 待播放的投资情绪特效
        this.messageLog = []; // V2.XX 消息历史记录

        // V2.6 初始化保险状态
        if (!this.state.insurance) {
            this.state.insurance = JSON.parse(JSON.stringify(GameData.initialState.insurance));
        }

        // V2.7 初始化工作任务
        this.assignNewTask();
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
        const minEnergy = this.hasArtifact && this.hasArtifact('coffee_drip') ? 1 : 0;
        // 使用动态上限，回退到 100
        const maxEnergy = this.state.maxEnergy || 100;
        const maxMental = this.state.maxMental || 100;
        const maxHealth = this.state.maxHealth || 100;

        // V2.XX Fix: Set fainted flag BEFORE clamping to minEnergy if it dropped to <= 0
        // Only trigger if NOT in preview mode (isPreview is property of game instance, not state)
        if (this.state.energy <= 0 && !this.isPreview) {
            this.state.faintedToday = true;
        }

        this.state.energy = Math.max(minEnergy, Math.min(maxEnergy, this.state.energy));
        this.state.mental = Math.max(0, Math.min(maxMental, this.state.mental));
        this.state.health = Math.max(0, Math.min(maxHealth, this.state.health));
        this.state.money = Math.max(-10000, this.state.money);
        this.state.creditScore = Math.max(300, Math.min(850, this.state.creditScore));
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
            daysUntilInsurance: state.daysUntilInsurance // 保险账单倒计时
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
     * V2.XX 添加消息日志
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (normal, warning, positive, etc.)
     * @param {string} source - (可选) 来源标题, 如事件名称
     */
    addLog(message, type = 'normal', source = null) {
        if (!this.state.messageLog) {
            this.state.messageLog = [];
        }

        const logEntry = {
            day: this.state.day,
            period: this.state.period, // 'day', 'night', etc.
            message: message,
            type: type,
            source: source,
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
}
