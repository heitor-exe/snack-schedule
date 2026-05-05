import React, { useState, useEffect, useCallback, memo } from 'react';

// Chave persistente em localStorage.
// Uma vez que o banner aparece, essa chave é setada e o banner não aparece
// novamente até que o usuário limpe o localStorage. Isso evita que o
// onNeedRefresh dispare o banner a cada reload (ex: após clicar "Atualizar Agora").
const SEEN_KEY = 'pwa-update-seen-sw';

function PwaUpdateBanner() {
  const [visible, setVisible] = useState(false);

  // Expõe __showUpdateBanner para main.jsx (registerSW → onNeedRefresh).
  // Só mostra o banner se SEEN_KEY não existe — ou seja, o usuário ainda não
  // viu o banner nesta sessão de instalação.
  useEffect(() => {
    window.__showUpdateBanner = () => {
      const seenVersion = localStorage.getItem(SEEN_KEY);
      if (!seenVersion) {
        setVisible(true);
      }
    };
    return () => {
      window.__showUpdateBanner = null;
    };
  }, []);

  // "Atualizar Agora": recarrega a página com o novo SW.
  // Não limpa SEEN_KEY — o banner não reaparece após o reload.
  const handleUpdate = useCallback(() => {
    if (window.__updateSW) {
      window.__updateSW(true);
    }
  }, []);

  // "Depois": esconde o banner e marca como visto.
  const handleDismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(SEEN_KEY, '1');
  }, []);

  // Assim que o banner aparece, marca como visto em localStorage.
  // Isso impede que onNeedRefresh mostre o banner novamente após o reload.
  useEffect(() => {
    if (visible) {
      localStorage.setItem(SEEN_KEY, '1');
    }
  }, [visible]);

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
