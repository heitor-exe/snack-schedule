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
        navigator.serviceWorker.getRegistration('/').then((reg) => {
          const swUrl = reg?.active?.scriptUrl;
          if (swUrl) {
            fetch(swUrl, { cache: 'no-store' }).then((r) => {
              const version = r.headers.get('etag') || r.headers.get('last-modified') || swUrl;
              window.__showUpdateBanner(version);
            });
          } else {
            window.__showUpdateBanner(Date.now().toString());
          }
        });
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
