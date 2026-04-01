import React from 'react';

export default function PastToggle({
  isOpen,
  onToggle,
  count,
  labelOpen = 'Ocultar escalas anteriores',
  labelClosed = 'Ver escalas anteriores',
}) {
  return (
    <div className="flex justify-center mt-12">
      <button
        className={`
          inline-flex items-center gap-2.5 px-5 py-2.5 font-body text-[0.9rem] font-semibold
          cursor-pointer rounded-full border border-white/15 bg-white/5
          text-text-secondary transition-all duration-300 ease-in-out outline-none tracking-[0.01em]
          hover:bg-accent-primary/12 hover:border-accent-primary hover:text-text-primary
          hover:shadow-[0_0_18px_-4px_rgba(139,92,246,0.35)]
          focus-visible:outline-2 focus-visible:outline-accent-primary focus-visible:outline-offset-[3px]
          ${isOpen ? 'bg-accent-primary/10 border-accent-primary/40 text-text-primary' : ''}
        `}
        onClick={onToggle}
        aria-expanded={isOpen}
        type="button"
      >
        <span className={`text-[0.65rem] inline-block transition-transform duration-[250ms] ${isOpen ? 'rotate-180' : ''}`}>
          {isOpen ? '▲' : '▼'}
        </span>
        <span>{isOpen ? labelOpen : labelClosed}</span>
        <span className="inline-flex items-center justify-center min-w-[1.4rem] h-[1.4rem] px-1.5 text-[0.75rem] font-bold rounded-full bg-white/8 text-text-secondary tracking-none">
          {count}
        </span>
      </button>
    </div>
  );
}
