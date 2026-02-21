/**
 * 日常效果模块 - 精力、健康、住所等日常变化
 */
import { GameData } from '../data/index.js';
import { I18n } from '../i18n.js';
import { processArtifactReactions } from '../data/artifacts.js';

/**
 * 日常效果相关方法的 Mixin
 */
export const EffectsMixin = {
    /**
     * 应用待处理的精力变化
     */
    applyPendingEnergyChange() {
        const pendingRaw = this.pendingEnergyChange || 0;

        this._dailyEnergyRecoveryParts = {
            dayStartEnergy: this.state.energy,
            pendingRaw,
            pendingApplied: pendingRaw
        };
        this.pendingEnergyChange = 0;
    },

    /**
     * 睡眠恢复精力
     * V2.36 修复：熬夜时恢复效率降低为 60%，避免高端住所完全抵消熬夜惩罚
     */
    applySleepRecovery() {
        const parts = this._dailyEnergyRecoveryParts || {
            dayStartEnergy: this.state.energy,
            pendingRaw: 0,
            pendingApplied: 0
        };
        const housingInfo = GameData.housingTypes[this.state.housing];
        if (housingInfo) {
            const baseRecovery = housingInfo.energyRecovery;
            const sleepMod = this.state.sleptWell ? 1 : GameData.sleepConfig.poorSleepRecoveryMod;
            const recoveryAmount = Math.floor(baseRecovery * sleepMod);

            parts.baseRecovery = baseRecovery;
            parts.sleepMod = sleepMod;
            parts.theoreticalRecovery = recoveryAmount;
            parts.housingApplied = recoveryAmount;
            parts.hasRecoveryBreakdown = true;
            this._dailyEnergyRecoveryParts = parts;
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
        let healthPenalty = 0;
        if (stage && stage.energyMod < 1.0) {
            // 假设正常恢复了 X，现在扣除 (1-mod) * X ? 
            // 简化：直接扣除固定精力作为生病惩罚
            healthPenalty = Math.round(GameData.sicknessConfig.energyPenaltyBase * (1 - stage.energyMod));
        }

        const parts = this._dailyEnergyRecoveryParts;
        if (parts && parts.hasRecoveryBreakdown) {
            const dayStartEnergy = parts.dayStartEnergy ?? this.state.energy;
            const statusAdjustment = -healthPenalty;
            const rawTotal = (parts.pendingRaw || 0) + (parts.theoreticalRecovery || 0) + statusAdjustment;
            const nextEnergy = Math.max(0, Math.min(100, dayStartEnergy + rawTotal));
            const totalApplied = nextEnergy - dayStartEnergy;
            this.state.energy = nextEnergy;

            const msg = I18n.t(
                'game.finance.energyRecoveryBreakdown',
                parts.pendingApplied,
                parts.pendingRaw,
                parts.theoreticalRecovery || 0,
                parts.baseRecovery || 0,
                parts.sleepMod || 1,
                parts.theoreticalRecovery || 0,
                GameData.sicknessConfig.energyPenaltyBase,
                healthPenalty,
                stage ? stage.energyMod : 1,
                stage && typeof stage.name === 'function' ? stage.name() : '',
                statusAdjustment,
                totalApplied
            );
            this.pushDailyReport && this.pushDailyReport({
                key: 'game.finance.energyRecoveryBreakdown',
                args: [
                    parts.pendingApplied,
                    parts.pendingRaw,
                    parts.theoreticalRecovery || 0,
                    parts.baseRecovery || 0,
                    parts.sleepMod || 1,
                    parts.theoreticalRecovery || 0,
                    GameData.sicknessConfig.energyPenaltyBase,
                    healthPenalty,
                    stage ? stage.energyMod : 1,
                    stage && typeof stage.name === 'function' ? stage.name() : '',
                    statusAdjustment,
                    totalApplied
                ],
                fallback: msg
            });
        } else if (healthPenalty > 0) {
            this.state.energy = Math.max(0, this.state.energy - healthPenalty);
        }
        this._dailyEnergyRecoveryParts = null;

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
            const healthPen = config.criticalHealthPen;
            const mentalPen = config.criticalMentalPen;
            const workPen = config.criticalWorkPen;

            // V2.XX: 使用 processArtifactReactions 处理健康和精神损失
            const res = processArtifactReactions(this.state, {
                health: -healthPen,
                mental: -mentalPen
            }, 'social_death');

            const actualHealthLoss = Math.abs(res.totalDelta.health || -healthPen);
            const actualMentalLoss = Math.abs(res.totalDelta.mental || -mentalPen);

            // 3. Career Suicide (Social Anxiety leading to poor performance)
            if (!this.state.workEfficiency) this.state.workEfficiency = 100;
            this.state.workEfficiency = Math.max(0, this.state.workEfficiency - workPen);

            // Log events
            this.pushDailyReport && this.pushDailyReport({ key: 'game.finance.socialDeath', args: [actualHealthLoss, actualMentalLoss], fallback: I18n.t('game.finance.socialDeath', actualHealthLoss, actualMentalLoss) });
            this.pushDailyReport && this.pushDailyReport({ key: 'game.finance.socialJobImpact', args: [workPen], fallback: I18n.t('game.finance.socialJobImpact', workPen) });

            // 记录神器的联动消息
            if (res.logs) {
                res.logs.forEach(log => {
                    this.pushDailyReport && this.pushDailyReport({ text: log });
                });
            }

            console.log(`[Social] CRITICAL: Social value ${social}. Triggering chain reaction.`);

            // UI 反馈
            if (res.layers && res.layers.length > 0 && window.UI && window.UI.showChainedArtifactEffects) {
                window.UI.showChainedArtifactEffects(res.layers, 500);
            }
            if (res.totalDelta && window.UI && window.UI.triggerAttributeShake) {
                window.UI.triggerAttributeShake(res.totalDelta);
            }

        } else if (social < config.warningThreshold) {
            // Isolation Phase: Warning
            const mentalPen = social < 10 ? config.warningSevereMentalPen : config.warningMentalPen;

            // V2.XX: 使用 processArtifactReactions 处理精神损失
            const res = processArtifactReactions(this.state, { mental: -mentalPen }, 'social_isolation');
            const actualMentalLoss = Math.abs(res.totalDelta.mental || -mentalPen);

            this.pushDailyReport && this.pushDailyReport({ key: 'game.finance.socialIsolation', args: [actualMentalLoss], fallback: I18n.t('game.finance.socialIsolation', actualMentalLoss) });

            // 记录神器的联动消息
            if (res.logs) {
                res.logs.forEach(log => {
                    this.pushDailyReport && this.pushDailyReport({ text: log });
                });
            }

            console.log(`[Social] Warning: Social value ${social}. Isolation penalty applied.`);

            // UI 反馈
            if (res.layers && res.layers.length > 0 && window.UI && window.UI.showChainedArtifactEffects) {
                window.UI.showChainedArtifactEffects(res.layers, 500);
            }
            if (res.totalDelta && window.UI && window.UI.triggerAttributeShake) {
                window.UI.triggerAttributeShake(res.totalDelta);
            }
        }
    }
};
