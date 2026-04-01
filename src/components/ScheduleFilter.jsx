import React, { useState, useMemo, useTransition } from 'react';
import { formatDatePT } from '../utils/dateUtils';

/**
 * ScheduleFilter — filtro por data (mês ou semana específica).
 * A busca por nome foi extraída para o componente SearchBar.
 *
 * Props:
 *   schedules      {Object[]}  escalas próximas (alimenta os selects)
 *   onFilterChange {Function}  callback com lista filtrada (null = sem filtro)
 */
const ScheduleFilter = ({ schedules, onFilterChange }) => {
  const [mode, setMode] = useState('month'); // 'week' | 'month'
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [, startTransition] = useTransition();

  // --- Opções derivadas das escalas disponíveis ---
  const weekOptions = useMemo(
    () =>
      schedules.map((s) => ({
        value: s.date,
        label: formatDatePT(new Date(s.date + 'T00:00:00')),
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

  // --- Aplicar filtro de data ---
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
    <div className="bg-card border border-white/8 rounded-xl px-6 py-5 backdrop-blur-xl mb-10 text-left">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <span className="text-text-secondary text-[0.9rem] font-semibold tracking-[0.5px]">📅 Filtrar por data</span>
        <div className="flex bg-white/4 border border-white/8 rounded-md p-[3px] gap-[2px]">
          <button
            className={`
              bg-transparent border-none text-text-secondary text-[0.82rem] font-semibold
              px-3.5 py-1.5 rounded-md transition-all duration-300 ease-in-out font-body cursor-pointer
              hover:text-text-primary hover:bg-white/6
              ${mode === 'month' ? 'bg-gradient-to-br from-accent-primary to-accent-secondary text-white' : ''}
            `}
            onClick={() => handleModeChange('month')}
            type="button"
          >
            Por Mês
          </button>
          <button
            className={`
              bg-transparent border-none text-text-secondary text-[0.82rem] font-semibold
              px-3.5 py-1.5 rounded-md transition-all duration-300 ease-in-out font-body cursor-pointer
              hover:text-text-primary hover:bg-white/6
              ${mode === 'week' ? 'bg-gradient-to-br from-accent-primary to-accent-secondary text-white' : ''}
            `}
            onClick={() => handleModeChange('week')}
            type="button"
          >
            Por Semana
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {mode === 'month' ? (
          <select
            className="flex-1 min-w-[200px] bg-white/5 border border-white/12 rounded-md text-text-primary font-body text-[0.9rem] py-2.5 px-4 custom-select cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus:border-accent-primary focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] hover:border-white/25"
            value={selectedMonth}
            onChange={handleMonthChange}
            aria-label="Selecionar mês"
          >
            <option value="">Selecione o mês...</option>
            {monthOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ) : (
          <select
            className="flex-1 min-w-[200px] bg-white/5 border border-white/12 rounded-md text-text-primary font-body text-[0.9rem] py-2.5 px-4 custom-select cursor-pointer transition-all duration-300 ease-in-out focus:outline-none focus:border-accent-primary focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] hover:border-white/25"
            value={selectedWeek}
            onChange={handleWeekChange}
            aria-label="Selecionar semana"
          >
            <option value="">Selecione a sexta-feira...</option>
            {weekOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}

        {hasFilter && (
          <button className="bg-accent-secondary/12 border border-accent-secondary/30 text-accent-secondary font-body text-[0.82rem] font-semibold py-2.5 px-4 rounded-md transition-all duration-300 ease-in-out whitespace-nowrap hover:bg-accent-secondary/22 hover:border-accent-secondary" onClick={handleClear} type="button">
            ✕ Limpar
          </button>
        )}
      </div>
    </div>
  );
};

export default ScheduleFilter;
