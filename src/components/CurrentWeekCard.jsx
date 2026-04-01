import React from 'react';
import { formatDatePT } from '../utils/dateUtils';
import NameChip from './NameChip';
import { getRoleForSchedule, getRoleLabel } from '../utils/userUtils';

const getDaysUntilFriday = (dateStr) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const friday = new Date(dateStr + 'T00:00:00');
  friday.setHours(0, 0, 0, 0);
  const diff = Math.round((friday - today) / (1000 * 60 * 60 * 24));
  return diff;
};

const getDaysLabel = (days) => {
  if (days === 0) return 'Hoje é o dia! 🎉';
  if (days === 1) return 'Falta 1 dia';
  if (days > 1) return `Faltam ${days} dias`;
  if (days === -1) return 'Foi ontem';
  return `Há ${Math.abs(days)} dias`;
};

const CurrentWeekCard = ({
  schedule,
  onNameClick,
  activeQuery = '',
  selectedMember = '',
}) => {
  if (!schedule) return null;

  const { date, food_team = [], drink_team = [], free_team = [] } = schedule;
  const daysUntil = getDaysUntilFriday(date);
  const daysLabel = getDaysLabel(daysUntil);
  const userRole = selectedMember ? getRoleForSchedule(schedule, selectedMember) : null;
  const userRoleLabel = getRoleLabel(userRole);

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
    <div className="mb-12 text-left">
      <div className="inline-flex items-center gap-2 bg-gradient-to-br from-accent-primary to-accent-secondary text-white text-[0.75rem] font-bold uppercase tracking-[1.5px] px-3.5 py-1.5 rounded-full mb-4">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse-dot" />
        Escala Vigente
      </div>

      <div className="gradient-border">
        <div className="flex justify-between items-start border-b border-white/8 pb-5 mb-6 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl font-extrabold m-0 mb-1 bg-gradient-to-br from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              {formatDatePT(new Date(date + 'T00:00:00'))}
            </h2>
            <span className="text-text-secondary text-[0.85rem] uppercase tracking-[1px]">Sexta-feira</span>
          </div>
          <div className="bg-accent-primary/15 border border-accent-primary/30 text-accent-primary text-[0.85rem] font-semibold px-4 py-1.5 rounded-full whitespace-nowrap self-start">
            {daysLabel}
          </div>
        </div>

        {selectedMember && (
          <div className="mb-4 flex flex-wrap items-center gap-2.5 bg-white/4 border border-white/8 rounded-lg px-4 py-2.5">
            <span className="text-text-secondary text-[0.9rem]">
              Identificado como <strong>{selectedMember}</strong>
            </span>
            <span className="text-[0.75rem] font-bold tracking-[0.08em] uppercase px-3.5 py-1.5 rounded-full bg-user-accent/12 text-user-accent border border-user-accent/30 shadow-[inset_0_0_0_1px_rgba(249,115,22,0.25)]">
              {userRoleLabel ? `É ${userRoleLabel.toLowerCase()}` : 'Sem escala nesta semana'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
          <div className="current-group">
            <h4 className="text-food m-0 mb-2.5 text-base font-semibold flex items-center gap-1">
              🍽️ Comida <span className="font-normal opacity-60 text-[0.9rem]">({food_team.length})</span>
            </h4>
            <ul className="list-none p-0 m-0">{renderNames(food_team)}</ul>
          </div>

          <div className="current-group">
            <h4 className="text-drink m-0 mb-2.5 text-base font-semibold flex items-center gap-1">
              🥤 Bebida <span className="font-normal opacity-60 text-[0.9rem]">({drink_team.length})</span>
            </h4>
            <ul className="list-none p-0 m-0">{renderNames(drink_team)}</ul>
          </div>

          <div className="current-group">
            <h4 className="text-free m-0 mb-2.5 text-base font-semibold flex items-center gap-1">
              ✨ Folga <span className="font-normal opacity-60 text-[0.9rem]">({free_team.length})</span>
            </h4>
            <ul className="flex flex-wrap gap-1.5 list-none p-0 m-0">
              {renderNames(free_team, true)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeekCard;
