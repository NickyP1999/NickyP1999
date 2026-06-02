/* =========================================================================
 *  Spotify "Now Playing"  —  PKCE auth (no server), polls the current track.
 *  Token is obtained once via spotify-connect.html and refreshed automatically.
 * ========================================================================= */
(function () {
  const cfg = window.OVERLAY_CONFIG.spotify;
  const AUTH = "https://accounts.spotify.com";
  const API = "https://api.spotify.com/v1";
  const LS = { access: "sp_access", refresh: "sp_refresh", exp: "sp_exp" };

  const $ = (id) => document.getElementById(id);
  const now = () => Date.now();

  async function refreshToken() {
    const refresh = localStorage.getItem(LS.refresh);
    if (!refresh) return null;
    const body = new URLSearchParams({
      grant_type: "refresh_token", refresh_token: refresh, client_id: cfg.clientId,
    });
    const res = await fetch(AUTH + "/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) { console.error("[spotify] refresh failed", await res.text()); return null; }
    const d = await res.json();
    localStorage.setItem(LS.access, d.access_token);
    localStorage.setItem(LS.exp, String(now() + d.expires_in * 1000));
    if (d.refresh_token) localStorage.setItem(LS.refresh, d.refresh_token);
    return d.access_token;
  }

  async function getToken() {
    const access = localStorage.getItem(LS.access);
    const exp = Number(localStorage.getItem(LS.exp) || 0);
    if (access && now() < exp - 30000) return access;
    return await refreshToken();
  }

  function setLive(on) {
    const c = $("spotify");
    if (!c) return;
    if (!on && cfg.hideWhenPaused === false) return; // keep last track shown
    c.classList.toggle("live", on);
  }

  function render(d) {
    const item = d.item;
    $("sp-art").src = (item.album && item.album.images && item.album.images[0])
      ? item.album.images[0].url : "";
    $("sp-title").textContent = item.name;
    $("sp-artist").textContent = (item.artists || []).map((a) => a.name).join(", ");
    const pct = item.duration_ms ? (d.progress_ms / item.duration_ms) * 100 : 0;
    $("sp-bar-fill").style.width = pct + "%";
    setLive(true);
  }

  async function poll() {
    try {
      const token = await getToken();
      if (!token) { setLive(false); return; }
      const res = await fetch(API + "/me/player/currently-playing", {
        headers: { Authorization: "Bearer " + token },
      });
      if (res.status === 204 || res.status === 202) { setLive(false); return; }
      if (res.status === 401) { await refreshToken(); return; }
      if (!res.ok) return;
      const d = await res.json();
      if (!d || !d.item || !d.is_playing) { setLive(false); return; }
      render(d);
    } catch (e) { /* transient network error */ }
  }

  function start() {
    if (!cfg.enabled) return;
    if (!cfg.clientId || cfg.clientId.includes("PASTE")) {
      console.warn("[spotify] set clientId in overlay-config.js, then run spotify-connect.html");
      return;
    }
    poll();
    setInterval(poll, cfg.pollMs || 4000);
  }

  window.SpotifyNP = { start };
})();
