import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import ScheduleList from './components/ScheduleList';
import CurrentWeekCard from './components/CurrentWeekCard';
import ScheduleFilter from './components/ScheduleFilter';
import { getDozenFridays } from './utils/dateUtils';
import { generateBalancedSchedule } from './utils/scheduler';
import { supabase } from './services/supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/**
 * Finds the current week's schedule:
 * - If today is before or on a Friday, pick the nearest upcoming Friday.
 * - If we're past all Fridays, pick the last one.
 */
const findCurrentSchedule = (schedules) => {
  if (!schedules || schedules.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find closest upcoming friday (including today if today is friday)
  const upcoming = schedules.find((s) => {
    const d = new Date(s.date + 'T00:00:00');
    return d >= today;
  });

  // If no upcoming, return the last one
  return upcoming || schedules[schedules.length - 1];
};

function App() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSchedules, setFilteredSchedules] = useState(null); // null = no filter active

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);

      // 1. Check if we have data in Supabase
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('date', { ascending: true });

      if (data && data.length > 0) {
        setSchedules(data);
      } else {
        // 2. If no data (or error/no connection), generate locally
        console.log('Generating new balanced schedule...');
        const fridays = getDozenFridays('2026-02-27', '2026-07-03');
        const generatedSchedules = generateBalancedSchedule(fridays);

        setSchedules(generatedSchedules);

        // 3. Save to Supabase to persist this schedule
        if (supabaseUrl && supabaseAnonKey) {
          try {
            const { error: insertError } = await supabase
              .from('schedules')
              .insert(generatedSchedules);

            if (insertError) {
              console.error('Error saving schedule:', insertError);
            } else {
              console.log('Schedule successfully saved to database!');
            }
          } catch (err) {
            console.error('Unexpected error saving to DB:', err);
          }
        } else {
          console.warn('Supabase keys missing. Schedule will not be saved.');
        }
      }

      setLoading(false);
    };

    fetchSchedules();
  }, []);

  // --- Derived state ---
  const currentSchedule = findCurrentSchedule(schedules);

  // Schedules to show in the main list (excluding the current week)
  const otherSchedules = schedules.filter((s) => s !== currentSchedule);

  // If a filter is active, apply it to otherSchedules only
  const displayedSchedules = filteredSchedules !== null
    ? filteredSchedules.filter((s) => s !== currentSchedule)
    : otherSchedules;

  const handleFilterChange = useCallback((result) => {
    setFilteredSchedules(result);
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Escala do Lanche</h1>
        <p className="subtitle">Célula de Jovens - Sexta-feira</p>
      </header>

      <main>
        {loading ? (
          <div className="loading-state">Carregando escalas...</div>
        ) : (
          <>
            {/* Current week highlight */}
            {currentSchedule && <CurrentWeekCard schedule={currentSchedule} />}

            {/* Filter / Date Picker */}
            {otherSchedules.length > 0 && (
              <ScheduleFilter
                schedules={otherSchedules}
                onFilterChange={handleFilterChange}
              />
            )}

            {/* Remaining schedules */}
            <ScheduleList schedules={displayedSchedules} />
          </>
        )}
      </main>

      <footer style={{ marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <p>© 2026 Heitor Macedo</p>
      </footer>
    </div>
  );
}

export default App;
