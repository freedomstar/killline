/**
 * Game 核心模块 - 构造函数、初始化、状态管理
 */
import { GameData } from '../data/index.js';
import { SeededRNG } from '../rng.js';
import { I18n } from '../i18n.js';

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
    init(seed) {
        // V2.11 初始化 RNG
        this.rng = new SeededRNG(seed);
        console.log(`[Game] 初始化, 种子: ${this.rng.initialSeed}`);

        this.state = JSON.parse(JSON.stringify(GameData.initialState));
        this.state.seed = this.rng.initialSeed; // 保存种子

        this.isRunning = true;
        this.currentEvent = null;
        this.currentEvent = null;
        this.pendingEnergyChange = 0;
        this.pendingInvestmentEffect = null; // V2.XX 待播放的投资情绪特效

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
        this.state.energy = Math.max(0, Math.min(100, this.state.energy));
        this.state.mental = Math.max(0, Math.min(100, this.state.mental));
        this.state.health = Math.max(0, Math.min(100, this.state.health));
        this.state.money = Math.max(-10000, this.state.money);
        this.state.creditScore = Math.max(300, Math.min(850, this.state.creditScore));
    }

    /**
     * 格式化金额
     */
    formatMoney(amount) {
        if (amount < 0) {
            return `-$${Math.abs(amount).toLocaleString()}`;
        }
        return `$${amount.toLocaleString()}`;
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
}
