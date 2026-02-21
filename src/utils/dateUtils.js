/**
 * Generates an array of Date objects for all Fridays between a start and end date.
 * @param {string} startDateStr - YYYY-MM-DD
 * @param {string} endDateStr - YYYY-MM-DD
 * @returns {Date[]} Array of Date objects
 */
export const getDozenFridays = (startDateStr, endDateStr) => {
    // Append T00:00:00 so JS parses as LOCAL time, not UTC.
    // Without this, 'YYYY-MM-DD' is treated as UTC midnight, which in UTC-3
    // resolves to the previous day — causing a one-day date shift.
    const start = new Date(startDateStr + 'T00:00:00');
    const end = new Date(endDateStr + 'T00:00:00');
    const fridays = [];

    // Normalize to start of day
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Find first Friday
    // Day of week: 0=Sun, 1=Mon, ..., 5=Fri
    let current = new Date(start);
    const day = current.getDay();
    const diff = (day <= 5 ? 5 : 12) - day;
    current.setDate(current.getDate() + diff);

    while (current <= end) {
        fridays.push(new Date(current));
        // Add 7 days
        current.setDate(current.getDate() + 7);
    }

    return fridays;
};

/**
 * Formats a date to a readable Portuguese string
 * @param {Date} date 
 * @returns {string} e.g. "20 de Fevereiro"
 */
export const formatDatePT = (date) => {
    return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long' }).format(date);
};
