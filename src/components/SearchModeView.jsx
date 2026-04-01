import React, { useRef } from 'react';
import CurrentWeekCard from './CurrentWeekCard';
import ScheduleList from './ScheduleList';
import PastToggle from './PastToggle';

export default function SearchModeView({
  searchResults,
  searchUpcoming,
  searchPast,
  showPast,
  onTogglePast,
  onNameClick,
  activeQuery,
  selectedMember,
  currentSchedule,
}) {
  const pastSectionRef = useRef(null);

  if (!searchResults || searchResults.length === 0) {
    return (
      <p className="text-text-secondary text-center text-lg">
        Tente um nome diferente ou verifique a ortografia.
      </p>
    );
  }

  const isCurrentInResults = currentSchedule && searchResults.some(
    (s) => s.date === currentSchedule.date
  );
  return (
    <>
      {currentSchedule && isCurrentInResults && (
        <CurrentWeekCard
          schedule={currentSchedule}
          onNameClick={onNameClick}
          activeQuery={activeQuery}
          selectedMember={selectedMember}
        />
      )}

      {searchUpcoming.length > 0 && (
        <section className="mt-12">
          <h2 className="text-base font-bold tracking-[0.06em] uppercase mb-6 pl-1 text-left bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            📅 Próximas escalas
          </h2>
          <ScheduleList
            schedules={searchUpcoming}
            isPast={false}
            onNameClick={onNameClick}
            activeQuery={activeQuery}
            selectedMember={selectedMember}
          />
        </section>
      )}

      {searchPast.length > 0 && (
        <>
          <PastToggle
            isOpen={showPast}
            onToggle={onTogglePast}
            count={searchPast.length}
          />

          {showPast && (
            <section ref={pastSectionRef} className="mt-16 pt-8 border-t border-white/6">
              <h2 className="text-base font-bold tracking-[0.06em] uppercase mb-6 pl-1 text-left text-text-secondary">
                🗓️ Escalas anteriores
              </h2>
              <ScheduleList
                schedules={searchPast}
                isPast={true}
                onNameClick={onNameClick}
                activeQuery={activeQuery}
                selectedMember={selectedMember}
              />
            </section>
          )}
        </>
      )}
    </>
  );
}
