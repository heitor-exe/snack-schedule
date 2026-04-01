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
        className="bg-card-dark border border-border-muted max-w-[640px] w-full p-8 relative shadow-[0_30px_60px_-35px_rgba(0,0,0,0.7)]"
        role="dialog"
        aria-modal="true"
        aria-label="Seleção de membro"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-3">
          <div>
            <p className="uppercase tracking-[0.35em] text-[10px] text-text-muted font-bold m-0">Identificação Rápida</p>
            <h3 className="m-0 text-2xl mt-0 uppercase font-black tracking-tighter">Quem É Você?</h3>
          </div>
          <button className="bg-transparent border border-border-muted text-text-muted font-bold px-4 py-1.5 text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all" onClick={onClose} type="button">
            Cancelar
          </button>
        </header>

        <p className="text-text-muted text-sm mb-4 mt-0">
          Escolha um nome e o app lembra você. Da próxima vez, tudo já aparece personalizado.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2 max-h-[50vh] overflow-y-auto mb-4" role="list">
          {members.length === 0 && (
            <p className="text-text-muted text-sm col-span-full text-center uppercase tracking-widest font-bold">Nenhum membro carregado. Aguarde.</p>
          )}
          {members.map((member) => (
            <button
              key={member}
              type="button"
              className={`
                py-2.5 px-3 border text-sm font-bold uppercase tracking-wider text-center
                transition-all
                ${selectedMember === member
                  ? 'border-primary bg-primary text-background-dark font-black shadow-[0_0_15px_rgba(0,255,194,0.3)]'
                  : 'border-border-muted bg-card-dark text-text-muted hover:border-primary/50 hover:text-primary'
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

        <div className="text-[10px] text-text-muted uppercase tracking-widest font-bold border-t border-border-muted pt-3.5">
          <span>Você pode trocar quando quiser usando o botão no topo.</span>
        </div>
      </div>
    </div>
  );
};

export default MemberSelector;
