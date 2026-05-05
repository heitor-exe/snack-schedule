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
    // Verifica atualização do SW assim que o app carrega.
    immediate: true,
    // Disposto quando o SW detecta uma nova versão em cache.
    // O banner (PwaUpdateBanner) decide se deve mostrar com base no localStorage.
    onNeedRefresh() {
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

// Register Supabase heartbeat service worker (prevents project hibernation)
if ('serviceWorker' in navigator) {
  const heartbeatConfig = {
    type: 'HEARTBEAT_CONFIG',
    url: import.meta.env.VITE_SUPABASE_URL,
    key: import.meta.env.VITE_SUPABASE_ANON_KEY,
  };
  navigator.serviceWorker
    .register('/supabase-heartbeat.js', { scope: '/' })
    .then((registration) => {
      // Send config once the SW is active (poll briefly for activation)
      if (registration.active) {
        registration.active.postMessage(heartbeatConfig);
      } else {
        const check = setInterval(() => {
          if (registration.active) {
            clearInterval(check);
            registration.active.postMessage(heartbeatConfig);
          }
        }, 100);
        setTimeout(() => clearInterval(check), 5000);
      }
    })
    .catch(() => {});
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App deferredInstallPrompt={deferredInstallPrompt} />
  </StrictMode>,
)
