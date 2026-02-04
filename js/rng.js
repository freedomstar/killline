/**
 * 斩杀线生存 V2.11 - 随机数生成器
 * 使用 Mulberry32 算法实现确定性随机
 */

export class SeededRNG {
    constructor(seed) {
        // 保存原始种子字符串，用于存档和 UI 显示
        this.originalSeed = seed ? seed.toString() : null;
        // 如果没有提供种子，使用当前时间戳
        this.seed = seed ? this.hashString(seed.toString()) : Date.now();
        this.initialSeed = this.seed; // 保存初始种子供重置
    }

    /**
     * 获取当前 RNG 状态快照
     */
    getState() {
        return {
            seed: this.seed,
            initialSeed: this.initialSeed
        };
    }

    /**
     * 恢复 RNG 状态快照
     */
    setState(snapshot) {
        if (!snapshot) return;
        this.seed = snapshot.seed;
        this.initialSeed = snapshot.initialSeed;
    }

    /**
     * 克隆 RNG（用于预览/模拟，不消耗真实 RNG）
     */
    clone() {
        const rng = new SeededRNG();
        rng.seed = this.seed;
        rng.initialSeed = this.initialSeed;
        return rng;
    }

    /**
     * 将字符串种子转换为数字哈希
     */
    hashString(str) {
        let hash = 1779033703 ^ str.length;
        for (let i = 0; i < str.length; i++) {
            hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353);
            hash = hash << 13 | hash >>> 19;
        }
        return (function () {
            hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
            hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
            return (hash ^= hash >>> 16) >>> 0;
        })();
    }

    /**
     * 生成下一个随机数 (0-1)
     * Mulberry32 Algorithm
     */
    random() {
        this.seed += 0x6D2B79F5;
        let t = this.seed;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }

    /**
     * 生成范围整数 [min, max]
     */
    range(min, max) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }

    /**
     * 随机选择数组中的一个元素
     */
    pick(array) {
        if (!array || array.length === 0) return null;
        return array[Math.floor(this.random() * array.length)];
    }

    /**
     * 根据权重随机选择
     * @param {Array} items - 对象数组，每项需包含 weight 属性
     */
    pickWeighted(items) {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        let r = this.random() * totalWeight;
        for (const item of items) {
            if (r < item.weight) return item;
            r -= item.weight;
        }
        return items[items.length - 1];
    }

    /**
     * 重置种子
     */
    reset() {
        this.seed = this.initialSeed;
    }
}
