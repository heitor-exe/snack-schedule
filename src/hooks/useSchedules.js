import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { getDozenFridays } from '../utils/dateUtils';
import { generateBalancedSchedule } from '../utils/scheduler';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const DELETE_ALL_SENTINEL_ID = '00000000-0000-0000-0000-000000000000';

function buildSchedulePersistenceError(operation, error) {
  const friendlyOperation = operation === 'delete' ? 'remover a escala atual' : 'salvar a nova escala';

  if (!error) {
    return new Error(`Não foi possível ${friendlyOperation}.`);
  }

  if (error.code === '42501') {
    return new Error(
      `Sem permissão para ${friendlyOperation}. Verifique a policy de ${operation.toUpperCase()} no Supabase.`
    );
  }

  if (error.code === '23505') {
    return new Error(
      'Já existe uma escala salva para uma ou mais datas. A escala antiga provavelmente não foi removida antes da nova gravação.'
    );
  }

  if (error.message) {
    return new Error(`Não foi possível ${friendlyOperation}: ${error.message}`);
  }

  return new Error(`Não foi possível ${friendlyOperation}.`);
}

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
      const { error: deleteError } = await supabase
        .from('schedules')
        .delete()
        .neq('id', DELETE_ALL_SENTINEL_ID);

      if (deleteError) {
        throw buildSchedulePersistenceError('delete', deleteError);
      }
      
      if (generated.length > 0) {
        const { error: insertError } = await supabase.from('schedules').insert(generated);
        if (insertError) {
          throw buildSchedulePersistenceError('insert', insertError);
        }
      }
    }

    setSchedules(generated);
    return generated;
  }, []);

  return { schedules, loading, regenerateSchedules };
}
