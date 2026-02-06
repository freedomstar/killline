/**
 * Game 模块入口 - 整合所有 Mixin
 */
import { Game } from './core.js';
import { MarketMixin } from './market.js';
import { InsuranceMixin } from './insurance.js';
import { EffectsMixin } from './effects.js';
import { TimeMixin } from './time.js';
import { EndingMixin } from './ending.js';
import { EventsMixin } from './events.js';
import { SaveMixin } from './save.js';
import { DebtMixin } from './debt.js';

// 将所有 Mixin 方法合并到 Game.prototype
Object.assign(
    Game.prototype,
    MarketMixin,
    InsuranceMixin,
    EffectsMixin,
    TimeMixin,
    EndingMixin,
    EventsMixin,
    SaveMixin,
    DebtMixin
);

export { Game };
