import React from 'react';

export default function AppFooter({ year = 2026 }) {
  return (
    <footer className="mt-auto py-8 bg-background-dark border-t border-border-muted">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-8 order-2 md:order-1">
          <a href="#" className="text-text-muted hover:text-primary text-[10px] font-black uppercase tracking-widest transition-colors">Diretrizes</a>
          <a href="#" className="text-text-muted hover:text-primary text-[10px] font-black uppercase tracking-widest transition-colors">Suporte</a>
          <a href="#" className="text-text-muted hover:text-primary text-[10px] font-black uppercase tracking-widest transition-colors">FAQ</a>
        </div>
        <div className="flex flex-col items-center md:items-end order-1 md:order-2 gap-2">
          <p className="text-text-muted text-[10px] font-bold uppercase tracking-widest">© {year} • Heitor Macedo</p>
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-card-dark border border-border-muted flex items-center justify-center hover:border-primary hover:text-primary transition-all cursor-pointer">
              <span className="material-symbols-outlined text-sm">language</span>
            </div>
            <div className="w-8 h-8 bg-card-dark border border-border-muted flex items-center justify-center hover:border-primary hover:text-primary transition-all cursor-pointer">
              <span className="material-symbols-outlined text-sm">share</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
