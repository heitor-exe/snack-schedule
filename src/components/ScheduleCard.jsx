import React from 'react';
import { formatDatePT } from '../utils/dateUtils';
import NameChip from './NameChip';
import { getRoleForSchedule, getRoleLabel } from '../utils/userUtils';

const ScheduleCard = ({
  schedule,
  isPast = false,
  onNameClick,
  activeQuery = '',
  selectedMember = '',
}) => {
  if (!schedule) return null;

  const { date, food_team = [], drink_team = [], free_team = [] } = schedule;
  const userRole = selectedMember ? getRoleForSchedule(schedule, selectedMember) : null;
  const roleLabel = getRoleLabel(userRole);

  const renderNames = (names, isInline = false) =>
    names.map((name) => (
      <NameChip
        key={name}
        name={name}
        onNameClick={onNameClick}
        activeQuery={activeQuery}
        isInline={isInline}
        selectedMember={selectedMember}
      />
    ));

  return (
    <div className={`
      bg-card border border-white/10 rounded-md p-6 backdrop-blur-[10px] transition-all duration-300 ease-in-out
      text-left relative
      hover:-translate-y-1.5 hover:border-accent-primary hover:shadow-[0_10px_30px_-10px_rgba(139,92,246,0.3)]
      ${isPast ? 'opacity-55 saturate-[0.3] border-white/6 hover:transform-none hover:border-white/6 hover:shadow-none' : ''}
    `}>
      <div className="border-b border-white/10 pb-4 mb-4 flex justify-between items-start gap-4">
        <div>
          <h3 className={`text-2xl font-bold m-0 text-text-primary ${isPast ? 'line-through decoration-text-secondary' : ''}`}>
            {formatDatePT(new Date(date + 'T00:00:00'))}
          </h3>
          <span className="text-text-secondary text-[0.9rem] uppercase tracking-[1px]">Sexta-feira</span>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {selectedMember && (
            <span className={`
              text-[0.72rem] font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full
              border transition-all duration-300 ease-in-out
              ${userRole === 'food' ? 'bg-gradient-to-br from-orange-500/90 to-rose-500/90 text-white border-transparent' : ''}
              ${userRole === 'drink' ? 'bg-gradient-to-br from-blue-500/95 to-indigo-400/90 text-white' : ''}
              ${userRole === 'free' ? 'bg-gradient-to-br from-emerald-500/95 to-green-500/90 text-slate-900' : ''}
              ${!userRole ? 'bg-white/8 border-white/20 text-text-secondary' : ''}
            `}>
              {roleLabel ?? 'Sem escala'}
            </span>
          )}
          {isPast && (
            <span className="text-[0.7rem] font-bold tracking-[0.08em] uppercase px-2 py-1 rounded bg-white/8 text-text-secondary border border-white/10 self-end">
              Encerrado
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="mb-4 last:mb-0">
          <h4 className="text-food m-0 mb-2 text-base font-semibold flex items-center gap-2">🍽️ Comida ({food_team.length})</h4>
          <ul className="list-none p-0 m-0">{renderNames(food_team)}</ul>
        </div>

        <div className="mb-4 last:mb-0">
          <h4 className="text-drink m-0 mb-2 text-base font-semibold flex items-center gap-2">🥤 Bebida ({drink_team.length})</h4>
          <ul className="list-none p-0 m-0">{renderNames(drink_team)}</ul>
        </div>

        <div className="mb-4 last:mb-0">
          <h4 className="text-free m-0 mb-2 text-base font-semibold flex items-center gap-2">✨ Folga ({free_team.length})</h4>
          <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
            {renderNames(free_team, true)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
