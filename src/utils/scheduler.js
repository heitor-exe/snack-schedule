import { MEMBERS } from './constants';

/**
 * Generates a schedule that distributes free shifts as fairly as possible
 * across the entire period, with month-aware priority so that each person
 * gets as many free shifts per month as the math allows.
 *
 * Constraints per Friday: 5 food | 3 drink | 7 free  (15 people total)
 *
 * Strategy — Deficit-based greedy with monthly reset:
 *   - Each person tracks a "free score" (how many free shifts they still "owe").
 *   - At the start of each new month, everyone's monthly free counter resets
 *     and those who got zero free shifts the previous month receive a priority bonus.
 *   - Each Friday:
 *       1. Sort people by (monthly_free_remaining DESC, global_free_deficit DESC)
 *       2. Top 5 → free
 *       3. From remaining 10, sort by drink_deficit DESC → top 4 → drink
 *       4. Remaining 6 → food
 *
 * @param {Date[]} dates - array of Friday Date objects (local time)
 * @returns {Array<{date, food_team, drink_team, free_team}>}
 */
export const generateBalancedSchedule = (dates) => {
    const people = [...MEMBERS];
    const n = people.length; // 15

    // Per-person running counters
    const totalFood = Object.fromEntries(people.map(p => [p, 0]));
    const totalDrink = Object.fromEntries(people.map(p => [p, 0]));
    const totalFree = Object.fromEntries(people.map(p => [p, 0]));

    // Per-person monthly counters (reset each month)
    const monthlyFree = Object.fromEntries(people.map(p => [p, 0]));

    // "Weeks without a free shift" — higher = higher priority
    const freeHunger = Object.fromEntries(people.map(p => [p, 0]));

    const result = [];
    let currentMonth = -1;
    let totalFridays = 0;

    for (const date of dates) {
        const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const month = date.getMonth();

        // Monthly reset
        if (month !== currentMonth) {
            // Give extra hunger boost to anyone who got zero free shifts last month
            // (skip on first month to avoid phantom penalties)
            if (currentMonth !== -1) {
                people.forEach(p => {
                    if (monthlyFree[p] === 0) {
                        freeHunger[p] += 3; // penalty bonus for missed month
                    }
                });
            }
            people.forEach(p => { monthlyFree[p] = 0; });
            currentMonth = month;
        }

        totalFridays++;

        // --- Determine target counts for fair global distribution ---
        // How many total free slots have been distributed so far INCLUDING this Friday?
        // Ideally each person gets (totalFridays * 5 / 15) free = totalFridays / 3
        // We use the deficit from that ideal to break ties.

        // --- Score each person for FREE priority ---
        // Higher score = more deserving of a free shift this week
        const freeScore = (p) => {
            const idealFree = totalFridays * 7 / 15; // expected free per person so far (7 free slots / 15 people)
            const globalDeficit = idealFree - totalFree[p];
            return freeHunger[p] * 10 + globalDeficit * 3 + (monthlyFree[p] === 0 ? 5 : 0) + Math.random() * 0.5;
        };

        // Sort by free priority (desc) — pick top 7
        const sortedByFree = [...people].sort((a, b) => freeScore(b) - freeScore(a));
        const freeTeam = sortedByFree.slice(0, 7);
        const remaining = sortedByFree.slice(7);

        // --- Determine DRINK priority from remaining 10 ---
        const drinkScore = (p) => {
            const idealDrink = totalFridays * 3 / 15;
            const globalDeficit = idealDrink - totalDrink[p];
            return globalDeficit + Math.random() * 0.5;
        };

        const sortedByDrink = [...remaining].sort((a, b) => drinkScore(b) - drinkScore(a));
        const drinkTeam = sortedByDrink.slice(0, 3);
        const foodTeam = sortedByDrink.slice(3); // remaining 5

        // --- Update counters ---
        freeTeam.forEach(p => {
            totalFree[p]++;
            monthlyFree[p]++;
            freeHunger[p] = 0; // reset hunger: person got a free shift
        });
        drinkTeam.forEach(p => {
            totalDrink[p]++;
            freeHunger[p]++; // didn't get free → hunger grows
        });
        foodTeam.forEach(p => {
            totalFood[p]++;
            freeHunger[p]++; // didn't get free → hunger grows
        });

        result.push({
            date: localDate,
            food_team: foodTeam,
            drink_team: drinkTeam,
            free_team: freeTeam,
        });
    }

    // Debug: log distribution stats to console
    console.table(
        Object.fromEntries(
            people.map(p => [p, { food: totalFood[p], drink: totalDrink[p], free: totalFree[p] }])
        )
    );

    return result;
};
