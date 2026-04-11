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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App deferredInstallPrompt={deferredInstallPrompt} />
  </StrictMode>,
)
