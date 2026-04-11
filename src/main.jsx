import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

let deferredInstallPrompt = null;
if ('beforeinstallprompt' in window) {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
  });
}

let updateSWFn = null;
if ('serviceWorker' in navigator) {
  updateSWFn = registerSW({
    immediate: true, // Verifica atualização imediatamente ao registrar
    onNeedRefresh() {
      // Mostra banner de atualização para o usuário
      if (window.__showUpdateBanner) {
        window.__showUpdateBanner();
      }
    },
    onOfflineReady() {
      console.log('App disponivel para uso offline.')
    },
  })
}

// Expõe a função de atualização globalmente para o App
window.__updateSW = updateSWFn;

// Verifica atualização sempre que o app voltar ao foco (abrir, trocar de aba, etc.)
if ('serviceWorker' in navigator && 'addEventListener' in window) {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && updateSWFn) {
      updateSWFn(true); // true = skipWaiting, força verificação
    }
  });
}

// Verificação periódica a cada 5 minutos para quem deixa o app aberto
if (updateSWFn) {
  setInterval(() => {
    updateSWFn(true);
  }, 5 * 60 * 1000); // 5 minutos
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App deferredInstallPrompt={deferredInstallPrompt} />
  </StrictMode>,
)
