import React from 'react';
import { formatDatePT } from '../utils/dateUtils';
import { normalize } from '../utils/filterUtils';
import './CurrentWeekCard.css';

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

/**
 * CurrentWeekCard — Escala da semana vigente com nomes clicáveis (A2).
 *
 * Props:
 *   schedule    {Object}    escala da semana atual
 *   onNameClick {Function}  ativa a busca por nome
 *   activeQuery {string}    query atual para highlight
 */
const CurrentWeekCard = ({ schedule, onNameClick, activeQuery = '' }) => {
  if (!schedule) return null;

  const { date, food_team = [], drink_team = [], free_team = [] } = schedule;
  const daysUntil = getDaysUntilFriday(date);
  const daysLabel = getDaysLabel(daysUntil);

  const renderNames = (names, isInline = false) =>
    names.map((name) => {
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
    });

  return (
    <div className="current-week-wrapper">
      <div className="current-week-badge">
        <span className="badge-dot" />
        Escala Vigente
      </div>

      <div className="current-week-card">
        <div className="current-card-header">
          <div>
            <h2 className="current-card-date">{formatDatePT(new Date(date + 'T00:00:00'))}</h2>
            <span className="current-card-weekday">Sexta-feira</span>
          </div>
          <div className="days-pill">{daysLabel}</div>
        </div>

        <div className="current-card-body">
          <div className="current-group food-group">
            <h4>🍔 Comida <span className="group-count">({food_team.length})</span></h4>
            <ul>{renderNames(food_team)}</ul>
          </div>

          <div className="current-group drink-group">
            <h4>🥤 Bebida <span className="group-count">({drink_team.length})</span></h4>
            <ul>{renderNames(drink_team)}</ul>
          </div>

          <div className="current-group free-group">
            <h4>✨ Folga <span className="group-count">({free_team.length})</span></h4>
            <ul className="inline-list-current">{renderNames(free_team, true)}</ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeekCard;
