/* supabase-heartbeat.js — Prevents Supabase project hibernation */
const INTERVAL_MS = 20 * 60 * 1000; // 20 minutes

let supabaseUrl = '';
let supabaseKey = '';
let started = false;

self.addEventListener('message', (event) => {
  if (event.data.type === 'HEARTBEAT_CONFIG') {
    supabaseUrl = event.data.url;
    supabaseKey = event.data.key;
    if (!started) {
      started = true;
      ping();
      setInterval(ping, INTERVAL_MS);
    }
  }
});

function ping() {
  if (!supabaseUrl) return;
  fetch(supabaseUrl + 'rest/v1/heartbeat', {
    method: 'HEAD',
    headers: { apikey: supabaseKey },
  }).catch(() => {});
}
