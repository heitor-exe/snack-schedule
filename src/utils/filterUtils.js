/**
 * Strips accents and lowercases a string for comparison.
 * Hoisted outside of components (js-hoist-regexp).
 */
export const normalize = (str) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/**
 * Filters a schedule list by whether any member name includes `query`.
 * Returns null when query is empty (= no filter active).
 *
 * @param {Object[]} schedules
 * @param {string} query
 * @returns {Object[] | null}
 */
export const filterByName = (schedules, query) => {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const normQuery = normalize(trimmed);
  return schedules.filter((s) =>
    [...(s.food_team ?? []), ...(s.drink_team ?? []), ...(s.free_team ?? [])].some((name) =>
      normalize(name).includes(normQuery)
    )
  );
};
