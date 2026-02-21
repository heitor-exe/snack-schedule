import React, { useState, useMemo } from 'react';
import { formatDatePT } from '../utils/dateUtils';
import './ScheduleFilter.css';

/**
 * ScheduleFilter — filtro por semana ou mês
 * @param {Object[]} schedules - lista completa de escalas
 * @param {Function} onFilterChange - callback com a lista filtrada
 */
const ScheduleFilter = ({ schedules, onFilterChange }) => {
  const [mode, setMode] = useState('month'); // 'week' | 'month'
  const [selectedWeek, setSelectedWeek] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // --- Derive available options from schedules ---
  const weekOptions = useMemo(() => {
    return schedules.map((s) => ({
      value: s.date,
      label: formatDatePT(new Date(s.date + 'T00:00:00')),
    }));
  }, [schedules]);

  const monthOptions = useMemo(() => {
    const seen = new Set();
    const opts = [];
    schedules.forEach((s) => {
      const d = new Date(s.date + 'T00:00:00');
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (!seen.has(key)) {
        seen.add(key);
        const label = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(d);
        opts.push({ value: key, label: label.charAt(0).toUpperCase() + label.slice(1) });
      }
    });
    return opts;
  }, [schedules]);

  // --- Apply filter whenever selection changes ---
  const applyFilter = (newMode, week, month) => {
    if (newMode === 'week') {
      if (!week) {
        onFilterChange(null);
        return;
      }
      onFilterChange(schedules.filter((s) => s.date === week));
    } else {
      if (!month) {
        onFilterChange(null);
        return;
      }
      onFilterChange(
        schedules.filter((s) => {
          const d = new Date(s.date + 'T00:00:00');
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
          return key === month;
        }),
      );
    }
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
    <div className="schedule-filter">
      <div className="filter-header">
        <span className="filter-label">🔍 Buscar escala</span>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${mode === 'month' ? 'active' : ''}`}
            onClick={() => handleModeChange('month')}
          >
            Por Mês
          </button>
          <button
            className={`filter-tab ${mode === 'week' ? 'active' : ''}`}
            onClick={() => handleModeChange('week')}
          >
            Por Semana
          </button>
        </div>
      </div>

      <div className="filter-controls">
        {mode === 'month' ? (
          <select
            className="filter-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            aria-label="Selecionar mês"
          >
            <option value="">Selecione o mês...</option>
            {monthOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : (
          <select
            className="filter-select"
            value={selectedWeek}
            onChange={handleWeekChange}
            aria-label="Selecionar semana"
          >
            <option value="">Selecione a sexta-feira...</option>
            {weekOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}

        {hasFilter && (
          <button className="filter-clear-btn" onClick={handleClear}>
            ✕ Limpar
          </button>
        )}
      </div>
    </div>
  );
};

export default ScheduleFilter;
