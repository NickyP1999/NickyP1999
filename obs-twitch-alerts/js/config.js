/* =========================================================================
 *  CONFIG  —  This is the ONLY file you need to edit.
 *  Everything is documented inline. Save the file after editing.
 * ========================================================================= */

window.ALERT_CONFIG = {

  /* ----------------------------------------------------------------------
   * 1) TWITCH  (required for follows / subs / bits / raids)
   * ---------------------------------------------------------------------- */
  twitch: {
    // Your channel login name, lowercase (e.g. "nickyp1999")
    channel: "your_channel_name",

    // Client ID from your Twitch application.
    // Create one at https://dev.twitch.tv/console/apps  (see README step 1)
    clientId: "PASTE_YOUR_CLIENT_ID_HERE",

    // Leave this blank. You'll generate the token once via connect.html
    // and it gets saved automatically in the browser. (See README step 3.)
    // You can also paste a token here manually if you prefer.
    accessToken: "",
  },

  /* ----------------------------------------------------------------------
   * 2) DONATIONS  (optional — uses StreamElements tips)
   *    Get your JWT token at: https://streamelements.com/dashboard/account/channels
   *    Leave token blank to disable real donation alerts (test mode still works).
   * ---------------------------------------------------------------------- */
  streamElements: {
    enabled: false,
    jwtToken: "",
  },

  /* ----------------------------------------------------------------------
   * 3) WHICH ALERTS ARE ON
   * ---------------------------------------------------------------------- */
  enabled: {
    follow:   true,
    sub:      true,
    resub:    true,
    giftSub:  true,
    cheer:    true,   // bits
    raid:     true,
    donation: true,
  },

  /* ----------------------------------------------------------------------
   * 4) LOOK & FEEL
   * ---------------------------------------------------------------------- */
  display: {
    durationMs: 7000,     // how long each alert stays on screen
    soundVolume: 0.6,     // 0.0 (mute) to 1.0 (full)
    position: "top",      // "top" | "center" | "bottom"
  },

  /* ----------------------------------------------------------------------
   * 5) PER-ALERT STYLING & MESSAGES
   *    {name}   = the viewer's name
   *    {amount} = bits / months / dollars / raiders (where relevant)
   *    sound    = filename inside the /sounds folder, or "" for silent
   * ---------------------------------------------------------------------- */
  alerts: {
    follow: {
      title: "New Follower!",
      message: "{name} just followed!",
      color: "#9146FF",
      sound: "follow.mp3",
    },
    sub: {
      title: "New Subscriber!",
      message: "{name} just subscribed!",
      color: "#1f8b4c",
      sound: "sub.mp3",
    },
    resub: {
      title: "Resub!",
      message: "{name} resubscribed for {amount} months!",
      color: "#1f8b4c",
      sound: "sub.mp3",
    },
    giftSub: {
      title: "Gifted Subs!",
      message: "{name} gifted {amount} subs!",
      color: "#e91e63",
      sound: "sub.mp3",
    },
    cheer: {
      title: "Bits!",
      message: "{name} cheered {amount} bits!",
      color: "#9146FF",
      sound: "cheer.mp3",
    },
    raid: {
      title: "Raid!",
      message: "{name} is raiding with {amount} viewers!",
      color: "#ff4500",
      sound: "raid.mp3",
    },
    donation: {
      title: "Donation!",
      message: "{name} donated {amount}!",
      color: "#ffb300",
      sound: "donation.mp3",
    },
  },
};
