import React from 'react';

export default function PastToggle({
  isOpen,
  onToggle,
  count,
  labelOpen = 'Ocultar escalas anteriores',
  labelClosed = 'Ver escalas anteriores',
}) {
  return (
    <div className="past-toggle-wrapper">
      <button
        className={`past-toggle-btn${isOpen ? ' open' : ''}`}
        onClick={onToggle}
        aria-expanded={isOpen}
        type="button"
      >
        <span className="past-toggle-icon">{isOpen ? '▲' : '▼'}</span>
        <span>{isOpen ? labelOpen : labelClosed}</span>
        <span className="past-toggle-count">{count}</span>
      </button>
    </div>
  );
}
