/**
 * 斩杀线生存 V2 - 游戏核心逻辑
 * 时段系统 + 精力机制
 * 
 * 模块化重构：将原有 1566 行代码拆分为 8 个独立模块
 * - core.js: 核心状态管理
 * - market.js: 市场/交易系统
 * - insurance.js: 保险/医疗系统
 * - time.js: 时间系统
 * - effects.js: 日常效果处理
 * - ending.js: 结局检测
 * - events.js: 事件处理
 * - save.js: 存档系统
 */
import { Game } from './game/index.js';
import { GameData } from './data/index.js';
import { EventManager as GameEvents } from './events/index.js';

// Export singleton instance for backward compatibility
export const game = new Game();

// 重新导出 Game 类供其他模块使用
export { Game };

// Expose to window for debug.js and console access
window.game = game;
window.GameEvents = GameEvents;
window.GameData = GameData;
