import React, { useMemo, useState } from 'react';
import ScheduleCard from './ScheduleCard';
import './ScheduleList.css';

const getStartOfWeek = (date) => {
  const result = new Date(date);
  const day = result.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  result.setDate(result.getDate() + diffToMonday);
  result.setHours(0, 0, 0, 0);
  return result;
};

const getEndOfWeek = (date) => {
  const end = getStartOfWeek(date);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
};

const parseWeekInput = (value) => {
  const [yearStr, weekStr] = value.split('-W');
  const year = Number(yearStr);
  const week = Number(weekStr);

  if (!year || !week) return null;

  const januaryFourth = new Date(year, 0, 4);
  const weekStart = getStartOfWeek(januaryFourth);
  weekStart.setDate(weekStart.getDate() + (week - 1) * 7);

  return weekStart;
};

const getWeekInputValue = (date) => {
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const thursday = new Date(target);
  thursday.setDate(target.getDate() + (4 - (target.getDay() || 7)));

  const isoYear = thursday.getFullYear();
  const yearStart = new Date(isoYear, 0, 1);
  const weekNumber = Math.ceil((((thursday - yearStart) / 86400000) + 1) / 7);

  return `${isoYear}-W${String(weekNumber).padStart(2, '0')}`;
};

const ScheduleList = ({ schedules }) => {
  const [filterType, setFilterType] = useState('all');
  const [selectedWeek, setSelectedWeek] = useState(getWeekInputValue(new Date()));
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));

  const sortedSchedules = useMemo(() => {
    return [...(schedules || [])].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [schedules]);

  const currentSchedule = useMemo(() => {
    const now = new Date();
    const start = getStartOfWeek(now);
    const end = getEndOfWeek(now);

    return sortedSchedules.find((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate >= start && scheduleDate <= end;
    }) || null;
  }, [sortedSchedules]);

  const filteredSchedules = useMemo(() => {
    if (filterType === 'week') {
      const selectedStart = parseWeekInput(selectedWeek);
      if (!selectedStart) return [];

      const selectedEnd = getEndOfWeek(selectedStart);

      return sortedSchedules.filter((schedule) => {
        const scheduleDate = new Date(schedule.date);
        return scheduleDate >= selectedStart && scheduleDate <= selectedEnd;
      });
    }

    if (filterType === 'month') {
      return sortedSchedules.filter((schedule) => schedule.date.startsWith(selectedMonth));
    }

    return sortedSchedules;
  }, [filterType, selectedMonth, selectedWeek, sortedSchedules]);

  const otherSchedules = useMemo(() => {
    if (!currentSchedule) return filteredSchedules;

    return filteredSchedules.filter((schedule) => schedule.date !== currentSchedule.date);
  }, [currentSchedule, filteredSchedules]);

  if (!schedules || schedules.length === 0) {
    return <div className="loading">Carregando escalas...</div>;
  }

  return (
    <section className="schedule-section">
      {currentSchedule && (
        <div className="current-schedule-wrapper">
          <h2 className="section-title">Escala vigente desta semana</h2>
          <ScheduleCard
            date={currentSchedule.date}
            distribution={{
              food: currentSchedule.food_team || [],
              drink: currentSchedule.drink_team || [],
              free: currentSchedule.free_team || []
            }}
            highlight
          />
        </div>
      )}

      <div className="filters-panel">
        <h2 className="section-title">Consultar escalas</h2>

        <div className="filter-type-group">
          <button
            type="button"
            className={`filter-button ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            Todas
          </button>
          <button
            type="button"
            className={`filter-button ${filterType === 'week' ? 'active' : ''}`}
            onClick={() => setFilterType('week')}
          >
            Semana
          </button>
          <button
            type="button"
            className={`filter-button ${filterType === 'month' ? 'active' : ''}`}
            onClick={() => setFilterType('month')}
          >
            Mês
          </button>
        </div>

        {filterType === 'week' && (
          <label className="filter-input-wrapper">
            Selecione a semana
            <input
              type="week"
              className="filter-input"
              value={selectedWeek}
              onChange={(event) => setSelectedWeek(event.target.value)}
            />
          </label>
        )}

        {filterType === 'month' && (
          <label className="filter-input-wrapper">
            Selecione o mês
            <input
              type="month"
              className="filter-input"
              value={selectedMonth}
              onChange={(event) => setSelectedMonth(event.target.value)}
            />
          </label>
        )}
      </div>

      <div>
        <h2 className="section-title">Outras sextas-feiras</h2>

        {otherSchedules.length === 0 ? (
          <div className="loading">Nenhuma escala encontrada para este filtro.</div>
        ) : (
          <div className="schedule-grid">
            {otherSchedules.map((schedule) => (
              <ScheduleCard
                key={schedule.date}
                date={schedule.date}
                distribution={{
                  food: schedule.food_team || [],
                  drink: schedule.drink_team || [],
                  free: schedule.free_team || []
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ScheduleList;
