/**
 * 斩杀线生存 V2 - 多语言文本管理
 * 动态加载语言包
 */

const DEFAULT_LANG = 'zh';
const LANG_STORAGE_KEY = 'killzone_lang';

const localeLoaders = {
    zh: () => import('./locales/zh.js'),
    en: () => import('./locales/en.js'),
};

function getStoredLang() {
    try {
        if (typeof localStorage === 'undefined') return null;
        const lang = localStorage.getItem(LANG_STORAGE_KEY);
        return localeLoaders[lang] ? lang : null;
    } catch (err) {
        return null;
    }
}

async function loadLocale(lang) {
    const loader = localeLoaders[lang];
    if (!loader) {
        return null;
    }

    const mod = await loader();
    return mod[lang] || mod.default || null;
}

const initialTexts = {};
const initialLang = getStoredLang() || DEFAULT_LANG;

try {
    const defaultLocale = await loadLocale(DEFAULT_LANG);
    if (defaultLocale) {
        initialTexts[DEFAULT_LANG] = defaultLocale;
    } else {
        console.warn('[I18n] Failed to resolve default locale module:', DEFAULT_LANG);
    }
} catch (err) {
    console.error('[I18n] Failed to load default locale:', err);
}

if (initialLang !== DEFAULT_LANG) {
    try {
        const selectedLocale = await loadLocale(initialLang);
        if (selectedLocale) {
            initialTexts[initialLang] = selectedLocale;
        }
    } catch (err) {
        console.error('[I18n] Failed to load selected locale:', err);
    }
}

export const I18n = {
    // 当前语言
    currentLang: initialLang,

    // 文本资源
    texts: initialTexts,

    async ensureLang(lang) {
        if (this.texts[lang]) {
            return true;
        }

        try {
            const locale = await loadLocale(lang);
            if (!locale) {
                return false;
            }
            this.texts[lang] = locale;
            return true;
        } catch (err) {
            console.error('[I18n] Failed to load locale:', lang, err);
            return false;
        }
    },

    /**
     * 获取文本的便捷方法
     * @param {string} key - 文本键，支持点分隔路径，如 'data.jobTypes.fulltime'
     * @param {...any} args - 如果文本是函数，则传递参数
     * @returns {string} 文本内容
     */
    t(key, ...args) {
        const keys = key.split('.');
        let value = this.texts[this.currentLang] || this.texts[DEFAULT_LANG];

        if (!value) {
            console.warn('[I18n] Locale not loaded:', this.currentLang);
            return key;
        }

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                console.warn('[I18n] Missing text key:', key);
                return key; // 返回键名作为 fallback
            }
        }

        // 如果是函数，调用它
        if (typeof value === 'function') {
            return value(...args);
        }

        // 如果是字符串且有参数，尝试替换 {0}, {1} 等占位符
        if (typeof value === 'string' && args.length > 0) {
            return value.replace(/\{(\d+)\}/g, (match, index) => {
                return typeof args[index] !== 'undefined' ? args[index] : match;
            });
        }

        return value;
    },

    /**
     * 切换语言（按需加载）
     * @param {string} lang - 语言代码，如 'zh', 'en'
     */
    async setLang(lang) {
        const loaded = await this.ensureLang(lang);
        if (loaded) {
            this.currentLang = lang;
            try {
                if (typeof localStorage !== 'undefined') {
                    localStorage.setItem(LANG_STORAGE_KEY, lang);
                }
            } catch (err) {
                console.warn('[I18n] Failed to persist language:', err);
            }
            console.log('[I18n] Language switched:', lang);
            return true;
        }

        console.warn('[I18n] Unsupported language:', lang);
        return false;
    },
};
