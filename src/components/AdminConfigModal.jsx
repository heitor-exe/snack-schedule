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
    <div className="fixed inset-0 bg-black/85 backdrop-blur-[14px] flex items-center justify-center p-8 z-[1200]" role="presentation" onClick={onClose}>
      <div
        className="bg-bg/95 border border-white/8 rounded-3xl max-w-[640px] w-full p-8 relative shadow-[0_30px_60px_-35px_rgba(0,0,0,0.7)]"
        role="dialog"
        aria-modal="true"
        aria-label="Configuração administrativa"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex justify-between items-center mb-3">
          <div>
            <p className="uppercase tracking-[0.35em] text-[0.7rem] text-text-secondary m-0">Admin da temporada</p>
            <h3 className="m-0 text-2xl mt-0">Configurar período e membros</h3>
          </div>
          <button className="bg-transparent border border-white/40 rounded-full text-text-secondary font-semibold px-4 py-1.5 transition-all duration-300 ease-in-out hover:border-accent-primary hover:text-white" onClick={onClose} type="button">
            Fechar
          </button>
        </header>

        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="flex flex-col gap-3.5">
            <p className="text-text-secondary my-1 mb-0 mt-0">
              Entre com a senha de administrador para editar a temporada.
            </p>
            <label className="block text-[0.85rem] text-text-secondary mb-1.5" htmlFor="admin-password">
              Senha
            </label>
            <input
              id="admin-password"
              className="w-full bg-white/4 border border-white/14 rounded-xl text-text-primary py-2.5 px-3 text-[0.95rem] font-body focus:outline-2 focus:outline-accent-primary/50 focus:outline-offset-1"
              type="password"
              value={passwordInput}
              onChange={(event) => setPasswordInput(event.target.value)}
              placeholder="Digite a senha"
              autoComplete="off"
            />
            {error && <p className="m-0 text-[#fca5a5] text-[0.9rem]">{error}</p>}
            <button className="self-start py-2.5 px-4 rounded-full border-none cursor-pointer font-semibold bg-gradient-to-br from-accent-primary to-accent-secondary text-white shadow-[0_15px_40px_-20px_rgba(139,92,246,0.8)] transition-all duration-300 ease-in-out hover:-translate-y-px hover:shadow-[0_18px_45px_-20px_rgba(236,72,153,0.8)]" type="submit">
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmitConfig} className="flex flex-col gap-3.5">
            <p className="text-text-secondary my-1 mb-0 mt-0">
              Atualize os dados e gere uma nova escala substituindo a temporada atual.
            </p>

            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-1">
              <div>
                <label className="block text-[0.85rem] text-text-secondary mb-1.5" htmlFor="season-start">
                  Início da temporada
                </label>
                <input
                  id="season-start"
                  className="w-full bg-white/4 border border-white/14 rounded-xl text-text-primary py-2.5 px-3 text-[0.95rem] font-body focus:outline-2 focus:outline-accent-primary/50 focus:outline-offset-1"
                  type="date"
                  value={localConfig.startDate}
                  onChange={(event) =>
                    setLocalConfig((prev) => ({ ...prev, startDate: event.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-[0.85rem] text-text-secondary mb-1.5" htmlFor="season-end">
                  Fim da temporada
                </label>
                <input
                  id="season-end"
                  className="w-full bg-white/4 border border-white/14 rounded-xl text-text-primary py-2.5 px-3 text-[0.95rem] font-body focus:outline-2 focus:outline-accent-primary/50 focus:outline-offset-1"
                  type="date"
                  value={localConfig.endDate}
                  onChange={(event) =>
                    setLocalConfig((prev) => ({ ...prev, endDate: event.target.value }))
                  }
                />
              </div>
            </div>

            <label className="block text-[0.85rem] text-text-secondary mb-1.5" htmlFor="members-list">
              Membros (1 por linha)
            </label>
            <textarea
              id="members-list"
              className="w-full bg-white/4 border border-white/14 rounded-xl text-text-primary py-2.5 px-3 text-[0.95rem] font-body resize-y min-h-[220px] focus:outline-2 focus:outline-accent-primary/50 focus:outline-offset-1"
              rows={10}
              value={localConfig.membersText}
              onChange={(event) =>
                setLocalConfig((prev) => ({ ...prev, membersText: event.target.value }))
              }
            />

            <p className="m-0 text-text-secondary text-[0.85rem]">{memberCount} membro(s) válido(s)</p>
            {error && <p className="m-0 text-[#fca5a5] text-[0.9rem]">{error}</p>}

            <button className="self-start py-2.5 px-4 rounded-full border-none cursor-pointer font-semibold bg-gradient-to-br from-accent-primary to-accent-secondary text-white shadow-[0_15px_40px_-20px_rgba(139,92,246,0.8)] transition-all duration-300 ease-in-out hover:-translate-y-px hover:shadow-[0_18px_45px_-20px_rgba(236,72,153,0.8)] disabled:opacity-75 disabled:cursor-wait" type="submit" disabled={isSaving}>
              {isSaving ? 'Gerando nova escala...' : 'Salvar e regenerar escala'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminConfigModal;
