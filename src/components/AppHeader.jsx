import React from 'react';

export default function AppHeader({
  selectedMember,
  identityRoleLabel,
  onOpenSelector,
  onOpenAdmin,
  onClearSelection,
}) {
  return (
    <header className="header">
      <div className="header-title">
        <h1 className="title">Escala do Lanche</h1>
        <p className="subtitle">Célula de Jovens - Sexta-feira</p>
      </div>
      <div className="identity-panel">
        <div>
          <p className="identity-title">
            {selectedMember ? `Você é ${selectedMember}` : 'Identifique-se na escala'}
          </p>
          <p className="identity-subtitle">
            {selectedMember
              ? identityRoleLabel
                ? `Função da semana: ${identityRoleLabel}`
                : 'Sem escala ativa esta semana'
              : 'Selecione seu nome para destaques imediatos'}
          </p>
        </div>
        <div className="identity-actions">
          <button
            className="identity-btn"
            type="button"
            onClick={onOpenSelector}
          >
            {selectedMember ? 'Trocar pessoa' : 'Identificar meu nome'}
          </button>
          <button
            className="identity-btn identity-btn--outline"
            type="button"
            onClick={onOpenAdmin}
          >
            Configurar temporada
          </button>
          {selectedMember && (
            <button
              className="identity-link"
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
