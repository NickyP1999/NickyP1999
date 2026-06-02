/* =========================================================================
 *  OVERLAY CONFIG  —  the only file you need to edit.
 * ========================================================================= */
window.OVERLAY_CONFIG = {

  // Brand accent (sampled from your logo's red diamond). Used everywhere.
  accent: "#c01122",

  // Frame labels (the little tabs on each box)
  labels: {
    cam:  "CAM",
    keys: "KEYS",
  },

  // Spotify "now playing" widget (optional)
  spotify: {
    enabled: true,
    // Create an app at https://developer.spotify.com/dashboard and paste its
    // Client ID here. Add your overlay's spotify-connect.html URL as a Redirect
    // URI in the app settings. (See README.)
    clientId: "PASTE_YOUR_SPOTIFY_CLIENT_ID",
    pollMs: 4000,           // how often to check the current track
    hideWhenPaused: true,   // hide the card when nothing is playing
  },
};
