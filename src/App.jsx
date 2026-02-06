import React, { useEffect, useState } from 'react';
import './App.css';
import ScheduleList from './components/ScheduleList';
import { getDozenFridays } from './utils/dateUtils';
import { generateBalancedSchedule } from './utils/scheduler';
import { supabase } from './services/supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function App() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      
      // 1. Check if we have data in Supabase
      // Note: This matches the table schema we plan to create
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .order('date', { ascending: true });

      if (data && data.length > 0) {
        setSchedules(data);
      } else {
        // 2. If no data (or error/no connection), generate locally
        // This acts as a fallback or the "seeder" for the first run
        console.log('Generating new balanced schedule...');
        const fridays = getDozenFridays('2026-02-20', '2026-07-03');
        
        // Generate ALL dates at once to ensure fair distribution over time
        const generatedSchedules = generateBalancedSchedule(fridays);

        setSchedules(generatedSchedules);
        
        // 3. Save to Supabase to persist this schedule
        if (supabaseUrl && supabaseAnonKey) {
          try {
             const { error: insertError } = await supabase
              .from('schedules')
              .insert(generatedSchedules);
              
             if (insertError) {
               console.error('Error saving scedule:', insertError);
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

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">Escala do Lanche</h1>
        <p className="subtitle">Célula de Jovens - Sexta-feira</p>
      </header>
      
      <main>
        <ScheduleList schedules={schedules} />
      </main>

      <footer style={{ marginTop: '4rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
        <p>© 2026 Heitor Macedo</p>
      </footer>
    </div>
  );
}

export default App;
