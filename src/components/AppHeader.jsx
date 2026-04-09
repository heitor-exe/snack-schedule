import React, { memo } from 'react';

export default memo(function AppHeader({
  searchQuery,
  onSearchChange,
  resultCount,
  onOpenSelector,
  onOpenAdmin,
  selectedMember,
  onClearSelection,
}) {
  const isActive = searchQuery.trim().length > 0;

  return (
    <header className="sticky top-0 z-50 w-full bg-background-dark border-b border-border-muted px-3 py-3 sm:px-6 sm:py-4">
      <div className="max-w-7xl mx-auto space-y-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="bg-primary/10 p-1.5 sm:p-2 border border-primary/30 text-primary">
              <span className="material-symbols-outlined block text-xl sm:text-2xl">fastfood</span>
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-bold tracking-tight uppercase">Escala do Lanche</h1>
              <p className="text-[8px] sm:text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] hidden sm:block">• Célula de Jovens</p>
            </div>
          </div>

          <div className="hidden md:flex flex-1 justify-center max-w-md mx-4">
            <div className="relative w-full">
              <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl transition-all ${isActive ? 'text-primary' : 'text-text-muted'}`}>search</span>
              <input
                className="w-full bg-card-dark border border-border-muted py-2 pl-10 pr-10 text-sm focus:border-primary outline-none transition-all placeholder:text-text-muted/50"
                placeholder="LOCALIZAR VOLUNTÁRIO..."
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {isActive && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/5 border border-border-muted text-text-muted text-[0.7rem] cursor-pointer px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-widest hover:text-primary hover:border-primary/30 transition-all"
                  onClick={() => onSearchChange('')}
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {selectedMember && (
              <button
                className="text-text-muted hover:text-primary text-[8px] sm:text-[10px] font-bold uppercase tracking-widest transition-colors truncate max-w-[80px] sm:max-w-none"
                onClick={onClearSelection}
                type="button"
              >
                {selectedMember}
              </button>
            )}
            <button
              className="bg-transparent border border-border-muted text-text-muted font-bold px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all whitespace-nowrap"
              onClick={onOpenSelector}
              type="button"
            >
              {selectedMember ? 'Trocar' : 'Identificar'}
            </button>
            <button
              className="bg-transparent border border-border-muted text-text-muted font-bold px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all whitespace-nowrap"
              onClick={onOpenAdmin}
              type="button"
            >
              Admin
            </button>
            <div className="text-right hidden lg:block">
              <p className="text-[10px] text-text-muted font-bold uppercase">Status</p>
              <p className="text-[10px] text-primary font-bold uppercase">Online&nbsp;</p>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="relative w-full">
            <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-xl transition-all ${isActive ? 'text-primary' : 'text-text-muted'}`}>search</span>
            <input
              className="w-full bg-card-dark border border-border-muted py-2.5 pl-10 pr-10 text-sm focus:border-primary outline-none transition-all placeholder:text-text-muted/50"
              placeholder="LOCALIZAR VOLUNTÁRIO..."
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            {isActive && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/5 border border-border-muted text-text-muted text-[0.7rem] cursor-pointer px-1.5 py-0.5 rounded-sm uppercase font-bold tracking-widest hover:text-primary hover:border-primary/30 transition-all"
                onClick={() => onSearchChange('')}
                type="button"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {isActive && resultCount !== null && (
        <div className="max-w-7xl mx-auto mt-2">
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
            {resultCount === 0
              ? 'NENHUMA ESCALA ENCONTRADA.'
              : `${resultCount} ESCALA${resultCount !== 1 ? 'S' : ''} ENCONTRADA${resultCount !== 1 ? 'S' : ''}`}
          </p>
        </div>
      )}
    </header>
  );
});
