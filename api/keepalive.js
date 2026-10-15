// Vercel Cron target (see vercel.json). Runs a real query so the free-tier
// Supabase project never reaches the 7-day inactivity limit that pauses it.

const supabaseUrl = process.env.VITE_SUPABASE_URL?.replace(/\/+$/, '');
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  // Vercel sends this header on cron invocations when CRON_SECRET is set.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return res.status(500).json({ ok: false, error: 'missing Supabase env vars' });
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/schedules?select=id&limit=1`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Supabase keep-alive failed:', response.status, body);
      return res.status(502).json({ ok: false, status: response.status });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Supabase keep-alive error:', error);
    return res.status(502).json({ ok: false, error: error.message });
  }
}
