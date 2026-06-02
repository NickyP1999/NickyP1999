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
  // Cowboy Bebop palette:
  //   saffron #f3b41b · blood red #c1272d · teal #14a0a0 · gold #d98a00
  //
  // gif: a Cowboy Bebop clip shown on the card. These default to hotlinked
  //   Giphy URLs (no copyrighted footage stored in this repo). To use your
  //   own files instead, drop them in the /gifs folder and set e.g.
  //   gif: "gifs/follow.gif". Set gif: "" for no image.
  alerts: {
    follow: {
      title: "new follower",
      message: "{name}",
      color: "#14a0a0",            // teal
      gif: "https://media.giphy.com/media/4ilFRqgbzbx4c/giphy.gif", // Spike + lighter
      sound: "follow.mp3",
    },
    sub: {
      title: "new sub",
      message: "{name}",
      color: "#f3b41b",            // saffron
      gif: "https://media.giphy.com/media/4MxLhxhOqCqYw/giphy.gif", // crew + ship
      sound: "sub.mp3",
    },
    resub: {
      title: "resub",
      message: "{name} · {amount} months",
      color: "#f3b41b",            // saffron
      gif: "https://media.giphy.com/media/QgwoSMw1mbpADGy5Gt/giphy.gif", // "whatever happens, happens"
      sound: "sub.mp3",
    },
    giftSub: {
      title: "gifted",
      message: "{name} · {amount} subs",
      color: "#c1272d",            // blood red
      gif: "https://media.giphy.com/media/udhngZK2IFTc4/giphy.gif", // Edward dancing
      sound: "sub.mp3",
    },
    cheer: {
      title: "bits",
      message: "{name} · {amount}",
      color: "#d98a00",            // amber gold
      gif: "https://media.giphy.com/media/5gK1hvwoutPnG/giphy.gif", // Spike at the bar
      sound: "cheer.mp3",
    },
    raid: {
      title: "raid",
      message: "{name} · {amount}",
      color: "#c1272d",            // blood red
      gif: "https://media.giphy.com/media/b21HcSrrBu8pi/giphy.gif", // Spike smirk
      sound: "raid.mp3",
    },
    donation: {
      title: "donation",
      message: "{name} · {amount}",
      color: "#d98a00",            // amber gold
      gif: "https://media.giphy.com/media/gQbVzXQQbGO7C/giphy.gif", // Spike
      sound: "donation.mp3",
    },
  },
};
