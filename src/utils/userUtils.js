export const MEMBER_STORAGE_KEY = 'calendar-cell-selected-member';

const ROLE_LABELS = {
  food: 'Comida',
  drink: 'Bebida',
  free: 'Folga',
};

export const getUniqueMembers = (schedules = []) => {
  const seen = new Set();

  schedules.forEach(({ food_team = [], drink_team = [], free_team = [] }) => {
    [...food_team, ...drink_team, ...free_team].forEach((member) => {
      if (member) seen.add(member);
    });
  });

  return [...seen].sort((a, b) => a.localeCompare(b, 'pt-BR', { sensitivity: 'base' }));
};

export const getRoleForSchedule = (schedule, memberName) => {
  if (!schedule || !memberName) return null;
  const { food_team = [], drink_team = [], free_team = [] } = schedule;

  if (food_team.includes(memberName)) return 'food';
  if (drink_team.includes(memberName)) return 'drink';
  if (free_team.includes(memberName)) return 'free';
  return null;
};

export const getRoleLabel = (role) => ROLE_LABELS[role] ?? null;
