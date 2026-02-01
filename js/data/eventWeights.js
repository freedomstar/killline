/**
 * Event Probability Weights
 */
export const eventWeights = {
    // Daily / Status
    hospital_stay: 1000,
    day_work: 50,
    day_rest: 100,
    day_jobless: 40,

    // Random Day
    morning_coffee: 25,
    afternoon_interview: 20,
    afternoon_exercise: 15,
    afternoon_gig: 20,
    pip_warning: 8,
    pip_result: 200,
    sudden_layoff: 3,
    car_breakdown: 20,
    burglary: 10,
    apartment_fire: 5,
    feeling_under_weather: 20,
    medical_emergency: 100,
    rent_due: 100,
    phone_bill_due: 50,
    friend_help: 10,
    sell_car_emergency: 100,
    buy_used_car: 50,

    // Night
    night_choice: 50,
    homeless_night: 100,
    car_night: 80,
    hot_weather: 20,
    insomnia: 25,
    neighbor_noise: 20,
    boss_late_message: 18,
    late_night_craving: 15,
    nightmare: 22,
    loneliness: 25,

    // Special / Insurance
    emergency_oon: 3,
    surgery_required: 2,
    surgery_approval: 200,
    cold_weather: 20,
    fastfood_warning: 40,
    apartment_accident: 2,

    // Debt / Credit
    credit_collapse: 150,
    medical_debt_collection: 50,
    medical_debt_installment: 100
};
