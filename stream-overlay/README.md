# NC Stream Overlay

A sleek overlay matched to your **NC** logo (black / white / red diamond ◆),
**tailored for Valorant at 2560×1440 (16:9)**. One transparent browser source
that sits in Valorant's HUD dead zones so it never covers gameplay info:

- **Handcam** — framed 16:9 box, **left edge below the minimap**
- **Keyboard** — framed box for your keyboard overlay, **left, under the handcam**
- **NC logo** — **right edge, below the kill feed**
- **Spotify "Now Playing"** — album art, track, artist, progress — **right, under the logo**

**Valorant HUD it stays clear of:** minimap (top-left), round timer/score
(top-center), kill feed (top-right), HP & shields (bottom-left), abilities
(bottom-center), ammo/weapon (bottom-right), and the crosshair.

It pairs with the alerts in `../obs-twitch-alerts`. Same fonts and accent, so the
whole layout reads as one kit.

```
stream-overlay/
├── overlay.html          ← add this to OBS as a Browser Source (1920×1080)
├── spotify-connect.html  ← one-time Spotify login
├── css/overlay.css
├── js/
│   ├── overlay-config.js ← THE ONLY FILE YOU EDIT (accent, labels, Spotify ID)
│   └── spotify.js
├── assets/logo.png       ← your logo, background removed
└── fonts/
```

---

## 1) Add it to OBS

1. **Sources → + → Browser**, name it `NC Overlay`.
2. URL = your hosted `overlay.html` (see Hosting below), or the local file.
3. Width **2560**, Height **1440** (match your Valorant resolution). OK.
4. Keep this source **above** your game capture, webcam, and keyboard overlay.

### Fit your cam + keyboard into the frames
The frames are just borders — put your own sources *inside* them. Positions/sizes
(at 2560×1440):

| Slot | Position (in OBS) | Inner size to aim for |
|------|-------------------|----------------------|
| **Handcam** | x **44**, y **470** | ~476 × 266 (16:9) |
| **Keyboard** | x **44**, y **772** | ~476 × 196 |

Resize/position your webcam and keyboard-overlay sources to sit just inside the
red brackets. To move or resize a frame, edit `.frame-cam` / `.frame-keys` in
`css/overlay.css`.

> **HUD scale:** these positions assume Valorant's default HUD scale. If your
> minimap is larger/smaller, nudge the `top` values of `.frame-cam`,
> `.frame-keys`, `.brand-logo`, and `.np-card` in `css/overlay.css`.

### Alerts placement (the other browser source)
The alert cards render top-center by default, which is right over Valorant's
round timer. Since alerts are brief that's often fine, but for zero overlap add
the alerts browser source, then in OBS **move/scale it down to your left column**
(above the handcam) or a lower band. Ask and I can hard-pin them there instead.

> No keyboard overlay yet? Popular free ones: **NohBoard**, **Mania**, or the OBS
> **input-overlay** plugin. This overlay just frames whatever you use.

---

## 2) Spotify "Now Playing" (optional)

1. Go to <https://developer.spotify.com/dashboard> → **Create app**.
   - Redirect URI: your hosted `spotify-connect.html` URL (e.g.
     `https://<you>.github.io/<repo>/stream-overlay/spotify-connect.html`).
     For local use add `http://127.0.0.1:8000/spotify-connect.html`.
   - APIs: **Web API**. Save, then copy the **Client ID**.
2. Paste the Client ID into `js/overlay-config.js`.
3. Open `spotify-connect.html` and click **Connect with Spotify**. Done — the
   token is saved and refreshes itself.
4. Play a song; the card appears top-right. (It hides when nothing's playing —
   set `hideWhenPaused: false` in config to keep the last track shown.)

If the overlay runs in OBS, also run `spotify-connect.html` once **inside** OBS
(right-click the source → **Interact**) so OBS stores its own login.

---

## 3) Hosting (recommended: GitHub Pages)

OBS needs a URL. Easiest is GitHub Pages:

1. Push this repo. **Settings → Pages →** deploy from your branch, root.
2. Overlay URL: `https://<you>.github.io/<repo>/stream-overlay/overlay.html`
3. Use that same base for the Spotify redirect URI in step 2.

*(Local alternative: run `python3 -m http.server 8000` in this folder and use
`http://127.0.0.1:8000/...` everywhere, including the Spotify redirect URI.)*

---

## Customizing

- **Color, labels, Spotify** → `js/overlay-config.js`.
- **Positions / sizes / borders** → `css/overlay.css`.
- The accent (`#c01122`) is sampled from your logo's diamond; change it once in
  config and it updates the logo brackets, tabs, and the now-playing card.
