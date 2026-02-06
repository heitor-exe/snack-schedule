import React from 'react';
import { formatDatePT } from '../utils/dateUtils';
import './ScheduleCard.css';

const ScheduleCard = ({ date, distribution }) => {
  const { food, drink, free } = distribution;

  return (
    <div className="schedule-card">
      <div className="card-header">
        <h3 className="card-date">{formatDatePT(new Date(date))}</h3>
        <span className="card-weekday">Sexta-feira</span>
      </div>
      
      <div className="card-body">
        <div className="group food-group">
          <h4>🍔 Comida ({food.length})</h4>
          <ul>
            {food.map(name => <li key={name}>{name}</li>)}
          </ul>
        </div>
        
        <div className="group drink-group">
          <h4>🥤 Bebida ({drink.length})</h4>
          <ul>
            {drink.map(name => <li key={name}>{name}</li>)}
          </ul>
        </div>

        <div className="group free-group">
          <h4>✨ Folga ({free.length})</h4>
          <ul className="inline-list">
            {free.map(name => <li key={name}>{name}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
