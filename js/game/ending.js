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
        // V2.XX: Ensure triggeredEndings is initialized (compatibility for old saves)
        if (!this.state.triggeredEndings) {
            this.state.triggeredEndings = [];
        }

        // V2.XX 优先检查强制结束标志 (如医疗紧急情况点“放弃”)
        if (this.state.forcedGameOver) {
            console.log('[Game] 触发强制结局 (玩家选择放弃或致死判定)');
            this.state.forcedGameOver = false; // 重置，防止循环触发
            this.isRunning = false;
            return this.triggerEnding('healthCollapse');
        }

        // 1. 破产 (Debt > Threshold)
        if (this.state.debt > GameData.endingRules.debtSpiralThreshold) {
            console.log('[Game] 触发结局: 深度破产 (债务螺旋)');
            this.isRunning = false;
            return this.triggerEnding('debtSpiral');
        }

        // 5. 财务自由
        if (this.state.money >= GameData.endingRules.wealthThreshold) {
            if (!this.state.triggeredEndings.includes('financialFreedom')) {
                this.state.triggeredEndings.push('financialFreedom');
                this.isRunning = false;
                return this.triggerEnding('financialFreedom');
            }
        }


        // V2.5 健康归零 - 直接触发结局
        if (this.state.health <= GameData.endingRules.criticalHealth) {
            console.log('[Game] 触发结局: 健康崩溃');
            this.isRunning = false;
            return this.triggerEnding('healthCollapse');
        }

        // 精神崩溃
        if (this.state.mental <= GameData.endingRules.criticalMental) {
            this.isRunning = false;
            return this.triggerEnding('mentalBreakdown');
        }



        // 破产 + 无收入 + 债务
        // if (this.state.money <= GameData.endingRules.noMoney &&
        //     (this.state.job === 'unemployed' || this.state.job === 'fired') &&
        //     (this.state.debt || 0) > 0) {
        //     this.isRunning = false;
        //     return this.triggerEnding('bankrupt');
        // }

        // 流浪太久
        if (this.state.housing === 'homeless' && this.state.unemployedDays > GameData.endingRules.homelessUnemployedDays) {
            this.isRunning = false;
            return this.triggerEnding('homeless');
        }

        // 胜利：存活一年 (放在最后检查，防止与其他结局冲突)
        if (this.state.day >= GameData.endingRules.survivalDays) {
            if (!this.state.triggeredEndings.includes('survived')) {
                this.state.triggeredEndings.push('survived');
                this.isRunning = false;
                return this.triggerEnding('survived');
            }
        }

        return null;
    }
};
