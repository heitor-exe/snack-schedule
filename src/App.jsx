import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import MemberSelector from './components/MemberSelector';
import AdminConfigModal from './components/AdminConfigModal';
import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import LoadingState from './components/LoadingState';
import SearchModeView from './components/SearchModeView';
import NormalModeView from './components/NormalModeView';
import { useSchedules } from './hooks/useSchedules';
import { useSeasonConfig } from './hooks/useSeasonConfig';
import { useCurrentSchedule } from './hooks/useCurrentSchedule';
import { useSearchResults } from './hooks/useSearchResults';
import {
  MEMBER_STORAGE_KEY,
  getUniqueMembers,
  getRoleForSchedule,
  getRoleLabel,
} from './utils/userUtils';

const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

function App() {
  const { config: seasonConfig, updateConfig: setSeasonConfig } = useSeasonConfig();
  const { schedules, loading, regenerateSchedules } = useSchedules(seasonConfig);
  const { currentSchedule, pastSchedules, upcomingSchedules } = useCurrentSchedule(schedules);

  const [selectedMember, setSelectedMember] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.localStorage.getItem(MEMBER_STORAGE_KEY) ?? '';
  });
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [hasAutoPrompted, setHasAutoPrompted] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showPast, setShowPast] = useState(false);
  const pastSectionRef = useRef(null);

  const {
    searchQuery,
    isSearchActive,
    searchResults,
    searchUpcoming,
    searchPast,
    displayedUpcoming,
    handleSearchChange,
    handleFilterChange,
  } = useSearchResults(upcomingSchedules);

  const allMembers = useMemo(() => {
    const scheduleMembers = getUniqueMembers(schedules);
    return scheduleMembers.length > 0 ? scheduleMembers : seasonConfig.members;
  }, [schedules, seasonConfig.members]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (selectedMember) {
      window.localStorage.setItem(MEMBER_STORAGE_KEY, selectedMember);
    } else {
      window.localStorage.removeItem(MEMBER_STORAGE_KEY);
    }
  }, [selectedMember]);

  useEffect(() => {
    if (!selectedMember && allMembers.length > 0 && !hasAutoPrompted) {
      setSelectorOpen(true);
      setHasAutoPrompted(true);
    }
  }, [selectedMember, allMembers, hasAutoPrompted]);

  const userRoleThisWeek = useMemo(
    () =>
      selectedMember && currentSchedule
        ? getRoleForSchedule(currentSchedule, selectedMember)
        : null,
    [selectedMember, currentSchedule]
  );
  const identityRoleLabel = getRoleLabel(userRoleThisWeek);

  const handleTogglePast = useCallback(() => {
    setShowPast((prev) => {
      const next = !prev;
      if (next) {
        setTimeout(() => {
          pastSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
      return next;
    });
  }, []);

  const handleNameClick = useCallback((name) => {
    handleSearchChange(name);
    setShowPast(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [handleSearchChange]);

  const handleMemberSelect = useCallback((name) => {
    setSelectedMember(name);
    setSelectorOpen(false);
    handleSearchChange(name);
  }, [handleSearchChange]);

  const handleClearSelection = useCallback(() => {
    setSelectedMember('');
    handleSearchChange('');
    setSelectorOpen(true);
  }, [handleSearchChange]);

  const handleApplyAdminConfig = useCallback(
    async (nextConfig) => {
      setIsRegenerating(true);

      try {
        await regenerateSchedules(nextConfig);
        setSeasonConfig(nextConfig);
        setShowPast(false);

        if (selectedMember && !nextConfig.members.includes(selectedMember)) {
          setSelectedMember('');
        }

        setAdminOpen(false);
      } catch (error) {
        console.error('Erro ao regenerar escala:', error);
        window.alert('Não foi possível regenerar a escala. Configure o console e tente novamente.');
      } finally {
        setIsRegenerating(false);
      }
    },
    [selectedMember, regenerateSchedules, setSeasonConfig]
  );

  return (
    <div className="container">
      <AppHeader
        selectedMember={selectedMember}
        identityRoleLabel={identityRoleLabel}
        onOpenSelector={() => setSelectorOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onClearSelection={handleClearSelection}
      />

      <main>
        {loading ? (
          <LoadingState />
        ) : (
          <>
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              resultCount={isSearchActive ? searchResults?.length ?? 0 : null}
            />

            {isSearchActive ? (
              <SearchModeView
                searchResults={searchResults}
                searchUpcoming={searchUpcoming}
                searchPast={searchPast}
                showPast={showPast}
                onTogglePast={handleTogglePast}
                onNameClick={handleNameClick}
                activeQuery={searchQuery}
                selectedMember={selectedMember}
              />
            ) : (
              <NormalModeView
                currentSchedule={currentSchedule}
                upcomingSchedules={upcomingSchedules}
                pastSchedules={pastSchedules}
                displayedUpcoming={displayedUpcoming}
                showPast={showPast}
                onTogglePast={handleTogglePast}
                onFilterChange={handleFilterChange}
                onNameClick={handleNameClick}
                activeQuery={searchQuery}
                selectedMember={selectedMember}
              />
            )}
          </>
        )}
      </main>

      <MemberSelector
        isOpen={selectorOpen}
        members={allMembers}
        selectedMember={selectedMember}
        onSelect={handleMemberSelect}
        onClose={() => setSelectorOpen(false)}
      />

      {adminOpen && (
        <AdminConfigModal
          isOpen={adminOpen}
          currentConfig={seasonConfig}
          onClose={() => setAdminOpen(false)}
          onApply={handleApplyAdminConfig}
          adminPassword={adminPassword}
          isSaving={isRegenerating}
        />
      )}

      <AppFooter />
    </div>
  );
}

export default App;
