import React, { useMemo, useState } from 'react';

const parseMembers = (rawValue) =>
  rawValue
    .split('\n')
    .map((name) => name.trim())
    .filter(Boolean);

const AdminConfigModal = ({
  isOpen,
  currentConfig,
  onClose,
  onApply,
  adminPassword,
  isSaving = false,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [localConfig, setLocalConfig] = useState(currentConfig);

  const memberCount = useMemo(
    () => parseMembers(localConfig.membersText ?? '').length,
    [localConfig.membersText]
  );

  if (!isOpen) return null;

  const handleUnlock = (event) => {
    event.preventDefault();
    if (!adminPassword) {
      setError('Defina VITE_ADMIN_PASSWORD no .env para habilitar esta área.');
      return;
    }
    if (passwordInput === adminPassword) {
      setIsUnlocked(true);
      setError('');
      return;
    }
    setError('Senha incorreta. Tente novamente.');
  };

  const handleSubmitConfig = (event) => {
    event.preventDefault();

    const normalizedMembers = parseMembers(localConfig.membersText ?? '');
    if (normalizedMembers.length < 3) {
      setError('Informe pelo menos 3 membros para gerar uma escala válida.');
      return;
    }
    if (!localConfig.startDate || !localConfig.endDate) {
      setError('Preencha data inicial e final da temporada.');
      return;
    }
    if (localConfig.startDate > localConfig.endDate) {
      setError('A data inicial não pode ser maior que a final.');
      return;
    }

    onApply({
      startDate: localConfig.startDate,
      endDate: localConfig.endDate,
      members: normalizedMembers,
      membersText: normalizedMembers.join('\n'),
    });
  };

  return (
    <div className="member-selector-backdrop" role="presentation" onClick={onClose}>
      <div
        className="member-selector-card admin-config-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Configuração administrativa"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="member-selector-header">
          <div>
            <p className="member-eyebrow">Admin da temporada</p>
            <h3>Configurar período e membros</h3>
          </div>
          <button className="member-close" onClick={onClose} type="button">
            Fechar
          </button>
        </header>

        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="admin-config-form">
            <p className="member-selector-subtitle">
              Entre com a senha de administrador para editar a temporada.
            </p>
            <label className="admin-config-label" htmlFor="admin-password">
              Senha
            </label>
            <input
              id="admin-password"
              className="admin-config-input"
              type="password"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
              placeholder="Digite a senha"
              autoComplete="off"
            />
            {error && <p className="admin-config-error">{error}</p>}
            <button className="identity-btn admin-config-submit" type="submit">
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitConfig} className="admin-config-form">
            <p className="member-selector-subtitle">
              Atualize os dados e gere uma nova escala substituindo a temporada atual.
            </p>

            <div className="admin-config-grid">
              <div>
                <label className="admin-config-label" htmlFor="season-start">
                  Início da temporada
                </label>
                <input
                  id="season-start"
                  className="admin-config-input"
                  type="date"
                  value={localConfig.startDate}
                  onChange={(event) =>
                    setLocalConfig((prev) => ({ ...prev, startDate: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="admin-config-label" htmlFor="season-end">
                  Fim da temporada
                </label>
                <input
                  id="season-end"
                  className="admin-config-input"
                  type="date"
                  value={localConfig.endDate}
                  onChange={(event) =>
                    setLocalConfig((prev) => ({ ...prev, endDate: event.target.value }))
                  }
                />
              </div>
            </div>

            <label className="admin-config-label" htmlFor="members-list">
              Membros (1 por linha)
            </label>
            <textarea
              id="members-list"
              className="admin-config-textarea"
              rows={10}
              value={localConfig.membersText}
              onChange={(event) =>
                setLocalConfig((prev) => ({ ...prev, membersText: event.target.value }))
              }
            />

            <p className="admin-config-count">{memberCount} membro(s) válido(s)</p>
            {error && <p className="admin-config-error">{error}</p>}

            <button className="identity-btn admin-config-submit" type="submit" disabled={isSaving}>
              {isSaving ? 'Gerando nova escala...' : 'Salvar e regenerar escala'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminConfigModal;
