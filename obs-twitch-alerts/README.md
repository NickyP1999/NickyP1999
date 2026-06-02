# OBS Twitch Alerts

A free, self-hosted alert overlay for **OBS Studio**. Shows animated, sound‑enabled
alerts for **follows, subscriptions, resubs, gifted subs, bits/cheers, raids,
and donations** — no Streamlabs/StreamElements overlay account required (StreamElements
is used only as an optional source for donation/tip events).

Everything runs **client‑side** using Twitch's official
[EventSub WebSocket](https://dev.twitch.tv/docs/eventsub/handling-websocket-events/)
API. There is no server to run.

```
obs-twitch-alerts/
├── index.html        ← the overlay you add to OBS as a Browser Source
├── test.html         ← preview every alert in a browser (no Twitch needed)
├── connect.html      ← one-time Twitch login to get your access token
├── css/style.css
├── js/
│   ├── config.js     ← THE ONLY FILE YOU EDIT
│   ├── alerts.js     ← alert queue + rendering
│   ├── twitch.js     ← Twitch EventSub (follows/subs/bits/raids)
│   ├── streamelements.js ← donations (optional)
│   └── main.js
└── sounds/           ← drop your .mp3 alert sounds here
```

---

## Part A — Try it right now (cloud / any browser)

You don't need OBS or Twitch credentials to preview the look:

1. Open **`test.html`** in a web browser.
2. Click any button (Follow, Sub, Bits, Raid, Donation…) to fire that alert.

That's your "cloud-first" check — tweak colors, messages, and timings in
`js/config.js`, reload `test.html`, repeat until you like it.

> If you've enabled **GitHub Pages** for this repo (recommended, see Part C),
> you can open `https://<your-user>.github.io/<repo>/obs-twitch-alerts/test.html`
> from anywhere.

---

## Part B — Connect it to your real Twitch channel

### Step 1 — Create a Twitch application (one time, ~2 min)
1. Go to <https://dev.twitch.tv/console/apps> → **Register Your Application**.
2. **Name:** anything (e.g. "My OBS Alerts").
3. **OAuth Redirect URLs:** this must match where `connect.html` is opened from.
   Add the ones you'll use:
   - For GitHub Pages: `https://<your-user>.github.io/<repo>/obs-twitch-alerts/connect.html`
   - For local testing: `http://localhost:8000/connect.html`
4. **Category:** Broadcasting Suite. Create it, then **Manage** → copy the **Client ID**.

### Step 2 — Fill in `js/config.js`
```js
twitch: {
  channel:  "your_channel_name",          // your channel, lowercase
  clientId: "your_client_id_from_step_1",
  accessToken: "",                         // leave blank
}
```

### Step 3 — Authorize (get your token)
Open **`connect.html`** (from the same place your overlay will run — GitHub Pages
URL or localhost), click **Connect with Twitch**, approve. Your token is saved in
the browser automatically. Tokens last ~60 days; just re-run `connect.html` when
it expires (the overlay will tell you when it does).

### Step 4 — Donations (optional)
In `js/config.js`:
```js
streamElements: { enabled: true, jwtToken: "your_streamelements_jwt" }
```
Get the JWT from <https://streamelements.com/dashboard/account/channels> ("Show secrets").
Leave `enabled: false` to skip — the donation **test** button still works.

---

## Part C — Host it (recommended: GitHub Pages)

OBS needs a URL (or local file) to load. Hosting on GitHub Pages is easiest and
makes the OAuth redirect reliable:

1. Push this repo to GitHub.
2. Repo **Settings → Pages →** Source: deploy from `main` branch, root folder.
3. Your overlay URL becomes:
   `https://<your-user>.github.io/<repo>/obs-twitch-alerts/index.html`
4. Make sure that exact `connect.html` URL is in your Twitch app's redirect list (Step 1).

*(Alternative: run locally with `python3 -m http.server 8000` inside this folder,
then use `http://localhost:8000/...` everywhere.)*

---

## Part D — Add it to OBS Studio (desktop)

1. In OBS, under **Sources**, click **+ → Browser**.
2. Name it "Twitch Alerts" → OK.
3. **URL:** your `index.html` (the GitHub Pages or localhost URL).
   - Width **1920**, Height **1080** (match your canvas).
4. ✔ Check **"Refresh browser when scene becomes active"** (optional).
5. OK. Position the source on top of your scene.
6. **One-time in OBS:** right-click the source → **Interact** → it will say
   "open connect.html". Easiest path: temporarily set the source URL to your
   `connect.html`, click **Interact**, log in, then switch the URL back to
   `index.html`. This stores the token inside OBS's own browser. *(If you host on
   GitHub Pages and authorized in your normal browser, OBS still needs its own
   authorization because it's a separate browser.)*

### Test the live setup
- The little badge bottom-left of the overlay shows **Twitch: connected ✓** when
  it's working. (Hide it permanently by adding `class="hide-status"` to the
  `<body>` in `index.html`, or just crop it in OBS.)
- Have a friend follow you, or use `test.html` in a second browser source to
  confirm the visuals on stream.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Badge says "no Client ID" | Set `clientId` in `js/config.js`. |
| Badge says "not connected — open connect.html" | Run `connect.html` from the same origin as the overlay. |
| "token expired" | Re-run `connect.html`. Twitch user tokens last ~60 days. |
| OAuth error "redirect mismatch" | The `connect.html` URL must be listed **exactly** in your Twitch app's Redirect URLs. |
| No sound | Add `.mp3` files to `/sounds` (see `sounds/README.txt`); browsers may block audio until you interact with the page once. |
| Donations don't fire | Set `streamElements.enabled: true` and a valid `jwtToken`. |

---

## Customizing

All look-and-feel lives in **`js/config.js`** (durations, colors, messages,
sounds, positions, which alerts are on). Deeper visual changes go in
`css/style.css`. The `{name}` and `{amount}` placeholders in messages are
filled in automatically.
