/**
 * 斩杀线生存 V2 - UI渲染模块
 * 时段动画 + 精力显示
 */
import { I18n } from './i18n.js';
import { GameData } from './data/index.js';
import { GameEvents } from './events/index.js';
import { game } from './game.js';
import { AudioManager } from './audio.js';
import { getArtifact, getRandomArtifacts } from './data/artifacts.js';
import { SeededRNG } from './rng.js';

export const UI = {
    elements: {},
    visualOffsets: {
        money: 0,
        energy: 0,
        mental: 0,
        health: 0,
        socialValue: 0,
        workEfficiency: 0,
        investment: 0
    },

    /**
     * Helper to resolve potentially dynamic text
     */
    resolveText(value, ...args) {
        if (typeof value === 'function') {
            return value(...args);
        }
        if (typeof value === 'string' && /^(data|game|ui|ui_static|finance)\./.test(value)) {
            const translated = I18n.t(value, ...args);
            return translated === value ? value : translated;
        }
        return value;
    },

    /**
     * 初始化UI
     */
    init() {
        this.translatePage(); // V2.35 自动翻译页面静态文本
        document.documentElement.lang = I18n.currentLang === 'zh' ? 'zh-CN' : 'en';
        // 背景
        this.elements.gameBackground = document.getElementById('game-background');

        // 屏幕
        this.elements.startScreen = document.getElementById('start-screen');
        this.elements.gameScreen = document.getElementById('game-screen');
        this.elements.endingScreen = document.getElementById('ending-screen');
        this.elements.manualScreen = document.getElementById('manual-screen');

        // 按钮
        this.elements.restartButton = document.getElementById('restart-button');
        this.elements.continueButton = document.getElementById('continue-button');

        // 状态栏
        this.elements.moneyValue = document.getElementById('money-value');
        this.elements.investmentValue = document.getElementById('investment-value');
        this.elements.debtValue = document.getElementById('debt-value');
        this.elements.housingValue = document.getElementById('housing-value');
        this.elements.housingCard = document.getElementById('housing-card-container');
        this.elements.financeCard = document.getElementById('finance-card-container');
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

        // V2.XX News Ticker
        this.elements.newsTickerContainer = document.getElementById('news-ticker-container');
        this.elements.newsTickerContent = document.getElementById('news-ticker-content');
        this.elements.newsDetailModal = document.getElementById('news-detail-modal');
        this.elements.newsDetailBody = document.getElementById('news-detail-body');
        this.elements.closeNewsDetail = document.getElementById('close-news-detail');

        if (this.elements.newsTickerContainer) {
            this.elements.newsTickerContainer.addEventListener('click', () => {
                this.showNewsModal();
            });
        }
        if (this.elements.closeNewsDetail) {
            this.elements.closeNewsDetail.onclick = () => {
                this.elements.newsDetailModal.classList.add('hidden');
            };
        }

        // 事件区域
        this.elements.eventCard = document.getElementById('event-card');
        this.elements.eventType = document.getElementById('event-type');
        this.elements.eventEnergyCost = document.getElementById('event-energy-cost');
        this.elements.eventTitle = document.getElementById('event-title');
        this.elements.eventDescription = document.getElementById('event-description');
        this.elements.eventChoices = document.getElementById('event-choices');
        this.elements.advanceStageButton = document.getElementById('advance-stage-button');

        // Toast
        this.elements.toastContainer = document.getElementById('toast-container');

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

        this.elements.financeDetailModal = document.getElementById('finance-detail-modal');
        this.elements.financeDetailCash = document.getElementById('finance-detail-cash');
        this.elements.financeDetailInvestments = document.getElementById('finance-detail-investments');
        this.elements.financeDetailInvestmentList = document.getElementById('finance-detail-investment-list');
        this.elements.financeDetailDebtTotal = document.getElementById('finance-detail-debt-total');
        this.elements.financeDetailDebtList = document.getElementById('finance-detail-debt-list');
        this.elements.financeDetailRepayInput = document.getElementById('finance-detail-repay-input');
        this.elements.financeDetailMaxBtn = document.getElementById('finance-detail-max-btn');
        this.elements.financeDetailRepayBtn = document.getElementById('finance-detail-repay-btn');
        this.elements.autoRepayEnabled = document.getElementById('auto-repay-enabled');
        this.elements.autoRepayKeepCash = document.getElementById('auto-repay-keep-cash');
        this.elements.autoRepayMaxDaily = document.getElementById('auto-repay-max-daily');
        this.elements.financeDetailSectionCash = document.getElementById('finance-detail-section-cash');
        this.elements.financeDetailSectionDebt = document.getElementById('finance-detail-section-debt');
        this.elements.financeDetailSectionRepay = document.getElementById('finance-detail-section-repay');
        this.elements.financeDetailSectionAutoRepay = document.getElementById('finance-detail-section-auto-repay');
        this.elements.closeFinanceDetail = document.getElementById('close-finance-detail');
        this.elements.debtAutoRepayBtn = document.getElementById('debt-auto-repay-btn');

        // V2.XX Stat Detail Modal
        this.elements.statDetailModal = document.getElementById('stat-detail-modal');
        this.elements.statDetailTitle = document.getElementById('stat-detail-title');
        this.elements.statDetailIcon = document.getElementById('stat-detail-icon');
        this.elements.statDetailName = document.getElementById('stat-detail-name');
        this.elements.statDetailDescription = document.getElementById('stat-detail-description');
        this.elements.statDetailEffects = document.getElementById('stat-detail-effects');
        this.elements.statDetailImpacts = document.getElementById('stat-detail-impacts');
        this.elements.statDetailValue = document.getElementById('stat-detail-value');
        this.elements.closeStatDetail = document.getElementById('close-stat-detail');

        if (this.elements.financeDetailRepayInput) {
            this.elements.financeDetailRepayInput.placeholder = I18n.t('ui_static.finance_detail.repay_placeholder');
        }

        // V2.1 储备信息
        this.elements.ingredientsCount = document.getElementById('ingredients-count');
        this.elements.mealStatus = document.getElementById('meal-status');
        if (this.elements.mealStatus && this.elements.mealStatus.parentElement) {
            this.elements.mealStatus.parentElement.style.maxWidth = '100%';
            this.elements.mealStatus.parentElement.style.width = '100%';
            // Also for job and housing just to be safe, though they might be direct children.
            // But let's stick to mealStatus as confirmed issue.
        }

        // V2.7 任务进度
        // V2.7 任务进度
        this.elements.taskProgress = document.getElementById('task-progress');
        this.elements.taskDeadline = document.getElementById('task-deadline');
        this.elements.taskContainer = document.getElementById('dashboard-task');
        this.elements.taskProgressBar = document.getElementById('task-progress-bar');

        // V2.42 裁员风险显示
        this.elements.layoffRiskContainer = document.getElementById('layoff-risk-container');
        this.elements.layoffRiskVal = document.getElementById('layoff-risk-val');

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
        if (this.elements.housingCard) {
            this.elements.housingCard.addEventListener('click', () => {
                this.showHousingDetailModal();
            });
        }
        if (this.elements.financeCard) {
            this.elements.financeCard.addEventListener('click', () => {
                this.showFinanceDetailModal();
            });
        }

        this.elements.statusCash = document.getElementById('status-cash');
        this.elements.statusDebt = document.getElementById('status-debt');

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
        this.elements.helpContainer = document.querySelector('.help-container');
        this.elements.langSwitchContainer = document.querySelector('.lang-switch-container');
        this.elements.helpButton = document.getElementById('help-button');
        this.elements.manualBackBtn = document.getElementById('manual-back-btn');
        this.elements.manualCloseHeader = document.getElementById('manual-close-header');
        this.elements.languageSwitch = document.getElementById('language-switch');

        // V2.13 交易模态框
        this.elements.tradeModal = document.getElementById('trade-modal');
        this.elements.tradeModalTitle = document.getElementById('trade-modal-title');
        this.elements.tradeModalClose = document.getElementById('trade-modal-close');
        this.elements.tradeAssetIcon = document.getElementById('trade-asset-icon');
        this.elements.tradeAssetName = document.getElementById('trade-asset-name');
        this.elements.tradePriceValue = document.getElementById('trade-price-value');
        this.elements.tradeHoldingValue = document.getElementById('trade-holding-value');
        this.elements.tradeQuantityInput = document.getElementById('trade-quantity-input');
        this.elements.tradeMaxBtn = document.getElementById('trade-max-btn');
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
        this.elements.aboutUsBtn = document.getElementById('about-us-btn');
        this.elements.aboutUsModal = document.getElementById('about-us-modal');
        this.elements.closeAboutUs = document.getElementById('close-about-us');
        this.elements.loadModal = document.getElementById('load-modal');
        this.elements.loadModalSlots = document.getElementById('load-modal-slots');
        this.elements.closeLoadModal = document.getElementById('close-load-modal');

        // V2.XX Message History
        this.elements.btnMessageHistory = document.getElementById('btn-message-history');
        this.elements.modalMessageHistory = document.getElementById('modal-message-history');
        this.elements.closeMessageHistory = document.getElementById('close-message-history');
        this.elements.listMessageHistory = document.getElementById('message-history-list');

        // V2.XX Artifact Detail Modal
        this.elements.artifactDetailModal = document.getElementById('modal-artifact-detail');
        this.elements.closeArtifactDetail = document.getElementById('close-artifact-detail');
        this.elements.artifactDetailTitle = document.getElementById('artifact-detail-title');
        this.elements.artifactDetailCount = document.getElementById('artifact-detail-count');
        this.elements.artifactDetailList = document.getElementById('artifact-detail-list');
        this.elements.artifactDisplayContainer = document.getElementById('artifact-display-container');
        this.elements.artifactSlots = document.getElementById('artifact-slots');

        // Global Event Delegation for dynamic elements
        document.body.addEventListener('click', (e) => {
            const artifactContainer = e.target.closest('#artifact-display-container');
            if (artifactContainer) {
                console.log("UI: Artifact Card Clicked (Delegated)");
                this.showArtifactDetailModal();
            }
        });
        if (this.elements.closeArtifactDetail) {
            this.elements.closeArtifactDetail.addEventListener('click', () => {
                this.elements.artifactDetailModal.classList.add('hidden');
            });
        }
        // Click outside to close
        if (this.elements.artifactDetailModal) {
            this.elements.artifactDetailModal.addEventListener('click', (e) => {
                if (e.target === this.elements.artifactDetailModal) {
                    this.elements.artifactDetailModal.classList.add('hidden');
                }
            });
        }

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
        if (this.elements.languageSwitch) {
            this.updateLanguageSwitchLabel();
            this.elements.languageSwitch.addEventListener('click', async () => {
                await this.toggleLanguage();
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

            if (this.elements.closeFinanceDetail) {
                this.elements.closeFinanceDetail.addEventListener('click', () => {
                    this.elements.financeDetailModal.classList.add('hidden');
                    if (this.pendingTutorial) {
                        this.pendingTutorial = false;
                        setTimeout(() => this.showTutorialHighlights(), 500);
                    }
                });
            }
            if (this.elements.financeDetailModal) {
                this.elements.financeDetailModal.addEventListener('click', (e) => {
                    if (e.target === this.elements.financeDetailModal) {
                        this.elements.financeDetailModal.classList.add('hidden');
                        if (this.pendingTutorial) {
                            this.pendingTutorial = false;
                            setTimeout(() => this.showTutorialHighlights(), 500);
                        }
                    }
                });
            }
            if (this.elements.financeDetailRepayBtn) {
                this.elements.financeDetailRepayBtn.addEventListener('click', () => this.handleDebtRepay());
            }
            if (this.elements.financeDetailMaxBtn) {
                this.elements.financeDetailMaxBtn.addEventListener('click', () => this.handleFillMaxRepay());
            }
            if (this.elements.autoRepayEnabled) {
                this.elements.autoRepayEnabled.addEventListener('change', () => this.syncAutoRepayFromModal());
            }
            if (this.elements.autoRepayKeepCash) {
                this.elements.autoRepayKeepCash.addEventListener('change', () => this.syncAutoRepayFromModal());
            }
            if (this.elements.autoRepayMaxDaily) {
                this.elements.autoRepayMaxDaily.addEventListener('change', () => this.syncAutoRepayFromModal());
            }
            if (this.elements.debtAutoRepayBtn) {
                this.elements.debtAutoRepayBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showFinanceDetailModal();
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
            if (this.elements.tradeMaxBtn) {
                this.elements.tradeMaxBtn.addEventListener('click', () => this.fillMaxTradeQuantity());
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
            if (this.elements.aboutUsBtn) {
                this.elements.aboutUsBtn.addEventListener('click', () => {
                    if (this.elements.aboutUsModal) {
                        this.elements.aboutUsModal.classList.remove('hidden');
                    }
                });
            }

            this.elements.statusAboutUsBtn = document.getElementById('status-about-us-btn');
            if (this.elements.statusAboutUsBtn) {
                this.elements.statusAboutUsBtn.addEventListener('click', () => {
                    if (this.elements.aboutUsModal) {
                        this.elements.aboutUsModal.classList.remove('hidden');
                    }
                });
            }

            if (this.elements.closeAboutUs) {
                this.elements.closeAboutUs.addEventListener('click', () => {
                    if (this.elements.aboutUsModal) {
                        this.elements.aboutUsModal.classList.add('hidden');
                    }
                });
            }
            if (this.elements.aboutUsModal) {
                this.elements.aboutUsModal.addEventListener('click', (e) => {
                    if (e.target === this.elements.aboutUsModal) {
                        this.elements.aboutUsModal.classList.add('hidden');
                    }
                });
            }
            if (this.elements.closeLoadModal) {
                this.elements.closeLoadModal.addEventListener('click', () => this.hideLoadModal());
            }

            // V2.XX Message History Events
            if (this.elements.btnMessageHistory) {
                this.elements.btnMessageHistory.addEventListener('click', () => this.showMessageHistoryModal());
            }
            if (this.elements.closeMessageHistory) {
                this.elements.closeMessageHistory.addEventListener('click', () => {
                    this.elements.modalMessageHistory.classList.add('hidden');
                });
            }
            if (this.elements.modalMessageHistory) {
                this.elements.modalMessageHistory.addEventListener('click', (e) => {
                    if (e.target === this.elements.modalMessageHistory) {
                        this.elements.modalMessageHistory.classList.add('hidden');
                    }
                });
            }
            if (this.elements.loadModal) {
                this.elements.loadModal.addEventListener('click', (e) => {
                    if (e.target === this.elements.loadModal) this.hideLoadModal();
                });
            }

            // V2.XX Stat Detail Modal Events
            this.bindStatDetailEvents();

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
     * V2.XX 绑定属性详情事件
     */
    bindStatDetailEvents() {
        // 绑定五大属性框点击事件
        const statItems = document.querySelectorAll('#dashboard-stats .status-item[data-stat]');
        statItems.forEach(item => {
            item.addEventListener('click', () => {
                const statType = item.dataset.stat;
                if (statType) {
                    this.showStatDetailModal(statType);
                }
            });
        });

        // 绑定关闭按钮事件
        if (this.elements.closeStatDetail) {
            this.elements.closeStatDetail.addEventListener('click', () => {
                this.elements.statDetailModal.classList.add('hidden');
            });
        }

        // 点击模态框外部关闭
        if (this.elements.statDetailModal) {
            this.elements.statDetailModal.addEventListener('click', (e) => {
                if (e.target === this.elements.statDetailModal) {
                    this.elements.statDetailModal.classList.add('hidden');
                }
            });
        }
    },

    /**
     * V2.XX 显示属性详情模态框
     * @param {string} statType - 属性类型: energy, mental, health, social, work_efficiency
     */
    showStatDetailModal(statType) {
        if (!this.elements.statDetailModal) return;

        const statData = I18n.t(`ui_static.stat_detail.${statType}`);
        if (!statData || typeof statData !== 'object') {
            console.warn('[UI] Stat detail data not found for:', statType);
            return;
        }

        // 获取当前属性值
        const state = game.getState();
        let currentValue = '';
        switch (statType) {
            case 'energy':
                currentValue = `${state.energy || 0}/${state.maxEnergy || 100}`;
                break;
            case 'mental':
                currentValue = `${state.mental || 0}/${state.maxMental || 100}`;
                break;
            case 'health':
                currentValue = `${state.health || 0}/${state.maxHealth || 100}`;
                break;
            case 'social':
                currentValue = `${state.social || 0}/${state.maxSocial || 100}`;
                break;
            case 'work_efficiency':
                currentValue = `${state.workEfficiency || 0}%`;
                break;
        }

        // 更新模态框内容
        if (this.elements.statDetailTitle) {
            this.elements.statDetailTitle.textContent = I18n.t('ui_static.stat_detail.title');
        }
        if (this.elements.statDetailIcon) {
            this.elements.statDetailIcon.textContent = statData.icon || '📊';
        }
        if (this.elements.statDetailName) {
            this.elements.statDetailName.textContent = statData.name || statType;
        }
        if (this.elements.statDetailDescription) {
            this.elements.statDetailDescription.textContent = statData.description || '';
        }
        if (this.elements.statDetailEffects) {
            const effects = statData.effects || [];
            this.elements.statDetailEffects.innerHTML = effects.map(effect =>
                `<div class="stat-detail-effect-item">${effect}</div>`
            ).join('');
        }
        if (this.elements.statDetailImpacts) {
            const impacts = statData.impacts || [];
            this.elements.statDetailImpacts.innerHTML = impacts.map(impact =>
                `<div class="stat-detail-impact-item">${impact}</div>`
            ).join('');
        }
        if (this.elements.statDetailValue) {
            this.elements.statDetailValue.textContent = currentValue;
        }

        // 显示模态框
        this.elements.statDetailModal.classList.remove('hidden');
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
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = text;
            } else {
                el.innerHTML = text; // 使用 innerHTML 以支持 <b> 等标签
            }
        });
    },

    /**
     * 渲染游戏说明
     */
    renderManual() {
        const container = document.getElementById('manual-content');
        if (!container) return;

        const manual = I18n.t('manual');
        if (!manual || typeof manual === 'string') {
            console.warn('[UI] Manual data not found');
            return;
        }

        let html = '';

        // 标题
        html += `<h1>${manual.title}</h1>`;
        html += `<p>${manual.subtitle}</p>`;

        // 提示信息
        if (manual.tips) {
            html += '<blockquote>';
            if (manual.tips.rng) {
                html += `<p>💡 ${manual.tips.rng}</p>`;
            }
            if (manual.tips.disclaimer) {
                html += `<p>⚠️ <strong>${manual.tips.disclaimer}</strong></p>`;
            }
            html += '</blockquote>';
        }

        // 章节
        if (manual.sections && Array.isArray(manual.sections)) {
            for (const section of manual.sections) {
                html += this.renderManualSection(section);
            }
        }

        container.innerHTML = html;
    },

    /**
     * 渲染单个章节
     */
    renderManualSection(section) {
        let html = `<h2>${section.title}</h2>`;

        // 内容（支持数组或字符串）
        if (section.content) {
            if (Array.isArray(section.content)) {
                for (const p of section.content) {
                    html += `<p>${this.formatManualText(p)}</p>`;
                }
            } else {
                html += `<p>${this.formatManualText(section.content)}</p>`;
            }
        }

        // 列表
        if (section.list && Array.isArray(section.list)) {
            html += '<ul>';
            for (const item of section.list) {
                html += `<li>${this.formatManualText(item)}</li>`;
            }
            html += '</ul>';
        }

        // 图片
        if (section.image) {
            html += `<img src="${section.image.src}" alt="${section.image.alt || ''}" width="${section.image.width || 400}">`;
        }

        // 多张图片
        if (section.images && Array.isArray(section.images)) {
            for (const img of section.images) {
                html += `<img src="${img.src}" alt="${img.alt || ''}" width="${img.width || 150}">`;
            }
        }

        // 第二张图片
        if (section.image2) {
            html += `<img src="${section.image2.src}" alt="${section.image2.alt || ''}" width="${section.image2.width || 400}">`;
        }

        // 子章节
        if (section.subsections && Array.isArray(section.subsections)) {
            for (const sub of section.subsections) {
                html += `<h3>${sub.title}</h3>`;
                if (sub.content) {
                    html += `<p>${this.formatManualText(sub.content)}</p>`;
                }
                if (sub.list && Array.isArray(sub.list)) {
                    html += '<ul>';
                    for (const item of sub.list) {
                        html += `<li>${this.formatManualText(item)}</li>`;
                    }
                    html += '</ul>';
                }
                if (sub.image) {
                    html += `<img src="${sub.image.src}" alt="${sub.image.alt || ''}" width="${sub.image.width || 400}">`;
                }
                if (sub.image2) {
                    html += `<img src="${sub.image2.src}" alt="${sub.image2.alt || ''}" width="${sub.image2.width || 400}">`;
                }
                if (sub.note) {
                    html += `<p class="manual-note"><strong>关键点：</strong>${this.formatManualText(sub.note)}</p>`;
                }
            }
        }

        // 注意事项
        if (section.note) {
            html += `<p class="manual-note"><strong>关键点：</strong>${this.formatManualText(section.note)}</p>`;
        }

        return html;
    },

    /**
     * 格式化文本（处理加粗、斜体、代码等）
     */
    formatManualText(text) {
        if (!text) return '';
        // 处理 **加粗**
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // 处理 *斜体*
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        // 处理 `代码`
        text = text.replace(/`(.+?)`/g, '<code>$1</code>');
        return text;
    },

    updateLanguageSwitchLabel() {
        if (!this.elements.languageSwitch) return;

        const isZh = I18n.currentLang === 'zh';
        this.elements.languageSwitch.textContent = isZh ? 'EN' : '中';
        this.elements.languageSwitch.setAttribute('aria-label', isZh ? 'Switch to English' : '切换到中文');
    },

    async toggleLanguage() {
        const nextLang = I18n.currentLang === 'zh' ? 'en' : 'zh';
        const switched = await I18n.setLang(nextLang);
        if (!switched) {
            console.warn('[UI] Failed to switch language:', nextLang);
            return;
        }

        window.location.reload();
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

        // 显示/隐藏帮助按钮容器（仅在开始界面显示）
        if (this.elements.helpContainer) {
            this.elements.helpContainer.style.display = screenName === 'start' ? 'flex' : 'none';
        } else if (this.elements.helpButton) {
            // Fallback old behavior just in case
            this.elements.helpButton.style.display = screenName === 'start' ? 'flex' : 'none';
        }

        if (this.elements.langSwitchContainer) {
            this.elements.langSwitchContainer.style.display = screenName === 'start' ? 'block' : 'none';
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
                this.renderManual(); // 动态渲染游戏说明
                break;
        }

        // Message History Button Visibility
        if (this.elements.btnMessageHistory) {
            if (screenName === 'game' || screenName === 'insurance' || screenName === 'assets' || screenName === 'status') {
                this.elements.btnMessageHistory.classList.remove('hidden');
            } else {
                this.elements.btnMessageHistory.classList.add('hidden');
            }
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
     * V2.XX 显示历史消息模态框
     */
    showMessageHistoryModal() {
        const logs = game.state.messageLog || [];
        const container = this.elements.listMessageHistory;
        if (!container) return;

        container.innerHTML = '';

        if (logs.length === 0) {
            container.innerHTML = `<div class="log-empty-hint">${I18n.t('ui.messageHistory.empty')}</div>`;
        } else {
            // Group by Day
            // Logs are chronologically sorted by push (oldest first). We actally want newest first (bottom to top? or top to bottom)
            // Usually history is Newest on Top or Newest on Bottom. Let's do Newest on Top for easy access.
            const sortedLogs = [...logs].reverse();

            let currentDayGroup = -1;
            let groupContainer = null;

            sortedLogs.forEach(log => {
                if (log.day !== currentDayGroup) {
                    currentDayGroup = log.day;
                    const groupDiv = document.createElement('div');
                    groupDiv.className = 'log-day-group';

                    const header = document.createElement('div');
                    header.className = 'log-day-header';
                    header.innerHTML = `<span class="day-badge">${I18n.t('ui_static.game_header.day', log.day)}</span>`;

                    groupDiv.appendChild(header);
                    container.appendChild(groupDiv);
                    groupContainer = groupDiv;
                }
                const entryDiv = document.createElement('div');
                const typeClass = log.type && log.type !== 'normal' ? `type-${log.type}` : '';
                entryDiv.className = `log-entry ${typeClass}`;

                const period = GameData.periods[log.period];
                let periodName = log.period;
                if (period) {
                    periodName = typeof period.name === 'function' ? period.name() : (period.name || log.period);
                }
                const timeStr = periodName;
                const resolveLogField = (text, key, args) => {
                    if (key && typeof key === 'string') {
                        const translated = I18n.t(key, ...(Array.isArray(args) ? args : []));
                        if (translated && translated !== key) {
                            return this.localizeLegacyLogText(translated);
                        }
                    }
                    return this.localizeLegacyLogText(text);
                };

                const localizedSource = resolveLogField(log.source, log.sourceKey, log.sourceArgs) || '';
                const localizedMessage = resolveLogField(log.message, log.messageKey, log.messageArgs) || '';
                const sourceHtml = localizedSource ? `<div class="log-source">${localizedSource}</div>` : '';

                entryDiv.innerHTML = `
                    <div class="log-info">
                        <div class="log-time">${timeStr}</div>
                        ${sourceHtml}
                    </div>
                    <div class="log-content">${localizedMessage}</div>
                `;

                if (groupContainer) {
                    groupContainer.appendChild(entryDiv);
                }
            });
        }

        this.elements.modalMessageHistory.classList.remove('hidden');
    },

    localizeLegacyLogText(text) {
        if (typeof text !== 'string') {
            return text;
        }

        const lang = I18n.currentLang;
        if (lang !== 'en' && lang !== 'zh') {
            return text;
        }

        const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        let out = text;
        const zhToEnMap = {
            '深夜食堂': 'Late-Night Craving',
            '运动时间': 'Workout Time',
            '工作日': 'Workday',
            '夜幕降临': 'Night Falls',
            '项目开发': 'Project Dev',
            '报告撰写': 'Report',
            '数据分析': 'Data Analysis',
            '客户方案': 'Client',
            '系统维护': 'Maintenance',
            '代码审查': 'Review',
            '买快餐': 'Fast Food',
            '便利店三明治': 'Sandwich',
            '下楼散步': 'Take a Short Walk',
            '办公室八卦': 'Office Gossip',
            '成功摸鱼': 'Slacked off successfully',
            '与同事协作': 'Collaborated with coworkers',
            '与同事配合完成了一项任务,感觉不错': 'Worked with coworkers and finished a task. Feeling good.',
            '与同事配合完成了项任务': 'Worked with coworkers and completed a task',
            '听到了不少八卦消息, 心情愉悦': 'Heard plenty of gossip and felt entertained',
            '听到了不少小道消息,心情愉悦': 'Heard plenty of insider gossip and felt entertained',
            '坐公交': 'Bus',
            '听到了不少公司秘闻': 'You heard plenty of company rumors',
            '吃饱喝足，心满意足地睡去': 'You go to bed full and satisfied.'
        };

        if (lang === 'en') {
            Object.entries(zhToEnMap).forEach(([zh, en]) => {
                out = out.replace(new RegExp(escapeRegExp(zh), 'g'), en);
            });

            out = out.replace(/你睡了个好觉，明天将恢复\s*(\d+)\s*点精力/g, 'You slept well. Recover $1 energy tomorrow.');
            out = out.replace(/任务进度\s*\+\s*(\d+)%\s*[，,]\s*当前\s*(\d+)%/g, 'Task progress +$1%, now $2%');
            out = out.replace(/你决定保存精力/g, 'You decided to conserve energy.');
            out = out.replace(/你下楼散了个步[，,]?呼吸新鲜空气[。.]?/g, 'A quick walk clears your head.');
            out = out.replace(/量子冥想垫/g, 'Quantum Meditation Mat');
            out = out.replace(/与同事配合完成了?一?项任务[，,]\s*感觉不错/g, 'Worked with coworkers and finished a task. Feeling good.');
            out = out.replace(/听到了不少小道消息[，,]\s*心情愉悦/g, 'Heard plenty of insider gossip and felt entertained');
            out = out.replace(/长期疲劳[:：]/g, 'Chronic fatigue:');
            out = out.replace(/每日总结/g, I18n.t('ui.messageHistory.dailySummary'));
            out = out.replace(/午餐[:：]/g, 'Lunch:');
            out = out.replace(/通勤[:：]/g, 'Commute:');
            out = out.replace(/任务加成[:：]/g, 'Task bonus:');
            out = out.replace(/精力不变/g, 'Energy unchanged');
            out = out.replace(/精力恢复[:：]/g, 'Energy recovery:');
            out = out.replace(/精力变化[:：]/g, 'Energy change:');
            out = out.replace(/体力力竭[:：]/g, 'Exhaustion:');
            out = out.replace(/体力透支[:：]/g, 'Exhaustion:');
            out = out.replace(/住所加成[:：]/g, 'Housing bonus:');
            out = out.replace(/大病疲劳[:：]/g, 'Severe illness fatigue:');
            out = out.replace(/发薪日[:：]/g, 'Payday:');
            out = out.replace(/精神/g, 'Mental');
            out = out.replace(/健康/g, 'Health');
            out = out.replace(/账面\s*\$([\d,.]+)/g, '$$$1');
            out = out.replace(/实到\s*\$([\d,.]+)/g, '->$$$1');
            out = out.replace(/税-\$([\d,.]+)/g, 'tax $$$1');
            out = out.replace(/距发薪\s*(\d+)\s*天/g, 'Payday in $1d');
            out = out.replace(/[，、]/g, ', ');
            return out;
        }

        // zh: convert legacy English logs back to Chinese
        const enToZhMap = Object.fromEntries(
            Object.entries(zhToEnMap)
                .sort((a, b) => b[1].length - a[1].length)
                .map(([zh, en]) => [en, zh])
        );

        Object.entries(enToZhMap).forEach(([en, zh]) => {
            out = out.replace(new RegExp(escapeRegExp(en), 'g'), zh);
        });

        out = out.replace(/You slept well\. Recover\s*(\d+)\s*energy tomorrow\./g, '你睡了个好觉，明天将恢复 $1 点精力');
        out = out.replace(/Task progress\s*\+\s*(\d+)%\s*,\s*now\s*(\d+)%/g, '任务进度 +$1%，当前 $2%');
        out = out.replace(/Worked with coworkers and finished a task\. Feeling good\./g, '与同事配合完成了一项任务，感觉不错');
        out = out.replace(/Heard plenty of insider gossip and felt entertained/g, '听到了不少小道消息，心情愉悦');
        out = out.replace(/You hear useful company rumors\./g, '听到了不少公司秘闻');
        out = out.replace(/Task\s*"([^"]+)"\s*completed\.\s*New assignment generated\./g, '任务"$1"完成。新任务已生成。');
        out = out.replace(/You left a strong impression\.\s*\(Work\+?(\d+),\s*M\+?(\d+),\s*S\+?(\d+)\)/g, '你给人留下了深刻印象。(工作+$1，精神+$2，社交+$3)');
        out = out.replace(/Task progress\s*\+\s*(\d+)%\s*,\s*now\s*(\d+)%/g, '任务进度 +$1%，当前 $2%');
        out = out.replace(/Chronic fatigue:/g, '长期疲劳:');
        out = out.replace(/Daily/g, I18n.t('ui.messageHistory.dailySummary'));
        out = out.replace(/Lunch:/g, '午餐：');
        out = out.replace(/Commute:/g, '通勤：');
        out = out.replace(/Task bonus:/g, '任务加成：');
        out = out.replace(/Energy unchanged/g, '精力不变');
        out = out.replace(/Energy recovery:/g, '精力恢复：');
        out = out.replace(/Energy change:/g, '精力变化：');
        out = out.replace(/Exhaustion:/g, '体力力竭：');
        out = out.replace(/Housing bonus:/g, '住所加成：');
        out = out.replace(/Severe illness fatigue:/g, '大病疲劳：');
        out = out.replace(/Payday in\s*(\d+)\s*d/g, '距发薪 $1 天');
        out = out.replace(/Payday:\s*\$([\d,.]+)\s*->\$?([\d,.]+)\s*\(tax\s*\$([\d,.]+)\)/g, '发薪日：账面 $$$1 | 实到 $$$2 (税-$$$3)');
        out = out.replace(/\bMental\b/g, '精神');
        out = out.replace(/\bHealth\b/g, '健康');

        return out;

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
        if (!this.currentAssetCategory) this.currentAssetCategory = 'watchlist';
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
            ? I18n.t('ui_static.trade_modal.buy_title')
            : I18n.t('ui_static.trade_modal.sell_title');
 
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
            this.showToast(I18n.t('ui.toast.invalidQuantity'), "negative");
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
            const maxEnergy = state.maxEnergy || 100;
            this.elements.statusEnergyVal.textContent = `${Math.round(state.energy)}/${Math.round(maxEnergy)}`;
            this.elements.statusEnergyBar.style.width = `${(state.energy / maxEnergy) * 100}%`;
        }
        if (this.elements.statusMentalVal) {
            this.elements.statusMentalVal.textContent = `${Math.round(state.mental)}/${Math.round(state.maxMental || 100)}`;
            this.elements.statusMentalBar.style.width = `${(state.mental / (state.maxMental || 100)) * 100}%`;
        }
        if (this.elements.statusHealthVal) {
            const maxHealth = state.maxHealth || 100;
            this.elements.statusHealthVal.textContent = `${Math.round(state.health)}/${Math.round(maxHealth)}`;
            this.elements.statusHealthBar.style.width = `${(state.health / maxHealth) * 100}%`;
        }
        // V2.18 社交值
        if (this.elements.statusSocialVal) {
            const social = state.socialValue || 50;
            const maxSocial = state.maxSocialValue || 100;
            this.elements.statusSocialVal.textContent = `${Math.round(social)}/${Math.round(maxSocial)}`;
            this.elements.statusSocialBar.style.width = `${(social / maxSocial) * 100}%`;
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
                    this.elements.statusSickLeave.textContent = I18n.t('ui_static.status.ptoLabel', pto);
                    this.elements.statusSickLeave.parentElement.style.display = 'flex';
                } else {
                    this.elements.statusSickLeave.parentElement.style.display = 'none';
                }
            }
        }
        if (this.elements.statusUnemployedDays) {
            const days = state.unemployedDays || 0;
            this.elements.statusUnemployedDays.textContent = I18n.t('ui.status.dayCount', days);
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
                if (houseInfo.energyRecovery > 0) effects.push(I18n.t('ui.status.energyRecovery', houseInfo.energyRecovery));
                if (houseInfo.mentalBonus > 0) effects.push(I18n.t('ui.status.mentalBonus', houseInfo.mentalBonus));
                if (houseInfo.healthBonus > 0) effects.push(I18n.t('ui.status.healthBonus', houseInfo.healthBonus));
                if (effects.length === 0) effects.push(I18n.t('ui.status.noEffect'));
                this.elements.statusHousingEffect.textContent = effects.join(', ');
            }
        }

        // 4. 财务
        if (this.elements.statusCash) {
            this.elements.statusCash.textContent = game.formatMoney(state.money);
        }
        if (this.elements.statusDebt) {
            const debt = Math.max(0, state.debt || 0);
            this.elements.statusDebt.textContent = `$${debt.toLocaleString()}`;
        }
        // 6. 统计
        if (this.elements.statusDaysSurvived) this.elements.statusDaysSurvived.textContent = I18n.t('ui.status.dayCount', state.day);
        if (this.elements.statusMaxWealth) {
            const maxWealth = (state.stats && state.stats.maxWealth) ? state.stats.maxWealth : state.money;
            this.elements.statusMaxWealth.textContent = game.formatMoney(maxWealth);
        }
        if (this.elements.statusSeed) this.elements.statusSeed.textContent = state.seed || '-';

        // Update News Ticker
        this.updateNewsTicker();
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

        for (let i = 0; i < 4; i++) {
            const slotId = i; // 0 is auto-save
            const slotInfo = slots[i];
            const isAutoSave = slotId === 0;
            const card = document.createElement('div');
            // 复用 save-slot-card 样式，但放在 modal 里
            card.className = 'save-modal-slot' + (slotInfo ? ' has-save' : ' empty') + (isAutoSave ? ' auto-save-slot' : '');

            if (slotInfo) {
                const jobInfo = GameData.jobTypes[slotInfo.job] || { name: '未知' };
                const seedv = slotInfo.seed || '无';

                const slotTitle = isAutoSave ? I18n.t('ui.save.autoSlot') : I18n.t('ui.save.slot', slotId);

                card.innerHTML = `
                    <div class="slot-main-row">
                        <div class="slot-info-group">
                            <span class="slot-number">${slotTitle}</span>
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
                            ${!isAutoSave ? `<button class="delete-slot-btn action-btn" data-slot="${slotId}">🗑️</button>` : ''}
                        </div>
                    </div>
                    <div class="slot-seed-row">
                        <span class="seed-label">${I18n.t('ui.save.seedLabel')}</span>
                        <code class="seed-value">${seedv}</code>
                        <button class="copy-seed-btn" data-seed="${seedv}" title="${I18n.t('ui.save.copySeedTitle')}">📋</button>
                    </div>
                `;
            } else {
                const slotTitle = isAutoSave ? I18n.t('ui.save.autoSlot') : I18n.t('ui.save.slot', slotId);
                card.innerHTML = `
                    <div class="slot-main-row">
                         <div class="slot-info-group">
                            <span class="slot-number">${slotTitle}</span>
                            <span class="slot-empty-text">${I18n.t('ui.save.emptySlot')}</span>
                        </div>
                        <div class="slot-actions">
                            ${!isAutoSave ? `<button class="new-slot-btn primary-button" data-slot="${slotId}">${I18n.t('ui.save.newGameBtn')}</button>` : ''}
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
            this.currentTab = null;
            this.switchTab('home');

            const hasRenderableChoices = (event, state) => {
                if (!event || !Array.isArray(event.choices) || event.choices.length === 0) {
                    return false;
                }

                return event.choices.some(choice => {
                    if (!choice || typeof choice !== 'object') return false;
                    if (typeof choice.condition !== 'function') return true;
                    try {
                        return !!choice.condition(state);
                    } catch (err) {
                        console.warn('[UI] Choice condition check failed after load, treated as selectable:', err);
                        return true;
                    }
                });
            };

            let state = game.getState();
            let status = game.getStatusDescription();
            this.updateStatusBar(status);
            this.updateTimeDisplay(status);
            this.updateBackground(state.period);

            // V2.XX 修复：读档后若恢复事件不可渲染，循环推进时段直到拿到可交互事件
            let event = game.currentEvent;
            if (!hasRenderableChoices(event, state)) {
                game.currentEvent = null;
                event = game.getNextEvent();
            }

            let retryCount = 0;
            const maxRetry = 5;
            while (!hasRenderableChoices(event, state) && retryCount < maxRetry) {
                retryCount += 1;
                console.warn(`[UI] No valid choices at period: ${state.period}, advancing... (${retryCount}/${maxRetry})`);

                game.advancePeriod();
                state = game.getState();
                status = game.getStatusDescription();
                this.updateStatusBar(status);
                this.updateTimeDisplay(status);
                this.updateBackground(state.period);

                game.currentEvent = null;
                event = game.getNextEvent();
            }

            if (hasRenderableChoices(event, state)) {
                this.showEvent(event, state);
            } else {
                console.warn('[UI] No interactive event restored after load; keeping current state.');
            }

            this.showToast(I18n.t('ui.toast.loadSuccess', slotId));
        } else {
            this.showToast(I18n.t('ui.toast.loadFailed'));
        }
    },

    /**
     * 开始新游戏并关联到槽位 (但不立即保存)
     */
    startNewGame(slotId) {
        let seed = this.elements.seedInput ? this.elements.seedInput.value.trim() : null;

        // V2.XX: 如果没有提供种子，提前生成并自动填入，确保神器选择和游戏生成一致
        if (!seed) {
            seed = Math.floor(Math.random() * 900000 + 100000).toString();
            if (this.elements.seedInput) {
                this.elements.seedInput.value = seed;
            }
        }

        this.showHousingSelectionModal((selectedHousingId) => {
            const rng = new SeededRNG(seed);
            const options = getRandomArtifacts(3, rng);

            if (options.length > 0) {
                this.showArtifactSelectionModal(options, (selectedArtifactId) => {
                    this._finishStartNewGame(slotId, selectedArtifactId, seed, selectedHousingId);
                });
            } else {
                this._finishStartNewGame(slotId, null, seed, selectedHousingId);
            }
        });
    },

    /**
     * 开局住所选择模态框
     */
    showHousingSelectionModal(onSelect) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.id = 'housing-selection-overlay';

        const content = document.createElement('div');
        content.className = 'modal-content glass-panel';
        content.style.maxWidth = '900px';

        const list = Object.entries(GameData.housingTypes || {});
        const cards = list.map(([id, house]) => {
            const name = this.resolveText(house.name);
            const icon = house.icon || '🏠';
            const desc = this.resolveText(house.description) || I18n.t(`data.housing.${id}.description`);
            const cost = Math.floor((house.cost || 0));
            const energy = Number(house.energyRecovery || 0);
            const mental = Number(house.mentalBonus || 0);
            const health = Number(house.healthBonus || 0);

            const fmt = (v) => `${v > 0 ? '+' : ''}${v}`;

            return `
                <button class="plan-option-card housing-select-card" data-housing-id="${id}" style="text-align: left; width: 100%;">
                    <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
                        <div>
                            <div style="font-weight:700; font-size:1.1rem;">${icon} ${name}</div>
                            <div style="margin-top:6px; color:var(--color-text-secondary); font-size:0.9rem; line-height:1.45;">${desc}</div>
                        </div>
                        <div class="money danger" style="white-space:nowrap; font-weight:700;">$${cost.toLocaleString()}</div>
                    </div>
                    <div style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap; font-size:0.85rem; color:var(--color-text-secondary);">
                        <span>${I18n.t('game.housing.recoverEveryNight')}</span>
                        <span>⚡ ${fmt(energy)}</span>
                        <span>🧠 ${fmt(mental)}</span>
                        <span>❤️ ${fmt(health)}</span>
                    </div>
                </button>
            `;
        }).join('');

        content.innerHTML = `
            <div class="modal-header">
                <h3>${I18n.t('game.housing.pickTitle')}</h3>
            </div>
            <div class="modal-body" style="display:grid; gap:12px; max-height:65vh; overflow:auto;">
                <div style="font-size:0.9rem; color:var(--color-text-secondary);">
                    ${I18n.t('game.housing.pickSubtitle')}
                </div>
                ${cards}
            </div>
        `;

        overlay.appendChild(content);
        document.body.appendChild(overlay);

        content.querySelectorAll('[data-housing-id]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const selectedId = btn.dataset.housingId;
                overlay.remove();
                if (typeof onSelect === 'function') onSelect(selectedId);
            });
        });
    },

    _finishStartNewGame(slotId, artifactId, seed, housingId = null) {
        // 优先使用传入的 seed，确保与 artifact 选择时的 RNG 一致
        if (!seed && this.elements.seedInput) {
            seed = this.elements.seedInput.value.trim();
        }

        game.init(seed || null, artifactId, housingId);

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

        if (!state.autoRepaySetupPrompted) {
            state.autoRepaySetupPrompted = true;
            this.showToast(I18n.t('finance.autoRepay.setupPrompt'), 'info');
            this.showFinanceDetailModal({ onlyAutoRepay: true });

            // Mark tutorial as pending if it's a new game, to show after modal closes
            if (!game.getSlotInfo(0)) {
                this.pendingTutorial = true;
            }
        }

        this.showToast(I18n.t('ui.toast.newGameStarted', slotId));

        // V2.XX: 新手引导触发 (如果检测到是新游戏/Slot 0 空缺)
        // 只有在没有等待 Modal 关闭的情况下才直接显示
        if (!game.getSlotInfo(0) && !this.pendingTutorial) {
            setTimeout(() => {
                this.showTutorialHighlights();
            }, 800); // 稍微延迟，等界面切换动画完成
        }
    },

    /**
     * 显示神器选择模态框
     */
    showArtifactSelectionModal(artifacts, onSelect) {
        let modal = document.getElementById('modal-artifact-selection');
        if (!modal) return;

        // V2.XX Fix: Inject CSS dynamically to ensure it loads even if style.css is cached
        if (!document.getElementById('artifact-selection-css')) {
            const style = document.createElement('style');
            style.id = 'artifact-selection-css';
            style.textContent = `
                #modal-artifact-selection .modal-content { max-width: 1000px; width: 90%; }
                #artifact-cards-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; padding: 20px; overflow-y: auto; }
                .artifact-card { display: flex; flex-direction: column; align-items: center; padding: 25px; border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 12px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); cursor: pointer; background: rgba(255, 255, 255, 0.08); position: relative; overflow: hidden; }
                .artifact-card:hover { transform: translateY(-5px); background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.4); box-shadow: 0 10px 20px rgba(0,0,0,0.3); }
                .artifact-card:active { transform: scale(0.98); }
                .artifact-card-icon { font-size: 3.5rem; margin-bottom: 15px; filter: drop-shadow(0 0 10px rgba(255,255,255,0.2)); }
                .artifact-card-content { display: flex; flex-direction: column; align-items: center; width: 100%; }
                .artifact-card-title { margin: 0 0 10px 0; font-size: 1.3rem; font-weight: 700; text-align: center; }
                .artifact-card-rarity { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1.5px; padding: 2px 10px; border: 1px solid currentColor; border-radius: 20px; margin-bottom: 15px; opacity: 0.8; }
                .artifact-card-desc { text-align: center; color: var(--color-text-secondary); line-height: 1.6; font-size: 0.95rem; flex-grow: 1; }
                .artifact-card-action { margin-top: 20px; font-size: 0.85rem; color: var(--color-text-muted); opacity: 0.7; transition: opacity 0.2s; }
                .artifact-card:hover .artifact-card-action { opacity: 1; color: var(--color-text-primary); }

                @media (max-width: 600px) {
                    #modal-artifact-selection .modal-content { width: 95%; max-width: 100%; height: 90vh; border-radius: 12px 12px 0 0; bottom: 0; top: auto; }
                    #artifact-cards-container { grid-template-columns: 1fr; gap: 15px; padding: 15px; }
                    .artifact-card { flex-direction: row; align-items: center; padding: 15px; text-align: left; min-height: auto; }
                    .artifact-card-icon { font-size: 2.5rem; margin-bottom: 0; margin-right: 20px; flex-shrink: 0; }
                    .artifact-card-content { align-items: flex-start; }
                    .artifact-card-title { font-size: 1.1rem; margin-bottom: 5px; text-align: left; }
                    .artifact-card-rarity { margin-bottom: 8px; font-size: 0.65rem; padding: 1px 8px; }
                    .artifact-card-desc { text-align: left; font-size: 0.85rem; line-height: 1.4; }
                    .artifact-card-action { display: none; }
                }
            `;
            document.head.appendChild(style);
        }

        const container = document.getElementById('artifact-cards-container');
        container.innerHTML = '';
        container.removeAttribute('style'); // Clear inline styles

        artifacts.forEach(art => {
            const card = document.createElement('div');
            card.className = 'artifact-card glass-panel interactive';

            const rarityColor = {
                common: '#b2bec3',
                uncommon: '#2ecc71',
                rare: '#3498db',
                epic: '#9b59b6',
                legendary: '#f1c40f'
            }[art.rarity] || '#ffffff';

            // New structure for responsive layout (Horizontal on mobile, Vertical on desktop)
            card.innerHTML = `
                <div class="artifact-card-icon">${art.icon}</div>
                <div class="artifact-card-content">
                    <h3 class="artifact-card-title" style="color: ${rarityColor}">${art.name()}</h3>
                    <div class="artifact-card-rarity" style="color: ${rarityColor}; border-color: ${rarityColor}">${art.rarity}</div>
                    <p class="artifact-card-desc">${art.description()}</p>
                </div>
                <div class="artifact-card-action">${I18n.t('ui_static.modals.artifact_select_action')}</div>
            `;

            card.onclick = () => {
                modal.classList.add('hidden');
                onSelect(art.id);
            };

            container.appendChild(card);
        });

        modal.classList.remove('hidden');
    },

    showArtifactDetailModal() {
        const state = game.getState();
        if (!this.elements.artifactDetailModal) return;

        const artifacts = Array.isArray(state.artifacts) ? state.artifacts : [];
        const maxSlots = GameData.artifactMaxSlots || 3;

        if (this.elements.artifactDetailTitle) {
            this.elements.artifactDetailTitle.textContent = I18n.t('ui.artifacts.title');
        }
        if (this.elements.artifactDetailCount) {
            this.elements.artifactDetailCount.textContent = `${artifacts.length}/${maxSlots}`;
        }

        if (this.elements.artifactDetailList) {
            this.elements.artifactDetailList.innerHTML = '';

            for (let i = 0; i < maxSlots; i++) {
                const id = artifacts[i];
                if (id) {
                    const art = getArtifact(id);
                    const artName = art && typeof art.name === 'function' ? art.name() : (art?.name || '未知');
                    const artDesc = art && typeof art.description === 'function' ? art.description() : (art?.description || '');

                    const item = document.createElement('div');
                    item.className = 'artifact-detail-item';
                    item.innerHTML = `
                        <div class="artifact-detail-icon">${art ? art.icon : '❓'}</div>
                        <div class="artifact-detail-body">
                            <div class="artifact-detail-name">${artName}</div>
                            <div class="artifact-detail-desc">${artDesc}</div>
                        </div>
                    `;
                    this.elements.artifactDetailList.appendChild(item);
                } else {
                    const empty = document.createElement('div');
                    empty.className = 'artifact-detail-item empty';
                    empty.textContent = I18n.t('ui.artifacts.emptySlot');
                    this.elements.artifactDetailList.appendChild(empty);
                }
            }
        }

        this.elements.artifactDetailModal.classList.remove('hidden');
    },

    triggerArtifactGlow(artifactId, duration = 600) {
        if (!artifactId || !this.elements.artifactSlots) return;
        const slots = this.elements.artifactSlots.querySelectorAll('.artifact-slot');
        slots.forEach(slot => {
            if (slot.dataset.artifactId === artifactId) {
                // Reset animation
                slot.classList.remove('triggered');
                void slot.offsetWidth; // Force reflow

                // 动态设置动画时长
                slot.style.transitionDuration = `${duration}ms`;
                slot.style.animationDuration = `${duration}ms`;

                slot.classList.add('triggered');
                setTimeout(() => {
                    slot.classList.remove('triggered');
                    slot.style.transitionDuration = '';
                    slot.style.animationDuration = '';
                }, duration);

                // Play sound
                if (AudioManager && AudioManager.play) {
                    AudioManager.play('artifact_effect');
                }
            }
        });
    },

    /**
     * V2.XX 触发属性卡片震动
     * @param {Object} delta - 属性变化量 { money: 100, health: -5, ... }
     */
    triggerAttributeShake(delta) {
        if (!delta) return;

        // V2.XX: Investment changes also trigger money card shake
        const investmentChanged = delta.investment && Math.abs(delta.investment) > 0.1;

        const attributes = [
            { key: 'money', elementId: 'money-value', forceTrigger: investmentChanged }, // Force trigger if investment changed
            { key: 'health', elementId: 'health-bar' },
            { key: 'energy', elementId: 'energy-bar' },
            { key: 'mental', elementId: 'mental-bar' },
            { key: 'workProgress', elementId: 'job-value' },
            { key: 'investment', elementId: 'investment-value' } // Also shake investment value if visible
        ];

        attributes.forEach(attr => {
            if ((delta[attr.key] && delta[attr.key] !== 0) || attr.forceTrigger) {
                let targetEl = document.getElementById(attr.elementId);

                // Try to find the card container for better visual effect
                if (targetEl) {
                    const card = targetEl.closest('.status-item') || targetEl.closest('.finance-item') || targetEl.parentElement;
                    if (card) {
                        card.classList.remove('shake');
                        card.classList.remove('flash-glow');
                        void card.offsetWidth; // Force reflow
                        card.classList.add('shake');
                        card.classList.add('flash-glow');

                        setTimeout(() => {
                            card.classList.remove('shake');
                            card.classList.remove('flash-glow');
                        }, 500);
                    }
                }
            }
        });
    },

    /**
     * 显示分层连锁触发效果（统一处理递减延迟）
     * @param {Array} layers - 分层触发数据
     */
    showChainedArtifactEffects(layers, initialDelay = 200) {
        if (!layers || !Array.isArray(layers) || layers.length === 0) return;

        // 从配置获取动画参数
        const animConfig = GameData.artifactConfig?.animation || {};
        const INITIAL_GAP = animConfig.initialGap || 600;
        const MIN_GAP = animConfig.minGap || 200;
        const GAP_DECAY = animConfig.gapDecay || 25;
        const LAYER_GAP_RATIO = animConfig.layerGapRatio || 0.5;
        const MAX_TOTAL_TRIGGERS = animConfig.maxTotalTriggers || 50;
        const SHAKE_THRESHOLD = animConfig.shakeThreshold || 10;

        // 记录整个动画流的当前时间指针
        let currentTime = initialDelay;
        let triggerCount = 0;

        let shakeStartTime = -1;
        let shakeEndTime = -1;

        // Calculate total delta for visual rollback
        layers.forEach(layer => {
            if (layer.triggers) {
                layer.triggers.forEach(trigger => {
                    if (trigger.delta) {
                        for (const key in trigger.delta) {
                            if (this.visualOffsets.hasOwnProperty(key)) {
                                this.visualOffsets[key] -= trigger.delta[key];
                            } else if (key === 'workProgress') { // Map workProgress to workEfficiency if needed or handle separately
                                // Assuming workProgress maps to workEfficiency for UI bars? 
                                // Actually workProgress usually is task progress, not efficiency.
                                // Let's check triggerAttributeShake. It maps workProgress to job-value.
                            }
                        }
                    }
                });
            }
        });

        // Initial update to reflect rolled-back state
        this.updateStatusBar(game.getStatusDescription());

        layers.forEach((layer, layerIndex) => {
            // 如果已达到最大触发次数，跳过后续
            if (triggerCount >= MAX_TOTAL_TRIGGERS) return;

            if (layer.triggers && layer.triggers.length > 0) {
                layer.triggers.forEach((trigger, triggerIndex) => {
                    // 如果已达到最大触发次数，跳过
                    if (triggerCount >= MAX_TOTAL_TRIGGERS) return;

                    // 计算本次触发的动画时长（按次数递减，而非按层数）
                    const animDuration = Math.max(MIN_GAP, INITIAL_GAP - triggerCount * GAP_DECAY);

                    // 如果不是第一个触发，加上层间隙
                    if (triggerCount > 0) {
                        const layerGap = Math.max(10, animDuration * LAYER_GAP_RATIO);
                        currentTime += layerGap;
                    }

                    triggerCount++;
                    const triggerTime = currentTime;

                    // 记录震动开始时间
                    if (triggerCount === SHAKE_THRESHOLD) {
                        shakeStartTime = triggerTime;
                    }

                    setTimeout(() => {
                        this.triggerArtifactGlow(trigger.id, animDuration);
                        if (trigger.message) {
                            this.showToast(trigger.message, 'info');

                            // V2.XX: 同时记录到消息历史，并标注来源神器名称
                            const art = getArtifact(trigger.id);
                            const artName = art && typeof art.name === 'function' ? art.name() : (art?.name || '神器');
                            game.addLog(trigger.message, 'positive', {
                                key: `data.artifacts.${trigger.id}.name`,
                                fallback: artName
                            });
                        }
                    }, triggerTime);

                    // 核心修改：完全等待动画播完
                    currentTime += animDuration;

                    // V2.XX: Trigger attribute shake based on delta AND Apply visual update
                    if (trigger.delta) {
                        setTimeout(() => {
                            // Apply delta back to visual offsets (reduce the rollback)
                            for (const key in trigger.delta) {
                                if (this.visualOffsets.hasOwnProperty(key)) {
                                    this.visualOffsets[key] += trigger.delta[key];
                                }
                            }
                            this.updateStatusBar(game.getStatusDescription()); // Update UI with new effective values
                            this.triggerAttributeShake(trigger.delta);
                        }, triggerTime);
                    }
                });
            }
        });

        // 震动结束时间为总动画结束时间
        shakeEndTime = currentTime;

        // 设置震动定时器
        if (shakeStartTime > 0 && shakeEndTime > shakeStartTime) {
            const container = document.getElementById('game-container') || document.body;

            setTimeout(() => {
                container.classList.add('shake-continuous');
                // 播放震动音效? 或者是循环音效? 暂时只震动
            }, shakeStartTime);

            setTimeout(() => {
                container.classList.remove('shake-continuous');
            }, shakeEndTime);
        }
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

        for (let i = 0; i < 4; i++) {
            const slotId = i; // 0 is auto-save
            const slotInfo = slots[i];
            const isCurrent = slotId === currentSlotId;
            const isAutoSave = slotId === 0;

            const card = document.createElement('div');
            card.className = 'save-modal-slot' + (slotInfo ? ' has-save' : ' empty') + (isCurrent ? ' current' : '') + (isAutoSave ? ' auto-save-slot' : '');

            const slotTitle = isAutoSave ? I18n.t('ui.save.autoSlot') : I18n.t('ui.save.slot', slotId);

            if (slotInfo) {
                const jobInfo = GameData.jobTypes[slotInfo.job] || { name: '未知' };
                card.innerHTML = `
                    <div class="slot-main-row">
                        <div class="slot-info-group">
                            <span class="slot-number">${slotTitle}${isCurrent ? I18n.t('ui.save.current') : ''}</span>
                            <div class="slot-details">
                                <span class="highlight">${I18n.t('ui.save.day', slotInfo.day)}</span>
                                <span class="separator">|</span>
                                <span class="money">${game.formatMoney(slotInfo.money)}</span>
                            </div>
                        </div>
                        <div class="slot-actions">
                             ${isAutoSave
                        ? `<button class="save-to-slot-btn action-btn disabled" disabled style="min-width: 80px; opacity: 0.5; cursor: not-allowed;">${I18n.t('ui.save.autoSlot')}</button>`
                        : `<button class="save-to-slot-btn action-btn" data-slot="${slotId}" style="min-width: 80px;">${I18n.t('ui.save.overwrite')}</button>`
                    }
                        </div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="slot-main-row">
                        <div class="slot-info-group">
                            <span class="slot-number">${slotTitle}${isCurrent ? I18n.t('ui.save.current') : ''}</span>
                            <span class="slot-empty-text" style="flex: 1; text-align: left; padding-left: 10px;">${I18n.t('ui.save.emptySlot')}</span>
                        </div>
                        <div class="slot-actions">
                             ${isAutoSave
                        ? `<button class="save-to-slot-btn action-btn disabled" disabled style="min-width: 80px; opacity: 0.5; cursor: not-allowed;">${I18n.t('ui.save.autoSlot')}</button>`
                        : `<button class="save-to-slot-btn action-btn" data-slot="${slotId}" style="min-width: 80px;">${I18n.t('ui.save.saveHere')}</button>`
                    }
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
                <h3>${I18n.t('ui.modal.selectHealthPlan')}</h3>
                <button id="close-modal-btn">❌</button>
            </div>
            <div style="padding: 10px; background: rgba(255, 165, 2, 0.1); border-radius: 8px; margin-bottom: 10px; font-size: 0.9em; color: #ffa502;">
                ${I18n.t('ui.insurance.healthPlanNotice')}
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
                <div class="plan-price">${I18n.t('ui.insurance.premiumHint')} $${plan.monthlyPremium}/mo</div>
                <div class="plan-details">
                    <span>${I18n.t('ui.insurance.deductibleHint')} $${plan.deductible}</span>
                    <span>${I18n.t('ui.insurance.coinsuranceHint')} ${(plan.coinsurance * 100).toFixed(0)}%</span>
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
     * V2.XX: Render artifact slots on main screen
     */
    renderArtifactSlots() {
        if (!this.elements.artifactSlots) return;

        const state = game.getState();
        const artifacts = Array.isArray(state.artifacts) ? state.artifacts : [];
        const maxSlots = 3;

        // Simple diff check
        const signature = artifacts.join(',');
        if (this._lastArtifactSignature === signature) return;
        this._lastArtifactSignature = signature;

        this.elements.artifactSlots.innerHTML = '';

        for (let i = 0; i < maxSlots; i++) {
            const id = artifacts[i];
            const slot = document.createElement('div');
            slot.className = 'artifact-slot';
            if (id) {
                slot.dataset.artifactId = id;
                const art = getArtifact(id);
                slot.innerHTML = art ? art.icon : '❓';
                // Optional: Check local click handler if needed, but for now just visual
            } else {
                slot.classList.add('empty');
            }
            this.elements.artifactSlots.appendChild(slot);
        }
    },
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
                <h3>${I18n.t('ui.modal.selectCarPlan')}</h3>
                <button id="close-modal-btn">❌</button>
            </div>
            <div style="padding: 10px; background: rgba(46, 213, 115, 0.1); border-radius: 8px; margin-bottom: 10px; font-size: 0.9em; color: #2ed573;">
                ${I18n.t('ui.insurance.carPlanNotice')}
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
                <div class="plan-price">${I18n.t('ui.insurance.premiumHint')} $${plan.monthlyPremium}/mo</div>
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
        const cost = Math.floor(houseInfo.cost * (state.rentIndex || 1));
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
                <div style="margin-top: 15px; margin-bottom: 5px; font-weight: bold; border-bottom: 1px solid var(--color-border); padding-bottom: 5px; display: flex; align-items: baseline; gap: 8px;">
                    <span>${I18n.t('ui.status.effectsTitle')}</span>
                    <span style="font-size: 0.85em; font-weight: normal; color: var(--color-text-secondary);">${I18n.t('game.housing.recoverEveryNight').replace(/[：:]\s*$/, '')}</span>
                </div>
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

        const desc = this.resolveText(houseInfo.description) || I18n.t(`data.housing.${houseId}.description`);

        const pendingHousingId = state.pendingHousing;
        let pendingHtml = '';
        let actionHtml = '';

        if (pendingHousingId && GameData.housingTypes[pendingHousingId]) {
            const pendingInfo = GameData.housingTypes[pendingHousingId];
            const pendingName = this.resolveText(pendingInfo.name);
            pendingHtml = `
                <div style="margin-top: 12px; padding: 10px; border-radius: 8px; background: rgba(255, 206, 86, 0.12); color: var(--color-warning);">
                    🚚 ${I18n.t('game.housing.pendingTo', pendingName)}
                </div>
            `;
            actionHtml = `<button class="action-btn" id="cancel-housing-change-btn">${I18n.t('game.housing.cancelChange')}</button>`;
        } else {
            actionHtml = `<button class="primary-button" id="request-housing-change-btn">${I18n.t('game.housing.requestChange')}</button>`;
        }

        content.innerHTML = `
            <div class="modal-header">
                <h3>${name}</h3>
                <button id="close-housing-modal">❌</button>
            </div>
            <div class="modal-body">
                <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px;">
                    <span>${I18n.t('ui_static.status_page.monthly_rent')}</span>
                    <span class="money danger">$${cost.toLocaleString()}</span>
                </div>
                ${effectsHtml}
                ${desc ? `<div style="margin-top: 15px; font-size: 0.9em; line-height: 1.4; color: var(--color-text-secondary);">${desc}</div>` : ''}
                ${pendingHtml}
            </div>
             <div class="modal-footer" style="margin-top: 20px; text-align: right; display:flex; justify-content:flex-end; gap:8px; flex-wrap:wrap;">
                ${actionHtml}
                <button class="primary-button" id="close-housing-btn-bottom">${I18n.t('ui.status.close')}</button>
            </div>
        `;

        // 事件绑定
        const close = () => {
            overlay.classList.add('fade-out'); // Add fade-out animation class if CSS supports it or just remove
            setTimeout(() => overlay.remove(), 200);
        };

        content.querySelector('#close-housing-modal').onclick = close;
        content.querySelector('#close-housing-btn-bottom').onclick = close;

        const requestBtn = content.querySelector('#request-housing-change-btn');
        if (requestBtn) {
            requestBtn.onclick = () => {
                close();
                this.showHousingChangeModal();
            };
        }

        const cancelBtn = content.querySelector('#cancel-housing-change-btn');
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                const ok = game.cancelHousingChange ? game.cancelHousingChange() : false;
                if (ok) {
                    this.showToast(I18n.t('game.housing.changeCanceled'), 'neutral');
                    this.updateStatusBar(game.getStatusDescription());
                }
                close();
            };
        }

        overlay.onclick = (e) => {
            if (e.target === overlay) close();
        };

        overlay.appendChild(content);
        document.body.appendChild(overlay);
    },

    showHousingChangeModal() {
        const state = game.getState();
        const currentHousing = state.housing;

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';

        const content = document.createElement('div');
        content.className = 'modal-content glass-panel';
        content.style.maxWidth = '680px';

        const options = Object.entries(GameData.housingTypes || {})
            .filter(([id]) => id !== currentHousing)
            .map(([id, house]) => {
                const icon = house.icon || '🏠';
                const name = this.resolveText(house.name);
                const baseCost = Math.floor((house.cost || 0) * (state.rentIndex || 1));
                const affordable = (state.money || 0) >= baseCost;
                const desc = this.resolveText(house.description) || I18n.t(`data.housing.${id}.description`);
                const energy = Number(house.energyRecovery || 0);
                const mental = Number(house.mentalBonus || 0);
                const health = Number(house.healthBonus || 0);
                const fmt = (v) => `${v > 0 ? '+' : ''}${v}`;

                return `
                    <button class="plan-option-card housing-change-card" data-housing-id="${id}" style="text-align:left; width:100%;" ${affordable ? '' : 'disabled aria-disabled="true"'}>
                        <div style="display:flex; justify-content:space-between; gap:12px; align-items:flex-start;">
                            <div>
                                <div style="font-weight:700;">${icon} ${name}</div>
                                <div style="margin-top:4px; font-size:0.9em; color:var(--color-text-secondary);">${desc}</div>
                                <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap; font-size:0.85rem; color:var(--color-text-secondary);">
                                    <span>${I18n.t('game.housing.recoverEveryNight')}</span>
                                    <span>⚡ ${fmt(energy)}</span>
                                    <span>🧠 ${fmt(mental)}</span>
                                    <span>❤️ ${fmt(health)}</span>
                                </div>
                            </div>
                            <div style="text-align:right; white-space:nowrap;">
                                <div class="money danger">$${baseCost.toLocaleString()}</div>
                                ${affordable ? '' : `<div style="margin-top:4px; font-size:0.75em; color:var(--color-danger);">${I18n.t('game.housing.insufficientCashShort', baseCost)}</div>`}
                            </div>
                        </div>
                    </button>
                `;
            }).join('');

        content.innerHTML = `
            <div class="modal-header">
                <h3>${I18n.t('game.housing.requestChange')}</h3>
                <button id="close-housing-change-modal">❌</button>
            </div>
            <div class="modal-body" style="display:grid; gap:10px; max-height:65vh; overflow:auto;">
                <div style="font-size:0.9rem; color:var(--color-text-secondary);">
                    ${I18n.t('game.housing.nextCycleEffective')}
                </div>
                ${options || `<div style="color:var(--color-text-secondary);">${I18n.t('game.housing.noAlternative')}</div>`}
            </div>
        `;

        const close = () => overlay.remove();
        content.querySelector('#close-housing-change-modal').onclick = close;
        overlay.onclick = (e) => {
            if (e.target === overlay) close();
        };

        content.querySelectorAll('[data-housing-id]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.housingId;
                const ok = game.requestHousingChange ? game.requestHousingChange(targetId) : false;
                if (ok) {
                    this.showToast(I18n.t('game.housing.nextCycleEffective'), 'positive');
                    this.updateStatusBar(game.getStatusDescription());
                }
                close();
            });
        });

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
                this.showToast(I18n.t('ui.toast.undoChangeRequest'));
                this.renderInsurancePage();
                this.updateStatusBar(game.getStatusDescription());
                return;
            } else {
                this.showToast(I18n.t('ui.toast.isCurrentOption'));
                return;
            }
        }

        // 设置待变更
        state.insurance.pendingCarPlanId = planId;
        const plan = GameData.insuranceSystem.carPlans[planId];
        this.showToast(I18n.t('ui.toast.changeSubmitted', this.resolveText(plan.name)));
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

        // 总计
        if (this.elements.billDetailTotal) {
            this.elements.billDetailTotal.textContent = `$${total.toLocaleString()}`;
        }

        this.elements.billDetailModal.classList.remove('hidden');
    },

    /**
     * 财务详情弹窗
     */
    showFinanceDetailModal(options = {}) {
        if (!this.elements.financeDetailModal) return;

        const state = game.getState();
        if (!state.autoRepay || typeof state.autoRepay !== 'object') {
            state.autoRepay = { enabled: false, keepCash: 1000, maxDaily: 0 };
        }

        if (this.elements.financeDetailCash) {
            this.elements.financeDetailCash.textContent = game.formatMoney(state.money || 0);
        }

        const prices = state.marketPrices || {};
        const holdings = state.holdings || {};
        let portfolioValue = 0;

        if (this.elements.financeDetailInvestmentList) {
            this.elements.financeDetailInvestmentList.innerHTML = '';
        }

        const investmentRows = [];
        Object.keys(holdings).forEach(id => {
            const holding = holdings[id];
            if (holding && holding.quantity > 0 && prices[id]) {
                const value = holding.quantity * prices[id].price;
                portfolioValue += value;
                const asset = GameData.assetTypes[id];
                const name = asset ? this.resolveText(asset.name) : id;
                investmentRows.push({ name, value });
            }
        });

        if (this.elements.financeDetailInvestments) {
            this.elements.financeDetailInvestments.textContent = game.formatMoney(portfolioValue);
        }

        if (this.elements.financeDetailInvestmentList) {
            if (investmentRows.length === 0) {
                this.elements.financeDetailInvestmentList.innerHTML = `<div class="finance-detail-empty">${I18n.t('ui_static.finance_detail.noInvestments')}</div>`;
            } else {
                investmentRows.forEach(row => {
                    const item = document.createElement('div');
                    item.className = 'finance-detail-item';
                    item.innerHTML = `<span>${row.name}</span><span>$${Math.round(row.value).toLocaleString()}</span>`;
                    this.elements.financeDetailInvestmentList.appendChild(item);
                });
            }
        }

        const totalDebt = Math.max(0, state.debt || 0);
        if (this.elements.financeDetailDebtTotal) {
            this.elements.financeDetailDebtTotal.textContent = game.formatMoney(totalDebt);
        }

        if (this.elements.financeDetailDebtList) {
            this.elements.financeDetailDebtList.innerHTML = '';

            const addDebtItem = (label, value) => {
                const item = document.createElement('div');
                item.className = 'finance-detail-item';
                item.innerHTML = `<span>${label}</span><span>$${Math.round(value).toLocaleString()}</span>`;
                this.elements.financeDetailDebtList.appendChild(item);
            };

            const pendingTotal = (state.pendingMedicalInstallments || [])
                .reduce((sum, item) => sum + (item.remaining || 0), 0);
            if (pendingTotal > 0) {
                addDebtItem(I18n.t('finance.pendingInstallment'), pendingTotal);
            }

            const interestTotal = Math.max(0, state.debtInterestAccrued || 0);
            if (interestTotal > 0) {
                addDebtItem(I18n.t('finance.interest'), interestTotal);
            }

            const sourceTotals = {};
            (state.debtItems || []).forEach(item => {
                if (!item || !item.source || typeof item.amount !== 'number') return;
                sourceTotals[item.source] = (sourceTotals[item.source] || 0) + item.amount;
            });

            Object.keys(sourceTotals).forEach(source => {
                if (source === 'interest') return;
                const label = game._getDebtSourceLabel ? game._getDebtSourceLabel(source) : source;
                addDebtItem(label, sourceTotals[source]);
            });

            if (this.elements.financeDetailDebtList.children.length === 0) {
                this.elements.financeDetailDebtList.innerHTML = `<div class="finance-detail-empty">${I18n.t('ui_static.finance_detail.noDebt')}</div>`;
            }
        }

        if (this.elements.financeDetailRepayInput) {
            this.elements.financeDetailRepayInput.max = `${Math.max(0, state.money || 0)}`;
        }

        if (this.elements.autoRepayEnabled) {
            this.elements.autoRepayEnabled.checked = !!state.autoRepay.enabled;
        }
        if (this.elements.autoRepayKeepCash) {
            this.elements.autoRepayKeepCash.value = `${Math.max(0, Math.round(state.autoRepay.keepCash || 0))}`;
        }
        if (this.elements.autoRepayMaxDaily) {
            this.elements.autoRepayMaxDaily.value = `${Math.max(0, Math.round(state.autoRepay.maxDaily || 0))}`;
        }

        this.updateAutoRepayIndicator(state);

        this.setFinanceDetailViewMode(options);

        this.elements.financeDetailModal.classList.remove('hidden');
    },

    setFinanceDetailViewMode(options = {}) {
        const onlyAutoRepay = !!options.onlyAutoRepay;

        const setVisible = (el, visible) => {
            if (!el) return;
            el.style.display = visible ? '' : 'none';
        };

        if (onlyAutoRepay) {
            setVisible(this.elements.financeDetailSectionCash, false);
            setVisible(this.elements.financeDetailSectionDebt, false);
            setVisible(this.elements.financeDetailSectionRepay, false);
            setVisible(this.elements.financeDetailSectionAutoRepay, true);
        } else {
            setVisible(this.elements.financeDetailSectionCash, true);
            setVisible(this.elements.financeDetailSectionDebt, true);
            setVisible(this.elements.financeDetailSectionRepay, true);
            setVisible(this.elements.financeDetailSectionAutoRepay, true);
        }

        if (onlyAutoRepay && this.elements.financeDetailSectionAutoRepay) {
            this.elements.financeDetailSectionAutoRepay.scrollIntoView({ block: 'start' });
        }
    },

    syncAutoRepayFromModal() {
        const state = game.getState();
        if (!state) return;
        if (!state.autoRepay || typeof state.autoRepay !== 'object') {
            state.autoRepay = { enabled: false, keepCash: 1000, maxDaily: 0 };
        }

        const keepCash = this.elements.autoRepayKeepCash
            ? Math.max(0, Math.round(Number(this.elements.autoRepayKeepCash.value) || 0))
            : 0;
        const maxDaily = this.elements.autoRepayMaxDaily
            ? Math.max(0, Math.round(Number(this.elements.autoRepayMaxDaily.value) || 0))
            : 0;

        state.autoRepay.enabled = !!(this.elements.autoRepayEnabled && this.elements.autoRepayEnabled.checked);
        state.autoRepay.keepCash = keepCash;
        state.autoRepay.maxDaily = maxDaily;

        if (this.elements.autoRepayKeepCash) this.elements.autoRepayKeepCash.value = `${keepCash}`;
        if (this.elements.autoRepayMaxDaily) this.elements.autoRepayMaxDaily.value = `${maxDaily}`;

        this.updateAutoRepayIndicator(state);
    },

    updateAutoRepayIndicator(stateOverride = null) {
        const state = stateOverride || game.getState();
        if (!state || !this.elements.debtAutoRepayBtn) return;

        const enabled = !!(state.autoRepay && state.autoRepay.enabled);
        this.elements.debtAutoRepayBtn.textContent = enabled ? 'Auto' : '';
        this.elements.debtAutoRepayBtn.classList.toggle('enabled', enabled);
    },

    handleFillMaxRepay() {
        if (!this.elements.financeDetailRepayInput) return;
        const state = game.getState();
        const maxRepay = Math.min(state.money || 0, state.debt || 0);
        this.elements.financeDetailRepayInput.value = Math.max(0, maxRepay);
    },

    handleDebtRepay() {
        if (!this.elements.financeDetailRepayInput) return;
        const raw = parseFloat(this.elements.financeDetailRepayInput.value);
        if (!raw || raw <= 0) {
            this.showToast(I18n.t('ui.toast.invalidQuantity'), 'negative');
            return;
        }

        const result = game.repayDebt(raw);
        if (!result || !result.success) {
            this.showToast(I18n.t('finance.repayEmpty'), 'warning');
            return;
        }

        this.elements.financeDetailRepayInput.value = '';
        this.showToast(I18n.t('finance.repaySuccess', result.paid), 'positive');
        this.updateStatusBar(game.getStatusDescription());
        this.renderStatusPage();
        this.showFinanceDetailModal();
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

    // V2.XX 动画状态
    animationState: {
        money: 0,
        moneyRaf: null
    },

    /**
     * 数字滚动动画
     * @param {HTMLElement} element 目标元素
     * @param {number} start 起始值
     * @param {number} end 结束值
     * @param {number} duration 持续时间(ms)
     * @param {function} formatter 格式化函数
     */
    animateValue(element, start, end, duration, formatter) {
        if (start === end) return;

        const range = end - start;
        let startTime = null;

        // 清除之前的动画（如果有）
        if (this.animationState.moneyRaf) {
            cancelAnimationFrame(this.animationState.moneyRaf);
        }

        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);

            // Ease-out expo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const current = start + (range * easeProgress);
            element.textContent = formatter(current);

            // 保持正负样式更新 during animation
            element.classList.toggle('danger', current < 0);

            if (progress < 1) {
                this.animationState.moneyRaf = requestAnimationFrame(step);
            } else {
                this.animationState.moneyRaf = null;
                // 确保最终值精确
                element.textContent = formatter(end);
                element.classList.toggle('danger', end < 0);
            }
        };

        this.animationState.moneyRaf = requestAnimationFrame(step);
    },

    /**
     * V2.XX Dynamic font scaling for status elements
     */
    adjustFontSize(element, minSize = 9) {
        if (!element) return;

        // Reset to default
        element.style.fontSize = '';
        element.style.whiteSpace = 'nowrap';
        element.style.display = 'inline-block';
        element.style.maxWidth = '100%';
        element.style.overflow = 'hidden'; // Ensure it clips to clientWidth logic

        let fs = parseFloat(window.getComputedStyle(element).fontSize);
        // Safety check
        if (isNaN(fs)) fs = 14;

        while (element.scrollWidth > element.clientWidth && fs > minSize) {
            fs -= 1;
            element.style.fontSize = `${fs}px`;
        }
    },

    /**
     * 更新状态栏
     */
    updateStatusBar(status, stateOverride = null) {
        const state = stateOverride || game.getState();
        const isPreview = !!stateOverride;

        // Apply Visual Offsets (only if not in preview mode, to keep previews accurate to logic)
        // Actually, previews usually don't have artifacts running?
        // If we choose an option that triggers artifacts, the preview shows the FINAL state.
        // We probably shouldn't offset the preview, but updateStatusBar is called during animation which is NOT preview.
        // So: Apply offsets if !isPreview.

        const offset = (key) => (!isPreview && this.visualOffsets ? (this.visualOffsets[key] || 0) : 0);

        // 金额 (带动画)
        // Use state.money + offset
        const currentMoney = state.money + offset('money');
        const displayMoney = this.animationState.money;

        // 数值有变化时播放动画（包括预览状态，确保点击时平滑过渡）
        if (Math.abs(currentMoney - displayMoney) > 0.1) {
            // 如果差异太大（例如读档），或者是初次加载，可能不希望动画那么慢？
            // 目前统一用 1s 动画
            this.animateValue(
                this.elements.moneyValue,
                displayMoney,
                currentMoney,
                1000,
                (val) => game.formatMoney(val)
            );
            this.animationState.money = currentMoney;
        } else {
            // 目标数值无变化
            // 如果不在动画中，才强制由 textContent 覆盖，以防浮点误差或格式问题
            // 如果正在动画中 (moneyRaf != null)，则让动画继续跑到终点，不要打断
            if (!this.animationState.moneyRaf) {
                this.elements.moneyValue.textContent = status.money;
                this.elements.moneyValue.classList.toggle('danger', parseFloat(status.money.replace(/[^0-9.-]+/g, "")) < 0);

                // 确保同步状态 (防止通过其他方式直接修改了DOM导致不同步)
                this.animationState.money = currentMoney;
            }
        }

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
            const valueStr = game.formatMoney(portfolioValue);

            // 如果只有 0 资产，显示淡色
            if (portfolioValue === 0) {
                this.elements.investmentValue.innerHTML = `${label}:<span style="color: ${neutralColor}">${valueStr}</span>`;
            } else {
                this.elements.investmentValue.innerHTML = `${label}:${valueStr}<span style="color: ${color}; font-size: 0.9em;">${rateStr}</span>`;
            }
        }

        if (this.elements.debtValue) {
            const debtAmount = Math.max(0, state.debt || 0);
            const label = I18n.t('finance.debt');
            this.elements.debtValue.textContent = `${label}: $${debtAmount.toLocaleString()}`;
            this.elements.debtValue.style.opacity = debtAmount > 0 ? '1' : '0.6';
        }
        this.updateAutoRepayIndicator(state);

        // 住所
        const pendingTag = state.pendingHousing ? ' 🚚' : '';
        this.elements.housingValue.textContent = `${status.housing}${pendingTag}`;
        this.adjustFontSize(this.elements.housingValue);

        // 工作
        this.elements.jobValue.textContent = status.job;
        this.adjustFontSize(this.elements.jobValue);

        // 精力条
        const effectiveEnergy = Math.max(0, Math.min(state.maxEnergy || 100, state.energy + offset('energy')));
        this.elements.energyBar.style.width = `${effectiveEnergy}%`;

        // V2.XX: 显示上限削减 (Energy)
        const maxEnergy = state.maxEnergy || 100;
        const BASE_MAX_ENERGY = 100;

        let energyCap = this.elements.energyBar.parentElement.querySelector('.progress-cap');
        if (energyCap) energyCap.remove();

        if (Math.round(maxEnergy) < BASE_MAX_ENERGY) {
            const capPercent = BASE_MAX_ENERGY - Math.round(maxEnergy);
            energyCap = document.createElement('div');
            energyCap.className = 'progress-cap';
            energyCap.style.width = `${capPercent}%`;
            this.elements.energyBar.parentElement.appendChild(energyCap);
        }
        if (this.elements.energyVal) {
            const maxEnergy = state.maxEnergy || 100;
            this.elements.energyVal.textContent = `${Math.round(effectiveEnergy)}/${Math.round(maxEnergy)}`;
        }

        // 低精力警告
        // 低精力警告
        const statusBar = document.getElementById('dashboard-stats');
        if (statusBar) {
            statusBar.classList.toggle('low-energy', status.isLowEnergy);
        }

        // 精神条
        const effectiveMental = Math.max(0, Math.min(state.maxMental || 100, state.mental + offset('mental')));
        this.elements.mentalBar.style.width = `${effectiveMental}%`;

        // V2.XX: 显示上限削减 (Mental)
        const maxMental = state.maxMental || 100;
        const BASE_MAX_MENTAL = 100;

        let mentalCap = this.elements.mentalBar.parentElement.querySelector('.progress-cap');
        if (mentalCap) mentalCap.remove();

        if (Math.round(maxMental) < BASE_MAX_MENTAL) {
            const capPercent = BASE_MAX_MENTAL - Math.round(maxMental);
            mentalCap = document.createElement('div');
            mentalCap.className = 'progress-cap';
            mentalCap.style.width = `${capPercent}%`;
            this.elements.mentalBar.parentElement.appendChild(mentalCap);
        }
        if (this.elements.mentalVal) {
            const maxMental = state.maxMental || 100;
            this.elements.mentalVal.textContent = `${Math.round(effectiveMental)}/${maxMental}`;
        }

        // 健康条
        const effectiveHealth = Math.max(0, Math.min(state.maxHealth || 100, state.health + offset('health')));
        this.elements.healthBar.style.width = `${effectiveHealth}%`;

        // V2.XX: 显示上限削减 (Health)
        const maxHealth = state.maxHealth || 100;
        const BASE_MAX_HEALTH = 100;

        let healthCap = this.elements.healthBar.parentElement.querySelector('.progress-cap');
        if (healthCap) healthCap.remove();

        if (Math.round(maxHealth) < BASE_MAX_HEALTH) {
            const capPercent = BASE_MAX_HEALTH - Math.round(maxHealth);
            healthCap = document.createElement('div');
            healthCap.className = 'progress-cap';
            healthCap.style.width = `${capPercent}%`;
            this.elements.healthBar.parentElement.appendChild(healthCap);
        }
        if (this.elements.healthVal) {
            const hStatus = state.healthStatus || 'normal';
            const statusText = I18n.t(`data.healthStatuses.${hStatus}`);
            const maxHealth = state.maxHealth || 100;
            this.elements.healthVal.textContent = `${statusText} ${Math.round(effectiveHealth)}/${Math.round(maxHealth)}`;
        }

        // Social
        if (this.elements.socialBar) {
            const social = state.socialValue !== undefined ? state.socialValue : 50;
            this.elements.socialBar.style.width = `${social}%`;
            // Color gradient for social logic could be added here if needed, for now standard
            // this.elements.socialBar.style.background = 'linear-gradient(90deg, #a29bfe, #6c5ce7)'; 

            if (this.elements.socialVal) {
                const maxSocial = state.maxSocialValue || 100;
                this.elements.socialVal.textContent = `${Math.round(social)}/${Math.round(maxSocial)}`;
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
                this.elements.paydayCountdown.textContent = I18n.t('ui_static.finance.day_count', status.daysUntilPayday);
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

        // Find nearest due date
        const nearestDays = Math.min(rentDays, insDays, utilDays);

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
        // 更新储备信息: Merged Ingredients into Meal card logic
        if (this.elements.ingredientsCount) {
            const ingCount = status.ingredients !== undefined ? status.ingredients : 0;
            this.elements.ingredientsCount.textContent = I18n.t('ui_static.finance.ingredients_count', ingCount);
            // Optional: Color coding if low ingredients?
            // this.elements.ingredientsCount.className = 'finance-sub-value' + (ingCount <= 1 ? ' danger' : '');
        }
        if (this.elements.mealStatus) {
            this.elements.mealStatus.textContent = status.hasPreparedMeal
                ? I18n.t('ui_static.finance.prepared')
                : I18n.t('ui_static.finance.not_prepared');
            this.elements.mealStatus.className = 'status-value' + (status.hasPreparedMeal ? ' positive' : ' warning');
            this.adjustFontSize(this.elements.mealStatus);
        }

        // Render Artifacts (Slots)
        this.renderArtifactSlots();

        // V2.7 任务进度
        // V2.28 住院时的 UI 覆盖 (替换工作任务显示)
        const isHospitalized = (state.hospitalDaysLeft || 0) > 0;

        if (this.elements.taskContainer) {
            const label = this.elements.taskContainer.querySelector('.finance-label');

            if (true) { // Modified: Always show normal task logic, remove hospitalization override
                // 正常工作任务显示
                if (this.elements.taskContainer) {
                    // 隐藏条件: 失业 或 被裁
                    const shouldHide = status.jobId === 'unemployed' || status.jobId === 'fired' || isHospitalized;

                    if (shouldHide) {
                        this.elements.taskContainer.classList.add('hidden');
                    } else {
                        // 移除 hidden 类
                        this.elements.taskContainer.classList.remove('hidden');
                        // 如果原来是用 style.display 控制的，这里也可以 reset
                        this.elements.taskContainer.style.display = '';

                        if (label) {
                            if (status.workTask && status.workTask.name) {
                                const taskName = this.resolveText(status.workTask.name);
                                const normalized = String(taskName || '');
                                let displayTaskName = normalized;
                                if (I18n.currentLang === 'en' && /[\u4e00-\u9fff]/.test(normalized)) {
                                    const zhTaskNames = ['项目开发', '报告撰写', '数据分析', '客户方案', '系统维护', '代码审查'];
                                    const enTaskNames = I18n.t('game.taskNames');
                                    const taskIndex = zhTaskNames.indexOf(normalized);
                                    if (taskIndex >= 0 && Array.isArray(enTaskNames) && enTaskNames[taskIndex]) {
                                        displayTaskName = enTaskNames[taskIndex];
                                    }
                                }
                                label.textContent = `📋 ${displayTaskName}`;
                            } else {
                                label.textContent = `📋 ${I18n.t('ui_static.finance.task')}`;
                            }
                        }

                        if (this.elements.layoffRiskContainer && this.elements.layoffRiskVal) {
                            // V2.XX: 使用后端计算的综合风险（包含社交、效率、任务逾期等）
                            const risk = game.calculateLayoffRisk();
                            if (risk > 0) {
                                this.elements.layoffRiskContainer.classList.remove('hidden');
                                this.elements.layoffRiskVal.textContent = `${risk}%`;
                                this.elements.layoffRiskVal.classList.toggle('danger', risk >= 30);
                            } else {
                                // 没有风险时显示 0% 作为正面激励
                                this.elements.layoffRiskContainer.classList.remove('hidden');
                                this.elements.layoffRiskVal.textContent = `0%`;
                                this.elements.layoffRiskVal.classList.remove('danger');
                            }
                        }

                        if (this.elements.taskProgress && status.workTask) {
                            this.elements.taskProgress.textContent = `${status.workTask.progress}% (${I18n.t('ui_static.finance.difficulty')}: ${status.workTask.difficulty})`;

                            // 更新进度条宽度
                            if (this.elements.taskProgressBar) {
                                this.elements.taskProgressBar.style.width = `${status.workTask.progress}%`;
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
                                this.elements.taskDeadline.textContent = I18n.t('ui_static.finance.overdue_days', Math.abs(deadline));
                                this.elements.taskDeadline.className = 'finance-sub danger';
                            } else {
                                this.elements.taskDeadline.textContent = I18n.t('ui_static.finance.day_count', deadline);
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

        // V2.XX Update News Ticker (since it's in the header, update with status)
        if (!isPreview) {
            this.updateNewsTicker();
        }
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

    // showDevEditor moved to gm_panel.js logic

    /**
     * V2.45 Bind Dev Editor
     * Logic is now handled by gm_panel.js which provides full feature support
     */
    bindDevEditorEvents() {
        // Handled by initGMPanel() in gm_panel.js
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
        let dayText = I18n.t('ui_static.game_header.day', status.day);
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
    renderLunchSelector() {
        if (!this.elements.lunchSelector) return;
        this.elements.lunchSelector.classList.add('hidden');
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
        if (actions.length <= 1 || state.period !== 'day' || state.sideActionsLocked) {
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

        if (!state.activeIncidents) {
            state.activeIncidents = GameEvents.getAvailableIncidents(state, { game, rng: game.rng });
        }

        if (!state.activeIncidents || state.activeIncidents.length === 0 || state.period !== 'day' || state.sideActionsLocked) {
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
                missing.push(I18n.t('ui.validation.selectLunch'));
            }
        }

        // 2. 检查日常 (仅白天且显示时)
        if (state.period === 'day' && this.elements.dailyActionSelector && !this.elements.dailyActionSelector.classList.contains('hidden')) {
            if (!state.selectedDailyAction) {
                isValid = false;
                missing.push(I18n.t('ui.validation.selectAction'));
            }
        }



        // 4. 检查突发 (仅白天且显示时)
        if (state.period === 'day' && this.elements.incidentSelector && !this.elements.incidentSelector.classList.contains('hidden')) {
            if (!state.selectedIncident) {
                isValid = false;
                missing.push(I18n.t('ui.validation.selectIncident'));
            }
        }

        // 更新按钮状态
        // V2.38 预览模式：主选项允许点击以预览；是否可进入下一阶段由控制器决定
        this.mainChoiceValid = isValid;
        const separator = I18n.currentLang === 'zh' ? '、' : ', ';
        const missingText = missing.join(separator);
        choiceButtons.forEach(btn => {
            if (!isValid) {
                btn.title = I18n.t('ui.validation.previewHint', missingText);
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
                    hintText.textContent = `${I18n.t('ui.validation.pleaseSelectPrefix')} ${missingText}`;
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

        const isMedicalEmergency = event && event.id === 'medical_emergency';
        const isSideActionsLocked = !!state.sideActionsLocked;

        if (isRandomEncounter || isMedicalEmergency || isSideActionsLocked) {
            // V2.42: 随机事件/队列插队事件不显示日常侧边栏
            // if (this.elements.commuteSelector) this.elements.commuteSelector.classList.add('hidden');
            if (this.elements.lunchSelector) this.elements.lunchSelector.classList.add('hidden');
            if (this.elements.dailyActionSelector) this.elements.dailyActionSelector.classList.add('hidden');
            if (this.elements.incidentSelector) this.elements.incidentSelector.classList.add('hidden');
        } else {

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

        // 精力消耗提示 (根据需求屏蔽)
        this.elements.eventEnergyCost.style.display = 'none';

        // 标题和描述
        this.elements.eventTitle.textContent = typeof event.title === 'function'
            ? event.title(state)
            : event.title;

        let description = typeof event.description === 'function'
            ? event.description(state)
            : event.description;
        if (event.id === 'night_choice' && state.eveningOmen) {
            description = `${description || ''}\n${state.eveningOmen}`;
        }
        this.elements.eventDescription.textContent = description || '';

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
     * 显示Toast (队列机制)
     */
    /**
     * 显示Toast (多重堆叠机制 - Max 3)
     */
    showToast(message, type = 'neutral') {
        if (!message) return;

        // 确保容器存在
        const container = this.elements.toastContainer;
        if (!container) return;

        // 创建 Toast 元素
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = String(message).replace(/\n/g, '<br>'); // 支持换行

        // 添加到容器
        container.appendChild(toast);

        // 限制数量：如果超过2个，移除最旧的（第一个）
        // 注意：因为我们是 appendChild，所以最新的在最后。
        // 如果要限制总数，应该移除 childNodes[0]
        while (container.childNodes.length > 2) {
            const oldToast = container.firstChild;
            if (oldToast) {
                oldToast.classList.add('fade-out');
                // 动画结束后移除，或者立即移除以保持数量严格控制
                // 这里为了视觉平滑，可能需要一个小技巧。
                // 但为了严谨控制数量，直接移除或者快速移除。
                container.removeChild(oldToast);
            }
        }

        // 自动消失计时器
        setTimeout(() => {
            // 添加淡出类
            toast.classList.add('fade-out');
            // 等待动画结束移除
            toast.addEventListener('transitionend', () => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            });
            //由于 transitionend 可能因为隐藏不可见而不触发，加个兜底
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.parentElement.removeChild(toast);
                }
            }, 500);
        }, 3000);
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
        if (!ending) {
            console.error('[UI] showEnding called with null ending');
            return;
        }
        if (ending.isVictory) {
            this.elements.endingContent.classList.add('victory');
            if (this.elements.continueButton) this.elements.continueButton.classList.remove('hidden');
        } else {
            this.elements.endingContent.classList.remove('victory');
            if (this.elements.continueButton) this.elements.continueButton.classList.add('hidden');
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
            <span class="stat-label">${I18n.t('ui_static.ending_stats.debt')}</span>
            <span class="stat-value" style="color: var(--color-danger, #ff4d4f);">${finalStats.debt}</span>
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
        this.currentAssetCategory = this.currentAssetCategory || 'watchlist';

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
        let text = I18n.t('ui.assets.sentimentNeutral');
        let className = '';
        if (sentiment <= -30) {
            text = I18n.t('ui.assets.sentimentExtremeFear');
            className = 'fear';
        } else if (sentiment < -10) {
            text = I18n.t('ui.assets.sentimentFear');
            className = 'fear';
        } else if (sentiment >= 30) {
            text = I18n.t('ui.assets.sentimentExtremeGreed');
            className = 'greed';
        } else if (sentiment > 10) {
            text = I18n.t('ui.assets.sentimentGreed');
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

        // 自选页面逻辑
        if (category === 'watchlist') {
            // 1. 渲染综合收益走势图
            const summaryCard = this.renderWatchlistSummary(state);
            if (summaryCard) container.appendChild(summaryCard);

            // 2. 筛选已购买或已收藏的资产
            const watchlist = state.favoriteAssets || [];
            const sortedAssets = Object.keys(assetTypes).filter(id => {
                const holding = state.holdings[id];
                const isOwned = holding && holding.quantity > 0;
                const isFavorite = watchlist.includes(id);
                return isOwned || isFavorite;
            }).sort((a, b) => {
                // 排序：自选页面，已持有的排前面，然后按收藏顺序
                const holdingA = state.holdings[a]?.quantity > 0;
                const holdingB = state.holdings[b]?.quantity > 0;
                if (holdingA && !holdingB) return -1;
                if (!holdingA && holdingB) return 1;
                return 0; // 保持原有顺序或其他排序
            });

            if (sortedAssets.length === 0) {
                container.innerHTML += `<div class="empty-state" style="padding: 2rem; text-align: center; color: #95a5a6;">${I18n.t('ui.assets.noWatchlist') || '暂无自选资产<br>请在其他分类中点击星号收藏'}</div>`;
                return;
            }

            for (const assetId of sortedAssets) {
                const config = assetTypes[assetId];
                const holding = state.holdings[assetId];
                const marketData = state.marketPrices[assetId];
                if (holding && marketData) {
                    const card = this.createAssetCard(assetId, config, holding, marketData);
                    container.appendChild(card);
                }
            }
            return;
        }

        // 普通分类逻辑
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

        const isFavorite = (game.state.favoriteAssets || []).includes(assetId);

        card.innerHTML = `
            <div class="asset-header">
                <div style="display:flex; align-items:center;">
                    <span class="asset-icon">${config.icon}</span>
                    <span class="asset-name">${this.resolveText(config.name)}</span>
                </div>
                <div style="display:flex; align-items:center; gap: 8px;">
                     <span class="asset-risk ${config.riskLevel}">${this.getRiskLabel(config.riskLevel)}</span>
                     <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-asset="${assetId}">★</button>
                </div>
            </div>
            <div class="asset-price">
                <span class="price-value">${priceText}</span>
                <span class="price-change ${changeClass}">${changeSign}${marketData.change.toFixed(1)}%</span>
            </div>
            <div class="asset-holding">
                <span>${I18n.t('ui.assets.holding')}: ${holding.quantity.toFixed(4)} ${this.resolveText(config.unit)}</span>
                <span>${I18n.t('ui.assets.value')}: $${Math.round(holdingValue).toLocaleString()}</span>
            </div>
            ${holding.quantity > 0 ? `
            <div class="asset-profit">
                <span class="${profitClass}">${I18n.t('ui.assets.profitLoss')}: ${profitLoss >= 0 ? '+' : ''}$${profitLoss.toFixed(2)} (${profitLoss >= 0 ? '+' : ''}${profitPercent}%)</span>
                <span class="asset-avgcost">${I18n.t('ui.assets.avgCost')}: $${holding.avgCost.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="asset-actions">
                <button class="asset-btn trend-btn" data-action="trend" data-type="${assetId}" style="background: var(--color-info);">${I18n.t('ui.assets.trend')}</button>
                <button class="asset-btn buy" data-action="buy" data-type="${assetId}">${I18n.t('ui.assets.buy')}</button>
                <button class="asset-btn sell" data-action="sell" data-type="${assetId}">${I18n.t('ui.assets.sell')}</button>
            </div>
        `;

        card.querySelector('.favorite-btn').addEventListener('click', (e) => {
            e.stopPropagation(); // 防止触发其他点击
            this.toggleFavorite(assetId);
            // 仅切换样式，如果是在自选页且未持有，可能需要移除卡片，但为了体验，暂不立即移除，或者重新渲染
            const btn = e.currentTarget;
            btn.classList.toggle('active');

            // 如果在自选页，取消收藏且未持仓，立即刷新 list
            if (this.currentAssetCategory === 'watchlist') {
                const isOwned = holding.quantity > 0;
                if (!btn.classList.contains('active') && !isOwned) {
                    this.renderAssetsScreen();
                }
            }
        });

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
        return I18n.t(`ui.assets.riskLevel.${riskLevel}`) || riskLevel;
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
            this.showToast(I18n.t('ui.toast.assetLoadError'), 'error');
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
     * V2.XX 填充最大交易数量
     */
    fillMaxTradeQuantity() {
        if (!this.currentTradeAssetId || !this.currentTradeAction) return;

        const state = game.getState();
        const assetId = this.currentTradeAssetId;
        const marketData = state.marketPrices[assetId];
        const holding = state.holdings[assetId];

        if (!marketData) return;

        let maxQty = 0;

        if (this.currentTradeAction === 'buy') {
            if (marketData.price > 0) {
                // 向下取整保留2位小数
                maxQty = Math.floor((state.money / marketData.price) * 100) / 100;
            }
        } else {
            maxQty = holding.quantity;
        }

        this.elements.tradeQuantityInput.value = maxQty;
        this.updateTradeTotal();
    },

    /**
     * V2.13 执行资产交易
     */
    executeAssetTrade() {
        const quantity = parseFloat(this.elements.tradeQuantityInput.value);
        const action = this.currentTradeAction;
        const assetId = this.currentTradeAssetId;

        if (!assetId || !action) {
            this.showToast(I18n.t('ui.toast.tradeInfoError'), 'error');
            return;
        }

        if (isNaN(quantity) || quantity <= 0) {
            this.showToast(I18n.t('ui.toast.invalidQuantity'), 'error');
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
    },

    /**
     * V2.XX Update News Ticker
     * Cycle between Insider Tip (if any) and Market News (if any)
     */
    updateNewsTicker() {
        try {
            const state = game.getState();
            const news = state.currentNews;
            const insider = state.dailyInsiderTip;
            const rumorId = state.marketRumorId;

            const messages = [];
            const artifacts = state.artifacts || [];
            const hasInsiderPhone = artifacts.includes('insider_phone');

            // 1. Insider Tip
            if (hasInsiderPhone && insider && insider.text) {
                const insiderText = this.resolveText(insider.text);
                const insiderDetails = this.resolveText(insider.details || '');
                const fullText = insiderDetails ? `${insiderText} ⚡ ${insiderDetails}` : insiderText;
                messages.push({ type: 'insider', text: fullText, data: insider });
            }

            // 2. Market News
            if (news) {
                const title = news.title || I18n.t('game.artifactDaily.ticker_news_title');
                const fullText = news.description ? `📰 ${title}：${news.description}` : `📰 ${title}`;
                messages.push({ type: 'news', text: fullText, data: news });
            }

            // 3. Market Rumors
            if (rumorId && state.marketRumorConfirmDay > state.day) {
                const rumorNews = GameData.marketNews.find(n => n.id === rumorId);
                if (rumorNews) {
                    const tag = I18n.t('game.artifactDaily.ticker_rumor_label');
                    const title = rumorNews.title || I18n.t('game.artifactDaily.ticker_news_title');
                    const fullText = rumorNews.description ? `${tag} ${title}：${rumorNews.description}` : `${tag} ${title}`;
                    messages.push({ type: 'rumor', text: fullText, data: rumorNews });
                }
            }

            // --- Update Single Ticker ---
            if (!this.elements.newsTickerContainer || !this.elements.newsTickerContent) return;

            const oldJson = JSON.stringify(this.tickerItems || []);
            const newJson = JSON.stringify(messages);

            this.tickerItems = messages;

            if (messages.length === 0) {
                this.elements.newsTickerContainer.classList.add('hidden');
                if (this.tickerTimer) clearTimeout(this.tickerTimer);
                this.tickerTimer = null;
                return;
            }

            this.elements.newsTickerContainer.classList.remove('hidden');

            if (!this.tickerTimer || oldJson !== newJson) {
                if (this.tickerTimer) clearTimeout(this.tickerTimer);
                this.currentTickerIndex = 0;
                this.playNextTickerItem();
            }

        } catch (e) {
            console.error("Ticker error", e);
        }
    },

    playNextTickerItem() {
        if (!this.tickerItems || this.tickerItems.length === 0) {
            this.tickerTimer = null;
            return;
        }

        if (this.tickerTimer) clearTimeout(this.tickerTimer);

        if (this.currentTickerIndex === undefined || this.currentTickerIndex >= this.tickerItems.length) {
            this.currentTickerIndex = 0;
        }

        const item = this.tickerItems[this.currentTickerIndex];
        const content = this.elements.newsTickerContent;
        const container = this.elements.newsTickerContainer;
        if (!content || !container) return;

        content.style.opacity = 0;

        setTimeout(() => {
            content.innerHTML = `<span class="ticker-type-${item.type}">${item.text}</span>`;
            content.classList.remove('ticker-scroll');
            content.style.left = '';
            content.style.transform = '';
            void content.offsetWidth;

            const containerWidth = container.offsetWidth;
            const textWidth = content.offsetWidth;

            content.style.left = '0';
            const startPercent = (containerWidth / textWidth) * 100;
            content.style.setProperty('--scroll-start', `${startPercent}%`);
            content.classList.add('ticker-scroll');

            const durationSeconds = (textWidth + containerWidth) / 60;
            const animationDuration = Math.max(8, durationSeconds);
            content.style.animationDuration = `${animationDuration}s`;

            let displayDuration = animationDuration * 1000 + 200;
            content.style.opacity = 1;

            this.currentTickerIndex = (this.currentTickerIndex + 1) % this.tickerItems.length;

            this.tickerTimer = setTimeout(() => {
                this.playNextTickerItem();
            }, displayDuration);
        }, 200);
    },

    showNewsModal() {
        try {
            const body = this.elements.newsDetailBody;
            if (!body) return;

            const state = game.getState();
            const news = state.currentNews;
            const insider = state.dailyInsiderTip;
            const rumorId = state.marketRumorId;

            let html = '';

            const artifacts = state.artifacts || [];
            const hasInsiderPhone = artifacts.includes('insider_phone');

            // 1. Insider Tip Section
            const insiderTitle = I18n.t('game.artifactDaily.modal_insider_title');
            if (hasInsiderPhone) {
                if (insider) {
                    const insiderText = this.resolveText(insider.text || '');
                    const insiderDetails = this.resolveText(insider.details || '');
                    html += `
                    <div style="margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
                        <h3 style="color: #ff7675; margin-bottom: 8px; font-size: 0.9em;">${insiderTitle}</h3>
                        <p style="font-size: 1.1em; font-weight: bold; margin-bottom: 5px;">${insiderText}</p>
                        <p style="font-size: 0.85em; color: var(--color-text-secondary); line-height: 1.4;">
                            ${insiderDetails}
                        </p>
                    </div>`;
                } else {
                    html += `
                    <div style="margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
                        <h3 style="color: var(--color-text-muted); margin-bottom: 8px; font-size: 0.9em;">${insiderTitle}</h3>
                        <p style="color: var(--color-text-muted); font-style: italic; font-size: 0.85em;">${I18n.t('game.artifactDaily.modal_no_insider')}</p>
                    </div>`;
                }
            }

            // 2. Confirmed News Section
            const newsTitle = I18n.t('game.artifactDaily.modal_news_title');
            // Only show as "Confirmed News" if it's not currently in the rumor stage
            if (news && news.stage !== 'rumor') {
                const stageMarker = news.stage === 'confirmed' ? ` <span style="font-size: 0.7em; background: #6c5ce7; padding: 2px 4px; border-radius: 3px; vertical-align: middle;">${I18n.t('game.artifactDaily.modal_confirmed_badge')}</span>` : '';
                html += `
                <div style="margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
                    <h3 style="color: #a29bfe; margin-bottom: 8px; font-size: 0.9em;">${newsTitle}${stageMarker}</h3>
                    <p style="font-weight: bold; margin-bottom: 5px; font-size: 1.05em;">${news.title}</p>
                    <p style="font-size: 0.85em; line-height: 1.5; color: #eee;">${news.description || ''}</p>
                    <div style="margin-top: 10px; font-size: 0.75em; color: var(--color-text-secondary); background: rgba(0,0,0,0.2); padding: 6px; border-radius: 4px;">
                        <strong>${I18n.t('game.artifactDaily.modal_news_sentiment')}</strong> ${news.sentiment > 0 ? '+' : ''}${news.sentiment || 0}
                    </div>
                </div>`;
            } else {
                html += `
                <div style="margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px;">
                    <h3 style="color: var(--color-text-muted); margin-bottom: 8px; font-size: 0.9em;">${newsTitle}</h3>
                    <p style="color: var(--color-text-muted); font-style: italic; font-size: 0.85em;">${I18n.t('game.artifactDaily.modal_no_news')}</p>
                </div>`;
            }

            // 3. Market Rumors Section (Separate Section!)
            if (rumorId && state.marketRumorConfirmDay > state.day) {
                const rumorNews = GameData.marketNews.find(n => n.id === rumorId);
                if (rumorNews) {
                    html += `
                    <div style="margin-bottom: 10px;">
                        <h3 style="color: #fdcb6e; margin-bottom: 8px; font-size: 0.9em;">${I18n.t('game.artifactDaily.modal_rumor_title')}</h3>
                        <div style="border-left: 3px solid #fdcb6e; padding-left: 10px; background: rgba(253, 203, 110, 0.05); padding: 8px 10px; border-radius: 0 4px 4px 0;">
                            <p style="font-weight: bold; margin-bottom: 5px; font-size: 1.05em;">${rumorNews.title}</p>
                            <p style="font-size: 0.85em; line-height: 1.5; color: #eee;">${rumorNews.description || ''}</p>
                            <p style="margin-top: 8px; font-size: 0.75em; color: #fdcb6e; font-style: italic;">
                                ${I18n.t('game.artifactDaily.modal_rumor_notice', state.marketRumorConfirmDay)}
                            </p>
                        </div>
                    </div>`;
                }
            }

            body.innerHTML = html;
            this.elements.newsDetailModal.classList.remove('hidden');
        } catch (e) { console.error("Modal error", e); }
    },

    /**
     * V2.XX 切换收藏状态
     */
    toggleFavorite(assetId) {
        if (!game.state.favoriteAssets) game.state.favoriteAssets = [];
        const index = game.state.favoriteAssets.indexOf(assetId);
        if (index >= 0) {
            game.state.favoriteAssets.splice(index, 1);
            this.showToast(I18n.t('ui.assets.unfavorite') + ' ' + I18n.t('data.assetNames.' + assetId));
        } else {
            game.state.favoriteAssets.push(assetId);
            this.showToast(I18n.t('ui.assets.favorite') + ' ' + I18n.t('data.assetNames.' + assetId));
        }
    },

    /**
     * V2.XX 渲染自选页面的综合收益卡片
     */
    renderWatchlistSummary(state) {
        const history = state.portfolioHistory || [];

        // 图表视图模式：daily(最近7天) / weekly(按周采样)
        if (!this.chartViewMode) this.chartViewMode = 'daily';

        // 检查是否有足够的周数据（至少需要第5天的数据才能显示第1周的变化趋势）
        const canSwitchToWeekly = history.length > 4;
        if (!canSwitchToWeekly && this.chartViewMode === 'weekly') {
            this.chartViewMode = 'daily';
        }

        // 根据模式筛选显示数据
        let displayHistory;
        if (this.chartViewMode === 'weekly') {
            // 周视图：每7天取一个采样点
            if (history.length <= 4) {
                displayHistory = [...history];
            } else {
                displayHistory = [];
                // 游戏内4天为一周，每4天取一个采样点
                for (let i = 0; i < history.length; i += 4) {
                    displayHistory.push(history[i]);
                }
                // 确保最后一天始终显示
                const lastEntry = history[history.length - 1];
                if (displayHistory[displayHistory.length - 1] !== lastEntry) {
                    displayHistory.push(lastEntry);
                }
            }
        } else {
            // 日视图：显示最近5天
            displayHistory = history.length > 5 ? history.slice(-5) : [...history];
        }

        let totalValue = 0;
        let totalCost = 0;
        if (state.holdings) {
            for (const id in state.holdings) {
                const h = state.holdings[id];
                const p = state.marketPrices[id];
                if (h && p) {
                    totalValue += h.quantity * p.price;
                    totalCost += h.quantity * h.avgCost;
                }
            }
        }

        // 如果历史还是空的(第一天)，或者最新一天的还没有被 market.js 写入
        // market.js 是在 updateMarket 写入的。如果是当天，可能还没有 updateMarket?
        // 不，updateMarket 每天都会运行。
        // 但如果是初始化刚进入游戏，history是空的。
        // 如果 history 为空，或者 history 最后一个元素的 day 小于当前 day，说明今天的还没有入库（或者今天还没过完）
        // 实际上 market.js 是在“进入下一天”时调用的 updateMarket。
        // 所以当玩家在操作界面时，看到的是 updateMarket 之后的状态。
        // 也就是说 history 应该包含了“今天”（也就是刚刚结算完的那一天，或者说当前状态对应的那一天）。
        // 稍等，updateMarket 是在 nextDay 逻辑里调用的。
        // 所以 history 最后一个元素就是当前最新的。

        // 计算盈亏
        const totalPnl = totalValue - totalCost;
        const totalPnlPercent = totalCost > 0 ? (totalPnl / totalCost * 100).toFixed(2) : 0;

        const pnlLabel = this.chartViewMode === 'weekly' ? I18n.t('ui.assets.weeklyPnl') : I18n.t('ui.assets.todayPnl');

        let todayPnl = 0;
        let todayPnlPercent = 0;
        // 动态盈亏计算逻辑
        if (this.chartViewMode === 'weekly') {
            // 周视图：显示本周（或当前采样周期）的变化
            // displayHistory 是已经按周（4天）采样过的数据
            if (displayHistory.length >= 2) {
                const last = displayHistory[displayHistory.length - 1];
                const prev = displayHistory[displayHistory.length - 2];
                todayPnl = last.value - prev.value;
                todayPnlPercent = prev.value > 0 ? (todayPnl / prev.value * 100).toFixed(2) : 0;
            } else {
                // 数据不足一周，回退到总盈亏或0
                todayPnl = totalPnl;
                todayPnlPercent = totalPnlPercent;
            }
        } else {
            // 日视图：显示今日变化 (始终取最后两天，忽略 displayHistory 的裁剪，因为它可能只取了最后5天)
            // 使用完整 history 计算今日变化，以确保准确性
            if (history.length >= 2) {
                const last = history[history.length - 1];
                const prev = history[history.length - 2];
                todayPnl = last.value - prev.value;
                todayPnlPercent = prev.value > 0 ? (todayPnl / prev.value * 100).toFixed(2) : 0;
            } else {
                todayPnl = totalPnl;
                todayPnlPercent = totalPnlPercent;
            }
        }

        const summaryCard = document.createElement('div');
        summaryCard.className = 'watchlist-summary-card';

        // 构建 SVG 趋势图
        let svgContent = '';
        if (displayHistory.length > 1) {
            const containerWidth = 600;
            // 使用比例高度以适应不同屏幕：移动端 240px，桌面端 220px
            const isMobile = window.innerWidth <= 600;
            const containerHeight = isMobile ? 370 : 220;
            // 留出空间给坐标轴标签：左侧Y轴标签、底部X轴标签
            const paddingLeft = 65;
            const paddingRight = 20;
            const paddingTop = 25;
            const paddingBottom = 30;
            const chartWidth = containerWidth - paddingLeft - paddingRight;
            const chartHeight = containerHeight - paddingTop - paddingBottom;

            const values = displayHistory.map(h => h.value);
            const days = displayHistory.map(h => h.day);

            // 正确处理负值：不乘以系数，直接取 min/max 再加边距
            const rawMin = Math.min(...values);
            const rawMax = Math.max(...values);
            const valueRange = rawMax - rawMin;
            const margin = valueRange > 0 ? valueRange * 0.1 : Math.max(Math.abs(rawMax) * 0.1, 10);
            const minVal = rawMin - margin;
            const maxVal = rawMax + margin;
            const range = maxVal - minVal || 1;

            // 坐标映射函数
            const getX = (idx) => paddingLeft + (idx / (values.length - 1)) * chartWidth;
            const getY = (val) => paddingTop + chartHeight - ((val - minVal) / range) * chartHeight;

            // 生成折线
            const points = values.map((val, idx) => `${getX(idx).toFixed(1)},${getY(val).toFixed(1)}`).join(' ');

            // 判断涨跌颜色
            const isUp = values[values.length - 1] >= values[0];
            const strokeColor = isUp ? 'var(--color-success)' : 'var(--color-danger)';

            // Y轴：生成3-4个刻度线
            const yTickCount = 4;
            const axisFontSize = isMobile ? 20 : 15;
            const priceLabelFontSize = isMobile ? 19 : 15;
            let yAxisSvg = '';
            for (let i = 0; i <= yTickCount; i++) {
                const tickVal = minVal + (range / yTickCount) * i;
                const tickY = getY(tickVal).toFixed(1);
                const label = `$${Math.round(tickVal)}`;
                // 网格线
                yAxisSvg += `<line x1="${paddingLeft}" y1="${tickY}" x2="${containerWidth - paddingRight}" y2="${tickY}" stroke="var(--color-border)" stroke-width="0.5" stroke-dasharray="4,3" />`;
                // 刻度标签
                yAxisSvg += `<text x="${paddingLeft - 8}" y="${tickY}" fill="var(--color-text-muted)" font-size="${axisFontSize}" text-anchor="end" dominant-baseline="middle">${label}</text>`;
            }

            // X轴：根据视图模式显示天数或周数标签
            let xAxisSvg = '';
            values.forEach((val, idx) => {
                const x = getX(idx).toFixed(1);
                const xLabel = this.chartViewMode === 'weekly' ? `W${idx + 1}` : `D${days[idx]}`;
                xAxisSvg += `<text x="${x}" y="${containerHeight - 6}" fill="var(--color-text-muted)" font-size="${axisFontSize}" text-anchor="middle">${xLabel}</text>`;
            });

            // 数据点 + 价格标注
            const dotsSvg = values.map((val, idx) => {
                const x = getX(idx);
                const y = getY(val);
                const priceLabel = `$${val.toFixed(1)}`;
                // 标注位置：如果在上半部分则标在下方，否则标在上方
                const labelOffset = isMobile ? 16 : 14;
                const labelY = y < (paddingTop + chartHeight / 2) ? y + labelOffset : y - 10;
                return `
                    <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${isMobile ? 5 : 4}" fill="var(--color-surface-elevated)" stroke="${strokeColor}" stroke-width="2" />
                    <text x="${x.toFixed(1)}" y="${labelY.toFixed(1)}" fill="var(--color-text-secondary)" font-size="${priceLabelFontSize}" text-anchor="middle" font-weight="600">${priceLabel}</text>
                `;
            }).join('');

            // 趋势填充区（半透明渐变区域）
            const firstX = getX(0).toFixed(1);
            const lastX = getX(values.length - 1).toFixed(1);
            const baselineY = getY(minVal).toFixed(1);
            const fillPoints = `${firstX},${baselineY} ${points} ${lastX},${baselineY}`;
            const fillId = `chartGrad_${Date.now()}`;

            svgContent = `
                <svg viewBox="0 0 ${containerWidth} ${containerHeight}" class="chart-svg" style="width:100%; height:100%;" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="${fillId}" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stop-color="${isUp ? 'var(--color-success)' : 'var(--color-danger)'}" stop-opacity="0.25" />
                            <stop offset="100%" stop-color="${isUp ? 'var(--color-success)' : 'var(--color-danger)'}" stop-opacity="0.02" />
                        </linearGradient>
                    </defs>
                    <!-- 网格和Y轴标签 -->
                    ${yAxisSvg}
                    <!-- X轴标签 -->
                    ${xAxisSvg}
                    <!-- 趋势填充 -->
                    <polygon fill="url(#${fillId})" points="${fillPoints}" />
                    <!-- 趋势线 -->
                    <polyline fill="none" stroke="${strokeColor}" stroke-width="2.5" points="${points}" stroke-linecap="round" stroke-linejoin="round" />
                    <!-- 数据点和价格标注 -->
                    ${dotsSvg}
                </svg>
            `;
        } else {
            svgContent = `<div style="display:flex;justify-content:center;align-items:center;height:100%;color:var(--color-text-secondary);">${I18n.t('ui.assets.noHistory')}</div>`;
        }

        summaryCard.innerHTML = `
            <div class="watchlist-header">
                <div class="watchlist-title">
                     📊 ${I18n.t('ui.assets.portfolioTrend')}
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <div class="chart-view-toggle">
                        <button class="chart-toggle-btn ${this.chartViewMode === 'daily' ? 'active' : ''}" data-mode="daily">${I18n.t('ui.assets.chartDaily')}</button>
                        <button class="chart-toggle-btn ${this.chartViewMode === 'weekly' ? 'active' : ''}" data-mode="weekly" 
                                ${!canSwitchToWeekly ? 'disabled style="opacity:0.5;cursor:not-allowed;" title="' + (I18n.t('ui.assets.needMoreData') || '需积累更多数据') + '"' : ''}>
                                ${I18n.t('ui.assets.chartWeekly')}
                        </button>
                    </div>
                    <div class="watchlist-total">
                        <span style="font-size:0.9em; color:var(--color-text-secondary);">${I18n.t('ui_static.assets_page.total_assets_label')}:</span>
                        <span style="font-size:1.2em; font-weight:bold; color:var(--color-text-primary);">$${Math.round(totalValue).toLocaleString()}</span>
                    </div>
                </div>
            </div>
            
            <div class="watchlist-chart-container">
                ${svgContent}
            </div>
            
            <div class="watchlist-pnl">
                <div class="pnl-item">
                    <span class="pnl-label">${pnlLabel}</span>
                    <span class="pnl-value ${todayPnl >= 0 ? 'profit' : 'loss'}">
                        ${todayPnl >= 0 ? '+' : ''}$${todayPnl.toFixed(2)} 
                        <span style="font-size:0.8em">(${todayPnl >= 0 ? '+' : ''}${todayPnlPercent}%)</span>
                    </span>
                </div>
                <div class="pnl-separator"></div>
                <div class="pnl-item">
                    <span class="pnl-label">${I18n.t('ui.assets.totalPnl')}</span>
                    <span class="pnl-value ${totalPnl >= 0 ? 'profit' : 'loss'}">
                         ${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}
                         <span style="font-size:0.8em">(${totalPnl >= 0 ? '+' : ''}${totalPnlPercent}%)</span>
                    </span>
                </div>
            </div>
        `;

        // 绑定日/周切换按钮事件
        summaryCard.querySelectorAll('.chart-toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.chartViewMode = btn.dataset.mode;
                this.renderAssetsScreen();
            });
        });

        return summaryCard;
    },

    /**
     * V2.XX 新手引导：高亮关键区域
     */
    showTutorialHighlights() {
        // 1. 住所卡片
        const housingCard = document.getElementById('housing-card-container');
        // 2. 财务卡片
        const financeCard = document.getElementById('finance-card-container');
        // 3. 底部 Tab (如果有)
        const tabItems = document.querySelectorAll('.tab-item');

        const targets = [];
        if (housingCard) targets.push(housingCard);
        if (financeCard) targets.push(financeCard);

        // V2.XX: User requested Artifacts and Monthly Bill
        const artifactCard = document.getElementById('artifact-display-container');
        const billCard = document.getElementById('monthly-bill-container');
        if (artifactCard) targets.push(artifactCard);
        if (billCard) targets.push(billCard);

        // 顶上跑马灯 (V2.9+)
        const tickerCard = document.getElementById('news-ticker-container');
        if (tickerCard) targets.push(tickerCard);

        // V2.XX: 五大属性框（精力、精神、健康、社交、工作能力）
        const statItems = document.querySelectorAll('#dashboard-stats .status-item[data-stat]');
        statItems.forEach(item => targets.push(item));

        // User requested to remove bottom tab highlights
        // if (tabItems.length > 0) { ... }

        targets.forEach(el => {
            el.classList.add('tutorial-highlight');

            // Ensure visible on mobile
            el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

            // 点击一次即移除高亮
            const removeHighlight = () => {
                el.classList.remove('tutorial-highlight');
                el.removeEventListener('click', removeHighlight);
            };
            el.addEventListener('click', removeHighlight, { once: true });
        });

        // 提示 Toast
        // 延迟一点显示，确保在其他初始化 Toast 之后
        setTimeout(() => {
            const key = 'ui.tutorial.welcome';
            const msg = I18n.t(key);
            if (msg && !msg.startsWith('Missing')) {
                this.showToast(msg, 'help tutorial-toast');
            } else {
                this.showToast("欢迎来到生存游戏！点击发光区域来管理你的资产与生活。", 'help tutorial-toast');
            }
        }, 1000);
    },


};

// V2.9 绑定资产交易按钮事件 (初始化时绑定)
document.addEventListener('DOMContentLoaded', () => {
    // 动态生成的按钮事件由 createAssetCard 中处理
});

// Expose UI to window for access from other modules (like time.js)
window.UI = UI;

