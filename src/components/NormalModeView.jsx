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
        <section className="mt-12">
          <h2 className="text-base font-bold tracking-[0.06em] uppercase mb-6 pl-1 text-left bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            📅 Próximas escalas
          </h2>
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
            <section ref={pastSectionRef} className="mt-16 pt-8 border-t border-white/6">
              <h2 className="text-base font-bold tracking-[0.06em] uppercase mb-6 pl-1 text-left text-text-secondary">
                🗓️ Escalas anteriores
              </h2>
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
