import React, { useState, useEffect, useCallback, useRef, memo } from 'react';

function isIOS() {
  if (typeof window === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function isStandalone() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
}

function PwaInstallBanner({ deferredInstallPrompt: initialPrompt }) {
  const [visible, setVisible] = useState(() => !isStandalone() && isIOS());
  const deferredPrompt = useRef(initialPrompt || null);

  useEffect(() => {
    if (isStandalone()) return;
    if (isIOS()) return;

    const handler = (e) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  useEffect(() => {
    const onInstalled = () => setVisible(false);
    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt.current) return;
    deferredPrompt.current.prompt();
    const { outcome } = await deferredPrompt.current.userChoice;
    if (outcome === 'accepted') {
      setVisible(false);
    }
    deferredPrompt.current = null;
  }, []);

  const handleDismiss = useCallback(() => {
    setVisible(false);
  }, []);

  if (!visible) return null;

  if (isIOS()) {
    return (
      <div
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 max-w-sm"
        role="dialog"
        aria-label="Instalar aplicativo"
      >
        <div
          className="flex flex-col gap-3 rounded-none border-2 border-[#00FFC2] bg-[#161618] p-4 font-black uppercase tracking-widest"
          style={{ boxShadow: '0 0 12px rgba(0,255,194,0.3)' }}
        >
          <p className="text-sm text-[#00FFC2]">
            Instale o app para acesso offline
          </p>
          <p className="text-xs text-[#A1A1AA] normal-case tracking-normal">
            Toque em <span className="text-[#00FFC2]">Compartilhar</span> → <span className="text-[#00FFC2]">Adicionar à Tela de Início</span>
          </p>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-none border border-[#2A2A2E] bg-transparent px-4 py-2 text-xs font-black uppercase tracking-widest text-[#A1A1AA] transition hover:border-[#00FFC2]/40 hover:text-[#00FFC2]"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 max-w-sm"
      role="dialog"
      aria-label="Instalar aplicativo"
    >
      <div
        className="flex flex-col gap-3 rounded-none border-2 border-[#00FFC2] bg-[#161618] p-4 font-black uppercase tracking-widest"
        style={{ boxShadow: '0 0 12px rgba(0,255,194,0.3)' }}
      >
        <p className="text-sm text-[#00FFC2]">
          Instale o app para acesso offline
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleInstall}
            className="flex-1 rounded-none bg-[#00FFC2] px-4 py-2 text-xs font-black uppercase tracking-widest text-[#0A0A0B] transition hover:bg-[#00FFC2]/80"
          >
            Instalar App
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

export default memo(PwaInstallBanner);
