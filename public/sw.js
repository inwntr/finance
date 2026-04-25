const CACHE_NAME = "enterprise-dashboard-v1";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(["/", "/manifest.webmanifest"]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // não intercepta API
  if (url.pathname.startsWith("/auth") ||
      url.pathname.startsWith("/user") ||
      url.pathname.startsWith("/incomes") ||
      url.pathname.startsWith("/expenses") ||
      url.pathname.startsWith("/dashboard") ||
      url.pathname.startsWith("/charts")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
