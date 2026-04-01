import React from 'react';
import ScheduleCard from './ScheduleCard';

/**
 * Props:
 *   schedules   {Object[]}
 *   isPast      {boolean}
 *   onNameClick {Function}  passed down to ScheduleCard for A2
 *   activeQuery {string}    current search query for name highlighting
 */
const ScheduleList = ({
  schedules,
  isPast = false,
  onNameClick,
  activeQuery = '',
  selectedMember = '',
}) => {
  if (!schedules || schedules.length === 0) {
    return (
      <div className="text-center text-2xl text-text-secondary py-16">
        Nenhuma escala encontrada para o período selecionado.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-8 py-4">
      {schedules.map((schedule) => (
        <ScheduleCard
          key={schedule.date}
          schedule={schedule}
          isPast={isPast}
          onNameClick={onNameClick}
          activeQuery={activeQuery}
          selectedMember={selectedMember}
        />
      ))}
    </div>
  );
};

export default ScheduleList;
