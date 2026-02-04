/**
 * Game Configuration
 */
import { I18n } from '../i18n.js';

export const timeCycle = {
    monthDays: 10,      // 一个月的天数 (用于发薪、交租等)
    weekDays: 4,        // 一周的天数 (用于休息日判断)
    restDayMod: 0,      // day % weekDays === restDayMod 时为休息日
};

export const newbieProtectionDays = 2;

export const randomEventLimits = {
    dailyMax: 3,
    cooldownDays: 7
};

export const initialState = {
    money: 200,            // 初始存款 (10天/月节奏)
    monthlyIncome: 1500,    // 月薪 (10天周期)
    housing: 'apartment',   // 住所类型
    housingCost: 1000,       // 月租 (10天周期)
    job: 'fulltime',        // 工作状态
    energy: 90,             // 精力值
    maxEnergy: 100,         // 精力上限
    mental: 90,             // 精神值
    maxMental: 100,         // 精神上限 (精力耗尽会永久减少)
    health: 100,             // 健康值
    maxHealth: 100,          // 健康上限
    workEfficiency: 100,    // 工作能力
    maxWorkEfficiency: 120, // 工作能力上限
    day: 1,                 // 当前天数
    period: 'day',          // 时段: day, night, deep_night

    // 多神器系统
    artifacts: [],

    // 随机事件限制
    randomEventsToday: [],
    randomEventsTodayCount: 0,
    randomEventLastDay: {},
    dailyFinancialReport: [],

    // V2.XX 消息历史记录
    messageLog: [],
    daysUntilPayday: 1,    // 距离发薪日
    daysUntilRent: timeCycle.monthDays,      // 距离交租日 (10天周期)
    daysUntilUtility: timeCycle.monthDays,   // 距离水电费缴费日 (10天周期)
    dailyUtilityBase: 8,    // 每日基础水电费
    utilityBill: 0,        // 本月水电费账单
    phoneBillPaid: true,    // 本月手机费是否已付
    monthlyPhoneBill: 20,   // 月手机费
    daysUntilInsurance: timeCycle.monthDays, // 距离保险缴费日 (10天周期)

    // 汽车相关
    hasCar: true,           // 是否有车
    carInsurancePaid: true, // 本月保险是否已付
    fuelRemaining: 4,       // 剩余可通勤次数
    fuelCapacity: 4,        // 满油可通勤次数
    refuelCost: 20,         // 加油费用
    carBroken: false,       // 汽车是否故障 (需修理才能开)

    // 其他属性
    creditScore: 750,       // 信用分数
    unemployedDays: 0,      // 失业天数
    coffeeToday: false,     // 今天是否喝了咖啡
    sleptWell: true,        // 昨晚是否睡好

    // V2.1 新增属性
    socialValue: 50,        // 社交值 0-100
    maxSocialValue: 100,    // 社交值上限
    healthStatus: 'normal', // 健康状态: normal/cold/sick/critical
    consecutiveFastFood: 0, // 连续吃快餐天数
    medicalDebt: 0,         // 医疗债务
    lastSocialWarningDay: 0, // 上次社交警告显示的天数 (防止重复弹窗)

    // V2.19 新增状态
    receivingUnemployment: false, // 是否正在领取失业救济
    unemploymentWeeksLeft: 0,     // 剩余救济金领取周数
    creditCollapsedTriggered: false, // 信用崩塌事件是否已触发
    medicalDebtInstallment: false,   // 是否在分期还医疗债务

    // V2.28 住院与病假系统
    hospitalDaysLeft: 0,    // 剩余住院天数
    hospitalBill: 0,        // 累计住院账单
    hospitalDailyCost: 0,   // 每日住院费
    sickLeaveDays: 3,       // 带薪病假天数 (初始3天)
    jobTenure: 0,           // 当前工作工龄
    consecutiveUnpaidDays: 0, // 连续无薪缺勤天数
    surgeryApprovalDaysLeft: 0, // 手术审批剩余天数
    surgeryApprovalPending: false, // 手术审批结果待确认
    // 食材与备餐系统
    ingredients: 0,         // 食材储备 (0-10)
    hasPreparedMeal: false, // 是否已准备次日便当
    lunchType: null,        // V2.4 选定的午餐策略: bento, fastfood, skip (null=必须选)
    selectedDailyAction: null, // V2.10 选定的日常额外行动 (null=不选)
    selectedIncident: null,    // V2.10 选定的突发事件处理方案 (null=不选)
    selectedCommute: null,     // V2.21 选定的通勤方式: car, bus, walk (null=必须选)
    sideActionsLocked: false,   // V2.55 侧边行动锁定 (防止同一时段内重复显示)
    spentMoneyToday: false,     // 当天是否发生花钱行为
    lastWorkChoiceId: null,     // 上次工作选择
    lastWorkProgressGain: 0,    // 上次工作进度增量
    pendingInternBadge: null,   // 实习生工牌待处理

    // V2.6 保险系统状态
    insurance: {
        // 健康保险
        healthPlanId: 'employer_basic', // 当前计划
        healthDeductiblePaid: 0,        // 本年度已付免赔额
        healthOutOfPocketPaid: 0,       // 本年度已付自付上限

        // 汽车保险
        carPlanId: 'liability',         // 默认半险

        // 租客保险
        hasRentersInsurance: false,     // 默认无

        // 待变更计划 (下月生效)
        pendingHealthPlanId: null,
        pendingCarPlanId: null, // V2.24 车险待变更
        pendingRentersStatus: null, // V2.24 租客险待变更 (存储 boolean)

        // V2.20 新增：医疗排队与白卡状态
        waitingForDoctor: 0,     // 等待就医天数 (PCP)
        medicaidApplicationDays: 0, // 白卡申请倒计时
        deniedMedicaid: false,   // 是否被拒过
    },

    // V2.7 工作任务系统
    workTask: {
        difficulty: 3,       // 1-5，难度越高每次进度增加越少
        deadline: 7,         // 剩余天数
        progress: 0,         // 0-100
        overdueDays: 0,      // 超时天数
        name: '项目开发',    // 任务名称
        maxProgress: 100,    // 最大进度
    },

    // V2.9 多资产投资系统
    // 持仓：每个资产 ID -> { quantity, avgCost }
    holdings: {
        gold: { quantity: 0, avgCost: 0 },
        sp500: { quantity: 0, avgCost: 0 },
        tech_giant: { quantity: 0, avgCost: 0 },
        biotech: { quantity: 0, avgCost: 0 },
        energy: { quantity: 0, avgCost: 0 },
        reit: { quantity: 0, avgCost: 0 },
        btc: { quantity: 0, avgCost: 0 },
        eth: { quantity: 0, avgCost: 0 },
        solana: { quantity: 0, avgCost: 0 },
        meme_coin: { quantity: 0, avgCost: 0 },
    },
    // 市场价格：每个资产 ID -> { price, change, history }
    marketPrices: {
        gold: { price: 2000, change: 0, history: [] },
        sp500: { price: 450, change: 0, history: [] },
        tech_giant: { price: 180, change: 0, history: [] },
        biotech: { price: 120, change: 0, history: [] },
        energy: { price: 75, change: 0, history: [] },
        reit: { price: 100, change: 0, history: [] },
        btc: { price: 50000, change: 0, history: [] },
        eth: { price: 3000, change: 0, history: [] },
        solana: { price: 150, change: 0, history: [] },
        meme_coin: { price: 0.5, change: 0, history: [] },
    },
    // 当前新闻
    currentNews: null,
    // 市场传闻与确认
    marketRumorId: null,
    marketRumorConfirmDay: 0,
    lastMarketRumorDay: 0,
    // 市场情绪 (-100 恐慌 ~ +100 贪婪)
    marketSentiment: 0,

    // 预见未来 - 小道消息冷却
    lastRumorDay: 0,

    // V2.13 统计数据
    stats: {
        maxWealth: 0, // 历史最高资产
    }
};

export const artifactMaxSlots = 3;

export const energyConfig = {
    lowEnergyThreshold: 30,     // 低精力阈值
    lowEnergyPenalty: 0.2,      // 低精力时成功率惩罚 (20%)
    coffeeBoost: 20,            // 咖啡提升精力
    coffeeMentalCost: 5,        // 咖啡降低精神（长期）
    exerciseEnergyCost: 15,     // 运动消耗精力
    exerciseMentalBoost: 20,    // 运动提升精神
};

export const sleepConfig = {
    poorSleepRecoveryMod: 0.5,  // 熬夜/没睡好时的恢复效率乘数
};

export const medicalRiskConfig = {
    outOfNetworkChance: 0.20,   // 紧急情况遭遇网外医生的概率
    denialChance: 0.10,         // 大额非紧急账单被拒赔的概率
    denialCostThreshold: 2000,  // 触发拒赔判定的金额阈值
};

export const exhaustionConfig = {
    energyThreshold: 0,      // 精力透支阈值 (<= 此值时触发强制睡眠)
    healthThreshold: 20      // 健康透支阈值 (< 此值时触发强制睡眠)
};

// 生病与医疗等待配置
export const sicknessConfig = {
    energyPenaltyBase: 20,               // 生病精力惩罚基数 (原effects.js L97)
    waitingDeteriorationMin: 3,          // 等待就医每日最低健康消耗
    waitingDeteriorationMax: 8,          // 等待就医每日最高健康消耗
};

// 工作任务生成配置
export const workTaskConfig = {
    difficultyMin: 1,                    // 任务难度最小值
    difficultyMax: 5,                    // 任务难度最大值
    deadlineMin: 3,                      // 任务期限最小天数
    deadlineMax: 10,                     // 任务期限最大天数
};

export const financialIncreaseConfig = {
    interval: 10,                        // 触发周期 (天)
    minWorkEfficiencyForRaise: 110,      // 加薪所需的最低工作能力
    salaryRaiseRange: { min: 0.05, max: 0.30 }, // 加薪幅度 5%-30%
    rentRaiseRange: { min: 0.5, max: 1.0 }    // 房租涨幅 50%-100%
};

export const socialCollapseConfig = {
    warningThreshold: 20,       // 警告阶段阈值
    criticalThreshold: 0,       // 崩溃阶段阈值

    // 警告阶段惩罚
    warningMentalPen: 2,        // 社交<20 精神惩罚
    warningSevereMentalPen: 5,  // 社交<10 精神惩罚

    // 崩溃阶段惩罚
    criticalHealthPen: 5,       // 健康惩罚
    criticalMentalPen: 10,      // 精神惩罚
    criticalWorkPen: 20,        // 工作效率惩罚
};

export const investmentMoodConfig = {
    thresholdPercent: 0.05,     // 触发情绪的涨跌幅阈值 (5%)
    minPortfolioValue: 200,    // 触发情绪的最低持仓价值
    mentalBonus: 5,             // 暴涨时的精神奖励
    mentalPenalty: 5,           // 暴跌时的精神惩罚
};

// 预见未来机制配置
export const foreseeingConfig = {
    marketRumorChance: 0.35,
    marketRumorConfirmMultiplier: 1.4,
    marketRumorSentimentScale: 0.3,
    marketRumorCooldownDays: 2,
    rumorChance: 0.35,
    billReminderDays: 2,
    utilityNewsImpact: {
        oil_surge: 20,
        oil_discovery: -10,
        trade_war: 10,
        geopolitical_tension: 10,
        inflation_spike: 8
    }
};

export const sarcasmQuotes = {
    get list() { return I18n.t('data.config.quotes'); }
};

export const dailyTips = {
    get list() { return I18n.t('data.config.tips'); }
};

export const endingRules = {
    survivalDays: 50,                 // 存活天数胜利条件
    debtSpiralThreshold: -3000,        // 深度破产阈值 (总资产)
    medicalDebtThreshold: 3000,       // 医疗债务阈值 (触发健康崩溃结局的额外条件)
    emergencyHealthRestore: 20,        // 急救后恢复的健康值
    exhaustionHealthThreshold: 30,     // 精力耗尽结局的健康判定阈值
    bankruptCreditScore: 500,          // 破产结局信用分阈值
    homelessUnemployedDays: 20,        // 流浪结局失业天数阈值
    criticalHealth: 0,                 // 健康崩溃阈值
    criticalMental: 0,                 // 精神崩溃阈值
    criticalEnergy: 0,                 // 精力耗尽阈值
    noMoney: 0,                        // 没钱阈值
    wealthThreshold: 50000,            // 财务自由结局存款阈值
};

export const endings = {
    financialFreedom: {
        get title() { return I18n.t('data.config.endings.financialFreedom.title'); },
        get subtitle() { return I18n.t('data.config.endings.financialFreedom.subtitle'); },
        get message() { return I18n.t('data.config.endings.financialFreedom.message'); },
        isVictory: true,
    },
    bankrupt: {
        get title() { return I18n.t('data.config.endings.bankrupt.title'); },
        get subtitle() { return I18n.t('data.config.endings.bankrupt.subtitle'); },
        get message() { return I18n.t('data.config.endings.bankrupt.message'); },
    },
    homeless: {
        get title() { return I18n.t('data.config.endings.homeless.title'); },
        get subtitle() { return I18n.t('data.config.endings.homeless.subtitle'); },
        get message() { return I18n.t('data.config.endings.homeless.message'); },
    },
    healthCollapse: {
        get title() { return I18n.t('data.config.endings.healthCollapse.title'); },
        get subtitle() { return I18n.t('data.config.endings.healthCollapse.subtitle'); },
        get message() { return I18n.t('data.config.endings.healthCollapse.message'); },
    },
    mentalBreakdown: {
        get title() { return I18n.t('data.config.endings.mentalBreakdown.title'); },
        get subtitle() { return I18n.t('data.config.endings.mentalBreakdown.subtitle'); },
        get message() { return I18n.t('data.config.endings.mentalBreakdown.message'); },
    },
    exhaustion: {
        get title() { return I18n.t('data.config.endings.exhaustion.title'); },
        get subtitle() { return I18n.t('data.config.endings.exhaustion.subtitle'); },
        get message() { return I18n.t('data.config.endings.exhaustion.message'); },
    },
    survived: {
        get title() { return I18n.t('data.config.endings.survived.title'); },
        get subtitle() { return I18n.t('data.config.endings.survived.subtitle'); },
        get message() { return I18n.t('data.config.endings.survived.message'); },
        isVictory: true,
    },
    debtSpiral: {
        get title() { return I18n.t('data.config.endings.debtSpiral.title'); },
        get subtitle() { return I18n.t('data.config.endings.debtSpiral.subtitle'); },
        get message() { return I18n.t('data.config.endings.debtSpiral.message'); },
        isVictory: false,
    },
};
