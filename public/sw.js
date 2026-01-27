self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", () => {
  self.clients.claim();
});

self.addEventListener("fetch", () => {
  // no caching yet — just enabling PWA support
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SHOW_NOTIFICATION") {
    self.registration.showNotification("Smile Streak", {
      body: event.data.body || "Time to brush 🪥",
      icon: "/icon-511.png",
    });
  }
});
