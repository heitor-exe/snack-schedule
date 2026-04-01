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
      <p className="text-text-muted text-center text-lg uppercase tracking-widest font-bold">
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
          <h2 className="text-2xl font-black flex items-center gap-3 text-text-main uppercase tracking-tighter mb-6">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            Próximas Datas
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
            <section ref={pastSectionRef} className="mt-16 pt-8 border-t border-border-muted">
              <h2 className="text-2xl font-black flex items-center gap-3 text-text-muted uppercase tracking-tighter mb-6">
                <span className="material-symbols-outlined">history</span>
                Escalas Anteriores
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
