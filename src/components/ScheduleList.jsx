import React from 'react';
import ScheduleCard from './ScheduleCard';

const ScheduleList = ({
  schedules,
  isPast = false,
  activeQuery = '',
  selectedMember = '',
}) => {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="text-center text-lg text-text-muted uppercase tracking-widest font-bold py-16">
        Nenhuma escala encontrada para o período selecionado.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 py-4">
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule.date}
          schedule={schedule}
          isPast={isPast}
          activeQuery={activeQuery}
          selectedMember={selectedMember}
        />
      ))}
    </div>
  );
};

export default ScheduleList;
