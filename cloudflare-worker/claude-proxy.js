// cloudflare-worker/claude-proxy.js
// ─────────────────────────────────────────────────────────────────────
// CORS proxy for the Anthropic Claude API.
// Deploy this as a Cloudflare Worker, then put the worker URL into the
// "Proxy URL" field of the Eco Pilot Admin → Settings → AI Assessment.
//
// Why: Direct browser calls to api.anthropic.com may be blocked by CORS
// in some regions / browsers. Routing through a tiny edge proxy fixes
// that AND keeps your API key server-side (the worker has the key, the
// browser never sees it).
//
// Setup checklist:
//   1. Cloudflare → Workers & Pages → Create → Workers → name it
//   2. Replace the default code with the contents of THIS file
//   3. Settings → Variables and Secrets → Add:
//        Type:  Secret
//        Name:  ANTHROPIC_API_KEY
//        Value: sk-ant-...        (your real key from console.anthropic.com)
//   4. (Optional) Add a Secret called ALLOWED_ORIGIN to lock CORS to a
//      specific domain instead of "*" — recommended for production.
//        Value: https://your-app.web.app
//   5. Deploy. Copy the worker URL (e.g. https://eco-claude-proxy.<you>.workers.dev)
//   6. Paste it into the app: Admin → Settings → AI Assessment → Proxy URL
//
// Free tier: 100,000 requests/day — plenty for a classroom.
// ─────────────────────────────────────────────────────────────────────

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    const cors = {
      'Access-Control-Allow-Origin':  allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age':       '86400',
      'Vary':                         'Origin'
    };

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Only POST is supported' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...cors }
      });
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({
        error: 'Worker is missing ANTHROPIC_API_KEY secret. See setup checklist in claude-proxy.js'
      }), { status: 500, headers: { 'Content-Type': 'application/json', ...cors } });
    }

    try {
      // Forward the JSON body untouched. The worker injects the API key
      // server-side so the browser never has to know it.
      const body = await request.text();

      const upstream = await fetch(ANTHROPIC_URL, {
        method:  'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body
      });

      const text = await upstream.text();
      return new Response(text, {
        status:  upstream.status,
        headers: {
          'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
          ...cors
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Proxy error: ' + err.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...cors }
      });
    }
  }
};
