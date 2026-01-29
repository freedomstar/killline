/**
 * 斩杀线生存 V2 - 主入口
 * 游戏控制器
 */

import { UI } from './ui.js';
import { game } from './game.js';
import { GameEvents } from './events/index.js';
import { GameData } from './data/index.js';
import { AudioManager } from './audio.js';

const GameController = {
    pendingSelection: null,
    isResolvingChoice: false,

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    },

    setup() {
        UI.init();
        this.bindEvents();
        UI.switchScreen('start');
        console.log('斩杀线生存 V2 - 已加载');
    },

    bindEvents() {
        // V2.12: startButton removed, replaced with slot cards handled by UI.js

        UI.elements.restartButton.addEventListener('click', () => {
            // 重新开始游戏，回到开始界面
            UI.switchScreen('start');
        });

        UI.elements.eventChoices.addEventListener('click', (e) => {
            const button = e.target.closest('.choice-button');
            if (button && !button.disabled) {
                const index = parseInt(button.dataset.index);
                this.onChoiceClick(index);
            }
        });

        if (UI.elements.advanceStageButton) {
            UI.elements.advanceStageButton.addEventListener('click', () => {
                this.onAdvanceClick();
            });
        }

        // 子选项（通勤/午餐/额外行动/突发）变化后，预览需要失效
        window.addEventListener('ks:subchoiceChanged', () => {
            if (this.pendingSelection) {
                this.refreshPreviewFromSelection('subchoice');
                return;
            }
            this.refreshSidePreview('subchoice');
        });
    },

    startGame(seed) {
        game.init(seed);
        UI.switchScreen('game');
        this.updateUI();
        this.showNextEvent();
    },

    updateUI() {
        const status = game.getStatusDescription();
        UI.updateStatusBar(status);
        UI.updateTimeDisplay(status);
        UI.updateBackground(status.period);
    },

    showNewDayToast(status, energyDelta) {
        if (!status || status.period !== 'day') return;

        // V2.42 Audio: New Day Sound
        AudioManager.play('bingo');

        // V2.XX 投资情绪特效触发
        let moodToastType = null; // null, 'positive', 'danger'
        if (game.state.pendingInvestmentEffect) {
            const effect = game.state.pendingInvestmentEffect;
            UI.showInvestmentEffect(effect.type, effect.percent);

            if (effect.type === 'boom') moodToastType = 'positive';
            else if (effect.type === 'crash') moodToastType = 'danger';

            game.state.pendingInvestmentEffect = null;
        }

        const formatDelta = (v) => (v > 0 ? `+${v}` : `${v}`);
        const getEnergyRecoveryText = () => {
            if (energyDelta === 0) return '⚡ 精力不变';
            return `⚡ 精力${energyDelta > 0 ? '恢复' : '变化'}：${formatDelta(energyDelta)}`;
        };
        const getHousingBonusText = () => {
            const housingInfo = GameData.housingTypes[game.state.housing];
            if (!housingInfo) return null;

            const mental = Number(housingInfo.mentalBonus || 0);
            const health = Number(housingInfo.healthBonus || 0);
            const parts = [];
            if (mental !== 0) parts.push(`精神 ${formatDelta(mental)}`);
            if (health !== 0) parts.push(`健康 ${formatDelta(health)}`);
            if (parts.length === 0) return null;
            return `🏠 住所加成：${parts.join('，')}`;
        };

        const housingBonusText = getHousingBonusText();
        const energyRecoveryText = getEnergyRecoveryText();

        // V2.4 优先显示财务报告（发薪、房租、水电）
        if (status.dailyFinancialReport && status.dailyFinancialReport.length > 0) {
            // 合并显示多条财务信息
            const reportMsg = status.dailyFinancialReport.join(' | ');
            const segs = [energyRecoveryText];
            if (housingBonusText) segs.push(housingBonusText);
            segs.push(reportMsg);
            const finalMsg = segs.join(' | ');
            // 延迟一点显示，以免覆盖可能的事件结束提示
            setTimeout(() => {
                // 如果有投资情绪，强制使用对应 Mood 颜色，否则沿用发薪判定
                const type = moodToastType || (finalMsg.includes('发薪') ? 'positive' : 'neutral');
                UI.showToast(finalMsg, type);
            }, 500);
            return;
        }

        // 无特殊财务事件，显示常规提示
        if (game.state.day % 5 === 0) {
            const base = '🎉 休息日！好好享受吧';
            const segs = [base, energyRecoveryText];
            if (housingBonusText) segs.push(housingBonusText);
            UI.showToast(segs.join(' | '), moodToastType || 'positive');
            return;
        }

        if (game.state.jobId === 'unemployed' || game.state.jobId === 'fired') {
            // 失业状态不显示发薪日
            let dayTitle = '☀️ 新的一天';
            if (moodToastType === 'positive') dayTitle = '🚀 充满希望的一天';
            if (moodToastType === 'danger') dayTitle = '📉 艰难的一天';

            const segs = [dayTitle, energyRecoveryText];
            if (housingBonusText) segs.push(housingBonusText);
            UI.showToast(segs.join(' | '), moodToastType || 'neutral');
            return;
        }

        let dayTitle = '☀️ 新的一天';
        if (moodToastType === 'positive') dayTitle = '🚀 充满希望的一天';
        if (moodToastType === 'danger') dayTitle = '📉 艰难的一天';

        const segs = [dayTitle, energyRecoveryText];
        if (housingBonusText) segs.push(housingBonusText);
        segs.push(`距发薪 ${game.state.daysUntilPayday} 天`);
        UI.showToast(segs.join(' | '), moodToastType || 'neutral');
    },

    showNextEvent() {
        // 深夜无随机事件：直接推进到下一天（避免卡在深夜空阶段）
        for (let tries = 0; tries < 3; tries++) {
            const event = game.getNextEvent();
            if (event) {
                this.clearPendingSelection();
                UI.showEvent(event, game.getState());
                return;
            }

            const state = game.getState();
            if (!state || state.period !== 'deep_night') return;

            const beforeEnergy = game.state.energy;
            game.advancePeriod();
            const energyDelta = game.state.energy - beforeEnergy;

            const status = game.getStatusDescription();
            this.updateUI();
            this.showNewDayToast(status, energyDelta);
        }
    },

    clearPendingSelection() {
        this.pendingSelection = null;
        this.isResolvingChoice = false;
        if (UI.setSelectedChoice) UI.setSelectedChoice(-1);
        if (UI.setAdvanceStageEnabled) UI.setAdvanceStageEnabled(false);
    },

    formatPreviewDelta(fromState, toState, opts = null) {
        const parts = [];
        const add = (label, delta) => {
            if (!delta) return;
            const sign = delta > 0 ? '+' : '';
            parts.push(`${label}${sign}${delta}`);
        };

        add('💰 ', Math.round((toState.money || 0) - (fromState.money || 0)));
        add('⚡ ', Math.round((toState.energy || 0) - (fromState.energy || 0)));
        add('🧠 ', Math.round((toState.mental || 0) - (fromState.mental || 0)));
        add('❤️ ', Math.round((toState.health || 0) - (fromState.health || 0)));

        if (parts.length === 0) {
            if (opts && opts.randomMasked) {
                return '预览：随机数值已隐藏 (点击“开始时间流逝”确认)';
            }
            return '预览：无属性变化';
        }
        const suffix = (opts && opts.randomMasked) ? ' (随机数值已隐藏，点击“开始时间流逝”确认)' : ' (点击“开始时间流逝”确认)';
        return `预览：${parts.join(' ')}${suffix}`;
    },

    onChoiceClick(choiceIndex) {
        if (this.isResolvingChoice) return;

        const eventId = game.currentEvent ? game.currentEvent.id : null;

        this.pendingSelection = {
            eventId,
            choiceIndex,
            previewResult: null,
            previewState: null
        };

        this.refreshPreviewFromSelection('mainChoice');

        // 随机事件：不需要“进入下一阶段”，点击一次直接结算推进
        if (UI.autoAdvanceOnChoice) {
            // 给预览 UI 一点时间渲染出来
            setTimeout(() => this.confirmPendingChoice(), 120);
        }

        // V2.42 Play Sound Effect
        this.playChoiceSound();
    },

    playChoiceSound() {
        if (!this.pendingSelection || !this.pendingSelection.previewState) {
            AudioManager.play('click');
            return;
        }

        const current = game.getState();
        const next = this.pendingSelection.previewState;

        // Check if any critical attribute drops to zero from a non-zero state
        const isZeroed = (attr) => (current[attr] > 0 && next[attr] <= 0);

        if (isZeroed('health') || isZeroed('mental') || isZeroed('energy')) {
            AudioManager.play('funny_zero');
        } else {
            AudioManager.play('click');
        }
    },

    refreshPreviewFromSelection(reason = 'unknown') {
        if (!this.pendingSelection) return;

        const choiceIndex = this.pendingSelection.choiceIndex;
        const preview = game.previewChoice(choiceIndex);
        if (!preview) return;

        this.pendingSelection.previewResult = preview.result;
        this.pendingSelection.previewState = preview.state;

        // 若该选择包含随机性：仅预览稳定不变的数值，避免“剧透”随机结果
        const maskedState = (preview.maskedPreview === true)
            ? (preview.maskedState || game.getState())
            : preview.state;
        const isRandomMasked = (preview.maskedPreview === true);

        const previewStatus = game.getStatusDescriptionForState(maskedState);

        // 更新 UI：显示预览状态(或掩码预览)，但不实装
        UI.updateStatusBar(previewStatus, maskedState);
        if (UI.setSelectedChoice) UI.setSelectedChoice(choiceIndex);

        // 是否可进入下一阶段：需要先完成上方强制选择
        if (UI.updateMainButtonsState) {
            UI.updateMainButtonsState(game.getState());
        }
        const canAdvance = UI.mainChoiceValid !== false;
        if (UI.setAdvanceStageEnabled) UI.setAdvanceStageEnabled(!!canAdvance);

        // 预览只更新状态栏，不弹出提示（避免选择时频繁打断）
    },

    refreshSidePreview(reason = 'unknown') {
        // 只在白天事件中有意义（夜晚没有午餐/通勤等）
        const state = game.getState();
        if (state.period !== 'day') return;

        const preview = game.previewDaySideSelections
            ? game.previewDaySideSelections()
            : this.simulateDaySideSelectionsPreview();
        if (!preview) return;

        const maskedState = (preview.maskedPreview === true)
            ? (preview.maskedState || game.getState())
            : preview.state;
        const isRandomMasked = (preview.maskedPreview === true);

        const previewStatus = game.getStatusDescriptionForState(maskedState);
        UI.updateStatusBar(previewStatus, maskedState);

        // 没有主选项选中时，进入下一阶段必须禁用
        if (UI.setSelectedChoice) UI.setSelectedChoice(-1);
        if (UI.setAdvanceStageEnabled) UI.setAdvanceStageEnabled(false);

        // 预览只更新状态栏，不弹出提示（避免选择时频繁打断）
    },

    simulateDaySideSelectionsPreview() {
        // 兼容缓存：不依赖 game/events.js 新增方法
        const simState = JSON.parse(JSON.stringify(game.getState()));
        const rng = game.rng && game.rng.clone ? game.rng.clone() : game.rng;
        const context = { game, rng };

        // 午餐
        if (simState.lunchType) {
            const lunchOpt = GameData.lunchOptions[simState.lunchType];
            if (lunchOpt) {
                let totalCost = lunchOpt.cost;
                if (simState.lunchType === 'fastfood' && lunchOpt.cost > 0) {
                    totalCost += Math.round(lunchOpt.cost * GameData.usaFeatures.tipRate);
                }
                simState.money -= totalCost;
                simState.health = Math.max(0, Math.min(100, simState.health + lunchOpt.healthEffect));
                if (simState.lunchType === 'bento') simState.hasPreparedMeal = false;
            }
        }

        // 额外行动
        if (simState.selectedDailyAction && simState.selectedDailyAction !== 'none') {
            const dailyAction = GameEvents.getDailyActionById(simState.selectedDailyAction);
            if (dailyAction && typeof dailyAction.effect === 'function') {
                dailyAction.effect(simState, context);
            }
        }

        // 突发
        if (simState.selectedIncident && simState.selectedIncident !== 'none') {
            const [incidentId, optionId] = simState.selectedIncident.split(':');
            const incident = GameEvents.getIncidentById(incidentId);
            if (incident && Array.isArray(incident.choices)) {
                const option = incident.choices.find(c => c.id === optionId);
                if (option && typeof option.effect === 'function') {
                    option.effect(simState, context);
                }
            }
        }

        // 通勤（仅 bus/walk 这类在 handleChoice 里结算的部分）
        const commuteId = simState.selectedCommute;
        if (commuteId && commuteId !== 'car' && commuteId !== 'car_refuel' && commuteId !== 'car_repair') {
            const commuteConfig = GameData.commuteOptions[commuteId];
            if (commuteConfig) {
                if (commuteConfig.cost > 0) {
                    simState.money -= commuteConfig.cost;
                }
                if (commuteConfig.healthEffect > 0) {
                    simState.health = Math.min(100, simState.health + commuteConfig.healthEffect);
                }
                if (rng && typeof rng.random === 'function') {
                    const isLate = rng.random() < commuteConfig.lateChance;
                    if (isLate) {
                        simState.energy = Math.max(0, simState.energy - 10);
                        simState.mental = Math.max(0, simState.mental - 5);
                        if (simState.workTask) {
                            simState.workTask.progress = Math.max(0, simState.workTask.progress - 5);
                        }
                        if (simState.pipActive) {
                            simState.pipPerformanceScore = Math.max(0, (simState.pipPerformanceScore || 50) - 10);
                        }
                    }
                }
            }
        }

        // clamp
        simState.energy = Math.max(0, Math.min(100, simState.energy));
        simState.mental = Math.max(0, Math.min(100, simState.mental));
        simState.health = Math.max(0, Math.min(100, simState.health));
        simState.money = Math.max(-10000, simState.money);

        return { state: simState };
    },

    onAdvanceClick() {
        this.confirmPendingChoice();
    },

    confirmPendingChoice() {
        if (!this.pendingSelection) return;
        if (this.isResolvingChoice) return;
        this.isResolvingChoice = true;

        if (UI.setAdvanceStageEnabled) UI.setAdvanceStageEnabled(false);

        const choiceIndex = this.pendingSelection.choiceIndex;

        // 禁用按钮
        const buttons = UI.elements.eventChoices.querySelectorAll('.choice-button');
        buttons.forEach(btn => btn.disabled = true);

        const previewResult = this.pendingSelection.previewResult;

        // 显示结果 Toast（使用预览结果，确保与后续实装一致）
        if (previewResult && previewResult.message) {
            UI.showToast(previewResult.message, previewResult.type);
        }

        if (previewResult && previewResult.type === 'negative') {
            UI.shakeScreen();
        }

        // 结局：没有“下一阶段”，直接实装并结算
        if (previewResult && previewResult.ending) {
            const realResult = game.handleChoice(choiceIndex);
            UI.updateStatusBar(game.getStatusDescription());

            setTimeout(() => {
                const finalStats = game.getStatusDescription();
                UI.showEnding(realResult.ending, finalStats);
            }, 1500);

            this.clearPendingSelection();
            return;
        }

        // 延迟进入下一个阶段（在跳转时才实装）
        setTimeout(() => {
            const beforeAdvance = {
                day: game.state.day,
                period: game.state.period,
                energy: game.state.energy,
            };

            // 实装选择（此时才修改真实 state）
            const result = game.handleChoice(choiceIndex);
            if (!result) {
                buttons.forEach(btn => btn.disabled = false);
                this.isResolvingChoice = false;
                return;
            }

            // 如果有后续触发事件，显示它并跳过推进时段
            if (result.triggerEvent) {
                const event = game.getEventById ? game.getEventById(result.triggerEvent) : GameEvents.events.find(e => e.id === result.triggerEvent);
                if (event) {
                    game.currentEvent = event;
                    // 触发事件但不推进时段：需要刷新 HUD
                    UI.updateStatusBar(game.getStatusDescription());
                    this.isResolvingChoice = false;
                    UI.showEvent(event, game.getState());
                    this.clearPendingSelection();
                    return;
                }
            }

            // 推进时段
            game.advancePeriod();

            const energyDelta = game.state.energy - beforeAdvance.energy;

            // 更新完整 UI (包含标题和背景颜色)
            const status = game.getStatusDescription();
            this.updateUI();

            console.log(`[Game] 时段推进至: ${status.day}天 ${status.periodName}`);

            // V2.3 强制睡眠检测（进入夜间但濒死状态）
            if (status.period === 'night' && (status.energy <= GameData.exhaustionConfig.energyThreshold)) {
                UI.showToast('😵 体力透支，直接昏睡过去...', 'negative');
                // 强制睡眠，恢复减半
                game.state.energy = Math.min(100, game.state.energy + 20);
                game.state.health = Math.min(100, game.state.health + 5);
                game.advancePeriod(); // 跳过夜间
                game.advancePeriod(); // 跳过深夜，直接到下一天
                this.updateUI();
                setTimeout(() => this.showNextEvent(), 1000);
                this.clearPendingSelection();
                return;
            }

            // 如果进入了新的一天（V2.3: 时段变回 day）
            this.showNewDayToast(status, energyDelta);

            // 显示下一个事件
            this.showNextEvent();
            this.clearPendingSelection();
        }, 800);
    }
};

GameController.init();
