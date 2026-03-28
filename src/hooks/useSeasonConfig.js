import { useState, useEffect, useCallback } from 'react';
import { MEMBERS } from '../utils/constants';

const STORAGE_KEY = 'season_config_v1';
const DEFAULT_CONFIG = {
  startDate: '2026-02-27',
  endDate: '2026-07-03',
  members: MEMBERS,
  membersText: MEMBERS.join('\n'),
};

function loadFromStorage() {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_CONFIG;

  try {
    const parsed = JSON.parse(raw);
    const members = Array.isArray(parsed.members)
      ? parsed.members.map((name) => String(name).trim()).filter(Boolean)
      : MEMBERS;

    if (!parsed.startDate || !parsed.endDate || members.length === 0) {
      return DEFAULT_CONFIG;
    }

    return {
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      members,
      membersText: members.join('\n'),
    };
  } catch (error) {
    console.warn('Configuração da temporada inválida no localStorage:', error);
    return DEFAULT_CONFIG;
  }
}

export function useSeasonConfig() {
  const [config, setConfig] = useState(loadFromStorage);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        startDate: config.startDate,
        endDate: config.endDate,
        members: config.members,
      })
    );
  }, [config]);

  const updateConfig = useCallback((newConfig) => {
    setConfig((prev) => ({
      ...prev,
      ...newConfig,
      membersText: newConfig.members?.join('\n') ?? prev.membersText,
    }));
  }, []);

  return { config, updateConfig, setConfig };
}
