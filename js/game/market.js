/**
 * 市场/交易模块 - 资产价格更新与买卖
 */
import { GameData } from '../data/index.js';
import { I18n } from '../i18n.js';

/**
 * 市场相关方法的 Mixin
 */
export const MarketMixin = {
    /**
     * V2.9 获取资产配置
     */
    getAssetConfig(assetId) {
        return GameData.assetTypes[assetId] || null;
    },

    /**
     * V2.9 触发市场新闻
     */
    triggerMarketNews() {
        const newsList = GameData.marketNews;
        if (!newsList || newsList.length === 0) return;

        // 使用 RNG
        const news = newsList[Math.floor(this.rng.random() * newsList.length)];
        this.state.currentNews = news;

        // 更新市场情绪
        this.state.marketSentiment = Math.max(-100, Math.min(100,
            this.state.marketSentiment + news.sentiment));

        console.log(`[Market News] ${news.title} | 情绪变化: ${news.sentiment > 0 ? '+' : ''}${news.sentiment}`);
    },

    /**
     * V2.9 更新市场价格 (支持多资产、新闻效果、避险关联)
     */
    updateMarket() {
        if (!this.state.marketPrices) return;

        // 1. 60% 几率触发新闻 (使用 RNG)
        if (this.rng.random() < 0.60) {
            this.triggerMarketNews();
        }

        // 2. 获取新闻效果
        let newsEffect = this.state.currentNews?.effect || {};

        // V2.35 市场反常机制：20% 几率市场走势与新闻相反
        let isDefiant = false;
        if (this.state.currentNews && this.rng.random() < 0.20) {
            isDefiant = true;
            // 反转所有效果
            const invertedEffect = {};
            for (const key in newsEffect) {
                if (typeof newsEffect[key] === 'number') {
                    invertedEffect[key] = newsEffect[key] * -1;
                }
            }
            newsEffect = invertedEffect;

            // 记录反常日志
            const defianceMsg = I18n.t('game.log.marketDefiance', this.state.currentNews.title);
            this.state.dailyFinancialReport.push(defianceMsg);
            console.log(`[Market] 🤯 DEFICANCE TRIGGERED! News: ${this.state.currentNews.id}`);
        }

        // 3. 更新每个资产价格
        for (const assetId in this.state.marketPrices) {
            const assetData = this.state.marketPrices[assetId];
            const config = this.getAssetConfig(assetId);
            if (!config) continue;

            // 基础随机波动 (使用 RNG)
            let fluctuation = (this.rng.random() - 0.5) * 2 * config.volatility;

            // 应用新闻效果
            if (newsEffect[assetId]) {
                fluctuation += newsEffect[assetId];
            }

            // 避险资产负相关逻辑：当情绪恐慌时，黄金上涨
            if (config.isSafeHaven && this.state.marketSentiment < 0) {
                // 恐慌越大，黄金涨幅越高 (最多额外+5%)
                fluctuation += Math.abs(this.state.marketSentiment) * 0.0005;
            }

            // 高风险资产在恐慌时更容易下跌
            if (config.riskLevel === 'high' || config.riskLevel === 'extreme') {
                if (this.state.marketSentiment < -10) {
                    fluctuation -= Math.abs(this.state.marketSentiment) * 0.001;
                }
            }

            // 计算新价格
            const oldPrice = assetData.price;
            assetData.price = Math.max(0.01, assetData.price * (1 + fluctuation));

            // 保留合适的小数位
            if (assetData.price < 1) {
                assetData.price = Math.round(assetData.price * 10000) / 10000;
            } else if (assetData.price < 100) {
                assetData.price = Math.round(assetData.price * 100) / 100;
            } else {
                assetData.price = Math.round(assetData.price * 10) / 10;
            }

            // 计算涨跌幅
            assetData.change = Math.round(((assetData.price - oldPrice) / oldPrice) * 100 * 10) / 10;

            // 更新历史记录 (保留最近7天)
            assetData.history.push(assetData.price);
            if (assetData.history.length > 7) {
                assetData.history.shift();
            }
        }

        // 4. 情绪衰减 (逐渐回归中性)
        this.state.marketSentiment = Math.round(this.state.marketSentiment * 0.8);

        // 5. 清除过期新闻 (新闻只显示一天)
        // 新闻会在下次 updateMarket 时被新的替换或保留

        console.log(`[Market] 情绪=${this.state.marketSentiment}, 新闻=${this.state.currentNews?.title || '无'}`);
    },

    /**
     * V2.9 买入资产 (支持多资产、均价计算)
     */
    buyAsset(assetId, quantity) {
        if (!this.state.holdings || !this.state.marketPrices) {
            return { success: false, message: I18n.t('game.trade.systemError') };
        }

        const holding = this.state.holdings[assetId];
        const marketData = this.state.marketPrices[assetId];
        const config = this.getAssetConfig(assetId);

        if (!holding || !marketData || !config) {
            return { success: false, message: I18n.t('game.trade.invalidAsset') };
        }

        const price = marketData.price;
        const totalCost = price * quantity;

        if (this.state.money < totalCost) {
            return { success: false, message: I18n.t('game.trade.insufficientFunds') };
        }

        // 计算新均价: (旧成本 * 旧数量 + 新成本) / 新总数量
        const oldTotalCost = holding.avgCost * holding.quantity;
        const newQuantity = holding.quantity + quantity;
        const newAvgCost = (oldTotalCost + totalCost) / newQuantity;

        // 更新持仓
        this.state.money -= totalCost;
        holding.quantity = newQuantity;
        holding.avgCost = Math.round(newAvgCost * 100) / 100;

        const assetName = I18n.t('data.assetNames.' + assetId);
        const assetUnit = I18n.t('data.assetUnits.' + assetId);
        return {
            success: true,
            message: I18n.t('game.trade.buySuccess', quantity, assetUnit, assetName, totalCost)
        };
    },

    /**
     * V2.9 卖出资产
     */
    sellAsset(assetId, quantity) {
        if (!this.state.holdings || !this.state.marketPrices) {
            return { success: false, message: I18n.t('game.trade.systemError') };
        }

        const holding = this.state.holdings[assetId];
        const marketData = this.state.marketPrices[assetId];
        const config = this.getAssetConfig(assetId);

        if (!holding || !marketData || !config) {
            return { success: false, message: I18n.t('game.trade.invalidAsset') };
        }

        if (holding.quantity < quantity) {
            return { success: false, message: I18n.t('game.trade.insufficientHolding') };
        }

        const price = marketData.price;
        const totalValue = price * quantity;

        // 计算盈亏
        const costBasis = holding.avgCost * quantity;
        const profitLoss = totalValue - costBasis;
        const profitPercent = costBasis > 0 ? ((profitLoss / costBasis) * 100).toFixed(1) : 0;

        // 更新持仓 (卖出不改变均价)
        holding.quantity -= quantity;
        this.state.money += totalValue;

        // 如果全部卖出，重置均价
        if (holding.quantity <= 0) {
            holding.quantity = 0;
            holding.avgCost = 0;
        }

        const profitText = profitLoss >= 0
            ? I18n.t('game.trade.profit', profitLoss, profitPercent)
            : I18n.t('game.trade.loss', profitLoss, profitPercent);

        const assetName = I18n.t('data.assetNames.' + assetId);
        const assetUnit = I18n.t('data.assetUnits.' + assetId);
        return {
            success: true,
            message: I18n.t('game.trade.sellSuccess', quantity, assetUnit, assetName, totalValue, profitText)
        };
    }
};
