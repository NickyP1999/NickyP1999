/* =========================================================================
 *  ALERT ENGINE  —  queueing + rendering. You shouldn't need to edit this.
 * ========================================================================= */

(function () {
  const cfg = window.ALERT_CONFIG;
  const root = document.getElementById("alert-root");

  // Apply screen position from config
  if (root && cfg.display.position) {
    root.classList.add("pos-" + cfg.display.position);
  }

  const queue = [];
  let busy = false;

  function fmt(str, data) {
    return String(str)
      .replace(/{name}/g, data.name ?? "Someone")
      .replace(/{amount}/g, data.amount ?? "");
  }

  function playSound(file) {
    if (!file) return;
    try {
      const audio = new Audio("sounds/" + file);
      audio.volume = cfg.display.soundVolume ?? 0.6;
      audio.play().catch(() => {/* autoplay may be blocked until interaction */});
    } catch (e) { /* ignore */ }
  }

  /**
   * Public entry point. type = follow|sub|resub|giftSub|cheer|raid|donation
   * data = { name, amount }
   */
  function fire(type, data = {}) {
    if (cfg.enabled[type] === false) return;
    const style = cfg.alerts[type];
    if (!style) {
      console.warn("[alerts] unknown alert type:", type);
      return;
    }
    queue.push({ type, data, style });
    if (!busy) next();
  }

  function next() {
    if (queue.length === 0) { busy = false; return; }
    busy = true;
    const { data, style } = queue.shift();

    const el = document.createElement("div");
    el.className = "alert-card";
    el.style.setProperty("--accent", style.color || "#9146FF");
    el.innerHTML = `
      <div class="alert-title">${escapeHtml(style.title)}</div>
      <div class="alert-message">${escapeHtml(fmt(style.message, data))}</div>
    `;

    root.appendChild(el);
    // force reflow so the entry animation triggers
    void el.offsetWidth;
    el.classList.add("show");

    playSound(style.sound);

    const dur = cfg.display.durationMs ?? 7000;
    setTimeout(() => {
      el.classList.remove("show");
      el.classList.add("hide");
      setTimeout(() => {
        el.remove();
        next();
      }, 600); // matches CSS exit transition
    }, dur);
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  // expose globally
  window.Alerts = { fire };
})();
