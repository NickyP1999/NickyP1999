/* =========================================================================
 *  TWITCH EventSub (WebSocket)  —  follows, subs, resubs, gift subs,
 *  bits/cheers, raids. 100% client-side, no server required.
 *  Docs: https://dev.twitch.tv/docs/eventsub/handling-websocket-events/
 * ========================================================================= */

(function () {
  const cfg = window.ALERT_CONFIG.twitch;
  const HELIX = "https://api.twitch.tv/helix";
  const WS_URL = "wss://eventsub.wss.twitch.tv/ws";

  // Token may live in config OR in localStorage (set by connect.html)
  function getToken() {
    return cfg.accessToken || localStorage.getItem("twitch_token") || "";
  }

  let ws = null;
  let broadcasterId = null;
  let userId = null;
  let keepaliveTimer = null;

  function log(...a) { console.log("[twitch]", ...a); }
  function setStatus(txt, ok) {
    const el = document.getElementById("status");
    if (el) {
      el.textContent = "Twitch: " + txt;
      el.className = "status " + (ok ? "ok" : "bad");
    }
  }

  async function helix(path, opts = {}) {
    const res = await fetch(HELIX + path, {
      ...opts,
      headers: {
        "Authorization": "Bearer " + getToken(),
        "Client-Id": cfg.clientId,
        "Content-Type": "application/json",
        ...(opts.headers || {}),
      },
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Helix ${path} -> ${res.status}: ${body}`);
    }
    return res.status === 202 ? null : res.json();
  }

  // Resolve the authenticated user's id, and the target channel's id.
  async function resolveIds() {
    const me = await helix("/users");
    userId = me.data[0].id;

    if (cfg.channel && cfg.channel !== "your_channel_name") {
      const ch = await helix("/users?login=" + encodeURIComponent(cfg.channel.toLowerCase()));
      if (!ch.data.length) throw new Error("Channel not found: " + cfg.channel);
      broadcasterId = ch.data[0].id;
    } else {
      broadcasterId = userId; // default to the authed user's own channel
    }
    log("authed user", userId, "broadcaster", broadcasterId);
  }

  // The set of subscriptions we want, keyed to config toggles.
  function wantedSubscriptions() {
    const e = window.ALERT_CONFIG.enabled;
    const subs = [];
    if (e.follow)
      subs.push({ type: "channel.follow", version: "2",
        condition: { broadcaster_user_id: broadcasterId, moderator_user_id: userId } });
    if (e.sub)
      subs.push({ type: "channel.subscribe", version: "1",
        condition: { broadcaster_user_id: broadcasterId } });
    if (e.resub)
      subs.push({ type: "channel.subscription.message", version: "1",
        condition: { broadcaster_user_id: broadcasterId } });
    if (e.giftSub)
      subs.push({ type: "channel.subscription.gift", version: "1",
        condition: { broadcaster_user_id: broadcasterId } });
    if (e.cheer)
      subs.push({ type: "channel.cheer", version: "1",
        condition: { broadcaster_user_id: broadcasterId } });
    if (e.raid)
      subs.push({ type: "channel.raid", version: "1",
        condition: { to_broadcaster_user_id: broadcasterId } });
    return subs;
  }

  async function createSubscriptions(sessionId) {
    for (const sub of wantedSubscriptions()) {
      try {
        await helix("/eventsub/subscriptions", {
          method: "POST",
          body: JSON.stringify({ ...sub, transport: { method: "websocket", session_id: sessionId } }),
        });
        log("subscribed:", sub.type);
      } catch (err) {
        console.error("[twitch] failed to subscribe", sub.type, err.message);
      }
    }
  }

  // Map an incoming EventSub notification to an alert.
  function handleNotification(subType, event) {
    switch (subType) {
      case "channel.follow":
        window.Alerts.fire("follow", { name: event.user_name });
        break;
      case "channel.subscribe":
        // gifted subs also fire channel.subscribe; skip those (handled by gift event)
        if (event.is_gift) return;
        window.Alerts.fire("sub", { name: event.user_name });
        break;
      case "channel.subscription.message":
        window.Alerts.fire("resub", {
          name: event.user_name,
          amount: event.cumulative_months || event.duration_months || 1,
        });
        break;
      case "channel.subscription.gift":
        window.Alerts.fire("giftSub", {
          name: event.is_anonymous ? "Anonymous" : event.user_name,
          amount: event.total,
        });
        break;
      case "channel.cheer":
        window.Alerts.fire("cheer", {
          name: event.is_anonymous ? "Anonymous" : event.user_name,
          amount: event.bits,
        });
        break;
      case "channel.raid":
        window.Alerts.fire("raid", {
          name: event.from_broadcaster_user_name,
          amount: event.viewers,
        });
        break;
    }
  }

  function connect() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => log("websocket open");
    ws.onerror = (e) => { console.error("[twitch] ws error", e); setStatus("connection error", false); };
    ws.onclose = () => { log("websocket closed"); };

    ws.onmessage = async (msg) => {
      const data = JSON.parse(msg.data);
      const type = data.metadata.message_type;

      if (type === "session_welcome") {
        const sessionId = data.payload.session.id;
        log("session id", sessionId);
        try {
          await createSubscriptions(sessionId);
          setStatus("connected ✓", true);
        } catch (err) {
          setStatus("subscribe failed (see console)", false);
        }
      } else if (type === "session_keepalive") {
        // connection healthy
      } else if (type === "notification") {
        handleNotification(data.metadata.subscription_type, data.payload.event);
      } else if (type === "session_reconnect") {
        // Twitch asked us to reconnect to a new URL
        const newUrl = data.payload.session.reconnect_url;
        log("reconnecting to", newUrl);
        const old = ws;
        ws = new WebSocket(newUrl);
        bindReconnect(ws, old);
      } else if (type === "revocation") {
        console.warn("[twitch] subscription revoked", data.payload);
      }
    };
  }

  function bindReconnect(newWs, oldWs) {
    newWs.onopen = () => { oldWs.close(); log("reconnect open"); };
    newWs.onmessage = ws.onmessage;
    newWs.onerror = ws.onerror;
    newWs.onclose = ws.onclose;
  }

  async function start() {
    const token = getToken();
    if (!cfg.clientId || cfg.clientId.includes("PASTE_")) {
      setStatus("no Client ID set in config.js", false);
      return;
    }
    if (!token) {
      setStatus("not connected — open connect.html", false);
      log("No access token. Open connect.html to authorize.");
      return;
    }
    try {
      await resolveIds();
      connect();
    } catch (err) {
      console.error("[twitch] start failed", err.message);
      // 401 -> token expired/invalid
      if (String(err.message).includes("401")) {
        localStorage.removeItem("twitch_token");
        setStatus("token expired — open connect.html again", false);
      } else {
        setStatus("error (see console)", false);
      }
    }
  }

  window.Twitch = { start };
})();
