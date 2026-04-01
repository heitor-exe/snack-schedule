import React from 'react';

const MemberSelector = ({
  isOpen,
  members = [],
  selectedMember = '',
  onSelect,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-[14px] flex items-center justify-center p-8 z-[1200]" role="presentation" onClick={onClose}>
      <div
        className="bg-bg/95 border border-white/8 rounded-3xl max-w-[640px] w-full p-8 relative shadow-[0_30px_60px_-35px_rgba(0,0,0,0.7)]"
        role="dialog"
        aria-modal="true"
        aria-label="Seleção de membro"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-3">
          <div>
            <p className="uppercase tracking-[0.35em] text-[0.7rem] text-text-secondary m-0">Identificação rápida</p>
            <h3 className="m-0 text-2xl mt-0">Quem é você?</h3>
          </div>
          <button className="bg-transparent border border-white/40 rounded-full text-text-secondary font-semibold px-4 py-1.5 transition-all duration-300 ease-in-out hover:border-accent-primary hover:text-white" onClick={onClose} type="button">
            Cancelar
          </button>
        </header>

        <p className="text-text-secondary my-1 mb-4 mt-0">
          Escolha um nome e o app lembra você. Da próxima vez, tudo já aparece personalizado.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2 max-h-[50vh] overflow-y-auto mb-4 pr-0.5" role="list">
          {members.length === 0 && (
            <p className="text-text-secondary text-[0.9rem] col-span-full text-center">Nenhum membro carregado. Aguarde alguns instantes.</p>
          )}
          {members.map((member) => (
            <button
              key={member}
              type="button"
              className={`
                py-2.5 px-3 rounded-full border text-[0.95rem] font-semibold text-center
                transition-all duration-300 ease-in-out
                ${selectedMember === member
                  ? 'border-transparent text-white bg-gradient-to-br from-accent-primary to-accent-secondary shadow-[0_20px_30px_-12px_rgba(139,92,246,0.8)]'
                  : 'border-white/10 bg-white/3 text-text-secondary hover:border-accent-primary/50 hover:text-white hover:bg-accent-primary/20'
                }
              `}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(member);
              }}
            >
              {member}
            </button>
          ))}
        </div>

        <div className="text-[0.85rem] text-text-secondary border-t border-white/10 pt-3.5">
          <span>Você pode trocar quando quiser usando o botão no topo.</span>
        </div>
      </div>
    </div>
  );
};

export default MemberSelector;
