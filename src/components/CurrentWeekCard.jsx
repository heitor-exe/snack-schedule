import React from 'react';
import { formatDatePT } from '../utils/dateUtils';
import { getRoleForSchedule, getRoleLabel } from '../utils/userUtils';
import { normalize } from '../utils/filterUtils';

const getDaysUntilFriday = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const friday = new Date(dateStr + 'T00:00:00');
  friday.setHours(0, 0, 0, 0);
  return Math.round((friday - today) / (1000 * 60 * 60 * 24));
};

const getDaysLabel = (days) => {
  if (days === 0) return 'HOJE É O DIA';
  if (days === 1) return 'FALTA 1 DIA';
  if (days > 1) return `FALTAM ${days} DIAS`;
  if (days === -1) return 'FOI ONTEM';
  return `HÁ ${Math.abs(days)} DIAS`;
};

const NameTag = ({ name, isSelected, isSearchMatch }) => {
  if (isSearchMatch) {
    return (
      <span className="text-search-highlight bg-search-highlight/10 border border-search-highlight/40 font-bold px-2 py-0.5 rounded-sm shadow-[0_0_12px_rgba(255,51,102,0.3)]">
        {name}
      </span>
    );
  }
  if (isSelected) {
    return (
      <span className="text-primary bg-primary/10 border-primary/40 font-bold px-2 py-0.5 rounded-sm shadow-[0_0_12px_rgba(0,255,194,0.2)]">
        {name}
      </span>
    );
  }
  return <span className="text-text-muted">{name}</span>;
};

const TeamNames = ({ names, selectedMember, activeQuery }) => {
  if (!selectedMember && !activeQuery) {
    return <p className="text-sm font-bold leading-relaxed text-text-main">{names.join(', ')}</p>;
  }
  const trimmed = activeQuery?.trim() ?? '';
  return (
    <p className="text-sm font-bold leading-relaxed">
      {names.map((name, i) => (
        <React.Fragment key={name}>
          {i > 0 && <span className="text-border-muted">, </span>}
          <NameTag
            name={name}
            isSelected={name === selectedMember}
            isSearchMatch={trimmed.length > 0 && normalize(name).includes(normalize(trimmed))}
          />
        </React.Fragment>
      ))}
    </p>
  );
};

const CurrentWeekCard = ({ schedule, selectedMember = '', activeQuery = '' }) => {
  if (!schedule) return null;

  const { date, food_team = [], drink_team = [], free_team = [] } = schedule;
  const userRole = selectedMember ? getRoleForSchedule(schedule, selectedMember) : null;
  const userRoleLabel = getRoleLabel(userRole);
  const daysUntil = getDaysUntilFriday(date);
  const daysLabel = getDaysLabel(daysUntil);

  return (
    <section className="w-full border-b border-border-muted bg-background-dark/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/40 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Semana Atual
            </div>
            <h2 className="text-5xl font-black text-text-main leading-none uppercase tracking-tighter">
              {formatDatePT(new Date(date + 'T00:00:00')).toUpperCase()}
            </h2>
            <p className="text-text-muted text-sm leading-relaxed border-l-2 border-border-muted pl-4">
              Prepare seu coração e seu estômago! Confira quem são os responsáveis pelo banquete desta sexta.
            </p>
            {/* Buttons hidden — future features */}
          </div>

          {/* Right: 3 team cards with grid lines */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-border-muted border border-border-muted">
            {/* Food */}
            <div className="bg-background-dark p-6 space-y-4 border-l-2 border-food">
              <div className="flex items-center gap-2 text-food border-b border-border-muted pb-2">
                <span className="material-symbols-outlined text-xl">restaurant</span>
                <h3 className="font-bold text-xs uppercase tracking-widest">Comida</h3>
              </div>
              <div className="space-y-3">
                <TeamNames names={food_team} selectedMember={selectedMember} activeQuery={activeQuery} />
                <div className="bg-food/10 px-2 py-1 inline-block border border-food/30">
                  <p className="text-[9px] text-food uppercase tracking-widest font-bold">{food_team.length} MEMBRO(S)</p>
                </div>
              </div>
            </div>

            {/* Drink */}
            <div className="bg-background-dark p-6 space-y-4 border-l-2 border-drink">
              <div className="flex items-center gap-2 text-drink border-b border-border-muted pb-2">
                <span className="material-symbols-outlined text-xl">local_drink</span>
                <h3 className="font-bold text-xs uppercase tracking-widest">Bebida</h3>
              </div>
              <div className="space-y-3">
                <TeamNames names={drink_team} selectedMember={selectedMember} activeQuery={activeQuery} />
                <div className="bg-drink/10 px-2 py-1 inline-block border border-drink/30">
                  <p className="text-[9px] text-drink uppercase tracking-widest font-bold">{drink_team.length} MEMBRO(S)</p>
                </div>
              </div>
            </div>

            {/* Free */}
            <div className="bg-background-dark p-6 space-y-4 opacity-60">
              <div className="flex items-center gap-2 text-text-muted border-b border-border-muted pb-2">
                <span className="material-symbols-outlined text-xl">bedtime</span>
                <h3 className="font-bold text-xs uppercase tracking-widest">Folga</h3>
              </div>
              <div className="space-y-3">
                <TeamNames names={free_team} selectedMember={selectedMember} activeQuery={activeQuery} />
                <div className="bg-card-dark px-2 py-1 inline-block border border-border-muted">
                  <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold">{free_team.length} MEMBRO(S)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User status */}
        {selectedMember && (
          <div className={`mt-6 flex flex-wrap items-center gap-3 px-4 py-3 rounded-sm border ${
            userRole === 'food' ? 'bg-food/5 border-food/30' :
            userRole === 'drink' ? 'bg-drink/5 border-drink/30' :
            userRole === 'free' ? 'bg-primary/5 border-primary/30' :
            'bg-card-dark border-border-muted'
          }`}>
            <span className="text-text-muted text-sm">
              Identificado como <strong className="text-text-main">{selectedMember}</strong>
            </span>
            <span className={`
              text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-sm
              ${userRole === 'food' ? 'bg-food/10 text-food border border-food/30' : ''}
              ${userRole === 'drink' ? 'bg-drink/10 text-drink border border-drink/30' : ''}
              ${userRole === 'free' ? 'bg-primary/10 text-primary border border-primary/30' : ''}
              ${!userRole ? 'bg-card-dark text-text-muted border border-border-muted' : ''}
            `}>
              {userRoleLabel ? `É ${userRoleLabel.toUpperCase()}` : 'SEM ESCALA NESTA SEMANA'}
            </span>
            <span className="text-primary text-[10px] font-black uppercase tracking-widest ml-auto">
              {daysLabel}
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default CurrentWeekCard;
