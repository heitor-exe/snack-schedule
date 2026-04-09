import React, { useMemo, useState, useCallback, memo } from 'react';

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

  // Modal is conditionally mounted in App.jsx (adminOpen && ...),
  // so state is always fresh on open. Reset on close for safety.
  const handleClose = useCallback(() => {
    setPasswordInput('');
    setIsUnlocked(false);
    setError('');
    onClose();
  }, [onClose]);

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
    <div className="fixed inset-0 bg-black/85 backdrop-blur-[14px] flex items-center justify-center p-8 z-[1200]" role="presentation" onClick={handleClose}>
      <div
        className="bg-card-dark border border-border-muted max-w-[640px] w-full p-8 relative shadow-[0_30px_60px_-35px_rgba(0,0,0,0.7)]"
        role="dialog"
        aria-modal="true"
        aria-label="Configuração administrativa"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-3">
          <div>
            <p className="uppercase tracking-[0.35em] text-[10px] text-text-muted font-bold m-0">Admin da Temporada</p>
            <h3 className="m-0 text-2xl mt-0 uppercase font-black tracking-tighter">Configurar Período e Membros</h3>
          </div>
          <button className="bg-transparent border border-border-muted text-text-muted font-bold px-4 py-1.5 text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all" onClick={handleClose} type="button">
            Fechar
          </button>
        </header>

        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="flex flex-col gap-4">
            <p className="text-text-muted text-sm">
              Entre com a senha de administrador para editar a temporada.
            </p>
            <div>
              <label className="block text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1.5" htmlFor="admin-password">
                Senha
              </label>
              <input
                id="admin-password"
                className="w-full bg-card-dark border border-border-muted text-text-main py-2.5 px-3 text-sm font-body focus:outline-none focus:border-primary transition-all"
                type="password"
                value={passwordInput}
                onChange={(event) => setPasswordInput(event.target.value)}
                placeholder="DIGITE A SENHA"
                autoComplete="off"
              />
            </div>
            {error && <p className="m-0 text-red-400 text-sm font-bold uppercase tracking-wider">{error}</p>}
            <button className="self-start bg-primary text-background-dark px-4 py-2 font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all neon-glow" type="submit">
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitConfig} className="flex flex-col gap-4">
            <p className="text-text-muted text-sm">
              Atualize os dados e gere uma nova escala substituindo a temporada atual.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1.5" htmlFor="season-start">
                  Início da Temporada
                </label>
                <input
                  id="season-start"
                  className="w-full bg-card-dark border border-border-muted text-text-main py-2.5 px-3 text-sm font-body focus:outline-none focus:border-primary transition-all"
                  type="date"
                  value={localConfig.startDate}
                  onChange={(event) =>
                    setLocalConfig((prev) => ({ ...prev, startDate: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1.5" htmlFor="season-end">
                  Fim da Temporada
                </label>
                <input
                  id="season-end"
                  className="w-full bg-card-dark border border-border-muted text-text-main py-2.5 px-3 text-sm font-body focus:outline-none focus:border-primary transition-all"
                  type="date"
                  value={localConfig.endDate}
                  onChange={(event) =>
                    setLocalConfig((prev) => ({ ...prev, endDate: event.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-text-muted uppercase tracking-widest font-bold mb-1.5" htmlFor="members-list">
                Membros (1 por Linha)
              </label>
              <textarea
                id="members-list"
                className="w-full bg-card-dark border border-border-muted text-text-main py-2.5 px-3 text-sm font-body resize-y min-h-[220px] focus:outline-none focus:border-primary transition-all"
                rows={10}
                value={localConfig.membersText}
                onChange={(event) =>
                  setLocalConfig((prev) => ({ ...prev, membersText: event.target.value }))
                }
              />
            </div>

            <p className="m-0 text-text-muted text-[10px] uppercase tracking-widest font-bold">{memberCount} membro(s) válido(s)</p>
            {error && <p className="m-0 text-red-400 text-sm font-bold uppercase tracking-wider">{error}</p>}

            <button className="self-start bg-primary text-background-dark px-4 py-2 font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all neon-glow disabled:opacity-50 disabled:cursor-wait" type="submit" disabled={isSaving}>
              {isSaving ? 'GERANDO NOVA ESCALA...' : 'SALVAR E REGERAR ESCALA'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default memo(AdminConfigModal);
