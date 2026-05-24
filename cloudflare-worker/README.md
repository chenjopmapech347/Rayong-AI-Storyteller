# Cloudflare Worker — Claude API Proxy

Tiny edge proxy that forwards requests from your browser to `api.anthropic.com` and adds the right CORS headers, so the Eco Pilot app can call Claude without running into the browser's same-origin policy.

## Why

Browsers usually block direct calls to `api.anthropic.com`. This proxy:
- Adds the CORS headers so your app on `localhost:5173` (or `*.web.app`) can call it.
- Keeps your Claude API key on the server (the browser never sees it).

Free tier: **100,000 requests/day** — way more than a classroom needs.

## Deploy in 5 minutes

1. Go to <https://dash.cloudflare.com/> and sign up (no credit card needed).
2. Left menu → **Workers & Pages** → **Create** → **Workers** → **Create Worker**.
3. Give it a name like `eco-claude-proxy` → **Deploy**.
4. Click **Edit Code**. Delete everything in the editor.
5. Open `claude-proxy.js` from this folder, copy the entire contents, and paste it into the Worker editor.
6. Click **Save and Deploy**.
7. In the Worker page → **Settings** → **Variables and Secrets** → **+ Add**:
   - Type: **Secret**
   - Variable name: `ANTHROPIC_API_KEY`
   - Value: your real Claude key from <https://console.anthropic.com/>
   - Click **Save**
8. *(Optional but recommended for production)* Add another **Secret**:
   - Variable name: `ALLOWED_ORIGIN`
   - Value: your deployed app URL, e.g. `https://ai-storyteller-9dc3a.web.app`
   - Without this, CORS is open (`*`) — fine for development.
9. Back in the Worker page → **Overview** → copy the URL (looks like `https://eco-claude-proxy.your-name.workers.dev`).

## Wire it into the app

1. Log into the Eco Pilot app as **admin**.
2. Go to **Admin Panel → Settings → AI Assessment**.
3. **Claude API Key** field — leave blank (or put `via-proxy`). The key now lives in the Worker, not in the browser.
4. **Proxy URL** field — paste the Worker URL you just copied.
5. Click **Save AI Config**.

Now in **Pitching Evaluator** → pick a team → click **🤖 AI Assess**. The request goes:

```
browser  →  Cloudflare Worker  →  api.anthropic.com
              (adds key)              (returns scores)
              (adds CORS)
```

## Test the worker directly

```bash
curl -X POST https://eco-claude-proxy.your-name.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 64,
    "messages": [{ "role": "user", "content": "Say hello in Thai." }]
  }'
```

Should return JSON with the `content` array. If you get `error: ANTHROPIC_API_KEY missing`, set the secret in step 7.

## Updating the API key later

Cloudflare → Workers & Pages → your worker → Settings → Variables and Secrets → click the eye/edit icon next to `ANTHROPIC_API_KEY` → enter the new value → Save. No redeploy needed.

## Locking down CORS for production

Set the `ALLOWED_ORIGIN` secret to your specific domain (e.g. `https://ai-storyteller-9dc3a.web.app`). Anyone trying to call your worker from a different origin will be rejected by their own browser. You can list multiple origins by extending the worker code if needed.

## Files

- `claude-proxy.js` — the worker code (paste into Cloudflare editor).
- `README.md` — this file.

No `package.json`, no build step — it's a single file that runs at the edge.
