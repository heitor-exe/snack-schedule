import React, { useRef } from 'react';
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
}) {
  const pastSectionRef = useRef(null);

  if (!searchResults || searchResults.length === 0) {
    return (
      <p className="empty-hint">
        Tente um nome diferente ou verifique a ortografia.
      </p>
    );
  }

  return (
    <>
      {searchUpcoming.length > 0 && (
        <section className="schedule-section">
          <h2 className="section-title upcoming">📅 Próximas escalas</h2>
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
            <section ref={pastSectionRef} className="schedule-section past-section">
              <h2 className="section-title past">🗓️ Escalas anteriores</h2>
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
