import React from 'react';
import './MemberSelector.css';

const MemberSelector = ({
  isOpen,
  members = [],
  selectedMember = '',
  onSelect,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="member-selector-backdrop" role="presentation" onClick={onClose}>
      <div
        className="member-selector-card"
        role="dialog"
        aria-modal="true"
        aria-label="Seleção de membro"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="member-selector-header">
          <div>
            <p className="member-eyebrow">Identificação rápida</p>
            <h3>Quem é você?</h3>
          </div>
          <button className="member-close" onClick={onClose} type="button">
            Cancelar
          </button>
        </header>

        <p className="member-selector-subtitle">
          Escolha um nome e o app lembra você. Da próxima vez, tudo já aparece personalizado.
        </p>

        <div className="member-list" role="list">
          {members.length === 0 && (
            <p className="member-empty">Nenhum membro carregado. Aguarde alguns instantes.</p>
          )}
          {members.map((member) => (
            <button
              key={member}
              type="button"
              className={`member-pill${selectedMember === member ? ' member-pill--selected' : ''}`}
              onClick={(event) => {
                event.stopPropagation();
                onSelect(member);
              }}
            >
              {member}
            </button>
          ))}
        </div>

        <div className="member-selector-footer">
          <span>Você pode trocar quando quiser usando o botão no topo.</span>
        </div>
      </div>
    </div>
  );
};

export default MemberSelector;
