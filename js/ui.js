/**
 * 斩杀线生存 V2 - UI渲染模块
 * 时段动画 + 精力显示
 */
import { I18n } from './i18n.js';
import { GameData } from './data/index.js';
import { GameEvents } from './events/index.js';
import { game } from './game.js';
import { AudioManager } from './audio.js';

export const UI = {
    elements: {},

    /**
     * Helper to resolve potentially dynamic text
     */
    resolveText(value, ...args) {
        if (typeof value === 'function') {
            return value(...args);
        }
        return value;
    },

    /**
     * 初始化UI
     */
    init() {
        this.translatePage(); // V2.35 自动翻译页面静态文本
        // 背景
        this.elements.gameBackground = document.getElementById('game-background');

        // 屏幕
        this.elements.startScreen = document.getElementById('start-screen');
        this.elements.gameScreen = document.getElementById('game-screen');
        this.elements.endingScreen = document.getElementById('ending-screen');
        this.elements.manualScreen = document.getElementById('manual-screen');

        // 按钮
        this.elements.restartButton = document.getElementById('restart-button');

        // 状态栏
        this.elements.moneyValue = document.getElementById('money-value');
        this.elements.investmentValue = document.getElementById('investment-value');
        this.elements.housingValue = document.getElementById('housing-value');
        this.elements.jobValue = document.getElementById('job-value');
        this.elements.energyBar = document.getElementById('energy-bar');
        this.elements.mentalBar = document.getElementById('mental-bar');
        this.elements.healthBar = document.getElementById('health-bar');

        // V2.37 Numeric Status Values
        this.elements.energyVal = document.getElementById('energy-val');
        this.elements.mentalVal = document.getElementById('mental-val');
        this.elements.healthVal = document.getElementById('health-val');
        this.elements.socialVal = document.getElementById('social-val');
        this.elements.socialBar = document.getElementById('social-bar');
        this.elements.workEfficiencyVal = document.getElementById('work-efficiency-val');
        this.elements.workEfficiencyBar = document.getElementById('work-efficiency-bar');

        // 时段显示
        this.elements.dayCount = document.getElementById('day-count');
        this.elements.timeIcon = document.getElementById('time-icon');
        this.elements.periodName = document.getElementById('period-name');
        this.elements.dotDay = document.getElementById('dot-day');
        this.elements.dotNight = document.getElementById('dot-night');

        // 事件区域
        this.elements.eventCard = document.getElementById('event-card');
        this.elements.eventType = document.getElementById('event-type');
        this.elements.eventEnergyCost = document.getElementById('event-energy-cost');
        this.elements.eventTitle = document.getElementById('event-title');
        this.elements.eventDescription = document.getElementById('event-description');
        this.elements.eventChoices = document.getElementById('event-choices');
        this.elements.advanceStageButton = document.getElementById('advance-stage-button');

        // Toast
        this.elements.messageToast = document.getElementById('message-toast');
        this.elements.toastText = document.getElementById('toast-text');

        // 结局
        this.elements.endingTitle = document.getElementById('ending-title');
        this.elements.endingSubtitle = document.getElementById('ending-subtitle');
        this.elements.endingStats = document.getElementById('ending-stats');
        this.elements.endingMessage = document.getElementById('ending-message');
        this.elements.endingContent = document.querySelector('.ending-content');

        // V2.1 财务信息
        this.elements.paydayContainer = document.getElementById('payday-container');
        this.elements.paydayCountdown = document.getElementById('payday-countdown');
        this.elements.monthlyIncomeDisplay = document.getElementById('monthly-income');

        this.elements.monthlyBillContainer = document.getElementById('monthly-bill-container');
        this.elements.monthlyBillTotal = document.getElementById('monthly-bill-total');
        this.elements.monthlyBillSub = document.getElementById('monthly-bill-sub');

        this.elements.billDetailModal = document.getElementById('bill-detail-modal');
        this.elements.billDetailList = document.getElementById('bill-detail-list');
        this.elements.billDetailTotal = document.getElementById('bill-detail-total');
        this.elements.closeBillDetail = document.getElementById('close-bill-detail');

        // V2.1 储备信息
        this.elements.ingredientsCount = document.getElementById('ingredients-count');
        this.elements.mealStatus = document.getElementById('meal-status');

        // V2.7 任务进度
        // V2.7 任务进度
        this.elements.taskProgress = document.getElementById('task-progress');
        this.elements.taskDeadline = document.getElementById('task-deadline');
        this.elements.taskContainer = document.getElementById('dashboard-task');
        this.elements.taskProgressBar = document.getElementById('task-progress-bar');

        // V2.4 午餐选择器
        this.elements.lunchSelector = document.getElementById('lunch-selector');
        this.elements.lunchOptions = document.getElementById('lunch-options');

        // V2.6 导航与保险
        this.elements.tabBar = document.getElementById('tab-bar');
        this.elements.tabItems = document.querySelectorAll('.tab-item');
        this.elements.screenInsurance = document.getElementById('insurance-screen');
        this.elements.screenAssets = document.getElementById('assets-screen');
        this.elements.screenStatus = document.getElementById('status-screen');

        // V2.9 资产页面元素
        this.elements.assetCardsContainer = document.getElementById('asset-cards-container');
        this.elements.assetsCash = document.getElementById('assets-cash');
        this.elements.assetsPortfolio = document.getElementById('assets-portfolio');
        this.elements.assetsTotal = document.getElementById('assets-total');
        this.elements.screenStatus = document.getElementById('status-screen');

        // Status Page Elements
        this.elements.statusEnergyVal = document.getElementById('status-energy-val');
        this.elements.statusEnergyBar = document.getElementById('status-energy-bar');
        this.elements.statusMentalVal = document.getElementById('status-mental-val');
        this.elements.statusMentalBar = document.getElementById('status-mental-bar');
        this.elements.statusHealthVal = document.getElementById('status-health-val');
        this.elements.statusHealthBar = document.getElementById('status-health-bar');
        this.elements.statusSocialVal = document.getElementById('status-social-val');
        this.elements.statusSocialBar = document.getElementById('status-social-bar');
        this.elements.statusWorkEfficiencyVal = document.getElementById('status-work-efficiency-val');
        this.elements.statusWorkEfficiencyBar = document.getElementById('status-work-efficiency-bar');

        this.elements.statusJobTitle = document.getElementById('status-job-title');
        this.elements.statusJobIncome = document.getElementById('status-job-income');
        this.elements.statusSickLeave = document.getElementById('status-sick-leave'); // V2.28 病假显示
        this.elements.statusUnemployedDays = document.getElementById('status-unemployed-days');

        this.elements.statusHousingType = document.getElementById('status-housing-type');
        this.elements.statusHousingCost = document.getElementById('status-housing-cost');
        this.elements.statusHousingEffect = document.getElementById('status-housing-effect');

        // V2.XX Housing Popup Listener
        if (this.elements.housingValue) {
            this.elements.housingValue.style.cursor = 'pointer';
            this.elements.housingValue.title = "点击查看详情";
            this.elements.housingValue.onclick = () => {
                this.showHousingDetailModal();
            };
        }

        // 交通通勤
        this.elements.statusTransportType = document.getElementById('status-transport-type');
        this.elements.statusGasCost = document.getElementById('status-gas-cost');
        this.elements.statusCarInsurance = document.getElementById('status-car-insurance');

        this.elements.statusCash = document.getElementById('status-cash');
        this.elements.statusDebt = document.getElementById('status-debt');
        this.elements.statusCredit = document.getElementById('status-credit');

        this.elements.statusDaysSurvived = document.getElementById('status-days-survived');
        this.elements.statusMaxWealth = document.getElementById('status-max-wealth');
        this.elements.statusSeed = document.getElementById('status-seed');
        this.elements.statusCopySeedBtn = document.getElementById('status-copy-seed');

        // 保险页面元素
        this.elements.insMoneyDisplay = document.getElementById('ins-money-display');
        this.elements.healthPlanBadge = document.getElementById('health-plan-badge');
        this.elements.healthPlanName = document.getElementById('health-plan-name');
        this.elements.healthPremium = document.getElementById('health-premium');
        this.elements.deductibleProgressText = document.getElementById('deductible-progress-text');
        this.elements.deductibleBar = document.getElementById('deductible-bar');
        this.elements.pendingPlanAlert = document.getElementById('pending-plan-alert');
        this.elements.pendingPlanName = document.getElementById('pending-plan-name');

        this.elements.carPlanName = document.getElementById('car-plan-name');
        this.elements.carPremium = document.getElementById('car-premium');
        this.elements.rentersStatus = document.getElementById('renters-status');

        this.elements.btnChangeHealth = document.getElementById('btn-change-health');
        this.elements.btnChangeCar = document.getElementById('btn-change-car');
        this.elements.btnToggleRenters = document.getElementById('btn-toggle-renters');

        // V2.10 侧边行动选择器
        this.elements.dailyActionSelector = document.getElementById('daily-action-selector');
        this.elements.dailyActionOptions = document.getElementById('daily-action-options');
        this.elements.incidentSelector = document.getElementById('incident-selector');
        this.elements.incidentOptions = document.getElementById('incident-options');

        // V2.21 通勤选择器
        this.elements.commuteSelector = document.getElementById('commute-selector');
        this.elements.commuteOptions = document.getElementById('commute-options');

        // V2.11 随机种子
        this.elements.seedInput = document.getElementById('seed-input');

        // V2.12 游戏说明 (Manual Screen)
        this.elements.helpButton = document.getElementById('help-button');
        this.elements.manualBackBtn = document.getElementById('manual-back-btn');
        this.elements.manualCloseHeader = document.getElementById('manual-close-header');

        // V2.13 交易模态框
        this.elements.tradeModal = document.getElementById('trade-modal');
        this.elements.tradeModalTitle = document.getElementById('trade-modal-title');
        this.elements.tradeModalClose = document.getElementById('trade-modal-close');
        this.elements.tradeAssetIcon = document.getElementById('trade-asset-icon');
        this.elements.tradeAssetName = document.getElementById('trade-asset-name');
        this.elements.tradePriceValue = document.getElementById('trade-price-value');
        this.elements.tradeHoldingValue = document.getElementById('trade-holding-value');
        this.elements.tradeQuantityInput = document.getElementById('trade-quantity-input');
        this.elements.tradeTotalValue = document.getElementById('trade-total-value');
        this.elements.tradeCashValue = document.getElementById('trade-cash-value');
        this.elements.tradeConfirmBtn = document.getElementById('trade-confirm-btn');

        // V2.13 验证提示区域
        this.elements.choiceValidationHint = document.getElementById('choice-validation-hint');

        // V2.12 存档系统
        this.elements.saveSlotsContainer = document.getElementById('save-slots');
        this.elements.saveModal = document.getElementById('save-modal');
        this.elements.saveModalSlots = document.getElementById('save-modal-slots');
        this.elements.closeSaveModal = document.getElementById('close-save-modal');
        this.elements.saveGameBtn = document.getElementById('save-game-btn');
        this.elements.returnToTitleBtn = document.getElementById('return-to-title-btn');

        // V2.12 Start Screen Refactor
        this.elements.startButton = document.getElementById('start-button');
        this.elements.loadModal = document.getElementById('load-modal');
        this.elements.loadModalSlots = document.getElementById('load-modal-slots');
        this.elements.closeLoadModal = document.getElementById('close-load-modal');

        // 交易状态
        this.currentTradeAction = null; // 'buy' or 'sell'
        this.currentTradeAssetId = null;

        this.currentTab = 'home';

        // 绑定 Tab 切换
        if (this.elements.tabItems) {
            this.elements.tabItems.forEach(item => {
                item.addEventListener('click', () => {
                    const tab = item.dataset.tab;
                    this.switchTab(tab);
                });
            });
        }

        // 绑定保险按钮
        if (this.elements.btnChangeHealth) this.elements.btnChangeHealth.addEventListener('click', () => this.showHealthPlanModal());
        if (this.elements.btnChangeCar) this.elements.btnChangeCar.addEventListener('click', () => this.showCarPlanModal());
        if (this.elements.btnToggleRenters) this.elements.btnToggleRenters.addEventListener('click', () => this.toggleRentersInsurance());

        if (this.elements.helpButton) {
            this.elements.helpButton.addEventListener('click', () => {
                this.switchScreen('manual');
            });
        }
        if (this.elements.manualBackBtn) {
            this.elements.manualBackBtn.addEventListener('click', () => {
                this.switchScreen('start');
            });
        }
        if (this.elements.manualCloseHeader) {
            this.elements.manualCloseHeader.addEventListener('click', () => {
                this.switchScreen('start');
            });
        }

        // V2.45 Bind Dev Editor
        this.bindDevEditorEvents();

        // V2.12 Restart Button
        if (this.elements.restartButton) {

            // 绑定账单详情模态框
            if (this.elements.monthlyBillContainer) {
                this.elements.monthlyBillContainer.addEventListener('click', () => this.showBillDetailModal());
            }
            if (this.elements.closeBillDetail) {
                this.elements.closeBillDetail.addEventListener('click', () => {
                    this.elements.billDetailModal.classList.add('hidden');
                });
            }
            if (this.elements.billDetailModal) {
                this.elements.billDetailModal.addEventListener('click', (e) => {
                    if (e.target === this.elements.billDetailModal) {
                        this.elements.billDetailModal.classList.add('hidden');
                    }
                });
            }

            // 绑定交易模态框事件
            if (this.elements.tradeModalClose) {
                this.elements.tradeModalClose.addEventListener('click', () => this.hideTradeModal());
            }
            if (this.elements.tradeModal) {
                this.elements.tradeModal.addEventListener('click', (e) => {
                    if (e.target === this.elements.tradeModal) {
                        this.hideTradeModal();
                    }
                });
            }
            if (this.elements.tradeQuantityInput) {
                this.elements.tradeQuantityInput.addEventListener('input', () => this.updateTradeTotal());
            }
            if (this.elements.tradeConfirmBtn) {
                this.elements.tradeConfirmBtn.addEventListener('click', () => this.executeAssetTrade());
            }

            // V2.12 绑定存档系统事件
            if (this.elements.closeSaveModal) {
                this.elements.closeSaveModal.addEventListener('click', () => this.hideSaveModal());
            }
            if (this.elements.saveModal) {
                this.elements.saveModal.addEventListener('click', (e) => {
                    if (e.target === this.elements.saveModal) {
                        this.hideSaveModal();
                    }
                });
            }
            if (this.elements.saveGameBtn) {
                this.elements.saveGameBtn.addEventListener('click', () => this.showSaveModal());
            }
            if (this.elements.returnToTitleBtn) {
                this.elements.returnToTitleBtn.addEventListener('click', async () => {
                    if (await this.showConfirm(I18n.t('ui.confirm.returnToTitle'), I18n.t('ui.confirm.returnToTitleHeader'))) {
                        this.switchScreen('start');
                        this.currentTab = null; // V2.12 Fix: 重置为 null，确保下次 switchTab('home') 能触发 UI 更新
                    }
                });
            }

            // V2.12 Start Button -> Load Modal
            if (this.elements.startButton) {
                this.elements.startButton.addEventListener('click', () => this.showLoadModal());
            }
            if (this.elements.closeLoadModal) {
                this.elements.closeLoadModal.addEventListener('click', () => this.hideLoadModal());
            }
            if (this.elements.loadModal) {
                this.elements.loadModal.addEventListener('click', (e) => {
                    if (e.target === this.elements.loadModal) this.hideLoadModal();
                });
            }

            // V2.13 Status Page Copy Seed
            if (this.elements.statusCopySeedBtn) {
                this.elements.statusCopySeedBtn.addEventListener('click', () => {
                    const seed = game.state.seed; // 获取初始种子
                    if (seed) {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            navigator.clipboard.writeText(seed).then(() => {
                                this.showToast(I18n.t('ui.toast.seedCopied'), 'positive');
                            }).catch(() => this.copyTextFallback(seed));
                        } else {
                            this.copyTextFallback(seed);
                        }
                    }
                });
            }

        }
    },

    /**
     * V2.36 自定义确认对话框（替代原生 confirm）
     * @param {string} message - 确认消息
     * @param {string} title - 可选标题
     * @returns {Promise<boolean>} - 用户选择结果
     */
    showConfirm(message, title = '确认操作') {
        return new Promise((resolve) => {
            const modal = document.getElementById('confirm-modal');
            const titleEl = document.getElementById('confirm-modal-title');
            const messageEl = document.getElementById('confirm-modal-message');
            const okBtn = document.getElementById('confirm-modal-ok');
            const cancelBtn = document.getElementById('confirm-modal-cancel');

            if (!modal || !okBtn || !cancelBtn) {
                // 降级到原生 confirm
                resolve(confirm(message));
                return;
            }

            titleEl.textContent = title;
            messageEl.textContent = message;
            modal.classList.remove('hidden');

            const cleanup = () => {
                modal.classList.add('hidden');
                okBtn.removeEventListener('click', onOk);
                cancelBtn.removeEventListener('click', onCancel);
            };

            const onOk = () => {
                cleanup();
                resolve(true);
            };

            const onCancel = () => {
                cleanup();
                resolve(false);
            };

            okBtn.addEventListener('click', onOk);
            cancelBtn.addEventListener('click', onCancel);
        });
    },

    /**
     * V2.35 翻译页面静态文本
     */
    translatePage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = I18n.t(key);

            // 如果是 input 的 placeholder
            if (el.tagName === 'INPUT' && el.type === 'text') {
                el.placeholder = text;
            } else {
                el.innerHTML = text; // 使用 innerHTML 以支持 <b> 等标签
            }
        });
        console.log(`[UI] Page translated: ${elements.length} items`);
    },

    /**
     * 设置控制器
     */
    setController(controller) {
        this.controller = controller;
    },

    /**
     * 切换屏幕
     */
    switchScreen(screenName) {
        // 隐藏所有屏幕
        Object.values(this.elements).forEach(el => {
            if (el && el.classList && el.classList.contains('screen')) {
                el.classList.remove('active');
                el.style.display = 'none';
            }
        });

        // 显示/隐藏帮助按钮（仅在开始界面显示）
        if (this.elements.helpButton) {
            this.elements.helpButton.style.display = screenName === 'start' ? 'flex' : 'none';
        }

        // 显示目标屏幕
        let target = null;
        switch (screenName) {
            case 'start':
                target = this.elements.startScreen;
                break;
            case 'game':
                target = this.elements.gameScreen;
                break;
            case 'ending':
                target = this.elements.endingScreen;
                break;
            case 'insurance':
                target = this.elements.screenInsurance;
                break;
            case 'assets':
                target = this.elements.screenAssets;
                break;
            case 'status':
                target = this.elements.screenStatus;
                break;
            case 'manual':
                target = this.elements.manualScreen;
                break;
        }

        if (target) {
            target.classList.add('active');
            target.style.display = 'flex';

            // 保险页面特殊 display
            if (screenName === 'insurance') {
                target.style.display = 'block';
            }
        }

        // 控制 Tab Bar 显示：只有在 game, insurance, assets, status 界面才显示底栏
        if (screenName === 'game' || screenName === 'insurance' || screenName === 'assets' || screenName === 'status') {
            if (this.elements.tabBar) {
                this.elements.tabBar.classList.remove('hidden');
                this.elements.tabBar.style.display = 'flex';
            }
        } else {
            if (this.elements.tabBar) {
                this.elements.tabBar.classList.add('hidden');
                this.elements.tabBar.style.display = 'none';
            }
        }
    },

    /**
     * V2.6 切换底部标签页
     */
    switchTab(tabName) {
        if (this.currentTab === tabName) return;

        this.currentTab = tabName;

        // 更新 Tab 样式
        this.elements.tabItems.forEach(item => {
            item.classList.toggle('active', item.dataset.tab === tabName);
        });

        // 切换显示内容
        if (tabName === 'home') {
            this.switchScreen('game');
        } else if (tabName === 'insurance') {
            this.switchScreen('insurance');
            this.renderInsurancePage();
        } else if (tabName === 'assets') {
            this.switchScreen('assets');
            this.renderAssetsScreen();
        } else if (tabName === 'status') {
            this.switchScreen('status');
            this.renderStatusPage();
        }
    },

    /**
     * V2.6 渲染保险页面
     */
    renderInsurancePage() {
        const state = game.getState();
        const ins = state.insurance;
        const healthMetrics = GameData.insuranceSystem.healthPlans[ins.healthPlanId];

        // 更新金额
        this.elements.insMoneyDisplay.textContent = game.formatMoney(state.money);

        // 1. 健康保险
        if (healthMetrics) {
            this.elements.healthPlanName.textContent = this.resolveText(healthMetrics.name);
            this.elements.healthPlanBadge.textContent = healthMetrics.type === 'employer' ? I18n.t('ui.insurance.employerBadge') : I18n.t('ui.insurance.personalBadge');
            this.elements.healthPlanBadge.className = 'plan-badge ' + (healthMetrics.type === 'employer' ? 'info' : 'warning');

            // 保费显示
            this.elements.healthPremium.textContent = `$${healthMetrics.monthlyPremium}/月`;

            // 免赔额进度
            const paid = ins.healthDeductiblePaid;
            const max = healthMetrics.deductible;
            const percent = max > 0 ? Math.min(100, (paid / max) * 100) : 100;

            this.elements.deductibleProgressText.textContent = `$${paid} / $${max}`;
            this.elements.deductibleBar.style.width = `${percent}%`;
        }

        // 待生效计划
        if (ins.pendingHealthPlanId) {
            const pendingName = this.resolveText(GameData.insuranceSystem.healthPlans[ins.pendingHealthPlanId].name);
            this.elements.pendingPlanAlert.classList.remove('hidden');
            // V2.XX 统一格式
            this.elements.pendingPlanAlert.innerHTML = `${I18n.t('ui.insurance.nextMonthEffective')}: <strong>${pendingName}</strong>`;
        } else {
            this.elements.pendingPlanAlert.classList.add('hidden');
        }

        // 2. 汽车保险
        const carMetric = GameData.insuranceSystem.carPlans[ins.carPlanId];
        if (carMetric) {
            // 使用 flex column 或 block确保多行时靠右
            let html = `<div style="text-align: right;">${this.resolveText(carMetric.name)}</div>`;

            // V2.24 车险 Pending 提示
            if (ins.pendingCarPlanId) {
                const pendingCarName = this.resolveText(GameData.insuranceSystem.carPlans[ins.pendingCarPlanId].name);
                html += `<div style="font-size: 0.8em; margin-top: 4px; text-align: right;"><span class="pending-badge">${I18n.t('ui.insurance.nextMonthEffective')}: ${pendingCarName}</span></div>`;
            }
            this.elements.carPlanName.innerHTML = html;

            // 修复: 更新车险保费显示
            this.elements.carPremium.textContent = `$${carMetric.monthlyPremium}/月`;
        }

        // 3. 租客保险
        const rentIns = GameData.insuranceSystem.rentersInsurance;

        let rentStatusText = ins.hasRentersInsurance ? I18n.t('ui.insurance.insured') : I18n.t('ui.insurance.uninsured');
        let rentBtnText = ins.hasRentersInsurance ? I18n.t('ui.insurance.cancelInsurance') : I18n.t('ui.insurance.buyInsurance', rentIns.monthlyPremium);
        let rentStatusColor = ins.hasRentersInsurance ? "var(--color-success)" : "var(--color-text-muted)";
        // 统一使用 action-btn 样式
        let rentBtnClass = ins.hasRentersInsurance ? ['outline'] : [];

        // V2.24 租客险 Pending 状态
        if (ins.pendingRentersStatus !== null) {
            const pendingAction = ins.pendingRentersStatus ? I18n.t('ui.insurance.nextMonthActive') : I18n.t('ui.insurance.nextMonthCancel');
            rentStatusText += ` <span class="pending-badge">${I18n.t('ui.insurance.pendingHint', pendingAction)}</span>`;
            rentBtnText += " (撤销变更)";
        }

        this.elements.rentersStatus.innerHTML = rentStatusText;
        this.elements.rentersStatus.style.color = rentStatusColor;
        this.elements.btnToggleRenters.textContent = rentBtnText;
        // 使用 action-btn 替代 primary-button 以保持统一
        this.elements.btnToggleRenters.className = 'action-btn ' + rentBtnClass.join(' ');
    },

    /**
     * V2.9 渲染资产页面
     */
    renderAssetsScreen() {
        const state = game.getState();
        // Fix category if missing
        if (!this.currentAssetCategory) this.currentAssetCategory = 'commodity';
        this.setupAssetTabs();

        // Update Summary
        const prices = state.marketPrices || {};
        const holdings = state.holdings || {};
        let portfolioValue = 0;
        Object.keys(holdings).forEach(id => {
            if (holdings[id] && prices[id]) portfolioValue += holdings[id].quantity * prices[id].price;
        });
        if (this.elements.assetsCash) this.elements.assetsCash.textContent = game.formatMoney(state.money);
        if (this.elements.assetsPortfolio) this.elements.assetsPortfolio.textContent = game.formatMoney(portfolioValue);
        if (this.elements.assetsTotal) this.elements.assetsTotal.textContent = game.formatMoney(state.money + portfolioValue);

        this.renderAssetCards(state);
        return; /* Disabled old body
        const state = game.getState();
        const prices = state.marketPrices || {};
        const holdings = state.holdings || {};

        // 1. 更新顶部资产汇总
        let portfolioValue = 0;
        Object.keys(holdings).forEach(assetId => {
            const holding = holdings[assetId];
            if (holding && holding.quantity > 0 && prices[assetId]) {
                portfolioValue += holding.quantity * prices[assetId].price;
            }
        });

        if (this.elements.assetsCash) this.elements.assetsCash.textContent = game.formatMoney(state.money);
        if (this.elements.assetsPortfolio) this.elements.assetsPortfolio.textContent = game.formatMoney(portfolioValue);
        if (this.elements.assetsTotal) this.elements.assetsTotal.textContent = game.formatMoney(state.money + portfolioValue);

        // 2. 渲染资产卡片
        if (!this.elements.assetCardsContainer) return;
        this.elements.assetCardsContainer.innerHTML = '';

        // 获取并按配置顺序排序资产
        const assets = Object.keys(GameData.assetTypes).map(id => ({
            id,
            ...GameData.assetTypes[id]
        }));

        assets.forEach(asset => {
            const priceData = prices[asset.id] || { price: 0, change: 0, history: [] };
            const holding = holdings[asset.id] || { quantity: 0, avgCost: 0 };
            const card = document.createElement('div');
            card.className = 'asset-card glass-panel';

            // 计算持仓价值和盈亏
            const currentValue = holding.quantity * priceData.price;
            const costBasis = holding.quantity * holding.avgCost;
            const profitLoss = currentValue - costBasis;
            const profitClass = profitLoss >= 0 ? 'positive' : 'negative';
            const profitSign = profitLoss >= 0 ? '+' : '';

            // 涨跌幅样式
            const changeClass = priceData.change >= 0 ? 'positive' : 'negative';
            const changeSign = priceData.change >= 0 ? '+' : '';

            card.innerHTML = `
                <div class="asset-header">
                    <div class="asset-icon-area">
                        <span class="asset-icon">${this.resolveText(asset.icon)}</span>
                        <div class="asset-name-group">
                            <span class="asset-name">${this.resolveText(asset.name)}</span>
                            <span class="asset-desc">${this.resolveText(asset.description)}</span>
                        </div>
                    </div>
                    <div class="asset-price-area">
                        <span class="asset-price">$${priceData.price.toLocaleString()}</span>
                        <span class="asset-change ${changeClass}">${changeSign}${priceData.change}%</span>
                    </div>
                </div>
                
                <div class="asset-chart-preview">
                    <!-- 简易趋势线或额外信息 -->
                    <div class="asset-holding-info">
                        <div class="holding-row">
                            <span>持仓: ${holding.quantity} ${this.resolveText(asset.unit)}</span>
                            <span>均价: $${holding.avgCost.toLocaleString()}</span>
                        </div>
                        <div class="holding-row">
                            <span>价值: $${currentValue.toLocaleString()}</span>
                            <span class="${profitClass}">盈亏: ${profitSign}$${Math.round(profitLoss).toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div class="asset-actions">
                    <button class="action-btn buy-btn" data-id="${asset.id}">买入</button>
                    <button class="action-btn sell-btn ${holding.quantity <= 0 ? 'disabled' : ''}" data-id="${asset.id}" ${holding.quantity <= 0 ? 'disabled' : ''}>卖出</button>
                </div>
            `;

            this.elements.assetCardsContainer.appendChild(card);
        });

        // 绑定按钮事件
        this.elements.assetCardsContainer.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const assetId = e.target.dataset.id;
                this.showTradeModal('buy', assetId);
            });
        });

        this.elements.assetCardsContainer.querySelectorAll('.sell-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const assetId = e.target.dataset.id;
                this.showTradeModal('sell', assetId);
            });
        });

    */ },

    /**
     * 显示交易模态框
     */
    /* showTradeModal(action, assetId) {
        this.currentTradeAction = action;
        this.currentTradeAssetId = assetId;
 
        const assetConfig = GameData.assetTypes[assetId];
        const state = game.getState();
        const priceData = state.marketPrices[assetId];
        const holding = state.holdings[assetId] || { quantity: 0 };
 
        if (!assetConfig || !priceData) return;
 
        // 更新UI
        this.elements.tradeModalTitle.textContent = action === 'buy'
            ? I18n.t('ui_static.trade_modal.buy_title') || "买入资产"
            : I18n.t('ui_static.trade_modal.sell_title') || "卖出资产";
 
        this.elements.tradeAssetIcon.textContent = this.resolveText(assetConfig.icon);
        this.elements.tradeAssetName.textContent = this.resolveText(assetConfig.name);
        this.elements.tradePriceValue.textContent = `$${priceData.price.toLocaleString()}`;
        this.elements.tradeHoldingValue.textContent = `${holding.quantity} ${this.resolveText(assetConfig.unit)}`;
        this.elements.tradeCashValue.textContent = `$${state.money.toLocaleString()}`;
 
        this.elements.tradeQuantityInput.value = '';
        this.elements.tradeTotalValue.textContent = '$0';
 
        this.elements.tradeModal.classList.remove('hidden');
    },
 
    hideTradeModal() {
        if (this.elements.tradeModal) this.elements.tradeModal.classList.add('hidden');
    },
 
    updateTradeTotal() {
        const qty = parseFloat(this.elements.tradeQuantityInput.value);
        if (isNaN(qty) || qty < 0) {
            this.elements.tradeTotalValue.textContent = '$0';
            return;
        }
 
        const state = game.getState();
        const price = state.marketPrices[this.currentTradeAssetId].price;
        const total = qty * price;
        this.elements.tradeTotalValue.textContent = `$${total.toLocaleString()}`;
    },
 
    executeAssetTrade() {
        const qty = parseFloat(this.elements.tradeQuantityInput.value);
        if (isNaN(qty) || qty <= 0) {
            this.showToast(I18n.t('ui.toast.invalidQuantity') || "请输入有效数量", "negative");
            return;
        }
 
        let result;
        if (this.currentTradeAction === 'buy') {
            result = game.buyAsset(this.currentTradeAssetId, qty);
        } else {
            result = game.sellAsset(this.currentTradeAssetId, qty);
        }
 
        if (result.success) {
            this.showToast(result.message, "positive");
            this.hideTradeModal();
            this.renderAssetsScreen(); // 刷新界面
            this.updateStatusBar(game.getStatusDescription()); // 刷新钱
        } else {
            this.showToast(result.message, "negative");
        }
    } */

    /**
     * V2.10 渲染状态页面
     */
    renderStatusPage() {
        const state = game.getState();

        // 1. 生理指标
        if (this.elements.statusEnergyVal) {
            this.elements.statusEnergyVal.textContent = `${Math.round(state.energy)}/100`;
            this.elements.statusEnergyBar.style.width = `${state.energy}%`;
        }
        if (this.elements.statusMentalVal) {
            this.elements.statusMentalVal.textContent = `${Math.round(state.mental)}/${Math.round(state.maxMental || 100)}`;
            this.elements.statusMentalBar.style.width = `${(state.mental / (state.maxMental || 100)) * 100}%`;
        }
        if (this.elements.statusHealthVal) {
            this.elements.statusHealthVal.textContent = `${Math.round(state.health)}/100`;
            this.elements.statusHealthBar.style.width = `${state.health}%`;
        }
        // V2.18 社交值
        if (this.elements.statusSocialVal) {
            const social = state.socialValue || 50;
            this.elements.statusSocialVal.textContent = `${Math.round(social)}/100`;
            this.elements.statusSocialBar.style.width = `${social}%`;
        }
        if (this.elements.statusWorkEfficiencyVal) {
            const efficiency = state.workEfficiency || 0;
            const max = state.maxWorkEfficiency || GameData.initialState.maxWorkEfficiency;
            this.elements.statusWorkEfficiencyVal.textContent = `${Math.round(efficiency)}%`;
            this.elements.statusWorkEfficiencyBar.style.width = `${(efficiency / max) * 100}%`;
        }

        // 2. 职业
        if (GameData.jobTypes[state.job]) {
            const jName = this.resolveText(GameData.jobTypes[state.job].name);
            this.elements.statusJobTitle.textContent = jName;
        }
        if (this.elements.statusJobIncome) {
            const jobInfo = GameData.jobTypes[state.job];
            const income = jobInfo && jobInfo.income > 0
                ? (typeof state.monthlyIncome === 'number' ? state.monthlyIncome : jobInfo.income)
                : 0;
            this.elements.statusJobIncome.textContent = `$${income.toLocaleString()}`;

            // V2.28 显示病假 (PTO)
            if (this.elements.statusSickLeave) {
                if (state.job === 'fulltime') {
                    const pto = state.sickLeaveDays || 0;
                    this.elements.statusSickLeave.textContent = `PTO: ${pto}天`;
                    this.elements.statusSickLeave.parentElement.style.display = 'flex';
                } else {
                    this.elements.statusSickLeave.parentElement.style.display = 'none';
                }
            }
        }
        if (this.elements.statusUnemployedDays) {
            const days = state.unemployedDays || 0;
            this.elements.statusUnemployedDays.textContent = `${days}天`;
            this.elements.statusUnemployedDays.className = 'stat-val' + (days > 30 ? ' danger' : '');
        }

        // 3. 居住
        if (this.elements.statusHousingType) {
            const houseInfo = GameData.housingTypes[state.housing];
            this.elements.statusHousingType.textContent = houseInfo ? this.resolveText(houseInfo.name) : I18n.t('ui.status.unknown');
        }
        if (this.elements.statusHousingCost) {
            this.elements.statusHousingCost.textContent = `$${state.housingCost.toLocaleString()}`;
        }
        if (this.elements.statusHousingEffect) {
            const houseInfo = GameData.housingTypes[state.housing];
            if (houseInfo) {
                let effects = [];
                if (houseInfo.energyRecovery > 0) effects.push(`精力恢复+${houseInfo.energyRecovery}`);
                if (houseInfo.mentalBonus > 0) effects.push(`精神+${houseInfo.mentalBonus}`);
                if (houseInfo.healthBonus > 0) effects.push(`健康+${houseInfo.healthBonus}`);
                if (effects.length === 0) effects.push(I18n.t('ui.status.noEffect'));
                this.elements.statusHousingEffect.textContent = effects.join(', ');
            }
        }

        // 4. 交通通勤
        if (this.elements.statusTransportType) {
            const commuteId = state.selectedCommute || 'bus';
            if (GameData.commuteOptions[commuteId]) {
                const cName = this.resolveText(GameData.commuteOptions[commuteId].name);
                this.elements.statusTransportType.textContent = cName;
                this.elements.statusTransportType.style.color = '';
            } else {
                this.elements.statusTransportType.textContent = '🚌 公共交通';
                this.elements.statusTransportType.style.color = 'var(--color-text-muted)';
            }
        }
        if (this.elements.statusGasCost) {
            if (state.hasCar) {
                const fuel = state.fuelRemaining || 0;
                const capacity = state.fuelCapacity || 4;
                this.elements.statusGasCost.textContent = `${fuel}/${capacity} 次`;
            } else {
                this.elements.statusGasCost.textContent = '-';
            }
        }
        if (this.elements.statusCarInsurance) {
            if (state.hasCar) {
                const carPlan = GameData.insuranceSystem.carPlans[state.insurance.carPlanId];
                const premium = carPlan ? carPlan.monthlyPremium : 0;
                this.elements.statusCarInsurance.textContent = `$${premium}/月`;
            } else {
                this.elements.statusCarInsurance.textContent = '-';
            }
        }

        // 5. 财务
        if (this.elements.statusCash) {
            this.elements.statusCash.textContent = game.formatMoney(state.money);
        }
        if (this.elements.statusDebt) {
            // 目前没有显式的债务字段，用负资产近似
            const debt = state.money < 0 ? Math.abs(state.money) : 0;
            this.elements.statusDebt.textContent = `$${debt.toLocaleString()}`;
        }
        if (this.elements.statusCredit) {
            this.elements.statusCredit.textContent = state.creditScore || 720;
        }

        // 6. 统计
        if (this.elements.statusDaysSurvived) this.elements.statusDaysSurvived.textContent = `${state.day}天`;
        if (this.elements.statusMaxWealth) {
            const maxWealth = (state.stats && state.stats.maxWealth) ? state.stats.maxWealth : state.money;
            this.elements.statusMaxWealth.textContent = game.formatMoney(maxWealth);
        }
        if (this.elements.statusSeed) this.elements.statusSeed.textContent = state.seed || '-';
    },

    // ========================================
    // V2.12 存档系统 UI
    // ========================================

    /**
     * 显示读档/新建游戏模态框
     */
    showLoadModal() {
        if (!this.elements.loadModal || !this.elements.loadModalSlots) return;
        this.elements.loadModal.classList.remove('hidden');
        this.renderLoadModalSlots();
    },

    /**
     * 隐藏读档模态框
     */
    hideLoadModal() {
        if (this.elements.loadModal) {
            this.elements.loadModal.classList.add('hidden');
        }
    },

    /**
     * 渲染读档模态框槽位
     */
    renderLoadModalSlots() {
        if (!this.elements.loadModalSlots) return;

        const slots = game.getAllSlotInfo();
        this.elements.loadModalSlots.innerHTML = '';

        for (let i = 0; i < 3; i++) {
            const slotId = i + 1;
            const slotInfo = slots[i];
            const card = document.createElement('div');
            // 复用 save-slot-card 样式，但放在 modal 里
            // 为了保持一致性，可以用 save-modal-slot 样式，或者稍微调整
            // 这里我们使用 save-modal-slot 样式，因为它已经适配了模态框宽度
            card.className = 'save-modal-slot' + (slotInfo ? ' has-save' : ' empty');

            if (slotInfo) {
                const jobInfo = GameData.jobTypes[slotInfo.job] || { name: '未知' };
                const seedv = slotInfo.seed || '无';

                card.innerHTML = `
                    <div class="slot-main-row">
                        <div class="slot-info-group">
                            <span class="slot-number">${I18n.t('ui.save.slot', slotId)}</span>
                            <div class="slot-details">
                                <span class="highlight">${I18n.t('ui.save.day', slotInfo.day)}</span>
                                <span class="separator">|</span>
                                <span class="money">${game.formatMoney(slotInfo.money)}</span>
                                <span class="separator">|</span>
                                <span class="job">${this.resolveText(jobInfo.name)}</span>
                            </div>
                        </div>
                        <div class="slot-actions">
                            <button class="load-slot-btn primary-button" data-slot="${slotId}">${I18n.t('ui.save.continueBtn')}</button>
                            <button class="delete-slot-btn action-btn" data-slot="${slotId}">🗑️</button>
                        </div>
                    </div>
                    <div class="slot-seed-row">
                        <span class="seed-label">${I18n.t('ui.save.seedLabel')}</span>
                        <code class="seed-value">${seedv}</code>
                        <button class="copy-seed-btn" data-seed="${seedv}" title="${I18n.t('ui.save.copySeedTitle')}">📋</button>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="slot-main-row">
                         <div class="slot-info-group">
                            <span class="slot-number">${I18n.t('ui.save.slot', slotId)}</span>
                            <span class="slot-empty-text">${I18n.t('ui.save.emptySlot')}</span>
                        </div>
                        <div class="slot-actions">
                            <button class="new-slot-btn primary-button" data-slot="${slotId}">${I18n.t('ui.save.newGameBtn')}</button>
                        </div>
                    </div>
                `;
            }

            this.elements.loadModalSlots.appendChild(card);
        }

        // 绑定事件
        this.elements.loadModalSlots.querySelectorAll('.load-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slotId = parseInt(e.target.dataset.slot);
                this.loadGameFromSlot(slotId);
                this.hideLoadModal();
            });
        });

        this.elements.loadModalSlots.querySelectorAll('.new-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slotId = parseInt(e.target.dataset.slot);
                this.startNewGame(slotId);
                this.hideLoadModal();
            });
        });

        this.elements.loadModalSlots.querySelectorAll('.delete-slot-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const slotId = parseInt(e.target.dataset.slot);
                if (await this.showConfirm(I18n.t('ui.confirm.deleteSlot', slotId), I18n.t('ui.confirm.deleteSlotHeader'))) {
                    game.deleteSlot(slotId);
                    this.renderLoadModalSlots(); // 重新渲染
                }
            });
        });

        // 复制种子功能
        this.elements.loadModalSlots.querySelectorAll('.copy-seed-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const seed = e.target.dataset.seed;
                if (seed && seed !== '无') {
                    // 兼容性处理：非 HTTPS 环境下 navigator.clipboard 可能未定义
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(seed).then(() => {
                            this.showToast(I18n.t('ui.toast.copiedSuccess'), 'positive');
                        }).catch(err => {
                            console.error('Clipboard API failed:', err);
                            this.copyTextFallback(seed);
                        });
                    } else {
                        this.copyTextFallback(seed);
                    }
                }
            });
        });
    },

    /**
     * 复制文本回退方案 (execCommand)
     */
    copyTextFallback(text) {
        const textArea = document.createElement("textarea");
        textArea.value = text;

        // 防止手机上拉起键盘
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.setAttribute('readonly', '');

        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999); // For mobile devices

        try {
            const successful = document.execCommand('copy');
            if (successful) {
                this.showToast(I18n.t('ui.toast.copiedSuccess'), 'positive');
            } else {
                this.showToast(I18n.t('ui.toast.copyFailed'), 'negative');
            }
        } catch (err) {
            console.error('Fallback copy failed', err);
            this.showToast(I18n.t('ui.toast.copyError'), 'negative');
        }

        document.body.removeChild(textArea);
    },

    /**
     * 从槽位加载游戏
     */
    loadGameFromSlot(slotId) {
        if (game.loadGame(slotId)) {
            this.switchScreen('game');
            this.switchTab('home');
            const state = game.getState();
            this.updateStatusBar(game.getStatusDescription());
            this.updateTimeDisplay(game.getStatusDescription());
            this.updateBackground(state.period);

            // V2.12: 使用恢复的当前事件（如果有），否则获取下一个事件
            const event = game.currentEvent || game.getNextEvent();
            this.showEvent(event, state);

            this.showToast(`已加载槽位 ${slotId} 的存档`);
        } else {
            this.showToast(I18n.t('ui.toast.loadFailed'));
        }
    },

    /**
     * 开始新游戏并关联到槽位 (但不立即保存)
     */
    startNewGame(slotId) {
        const seed = this.elements.seedInput ? this.elements.seedInput.value.trim() : null;
        game.init(seed || null);

        // 记住当前使用的槽位
        game.getState().currentSlotId = slotId;

        this.switchScreen('game');
        this.switchTab('home');

        const state = game.getState();
        this.updateStatusBar(game.getStatusDescription());
        this.updateTimeDisplay(game.getStatusDescription());
        this.updateBackground(state.period);

        const event = game.getNextEvent();
        this.showEvent(event, state);

        this.showToast(I18n.t('ui.toast.newGameStarted', slotId));
    },

    /**
     * 显示保存模态框
     */
    showSaveModal() {
        if (!this.elements.saveModal || !this.elements.saveModalSlots) return;

        this.elements.saveModal.classList.remove('hidden');
        this.renderSaveModalSlots();
    },

    /**
     * 隐藏保存模态框
     */
    hideSaveModal() {
        if (this.elements.saveModal) {
            this.elements.saveModal.classList.add('hidden');
        }
    },

    /**
     * 渲染保存模态框槽位
     */
    renderSaveModalSlots() {
        if (!this.elements.saveModalSlots) return;

        const slots = game.getAllSlotInfo();
        const currentSlotId = game.getState().currentSlotId || 0;

        this.elements.saveModalSlots.innerHTML = '';

        for (let i = 0; i < 3; i++) {
            const slotId = i + 1;
            const slotInfo = slots[i];
            const isCurrent = slotId === currentSlotId;

            const card = document.createElement('div');
            card.className = 'save-modal-slot' + (slotInfo ? ' has-save' : ' empty') + (isCurrent ? ' current' : '');

            if (slotInfo) {
                const jobInfo = GameData.jobTypes[slotInfo.job] || { name: '未知' };
                card.innerHTML = `
                    <div class="slot-main-row">
                        <div class="slot-info-group">
                            <span class="slot-number">${I18n.t('ui.save.slot', slotId)}${isCurrent ? I18n.t('ui.save.current') : ''}</span>
                            <div class="slot-details">
                                <span class="highlight">${I18n.t('ui.save.day', slotInfo.day)}</span>
                                <span class="separator">|</span>
                                <span class="money">${game.formatMoney(slotInfo.money)}</span>
                            </div>
                        </div>
                        <div class="slot-actions">
                             <button class="save-to-slot-btn action-btn" data-slot="${slotId}" style="min-width: 80px;">${I18n.t('ui.save.overwrite')}</button>
                        </div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="slot-main-row">
                        <div class="slot-info-group">
                            <span class="slot-number">${I18n.t('ui.save.slot', slotId)}${isCurrent ? I18n.t('ui.save.current') : ''}</span>
                            <span class="slot-empty-text" style="flex: 1; text-align: left; padding-left: 10px;">${I18n.t('ui.save.emptySlot')}</span>
                        </div>
                        <div class="slot-actions">
                             <button class="save-to-slot-btn action-btn" data-slot="${slotId}" style="min-width: 80px;">${I18n.t('ui.save.saveHere')}</button>
                        </div>
                    </div>
                `;
            }

            this.elements.saveModalSlots.appendChild(card);
        }

        // 绑定保存按钮
        this.elements.saveModalSlots.querySelectorAll('.save-to-slot-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const slotId = parseInt(e.target.dataset.slot);
                this.saveGameToSlot(slotId);
            });
        });
    },

    /**
     * 保存游戏到指定槽位
     */
    saveGameToSlot(slotId) {
        if (game.saveGame(slotId)) {
            game.getState().currentSlotId = slotId;
            this.hideSaveModal();
            this.showToast(`游戏已保存到槽位 ${slotId}`);
        } else {
            this.showToast('保存失败');
        }
    },

    /**
     * V2.6 显示保险选择模态框
     */
    showHealthPlanModal() {
        const state = game.getState();
        const currentId = state.insurance.healthPlanId;

        // 创建模态框 DOM
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';

        const content = document.createElement('div');
        content.className = 'modal-content';

        content.innerHTML = `
            <div class="modal-header">
                <h3>选择健康保险计划</h3>
                <button id="close-modal-btn">❌</button>
            </div>
            <div style="padding: 10px; background: rgba(255, 165, 2, 0.1); border-radius: 8px; margin-bottom: 10px; font-size: 0.9em; color: #ffa502;">
                ⏳ <strong>下月生效</strong>：申请将于下一个账单日生效。在此之前维持原计划。
            </div>
            <div class="modal-body" id="plan-list"></div>
        `;

        content.querySelector('#close-modal-btn').onclick = () => overlay.remove();

        const listContainer = content.querySelector('#plan-list');
        const plans = GameData.insuranceSystem.healthPlans;

        // 遍历所有计划
        for (const [id, plan] of Object.entries(plans)) {
            // 过滤：如果有工作，显示该工作的雇主计划；或者显示市场计划
            // 简单起见，显示所有市场计划 + 符合条件的雇主计划

            let isAllowed = false;
            if (plan.type === 'marketplace' || plan.type === 'none') isAllowed = true;
            if (plan.type === 'employer' && state.job === 'fulltime') isAllowed = true;
            if (plan.type === 'government') isAllowed = true;

            if (!isAllowed) continue;

            const card = document.createElement('div');
            card.className = `plan-option-card ${id === currentId ? 'active' : ''}`;
            card.innerHTML = `
                <h4>${this.resolveText(plan.name)}</h4>
                <div class="plan-price">保费: $${plan.monthlyPremium}/月</div>
                <div class="plan-details">
                    <span>免赔: $${plan.deductible}</span>
                    <span>共保: ${(plan.coinsurance * 100).toFixed(0)}%</span>
                </div>
                <div class="plan-desc">${this.resolveText(plan.description, plan.monthlyPremium, plan.deductible)}</div>
            `;

            card.addEventListener('click', () => {
                this.selectHealthPlan(id);
                overlay.remove();
            });

            listContainer.appendChild(card);
        }

        overlay.appendChild(content);
        document.body.appendChild(overlay);
        this.modal = overlay;
    },

    /**
     * V2.6 选择新计划 (支持撤销)
     */
    selectHealthPlan(planId) {
        const state = game.getState();

        // 如果选的是当前的
        if (state.insurance.healthPlanId === planId) {
            // 如果之前有 pending，说明想撤销
            if (state.insurance.pendingHealthPlanId) {
                state.insurance.pendingHealthPlanId = null;
                this.showToast(I18n.t('ui.toast.undoChangeRequest'));
                this.renderInsurancePage();
                this.updateStatusBar(game.getStatusDescription());
                return;
            } else {
                this.showToast(I18n.t('ui.toast.isCurrentPlan'));
                return;
            }
        }

        // 设置为待变更
        state.insurance.pendingHealthPlanId = planId;
        const planName = this.resolveText(GameData.insuranceSystem.healthPlans[planId].name);
        this.showToast(I18n.t('ui.toast.changeSubmitted', planName));
        this.renderInsurancePage();
        this.updateStatusBar(game.getStatusDescription());
    },

    /**
     * V2.24 切换租客保险 (下月生效 + 撤销逻辑)
     */
    toggleRentersInsurance() {
        const state = game.getState();
        const currentStatus = state.insurance.hasRentersInsurance;

        let targetStatus;
        // 如果有 pending，逻辑反转：
        // 比如 current=T, pending=F (想取消). 再次点击 -> 想恢复T -> 撤销
        // current=F, pending=T (想买). 再次点击 -> 想恢复F -> 撤销

        if (state.insurance.pendingRentersStatus !== null) {
            // 有 pending，说明用户想改变主意
            const pending = state.insurance.pendingRentersStatus;

            // 如果当前 pending 的目标就是 "非当前状态" (正常情况)，现在再次点击意味着想回到 "当前状态"
            // 即撤销 pending
            state.insurance.pendingRentersStatus = null;
            this.showToast(I18n.t('ui.toast.changeRevoked'));
        } else {
            // 无 pending，创建申请
            state.insurance.pendingRentersStatus = !currentStatus;
            this.showToast(I18n.t('ui.toast.nextMonthActive'));
        }

        this.renderInsurancePage();
        this.updateStatusBar(game.getStatusDescription());
    },

    /**
     * V2.24 显示车险选择模态框
     */
    showCarPlanModal() {
        const state = game.getState();
        const currentId = state.insurance.carPlanId;

        // 创建模态框 DOM
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';

        const content = document.createElement('div');
        content.className = 'modal-content';

        content.innerHTML = `
            <div class="modal-header">
                <h3>选择汽车保险方案</h3>
                <button id="close-modal-btn">❌</button>
            </div>
            <div style="padding: 10px; background: rgba(46, 213, 115, 0.1); border-radius: 8px; margin-bottom: 10px; font-size: 0.9em; color: #2ed573;">
                ⏳ <strong>下月生效</strong>：切换方案后，将于下一个账单日生效。维修费用按出险时的即时计划结算。
            </div>
            <div class="modal-body" id="plan-list"></div>
        `;

        content.querySelector('#close-modal-btn').onclick = () => overlay.remove();

        const listContainer = content.querySelector('#plan-list');
        const plans = GameData.insuranceSystem.carPlans;

        // 遍历所有方案
        for (const [id, plan] of Object.entries(plans)) {
            const card = document.createElement('div');
            card.className = `plan-option-card ${id === currentId ? 'active' : ''}`;
            card.innerHTML = `
                <h4>${this.resolveText(plan.name)}</h4>
                <div class="plan-price">保费: $${plan.monthlyPremium}/月</div>
                <div class="plan-desc">${I18n.t('data.carInsuranceDescriptions.' + id, plan.deductible)}</div>
            `;

            card.addEventListener('click', () => {
                this.selectCarPlan(id);
                overlay.remove();
            });

            listContainer.appendChild(card);
        }

        overlay.appendChild(content);
        document.body.appendChild(overlay);
        this.modal = overlay;
    },


    /**
     * V2.XX 显示住所详情模态框
     */
    showHousingDetailModal() {
        const state = game.getState();
        const houseId = state.housing;
        const houseInfo = GameData.housingTypes[houseId];

        if (!houseInfo) return;

        // 创建模态框 DOM
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.id = 'housing-detail-overlay';

        const content = document.createElement('div');
        content.className = 'modal-content';
        content.style.maxWidth = '400px';

        const name = this.resolveText(houseInfo.name);
        const cost = houseInfo.cost;
        let effects = [];

        if (houseInfo.energyRecovery !== 0) {
            const sign = houseInfo.energyRecovery > 0 ? '+' : '';
            effects.push({
                label: I18n.t('ui.status.energyRec'),
                value: `${sign}${houseInfo.energyRecovery}`,
                class: houseInfo.energyRecovery > 0 ? 'positive' : 'negative'
            });
        }
        if (houseInfo.mentalBonus !== 0) {
            const sign = houseInfo.mentalBonus > 0 ? '+' : '';
            effects.push({
                label: I18n.t('ui.status.mental'),
                value: `${sign}${houseInfo.mentalBonus}`,
                class: houseInfo.mentalBonus > 0 ? 'positive' : 'negative'
            });
        }
        if (houseInfo.healthBonus !== 0) {
            const sign = houseInfo.healthBonus > 0 ? '+' : '';
            effects.push({
                label: I18n.t('ui.status.health'),
                value: `${sign}${houseInfo.healthBonus}`,
                class: houseInfo.healthBonus > 0 ? 'positive' : 'negative'
            });
        }

        // 构建 HTML
        let effectsHtml = '';
        if (effects.length > 0) {
            effectsHtml = `
                <div style="margin-top: 15px; margin-bottom: 5px; font-weight: bold; border-bottom: 1px solid var(--color-border); padding-bottom: 5px;">效果加成</div>
                <div class="stat-grid" style="grid-template-columns: 1fr 1fr; gap: 10px;">
                    ${effects.map(e => `
                        <div class="stat-item">
                            <span class="stat-label">${e.label}</span>
                            <span class="stat-val ${e.class}">${e.value}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        } else {
            effectsHtml = `<div style="margin-top: 15px; color: var(--color-text-muted);">${I18n.t('ui.status.noEffect')}</div>`;
        }

        const desc = I18n.t(`data.housing.${houseId}.description`) || '';

        content.innerHTML = `
            <div class="modal-header">
                <h3>${name}</h3>
                <button id="close-housing-modal">❌</button>
            </div>
            <div class="modal-body">
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">
                    <span>每月房租</span>
                    <span class="money danger">$${cost.toLocaleString()}</span>
                </div>
                ${effectsHtml}
                 ${desc ? `<div style="margin-top: 15px; font-size: 0.9em; line-height: 1.4; color: var(--color-text-secondary);">${desc}</div>` : ''}
            </div>
             <div class="modal-footer" style="margin-top: 20px; text-align: right;">
                <button class="primary-button" id="close-housing-btn-bottom">关闭</button>
            </div>
        `;

        // 事件绑定
        const close = () => {
            overlay.classList.add('fade-out'); // Add fade-out animation class if CSS supports it or just remove
            setTimeout(() => overlay.remove(), 200);
        };

        content.querySelector('#close-housing-modal').onclick = close;
        content.querySelector('#close-housing-btn-bottom').onclick = close;
        overlay.onclick = (e) => {
            if (e.target === overlay) close();
        };

        overlay.appendChild(content);
        document.body.appendChild(overlay);
    },

    /**
     * V2.24 选择车险方案 (下月生效 + 撤销逻辑)
     */
    selectCarPlan(planId) {
        const state = game.getState();
        const currentId = state.insurance.carPlanId;

        // 如果选择的计划就是当前的生效计划
        if (currentId === planId) {
            // 如果之前有 pending，说明想撤销
            if (state.insurance.pendingCarPlanId) {
                state.insurance.pendingCarPlanId = null;
                this.showToast('已撤销变更申请，维持当前计划');
                this.renderInsurancePage();
                this.updateStatusBar(game.getStatusDescription());
                return;
            } else {
                this.showToast('这是你当前的方案');
                return;
            }
        }

        // 设置待变更
        state.insurance.pendingCarPlanId = planId;
        const plan = GameData.insuranceSystem.carPlans[planId];
        this.showToast(`申请已提交: ${this.resolveText(plan.name)} (下月生效)`);
        this.renderInsurancePage();
        this.updateStatusBar(game.getStatusDescription());
    },

    /**
     * V2.40 账单详情模态框
     */
    showBillDetailModal() {
        if (!this.elements.billDetailModal) return;

        const state = game.getState();
        const list = this.elements.billDetailList;
        list.innerHTML = '';

        let total = 0;

        // 1. 房租
        const rentCost = state.housingCost;
        const rentDays = state.daysUntilRent;
        total += rentCost;
        this.createBillRow(list, I18n.t('ui_static.bill_detail.rent'), rentCost, rentDays);

        // 2. 保险
        const insCost = game.calculateMonthlyInsuranceCost
            ? game.calculateMonthlyInsuranceCost()
            : 0;
        const insDays = state.daysUntilInsurance;
        total += insCost;

        // V2.XX 显示下月生效的保险计划
        let insLabel = I18n.t('ui_static.bill_detail.insurance');
        const pendingChanges = [];

        // 检查健康保险
        if (state.insurance.pendingHealthPlanId) {
            const p = GameData.insuranceSystem.healthPlans[state.insurance.pendingHealthPlanId];
            if (p) pendingChanges.push(this.resolveText(p.name));
        }
        // 检查车险
        if (state.insurance.pendingCarPlanId) {
            const p = GameData.insuranceSystem.carPlans[state.insurance.pendingCarPlanId];
            if (p) pendingChanges.push(this.resolveText(p.name));
        }
        // 检查租客险
        if (state.insurance.pendingRentersStatus !== null) {
            const rTitle = I18n.t('ui.insurance.renters_title').replace('🏠 ', '');
            if (state.insurance.pendingRentersStatus) {
                pendingChanges.push(rTitle);
            } else {
                pendingChanges.push(`${rTitle}(${I18n.t('ui.insurance.nextMonthCancel')})`);
            }
        }

        // 如果有变动，显示提示
        if (pendingChanges.length > 0) {
            const pendingText = `${I18n.t('ui.insurance.nextMonthEffective')}: ${pendingChanges.join(', ')}`;
            insLabel += `<div style="font-size: 0.8em; color: var(--color-text-muted); margin-top: 2px;">${pendingText}</div>`;
        }

        this.createBillRow(list, insLabel, insCost, insDays);

        // 3. 水电 (当前累计)
        const utilCost = Math.round(state.utilityBill);
        const utilDays = state.daysUntilUtility;
        total += utilCost;
        this.createBillRow(list, I18n.t('ui_static.bill_detail.utility'), utilCost, utilDays);

        // 4. 医疗债务分期
        if (state.medicalDebtInstallment && state.medicalDebt > 0) {
            const medCost = GameData.eventConfigs.medical_debt.installment.amount;
            const monthDays = GameData.timeCycle.monthDays;
            const currentMod = state.day % monthDays;
            const medDays = currentMod === 0 ? 0 : (monthDays - currentMod);
            total += medCost;
            this.createBillRow(list, I18n.t('events.medical_debt_installment.title'), medCost, medDays);
        }

        // 总计
        if (this.elements.billDetailTotal) {
            this.elements.billDetailTotal.textContent = `$${total.toLocaleString()}`;
        }

        this.elements.billDetailModal.classList.remove('hidden');
    },

    createBillRow(container, name, amount, days) {
        const row = document.createElement('div');
        row.className = 'bill-detail-row';

        const daysText = days <= 0
            ? `<span class="danger">${I18n.t('ui_static.bill_detail.due_today')}</span>`
            : I18n.t('ui_static.bill_detail.due_in', days);

        row.innerHTML = `
            <div class="row-left">
                <span class="bill-name">${name}</span>
                <span class="bill-days">${daysText}</span>
            </div>
            <div class="row-right">
                <span class="bill-amount">$${amount.toLocaleString()}</span>
            </div>
        `;
        container.appendChild(row);
    },

    /**
     * 更新背景（根据时段）
     */
    updateBackground(period) {
        this.elements.gameBackground.className = period;
    },

    /**
     * 更新状态栏
     */
    updateStatusBar(status, stateOverride = null) {
        const state = stateOverride || game.getState();
        const isPreview = !!stateOverride;

        // 金额
        this.elements.moneyValue.textContent = status.money;
        this.elements.moneyValue.classList.toggle('danger', status.money.startsWith('-'));

        // Investment Value
        if (this.elements.investmentValue) {
            const prices = state.marketPrices || {};
            const holdings = state.holdings || {};
            let portfolioValue = 0;
            let totalCost = 0;
            Object.keys(holdings).forEach(id => {
                const holding = holdings[id];
                if (holding && prices[id]) {
                    portfolioValue += holding.quantity * prices[id].price;
                    totalCost += holding.quantity * (holding.avgCost || 0);
                }
            });

            let returnRate = 0;
            if (totalCost > 0) {
                returnRate = ((portfolioValue - totalCost) / totalCost) * 100;
            }

            const sign = returnRate >= 0 ? '+' : '';
            const rateStr = `(${sign}${returnRate.toFixed(1)}%)`;
            const color = returnRate >= 0 ? 'var(--color-success)' : 'var(--color-danger)';
            const neutralColor = 'var(--color-text-secondary)';

            // 使用 span 来给百分比上色
            // this.elements.investmentValue 是个 span，里面可以放 html
            // 但是要注意 resolveText 或 innerHTML 的使用
            const label = I18n.t('ui_static.finance.investment');
            const valueStr = `$${portfolioValue.toLocaleString()}`;

            // 如果只有 0 资产，显示淡色
            if (portfolioValue === 0) {
                this.elements.investmentValue.innerHTML = `${label}: <span style="color: ${neutralColor}">${valueStr}</span>`;
            } else {
                this.elements.investmentValue.innerHTML = `${label}: ${valueStr} <span style="color: ${color}; font-size: 0.9em; margin-left: 4px;">${rateStr}</span>`;
            }
        }

        // 住所
        this.elements.housingValue.textContent = status.housing;

        // 工作
        this.elements.jobValue.textContent = status.job;

        // 精力条
        this.elements.energyBar.style.width = `${status.energy}%`;
        if (this.elements.energyVal) {
            this.elements.energyVal.textContent = `${Math.round(status.energy)}/100`;
        }

        // 低精力警告
        // 低精力警告
        const statusBar = document.getElementById('dashboard-stats');
        if (statusBar) {
            statusBar.classList.toggle('low-energy', status.isLowEnergy);
        }

        // 精神条
        this.elements.mentalBar.style.width = `${status.mental}%`;
        if (this.elements.mentalVal) {
            const maxMental = state.maxMental || 100;
            this.elements.mentalVal.textContent = `${Math.round(status.mental)}/${maxMental}`;
        }

        // 健康条
        this.elements.healthBar.style.width = `${status.health}%`;
        if (this.elements.healthVal) {
            const hStatus = state.healthStatus || 'normal';
            const statusText = I18n.t(`data.healthStatuses.${hStatus}`);
            this.elements.healthVal.textContent = `${statusText} ${Math.round(status.health)}/100`;
        }

        // Social
        if (this.elements.socialBar) {
            const social = state.socialValue !== undefined ? state.socialValue : 50;
            this.elements.socialBar.style.width = `${social}%`;
            // Color gradient for social logic could be added here if needed, for now standard
            // this.elements.socialBar.style.background = 'linear-gradient(90deg, #a29bfe, #6c5ce7)'; 

            if (this.elements.socialVal) {
                this.elements.socialVal.textContent = `${Math.round(social)}/100`;
            }
        }

        // Work Efficiency
        if (this.elements.workEfficiencyBar) {
            const efficiency = state.workEfficiency !== undefined ? state.workEfficiency : 0;
            const max = state.maxWorkEfficiency || 100; // Default to 100 if not set
            // Calculate percentage based on max
            const percent = Math.max(0, Math.min(100, (efficiency / max) * 100));

            this.elements.workEfficiencyBar.style.width = `${percent}%`;

            if (this.elements.workEfficiencyVal) {
                this.elements.workEfficiencyVal.textContent = `${Math.round(efficiency)}%`;
            }
        }

        // 更新财务信息面板 (V2.1)
        if (this.elements.paydayCountdown) {
            // 无论是否失业，都显示发薪日卡片（失业时显示月薪$0，不显示倒计时）
            if (this.elements.paydayContainer) this.elements.paydayContainer.style.display = 'flex';

            if (status.jobId === 'unemployed' || status.jobId === 'fired') {
                this.elements.paydayCountdown.textContent = '';
                this.elements.paydayCountdown.className = 'finance-sub';
            } else {
                this.elements.paydayCountdown.textContent = `${status.daysUntilPayday}天`;
                this.elements.paydayCountdown.className = 'finance-sub' + (status.daysUntilPayday <= 3 ? ' danger' : (status.daysUntilPayday <= 7 ? ' warning' : ''));
            }
        }

        // Monthly Bill (Merged)
        const rentCost = state.housingCost;
        const rentDays = state.daysUntilRent;

        const insCost = game.calculateMonthlyInsuranceCostForState
            ? game.calculateMonthlyInsuranceCostForState(state)
            : game.calculateMonthlyInsuranceCost();
        const insDays = state.daysUntilInsurance;

        const utilCost = Math.round(state.utilityBill || 0);
        const utilDays = state.daysUntilUtility;

        let totalMonthlyBill = rentCost + insCost + utilCost;
        let medicalCost = 0;
        let medicalDays = 999;

        if (state.medicalDebtInstallment && state.medicalDebt > 0) {
            medicalCost = GameData.eventConfigs.medical_debt.installment.amount;
            // Calculate days until next installment (based on monthDays cycle)
            const monthDays = GameData.timeCycle.monthDays;
            const currentMod = state.day % monthDays;
            // If currentMod is 0, it means today is the day (paid or checking), so next is in monthDays
            // Or if it's strictly upcoming, it's monthDays - currentMod.
            // Let's assume consistent with rent logic.
            medicalDays = currentMod === 0 ? 0 : (monthDays - currentMod);
            totalMonthlyBill += medicalCost;
        }

        // Find nearest due date
        const nearestDays = Math.min(rentDays, insDays, utilDays, medicalDays);

        if (this.elements.monthlyBillTotal) {
            this.elements.monthlyBillTotal.textContent = `$${totalMonthlyBill.toLocaleString()}`;
        }
        if (this.elements.monthlyBillSub) {
            this.elements.monthlyBillSub.textContent = I18n.t('ui_static.finance.next_bill_days', nearestDays);

            // Color coding
            if (nearestDays <= 2) {
                this.elements.monthlyBillSub.className = 'finance-sub danger';
            } else if (nearestDays <= 5) {
                this.elements.monthlyBillSub.className = 'finance-sub warning';
            } else {
                this.elements.monthlyBillSub.className = 'finance-sub';
            }
        }

        if (this.elements.monthlyIncomeDisplay) {
            const jobInfo = GameData.jobTypes[status.jobId] || { income: 0 };
            const income = jobInfo.income > 0
                ? (typeof status.monthlyIncome === 'number' ? status.monthlyIncome : jobInfo.income)
                : 0;
            this.elements.monthlyIncomeDisplay.textContent = `$${income.toLocaleString()}`;
        }

        // 更新储备信息
        if (this.elements.ingredientsCount) {
            this.elements.ingredientsCount.textContent = status.ingredients;
            this.elements.ingredientsCount.className = 'finance-value' + (status.ingredients <= 1 ? ' danger' : (status.ingredients <= 3 ? ' warning' : ''));
        }
        if (this.elements.mealStatus) {
            this.elements.mealStatus.textContent = status.hasPreparedMeal ? '✅ 已备' : '❌ 未备';
            this.elements.mealStatus.className = 'finance-value' + (status.hasPreparedMeal ? ' positive' : ' warning');
        }

        // V2.7 任务进度
        // V2.28 住院时的 UI 覆盖 (替换工作任务显示)
        const isHospitalized = (state.hospitalDaysLeft || 0) > 0;

        if (this.elements.taskContainer) {
            const label = this.elements.taskContainer.querySelector('.finance-label');

            if (isHospitalized) {
                // 住院状态显示
                this.elements.taskContainer.style.display = 'flex';
                if (label) label.textContent = '🏥 住院修养';

                if (this.elements.taskProgress) {
                    const pto = game.state.sickLeaveDays || 0;
                    this.elements.taskProgress.textContent = `PTO: ${pto}天`;
                    this.elements.taskProgress.className = 'finance-value' + (pto > 0 ? ' positive' : ' danger');
                }

                if (this.elements.taskDeadline) {
                    this.elements.taskDeadline.textContent = `剩${state.hospitalDaysLeft}天`;
                    this.elements.taskDeadline.className = 'finance-sub';
                }
            } else {
                // 正常工作任务显示
                if (this.elements.taskContainer) {
                    // 隐藏条件: 失业 或 被裁
                    const shouldHide = status.jobId === 'unemployed' || status.jobId === 'fired';

                    if (shouldHide) {
                        this.elements.taskContainer.classList.add('hidden');
                    } else {
                        // 移除 hidden 类
                        this.elements.taskContainer.classList.remove('hidden');
                        // 如果原来是用 style.display 控制的，这里也可以 reset
                        this.elements.taskContainer.style.display = '';

                        if (label) {
                            label.textContent = (status.workTask && status.workTask.name)
                                ? `📋 ${status.workTask.name}`
                                : '📋 工作任务';
                        }

                        if (this.elements.taskProgress && status.workTask) {
                            this.elements.taskProgress.textContent = `${status.workTask.progress}% (${I18n.t('ui_static.finance.difficulty')}: ${status.workTask.difficulty})`;

                            // 更新进度条宽度
                            if (this.elements.taskProgressBar) {
                                this.elements.taskProgressBar.style.width = `${status.workTask.progress}%`;
                                // 可选：根据进度或状态变色
                                // this.elements.taskProgressBar.style.background = ...
                            }

                            // 进度颜色
                            if (status.workTask.progress >= 80) {
                                this.elements.taskProgress.className = 'finance-value positive';
                            } else if (status.workTask.progress >= 50) {
                                this.elements.taskProgress.className = 'finance-value';
                            } else {
                                this.elements.taskProgress.className = 'finance-value warning';
                            }
                        }

                        if (this.elements.taskDeadline && status.workTask) {
                            const deadline = status.workTask.deadline;
                            if (deadline < 0) {
                                this.elements.taskDeadline.textContent = `超时${Math.abs(deadline)}天`;
                                this.elements.taskDeadline.className = 'finance-sub danger';
                            } else {
                                this.elements.taskDeadline.textContent = `${deadline}天`;
                                this.elements.taskDeadline.className = 'finance-sub' + (deadline <= 2 ? ' danger' : (deadline <= 4 ? ' warning' : ''));
                            }
                        }
                    }
                }
            }
        }

        // V2.35 社交值过低警告 (Main HUD不显示社交条，所以需要Toast提示)
        if (!isPreview) {
            const social = status.socialValue !== undefined ? status.socialValue : 50;
            const socialConfig = GameData.socialCollapseConfig;
            if (social < socialConfig.warningThreshold) {
                // 每天只提示一次
                if (state.lastSocialWarningDay !== status.day) {
                    this.showToast(I18n.t('ui.toast.socialLow'), 'warning');
                    state.lastSocialWarningDay = status.day;
                }
            }
        }

        // V2.41 预览特效
        this.updatePreviewEffects(stateOverride);
    },

    /**
     * V2.41 更新预览特效 (高亮变化的属性卡片)
     */
    updatePreviewEffects(previewState) {
        const currentState = game.getState();
        const targets = [
            { key: 'money', el: this.elements.moneyValue },
            { key: 'energy', el: this.elements.energyBar },
            { key: 'mental', el: this.elements.mentalBar },
            { key: 'health', el: this.elements.healthBar },
            { key: 'socialValue', el: this.elements.socialBar },
            { key: 'workEfficiency', el: this.elements.workEfficiencyBar },
            // V2.42 Right side cards
            { key: 'ingredients', el: this.elements.ingredientsCount },
            { key: 'hasPreparedMeal', el: this.elements.mealStatus, type: 'boolean' },
            { key: 'jobId', el: this.elements.jobValue, type: 'string' },
            { key: 'housingId', el: this.elements.housingValue, type: 'string' },
            { key: 'monthlyIncome', el: this.elements.monthlyIncomeDisplay, derived: true },
            { key: 'totalMonthlyBill', el: this.elements.monthlyBillTotal, derived: true },
            { key: 'taskProgress', el: this.elements.taskContainer, derived: true }
        ];

        targets.forEach(item => {
            if (!item.el) return;
            // 查找最近的卡片容器 (兼容 status-item, finance-item 和 dashboard-task)
            const card = item.el.id === 'dashboard-task' ? item.el : item.el.closest('.status-item, .finance-item');
            if (!card) return;

            // 清除旧状态
            card.classList.remove('preview-up', 'preview-down');

            if (!previewState) return;

            // 获取数值进行比较
            const key = item.key;
            // 处理默认值
            const getVal = (obj, k) => {
                if (item.derived) {
                    // 特殊处理计算属性
                    if (k === 'totalMonthlyBill') {
                        const rent = obj.housingCost || 0;
                        const util = obj.utilityBill || 0;
                        // Insurance is tricky without full game object, try to approximation or rely on state properties
                        // For preview, we often just want differential. 
                        // Simplified: If housing cost or utility bill changes.
                        // Ideally we call game.calculateMonthlyInsuranceCostForState(obj) but 'game' context might differ.
                        // Let's rely on the properties directly on state if available.
                        // Assuming previewState mimics real state structure.
                        let ins = 0;
                        if (game.calculateMonthlyInsuranceCostForState) {
                            ins = game.calculateMonthlyInsuranceCostForState(obj);
                        }
                        return rent + util + ins;
                    }
                    if (k === 'monthlyIncome') {
                        if (obj.monthlyIncome !== undefined) return obj.monthlyIncome;
                        // Fallback to job income
                        const jId = obj.jobId || 'unemployed';
                        const jInfo = GameData.jobTypes[jId] || {};
                        return jInfo.income || 0;
                    }
                    if (k === 'taskProgress') {
                        return (obj.workTask && obj.workTask.progress !== undefined) ? obj.workTask.progress : 0;
                    }
                }

                if (obj[k] !== undefined) return obj[k];
                if (k === 'socialValue') return 50;
                if (k === 'workEfficiency') return 100;
                return 0;
            };

            const currentVal = getVal(currentState, key);
            const previewVal = getVal(previewState, key);

            // 比较逻辑
            if (item.type === 'string') {
                if (currentVal !== previewVal) {
                    // 字符串变化通常一律高亮为绿色(提示变化)，除非有明确好坏
                    card.classList.add('preview-up');
                }
            } else if (item.type === 'boolean') {
                if (currentVal !== previewVal) {
                    // Boolean flipped
                    if (key === 'hasPreparedMeal' && previewVal === true) {
                        card.classList.add('preview-up'); // 有饭了 -> 好
                    } else if (key === 'hasPreparedMeal' && previewVal === false) {
                        card.classList.add('preview-down'); // 没饭了 -> 坏
                    } else {
                        card.classList.add('preview-up');
                    }
                }
            } else {
                // Numeric
                // 精度容差
                if (Math.abs(previewVal - currentVal) > 0.01) {
                    if (previewVal > currentVal) {
                        // Bill increased = Bad
                        if (key === 'totalMonthlyBill') {
                            card.classList.add('preview-down');
                        } else {
                            card.classList.add('preview-up');
                        }
                    } else {
                        // Bill decreased = Good
                        if (key === 'totalMonthlyBill') {
                            card.classList.add('preview-up');
                        } else {
                            card.classList.add('preview-down');
                        }
                    }
                }
            }
        });
    },

    /**
     * V2.45 Dev Editor
     */
    showDevEditor() {
        const modal = document.getElementById('dev-editor-modal');
        if (!modal) return;

        const state = game.getState();
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val;
        };

        setVal('dev-input-money', state.money);
        setVal('dev-input-energy', state.energy);
        setVal('dev-input-mental', state.mental);
        setVal('dev-input-health', state.health);
        setVal('dev-input-social', state.socialValue !== undefined ? state.socialValue : 50);
        setVal('dev-input-efficiency', state.workEfficiency !== undefined ? state.workEfficiency : 100);
        setVal('dev-input-ingredients', state.ingredients || 0);

        modal.classList.remove('hidden');
        this.activeModal = modal;
    },

    bindDevEditorEvents() {
        const btn = document.getElementById('dev-edit-btn');
        if (btn) {
            btn.addEventListener('click', () => this.showDevEditor());
        }

        const closeBtn = document.getElementById('close-dev-editor');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const modal = document.getElementById('dev-editor-modal');
                if (modal) modal.classList.add('hidden');
            });
        }

        const saveBtn = document.getElementById('dev-save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const getVal = (id) => Number(document.getElementById(id).value);

                const state = game.getState();
                state.money = getVal('dev-input-money');
                state.energy = Math.min(100, Math.max(0, getVal('dev-input-energy')));
                state.mental = Math.min(100, Math.max(0, getVal('dev-input-mental')));
                state.health = Math.min(100, Math.max(0, getVal('dev-input-health')));
                state.socialValue = Math.min(100, Math.max(0, getVal('dev-input-social')));
                state.workEfficiency = Math.min(Number(state.maxWorkEfficiency || 100), Math.max(0, getVal('dev-input-efficiency')));
                state.ingredients = Math.max(0, getVal('dev-input-ingredients'));

                this.showToast('属性已修改', 'positive');

                const modal = document.getElementById('dev-editor-modal');
                if (modal) modal.classList.add('hidden');

                // Update UI immediately (Status page or Main HUD)
                // Also update status bar explicitly to refresh money display
                this.updateStatusBar(game.getStatusDescription());
                // Force refresh status page if active
                if (document.getElementById('status-screen').classList.contains('active')) {
                    this.renderStatusPage();
                }
            });
        }
    },

    /**
     * 进入下一阶段按钮状态
     */
    setAdvanceStageEnabled(enabled) {
        if (!this.elements.advanceStageButton) return;
        this.elements.advanceStageButton.disabled = !enabled;
        this.elements.advanceStageButton.classList.toggle('disabled', !enabled);
    },

    setAdvanceStageVisible(visible) {
        if (!this.elements.advanceStageButton) return;
        this.elements.advanceStageButton.style.display = visible ? '' : 'none';
    },

    /**
     * 选择按钮高亮（用于“预览中”）
     */
    setSelectedChoice(choiceIndex) {
        if (!this.elements.eventChoices) return;
        const buttons = this.elements.eventChoices.querySelectorAll('.choice-button');
        buttons.forEach(btn => {
            const idx = Number(btn.dataset.index);
            const isSelected = idx === choiceIndex;
            btn.classList.toggle('selected', isSelected);
            btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
        });
    },

    /**
     * 更新时段显示
     */
    updateTimeDisplay(status) {
        // 天数
        let dayText = `第 ${status.day} 天`;
        if (status.day <= GameData.newbieProtectionDays) {
            dayText += ' (新手保护期)';
        }
        this.elements.dayCount.textContent = dayText;

        // 时段图标和名称
        this.elements.timeIcon.textContent = status.periodIcon;
        this.elements.periodName.textContent = status.periodName;

        // V2.3 时段指示器（两时段）
        if (this.elements.dotDay) {
            this.elements.dotDay.classList.toggle('active', status.period === 'day');
        }
        this.elements.dotNight.classList.toggle('active', status.period === 'night');

        this.elements.dotNight.classList.toggle('active', status.period === 'night');
    },

    /**
     * V2.XX 检查并显示投资情绪特效
     */
    checkInvestmentEffect() {
        const state = game.getState();
        if (state.pendingInvestmentEffect) {
            const effect = state.pendingInvestmentEffect;
            this.showInvestmentEffect(effect.type, effect.percent);
            state.pendingInvestmentEffect = null; // 消费掉
        }
    },

    /**
     * V2.XX 显示全屏投资情绪特效
     * type: 'boom' | 'crash'
     */
    showInvestmentEffect(type, percent) {
        const overlay = document.createElement('div');
        overlay.className = 'investment-mood-overlay ' + type;

        // 标题和 emoji
        const title = type === 'boom' ? '🚀 资产暴涨!' : '📉 资产暴跌!';
        const percentStr = (percent * 100).toFixed(1) + '%';
        const emojiList = type === 'boom' ? ['🚀', '📈', '💰', '🤑', '🔥'] : ['📉', '💸', '⛈️', '😭', '🥀'];

        overlay.innerHTML = `
            <div class="mood-content">
                <div class="mood-title">${title}</div>
                <div class="mood-percent">${percentStr}</div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 播放音效
        AudioManager.play(type === 'boom' ? 'achievement' : 'game_over');

        // 生成漂浮 Emoji
        const createEmoji = () => {
            const el = document.createElement('div');
            el.className = 'mood-emoji';
            el.textContent = emojiList[Math.floor(Math.random() * emojiList.length)];
            el.style.left = Math.random() * 100 + 'vw';
            el.style.animationDuration = (2 + Math.random() * 3) + 's';
            el.style.fontSize = (2 + Math.random() * 3) + 'rem';

            if (type === 'boom') {
                el.style.bottom = '-50px';
                el.style.setProperty('--tx', (Math.random() * 100 - 50) + 'px');
            } else {
                el.style.top = '-50px';
                el.style.setProperty('--tx', (Math.random() * 100 - 50) + 'px');
            }

            overlay.appendChild(el);

            // 动画结束后移除
            setTimeout(() => el.remove(), 5000);
        };

        // 密集生成
        let count = 0;
        const interval = setInterval(() => {
            createEmoji();
            count++;
            if (count > 15) clearInterval(interval);
        }, 100);

        // 2.5秒后淡出移除
        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 500);
        }, 2500);
    },

    /**
     * 渲染午餐选择器 (V2.4)
     */
    renderLunchSelector(state) {
        if (!this.elements.lunchSelector) return;

        if (state.period !== 'day') {
            this.elements.lunchSelector.classList.add('hidden');
            return;
        }

        this.elements.lunchSelector.classList.remove('hidden');
        this.elements.lunchOptions.innerHTML = '';

        // V2.10 使用动态过滤后的午餐选项，增加缓存防止随机项在选择时变化
        if (!state.currentLunchOptions) {
            state.currentLunchOptions = GameEvents.getAvailableLunchOptions(state, { game, rng: game.rng });
        }
        const availableOptions = state.currentLunchOptions;

        for (const option of availableOptions) {
            const key = option.key;
            const button = document.createElement('button');
            const isActive = state.lunchType === key;
            button.className = `lunch-opt-btn ${isActive ? 'active' : ''}`;

            // 检查可用性
            const isDisabled = option.disabled;
            button.disabled = isDisabled;

            // 自动回退逻辑：如果选中的策略不再可用 (且不是因为钱，例如卖光了)，切回快餐
            if (isActive && isDisabled && !option.hint.includes('余额不足')) {
                setTimeout(() => {
                    state.lunchType = 'fastfood';
                    this.renderLunchSelector(state);
                }, 0);
                return;
            }

            button.innerHTML = `
                <span class="lunch-opt-name">${option.name}</span>
                <span class="lunch-opt-hint">${option.hint}</span>
            `;

            button.onclick = () => {
                AudioManager.play('click'); // V2.42 Sound Effect
                state.lunchType = key;
                this.renderLunchSelector(state);
                this.updateMainButtonsState(state); // Update buttons
                console.log(`[UI] 午餐变更为: ${key}`);
                window.dispatchEvent(new CustomEvent('ks:subchoiceChanged'));
            };

            this.elements.lunchOptions.appendChild(button);
        }
    },

    /**
     * V2.21 渲染通勤方式选择器
     */
    renderCommuteSelector(state) {
        if (!this.elements.commuteSelector) return;

        // 仅工作日白天显示
        const isWorkDay = state.job === 'fulltime' && state.day % GameData.timeCycle.weekDays !== GameData.timeCycle.restDayMod;
        if (!isWorkDay || state.period !== 'day') {
            this.elements.commuteSelector.classList.add('hidden');
            return;
        }

        this.elements.commuteSelector.classList.remove('hidden');
        this.elements.commuteOptions.innerHTML = '';

        // 获取可用通勤选项（带缓存）
        if (!state.currentCommuteOptions) {
            state.currentCommuteOptions = GameEvents.getAvailableCommuteOptions(state, { game, rng: game.rng });
        }
        const availableOptions = state.currentCommuteOptions;

        for (const option of availableOptions) {
            const key = option.key;
            const button = document.createElement('button');
            const isActive = state.selectedCommute === key;
            button.className = `lunch-opt-btn ${isActive ? 'active' : ''}`;

            const isDisabled = option.disabled;
            button.disabled = isDisabled;

            button.innerHTML = `
                <span class="lunch-opt-name">${option.name}</span>
                <span class="lunch-opt-hint">${option.hint}</span>
            `;

            button.onclick = () => {
                AudioManager.play('click'); // V2.42 Sound Effect
                state.selectedCommute = key;
                this.renderCommuteSelector(state);
                this.updateMainButtonsState(state);
                console.log(`[UI] 通勤方式变更为: ${key}`);
                window.dispatchEvent(new CustomEvent('ks:subchoiceChanged'));
            };

            this.elements.commuteOptions.appendChild(button);
        }
    },

    /**
     * 渲染日常行动选择器 (V2.10)
     */
    renderDailyActionSelector(state) {
        if (!this.elements.dailyActionSelector) return;

        if (!state.currentDailyActions) {
            state.currentDailyActions = GameEvents.getAvailableDailyActions(state, { game, rng: game.rng });
        }
        const actions = state.currentDailyActions;
        // 如果只有 "无" 或者不是白天，则隐藏
        if (actions.length <= 1 || state.period !== 'day') {
            this.elements.dailyActionSelector.classList.add('hidden');
            return;
        }

        this.elements.dailyActionSelector.classList.remove('hidden');
        this.elements.dailyActionOptions.innerHTML = '';

        actions.forEach(action => {
            const button = document.createElement('button');
            const isActive = state.selectedDailyAction === (action.id || action.text);
            button.className = `lunch-opt-btn ${isActive ? 'active' : ''}`;

            const hintText = typeof action.hint === 'function' ? action.hint(state) : action.hint;
            button.innerHTML = `
                <span class="lunch-opt-name">${action.text}</span>
                <span class="lunch-opt-hint">${hintText}</span>
            `;

            button.onclick = (e) => {
                e.stopPropagation();
                AudioManager.play('click'); // V2.42 Sound Effect
                state.selectedDailyAction = action.id || action.text;
                this.renderDailyActionSelector(state);
                this.updateMainButtonsState(state); // Update buttons
                window.dispatchEvent(new CustomEvent('ks:subchoiceChanged'));
            };

            this.elements.dailyActionOptions.appendChild(button);
        });
    },

    /**
     * 渲染突发事件选择器 (V2.10)
     */
    renderIncidentSelector(state) {
        if (!this.elements.incidentSelector) return;

        // 如果没有活跃的突发事件，尝试获取
        if (!state.activeIncidents) {
            state.activeIncidents = GameEvents.getAvailableIncidents(state, { game, rng: game.rng });
        }

        if (!state.activeIncidents || state.activeIncidents.length === 0 || state.period !== 'day') {
            this.elements.incidentSelector.classList.add('hidden');
            return;
        }

        this.elements.incidentSelector.classList.remove('hidden');
        this.elements.incidentOptions.innerHTML = '';

        state.activeIncidents.forEach(incident => {
            const container = document.createElement('div');
            container.className = 'incident-control-group';
            container.innerHTML = `<div class="lunch-selector-label">${incident.title}</div>`;

            const btnGroup = document.createElement('div');
            btnGroup.className = 'lunch-options';
            // 修复 V2.10: 突发事件强制使用垂直布局，确保文字不换行且按钮占满宽度
            btnGroup.style.display = 'flex';
            btnGroup.style.flexDirection = 'column';
            btnGroup.style.width = '100%';
            btnGroup.style.gridTemplateColumns = 'none';

            incident.choices.forEach(choice => {
                const button = document.createElement('button');
                const uniqueId = `${incident.id}:${choice.id}`;
                const isActive = state.selectedIncident === uniqueId;
                button.className = `lunch-opt-btn ${isActive ? 'active' : ''}`;
                // 确保按钮占满整行
                button.style.width = '100%';

                const incidentHint = typeof choice.hint === 'function' ? choice.hint(state) : choice.hint;
                button.innerHTML = `
                    <span class="lunch-opt-name">${choice.text}</span>
                    <span class="lunch-opt-hint">${incidentHint}</span>
                `;

                button.onclick = (e) => {
                    e.stopPropagation();
                    AudioManager.play('click'); // V2.42 Sound Effect
                    state.selectedIncident = uniqueId;
                    this.renderIncidentSelector(state);
                    this.updateMainButtonsState(state); // Update buttons
                    window.dispatchEvent(new CustomEvent('ks:subchoiceChanged'));
                };
                btnGroup.appendChild(button);
            });
            container.appendChild(btnGroup);
            this.elements.incidentOptions.appendChild(container);
        });
    },

    /**
     * V2.10 更新主事件按钮状态 (强制选择)
     */
    updateMainButtonsState(state) {
        if (!this.elements.eventChoices) return;
        const choiceButtons = this.elements.eventChoices.querySelectorAll('.choice-button');

        // 校验逻辑
        let isValid = true;
        const missing = [];

        // 1. 检查午餐 (仅白天且显示时)
        if (state.period === 'day' && this.elements.lunchSelector && !this.elements.lunchSelector.classList.contains('hidden')) {
            if (!state.lunchType) {
                isValid = false;
                missing.push('午餐');
            }
        }

        // 2. 检查日常 (仅白天且显示时)
        if (state.period === 'day' && this.elements.dailyActionSelector && !this.elements.dailyActionSelector.classList.contains('hidden')) {
            if (!state.selectedDailyAction) {
                isValid = false;
                missing.push('额外行动');
            }
        }

        // 3. 检查通勤 (仅白天工作日且显示时)
        if (state.period === 'day' && this.elements.commuteSelector && !this.elements.commuteSelector.classList.contains('hidden')) {
            if (!state.selectedCommute) {
                isValid = false;
                missing.push('通勤方式');
            }
        }

        // 4. 检查突发 (仅白天且显示时)
        if (state.period === 'day' && this.elements.incidentSelector && !this.elements.incidentSelector.classList.contains('hidden')) {
            if (!state.selectedIncident) {
                isValid = false;
                missing.push('突发状况');
            }
        }

        // 更新按钮状态
        // V2.38 预览模式：主选项允许点击以预览；是否可进入下一阶段由控制器决定
        this.mainChoiceValid = isValid;
        choiceButtons.forEach(btn => {
            if (!isValid) {
                btn.title = `可预览。开始时间流逝前请先选择: ${missing.join(', ')}`;
            } else {
                btn.title = '';
            }
        });

        // V2.13 更新验证提示区域
        if (this.elements.choiceValidationHint) {
            if (!isValid && missing.length > 0) {
                this.elements.choiceValidationHint.classList.remove('hidden');
                const hintText = this.elements.choiceValidationHint.querySelector('.hint-text');
                if (hintText) {
                    hintText.textContent = `请先选择: ${missing.join('、')}`;
                }
            } else {
                this.elements.choiceValidationHint.classList.add('hidden');
            }
        }
    },

    /**
     * 显示事件
     */
    showEvent(event, state) {
        // 进入下一阶段时，自动重置滚动条到顶部
        window.scrollTo(0, 0);
        const scrollContainer = document.getElementById('main-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTop = 0;
        }

        // 随机/插入事件：不显示“进入下一阶段”按钮（点击选项直接推进）
        const isRandomEncounter = !!(event.isRandom || event.isRandomEncounter);
        // V2.XX: Random events also need manual confirmation
        this.autoAdvanceOnChoice = false;
        this.setAdvanceStageVisible(true);

        if (isRandomEncounter) {
            // V2.42: 随机事件/队列插队事件不显示日常侧边栏
            if (this.elements.commuteSelector) this.elements.commuteSelector.classList.add('hidden');
            if (this.elements.lunchSelector) this.elements.lunchSelector.classList.add('hidden');
            if (this.elements.dailyActionSelector) this.elements.dailyActionSelector.classList.add('hidden');
            if (this.elements.incidentSelector) this.elements.incidentSelector.classList.add('hidden');
        } else {
            // V2.21 渲染通勤选择
            this.renderCommuteSelector(state);
            // V2.4 渲染午餐选择
            this.renderLunchSelector(state);
            // V2.10 渲染日常和突发事件
            this.renderDailyActionSelector(state);
            this.renderIncidentSelector(state);
        }

        // 初始检查按钮状态
        setTimeout(() => this.updateMainButtonsState(state), 0);

        const eventTypeInfo = GameData.eventTypes[event.type] || GameData.eventTypes.daily;

        // 事件类型
        this.elements.eventType.textContent = `${eventTypeInfo.icon} ${this.resolveText(eventTypeInfo.name)}`;
        this.elements.eventType.style.color = eventTypeInfo.color;

        // 精力消耗提示
        if (event.energyCost) {
            this.elements.eventEnergyCost.textContent = `⚡ -${event.energyCost}`;
            this.elements.eventEnergyCost.style.display = 'flex';
        } else {
            this.elements.eventEnergyCost.style.display = 'none';
        }

        // 标题和描述
        this.elements.eventTitle.textContent = typeof event.title === 'function'
            ? event.title(state)
            : event.title;

        this.elements.eventDescription.textContent = typeof event.description === 'function'
            ? event.description(state)
            : event.description;

        // 生成选项
        this.elements.eventChoices.innerHTML = '';

        event.choices.forEach((choice, index) => {
            // 检查选项条件
            if (choice.condition && !choice.condition(state)) {
                return;
            }

            const button = document.createElement('button');
            button.className = 'choice-button';
            button.dataset.index = index;

            // 文本
            const textSpan = document.createElement('span');
            textSpan.className = 'choice-text';
            textSpan.textContent = choice.text;
            button.appendChild(textSpan);

            // 元信息区域
            const metaDiv = document.createElement('div');
            metaDiv.className = 'choice-meta';

            // 提示
            if (choice.hint) {
                const hintSpan = document.createElement('span');
                hintSpan.className = `choice-hint ${choice.hintType || ''}`;
                // 支持动态提示
                hintSpan.textContent = typeof choice.hint === 'function'
                    ? choice.hint(state)
                    : choice.hint;
                metaDiv.appendChild(hintSpan);
            }

            // 精力消耗
            if (choice.energyCost) {
                const energySpan = document.createElement('span');
                energySpan.className = 'choice-hint energy';
                energySpan.textContent = `⚡ -${choice.energyCost}`;
                metaDiv.appendChild(energySpan);
            }

            if (metaDiv.children.length > 0) {
                button.appendChild(metaDiv);
            }

            this.elements.eventChoices.appendChild(button);
        });

        // 动画
        this.elements.eventCard.style.animation = 'none';
        this.elements.eventCard.offsetHeight;
        this.elements.eventCard.style.animation = 'cardIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    },

    /**
     * 显示Toast
     */
    showToast(message, type = 'neutral') {
        // 支持换行符和HTML格式
        if (message === undefined || message === null) return;
        const msgStr = String(message);
        this.elements.toastText.innerHTML = msgStr.replace(/\n/g, '<br>');
        this.elements.messageToast.className = `toast ${type}`;

        setTimeout(() => {
            this.elements.messageToast.classList.add('hidden');
        }, 4500);
    },

    /**
     * 屏幕震动
     */
    shakeScreen() {
        const container = document.getElementById('game-container');
        container.classList.add('shake');
        setTimeout(() => container.classList.remove('shake'), 500);
    },

    /**
     * 显示结局
     */
    showEnding(ending, finalStats) {
        if (ending.isVictory) {
            this.elements.endingContent.classList.add('victory');
        } else {
            this.elements.endingContent.classList.remove('victory');
        }

        this.elements.endingTitle.textContent = ending.title;
        this.elements.endingSubtitle.textContent = ending.subtitle;

        this.elements.endingStats.innerHTML = `
            <div class="stat-row">
                <span class="stat-label">${I18n.t('ui_static.ending_stats.days')}</span>
                <span class="stat-value">${finalStats.day} ${I18n.t('ui_static.finance.wait')}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">${I18n.t('ui_static.ending_stats.money')}</span>
                <span class="stat-value">${finalStats.money}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">${I18n.t('ui_static.ending_stats.housing')}</span>
                <span class="stat-value">${finalStats.housing}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">${I18n.t('ui_static.ending_stats.job')}</span>
                <span class="stat-value">${finalStats.job}</span>
            </div>
            <div class="stat-row">
                <span class="stat-label">${I18n.t('ui_static.ending_stats.energy')}</span>
                <span class="stat-value">${finalStats.energy}%</span>
            </div>
        `;

        this.elements.endingMessage.textContent = ending.message;
        this.switchScreen('ending');
    },

    /**
     * V2.9 渲染资产页面 (支持多资产、新闻、分类标签)
     */
    renderAssetsScreen() {
        const state = game.getState();
        if (!state.marketPrices || !state.holdings) return;

        // 当前选中的分类
        this.currentAssetCategory = this.currentAssetCategory || 'commodity';

        // 1. 渲染新闻横幅
        this.renderNewsBanner(state);

        // 2. 渲染市场情绪
        this.renderMarketSentiment(state);

        // 3. 更新总资产摘要
        this.renderAssetsSummary(state);

        // 4. 渲染分类标签
        this.setupAssetTabs();

        // 5. 渲染资产卡片
        this.renderAssetCards(state);
    },

    /**
     * V2.9 渲染新闻横幅
     */
    renderNewsBanner(state) {
        const banner = document.getElementById('news-banner');
        const titleEl = document.getElementById('news-title');
        const descEl = document.getElementById('news-desc');

        if (!banner) return;

        if (state.currentNews) {
            banner.classList.remove('hidden');
            titleEl.textContent = state.currentNews.title;
            descEl.textContent = state.currentNews.description || '';
        } else {
            banner.classList.add('hidden');
        }
    },

    /**
     * V2.9 渲染市场情绪指示器
     */
    renderMarketSentiment(state) {
        const valueEl = document.getElementById('sentiment-value');
        const fillEl = document.getElementById('sentiment-fill');

        if (!valueEl || !fillEl) return;

        const sentiment = state.marketSentiment || 0;

        // 显示文字
        let text = '中性';
        let className = '';
        if (sentiment <= -30) {
            text = '极度恐慌';
            className = 'fear';
        } else if (sentiment < -10) {
            text = '恐慌';
            className = 'fear';
        } else if (sentiment >= 30) {
            text = '极度贪婪';
            className = 'greed';
        } else if (sentiment > 10) {
            text = '贪婪';
            className = 'greed';
        }

        valueEl.textContent = text;
        valueEl.className = 'sentiment-value ' + className;

        // 位置 (从 0% 到 100%，中间是 50%)
        const position = Math.max(0, Math.min(100, 50 + sentiment / 2));
        fillEl.style.left = position + '%';
    },

    /**
     * V2.9 渲染资产摘要
     */
    renderAssetsSummary(state) {
        let portfolioValue = 0;

        // 计算所有持仓总值
        for (const assetId in state.holdings) {
            const holding = state.holdings[assetId];
            const marketData = state.marketPrices[assetId];
            if (holding && marketData) {
                portfolioValue += holding.quantity * marketData.price;
            }
        }

        const totalValue = state.money + portfolioValue;

        const assetsCashEl = document.getElementById('assets-cash');
        const assetsPortfolioEl = document.getElementById('assets-portfolio');
        const assetsTotalEl = document.getElementById('assets-total');

        if (assetsCashEl) assetsCashEl.textContent = '$' + state.money.toLocaleString();
        if (assetsPortfolioEl) assetsPortfolioEl.textContent = '$' + Math.round(portfolioValue).toLocaleString();
        if (assetsTotalEl) assetsTotalEl.textContent = '$' + Math.round(totalValue).toLocaleString();
    },

    /**
     * V2.9 设置分类标签切换
     */
    setupAssetTabs() {
        const tabs = document.querySelectorAll('.asset-tab');

        tabs.forEach(tab => {
            // 更新样式
            tab.classList.toggle('active', tab.dataset.category === this.currentAssetCategory);

            // 绑定点击事件 (只绑定一次)
            if (!tab.dataset.bound) {
                tab.dataset.bound = 'true';
                tab.addEventListener('click', () => {
                    this.currentAssetCategory = tab.dataset.category;
                    this.renderAssetsScreen();
                });
            }
        });
    },

    /**
     * V2.9 渲染资产卡片
     */
    renderAssetCards(state) {
        const container = document.getElementById('asset-cards-container');
        if (!container) return;

        container.innerHTML = '';

        const assetTypes = GameData.assetTypes;
        const category = this.currentAssetCategory;

        // 筛选当前分类的资产
        for (const assetId in assetTypes) {
            const config = assetTypes[assetId];
            if (config.category !== category) continue;

            const holding = state.holdings[assetId];
            const marketData = state.marketPrices[assetId];
            if (!holding || !marketData) continue;

            const card = this.createAssetCard(assetId, config, holding, marketData);
            container.appendChild(card);
        }
    },

    /**
     * V2.9 创建单个资产卡片
     */
    createAssetCard(assetId, config, holding, marketData) {
        const card = document.createElement('div');
        card.className = 'asset-card glass-panel';
        card.dataset.asset = assetId;

        const holdingValue = holding.quantity * marketData.price;
        const profitLoss = holding.quantity > 0 ? (marketData.price - holding.avgCost) * holding.quantity : 0;
        const profitPercent = holding.avgCost > 0 ? ((marketData.price - holding.avgCost) / holding.avgCost * 100).toFixed(1) : 0;

        const changeClass = marketData.change >= 0 ? 'up' : 'down';
        const changeSign = marketData.change >= 0 ? '+' : '';
        const profitClass = profitLoss >= 0 ? 'profit' : 'loss';

        // 格式化价格
        let priceText = '';
        if (marketData.price >= 1000) {
            priceText = '$' + marketData.price.toLocaleString();
        } else if (marketData.price >= 1) {
            priceText = '$' + marketData.price.toFixed(2);
        } else {
            priceText = '$' + marketData.price.toFixed(4);
        }

        card.innerHTML = `
            <div class="asset-header">
                <span class="asset-icon">${config.icon}</span>
                <span class="asset-name">${this.resolveText(config.name)}</span>
                <span class="asset-risk ${config.riskLevel}">${this.getRiskLabel(config.riskLevel)}</span>
            </div>
            <div class="asset-price">
                <span class="price-value">${priceText}</span>
                <span class="price-change ${changeClass}">${changeSign}${marketData.change.toFixed(1)}%</span>
            </div>
            <div class="asset-holding">
                <span>持仓: ${holding.quantity.toFixed(4)} ${this.resolveText(config.unit)}</span>
                <span>价值: $${Math.round(holdingValue).toLocaleString()}</span>
            </div>
            ${holding.quantity > 0 ? `
            <div class="asset-profit">
                <span class="${profitClass}">盈亏: ${profitLoss >= 0 ? '+' : ''}$${profitLoss.toFixed(2)} (${profitLoss >= 0 ? '+' : ''}${profitPercent}%)</span>
                <span class="asset-avgcost">均价: $${holding.avgCost.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="asset-actions">
                <button class="asset-btn trend-btn" data-action="trend" data-type="${assetId}" style="background: var(--color-info);">${I18n.t('ui.assets.trend') || '走势'}</button>
                <button class="asset-btn buy" data-action="buy" data-type="${assetId}">买入</button>
                <button class="asset-btn sell" data-action="sell" data-type="${assetId}">卖出</button>
            </div>
        `;

        // 绑定按钮事件
        card.querySelectorAll('.asset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const type = btn.dataset.type;
                if (action === 'trend') {
                    this.showTrendChart(type);
                } else {
                    this.handleAssetTrade(action, type);
                }
            });
        });

        return card;
    },

    /**
     * V2.9 获取风险等级标签
     */
    getRiskLabel(riskLevel) {
        const labels = {
            low: '低风险',
            medium: '中风险',
            high: '高风险',
            extreme: '极高风险'
        };
        return labels[riskLevel] || riskLevel;
    },

    /**
     * V2.9 更新涨跌幅显示 (保留兼容)
     */
    updatePriceChange(elementId, change) {
        const el = document.getElementById(elementId);
        if (!el) return;

        const sign = change >= 0 ? '+' : '';
        el.textContent = sign + change.toFixed(1) + '%';
        el.className = 'price-change ' + (change >= 0 ? 'up' : 'down');
    },

    /**
     * V2.9/V2.13 处理资产交易 - 显示交易模态框
     */
    handleAssetTrade(action, assetId) {
        this.showTradeModal(action, assetId);
    },

    /**
     * V2.13 显示交易模态框
     */
    showTradeModal(action, assetId) {
        const config = GameData.assetTypes[assetId];
        const state = game.getState();
        const marketData = state.marketPrices[assetId];
        const holding = state.holdings[assetId];

        if (!config || !marketData || !holding) {
            this.showToast('资产数据加载失败', 'error');
            return;
        }

        // 保存当前交易状态
        this.currentTradeAction = action;
        this.currentTradeAssetId = assetId;

        // 更新模态框内容
        const actionText = action === 'buy' ? I18n.t('ui.assets.buy') : I18n.t('ui.assets.sell');
        const assetName = typeof config.name === 'function' ? config.name() : config.name;
        this.elements.tradeModalTitle.textContent = `${actionText} ${assetName}`;
        this.elements.tradeAssetIcon.textContent = config.icon;
        this.elements.tradeAssetName.textContent = assetName;

        // 格式化价格
        let priceText = '';
        if (marketData.price >= 1000) {
            priceText = '$' + marketData.price.toLocaleString();
        } else if (marketData.price >= 1) {
            priceText = '$' + marketData.price.toFixed(2);
        } else {
            priceText = '$' + marketData.price.toFixed(4);
        }
        this.elements.tradePriceValue.textContent = priceText;
        this.elements.tradeHoldingValue.textContent = `${holding.quantity.toFixed(4)} ${this.resolveText(config.unit)}`;
        this.elements.tradeCashValue.textContent = '$' + state.money.toLocaleString();

        // 重置输入框和预计金额
        this.elements.tradeQuantityInput.value = '';
        this.elements.tradeTotalValue.textContent = '$0';

        // 更新确认按钮文字
        this.elements.tradeConfirmBtn.textContent = action === 'buy' ? I18n.t('ui.assets.confirmBuy') : I18n.t('ui.assets.confirmSell');
        this.elements.tradeConfirmBtn.style.background = action === 'buy'
            ? 'linear-gradient(135deg, var(--color-success) 0%, #1e8449 100%)'
            : 'linear-gradient(135deg, var(--color-danger) 0%, #c0392b 100%)';

        // 显示模态框
        this.elements.tradeModal.classList.remove('hidden');
    },

    /**
     * V2.13 隐藏交易模态框
     */
    hideTradeModal() {
        this.elements.tradeModal.classList.add('hidden');
        this.currentTradeAction = null;
        this.currentTradeAssetId = null;
    },

    /**
     * V2.13 更新预计交易金额
     */
    updateTradeTotal() {
        const quantity = parseFloat(this.elements.tradeQuantityInput.value) || 0;
        const assetId = this.currentTradeAssetId;

        if (!assetId) return;

        const state = game.getState();
        const marketData = state.marketPrices[assetId];

        if (!marketData) return;

        const total = quantity * marketData.price;
        this.elements.tradeTotalValue.textContent = '$' + total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    },

    /**
     * V2.13 执行资产交易
     */
    executeAssetTrade() {
        const quantity = parseFloat(this.elements.tradeQuantityInput.value);
        const action = this.currentTradeAction;
        const assetId = this.currentTradeAssetId;

        if (!assetId || !action) {
            this.showToast('交易信息错误', 'error');
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            this.showToast('请输入有效数量', 'error');
            return;
        }

        let result;
        if (action === 'buy') {
            result = game.buyAsset(assetId, quantity);
        } else {
            result = game.sellAsset(assetId, quantity);
        }

        this.showToast(result.message, result.success ? 'success' : 'error');

        if (result.success) {
            this.hideTradeModal();
            this.renderAssetsScreen();
            this.updateStatusBar(game.getStatusDescription());
        }
    },

    /**
     * V2.35 显示走势图表
     */
    showTrendChart(assetId) {
        const state = game.getState();
        const marketData = state.marketPrices[assetId];
        const config = GameData.assetTypes[assetId];

        if (!marketData || !marketData.history || marketData.history.length === 0) {
            this.showToast('暂无历史数据');
            return;
        }

        const history = [...marketData.history]; // Copy
        // Add current price if not in history yet (history updates at end of day, usually)
        // Check implementation: market.js updates price then pushes to history. So history includes current price?
        // market.js L94: assetData.history.push(assetData.price); 
        // So history contains current price as last element.

        // 创建模态框 DOM
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';

        const content = document.createElement('div');
        content.className = 'modal-content chart-content';

        const assetName = this.resolveText(config.name);

        content.innerHTML = `
            <div class="chart-header">
                <h3><span class="asset-icon">${config.icon}</span> ${assetName} - 近${history.length}天走势</h3>
                <button id="close-chart-btn" class="close-button">×</button>
            </div>
            <div class="chart-body">
                <div class="chart-svg-container" id="chart-svg-container">
                    <!-- SVG Chart Here -->
                </div>
                <div class="chart-stats-row">
                    <div class="chart-stat-item">
                        <span class="chart-stat-label">最低</span>
                        <span class="chart-stat-value">$${Math.min(...history).toLocaleString()}</span>
                    </div>
                     <div class="chart-stat-item">
                        <span class="chart-stat-label">当前</span>
                        <span class="chart-stat-value" style="color: ${marketData.change >= 0 ? 'var(--color-success)' : 'var(--color-danger)'}">$${marketData.price.toLocaleString()}</span>
                    </div>
                    <div class="chart-stat-item">
                        <span class="chart-stat-label">最高</span>
                        <span class="chart-stat-value">$${Math.max(...history).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;

        // Generate SVG
        const containerWidth = 460; // Approximate internal width
        const containerHeight = 200;
        const padding = 20;

        const maxPrice = Math.max(...history) * 1.05; // padding top
        const minPrice = Math.min(...history) * 0.95; // padding bottom
        const priceRange = maxPrice - minPrice;

        const points = history.map((price, index) => {
            const x = padding + (index / (history.length - 1)) * (containerWidth - 2 * padding);
            const y = containerHeight - padding - ((price - minPrice) / priceRange) * (containerHeight - 2 * padding);
            return { x, y, price, index };
        });

        const svgNs = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNs, "svg");
        svg.setAttribute("class", "chart-svg");
        svg.setAttribute("viewBox", `0 0 ${containerWidth} ${containerHeight}`);

        // Draw Lines
        if (points.length > 1) {
            let pathD = `M ${points[0].x} ${points[0].y}`;
            for (let i = 1; i < points.length; i++) {
                pathD += ` L ${points[i].x} ${points[i].y}`;
            }

            const path = document.createElementNS(svgNs, "path");
            path.setAttribute("d", pathD);
            path.setAttribute("class", `chart-line ${points[points.length - 1].price >= points[0].price ? 'up' : 'down'}`);
            svg.appendChild(path);
        }

        // Draw Points
        points.forEach(p => {
            const circle = document.createElementNS(svgNs, "circle");
            circle.setAttribute("cx", p.x);
            circle.setAttribute("cy", p.y);
            circle.setAttribute("class", "chart-point");

            // Tooltip via title
            const title = document.createElementNS(svgNs, "title");
            title.textContent = `Day -${history.length - 1 - p.index}: $${p.price.toLocaleString()}`;
            circle.appendChild(title);

            svg.appendChild(circle);

            // Add Price Label
            const text = document.createElementNS(svgNs, "text");
            text.setAttribute("x", p.x);
            text.setAttribute("y", p.y - 10); // Offset above the point
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("class", "chart-label");
            // Format price: remove decimals if effectively integer, or max 2 decimals
            const priceText = p.price >= 100 ? Math.round(p.price) : parseFloat(p.price.toFixed(2));
            text.textContent = `$${priceText}`;
            svg.appendChild(text);
        });

        // Add axes (simple)
        const xAxis = document.createElementNS(svgNs, "line");
        xAxis.setAttribute("x1", padding);
        xAxis.setAttribute("y1", containerHeight - padding);
        xAxis.setAttribute("x2", containerWidth - padding);
        xAxis.setAttribute("y2", containerHeight - padding);
        xAxis.setAttribute("class", "chart-axis");
        svg.appendChild(xAxis);

        const yAxis = document.createElementNS(svgNs, "line");
        yAxis.setAttribute("x1", padding);
        yAxis.setAttribute("y1", padding);
        yAxis.setAttribute("x2", padding);
        yAxis.setAttribute("y2", containerHeight - padding);
        yAxis.setAttribute("class", "chart-axis");
        svg.appendChild(yAxis);

        content.querySelector('#chart-svg-container').appendChild(svg);
        content.querySelector('#close-chart-btn').onclick = () => overlay.remove();

        overlay.appendChild(content);
        document.body.appendChild(overlay);
    }
};

// V2.9 绑定资产交易按钮事件 (初始化时绑定)
document.addEventListener('DOMContentLoaded', () => {
    // 动态生成的按钮事件由 createAssetCard 中处理
});



