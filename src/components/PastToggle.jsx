import React from 'react';

export default function PastToggle({
  isOpen,
  onToggle,
  count,
  labelOpen = 'OCULTAR ESCALAS ANTERIORES',
  labelClosed = 'VER ESCALAS ANTERIORES',
}) {
  return (
    <div className="flex justify-center mt-12">
      <button
        className={`
          inline-flex items-center gap-2.5 px-5 py-2.5 font-body text-[10px] font-black uppercase tracking-widest
          cursor-pointer border transition-all
          ${isOpen
            ? 'bg-primary/10 border-primary/40 text-primary'
            : 'bg-card-dark border-border-muted text-text-muted hover:border-primary/50 hover:text-primary'
          }
        `}
        onClick={onToggle}
        aria-expanded={isOpen}
        type="button"
      >
        <span className={`text-[0.65rem] inline-block transition-transform duration-[250ms] ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? '▲' : '▼'}
        </span>
        <span>{isOpen ? labelOpen : labelClosed}</span>
        <span className="inline-flex items-center justify-center min-w-[1.4rem] h-[1.4rem] px-1.5 text-[9px] font-black rounded-sm bg-primary/10 text-primary tracking-none">
          {count}
        </span>
      </button>
    </div>
  );
}
