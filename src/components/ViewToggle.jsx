import React, { memo } from 'react';

export default memo(function ViewToggle({ viewMode, onViewChange }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <button
        type="button"
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-2 px-4 py-2 font-black text-[10px] uppercase tracking-widest rounded-sm border transition-all ${viewMode === 'list'
          ? 'bg-primary/10 border-primary/40 text-primary'
          : 'bg-card-dark border-border-muted text-text-muted hover:text-text-main hover:border-primary/30'
          }`}
      >
        <span className="material-symbols-outlined text-sm">view_list</span>
        Lista
      </button>
      <button
        type="button"
        onClick={() => onViewChange('calendar')}
        className={`flex items-center gap-2 px-4 py-2 font-black text-[10px] uppercase tracking-widest rounded-sm border transition-all ${viewMode === 'calendar'
          ? 'bg-primary/10 border-primary/40 text-primary'
          : 'bg-card-dark border-border-muted text-text-muted hover:text-text-main hover:border-primary/30'
          }`}
      >
        <span className="material-symbols-outlined text-sm">calendar_month</span>
        Calendário
      </button>
    </div>
  );
});
