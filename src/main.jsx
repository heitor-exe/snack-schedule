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

if ('serviceWorker' in navigator) {
  registerSW({
    onNeedRefresh() {
      console.log('Nova versao disponivel. Recarregue para atualizar.')
    },
    onOfflineReady() {
      console.log('App disponivel para uso offline.')
    },
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App deferredInstallPrompt={deferredInstallPrompt} />
  </StrictMode>,
)
