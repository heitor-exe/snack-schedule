import { useMemo, useState, useCallback } from 'react';
import { filterByName } from '../utils/filterUtils';

export function useSearchResults(schedules) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSchedules, setFilteredSchedules] = useState(null);

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
    () => (searchResults ? searchResults.filter((s) => parseDate(s.date) >= today) : []),
    [searchResults, today]
  );

  const searchPast = useMemo(
    () => (searchResults ? searchResults.filter((s) => parseDate(s.date) < today) : []),
    [searchResults, today]
  );

  const displayedUpcoming = useMemo(
    () => {
      if (filteredSchedules !== null) {
        return filteredSchedules.filter((s) => parseDate(s.date) >= today);
      }
      return schedules.filter((s) => parseDate(s.date) >= today);
    },
    [filteredSchedules, schedules, today]
  );

  const handleSearchChange = useCallback((val) => {
    setSearchQuery(val);
    if (val) setFilteredSchedules(null);
  }, []);

  const handleFilterChange = useCallback((result) => {
    setFilteredSchedules(result);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    isSearchActive,
    searchResults,
    searchUpcoming,
    searchPast,
    displayedUpcoming,
    filteredSchedules,
    handleSearchChange,
    handleFilterChange,
  };
}
