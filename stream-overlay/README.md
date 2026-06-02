# NC Stream Overlay

A sleek overlay matched to your **NC** logo (black / white / red diamond ◆). One
transparent browser source in OBS that gives you:

- **NC logo** (top-left)
- **Spotify "Now Playing"** card — album art, track, artist, progress (top-right)
- **Keyboard slot** — a framed box you drop your keyboard overlay into (bottom-left)
- **Handcam slot** — a framed 16:9 box for your webcam (bottom-right)

It pairs with the alerts in `../obs-twitch-alerts` (top-center). Same fonts and
accent, so the whole layout reads as one kit.

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
3. Width **1920**, Height **1080**. OK.
4. Keep this source **above** your game capture, webcam, and keyboard overlay.

### Fit your cam + keyboard into the frames
The frames are just borders — put your own sources *inside* them. Default sizes
(at 1920×1080):

| Slot | Position | Inner size to aim for |
|------|----------|----------------------|
| **Handcam** | bottom-right, 36 px margin | ~436 × 244 (16:9) |
| **Keyboard** | bottom-left, 36 px margin | ~376 × 146 |

Resize/position your webcam and keyboard-overlay sources to sit just inside the
red brackets. To move or resize a frame, edit `.frame-cam` / `.frame-keys` in
`css/overlay.css` (they use simple `right/bottom/left/width/height`).

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
