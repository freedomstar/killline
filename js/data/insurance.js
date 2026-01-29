/**
 * Insurance System Configuration
 */
import { I18n } from '../i18n.js';

export const insuranceSystem = {
    // 健康保险计划
    healthPlans: {
        // 雇主计划 (仅全职可用)
        employer_basic: {
            id: 'employer_basic',
            name: () => I18n.t('data.insuranceNames.employer_basic'),
            type: 'employer',
            monthlyPremium: 120,    // 员工自付部分 (大幅上涨)
            deductible: 3000,       // 免赔额 $3000
            coinsurance: 0.2,       // 个人承担 20%
            outOfPocketMax: 6500,   // 年度封顶
            copayDist: {            // 门诊挂号费 (不计入免赔额)
                doctor: 60,
                specialist: 90,
                er: 600
            },
            description: (premium, deductible) => I18n.t('data.insuranceDescriptions.employer_basic', premium, deductible)
        },
        employer_premium: {
            id: 'employer_premium',
            name: () => I18n.t('data.insuranceNames.employer_premium'),
            type: 'employer',
            monthlyPremium: 250,    // 涨价
            deductible: 1000,       // 免赔额 $1000
            coinsurance: 0.1,       // 个人承担 10%
            outOfPocketMax: 3000,
            copayDist: {
                doctor: 30,
                specialist: 50,
                er: 250
            },
            description: (premium) => I18n.t('data.insuranceDescriptions.employer_premium', premium)
        },
        // 市场计划 (人人可用)
        marketplace_bronze: {
            id: 'marketplace_bronze',
            name: () => I18n.t('data.insuranceNames.marketplace_bronze'),
            type: 'marketplace',
            monthlyPremium: 200,
            deductible: 6500,       // 极高免赔额
            coinsurance: 0.4,       // 个人承担 40%
            outOfPocketMax: 8500,
            copayDist: {
                doctor: 100, // 免赔额前全额，这只是参考
                specialist: 150,
                er: 1000
            },
            description: (premium, deductible) => I18n.t('data.insuranceDescriptions.marketplace_bronze', premium, deductible)
        },
        marketplace_silver: {
            id: 'marketplace_silver',
            name: () => I18n.t('data.insuranceNames.marketplace_silver'),
            type: 'marketplace',
            monthlyPremium: 550,
            deductible: 4500,
            coinsurance: 0.3,
            outOfPocketMax: 7800,
            description: (premium, deductible) => I18n.t('data.insuranceDescriptions.marketplace_silver', premium, deductible)
        },
        marketplace_gold: {
            id: 'marketplace_gold',
            name: () => I18n.t('data.insuranceNames.marketplace_gold'),
            type: 'marketplace',
            monthlyPremium: 800,
            deductible: 1500,
            coinsurance: 0.2,
            outOfPocketMax: 5000,
            description: (premium, deductible) => I18n.t('data.insuranceDescriptions.marketplace_gold', premium, deductible)
        },
        // 穷人保险 (需符合条件)
        medicaid: {
            id: 'medicaid',
            name: () => I18n.t('data.insuranceNames.medicaid'),
            type: 'government',
            monthlyPremium: 0,
            deductible: 0,
            coinsurance: 0,
            outOfPocketMax: 0,
            description: () => I18n.t('data.insuranceDescriptions.medicaid'),
            requirements: { maxAssets: 2000, employmentStatus: ['unemployed', 'fired'] }
        },
        none: {
            id: 'none',
            name: () => I18n.t('data.insuranceNames.none'),
            type: 'none',
            monthlyPremium: 0,
            deductible: 0,
            coinsurance: 1.0,       // 全额自付
            outOfPocketMax: 99999999,
            description: () => I18n.t('data.insuranceDescriptions.none')
        }
    },

    // 汽车保险
    carPlans: {
        liability: {
            id: 'liability',
            name: () => I18n.t('data.carInsuranceNames.liability'),
            monthlyPremium: 80,
            deductible: 1000, // 修自己车时无效
            description: () => I18n.t('data.carInsuranceDescriptions.liability')
        },
        full_coverage: {
            id: 'full_coverage',
            name: () => I18n.t('data.carInsuranceNames.full_coverage'),
            monthlyPremium: 200,
            deductible: 500, // 修车的免赔额
            description: (deductible) => I18n.t('data.carInsuranceDescriptions.full_coverage', deductible)
        },
        none: { // 非法，但在游戏中可选（有被抓风险）
            id: 'none',
            name: () => I18n.t('data.carInsuranceNames.none'),
            monthlyPremium: 0,
            description: () => I18n.t('data.carInsuranceDescriptions.none')
        }
    },

    // 租客保险
    rentersInsurance: {
        monthlyPremium: 15,
        deductible: 250,
        coverageValue: 10000, // 最高赔付额
        description: (cost) => I18n.t('data.rentersInsuranceDescription', cost)
    }
};
