import React from 'react';

export default function AppHeader({
  selectedMember,
  identityRoleLabel,
  onOpenSelector,
  onOpenAdmin,
  onClearSelection,
}) {
  return (
    <header className="mb-12 flex justify-between items-end gap-6 flex-wrap">
      <div className="flex-1 min-w-[240px]">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent mb-2">
          Escala do Lanche
        </h1>
        <p className="text-text-secondary text-xl">Célula de Jovens - Sexta-feira</p>
      </div>
      <div className="bg-white/3 border border-white/10 rounded-2xl px-5 py-4 min-w-[240px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] flex flex-col gap-1.5">
        <div>
          <p className="m-0 text-base font-bold">
            {selectedMember ? `Você é ${selectedMember}` : 'Identifique-se na escala'}
          </p>
          <p className="m-0 text-[0.85rem] text-text-secondary">
            {selectedMember
              ? identityRoleLabel
                ? `Função da semana: ${identityRoleLabel}`
                : 'Sem escala ativa esta semana'
              : 'Selecione seu nome para destaques imediatos'}
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap mt-1.5">
          <button
            className="py-2 px-4.5 rounded-full border-none cursor-pointer font-semibold bg-gradient-to-br from-accent-primary to-accent-secondary text-white shadow-[0_15px_40px_-20px_rgba(139,92,246,0.8)] transition-all duration-300 ease-in-out hover:-translate-y-px hover:shadow-[0_18px_45px_-20px_rgba(236,72,153,0.8)]"
            type="button"
            onClick={onOpenSelector}
          >
            {selectedMember ? 'Trocar pessoa' : 'Identificar meu nome'}
          </button>
          <button
            className="py-2 px-4.5 rounded-full border border-white/18 bg-white/8 shadow-none font-semibold text-white transition-all duration-300 ease-in-out hover:shadow-[0_10px_26px_-16px_rgba(139,92,246,0.9)]"
            type="button"
            onClick={onOpenAdmin}
          >
            Configurar temporada
          </button>
          {selectedMember && (
            <button
              className="bg-transparent border-none text-text-secondary text-[0.85rem] cursor-pointer p-0 underline hover:text-white"
              type="button"
              onClick={onClearSelection}
            >
              Limpar identificação
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
