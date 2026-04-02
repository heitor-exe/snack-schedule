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
  activeQuery,
  selectedMember,
}) {
  const pastSectionRef = useRef(null);

  return (
    <>
      {currentSchedule && (
        <CurrentWeekCard
          schedule={currentSchedule}
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
          <h2 className="text-2xl font-black flex items-center gap-3 text-text-main uppercase tracking-tighter mb-6">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            Próximas Escalas
          </h2>
          <ScheduleList
            schedules={displayedUpcoming}
            isPast={false}
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
            <section ref={pastSectionRef} className="mt-16 pt-8 border-t border-border-muted">
              <h2 className="text-2xl font-black flex items-center gap-3 text-text-muted uppercase tracking-tighter mb-6">
                <span className="material-symbols-outlined">history</span>
                Escalas Anteriores
              </h2>
              <ScheduleList
                schedules={pastSchedules}
                isPast={true}
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
