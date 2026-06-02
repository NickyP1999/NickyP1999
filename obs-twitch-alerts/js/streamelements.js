/* =========================================================================
 *  DONATIONS via StreamElements tip socket (optional).
 *  Connects to the StreamElements realtime API and fires "donation" alerts.
 *  Get a JWT token: https://streamelements.com/dashboard/account/channels
 * ========================================================================= */

(function () {
  const cfg = window.ALERT_CONFIG.streamElements;

  function start() {
    if (!cfg || !cfg.enabled || !cfg.jwtToken) {
      console.log("[streamelements] disabled (no token).");
      return;
    }

    // socket.io client is loaded from CDN in index.html
    if (typeof io === "undefined") {
      console.warn("[streamelements] socket.io not loaded; donations disabled.");
      return;
    }

    const socket = io("https://realtime.streamelements.com", {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("[streamelements] connected, authenticating…");
      socket.emit("authenticate", { method: "jwt", token: cfg.jwtToken });
    });

    socket.on("authenticated", () => console.log("[streamelements] authenticated ✓"));
    socket.on("unauthorized", (e) => console.error("[streamelements] auth failed", e));

    socket.on("event", (data) => {
      if (!data || data.type !== "tip") return;
      const d = data.data || {};
      const currency = d.currency || "";
      const amount = d.amount != null ? `${d.amount} ${currency}`.trim() : "";
      window.Alerts.fire("donation", { name: d.username || "Someone", amount });
    });
  }

  window.StreamElements = { start };
})();
