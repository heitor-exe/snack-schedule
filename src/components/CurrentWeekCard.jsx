import React from 'react';
import { formatDatePT } from '../utils/dateUtils';
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

const CurrentWeekCard = ({ schedule }) => {
  if (!schedule) return null;

  const { date, food_team = [], drink_team = [], free_team = [] } = schedule;
  const daysUntil = getDaysUntilFriday(date);
  const daysLabel = getDaysLabel(daysUntil);

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
            <ul>
              {food_team.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>

          <div className="current-group drink-group">
            <h4>🥤 Bebida <span className="group-count">({drink_team.length})</span></h4>
            <ul>
              {drink_team.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>

          <div className="current-group free-group">
            <h4>✨ Folga <span className="group-count">({free_team.length})</span></h4>
            <ul className="inline-list-current">
              {free_team.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeekCard;
