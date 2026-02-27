/**
 * Event Manager
 * Handles event aggregation, selection, and management logic.
 */
import { workEvents, workIncidents, getAvailableIncidents, getIncidentById } from './work.js';
import { dailyEvents, randomDailyActions, generateDailyWorkEvent, getAvailableDailyActions, getDailyActionById, getAvailableLunchOptions, getAvailableCommuteOptions, applyCommuteEffects } from './daily.js';
import { accidentEvents } from './accidents.js';
import { healthEvents } from './health.js';
import { hospitalEvents } from './hospital.js';
import { randomEvents, rentIncreaseBonusEvent } from './random.js';
import { nightEvents, getNightChoiceEvent } from './night.js';
import { financialEvents } from './financial.js';
import { GameData } from '../data/index.js';

const allEvents = [
    ...workEvents,
    ...dailyEvents,
    ...accidentEvents,
    ...healthEvents,
    ...hospitalEvents,
    ...randomEvents,
    rentIncreaseBonusEvent,
    ...nightEvents,
    ...financialEvents
];

export const EventManager = {
    events: allEvents,
    randomDailyActions,
    workIncidents,

    isRandomEventBlocked(state, event) {
        if (!event || !event.isRandom) return false;
        if (!state) return false;
        const limits = GameData.randomEventLimits || { dailyMax: 3, cooldownDays: 2 };
        const todayList = state.randomEventsToday || [];
        if (todayList.includes(event.id)) return true;
        if ((state.randomEventsTodayCount || 0) >= limits.dailyMax) return true;
        const lastDay = state.randomEventLastDay ? state.randomEventLastDay[event.id] : undefined;
        if (typeof lastDay === 'number' && state.day - lastDay <= limits.cooldownDays) return true;
        return false;
    },

    // Core Event Selection Logic
    getAvailableEvents(state, period, rng = null) {
        // 创建 context 对象供 condition 函数使用
        const context = rng ? { rng } : null;
        const isHospitalized = (state && (state.hospitalDaysLeft || 0) > 0);
        const hospitalAllowed = new Set([
            'hospital_stay',
            'rent_due',
            'medical_debt_collection'
        ]);

        return this.events.filter(event => {
            try {
                if (isHospitalized && !hospitalAllowed.has(event.id)) return false;
                // Check periods
                if (event.period !== 'any' && event.period !== period) return false;
                // Check custom condition - 传入 context
                if (event.condition && !event.condition(state, context)) return false;
                if (this.isRandomEventBlocked(state, event)) return false;
                return true;
            } catch (err) {
                console.error(`[EventManager] Error checking condition for event '${event.id}':`, err);
                return false;
            }
        });
    },

    getMandatoryEvents(state, period, rng = null) {
        const events = this.getAvailableEvents(state, period, rng);
        return events.filter(e => e.mandatory === true);
    },

    getEventWeight(event, state = null) {
        if (!event) return 0;

        try {
            const rawWeight = typeof event.weight === 'function'
                ? event.weight(state)
                : (event.weight || 0);
            const numericWeight = Number(rawWeight);

            if (!Number.isFinite(numericWeight)) return 0;
            return Math.max(0, numericWeight);
        } catch (err) {
            console.warn(`[EventManager] Failed to resolve weight for event '${event.id}':`, err);
            return 0;
        }
    },

    selectRandomEvent(availableEvents, rng, state = null) {
        if (!availableEvents || availableEvents.length === 0) return null;

        const weightedEvents = availableEvents
            .map((event) => ({ event, weight: this.getEventWeight(event, state) }))
            .filter((item) => item.weight > 0);

        if (weightedEvents.length === 0) {
            const fallbackIndex = Math.floor(rng.random() * availableEvents.length);
            return availableEvents[fallbackIndex] || null;
        }

        const totalWeight = weightedEvents.reduce((sum, item) => sum + item.weight, 0);
        let random = rng.random() * totalWeight;

        for (const item of weightedEvents) {
            random -= item.weight;
            if (random <= 0) return item.event;
        }

        return weightedEvents[weightedEvents.length - 1].event;
    },

    calculateSuccessRate(state) {
        const config = GameData.energyConfig;
        let rate = 1.0;
        // if (state.energy < config.lowEnergyThreshold) {
        //     rate -= config.lowEnergyPenalty;
        // }

        // V2.XX Artifact: Lucky Ring
        if (Array.isArray(state.artifacts) && state.artifacts.includes('lucky_ring')) {
            const bonus = GameData.artifactConfig?.lucky_ring?.successRateBonus || 0.25;
            rate += bonus;
        }

        return Math.max(0.1, rate);
    },

    // Daily & Work Helpers
    generateDailyWorkEvent,
    getAvailableDailyActions,
    getDailyActionById,
    getAvailableLunchOptions,
    getAvailableCommuteOptions,
    applyCommuteEffects,

    // Incident Helpers
    getAvailableIncidents, // Directly use imported function
    getIncidentById,

    // Night Event Helpers
    getNightChoiceEvent // Directly use imported function
};
