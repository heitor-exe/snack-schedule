import React, { useState, useEffect, useCallback, memo } from 'react';

function PwaUpdateBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Registra o callback global que o service worker chama
    window.__showUpdateBanner = () => setVisible(true);
    return () => {
      window.__showUpdateBanner = null;
    };
  }, []);

  const handleUpdate = useCallback(() => {
    if (window.__updateSW) {
      window.__updateSW(true); // true = skipWaiting, força reload imediato
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 max-w-sm"
      role="dialog"
      aria-label="Atualização disponível"
    >
      <div
        className="flex flex-col gap-3 rounded-none border-2 border-[#00FFC2] bg-[#161618] p-4 font-black uppercase tracking-widest"
        style={{ boxShadow: '0 0 12px rgba(0,255,194,0.3)' }}
      >
        <p className="text-sm text-[#00FFC2]">
          Nova versão disponível
        </p>
        <p className="text-xs text-[#A1A1AA] normal-case tracking-normal">
          Atualize para ter a melhor experiência
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleUpdate}
            className="flex-1 rounded-none bg-[#00FFC2] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#0A0A0B] transition hover:bg-[#00FFC2]/80"
          >
            Atualizar Agora
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-none border border-[#2A2A2E] bg-transparent px-4 py-2 text-xs font-black uppercase tracking-widest text-[#A1A1AA] transition hover:border-[#00FFC2]/40 hover:text-[#00FFC2]"
          >
            Depois
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PwaUpdateBanner);
