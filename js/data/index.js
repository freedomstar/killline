/**
 * GameData Aggregator
 */
import * as Config from './config.js';
import * as Items from './items.js';
import { insuranceSystem } from './insurance.js';
import { eventWeights } from './eventWeights.js';
import { eventConfigs } from './eventConfigs.js';
// nightChoices 不在此处导入，避免循环依赖（它在 debug.html 中单独加载）

export const GameData = {
    // Spread Config
    ...Config,

    // Spread Items
    ...Items,

    // Modules
    insuranceSystem,
    eventWeights,
    eventConfigs,

};
