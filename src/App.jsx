import React, { useEffect, useState, useCallback, useRef } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import ScheduleList from './components/ScheduleList';
import CurrentWeekCard from './components/CurrentWeekCard';
import ScheduleFilter from './components/ScheduleFilter';
import { getDozenFridays } from './utils/dateUtils';
import { generateBalancedSchedule } from './utils/scheduler';
import { filterByName } from './utils/filterUtils';
import { supabase } from './services/supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/** Retorna a escala da semana vigente (próxima sexta, ou a última se já passaram todas). */
const findCurrentSchedule = (schedules) => {
  if (!schedules || schedules.length === 0) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    schedules.find((s) => new Date(s.date + 'T00:00:00') >= today) ||
    schedules[schedules.length - 1]
  );
};

function App() {
  // ── Data ──────────────────────────────────────────────────────
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── UI state ──────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSchedules, setFilteredSchedules] = useState(null); // null = sem filtro de data
  const [showPast, setShowPast] = useState(false);
  const pastSectionRef = useRef(null);

  // ── Fetch / generate schedules ────────────────────────────────
  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);

      const { data } = await supabase
        .from('schedules')
        .select('*')
        .order('date', { ascending: true });

      if (data && data.length > 0) {
        setSchedules(data);
      } else {
        console.log('Gerando nova escala balanceada...');
        const fridays = getDozenFridays('2026-02-27', '2026-07-03');
        const generated = generateBalancedSchedule(fridays);
        setSchedules(generated);

        if (supabaseUrl && supabaseAnonKey) {
          const { error } = await supabase.from('schedules').insert(generated);
          if (error) console.error('Erro ao salvar escala:', error);
          else console.log('Escala salva no banco com sucesso!');
        }
      }

      setLoading(false);
    };

    fetchSchedules();
  }, []);

  // ── Derived state ─────────────────────────────────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentSchedule = findCurrentSchedule(schedules);

  const pastSchedules = schedules.filter((s) => {
    if (s === currentSchedule) return false;
    return new Date(s.date + 'T00:00:00') < today;
  });

  const upcomingSchedules = schedules.filter((s) => {
    if (s === currentSchedule) return false;
    return new Date(s.date + 'T00:00:00') >= today;
  });

  // Modo busca: resultados separados por data
  const isSearchActive = searchQuery.trim().length > 0;
  const searchResults = isSearchActive ? (filterByName(schedules, searchQuery) ?? []) : null;

  // Próximas (inclui vigente) vs passadas dentro dos resultados de busca
  const searchUpcoming = searchResults
    ? searchResults.filter((s) => new Date(s.date + 'T00:00:00') >= today)
    : [];
  const searchPast = searchResults
    ? searchResults.filter((s) => new Date(s.date + 'T00:00:00') < today)
    : [];

  // Escalas próximas com filtro de data aplicado (não afeta modo busca)
  const displayedUpcoming =
    filteredSchedules !== null
      ? filteredSchedules.filter((s) => {
          if (s === currentSchedule) return false;
          return new Date(s.date + 'T00:00:00') >= today;
        })
      : upcomingSchedules;

  // ── Handlers ──────────────────────────────────────────────────
  const handleFilterChange = useCallback((result) => {
    setFilteredSchedules(result);
  }, []);

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

  /**
   * handleNameClick — clique num nome qualquer no app.
   * Popula a busca e rola ao topo para a pessoa ver os resultados.
   */
  const handleNameClick = useCallback((name) => {
    setSearchQuery(name);
    setFilteredSchedules(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * handleSearchChange — atualizado pelo SearchBar.
   * Limpa filtro de data ao ativar busca.
   */
  const handleSearchChange = useCallback((val) => {
    setSearchQuery(val);
    if (val) setFilteredSchedules(null);
  }, []);

  // ── Render ────────────────────────────────────────────────────
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
            {/* ① Busca — sempre no topo, acima de tudo */}
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              resultCount={isSearchActive ? searchResults.length : null}
            />

            {/* ── MODO BUSCA ── próximas primeiro, passadas depois */}
            {isSearchActive && (
              <>
                {searchResults.length === 0 && (
                  <p className="empty-hint">
                    Tente um nome diferente ou verifique a ortografia.
                  </p>
                )}

                {/* Próximas (inclui vigente) */}
                {searchUpcoming.length > 0 && (
                  <section className="schedule-section">
                    <h2 className="section-title upcoming">📅 Próximas escalas</h2>
                    <ScheduleList
                      schedules={searchUpcoming}
                      isPast={false}
                      onNameClick={handleNameClick}
                      activeQuery={searchQuery}
                    />
                  </section>
                )}

                {/* Passadas — seção recolhível */}
                {searchPast.length > 0 && (
                  <>
                    <div className="past-toggle-wrapper">
                      <button
                        className={`past-toggle-btn${showPast ? ' open' : ''}`}
                        onClick={handleTogglePast}
                        aria-expanded={showPast}
                        type="button"
                      >
                        <span className="past-toggle-icon">{showPast ? '▲' : '▼'}</span>
                        <span>{showPast ? 'Ocultar escalas anteriores' : 'Ver escalas anteriores'}</span>
                        <span className="past-toggle-count">{searchPast.length}</span>
                      </button>
                    </div>

                    {showPast && (
                      <section ref={pastSectionRef} className="schedule-section past-section">
                        <h2 className="section-title past">🗓️ Escalas anteriores</h2>
                        <ScheduleList
                          schedules={searchPast}
                          isPast={true}
                          onNameClick={handleNameClick}
                          activeQuery={searchQuery}
                        />
                      </section>
                    )}
                  </>
                )}
              </>
            )}

            {/* ── MODO NORMAL ── escala vigente + filtro + próximas + passadas */}
            {!isSearchActive && (
              <>
                {/* ② Escala vigente */}
                {currentSchedule && (
                  <CurrentWeekCard
                    schedule={currentSchedule}
                    onNameClick={handleNameClick}
                    activeQuery={searchQuery}
                  />
                )}

                {/* ③ Filtro de data — somente próximas */}
                {upcomingSchedules.length > 0 && (
                  <ScheduleFilter
                    schedules={upcomingSchedules}
                    onFilterChange={handleFilterChange}
                  />
                )}

                {/* ④ Próximas escalas */}
                {displayedUpcoming.length > 0 && (
                  <section className="schedule-section">
                    <h2 className="section-title upcoming">📅 Próximas escalas</h2>
                    <ScheduleList
                      schedules={displayedUpcoming}
                      isPast={false}
                      onNameClick={handleNameClick}
                      activeQuery={searchQuery}
                    />
                  </section>
                )}

                {/* ⑤ Escalas anteriores (toggle) */}
                {pastSchedules.length > 0 && (
                  <>
                    <div className="past-toggle-wrapper">
                      <button
                        className={`past-toggle-btn${showPast ? ' open' : ''}`}
                        onClick={handleTogglePast}
                        aria-expanded={showPast}
                        type="button"
                      >
                        <span className="past-toggle-icon">{showPast ? '▲' : '▼'}</span>
                        <span>{showPast ? 'Ocultar escalas anteriores' : 'Ver escalas anteriores'}</span>
                        <span className="past-toggle-count">{pastSchedules.length}</span>
                      </button>
                    </div>

                    {showPast && (
                      <section ref={pastSectionRef} className="schedule-section past-section">
                        <h2 className="section-title past">🗓️ Escalas anteriores</h2>
                        <ScheduleList
                          schedules={pastSchedules}
                          isPast={true}
                          onNameClick={handleNameClick}
                          activeQuery={searchQuery}
                        />
                      </section>
                    )}
                  </>
                )}
              </>
            )}
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
