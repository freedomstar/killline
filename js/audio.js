/**
 * 斩杀线生存 V2 - 音效管理器 (Web Audio API 合成版)
 */
export const AudioManager = {
    ctx: null,
    enabled: true,

    init() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            console.log('[Audio] Web Audio API initialized');
        } catch (e) {
            console.warn('[Audio] Web Audio API not supported', e);
            this.enabled = false;
        }
    },

    /**
     * 播放指定名称的音效
     * @param {string} name - 'click' | 'funny_zero'
     */
    play(name) {
        if (!this.enabled || !this.ctx) return;

        // 浏览器策略要求 AudioContext 在用户交互后必须 resume
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        switch (name) {
            case 'click':
                this.playClick();
                break;
            case 'funny_zero':
                this.playFunnyZero();
                break;
            case 'bingo':
                this.playBingo();
                break;
        }
    },

    /**
     * 合成点击音效：短促、清脆
     */
    playClick() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        // 设置音色
        osc.type = 'sine';

        // 频率包络：微小的音高下降，增加打击感
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);

        // 音量包络：极短的起音和衰减
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

        osc.start(t);
        osc.stop(t + 0.1);
    },

    /**
     * 合成滑稽音效：频率大幅滑落 + 颤音
     */
    playFunnyZero() {
        const t = this.ctx.currentTime;

        // 1. 主振荡器 (声音源)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine'; // 改为正弦波，避免刺耳

        // 频率滑落：类似 "Pewwwww"
        osc.frequency.setValueAtTime(600, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.6);

        // 音量包络
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.05); // 稍微降低音量
        gain.gain.linearRampToValueAtTime(0, t + 0.6);

        // 2. 颤音调制器 (LFO) - 让声音抖动
        const lfo = this.ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 15; // 15Hz 的颤动

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 500; // 调制深度

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency); // 调制主振荡器的频率

        osc.start(t);
        osc.stop(t + 0.6);
        lfo.start(t);
        lfo.stop(t + 0.6);
    },

    /**
     * 合成 Bingo/成功音效：大三和弦琶音 (C5 -> E5 -> G5)
     */
    playBingo() {
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sine'; // 正弦波最清脆

        // 快速琶音：C5 -> E5 -> G5
        osc.frequency.setValueAtTime(523.25, t);          // C5
        osc.frequency.setValueAtTime(659.25, t + 0.08);   // E5
        osc.frequency.setValueAtTime(783.99, t + 0.16);   // G5

        // 音量包络：每个音符稍微突起，最后延音
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.08);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.10);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.16);
        gain.gain.linearRampToValueAtTime(0.2, t + 0.18); // 最后一个音最响
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);

        osc.start(t);
        osc.stop(t + 0.6);
    }
};

AudioManager.init();
