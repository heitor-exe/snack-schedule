import React from 'react';
import { formatDatePT } from '../utils/dateUtils';
import { normalize } from '../utils/filterUtils';
import './ScheduleCard.css';

/**
 * NameChip — renders a member name as a clickable button (A2).
 * Highlights when activeQuery matches the name.
 */
const NameChip = ({ name, onNameClick, activeQuery, isInline }) => {
  const isActive =
    activeQuery && normalize(name).includes(normalize(activeQuery.trim()));

  return (
    <li key={name}>
      <button
        className={`name-chip${isActive ? ' name-chip--active' : ''}${isInline ? ' name-chip--inline' : ''}`}
        onClick={() => onNameClick(name)}
        title={`Ver todas as escalas de ${name}`}
        type="button"
      >
        {name}
      </button>
    </li>
  );
};

const ScheduleCard = ({
  date,
  distribution,
  isPast = false,
  onNameClick,
  activeQuery = '',
}) => {
  const { food, drink, free } = distribution;

  const renderNames = (names, isInline = false) =>
    names.map((name) => (
      <NameChip
        key={name}
        name={name}
        onNameClick={onNameClick}
        activeQuery={activeQuery}
        isInline={isInline}
      />
    ));

  return (
    <div className={`schedule-card${isPast ? ' past-card' : ''}`}>
      <div className="card-header">
        <h3 className="card-date">{formatDatePT(new Date(date + 'T00:00:00'))}</h3>
        <div className="card-header-right">
          {isPast && <span className="past-badge">Encerrado</span>}
          <span className="card-weekday">Sexta-feira</span>
        </div>
      </div>

      <div className="card-body">
        <div className="group food-group">
          <h4>🍔 Comida ({food.length})</h4>
          <ul>{renderNames(food)}</ul>
        </div>

        <div className="group drink-group">
          <h4>🥤 Bebida ({drink.length})</h4>
          <ul>{renderNames(drink)}</ul>
        </div>

        <div className="group free-group">
          <h4>✨ Folga ({free.length})</h4>
          <ul className="inline-list">{renderNames(free, true)}</ul>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
