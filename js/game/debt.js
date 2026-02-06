/**
 * 债务系统模块 - 统一扣款、债务、计息与分期
 */
import { GameData } from '../data/index.js';
import { I18n } from '../i18n.js';

export const DebtMixin = {
    _getDebtConfig() {
        return GameData.debtConfig || {
            monthlyInterestRate: 0.05,
            medicalInstallmentThreshold: 5000,
            medicalInstallmentMonthly: 2000
        };
    },

    _getDebtSourceLabel(source) {
        const labelMap = {
            rent: I18n.t('ui_static.bill_detail.rent') || '房租',
            utility: I18n.t('ui_static.bill_detail.utility') || '水电',
            insurance: I18n.t('ui_static.bill_detail.insurance') || '保险',
            medical: I18n.t('finance.medical') || '医疗',
            commute: I18n.t('finance.commute') || '通勤',
            daily: I18n.t('finance.daily') || '日常',
            fine: I18n.t('finance.fine') || '罚款',
            interest: I18n.t('finance.interest') || '利息',
            overflow: I18n.t('finance.overflow') || '超支',
            other: I18n.t('finance.other') || '其他'
        };
        return labelMap[source] || source || (I18n.t('finance.other') || '其他');
    },

    _getSpendingDiscount(state) {
        if (!this.hasArtifact || !this.hasArtifact('mom_credit_card')) return 0;
        const conf = GameData.artifactConfig?.mom_credit_card || {};
        const threshold = conf.threshold || 500;
        const discount = conf.debtDiscount || 0;
        if ((state.money || 0) >= threshold) return 0;
        return Math.max(0, Math.min(0.9, discount));
    },

    deductMoney(amount, source = 'other', options = {}) {
        const state = options.state || this.state;
        const allowInstallment = options.allowInstallment !== false;

        if (!state || typeof amount !== 'number' || amount <= 0) {
            return { cashPaid: 0, debtAdded: 0 };
        }

        const discount = this._getSpendingDiscount(state);
        const finalAmount = Math.round(amount * (1 - discount));
        const cashAvailable = Math.max(0, state.money || 0);

        if (finalAmount <= 0) {
            return { cashPaid: 0, debtAdded: 0 };
        }

        if (cashAvailable >= finalAmount) {
            state.money = cashAvailable - finalAmount;
            if (finalAmount > 0) state.spentMoneyToday = true;
            return { cashPaid: finalAmount, debtAdded: 0 };
        }

        const cashPaid = cashAvailable;
        const shortfall = Math.max(0, finalAmount - cashPaid);
        state.money = 0;
        if (finalAmount > 0) state.spentMoneyToday = true;

        if (shortfall > 0) {
            if (source === 'medical' && allowInstallment) {
                this.addMedicalInstallment(shortfall, options);
            } else {
                this.addDebt(shortfall, source, options);
            }
        }

        return { cashPaid, debtAdded: shortfall };
    },

    addDebt(amount, source = 'other', options = {}) {
        const state = options.state || this.state;
        const silent = !!options.silent;
        if (!state || typeof amount !== 'number' || amount <= 0) return 0;

        const rounded = Math.round(amount);
        state.debt = Math.max(0, (state.debt || 0) + rounded);

        if (!Array.isArray(state.debtItems)) state.debtItems = [];
        state.debtItems.push({
            source: source || 'other',
            amount: rounded,
            day: state.day || 0
        });

        if (!silent) {
            const sourceLabel = this._getDebtSourceLabel(source);
            if (!state.dailyFinancialReport) state.dailyFinancialReport = [];
            state.dailyFinancialReport.push(I18n.t('finance.newDebtNotice', rounded, sourceLabel) || `新增债务 $${rounded} (${sourceLabel})`);
            this.addLog && this.addLog(I18n.t('finance.newDebtNotice', rounded, sourceLabel) || `新增债务 $${rounded} (${sourceLabel})`, 'warning', sourceLabel);
        }

        return rounded;
    },

    addMedicalInstallment(amount, options = {}) {
        const state = options.state || this.state;
        if (!state || typeof amount !== 'number' || amount <= 0) return 0;

        const conf = this._getDebtConfig();
        const monthlyAmount = Math.max(0, conf.medicalInstallmentMonthly || 0);
        const threshold = Math.max(0, conf.medicalInstallmentThreshold || 0);

        const rounded = Math.round(amount);

        if (monthlyAmount <= 0 || rounded < threshold) {
            return this.addDebt(rounded, 'medical', options);
        }

        const immediate = Math.min(monthlyAmount, rounded);
        const pending = Math.max(0, rounded - immediate);

        if (immediate > 0) {
            this.addDebt(immediate, 'medical', options);
        }

        if (pending > 0) {
            if (!Array.isArray(state.pendingMedicalInstallments)) state.pendingMedicalInstallments = [];
            state.pendingMedicalInstallments.push({
                remaining: pending,
                monthlyAmount: monthlyAmount,
                day: state.day || 0
            });
        }

        return rounded;
    },

    processMedicalInstallments(stateOverride = null) {
        const state = stateOverride || this.state;
        if (!state || !Array.isArray(state.pendingMedicalInstallments)) return 0;

        let transferred = 0;
        const nextQueue = [];

        state.pendingMedicalInstallments.forEach((item) => {
            const remaining = Math.max(0, item.remaining || 0);
            const monthly = Math.max(0, item.monthlyAmount || 0);
            if (remaining <= 0 || monthly <= 0) return;

            const move = Math.min(remaining, monthly);
            transferred += move;
            const nextRemaining = remaining - move;

            this.addDebt(move, 'medical', { state, silent: true });

            if (nextRemaining > 0) {
                nextQueue.push({
                    remaining: nextRemaining,
                    monthlyAmount: monthly,
                    day: item.day || state.day || 0
                });
            }
        });

        state.pendingMedicalInstallments = nextQueue;
        return transferred;
    },

    applyMonthlyInterest(stateOverride = null) {
        const state = stateOverride || this.state;
        const conf = this._getDebtConfig();
        const rate = conf.monthlyInterestRate || 0;
        if (!state || rate <= 0) return 0;

        const baseDebt = Math.max(0, state.debt || 0);
        if (baseDebt <= 0) return 0;

        const interest = Math.round(baseDebt * rate);
        if (interest <= 0) return 0;

        state.debtInterestAccrued = Math.max(0, (state.debtInterestAccrued || 0) + interest);
        this.addDebt(interest, 'interest', { state, silent: true });

        if (!state.dailyFinancialReport) state.dailyFinancialReport = [];
        state.dailyFinancialReport.push(I18n.t('finance.interestNotice', interest) || `债务产生利息 $${interest}`);

        return interest;
    },

    repayDebt(amount, options = {}) {
        const state = options.state || this.state;
        if (!state || typeof amount !== 'number' || amount <= 0) {
            return { success: false, paid: 0 };
        }

        const available = Math.max(0, state.money || 0);
        const debtTotal = Math.max(0, state.debt || 0);
        const payAmount = Math.min(available, debtTotal, Math.round(amount));

        if (payAmount <= 0) {
            return { success: false, paid: 0 };
        }

        state.money = available - payAmount;
        state.debt = Math.max(0, debtTotal - payAmount);

        let remaining = payAmount;

        if (!Array.isArray(state.debtItems)) state.debtItems = [];

        const settleItems = (predicate) => {
            let before = remaining;
            for (const item of state.debtItems) {
                if (remaining <= 0) break;
                if (predicate && !predicate(item)) continue;
                const pay = Math.min(item.amount || 0, remaining);
                item.amount = Math.max(0, (item.amount || 0) - pay);
                remaining -= pay;
            }
            return before - remaining;
        };

        const interestPaid = settleItems(item => item.source === 'interest');
        if (interestPaid > 0) {
            state.debtInterestAccrued = Math.max(0, (state.debtInterestAccrued || 0) - interestPaid);
        }

        settleItems(item => item.source !== 'interest');

        state.debtItems = state.debtItems.filter(item => (item.amount || 0) > 0);

        return { success: true, paid: payAmount };
    }
};
