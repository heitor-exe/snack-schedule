import React, { useMemo, memo } from 'react';
import { getRoleForSchedule, getRoleLabel } from '../utils/userUtils';
import { normalize } from '../utils/filterUtils';

const DAY_LABELS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

const ROLE_CLASSES = {
  food: 'text-food bg-food/10 border-food/40',
  drink: 'text-drink bg-drink/10 border-drink/40',
  free: 'text-text-muted bg-text-muted/10',
};

const ROLE_SHADOWS = {
  food: 'rgba(253,203,41,0.3)',
  drink: 'rgba(75,195,250,0.3)',
  free: 'rgba(0,255,194,0.2)',
};

const CALENDAR_SKELETON_CELLS = Array.from({ length: 35 }, (_, i) => (
  <div key={i} className="bg-card-dark min-h-[80px] px-2 py-1">
    <div className="w-5 h-3 bg-text-muted/10 rounded-sm animate-pulse mb-1" />
    <div className="flex gap-0.5 flex-wrap">
      <div className="w-10 h-3 bg-text-muted/10 rounded-sm animate-pulse" />
      <div className="w-8 h-3 bg-text-muted/10 rounded-sm animate-pulse" />
      <div className="w-12 h-3 bg-text-muted/10 rounded-sm animate-pulse" />
    </div>
  </div>
));

function getFridaysInMonth(year, month) {
  const fridays = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    if (date.getDay() === 5) {
      fridays.push(new Date(date));
    }
    date.setDate(date.getDate() + 1);
  }
  return fridays;
}

function getDateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function isToday(date) {
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function isPast(date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return d < today;
}

export default memo(function CalendarView({ schedules, month, selectedMember, activeQuery, onPrevMonth, onNextMonth, loading }) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const scheduleMap = useMemo(() => {
    const map = {};
    schedules.forEach((s) => {
      map[s.date] = s;
    });
    return map;
  }, [schedules]);

  const fridays = useMemo(() => getFridaysInMonth(year, monthIndex), [year, monthIndex]);

  const hasAnySchedule = fridays.some((f) => scheduleMap[getDateKey(f)]);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' })
        .format(month)
        .toUpperCase(),
    [month],
  );

  if (loading) {
    return (
      <div className="bg-card-dark border border-border-muted rounded-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-muted flex items-center justify-between">
          <div className="w-6 h-6 bg-text-muted/10 rounded-sm animate-pulse" />
          <div className="w-48 h-6 bg-text-muted/10 rounded-sm animate-pulse" />
          <div className="w-6 h-6 bg-text-muted/10 rounded-sm animate-pulse" />
        </div>
        <div className="grid grid-cols-7 gap-px bg-border-muted">
          {DAY_LABELS.map((label) => (
            <div
              key={label}
              className="bg-card-dark px-2 py-3 text-center text-[10px] font-black text-text-muted uppercase tracking-widest"
            >
              {label}
            </div>
          ))}
          {CALENDAR_SKELETON_CELLS}
        </div>
      </div>
    );
  }

  if (!hasAnySchedule) {
    return (
      <div className="bg-card-dark border border-border-muted rounded-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border-muted flex items-center justify-between">
          <button
            type="button"
            onClick={onPrevMonth}
            className="p-1 text-text-muted hover:text-primary transition-colors"
            aria-label="Mês anterior"
          >
            <span className="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <h3 className="text-lg font-black text-text-main uppercase tracking-tighter">
            {monthLabel}
          </h3>
          <button
            type="button"
            onClick={onNextMonth}
            className="p-1 text-text-muted hover:text-primary transition-colors"
            aria-label="Próximo mês"
          >
            <span className="material-symbols-outlined text-lg">chevron_right</span>
          </button>
        </div>
        <div className="px-6 py-12 text-center">
          <span className="material-symbols-outlined text-4xl text-text-muted mb-3">event_busy</span>
          <p className="text-text-muted uppercase tracking-widest text-sm font-black">
            NENHUMA ESCALA NESTE MÊS
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-dark border border-border-muted rounded-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border-muted flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevMonth}
          className="p-1 text-text-muted hover:text-primary transition-colors"
          aria-label="Mês anterior"
        >
          <span className="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        <h3 className="text-lg font-black text-text-main uppercase tracking-tighter">
          {monthLabel}
        </h3>
        <button
          type="button"
          onClick={onNextMonth}
          className="p-1 text-text-muted hover:text-primary transition-colors"
          aria-label="Próximo mês"
        >
          <span className="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border-muted">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="bg-card-dark px-2 py-3 text-center text-[10px] font-black text-text-muted uppercase tracking-widest"
          >
            {label}
          </div>
        ))}

        {(() => {
          const firstDay = new Date(year, monthIndex, 1).getDay();
          const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
          const cells = [];

          for (let i = 0; i < firstDay; i++) {
            cells.push(
              <div key={`empty-${i}`} className="bg-card-dark min-h-[80px] opacity-30" />,
            );
          }

          for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, monthIndex, day);
            const isFriday = date.getDay() === 5;
            const key = getDateKey(date);
            const schedule = scheduleMap[key];
            const today = isToday(date);
            const pastFriday = !today && isPast(date);

            if (!isFriday) {
              cells.push(
                <div key={day} className="bg-card-dark min-h-[80px]" />,
              );
              continue;
            }

            cells.push(
              <div
                key={key}
                className={`bg-card-dark min-h-[80px] px-2 py-1 transition-all ${pastFriday ? 'opacity-50' : ''} ${today ? 'ring-1 ring-primary' : ''}`}
              >
                <span className="text-[10px] text-text-muted font-black block mb-1">
                  {day}
                </span>

                {schedule ? (
                  selectedMember ? (
                    <MemberCell
                      schedule={schedule}
                      member={selectedMember}
                      activeQuery={activeQuery}
                      isPastDate={pastFriday}
                    />
                  ) : (
                    <OverviewCell
                      schedule={schedule}
                      activeQuery={activeQuery}
                      isPastDate={pastFriday}
                    />
                  )
                ) : (
                  <span className="text-[9px] text-text-muted/30 uppercase">—</span>
                )}
              </div>,
            );
          }

          return cells;
        })()}
      </div>
    </div>
  );
});

const MemberCell = memo(function MemberCell({ schedule, member, activeQuery, isPastDate }) {
  const role = getRoleForSchedule(schedule, member);
  if (!role) {
    return (
      <span className="text-[9px] text-text-muted/30 uppercase">SEM ESCALA</span>
    );
  }

  const label = getRoleLabel(role);
  const classes = ROLE_CLASSES[role];
  const isMatch = activeQuery && normalize(member).includes(normalize(activeQuery));

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm border text-[9px] font-black uppercase tracking-wider ${classes}`}
      style={{ boxShadow: isPastDate ? 'none' : `0 0 8px ${ROLE_SHADOWS[role]}` }}
    >
      {isMatch ? (
        <span className="text-search-highlight">{label}</span>
      ) : (
        <span>{label}</span>
      )}
    </div>
  );
});

const OverviewCell = memo(function OverviewCell({ schedule, activeQuery, isPastDate }) {
  const allMembers = [
    ...schedule.food_team.map((n) => ({ name: n, role: 'food' })),
    ...schedule.drink_team.map((n) => ({ name: n, role: 'drink' })),
    ...schedule.free_team.map((n) => ({ name: n, role: 'free' })),
  ];

  return (
    <div className="flex flex-wrap gap-0.5">
      {allMembers.map(({ name, role }) => {
        const classes = ROLE_CLASSES[role];
        const isMatch = activeQuery && normalize(name).includes(normalize(activeQuery));
        return (
          <span
            key={name}
            className={`inline-block overflow-hidden truncate px-1.5 py-0.5 rounded-sm border text-[8px] font-black uppercase tracking-wider w-[60px] sm:w-[75px] ${classes}`}
            style={{ boxShadow: isPastDate ? 'none' : `0 0 4px ${ROLE_SHADOWS[role]}` }}
            title={name}
            aria-label={name}
          >
            {isMatch ? (
              <span className="text-search-highlight">{name.split(' ')[0]}</span>
            ) : (
              <span>{name.split(' ')[0]}</span>
            )}
          </span>
        );
      })}
    </div>
  );
});
