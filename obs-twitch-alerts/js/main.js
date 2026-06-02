/* Wires everything together once the page is ready. */
(function () {
  window.addEventListener("DOMContentLoaded", () => {
    if (window.Twitch) window.Twitch.start();
    if (window.StreamElements) window.StreamElements.start();
  });
})();
