import { MEMBERS } from './constants';

/**
 * Generates a globally balanced schedule for all provided dates.
 * Ensures that over the entire period, each member has a roughly equal distribution
 * of Food, Drink, and Free shifts.
 * 
 * @param {Date[]} dates - Array of Friday dates
 * @returns {Array} Array of schedule objects { date, food_team, drink_team, free_team }
 */
export const generateBalancedSchedule = (dates) => {
    const numDates = dates.length;
    // Deep copy members to avoid mutation issues
    const people = [...MEMBERS];

    // 1. Initialize random valid schedules for each day
    // Constraint: 6 Food, 4 Drnk, 5 Free
    let schedule = dates.map(date => {
        const shuffled = [...people].sort(() => Math.random() - 0.5);
        return {
            date: date.toISOString(),
            assignments: {
                [people[0]]: 'food', [people[1]]: 'food', [people[2]]: 'food',
                [people[3]]: 'food', [people[4]]: 'food', [people[5]]: 'food',
                [people[6]]: 'drink', [people[7]]: 'drink', [people[8]]: 'drink', [people[9]]: 'drink',
                [people[10]]: 'free', [people[11]]: 'free', [people[12]]: 'free',
                [people[13]]: 'free', [people[14]]: 'free'
            }
        };
    });

    // Helper to calculate cost (unfairness)
    // Cost = (Count - Target)^2 for each person and role
    // But simply minimizing variance of counts works well.
    const calculateStats = (sched) => {
        const stats = {};
        people.forEach(p => stats[p] = { food: 0, drink: 0, free: 0 });

        sched.forEach(day => {
            people.forEach(person => {
                const role = day.assignments[person];
                if (role) stats[person][role]++;
            });
        });
        return stats;
    };

    const calculateCost = (stats) => {
        let cost = 0;
        const roles = ['food', 'drink', 'free'];

        roles.forEach(role => {
            const counts = people.map(p => stats[p][role]);
            const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
            const variance = counts.reduce((a, b) => a + (b - mean) ** 2, 0);
            cost += variance;
        });

        return cost;
    };

    let currentStats = calculateStats(schedule);
    let currentCost = calculateCost(currentStats);

    // 2. Optimization Loop (Hill Climbing)
    // We swap two people's roles on a random day. If it improves balance (lower cost), we keep it.
    const ITERATIONS = 50000;

    for (let i = 0; i < ITERATIONS; i++) {
        // Pick random day
        const dayIdx = Math.floor(Math.random() * numDates);
        const day = schedule[dayIdx];

        // Pick two random people
        const personA = people[Math.floor(Math.random() * people.length)];
        const personB = people[Math.floor(Math.random() * people.length)];

        if (personA === personB) continue;

        const roleA = day.assignments[personA];
        const roleB = day.assignments[personB];

        if (roleA === roleB) continue; // No point swapping same roles

        // Try Swap
        // Update stats incrementally for performance (instead of recalculating whole thing)
        currentStats[personA][roleA]--;
        currentStats[personA][roleB]++;
        currentStats[personB][roleB]--;
        currentStats[personB][roleA]++;

        const newCost = calculateCost(currentStats);

        if (newCost < currentCost) {
            // Improved! commit change
            day.assignments[personA] = roleB;
            day.assignments[personB] = roleA;
            currentCost = newCost;
        } else {
            // Revert stats
            currentStats[personA][roleB]--;
            currentStats[personA][roleA]++;
            currentStats[personB][roleA]--;
            currentStats[personB][roleB]++;
        }
    }

    // Debug: Log final stats to console to verify fairness
    console.log("Final Schedule Balance Stats:", currentStats);

    // 3. Format output
    return schedule.map(day => {
        const food = [];
        const drink = [];
        const free = [];

        Object.entries(day.assignments).forEach(([person, role]) => {
            if (role === 'food') food.push(person);
            if (role === 'drink') drink.push(person);
            if (role === 'free') free.push(person);
        });

        return {
            date: day.date,
            food_team: food,
            drink_team: drink,
            free_team: free
        };
    });
};
