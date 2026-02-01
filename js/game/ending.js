/**
 * 结局模块 - 游戏结束检测与结局触发
 */
import { GameData } from '../data/index.js';
import { I18n } from '../i18n.js';

/**
 * 结局相关方法的 Mixin
 */
export const EndingMixin = {
    /**
     * V2.14 检查游戏结束条件
     */
    checkGameOver() {
        // 统一使用 checkEnding 的逻辑
        return this.checkEnding();
    },

    /**
     * V2.14 触发结局
     * 现在返回结局对象，不再直接调用 UI
     */
    triggerEnding(endingId) {
        const rawEnding = GameData.endings[endingId];
        if (!rawEnding) return null;

        // V2.10 使用 I18n 本地化结局文本
        return {
            ...rawEnding,
            title: I18n.t(`data.config.endings.${endingId}.title`),
            subtitle: I18n.t(`data.config.endings.${endingId}.subtitle`),
            message: I18n.t(`data.config.endings.${endingId}.message`)
        };
    },

    /**
     * 检查结局 (Modified to call triggerEnding which returns object)
     */
    checkEnding() {
        // 1. 深度破产 (连锁斩杀结局)
        if (this.state.money < GameData.endingRules.debtSpiralThreshold) {
            console.log('[Game] 触发结局: 深度破产 (债务螺旋)');
            this.isRunning = false;
            return this.triggerEnding('debtSpiral');
        }

        // 胜利：存活365天
        if (this.state.day >= GameData.endingRules.survivalDays) {
            this.isRunning = false;
            return this.triggerEnding('survived');
        }

        // 5. 财务自由
        if (this.state.money >= GameData.endingRules.wealthThreshold) {
            this.isRunning = false;
            return this.triggerEnding('financialFreedom');
        }

        // V2.5 健康归零 - 触发天价医疗费用
        if (this.state.health <= GameData.endingRules.criticalHealth) {
            // 计算基础医疗费用
            const medCosts = GameData.usaFeatures.medicalCosts;
            const baseCost = medCosts.ambulance + medCosts.emergencyRoom;

            // V2.6 使用新的保险计算逻辑
            const costResult = this.calculateMedicalCost ? this.calculateMedicalCost(baseCost) : { youPay: baseCost, planName: 'None', breakdown: 'Basic' };

            // 产生医疗债务/扣款
            this.state.money -= costResult.youPay;
            if (this.state.money < 0) {
                this.state.medicalDebt += costResult.youPay; // 欠款
            }

            // 急救后恢复一点健康，但代价惨重
            this.state.health = GameData.endingRules.emergencyHealthRestore;

            console.log(`[Game] 🚑 紧急送医！总费: $${baseCost}`);
            console.log(`[Game] 保险: ${costResult.planName} | 自付: $${costResult.youPay} (${costResult.breakdown})`);

            if (!this.state.dailyFinancialReport) this.state.dailyFinancialReport = [];
            this.state.dailyFinancialReport.push(`🚑 紧急送医自付: -$${costResult.youPay}`);

            // 如果医疗费导致严重负债，才触发结局
            if (this.state.money < GameData.endingRules.debtSpiralThreshold && this.state.medicalDebt > GameData.endingRules.medicalDebtThreshold) { // 稍微放宽一点
                this.isRunning = false;
                return this.triggerEnding('healthCollapse');
            }

            // 否则只是产生巨额负债，游戏继续
            return null;
        }

        // 精神崩溃
        if (this.state.mental <= GameData.endingRules.criticalMental) {
            this.isRunning = false;
            return this.triggerEnding('mentalBreakdown');
        }

        // 精力长期为0 + 健康低
        if (this.state.energy <= GameData.endingRules.criticalEnergy && this.state.health < GameData.endingRules.exhaustionHealthThreshold) {
            this.isRunning = false;
            return this.triggerEnding('exhaustion');
        }

        // 破产 + 无收入
        if (this.state.money <= GameData.endingRules.noMoney &&
            (this.state.job === 'unemployed' || this.state.job === 'fired') &&
            this.state.creditScore < GameData.endingRules.bankruptCreditScore) {
            this.isRunning = false;
            return this.triggerEnding('bankrupt');
        }

        // 流浪太久
        if (this.state.housing === 'homeless' && this.state.unemployedDays > GameData.endingRules.homelessUnemployedDays) {
            this.isRunning = false;
            return this.triggerEnding('homeless');
        }

        return null;
    }
};
