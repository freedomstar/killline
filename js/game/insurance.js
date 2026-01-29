/**
 * 保险/医疗模块 - 保险账单与医疗费用计算
 */
import { GameData } from '../data/index.js';

/**
 * 保险相关方法的 Mixin
 */
export const InsuranceMixin = {
    /**
     * V2.6 处理保险账单与计划变更
     */
    processInsuranceBilling() {
        // 1. 处理计划变更 (下月生效)
        if (this.state.insurance.pendingHealthPlanId) {
            const oldPlanId = this.state.insurance.healthPlanId;
            const newPlanId = this.state.insurance.pendingHealthPlanId;

            this.state.insurance.healthPlanId = newPlanId;
            this.state.insurance.pendingHealthPlanId = null;

            // 惩罚：免赔额清零 (除非是年初，这里简化为只要换就清零)
            this.state.insurance.healthDeductiblePaid = 0;
            this.state.insurance.healthOutOfPocketPaid = 0;

            const healthPlanName = typeof GameData.insuranceSystem.healthPlans[newPlanId].name === 'function' ? GameData.insuranceSystem.healthPlans[newPlanId].name() : GameData.insuranceSystem.healthPlans[newPlanId].name;
            const msg = `📋 保险计划已变更为: ${healthPlanName}`;
            this.state.dailyFinancialReport.push(msg);
            console.log(`[Game] ${msg}`);
        }

        // V2.24 处理车险计划变更 (下月生效)
        if (this.state.insurance.pendingCarPlanId) {
            const newPlanId = this.state.insurance.pendingCarPlanId;
            // 只有当新计划与当前不同时才变更 (防止冗余)
            if (newPlanId !== this.state.insurance.carPlanId) {
                this.state.insurance.carPlanId = newPlanId;
                const carPlanName = typeof GameData.insuranceSystem.carPlans[newPlanId].name === 'function' ? GameData.insuranceSystem.carPlans[newPlanId].name() : GameData.insuranceSystem.carPlans[newPlanId].name;
                const msg = `🚗 车险计划已变更为: ${carPlanName}`;
                this.state.dailyFinancialReport.push(msg);
                console.log(`[Game] ${msg}`);
            }
            this.state.insurance.pendingCarPlanId = null;
        }

        // V2.24 处理租客险变更 (下月生效)
        if (this.state.insurance.pendingRentersStatus !== null) {
            const newStatus = this.state.insurance.pendingRentersStatus;
            if (newStatus !== this.state.insurance.hasRentersInsurance) {
                this.state.insurance.hasRentersInsurance = newStatus;
                const msg = newStatus ? `🏠 租客保险已生效` : `🏠 租客保险已退订`;
                this.state.dailyFinancialReport.push(msg);
                console.log(`[Game] ${msg}`);
            }
            this.state.insurance.pendingRentersStatus = null;
        }

        let totalPremium = 0;
        const report = [];

        // 2. 健康保险费
        const healthPlan = GameData.insuranceSystem.healthPlans[this.state.insurance.healthPlanId];
        if (healthPlan && healthPlan.monthlyPremium > 0) {
            totalPremium += healthPlan.monthlyPremium;
            const healthName = typeof healthPlan.name === 'function' ? healthPlan.name() : healthPlan.name;
            report.push(`医保(${healthName}): -$${healthPlan.monthlyPremium}`);
        }

        // 3. 汽车保险费
        if (this.state.hasCar) {
            const carPlan = GameData.insuranceSystem.carPlans[this.state.insurance.carPlanId];
            if (carPlan && carPlan.monthlyPremium > 0) {
                totalPremium += carPlan.monthlyPremium;
                const carName = typeof carPlan.name === 'function' ? carPlan.name() : carPlan.name;
                report.push(`车险(${carName}): -$${carPlan.monthlyPremium}`);
            }
        }

        // 4. 租客保险费
        if (this.state.insurance.hasRentersInsurance) {
            const rentIns = GameData.insuranceSystem.rentersInsurance;
            totalPremium += rentIns.monthlyPremium;
            report.push(`租客险: -$${rentIns.monthlyPremium}`);
        }

        // 扣款
        if (totalPremium > 0) {
            this.state.money -= totalPremium;
            this.state.carInsurancePaid = true; // 标记已支付
            const summary = `🛡️ 支付保险月费: -$${totalPremium}`;
            this.state.dailyFinancialReport.push(summary);
            console.log(`[Game] ${summary}`, report);
        }
    },

    /**
     * 计算下次保险账单费用 (健康+汽车+租客)
     * 优先使用待生效的计划，显示下次缴费金额
     */
    calculateMonthlyInsuranceCost() {
        return this.calculateMonthlyInsuranceCostForState(this.state);
    },

    /**
     * 根据指定 state 计算下次保险账单费用 (用于 UI 预览)
     */
    calculateMonthlyInsuranceCostForState(state) {
        let total = 0;
        const ins = state.insurance;

        // 1. 健康保险 (优先使用待生效计划)
        const healthPlanId = ins.pendingHealthPlanId || ins.healthPlanId;
        const healthPlan = GameData.insuranceSystem.healthPlans[healthPlanId];
        if (healthPlan && healthPlan.monthlyPremium > 0) {
            total += healthPlan.monthlyPremium;
        }

        // 2. 汽车保险 (优先使用待生效计划)
        if (state.hasCar) {
            const carPlanId = ins.pendingCarPlanId || ins.carPlanId;
            const carPlan = GameData.insuranceSystem.carPlans[carPlanId];
            if (carPlan && carPlan.monthlyPremium > 0) {
                total += carPlan.monthlyPremium;
            }
        }

        // 3. 租客保险 (优先使用待生效状态)
        const rentersActive = ins.pendingRentersStatus !== null ? ins.pendingRentersStatus : ins.hasRentersInsurance;
        if (rentersActive) {
            const rentIns = GameData.insuranceSystem.rentersInsurance;
            total += rentIns.monthlyPremium;
        }

        return total;
    },

    /**
     * V2.36 预判定医疗风险 (网外/拒赔)
     * 此函数应在事件生成阶段调用一次，结果存入 context 供后续使用
     * @param {number} baseCost 原始费用
     * @param {boolean} isEmergency 是否紧急
     * @returns {object} { isOutOfNetwork, isDenied, note }
     */
    rollMedicalRisk(baseCost, isEmergency = false) {
        const riskFactor = { isOutOfNetwork: false, isDenied: false, note: '' };

        // 判定网外 (Out-of-Network) - 仅紧急情况 20% 几率
        if (isEmergency && this.rng.random() < GameData.medicalRiskConfig.outOfNetworkChance) {
            riskFactor.isOutOfNetwork = true;
            riskFactor.note = '遭遇网外医生';
        }

        // 判定拒赔 (Denial) - 大额费用 10% 几率
        if (baseCost > GameData.medicalRiskConfig.denialCostThreshold && this.rng.random() < GameData.medicalRiskConfig.denialChance) {
            riskFactor.isDenied = true;
            riskFactor.note += (riskFactor.note ? ' ' : '') + '保险公司判定非紧急拒赔';
        }

        return riskFactor;
    },

    /**
     * V2.20 计算医疗费用 (核心：免赔额 + 网外风险 + 拒赔风险)
     * V2.36 重构：风险判定改为外部传入，确保 UI 预览与实际扣费一致
     * @param {number} baseCost 原始医疗费
     * @param {boolean} isEmergency 是否为紧急情况 (ER/UrgentCare)
     * @param {object} preRolledRisk 可选，预判定的风险结果 (来自 rollMedicalRisk)
     * @returns {object} { youPay, insurancePays, breakdown, riskFactor }
     */
    calculateMedicalCost(baseCost, isEmergency = false, preRolledRisk = null) {
        const plan = GameData.insuranceSystem.healthPlans[this.state.insurance.healthPlanId];

        // 使用预判定的风险，或创建无风险的默认值
        let riskFactor = preRolledRisk || { isOutOfNetwork: false, isDenied: false, note: '' };

        // 0. 特殊状态处理
        // Medicaid (白卡)
        if (plan && plan.id === 'medicaid') {
            return {
                youPay: 0,
                insurancePays: baseCost,
                breakdown: `白卡全额报销`,
                riskFactor
            };
        }

        // 无保险
        if (!plan || plan.type === 'none') {
            return {
                youPay: baseCost,
                insurancePays: 0,
                breakdown: `无保险全额自付`,
                riskFactor
            };
        }

        // 如果被拒赔，全额自付
        if (riskFactor.isDenied) {
            return {
                youPay: baseCost,
                insurancePays: 0,
                breakdown: `保险拒赔 (${riskFactor.note})`,
                riskFactor
            };
        }

        // 如果是网外，费用可能翻倍，且不计入 OOP (通常情况)
        let finalCost = baseCost;
        if (riskFactor.isOutOfNetwork) {
            finalCost = Math.round(baseCost * 1.5); // 网外加价
            return {
                youPay: finalCost,
                insurancePays: 0,
                breakdown: `网外设施全额自付 ($${baseCost} -> $${finalCost})`,
                riskFactor
            };
        }

        // 2. 正常理赔流程 (网内)
        let remainingCost = finalCost;
        let youPay = 0;
        let breakdown = [];

        // Copay (如果有定义且适用) - 简化：此处暂不处理复杂 Copay，直接走 Deductible

        // Deductible (免赔额)
        const deductibleRemaining = Math.max(0, plan.deductible - this.state.insurance.healthDeductiblePaid);
        if (deductibleRemaining > 0) {
            const payToDeductible = Math.min(remainingCost, deductibleRemaining);
            youPay += payToDeductible;
            remainingCost -= payToDeductible;

            // 记录到 breakdown，但不在这里修改 state (保持纯函数)
            // 调用者负责 commit
            breakdown.push(`免赔额: $${payToDeductible}`);
        }

        // Coinsurance (共保)
        if (remainingCost > 0) {
            const currentOOP = this.state.insurance.healthOutOfPocketPaid + this.state.insurance.healthDeductiblePaid;
            const oopRemaining = Math.max(0, plan.outOfPocketMax - currentOOP); // 剩余自付空间

            // 如果还有自付空间
            if (oopRemaining > 0) {
                // 本次理论共保额
                let coinShare = remainingCost * plan.coinsurance;
                // 但受本次已付 Deductible 影响? 不，OOP通常包含Deductible。
                // 这里的逻辑：YouPayTotal <= OOP_Remaining + (本次Deductible已占用的空间? 不)
                // 简化模型：YouPayTotal (Deductible + Coin) 累积不能超过 Global OOP Max

                // 本次交易最多还能付多少 = Global_OOP_Max - (历史已付 + 本次已付Deductible)
                const realCapForThisTransaction = Math.max(0, plan.outOfPocketMax - (currentOOP + youPay));

                const actualCoinPay = Math.min(coinShare, realCapForThisTransaction);
                youPay += actualCoinPay;

                breakdown.push(`共保(${plan.coinsurance * 100}%): $${Math.round(actualCoinPay)}`);
            } else {
                breakdown.push('已达年度上限，保险全包');
            }
        }

        const insurancePays = finalCost - youPay;

        return {
            youPay: Math.round(youPay),
            insurancePays: Math.round(insurancePays),
            breakdown: breakdown.join(', '),
            riskFactor
        };
    }
};
