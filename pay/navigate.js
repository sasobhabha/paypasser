navigator.serviceWorker.addEventListener("message", (event) => {
  location.href = event.data.url;
});