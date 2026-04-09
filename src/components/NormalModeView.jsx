import React, { useRef, useState, useCallback, memo } from 'react';
import CurrentWeekCard from './CurrentWeekCard';
import ScheduleFilter from './ScheduleFilter';
import ScheduleList from './ScheduleList';
import PastToggle from './PastToggle';
import ViewToggle from './ViewToggle';
import CalendarView from './CalendarView';

function parseMonthKey(schedules) {
  if (schedules.length === 0) return new Date();
  return new Date(schedules[0].date + 'T00:00:00');
}

export default memo(function NormalModeView({
  currentSchedule,
  upcomingSchedules,
  pastSchedules,
  displayedUpcoming,
  showPast,
  onTogglePast,
  onFilterChange,
  activeQuery,
  selectedMember,
  isPending,
}) {
  const pastSectionRef = useRef(null);
  const [viewMode, setViewMode] = useState('list');
  const [calendarMonth, setCalendarMonth] = useState(() => parseMonthKey(upcomingSchedules));

  const [filterMonthKey, setFilterMonthKey] = useState('');

  const handlePrevMonth = useCallback(() => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setCalendarMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleFilterMonthChange = useCallback((monthStr) => {
    setFilterMonthKey(monthStr);
    if (monthStr) {
      const [y, m] = monthStr.split('-').map(Number);
      setCalendarMonth(new Date(y, m - 1, 1));
    }
  }, []);

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
          selectedMonth={filterMonthKey}
          onMonthChange={handleFilterMonthChange}
        />
      )}

      {upcomingSchedules.length > 0 && (
        <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
      )}

      {displayedUpcoming.length > 0 && (
        <section className="mt-4">
          {viewMode === 'calendar' ? (
            <CalendarView
              schedules={displayedUpcoming}
              month={calendarMonth}
              selectedMember={selectedMember}
              activeQuery={activeQuery}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              loading={isPending}
            />
          ) : (
            <>
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
            </>
          )}
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
});
