import { useMemo } from 'react';

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const findCurrentSchedule = (schedules) => {
  if (!schedules || schedules.length === 0) return null;
  const today = getToday();
  return (
    schedules.find((s) => new Date(s.date + 'T00:00:00') >= today) ||
    schedules[schedules.length - 1]
  );
};

const parseDate = (dateStr) => new Date(dateStr + 'T00:00:00');

export function useCurrentSchedule(schedules) {
  const today = useMemo(() => getToday(), []);

  const currentSchedule = useMemo(
    () => findCurrentSchedule(schedules),
    [schedules]
  );

  const pastSchedules = useMemo(
    () => schedules.filter((s) => {
      const isCurrent = currentSchedule && s.date === currentSchedule.date;
      if (isCurrent) return false;
      return parseDate(s.date) < today;
    }),
    [schedules, currentSchedule, today]
  );

  const upcomingSchedules = useMemo(
    () => schedules.filter((s) => {
      const isCurrent = currentSchedule && s.date === currentSchedule.date;
      if (isCurrent) return false;
      return parseDate(s.date) >= today;
    }),
    [schedules, currentSchedule, today]
  );

  return {
    today,
    currentSchedule,
    pastSchedules,
    upcomingSchedules,
  };
}
