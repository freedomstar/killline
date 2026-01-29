/**
 * 日常效果模块 - 精力、健康、住所等日常变化
 */
import { GameData } from '../data/index.js';
import { I18n } from '../i18n.js';

/**
 * 日常效果相关方法的 Mixin
 */
export const EffectsMixin = {
    /**
     * 应用待处理的精力变化
     */
    applyPendingEnergyChange() {
        if (this.pendingEnergyChange !== 0) {
            this.state.energy = Math.max(0, Math.min(100,
                this.state.energy + this.pendingEnergyChange));
            this.pendingEnergyChange = 0;
        }
    },

    /**
     * 睡眠恢复精力
     * V2.36 修复：熬夜时恢复效率降低为 50%，避免高端住所完全抵消熬夜惩罚
     */
    applySleepRecovery() {
        const housingInfo = GameData.housingTypes[this.state.housing];
        if (housingInfo) {
            let recoveryAmount = housingInfo.energyRecovery;

            // 如果昨晚没睡好（熬夜），恢复效率减半
            if (!this.state.sleptWell) {
                recoveryAmount = Math.floor(recoveryAmount * GameData.sleepConfig.poorSleepRecoveryMod);
            }

            this.state.energy = Math.min(100, this.state.energy + recoveryAmount);
        }
    },

    /**
     * 每日收入
     */
    applyDailyIncome() {
        const jobInfo = GameData.jobTypes[this.state.job];
        const baseIncome = jobInfo && jobInfo.income > 0
            ? (this.state.monthlyIncome || jobInfo.income)
            : 0;
        if (baseIncome > 0) {
            const dailyIncome = Math.floor(baseIncome / 30);
            this.state.money += dailyIncome;
        }
    },

    /**
     * 住所效果
     */
    applyHousingEffects() {
        const housingInfo = GameData.housingTypes[this.state.housing];
        if (housingInfo) {
            if (housingInfo.mentalBonus !== 0) {
                const max = this.state.maxMental || 100;
                this.state.mental = Math.max(0, Math.min(max,
                    this.state.mental + housingInfo.mentalBonus));
            }
            if (housingInfo.healthBonus !== 0) {
                this.state.health = Math.max(0, Math.min(100,
                    this.state.health + housingInfo.healthBonus));
            }
        }
    },

    /**
     * 更新失业状态
     */
    updateUnemploymentStatus() {
        if (this.state.job === 'unemployed' || this.state.job === 'fired') {
            this.state.unemployedDays++;
        } else {
            this.state.unemployedDays = 0;
        }
    },

    /**
     * 更新健康状态
     */
    updateHealthStatus() {
        const health = this.state.health;

        if (health > 85) {
            this.state.healthStatus = 'normal';
        } else if (health >= 60) {
            this.state.healthStatus = 'cold';
        } else if (health >= 30) {
            this.state.healthStatus = 'sick';
        } else {
            this.state.healthStatus = 'critical';
        }

        // V2.20 斩杀链逻辑：生病降低属性恢复
        const stage = GameData.medicalSystem.healthStages[health < 30 ? 'sick_severe' : (health < 60 ? 'sick_moderate' : (health <= 85 ? 'sick_minor' : 'normal'))];
        // 实际上这里应该修改 housing effect 的计算，或者直接在这里施加惩罚
        // 为了简单，我们直接修改 energy (如果已恢复过，再扣除一部分作为惩罚)
        // 或者在 applySleepRecovery 中引用 healthStatus。
        // 这里采用简单的后扣除法：
        if (stage && stage.energyMod < 1.0) {
            // 假设正常恢复了 X，现在扣除 (1-mod) * X ? 
            // 简化：直接扣除固定精力作为生病惩罚
            const penalty = Math.round(GameData.sicknessConfig.energyPenaltyBase * (1 - stage.energyMod));
            if (penalty > 0) {
                this.state.energy = Math.max(0, this.state.energy - penalty);
                // console.log(`[Health] 生病惩罚: 精力 -${penalty}`);
            }
        }

        // 失去工作会失去雇主保险
        if (this.state.job === 'unemployed' || this.state.job === 'fired') {
            // 检查当前是否是雇主保险
            const planId = this.state.insurance.healthPlanId;
            if (planId === 'employer_basic' || planId === 'employer_premium') {
                this.state.insurance.healthPlanId = 'none';
                console.log('[Game] 失去工作，雇主保险失效');
            }
        } else if (this.state.job === 'fulltime') {
            // 如果找到工作且当前没有保险，自动获得雇主保险 (简化逻辑)
            if (this.state.insurance.healthPlanId === 'none') {
                this.state.insurance.healthPlanId = 'employer_basic';
                console.log('[Game] 获得全职工作，自动加入雇主基础医保');
            }
        }
    },

    /**
     * Social Effect - Chain Reaction for low social status
     * V2.35 社交值过低导致连锁斩杀
     */
    applySocialEffects() {
        const config = GameData.socialCollapseConfig;
        // Prevent crashes if socialValue is undefined
        const social = typeof this.state.socialValue === 'number' ? this.state.socialValue : 50;

        if (social <= config.criticalThreshold) {
            // Social Death Phase: Critical Chain Reaction
            // 1. Health Collapse (Ignoring self)
            const healthPen = config.criticalHealthPen;
            this.state.health = Math.max(0, this.state.health - healthPen);

            // 2. Mental Collapse (Total isolation)
            const mentalPen = config.criticalMentalPen;
            this.state.mental = Math.max(0, this.state.mental - mentalPen);

            // 3. Career Suicide (Social Anxiety leading to poor performance)
            const workPen = config.criticalWorkPen;
            if (!this.state.workEfficiency) this.state.workEfficiency = 100;
            this.state.workEfficiency = Math.max(0, this.state.workEfficiency - workPen);

            // Log events
            this.state.dailyFinancialReport.push(I18n.t('game.finance.socialDeath', healthPen, mentalPen));
            this.state.dailyFinancialReport.push(I18n.t('game.finance.socialJobImpact', workPen));

            console.log(`[Social] CRITICAL: Social value ${social}. Triggering chain reaction.`);

        } else if (social < config.warningThreshold) {
            // Isolation Phase: Warning
            const mentalPen = social < 10 ? config.warningSevereMentalPen : config.warningMentalPen;
            this.state.mental = Math.max(0, this.state.mental - mentalPen);

            this.state.dailyFinancialReport.push(I18n.t('game.finance.socialIsolation', mentalPen));
            console.log(`[Social] Warning: Social value ${social}. Isolation penalty applied.`);
        }
    }
};
