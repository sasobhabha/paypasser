window.__PAYPASSER_NAVIGATE_BOOTED = true;

const statusEl = document.getElementById("status");
const fullscreenBtn = document.getElementById("fullscreen");
const resizeBtn = document.getElementById("resize");

let targetUrl = null;

function setStatus(text) {
  if (statusEl) statusEl.textContent = text;
}

function tryResize() {
  try {
    // Many browsers ignore this for security reasons, but when it works it
    // makes the Payment Handler window substantially larger.
    window.moveTo(0, 0);
    window.resizeTo(screen.availWidth, screen.availHeight);
  } catch {
    // ignore
  }
}

async function tryFullscreen() {
  try {
    if (document.fullscreenElement) return;
    await document.documentElement.requestFullscreen();
  } catch {
    // ignore
  }
}

fullscreenBtn?.addEventListener("click", () => tryFullscreen());
resizeBtn?.addEventListener("click", () => tryResize());

async function openUrl(url) {
  targetUrl = url;
  setStatus(targetUrl ? "Opening…" : "No URL received.");

  tryResize();
  await tryFullscreen();

  if (targetUrl) {
    setTimeout(() => {
      location.href = targetUrl;
    }, 75);
  }
}

// Allow local/manual testing: navigate.html?url=https://example.com
const urlParam = new URLSearchParams(location.search).get("url");
if (urlParam) {
  openUrl(urlParam);
} else if (!navigator.serviceWorker) {
  setStatus("This page must be opened by the payment handler (no Service Worker available).");
} else if (!navigator.serviceWorker.controller) {
  // Common when opened directly (e.g., file://) or before SW takes control.
  setStatus("Waiting for payment handler… (Tip: open from the main page, not directly.)");
}

navigator.serviceWorker?.addEventListener("message", async (event) => {
  targetUrl = event.data?.url || null;
  openUrl(targetUrl);
});
