import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { getDozenFridays } from '../utils/dateUtils';
import { generateBalancedSchedule } from '../utils/scheduler';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function fetchAndGenerateSchedules(seasonConfig, setSchedules, setLoading) {
  setLoading(true);

  const { data } = await supabase
    .from('schedules')
    .select('*')
    .order('date', { ascending: true });

  if (data && data.length > 0) {
    setSchedules(data);
  } else {
    const fridays = getDozenFridays(seasonConfig.startDate, seasonConfig.endDate);
    const generated = generateBalancedSchedule(fridays, seasonConfig.members);
    setSchedules(generated);

    if (supabaseUrl && supabaseAnonKey && generated.length > 0) {
      const { error } = await supabase.from('schedules').insert(generated);
      if (error) console.error('Erro ao salvar escala:', error);
      else console.log('Escala salva no banco com sucesso!');
    }
  }

  setLoading(false);
}

export function useSchedules(seasonConfig) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!cancelled) {
      fetchAndGenerateSchedules(seasonConfig, setSchedules, setLoading);
    }

    return () => {
      cancelled = true;
    };
  }, [seasonConfig]);

  const regenerateSchedules = useCallback(async (newConfig) => {
    const fridays = getDozenFridays(newConfig.startDate, newConfig.endDate);
    const generated = generateBalancedSchedule(fridays, newConfig.members);

    if (supabaseUrl && supabaseAnonKey) {
      await supabase.from('schedules').delete().neq('date', '');
      
      if (generated.length > 0) {
        const { error } = await supabase.from('schedules').insert(generated);
        if (error) throw error;
      }
    }

    setSchedules(generated);
    return generated;
  }, []);

  return { schedules, loading, regenerateSchedules };
}
