import React, { useState, useMemo, useTransition } from 'react';
import { formatDatePT } from '../utils/dateUtils';

const ScheduleFilter = ({ schedules, onFilterChange }) => {
  const [mode, setMode] = useState('month');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [, startTransition] = useTransition();

  const weekOptions = useMemo(
    () =>
      schedules.map((s) => ({
        value: s.date,
        label: formatDatePT(new Date(s.date + 'T00:00:00')).toUpperCase(),
      })),
    [schedules],
  );

  const monthOptions = useMemo(() => {
    const seen = new Set();
    const opts = [];
    schedules.forEach((s) => {
      const d = new Date(s.date + 'T00:00:00');
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!seen.has(key)) {
        seen.add(key);
        const label = new Intl.DateTimeFormat('pt-BR', {
          month: 'long',
          year: 'numeric',
        }).format(d);
        opts.push({ value: key, label: label.charAt(0).toUpperCase() + label.slice(1) });
      }
    });
    return opts;
  }, [schedules]);

  const applyFilter = (newMode, week, month) => {
    startTransition(() => {
      if (newMode === 'week') {
        onFilterChange(week ? schedules.filter((s) => s.date === week) : null);
      } else {
        if (!month) { onFilterChange(null); return; }
        onFilterChange(
          schedules.filter((s) => {
            const d = new Date(s.date + 'T00:00:00');
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            return key === month;
          }),
        );
      }
    });
  };

  const handleModeChange = (m) => {
    setMode(m);
    setSelectedWeek('');
    setSelectedMonth('');
    onFilterChange(null);
  };

  const handleWeekChange = (e) => {
    setSelectedWeek(e.target.value);
    applyFilter('week', e.target.value, selectedMonth);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    applyFilter('month', selectedWeek, e.target.value);
  };

  const handleClear = () => {
    setSelectedWeek('');
    setSelectedMonth('');
    onFilterChange(null);
  };

  const hasFilter = selectedWeek || selectedMonth;

  return (
    <div className="bg-card-dark border border-border-muted rounded-sm px-6 py-5 mb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 border-b border-border-muted pb-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-black flex items-center gap-3 text-text-main uppercase tracking-tighter">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            Próximas Datas
          </h2>
          <p className="text-xs text-text-muted uppercase tracking-[0.2em] font-medium">Cronograma de Operações Mensais</p>
        </div>
        <div className="flex items-center bg-card-dark border border-border-muted p-1">
          <button
            className={`px-4 py-1.5 font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'month' ? 'bg-primary text-background-dark' : 'text-text-muted hover:text-white'}`}
            onClick={() => handleModeChange('month')}
            type="button"
          >
            Mês
          </button>
          <button
            className={`px-4 py-1.5 font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'week' ? 'bg-primary text-background-dark' : 'text-text-muted hover:text-white'}`}
            onClick={() => handleModeChange('week')}
            type="button"
          >
            Semana
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {mode === 'month' ? (
          <select
            className="flex-1 min-w-[200px] bg-card-dark border border-border-muted rounded-sm text-text-main font-body text-sm py-2.5 px-4 custom-select cursor-pointer transition-all focus:outline-none focus:border-primary hover:border-primary/30 uppercase tracking-wider"
            value={selectedMonth}
            onChange={handleMonthChange}
            aria-label="Selecionar mês"
          >
            <option value="">SELECIONE O MÊS...</option>
            {monthOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ) : (
          <select
            className="flex-1 min-w-[200px] bg-card-dark border border-border-muted rounded-sm text-text-main font-body text-sm py-2.5 px-4 custom-select cursor-pointer transition-all focus:outline-none focus:border-primary hover:border-primary/30 uppercase tracking-wider"
            value={selectedWeek}
            onChange={handleWeekChange}
            aria-label="Selecionar semana"
          >
            <option value="">SELECIONE A SEXTA-FEIRA...</option>
            {weekOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}

        {hasFilter && (
          <button className="bg-primary/10 border border-primary/30 text-primary font-body text-[10px] font-black uppercase tracking-widest py-2.5 px-4 rounded-sm transition-all hover:bg-primary/20 hover:border-primary" onClick={handleClear} type="button">
            ✕ LIMPAR
          </button>
        )}
      </div>
    </div>
  );
};

export default ScheduleFilter;
