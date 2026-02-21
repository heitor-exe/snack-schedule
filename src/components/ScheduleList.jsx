import React from 'react';
import ScheduleCard from './ScheduleCard';
import './ScheduleList.css';

const ScheduleList = ({ schedules }) => {
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
          distribution={{
            food: schedule.food_team || [],
            drink: schedule.drink_team || [],
            free: schedule.free_team || []
          }} 
        />
      ))}
    </div>
  );
};

export default ScheduleList;
