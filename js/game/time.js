/**
 * 时间系统模块 - 时段推进与日期管理
 */
import { GameData } from '../data/index.js';
import { EventManager as GameEvents, rentIncreaseBonusEvent } from '../events/index.js';
import { I18n } from '../i18n.js';
import { getArtifact } from '../data/artifacts.js';

/**
 * 时间相关方法的 Mixin
 */
export const TimeMixin = {
    /**
     * 获取当前时段配置
     */
    getCurrentPeriodInfo() {
        return GameData.periods[this.state.period];
    },

    /**
     * 推进时段
     */
    advancePeriod() {
        const currentPeriod = GameData.periods[this.state.period];
        const isDayChange = currentPeriod.isLast;

        // 如果是当天最后一个时段，新的一天开始
        if (isDayChange) {
            this.advanceDay();
        }

        // 清除上一阶段的动态选项缓存 (V2.10)
        this.state.currentLunchOptions = null;
        this.state.currentDailyActions = null;
        this.state.activeIncidents = null;
        this.state.currentCommuteOptions = null; // V2.21 通勤选项缓存
        this.state.lunchType = null;           // 默认不选午餐
        this.state.selectedDailyAction = null; // 默认不选
        this.state.selectedIncident = null;    // 默认不选
        this.state.sideActionsLocked = false; // 重置锁定状态

        // V2.30 通勤系统重构：
        // 1. 先保存上一时段选择的通勤方式
        // 2. 立即清空 selectedCommute，确保下一个时段/事件生成时是干净的状态
        // 3. 使用保存的值来处理 car 相关的油量逻辑
        // 这样可以防止 applyCommuteEffects 使用遗留值，同时正确处理汽车油量
        const previousCommute = this.state.selectedCommute;
        this.state.selectedCommute = null; // 清空，防止遗留值被 applyCommuteEffects 使用

        // V2.23 油箱系统: 处理汽车相关通勤选择（油箱逻辑）
        // 使用保存的 previousCommute 来判断

        if (previousCommute === 'car') {
            // 有油，消耗1次
            this.state.fuelRemaining = Math.max(0, (this.state.fuelRemaining || 0) - 1);
            console.log(`[Game] 使用汽车通勤，剩余油量 ${this.state.fuelRemaining}/${this.state.fuelCapacity}`);
        } else if (previousCommute === 'car_refuel') {
            // 加油并开车: 先扣费加满油，再消耗1次
            const cost = this.state.refuelCost || 20;
            this.deductMoney(cost, 'commute');
            this.state.fuelRemaining = (this.state.fuelCapacity || 4) - 1; // 加满后用掉1次
            console.log(`[Game] 加油 -$${cost}，剩余油量 ${this.state.fuelRemaining}/${this.state.fuelCapacity}`);
        } else if (previousCommute === 'car_repair') {
            // V2.24 修车并开车: 扣费、修复故障、消耗油量、必定迟到
            const repairCost = this.state.insurance.carPlanId === 'full_coverage' ? 500 : 1200;
            this.deductMoney(repairCost, 'commute');
            this.state.carBroken = false; // 修复故障
            this.state.fuelRemaining = Math.max(0, (this.state.fuelRemaining || 0) - 1);
            // 迟到惩罚由 applyCommuteEffects 或手动处理
            this.state.pendingLateFromRepair = true; // 标记待处理迟到
            console.log(`[Game] 修车 -$${repairCost}，故障修复，必定迟到`);
        }
        // 注意：bus/walk 的费用扣除在 handleChoice 中处理（约第1050行）

        // V2.4 便当过午不食机制
        // 如果是从白天结束（进入夜晚），且还没有吃便当，便当过期
        if (this.state.period === 'day') {
            this.state.hasPreparedMeal = false;
        }
        // 重置咖啡状态
        this.state.coffeeToday = false;
        // 切换到下一个时段
        this.state.period = currentPeriod.next;

        // V2.12 自动存档 (在进入新的一天，且时段切换完成后保存)
        if (isDayChange && this.isRunning !== false) {
            this.currentEvent = null; // 确保清除上一天的事件，防止读档时回复旧事件
            this.saveGame(0);
        }

        // V2.XX 傍晚预兆提示 (进入夜晚时)
        if (this.state.period === 'night') {
            if (this.prepareMarketRumor) {
                this.prepareMarketRumor();
            }
            this.prepareEveningOmen();
            // V2.35 傍晚事件判定
            this.prepareEveningEvents();
        }
    },

    /**
     * V2.XX 生成傍晚预兆 (仅提示，不改变玩法)
     */
    prepareEveningOmen() {
        this.state.eveningOmen = null;

        const omens = [];
        const utilityBill = Math.round(this.state.utilityBill || 0);
        const social = this.state.socialValue || 50;
        const foreseeing = GameData.foreseeingConfig || {};

        // 水电预兆：临近结算且账单偏高
        if (this.state.daysUntilUtility <= (foreseeing.billReminderDays || 2) && utilityBill > 0) {
            omens.push(I18n.t('game.foreseeing.eveningOmenUtility', utilityBill));
        }

        // 市场传闻预兆
        if (this.state.marketRumorId) {
            const rumorNews = this.getMarketNewsById ? this.getMarketNewsById(this.state.marketRumorId) : null;
            if (rumorNews) {
                omens.push(I18n.t('game.foreseeing.eveningOmenMarket', rumorNews.title));
            }
        }

        // 工作预兆：任务临近截止
        if (this.state.workTask && this.state.workTask.deadline <= 2 && this.state.workTask.progress < 100) {
            omens.push(I18n.t('game.foreseeing.eveningOmenWork'));
        }

        // 社区噪音/不安预兆：仅在住处稳定时出现
        if ((this.state.housing === 'apartment' || this.state.housing === 'cheapRoom') && this.rng.random() < GameData.eventConfigs.probabilities.neighbor_noise) {
            omens.push(I18n.t('game.foreseeing.eveningOmenNoise'));
        }

        // 天气预兆
        if (this.rng.random() < GameData.eventConfigs.probabilities.hot_weather) {
            omens.push(I18n.t('game.foreseeing.eveningOmenHot'));
        } else if (this.rng.random() < GameData.eventConfigs.probabilities.cold_weather) {
            omens.push(I18n.t('game.foreseeing.eveningOmenCold'));
        }

        // 社交值高时更容易得到风向
        if (social >= 60 && this.rng.random() < 0.2) {
            omens.push(I18n.t('game.foreseeing.eveningOmenSocial'));
        }

        if (omens.length === 0) return;

        const pick = omens[Math.floor(this.rng.random() * omens.length)];
        this.state.eveningOmen = pick;
    },

    /**
     * V2.35 准备傍晚随机事件队列
     */
    prepareEveningEvents() {
        this.state.eventQueue = [];

        // 重置侧边行动锁定状态
        this.state.sideActionsLocked = false;

        // 1. 清理动态选项状态
        const mandatoryParams = this.rng ? this.rng : null;
        const mandatoryEvents = GameEvents.getMandatoryEvents(this.state, 'night', mandatoryParams);

        // 排除掉已经包含在强制事件中的ID (虽然 condition 应该控制了，但双重保险)
        // 实际上 getMandatoryEvents 已经检查了 conditions
        this.state.eventQueue.push(...mandatoryEvents);

        // 2. 随机事件判定 (30%)
        // 只有当没有强制事件，或者我们允许强制+随机混发？
        // 需求："如果不触发，直接进入晚上"。
        // 也就是： Mandatory 必须触发。 Random 有几率触发。
        // 如果有 Mandatory，是否还 roll Random？
        // 通常来说，Random Event 是 "Extra".
        // 让我们设定：始终 roll random，但是排除掉已经在 queue 中的。

        // V2.XX 动态夜间事件风险：精神值低时概率增加
        let randomEventChance = 0.3;
        if ((this.state.mental || 0) < 40) {
            randomEventChance += 0.1;
            console.log(`[Game] 精神值低 (${this.state.mental})，夜间随机事件概率增加至 ${Math.round(randomEventChance * 100)}%`);
        }

        if (this.rng.random() < randomEventChance) {
            // 获取可用随机事件 (排除 mandatory，因为它们已经单独处理了)
            const allNightEvents = GameEvents.getAvailableEvents(this.state, 'night', this.rng);
            // 过滤掉已经在队列中的
            const queuedIds = new Set(this.state.eventQueue.map(e => e.id));
            const availableRandom = allNightEvents.filter(e => !e.mandatory && !queuedIds.has(e.id));

            // 注意：这里需要排除掉 'night_choice' 等特殊事件
            const validRandom = availableRandom.filter(e => e.id !== 'night_choice' && e.id !== 'homeless_night' && e.id !== 'car_night');

            // V2.XX 动态权重调整：精神值低时更容易遇到失眠或噩梦
            if ((this.state.mental || 0) < 40) {
                validRandom.forEach(e => {
                    if (e.id === 'insomnia' || e.id === 'nightmare') {
                        e.weight = (e.weight || 1) * 2; // 临时增加权重
                    }
                });
            }

            const randomEvent = GameEvents.selectRandomEvent(validRandom, this.rng);
            if (randomEvent) {
                this.state.eventQueue.push(randomEvent);
            }
        }

        if (this.state.eventQueue.length > 0) {
            console.log(`[Game] 触发傍晚事件队列: ${this.state.eventQueue.map(e => e.id).join(', ')}`);
        }
    },

    /**
     * 推进一天（在夜晚结束后调用）
     */
    advanceDay() {
        this.state.day++;

        this.state.randomEventsToday = [];
        this.state.randomEventsTodayCount = 0;

        // V2.13 更新最高资产统计
        if (!this.state.stats) {
            this.state.stats = { maxWealth: this.state.money };
        }
        if (this.state.money > this.state.stats.maxWealth) {
            this.state.stats.maxWealth = this.state.money;
        }

        this.state.dailyFinancialReport = []; // 重置每日财务报告

        // V2.41 Artifact Daily Effects
        const artifactEffects = this.triggerArtifacts('onDaily', this.state) || [];
        artifactEffects.forEach((artifactEffect) => {
            // 主触发器立即显示
            if (artifactEffect && artifactEffect.id && window.UI && window.UI.triggerArtifactGlow) {
                window.UI.triggerArtifactGlow(artifactEffect.id);
            }

            // V2.XX: 同时记录到消息历史
            if (artifactEffect && artifactEffect.log) {
                const art = getArtifact(artifactEffect.id);
                const artName = art && typeof art.name === 'function' ? art.name() : (art?.name || '神器');
                this.addLog(artifactEffect.log, 'positive', artName);
            }

            // V2.XX: Trigger shake for the source artifact effect itself
            if (artifactEffect && artifactEffect.delta && window.UI && window.UI.triggerAttributeShake) {
                window.UI.triggerAttributeShake(artifactEffect.delta);
            }

            // V2.XX: 使用分层结构逐层显示连锁触发效果
            if (artifactEffect && artifactEffect.layers && Array.isArray(artifactEffect.layers)) {
                if (window.UI && window.UI.showChainedArtifactEffects) {
                    window.UI.showChainedArtifactEffects(artifactEffect.layers, 0);
                }
            }
            // 兼容旧的 secondaryTriggers 格式
            else if (artifactEffect && artifactEffect.secondaryTriggers && Array.isArray(artifactEffect.secondaryTriggers)) {
                artifactEffect.secondaryTriggers.forEach((subId, index) => {
                    if (window.UI && window.UI.triggerArtifactGlow) {
                        const delay = (index + 1) * 200;
                        setTimeout(() => {
                            window.UI.triggerArtifactGlow(subId);
                        }, delay);
                    }
                });
            }


        });


        // V2.XX 投资情绪系统：计算市场更新前后的净值变化
        const getPortfolioValue = () => {
            const prices = this.state.marketPrices || {};
            const holdings = this.state.holdings || {};
            let val = 0;
            Object.keys(holdings).forEach(id => {
                if (holdings[id] && prices[id]) val += holdings[id].quantity * prices[id].price;
            });
            return val;
        };

        const oldPortfolioValue = getPortfolioValue();

        // V2.8 更新市场价格
        this.updateMarket();

        // V2.XX Insider Phone
        if (this.hasArtifact && this.hasArtifact('insider_phone')) {
            const insiderConf = GameData.artifactConfig.insider_phone || {};

            // 减少冷却时间
            if (this.state.insiderPhoneCD > 0) {
                this.state.insiderPhoneCD--;
            }

            // Reset tip for the day
            this.state.dailyInsiderTip = null;

            // 只有冷却结束且未被罚款时才可能触发
            let triggeredFine = false;
            const fineChance = insiderConf.fineChance || 0.1;

            if (this.rng.random() < fineChance) {
                triggeredFine = true;
                const fineRate = insiderConf.fineRate || 0.3;
                const fine = Math.max(0, Math.round((this.state.money || 0) * fineRate));
                this.deductMoney(fine, 'fine');

                if (window.UI) window.UI.triggerArtifactGlow('insider_phone');

                const fineMsg = I18n.t('game.artifactDaily.insider_phone_fine', fine);
                if (this.state.dailyFinancialReport) {
                    this.state.dailyFinancialReport.push(fineMsg);
                }

                const art = getArtifact('insider_phone');
                const artName = art && typeof art.name === 'function' ? art.name() : (art?.name || '内幕电话');
                this.addLog(fineMsg, 'negative', artName);
            }

            // 冷却检查
            if (!triggeredFine && (this.state.insiderPhoneCD || 0) <= 0) {
                const tipChance = insiderConf.tipChance || 0.5;
                if (this.rng.random() < tipChance) {
                    const newsList = GameData.marketNews || [];
                    const getPositiveAssetIds = (effect = {}) => Object.keys(effect).filter((key) => (
                        typeof effect[key] === 'number'
                        && effect[key] > 0
                        && !!GameData.assetTypes[key]
                    ));
                    // 仅筛选“存在有效资产上涨”的新闻，排除布尔标记等非资产字段
                    const bullNews = newsList.filter((n) => n.effect && getPositiveAssetIds(n.effect).length > 0);

                    if (bullNews.length > 0) {
                        const selectedNews = bullNews[Math.floor(this.rng.random() * bullNews.length)];

                        // 强制覆盖当前传闻，内幕消息优先级最高
                        this.state.marketRumorId = selectedNews.id;
                        this.state.marketRumorConfirmDay = this.state.day + 1; // 明早生效
                        this.state.isInsiderRumor = true; // 神器保证 100% 准确

                        const positiveAssetIds = getPositiveAssetIds(selectedNews.effect);
                        const assetId = positiveAssetIds[Math.floor(this.rng.random() * positiveAssetIds.length)];
                        const item = assetId ? GameData.assetTypes[assetId] : null;
                        const assetName = item
                            ? (typeof item.name === 'function' ? item.name() : item.name)
                            : (assetId || '某资产');

                        const tipMsg = I18n.t('game.artifactDaily.insider_phone_tip', assetName);

                        if (this.state.dailyFinancialReport) {
                            this.state.dailyFinancialReport.push(tipMsg);
                        }

                        const art = getArtifact('insider_phone');
                        const artName = art && typeof art.name === 'function' ? art.name() : (art?.name || '内幕电话');
                        this.addLog(tipMsg, 'positive', artName);

                        if (window.UI) window.UI.triggerArtifactGlow('insider_phone');

                        // 存储以便 Ticker 显示详细描述
                        this.state.dailyInsiderTip = {
                            type: 'insider',
                            text: tipMsg,
                            assetId: assetId,
                            details: I18n.t('game.artifactDaily.insider_phone_detail', assetName)
                        };

                        // 只有触发成功后才重置冷却时间
                        this.state.insiderPhoneCD = insiderConf.cooldownDays || 2;
                    }
                }
            }
        }

        const newPortfolioValue = getPortfolioValue();

        // 情绪判定逻辑
        const moodConfig = GameData.investmentMoodConfig;
        if (moodConfig && oldPortfolioValue >= moodConfig.minPortfolioValue) {
            const diff = newPortfolioValue - oldPortfolioValue;
            const percent = diff / oldPortfolioValue;

            if (percent >= moodConfig.thresholdPercent) {
                // 暴涨
                this.state.mental = Math.min(this.state.maxMental || 100, this.state.mental + moodConfig.mentalBonus);
                this.state.pendingInvestmentEffect = { type: 'boom', percent: percent };
                const msg = `🚀 投资大涨 ${(percent * 100).toFixed(1)}%! 精神 +${moodConfig.mentalBonus}`;
                this.state.dailyFinancialReport.push(msg);
                console.log(`[Game] ${msg}`);
            } else if (percent <= -moodConfig.thresholdPercent) {
                // 暴跌
                this.state.mental = Math.max(0, this.state.mental - moodConfig.mentalPenalty);
                this.state.pendingInvestmentEffect = { type: 'crash', percent: percent };
                const msg = `📉 投资暴跌 ${(percent * 100).toFixed(1)}%! 精神 -${moodConfig.mentalPenalty}`;
                this.state.dailyFinancialReport.push(msg);
                console.log(`[Game] ${msg}`);
            }
        }

        // V2.16 精力耗尽昏睡惩罚
        // V2.XX Fix: Use faintedToday flag instead of current energy, as UI might have already restored it
        if (this.state.energy <= 0 || this.state.faintedToday) {
            const faintingConfig = GameData.healthConstants.fainting;

            // 精神上限惩罚
            this.state.maxMental = Math.max(faintingConfig.minMaxMental, this.state.maxMental - faintingConfig.maxMentalPenalty);
            this.state.mental = Math.min(this.state.mental, this.state.maxMental);

            // 健康上限惩罚
            if (!this.state.maxHealth) this.state.maxHealth = 100; // 初始化
            this.state.maxHealth = Math.max(faintingConfig.minMaxHealth, this.state.maxHealth - faintingConfig.maxHealthPenalty);
            this.state.health = Math.min(this.state.health, this.state.maxHealth);

            const msg = I18n.t('game.finance.fainting', faintingConfig.maxMentalPenalty, faintingConfig.maxHealthPenalty);
            this.state.dailyFinancialReport.push(msg);
            console.log(`[Game] ${msg}`);

            // Reset flag
            this.state.faintedToday = false;
        }

        // V2.1 财务系统倒计时
        this.state.daysUntilPayday--;
        this.state.daysUntilRent--;
        this.state.daysUntilUtility--;

        // V2.6 保险账单倒计时

        this.state.daysUntilInsurance--;

        // V2.XX 预见未来：账单红线预警（仅提示）
        const report = this.state.dailyFinancialReport;
        if (report) {
            const foreseeing = GameData.foreseeingConfig || {};
            const reminderDays = foreseeing.billReminderDays || 2;
            const rentCost = this.state.housingCost || 0;
            if (rentCost > 0 && this.state.daysUntilRent > 0 && this.state.daysUntilRent <= reminderDays) {
                if (this.state.daysUntilRent === 1 && this.state.money < rentCost) {
                    report.push(I18n.t('game.foreseeing.rentWarning', rentCost));
                } else {
                    report.push(I18n.t('game.foreseeing.rentReminder', this.state.daysUntilRent, rentCost));
                }
            }

            const utilityCost = Math.round(this.state.utilityBill || 0);
            if (utilityCost > 0 && this.state.daysUntilUtility > 0 && this.state.daysUntilUtility <= reminderDays) {
                if (this.state.daysUntilUtility === 1 && this.state.money < utilityCost) {
                    report.push(I18n.t('game.foreseeing.utilityWarning', utilityCost));
                } else {
                    report.push(I18n.t('game.foreseeing.utilityReminder', this.state.daysUntilUtility, utilityCost));
                }
            }

            const insuranceCost = this.calculateMonthlyInsuranceCostForState
                ? this.calculateMonthlyInsuranceCostForState(this.state)
                : (this.calculateMonthlyInsuranceCost ? this.calculateMonthlyInsuranceCost() : 0);
            if (insuranceCost > 0 && this.state.daysUntilInsurance > 0 && this.state.daysUntilInsurance <= reminderDays) {
                if (this.state.daysUntilInsurance === 1 && this.state.money < insuranceCost) {
                    report.push(I18n.t('game.foreseeing.insuranceWarning', insuranceCost));
                } else {
                    report.push(I18n.t('game.foreseeing.insuranceReminder', this.state.daysUntilInsurance, insuranceCost));
                }
            }

            const rentersPending = this.state.insurance
                && this.state.insurance.pendingRentersStatus !== null
                && this.state.insurance.pendingRentersStatus !== undefined;
            const pendingInsChange = this.state.insurance
                && (this.state.insurance.pendingHealthPlanId || this.state.insurance.pendingCarPlanId || rentersPending);
            if (this.state.daysUntilInsurance === 1 && pendingInsChange) {
                report.push(I18n.t('game.foreseeing.insuranceChangeWindow'));
            }

            if (this.state.pendingPipWarning) {
                report.push(I18n.t('game.foreseeing.pipOmen'));
            }

            const social = this.state.socialValue || 50;
            if (social >= 60 && this.rng.random() < 0.25) {
                const rumors = I18n.t('game.foreseeing.rumors');
                if (Array.isArray(rumors) && rumors.length > 0) {
                    const rumor = rumors[Math.floor(this.rng.random() * rumors.length)];
                    report.push(I18n.t('game.foreseeing.rumorLine', rumor));
                }
            }
        }

        // V2.7 工作任务系统 - 检查截止日期
        if (this.state.job === 'fulltime' && this.state.workTask) {
            // V2.28 优化：住院期间或休息日，任务截止日期不减少
            const isRestDay = this.state.day % GameData.timeCycle.weekDays === GameData.timeCycle.restDayMod;
            const isHospitalized = (this.state.hospitalDaysLeft || 0) > 0;

            if (!isRestDay && !isHospitalized) {
                this.state.workTask.deadline--;
            }

            // 超时检测
            if (this.state.workTask.deadline < 0 && this.state.workTask.progress < 100) {
                this.state.workTask.overdueDays++;
                const pipChance = this.state.workTask.overdueDays * 0.1; // 每超时1天+10%风险
                console.log(`[Game] 任务超时 ${this.state.workTask.overdueDays} 天, PIP风险: ${pipChance * 100}%`);

                // 滚动PIP触发
                if (this.rng.random() < pipChance) {
                    this.state.pendingPipWarning = true;
                }
            }
        }

        // V2.5 发薪日（每10天）- 带税务扣除
        if (this.state.daysUntilPayday <= 0) {
            const jobInfo = GameData.jobTypes[this.state.job];
            const baseIncome = jobInfo && jobInfo.income > 0
                ? (this.state.monthlyIncome || jobInfo.income)
                : 0;
            if (baseIncome > 0) {
                const grossPay = baseIncome;
                const taxRates = GameData.usaFeatures.taxRates;

                // 计算各项税收
                const federalTax = Math.round(grossPay * taxRates.federal);
                const stateTax = Math.round(grossPay * taxRates.state);
                const socialSecurity = Math.round(grossPay * taxRates.socialSecurity);
                const medicare = Math.round(grossPay * taxRates.medicare);
                const totalTax = federalTax + stateTax + socialSecurity + medicare;
                const netPay = grossPay - totalTax;

                this.state.money += netPay;
                const msg = I18n.t('game.finance.payday', grossPay, netPay, totalTax);
                this.state.dailyFinancialReport.push(msg);
                console.log(`[Game] ${msg}`);
            }
            this.state.daysUntilPayday = GameData.timeCycle.monthDays; // 10天周期
        }

        // V2.5 房租结算（每10天）- 带信用分惩罚
        if (this.state.daysUntilRent <= 0) {
            const rentCost = this.state.housingCost;
            const discount = this._getSpendingDiscount ? this._getSpendingDiscount(this.state) : 0;
            const effectiveCost = Math.round(rentCost * (1 - discount));
            const canPayCash = (this.state.money || 0) >= effectiveCost;

            this.deductMoney(rentCost, 'rent');

            if (canPayCash) {
                this.state.unpaidRentMonths = 0;
                const msg = I18n.t('game.finance.rentPaid', rentCost);
                this.state.dailyFinancialReport.push(msg);
                console.log(`[Game] ${msg}`);
            } else {
                this.state.unpaidRentMonths = (this.state.unpaidRentMonths || 0) + 1;
                const creditDrop = GameData.usaFeatures.latePenalty.creditScoreDrop;
                this.state.creditScore = Math.max(300, this.state.creditScore - creditDrop);
                const msg = I18n.t('game.finance.rentInsufficient', rentCost);
                this.state.dailyFinancialReport.push(msg);
                console.log(`[Game] ${msg} | 信用分 -${creditDrop} (隐藏)`);
            }
            this.state.daysUntilRent = GameData.timeCycle.monthDays; // 10天周期

            // 月结：利息与医疗分期结转
            this.applyMonthlyInterest();
            this.processMedicalInstallments();

            // --- Periodic Increases (Salary & Rent) & Artifact Bonus ---
            // Triggered every cycle (10 days)
            const increaseConf = GameData.financialIncreaseConfig;

            // 1. Salary Increase Logic
            if (this.state.job === 'fulltime' && this.state.monthlyIncome > 0) {
                // Check if eligible
                if ((this.state.workEfficiency || 100) >= increaseConf.minWorkEfficiencyForRaise) {
                    const min = increaseConf.salaryRaiseRange.min;
                    const max = increaseConf.salaryRaiseRange.max;
                    const raisePct = min + this.rng.random() * (max - min);
                    const raiseAmount = Math.floor(this.state.monthlyIncome * raisePct);
                    // eslint-disable-next-line no-unused-vars
                    const oldIncome = this.state.monthlyIncome;
                    this.state.monthlyIncome += raiseAmount;

                    this.state.dailyFinancialReport.push(I18n.t('game.finance.salaryIncrease', raiseAmount, this.state.monthlyIncome));
                } else {
                    this.state.dailyFinancialReport.push(I18n.t('game.finance.salaryNoIncrease'));
                }
            }

            // 2. Rent Increase Logic (Market Inflation)
            const min = increaseConf.rentRaiseRange.min;
            const max = increaseConf.rentRaiseRange.max;
            const rentRaisePct = min + this.rng.random() * (max - min);

            // V2.XX: Increase the global rent index instead of just the current cost
            const oldIndex = this.state.rentIndex || 1;
            this.state.rentIndex = oldIndex * (1 + rentRaisePct);

            // 3. Pending housing change applies only after current-cycle rent settlement.
            if (this.state.pendingHousing && GameData.housingTypes[this.state.pendingHousing]) {
                this.state.housing = this.state.pendingHousing;
                this.state.pendingHousing = null;
                const houseName = GameData.housingTypes[this.state.housing]?.name;
                const houseText = typeof houseName === 'function' ? houseName() : (houseName || this.state.housing);
                const moveMsg = I18n.t('game.housing.moveCompleted', houseText) || `搬家完成！新住所：${houseText}`;
                this.state.dailyFinancialReport.push(moveMsg);
                console.log(`[Game] ${moveMsg}`);
            }

            const oldRent = this.state.housingCost;
            const baseCost = GameData.housingTypes[this.state.housing]?.cost || 1000;
            this.state.housingCost = Math.floor(baseCost * this.state.rentIndex);

            if (this.state.housing !== 'homeless' && this.state.housing !== 'car' && this.state.housingCost > 0) {
                const actualIncrease = this.state.housingCost - oldRent;
                this.state.dailyFinancialReport.push(I18n.t('game.finance.rentIncrease', actualIncrease, this.state.housingCost));

                // 4. Trigger Artifact Bonus Event
                if (!this.state.eventQueue) this.state.eventQueue = [];
                this.state.eventQueue.unshift(rentIncreaseBonusEvent);
            }
        }

        // V2.3 水电结算（每5天）
        if (this.state.daysUntilUtility <= 0) {
            const utilityCost = this.state.utilityBill;
            this.deductMoney(utilityCost, 'utility');
            const msg = I18n.t('game.finance.utilityPaid', utilityCost);
            this.state.dailyFinancialReport.push(msg);
            console.log(`[Game] ${msg}`);
            this.state.utilityBill = 0;
            this.state.daysUntilUtility = GameData.timeCycle.monthDays; // 10天周期
        }

        // V2.17 保险账单日 (每10天)
        if (this.state.daysUntilInsurance <= 0) {
            this.processInsuranceBilling();
            this.state.daysUntilInsurance = GameData.timeCycle.monthDays;
        }

        // V2.3 每日水电费累计
        const dailyUtility = this.state.dailyUtilityBase || GameData.initialState.dailyUtilityBase;
        this.state.utilityBill += dailyUtility;

        // V2.XX Piggy Bank
        if (this.hasArtifact && this.hasArtifact('piggy_bank') && !this.state.spentMoneyToday) {
            const bonus = GameData.artifactConfig.piggy_bank?.dailyBonus || 50;
            this.state.money += bonus;

            if (window.UI && window.UI.triggerArtifactGlow) {
                window.UI.triggerArtifactGlow('piggy_bank');
            }
            if (window.UI && window.UI.triggerAttributeShake) {
                window.UI.triggerAttributeShake({ money: bonus });
            }

            // V2.XX: 同时记录到消息历史
            const msg = I18n.t('game.artifactDaily.piggy_bank', bonus);
            const art = getArtifact('piggy_bank');
            const artName = art && typeof art.name === 'function' ? art.name() : (art?.name || '存钱罐');
            this.addLog(msg, 'positive', artName);
        }
        this.state.spentMoneyToday = false;


        // 注释：日常消费现在完全由事件驱动（吃饭、加油等选择）
        // 不再固定扣除每日生存消耗
        // V2.23 油费改为油箱系统，在选择通勤时处理，不再周结


        // V2.XX 低精力健康惩罚
        // 长期透支精力会导致健康下降
        const lowEnergyThreshold = GameData.energyConfig.lowEnergyThreshold; // 30
        console.log(`[Debug] LowEnergyCheck: Energy=${this.state.energy}, Threshold=${lowEnergyThreshold}`);

        if (this.state.energy < lowEnergyThreshold) {
            let healthPenalty = 2; // 轻微过度劳累
            let penaltyMsg = `⚠️ 长期疲劳: 健康 -${healthPenalty}`;

            if (this.state.energy < 10) {
                healthPenalty += 3; // 严重过度劳累 (total 5)
                penaltyMsg = `⚠️ 严重透支: 健康 -${healthPenalty}`;
            }

            this.state.health = Math.max(0, this.state.health - healthPenalty);
            this.state.dailyFinancialReport.push(penaltyMsg);
            console.log(`[Game] ${penaltyMsg}`);
        }

        // 应用待处理的精力变化（熬夜等）
        this.applyPendingEnergyChange();

        // 睡眠恢复精力
        this.applySleepRecovery();

        // 每日收入（按天计算）- 现在由发薪日统一发放，这里注释掉
        // this.applyDailyIncome();

        // 住所影响
        this.applyHousingEffects();

        // 更新失业状态
        this.updateUnemploymentStatus();

        // 更新健康状态
        this.updateHealthStatus();

        // V2.35 社交值连锁斩杀判定
        if (this.applySocialEffects) {
            this.applySocialEffects();
        }

        // V2.20 处理等待就医与病情恶化
        if (this.state.insurance.waitingForDoctor > 0) {
            this.state.insurance.waitingForDoctor--;
            // 等待期间病情恶化
            const deterioration = this.rng.range(
                GameData.sicknessConfig.waitingDeteriorationMin,
                GameData.sicknessConfig.waitingDeteriorationMax
            );
            this.state.health -= deterioration;
            this.state.dailyFinancialReport.push(`⏳ 等待医生中: 健康 -${deterioration}`);

            if (this.state.insurance.waitingForDoctor <= 0) {
                this.state.pendingDoctorVisit = true; // 标记次日可看医生
            }
        }

        if (this.state.surgeryApprovalDaysLeft > 0) {
            const conf = GameData.eventConfigs.surgery_required.wait;
            this.state.surgeryApprovalDaysLeft--;
            this.state.health = Math.max(0, this.state.health - conf.dailyHealthLoss);
            this.state.dailyFinancialReport.push(`⏳ 等待手术审批: 健康 -${conf.dailyHealthLoss}`);

            if (this.state.surgeryApprovalDaysLeft <= 0) {
                this.state.surgeryApprovalPending = true;
                const approvalEvent = GameEvents.events.find((event) => event.id === 'surgery_approval');
                if (approvalEvent) {
                    if (!this.state.eventQueue) this.state.eventQueue = [];
                    if (!this.state.eventQueue.find((event) => event.id === approvalEvent.id)) {
                        this.state.eventQueue.push(approvalEvent);
                    }
                }
            }
        }

        // V2.20 白卡申请进度
        if (this.state.insurance.medicaidApplicationDays > 0) {
            this.state.insurance.medicaidApplicationDays--;
            if (this.state.insurance.medicaidApplicationDays <= 0) {
                // 申请完成判定
                if (this.state.money < 2000 && (this.state.job === 'unemployed' || this.state.job === 'fired')) {
                    this.state.insurance.healthPlanId = 'medicaid';
                    this.state.dailyFinancialReport.push(`✅ 白卡申请通过！医疗费用现已全免。`);
                } else {
                    this.state.insurance.deniedMedicaid = true;
                    this.state.dailyFinancialReport.push(`❌ 白卡申请被拒：资产或收入不符合条件。`);
                }
            }
        }

        // 检查并重置每月标记 (10天 = 1月)
        if (this.state.day % GameData.timeCycle.monthDays === 1) {
            this.state.phoneBillPaid = false;
            this.state.carInsurancePaid = false;
        }

        // V2.14 检查游戏结束与连锁斩杀判定
        const ending = this.checkGameOver();
        if (ending) {
            this.state.pendingEnding = ending;
            this.isRunning = false;
        }
    }
};
