# PWA Support Design — Escala do Lanche

**Date:** 2026-04-02
**Status:** Approved

## Overview

Add Progressive Web App (PWA) support to enable installability and basic offline access (cached app shell). Users can install the app on their device home screen and access previously loaded schedules without internet.

**Scope:** Basic PWA — manifest + service worker that caches build assets. Schedule data shown offline is limited to what was previously loaded and cached by the browser.

## Architecture

### New Files

| File | Purpose |
|---|---|
| `public/icons/icon-192.png` | PWA icon for home screen (192x192) |
| `public/icons/icon-512.png` | PWA icon for splash screen (512x512) |
| `src/components/PwaInstallBanner.jsx` | Custom install prompt banner |

### Modified Files

| File | Change |
|---|---|
| `vite.config.js` | Add `VitePWA` plugin configuration |
| `package.json` | Add `vite-plugin-pwa` dev dependency |
| `src/main.jsx` | Register service worker via `registerSW()` |
| `src/App.jsx` | Conditionally render `PwaInstallBanner` |

## Service Worker Configuration

Using `vite-plugin-pwa` with `generateSW` mode (Workbox):

```js
VitePWA({
  registerType: 'prompt',
  includeAssets: ['icons/*.png'],
  manifest: {
    name: 'Escala do Lanche',
    short_name: 'Escala',
    description: 'Escala semanal de lanche da Celula de Jovens',
    theme_color: '#0A0A0B',
    background_color: '#0A0A0B',
    display: 'standalone',
    icons: [
      { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
    runtimeCaching: [{
      urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
      handler: 'NetworkFirst',
      options: { cacheName: 'supabase-cache', expiration: { maxEntries: 50, maxAgeSeconds: 86400 } },
    }],
  },
  devOptions: { enabled: true, type: 'module' },
})
```

**Caching strategy:**
- **Precache:** All build assets (JS, CSS, HTML, icons, fonts) — hashed filenames auto-invalidate on rebuild
- **Runtime:** Supabase API responses use `NetworkFirst` with 24h cache — serves cached data when offline

## PwaInstallBanner Component

**Behavior:**
- Hidden by default
- Shows after user interaction (member identification or search query)
- Listens for `beforeinstallprompt` event, stores the event object
- "INSTALAR APP" button calls `prompt()` on stored event
- "DEPOIS" dismisses banner, sets `localStorage.pwaDismissed = 'true'`
- Never shows again after install or dismissal
- Does not render at all on iOS (no `beforeinstallprompt` support)

**Styling:** Cyberpunk theme — neon border (`#00FFC2`), dark background (`#161618`), ALL CAPS, `font-black`, sharp corners. Fixed bottom position on mobile, centered on desktop.

**Props:** None. Self-contained with internal state.

## Data Flow

```
Build → vite-plugin-pwa generates manifest.webmanifest + sw.js
First Visit → SW installs, precaches all build assets
User Interaction → PwaInstallBanner appears (if not dismissed/installed)
User clicks Install → beforeinstallprompt.prompt() → native dialog
User installs → banner unmounts, SW active
Offline → SW serves cached assets, app loads with cached data
```

## Error Handling

| Scenario | Behavior |
|---|---|
| `beforeinstallprompt` never fires | Banner component returns null, never renders |
| Service worker registration fails | Silent `console.error`, app functions normally |
| Cache storage full | Browser evicts oldest entries, app continues |
| Offline with no cached data | Loading state shows, no schedules available (expected) |

## Testing

- **Dev:** `npm run dev` — PWA plugin active via `devOptions`
- **Build preview:** `npm run build && npm run preview` — full PWA behavior
- **Chrome DevTools → Application tab:** Verify manifest, service worker status, cache contents
- **Lighthouse:** PWA audit should pass (manifest, SW, installable)
- **Offline simulation:** DevTools → Network → Offline, reload page

## Implementation Order

1. Install `vite-plugin-pwa`
2. Configure `vite.config.js` with PWA plugin
3. Create `public/icons/` with generated PWA icons
4. Register service worker in `src/main.jsx`
5. Create `src/components/PwaInstallBanner.jsx`
6. Integrate banner into `src/App.jsx`
7. Build and verify with `npm run preview`
