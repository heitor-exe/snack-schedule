import React from 'react';
import ScheduleCard from './ScheduleCard';
import './ScheduleList.css';

/**
 * Props:
 *   schedules   {Object[]}
 *   isPast      {boolean}
 *   onNameClick {Function}  passed down to ScheduleCard for A2
 *   activeQuery {string}    current search query for name highlighting
 */
const ScheduleList = ({ schedules, isPast = false, onNameClick, activeQuery = '' }) => {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="loading">
        Nenhuma escala encontrada para o período selecionado.
      </div>
    );
  }

  return (
    <div className="schedule-grid">
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule.date}
          date={schedule.date}
          isPast={isPast}
          onNameClick={onNameClick}
          activeQuery={activeQuery}
          distribution={{
            food: schedule.food_team || [],
            drink: schedule.drink_team || [],
            free: schedule.free_team || [],
          }}
        />
      ))}
    </div>
  );
};

export default ScheduleList;
