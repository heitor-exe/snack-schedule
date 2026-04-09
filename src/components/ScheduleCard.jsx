import React, { useState, memo } from 'react';
import { getRoleForSchedule, getRoleLabel } from '../utils/userUtils';
import { normalize } from '../utils/filterUtils';

const NameTag = memo(function NameTag({ name, isSearchMatch }) {
  if (isSearchMatch) {
    return (
      <span className="text-search-highlight bg-search-highlight/10 border border-search-highlight/40 font-bold px-2 py-0.5 rounded-sm shadow-[0_0_12px_rgba(255,51,102,0.3)]">
        {name}
      </span>
    );
  }
  return <span className="text-text-muted">{name}</span>;
});

const TeamNames = memo(function TeamNames({ names, activeQuery }) {
  if (!activeQuery?.trim()) {
    return <p className="text-xs font-bold text-text-main">{names.join(', ')}</p>;
  }
  const trimmed = activeQuery.trim();
  return (
    <p className="text-xs font-bold">
      {names.map((name, i) => (
        <React.Fragment key={name}>
          {i > 0 && <span className="text-border-muted">, </span>}
          <NameTag
            name={name}
            isSearchMatch={normalize(name).includes(normalize(trimmed))}
          />
        </React.Fragment>
      ))}
    </p>
  );
});

const ScheduleCard = memo(function ScheduleCard({
  schedule,
  isPast = false,
  selectedMember = '',
  activeQuery = '',
}) {
  const [copied, setCopied] = useState(false);

  if (!schedule) return null;

  const { date, food_team = [], drink_team = [], free_team = [] } = schedule;
  const userRole = selectedMember ? getRoleForSchedule(schedule, selectedMember) : null;
  const roleLabel = getRoleLabel(userRole);

  const dateObj = new Date(date + 'T00:00:00');
  const dateStr = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase();
  const dateFull = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const handleCopy = async () => {
    const lines = [
      `📅 ${dateFull.toUpperCase()} — ESCALA DO LANCHE`,
      '',
      `🍽️ COMIDA: ${food_team.length > 0 ? food_team.join(', ') : '—'}`,
      `🥤 BEBIDA: ${drink_team.length > 0 ? drink_team.join(', ') : '—'}`,
      `😴 FOLGA: ${free_team.length > 0 ? free_team.join(', ') : '—'}`,
    ];
    const text = lines.join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={`
      bg-card-dark border border-border-muted overflow-hidden transition-all flex flex-col
      hover:border-primary/50 group
      ${isPast ? 'opacity-50' : ''}
    `}>
      <div className="px-4 py-3 border-b border-border-muted flex justify-between items-center data-table-header">
        <span className={`text-primary font-black text-lg tracking-tighter ${isPast ? 'line-through decoration-text-muted' : ''}`}>
          {dateStr}
        </span>
        <span className="material-symbols-outlined text-text-muted group-hover:text-primary transition-colors text-lg">
          {isPast ? 'history' : 'terminal'}
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1">
        <div className="space-y-1">
          <p className="text-[9px] text-food uppercase font-black tracking-widest flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">restaurant</span> Comida
          </p>
          <TeamNames names={food_team} activeQuery={activeQuery} />
        </div>

        <div className="space-y-1">
          <p className="text-[9px] text-drink uppercase font-black tracking-widest flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">local_drink</span> Bebida
          </p>
          <TeamNames names={drink_team} activeQuery={activeQuery} />
        </div>

        <div className="space-y-1 opacity-50">
          <p className="text-[9px] text-text-muted uppercase font-black tracking-widest flex items-center gap-1">
            <span className="material-symbols-outlined text-[10px]">bedtime</span> Folga
          </p>
          <TeamNames names={free_team} activeQuery={activeQuery} />
        </div>
      </div>

      <div className="px-4 py-2 bg-background-dark/50 border-t border-border-muted flex items-center justify-between">
        {selectedMember && roleLabel ? (
          <span className={`
            text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm
            ${userRole === 'food' ? 'bg-food/10 text-food border border-food/30' : ''}
            ${userRole === 'drink' ? 'bg-drink/10 text-drink border border-drink/30' : ''}
            ${userRole === 'free' ? 'bg-text-muted/10 text-text-muted border border-border-muted' : ''}
          `}>
            {roleLabel}
          </span>
        ) : (
          <span />
        )}
        <button
          className="text-primary font-black text-[9px] uppercase tracking-widest flex items-center gap-1 hover:underline transition-colors"
          onClick={handleCopy}
          type="button"
        >
          {copied ? (
            <>Copiado <span className="material-symbols-outlined text-xs">check</span></>
          ) : (
            <>Copiar <span className="material-symbols-outlined text-xs">content_copy</span></>
          )}
        </button>
      </div>
    </div>
  );
});

export default ScheduleCard;
