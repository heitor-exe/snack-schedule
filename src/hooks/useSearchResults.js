import { useMemo, useState, useCallback, useTransition } from 'react';
import { filterByName } from '../utils/filterUtils';

export function useSearchResults(schedules, currentSchedule = null) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSchedules, setFilteredSchedules] = useState(null);
  const [isPending, startTransition] = useTransition();

  const isSearchActive = searchQuery.trim().length > 0;

  const searchResults = useMemo(
    () => (isSearchActive ? (filterByName(schedules, searchQuery) ?? []) : null),
    [schedules, searchQuery, isSearchActive]
  );

  const parseDate = (dateStr) => new Date(dateStr + 'T00:00:00');

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const searchUpcoming = useMemo(
    () => {
      if (!searchResults) return [];
      return searchResults.filter((s) => {
        const matchesDate = parseDate(s.date) >= today;
        const isCurrent = currentSchedule && s.date === currentSchedule.date;
        return matchesDate && !isCurrent;
      });
    },
    [searchResults, today, currentSchedule]
  );

  const searchPast = useMemo(
    () => (searchResults ? searchResults.filter((s) => parseDate(s.date) < today) : []),
    [searchResults, today]
  );

  const displayedUpcoming = useMemo(
    () => {
      const source = filteredSchedules !== null ? filteredSchedules : schedules;
      return source.filter((s) => {
        const matchesDate = parseDate(s.date) >= today;
        const isCurrent = currentSchedule && s.date === currentSchedule.date;
        return matchesDate && !isCurrent;
      });
    },
    [filteredSchedules, schedules, today, currentSchedule]
  );

  const handleSearchChange = useCallback((val) => {
    setSearchQuery(val);
    if (val) setFilteredSchedules(null);
  }, []);

  const handleFilterChange = useCallback((result) => {
    startTransition(() => {
      setFilteredSchedules(result);
    });
  }, [startTransition]);

  return {
    searchQuery,
    setSearchQuery,
    isSearchActive,
    searchResults,
    searchUpcoming,
    searchPast,
    displayedUpcoming,
    filteredSchedules,
    isPending,
    handleSearchChange,
    handleFilterChange,
  };
}
