import React from 'react';
import { formatDatePT } from '../utils/dateUtils';
import NameChip from './NameChip';
import { getRoleForSchedule, getRoleLabel } from '../utils/userUtils';
import './ScheduleCard.css';

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
    <div className={`schedule-card${isPast ? ' past-card' : ''}`}>
      <div className="card-header">
        <div>
          <h3 className="card-date">{formatDatePT(new Date(date + 'T00:00:00'))}</h3>
          <span className="card-weekday">Sexta-feira</span>
        </div>
        <div className="card-header-right">
          {selectedMember && (
            <span className={`user-role-chip user-role-chip--${userRole ?? 'empty'}`}>
              {roleLabel ?? 'Sem escala'}
            </span>
          )}
          {isPast && <span className="past-badge">Encerrado</span>}
        </div>
      </div>

      <div className="card-body">
        <div className="group food-group">
          <h4>🍽️ Comida ({food_team.length})</h4>
          <ul>{renderNames(food_team)}</ul>
        </div>

        <div className="group drink-group">
          <h4>🥤 Bebida ({drink_team.length})</h4>
          <ul>{renderNames(drink_team)}</ul>
        </div>

        <div className="group free-group">
          <h4>✨ Folga ({free_team.length})</h4>
          <ul className="inline-list">{renderNames(free_team, true)}</ul>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
