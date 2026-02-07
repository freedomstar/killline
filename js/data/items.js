/**
 * Game Items and Static Data
 */
import { I18n } from '../i18n.js';

export const assetTypes = {
    // 黄金 - 避险资产
    gold: {
        id: 'gold',
        name: () => I18n.t('data.assetNames.gold'),
        icon: '🥇',
        unit: () => I18n.t('data.assetUnits.gold'),
        basePrice: 2000,
        volatility: 0.02,  // 低波动 ±2%
        isSafeHaven: true, // 避险资产
        category: 'commodity',
        riskLevel: 'low',
        description: () => I18n.t('data.assetDescriptions.gold')
    },
    // 股票类
    sp500: {
        id: 'sp500',
        name: () => I18n.t('data.assetNames.sp500'),
        icon: '📈',
        unit: () => I18n.t('data.assetUnits.sp500'),
        basePrice: 450,
        volatility: 0.05,
        sector: 'index',
        category: 'stock',
        riskLevel: 'medium',
        description: () => I18n.t('data.assetDescriptions.sp500')
    },
    tech_giant: {
        id: 'tech_giant',
        name: () => I18n.t('data.assetNames.tech_giant'),
        icon: '💻',
        unit: () => I18n.t('data.assetUnits.tech_giant'),
        basePrice: 180,
        volatility: 0.08,
        sector: 'tech',
        category: 'stock',
        riskLevel: 'medium',
        description: () => I18n.t('data.assetDescriptions.tech_giant')
    },
    biotech: {
        id: 'biotech',
        name: () => I18n.t('data.assetNames.biotech'),
        icon: '🧬',
        unit: () => I18n.t('data.assetUnits.biotech'),
        basePrice: 120,
        volatility: 0.12,  // High volatility
        sector: 'health',
        category: 'stock',
        riskLevel: 'high',
        description: () => I18n.t('data.assetDescriptions.biotech')
    },
    energy: {
        id: 'energy',
        name: () => I18n.t('data.assetNames.energy'),
        icon: '⛽',
        unit: () => I18n.t('data.assetUnits.energy'),
        basePrice: 75,
        volatility: 0.06,
        sector: 'energy',
        category: 'stock',
        riskLevel: 'medium',
        description: () => I18n.t('data.assetDescriptions.energy')
    },
    reit: {
        id: 'reit',
        name: () => I18n.t('data.assetNames.reit'),
        icon: '🏢',
        unit: () => I18n.t('data.assetUnits.reit'),
        basePrice: 100,
        volatility: 0.04,
        sector: 'real_estate',
        category: 'stock',
        riskLevel: 'medium',
        description: () => I18n.t('data.assetDescriptions.reit')
    },
    // 虚拟币类
    btc: {
        id: 'btc',
        name: () => I18n.t('data.assetNames.btc'),
        icon: '₿',
        unit: () => I18n.t('data.assetUnits.btc'),
        basePrice: 50000,
        volatility: 0.15,
        tier: 'major',
        category: 'crypto',
        riskLevel: 'high',
        description: () => I18n.t('data.assetDescriptions.btc')
    },
    eth: {
        id: 'eth',
        name: () => I18n.t('data.assetNames.eth'),
        icon: 'Ξ',
        unit: () => I18n.t('data.assetUnits.eth'),
        basePrice: 3000,
        volatility: 0.18,
        tier: 'major',
        category: 'crypto',
        riskLevel: 'high',
        description: () => I18n.t('data.assetDescriptions.eth')
    },
    solana: {
        id: 'solana',
        name: () => I18n.t('data.assetNames.solana'),
        icon: '◎',
        unit: () => I18n.t('data.assetUnits.solana'),
        basePrice: 150,
        volatility: 0.20,
        tier: 'major',
        category: 'crypto',
        riskLevel: 'high',
        description: () => I18n.t('data.assetDescriptions.solana')
    },
    meme_coin: {
        id: 'meme_coin',
        name: () => I18n.t('data.assetNames.meme_coin'),
        icon: '🐕',
        unit: () => I18n.t('data.assetUnits.meme_coin'),
        basePrice: 0.5,
        volatility: 0.40,
        tier: 'meme',
        category: 'crypto',
        riskLevel: 'extreme',
        description: () => I18n.t('data.assetDescriptions.meme_coin')
    }
};

// 市场新闻 - 使用函数获取本地化文本
const getNewsText = (id) => {
    const newsData = I18n.t(`data.marketNews.${id}`);
    return { title: newsData.title, description: newsData.description };
};

export const marketNews = [
    // 科技板块新闻
    { id: 'tech_earnings_beat', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { tech_giant: 0.12, sp500: 0.03 }, sentiment: 15 },
    { id: 'tech_layoffs', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { tech_giant: -0.10, sp500: -0.02 }, sentiment: -10 },
    { id: 'ai_breakthrough', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { tech_giant: 0.15, sp500: 0.04 }, sentiment: 20 },

    // 能源板块新闻
    { id: 'oil_surge', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { energy: 0.15, sp500: -0.01 }, sentiment: -5 },
    { id: 'green_energy', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { energy: -0.08, tech_giant: 0.05 }, sentiment: 5 },
    { id: 'oil_discovery', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { energy: 0.12 }, sentiment: 5 },

    // 虚拟币新闻
    { id: 'crypto_etf_approved', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { btc: 0.25, eth: 0.15, meme_coin: 0.30 }, sentiment: 20 },
    { id: 'crypto_ban', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { btc: -0.20, eth: -0.18, meme_coin: -0.35 }, sentiment: -25 },
    { id: 'meme_frenzy', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { meme_coin: 0.50 }, sentiment: 10 },
    { id: 'exchange_hack', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { btc: -0.12, eth: -0.15, meme_coin: -0.20 }, sentiment: -15 },
    { id: 'eth_upgrade', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { eth: 0.20, btc: 0.05 }, sentiment: 15 },

    // 宏观经济新闻 (影响黄金和整体市场)
    { id: 'fed_rate_hike', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { gold: -0.05, sp500: -0.04, btc: -0.08 }, sentiment: -15 },
    { id: 'fed_rate_cut', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { gold: 0.03, sp500: 0.06, btc: 0.10 }, sentiment: 15 },
    { id: 'inflation_spike', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { gold: 0.08, sp500: -0.03 }, sentiment: -10 },
    { id: 'geopolitical_tension', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { gold: 0.10, sp500: -0.05, energy: 0.08 }, sentiment: -20 },
    { id: 'peace_agreement', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { gold: -0.05, sp500: 0.08, energy: -0.03 }, sentiment: 25 },
    { id: 'market_rally', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { sp500: 0.06, tech_giant: 0.08, gold: -0.03 }, sentiment: 25 },
    { id: 'recession_fear', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { gold: 0.12, sp500: -0.08, tech_giant: -0.10, btc: -0.15 }, sentiment: -30 },
    { id: 'job_report_strong', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { sp500: 0.04, tech_giant: 0.03 }, sentiment: 10 },
    { id: 'bank_crisis', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { gold: 0.15, sp500: -0.10, btc: 0.08, reit: -0.12 }, sentiment: -25 },

    // 新增 V2.35 扩展新闻
    // 生物科技
    { id: 'fda_approval', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { biotech: 0.30, sp500: 0.02 }, sentiment: 15 },
    { id: 'drug_trial_fail', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { biotech: -0.25, sp500: -0.01 }, sentiment: -10 },

    // 房地产
    { id: 'housing_bubble_burst', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { reit: -0.20, sp500: -0.05, gold: 0.05 }, sentiment: -20 },
    { id: 'interest_rate_hike', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { reit: -0.10, tech_giant: -0.08, gold: -0.05 }, sentiment: -15 }, // 加息打击地产和科技

    // Crypto 扩展
    { id: 'solana_network_outage', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { solana: -0.15, eth: 0.02 }, sentiment: -5 },
    { id: 'defi_hack', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { solana: -0.08, eth: -0.05, btc: -0.02 }, sentiment: -10 },

    // 更多宏观
    { id: 'pandemic_scare', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { biotech: 0.20, sp500: -0.12, reit: -0.05, gold: 0.10, work_from_home_bonus: true }, sentiment: -30 },
    { id: 'trade_war', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { tech_giant: -0.15, sp500: -0.08, gold: 0.08 }, sentiment: -20 },
    { id: 'election_year', get title() { return getNewsText(this.id).title; }, get description() { return getNewsText(this.id).description; }, effect: { sp500: 0.05, energy: 0.05, defense_bonus: true }, sentiment: 10 },
];

export const usaFeatures = {
    // 小费文化
    tipRate: 0.18,  // 18% 服务费/小费
    // 消费税
    salesTaxRate: 0.08,  // 8% 消费税
    // 薪资税务 (发薪时扣除)
    taxRates: {
        federal: 0.12,      // 联邦税 12%
        state: 0.05,        // 州税 5%
        socialSecurity: 0.062, // 社保 6.2%
        medicare: 0.0145,   // 医保 1.45%
        // 总计约 24.85%
    },
    // 医疗费用 (天价!)
    medicalCosts: {
        ambulance: 2500,        // 叫救护车
        emergencyRoom: 3000,    // 急诊室
        doctorVisit: 200,       // 普通门诊
        prescription: 150,      // 处方药
        deductible: 500,        // 保险自付额
    },
    // 信用分影响阈值
    creditThresholds: {
        cannotRentGoodHousing: 600,  // 低于此分无法租好房
        cannotGetGoodJob: 500,       // 低于此分无法获得好工作
    },
    // 逾期惩罚
    latePenalty: {
        creditScoreDrop: 50,  // 逾期一次扣信用分
    }
};

export const lunchOptions = {
    bento: {
        id: 'bento',
        name: () => I18n.t('data.lunch.bento.name'),
        hint: (cfg) => I18n.t('data.lunch.bento.hint', cfg),
        cost: 0,
        healthEffect: 5,
        energyEffect: 10,
        mentalEffect: 10,
        condition: (state) => state.hasPreparedMeal
    },
    fastfood: {
        id: 'fastfood',
        name: () => I18n.t('data.lunch.fastfood.name'),
        hint: (cfg) => I18n.t('data.lunch.fastfood.hint', cfg),
        cost: 15,
        healthEffect: -4,
        mentalEffect: 5,
        condition: (state) => true
    },
    skip: {
        id: 'skip',
        name: () => I18n.t('data.lunch.skip.name'),
        hint: (cfg) => I18n.t('data.lunch.skip.hint', cfg),
        cost: 0,
        healthEffect: -5,
        condition: (state) => true
    },
    business: {
        id: 'business',
        name: () => I18n.t('data.lunch.business.name'),
        hint: (cfg) => I18n.t('data.lunch.business.hint', cfg),
        cost: 60,
        healthEffect: 0,
        mentalEffect: 10,
        socialEffect: 5,
        condition: (state) => state.job === 'fulltime'
    },
    salad: {
        id: 'salad',
        name: () => I18n.t('data.lunch.salad.name'),
        hint: (cfg) => I18n.t('data.lunch.salad.hint', cfg),
        cost: 12,
        healthEffect: 2,
        energyEffect: 5,
        condition: (state) => true
    },
    sandwich: {
        id: 'sandwich',
        name: () => I18n.t('data.lunch.sandwich.name'),
        hint: (cfg) => I18n.t('data.lunch.sandwich.hint', cfg),
        cost: 6,
        healthEffect: 0,
        energyEffect: 5,
        condition: (state) => true
    },
    hospital_cafeteria: {
        id: 'hospital_cafeteria',
        name: () => I18n.t('data.lunch.hospital_cafeteria.name'),
        hint: (cfg) => I18n.t('data.lunch.hospital_cafeteria.hint', cfg),
        cost: 10,
        healthEffect: 1,
        energyEffect: 3,
        condition: (state) => state.hospitalDaysLeft > 0
    }
};

export const commuteOptions = {
    car: {
        id: 'car',
        name: () => I18n.t('data.commute.car.name'),
        hint: (opt) => I18n.t('data.commute.car.hint', opt),
        cost: 0,
        lateChance: 0,
        healthEffect: 0,
        condition: (state) => state.hasCar
    },
    bus: {
        id: 'bus',
        name: () => I18n.t('data.commute.bus.name'),
        hint: (opt) => I18n.t('data.commute.bus.hint', opt),
        cost: 5,
        lateChance: 0.2,
        healthEffect: 0,
        condition: (state) => true
    },
    walk: {
        id: 'walk',
        name: () => I18n.t('data.commute.walk.name'),
        hint: (opt) => I18n.t('data.commute.walk.hint', opt),
        cost: 0,
        lateChance: 1.0,
        healthEffect: 5,
        condition: (state) => true
    },
    hospital_stay: {
        id: 'hospital_stay',
        name: () => I18n.t('data.commute.hospital_stay.name'),
        hint: (opt) => I18n.t('data.commute.hospital_stay.hint', opt),
        cost: 0,
        lateChance: 0,
        healthEffect: 0,
        condition: (state) => state.hospitalDaysLeft > 0
    }
};

export const periods = {
    day: {
        id: 'day',
        name: () => I18n.t('data.periods.day.name'),
        icon: '☀️',
        next: 'night',
        description: () => I18n.t('data.periods.day.description')
    },
    night: {
        id: 'night',
        name: () => I18n.t('data.periods.night.name'),
        icon: '🌙',
        next: 'deep_night',
        description: () => I18n.t('data.periods.night.description'),
    },
    deep_night: {
        id: 'deep_night',
        name: () => I18n.t('data.periods.deep_night.name'),
        icon: '🌌',
        next: 'day',
        description: () => I18n.t('data.periods.deep_night.description'),
        isLast: true  // 一天的最后一个时段
    },
};

export const housingTypes = {
    apartment: {
        name: () => I18n.t('data.housing.apartment.name'),
        icon: '🏢',
        description: () => I18n.t('data.housing.apartment.description'),
        cost: 1000,              // 10天周期
        energyRecovery: 40,
        mentalBonus: 2,
        healthBonus: 0
    },
    cheapRoom: {
        name: () => I18n.t('data.housing.cheapRoom.name'),
        icon: '🛏️',
        description: () => I18n.t('data.housing.cheapRoom.description'),
        cost: 500,              // 10天周期
        energyRecovery: 25,
        mentalBonus: -3,
        healthBonus: -2
    },
    car: {
        name: () => I18n.t('data.housing.car.name'),
        icon: '🚗',
        description: () => I18n.t('data.housing.car.description'),
        cost: 0,
        energyRecovery: 15,
        mentalBonus: -10,
        healthBonus: -8
    },
    homeless: {
        name: () => I18n.t('data.housing.homeless.name'),
        icon: '🌉',
        description: () => I18n.t('data.housing.homeless.description'),
        cost: 0,
        energyRecovery: 5,
        mentalBonus: -15,
        healthBonus: -12
    },
};

export const jobTypes = {
    fulltime: { name: () => I18n.t('data.jobs.fulltime.name'), income: 1400, hasInsurance: true, energyCost: 30 },
    parttime: { name: () => I18n.t('data.jobs.parttime.name'), income: 800, hasInsurance: false, energyCost: 20 },
    gig: { name: () => I18n.t('data.jobs.gig.name'), income: 500, hasInsurance: false, energyCost: 25 },
    unemployed: { name: () => I18n.t('data.jobs.unemployed.name'), income: 0, hasInsurance: false, energyCost: 0 },
    fired: { name: () => I18n.t('data.jobs.fired.name'), income: 0, hasInsurance: false, energyCost: 0 },
};

export const eventTypes = {
    layoff: { icon: '🔴', name: () => I18n.t('data.eventTypes.layoff'), color: '#ff4757' },
    bill: { icon: '🟠', name: () => I18n.t('data.eventTypes.bill'), color: '#ffa502' },
    accident: { icon: '🟡', name: () => I18n.t('data.eventTypes.accident'), color: '#ffd700' },
    opportunity: { icon: '🟢', name: () => I18n.t('data.eventTypes.opportunity'), color: '#2ed573' },
    daily: { icon: '📋', name: () => I18n.t('data.eventTypes.daily'), color: '#a29bfe' },
    health: { icon: '🏥', name: () => I18n.t('data.eventTypes.health'), color: '#ff6b6b' },
    night: { icon: '🌙', name: () => I18n.t('data.eventTypes.night'), color: '#a29bfe' },
    work: { icon: '💼', name: () => I18n.t('data.eventTypes.work'), color: '#74b9ff' },
    system: { icon: '⚙️', name: () => I18n.t('data.eventTypes.system'), color: '#8888a0' },
    special: { icon: '🎁', name: () => I18n.t('data.eventTypes.opportunity'), color: '#2ed573' },
};

export const medicalSystem = {
    // 就医选项
    treatmentOptions: {
        minuteClinic: { // 分钟诊所
            id: 'minuteClinic',
            name: () => I18n.t('data.medicalSystem.treatmentOptions.minuteClinic.name'),
            baseCost: 50,
            waitDays: 0,
            effectiveness: 15,
            risk: 0.05, // 5% 误诊
            failHealthLoss: 5, // 误诊时健康损失
            networkRisk: 0, // 一般都收
            description: () => I18n.t('data.medicalSystem.treatmentOptions.minuteClinic.description')
        },
        urgentCare: { // 急救中心
            id: 'urgentCare',
            name: () => I18n.t('data.medicalSystem.treatmentOptions.urgentCare.name'),
            baseCost: 250,
            waitDays: 0, // 当天
            effectiveness: 30,
            risk: 0.1,  // 10% 无法处理转ER
            networkRisk: 0.2, // 20% 几率是网外 (Out-of-Network)
            description: () => I18n.t('data.medicalSystem.treatmentOptions.urgentCare.description')
        },
        pcp: { // 家庭医生
            id: 'pcp',
            name: () => I18n.t('data.medicalSystem.treatmentOptions.pcp.name'),
            baseCost: 150, // 初诊费
            waitDays: 5,   // 平均等5天 (白卡等14天)
            effectiveness: 50,
            risk: 0,
            networkRisk: 0, // 预约时通常会确认
            description: () => I18n.t('data.medicalSystem.treatmentOptions.pcp.description')
        },
        er: { // 急诊室
            id: 'er',
            name: () => I18n.t('data.medicalSystem.treatmentOptions.er.name'),
            baseCost: 3000,
            waitDays: 0,
            effectiveness: 100, // 救命
            risk: 0,
            networkRisk: 0.1, // 10% 几率遇到网外医生
            denialRisk: 0.15, // 15% 几率被保险公司拒赔 (非紧急)
            description: () => I18n.t('data.medicalSystem.treatmentOptions.er.description')
        },
        otc: { // 药店买药
            id: 'otc',
            name: () => I18n.t('data.medicalSystem.treatmentOptions.otc.name'),
            baseCost: 15,
            waitDays: 0,
            effectiveness: 5,
            risk: 0.3, // 30% 无效
            description: () => I18n.t('data.medicalSystem.treatmentOptions.otc.description')
        }
    },

    // 疾病状态定义 (斩杀链)
    healthStages: {
        normal: { threshold: 70, energyMod: 1.0, name: () => I18n.t('data.medicalSystem.healthStages.normal') },
        sick_minor: { threshold: 50, energyMod: 0.8, name: () => I18n.t('data.medicalSystem.healthStages.sick_minor') },     // 轻微
        sick_moderate: { threshold: 30, energyMod: 0.6, name: () => I18n.t('data.medicalSystem.healthStages.sick_moderate') },  // 中度
        sick_severe: { threshold: 0, energyMod: 0.4, name: () => I18n.t('data.medicalSystem.healthStages.sick_severe') }      // 重度
    }
};

export const mealSystem = {
    fastFood: {
        name: () => I18n.t('data.meals.fastFood.name'),
        cost: 15,
        health: -2,
        mental: +5,
        energy: 0,
        time: 0  // 省时间
    },
    homeCook: {
        name: () => I18n.t('data.meals.homeCook.name'),
        cost: 8,
        health: +5,
        mental: +3,
        energy: -15,
        time: 30  // 30分钟
    },
    restaurant: {
        name: () => I18n.t('data.meals.restaurant.name'),
        cost: 60,
        health: +3,
        mental: +15,
        energy: 0,
        social: +5
    },
    skip: {
        name: () => I18n.t('data.meals.skip.name'),
        cost: 0,
        health: -10,
        mental: -8,
        energy: -5
    },
    convenience: {
        name: () => I18n.t('data.meals.convenience.name'),
        cost: 10,
        health: 0,
        mental: -2,
        energy: 0
    }
};

export const healthStatuses = {
    normal: {
        name: () => I18n.t('data.healthStatus.normal.name'),
        energyPenalty: 0,
        workEfficiency: 1.0
    },
    cold: {
        name: () => I18n.t('data.healthStatus.cold.name'),
        energyPenalty: 20,
        workEfficiency: 0.9
    },
    sick: {
        name: () => I18n.t('data.healthStatus.sick.name'),
        energyPenalty: 40,
        workEfficiency: 0.7
    },
    critical: {
        name: () => I18n.t('data.healthStatus.critical.name'),
        energyPenalty: 100,  // 无法工作
        workEfficiency: 0,
        dailyCost: 50
    }
};

export const healthConstants = {
    // 精力耗尽昏睡惩罚
    fainting: {
        maxMentalPenalty: 5,        // 精神上限永久减少值
        minMaxMental: 50,           // 精神上限最低值
        maxHealthPenalty: 5,        // 健康上限永久减少值
        minMaxHealth: 50,           // 健康上限最低值
    },
    // 住院系统参数
    hospitalization: {
        dailyBaseCost: 300,        // 每日住院基础费用
        ambulanceCost: 1000,        // 救护车费用
        dischargeHealthMin: 70,     // 出院所需最低健康值
        healthRecoveryMin: 10,      // 住院每日健康恢复最小值
        healthRecoveryMax: 20,      // 住院每日健康恢复最大值
        energyRecoveryPerDay: 20,   // 住院每日精力恢复 (带薪假)
        energyRecoveryRestDay: 10,  // 休息日住院精力恢复
        amaHealthMin: 50,           // 强行出院最低健康
        amaMentalPenalty: 20,       // 强行出院精神惩罚
        amaExtraCost: 500,          // 强行出院额外费用
        outOfPocketHealthGain: 10,  // 自费治疗健康恢复
    },
    // 医疗紧急情况参数
    medicalEmergency: {
        uberDeathChance: 0.2,       // 打车去急诊死亡概率
        uberCost: 200,               // Uber费用
        erHealthRecovery: 40,       // ER后健康恢复到
        ambulanceMentalLoss: 30     // 叫救护车精神损失
    }
};
