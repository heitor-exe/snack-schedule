import React, { useRef } from 'react';
import CurrentWeekCard from './CurrentWeekCard';
import ScheduleFilter from './ScheduleFilter';
import ScheduleList from './ScheduleList';
import PastToggle from './PastToggle';

export default function NormalModeView({
  currentSchedule,
  upcomingSchedules,
  pastSchedules,
  displayedUpcoming,
  showPast,
  onTogglePast,
  onFilterChange,
  onNameClick,
  activeQuery,
  selectedMember,
}) {
  const pastSectionRef = useRef(null);

  return (
    <>
      {currentSchedule && (
        <CurrentWeekCard
          schedule={currentSchedule}
          onNameClick={onNameClick}
          activeQuery={activeQuery}
          selectedMember={selectedMember}
        />
      )}

      {upcomingSchedules.length > 0 && (
        <ScheduleFilter
          schedules={upcomingSchedules}
          onFilterChange={onFilterChange}
        />
      )}

      {displayedUpcoming.length > 0 && (
        <section className="schedule-section">
          <h2 className="section-title upcoming">📅 Próximas escalas</h2>
          <ScheduleList
            schedules={displayedUpcoming}
            isPast={false}
            onNameClick={onNameClick}
            activeQuery={activeQuery}
            selectedMember={selectedMember}
          />
        </section>
      )}

      {pastSchedules.length > 0 && (
        <>
          <PastToggle
            isOpen={showPast}
            onToggle={onTogglePast}
            count={pastSchedules.length}
          />

          {showPast && (
            <section ref={pastSectionRef} className="schedule-section past-section">
              <h2 className="section-title past">🗓️ Escalas anteriores</h2>
              <ScheduleList
                schedules={pastSchedules}
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
