// Offline support for the conference day: the whole app shell is precached on
// install (so a never-opened speaker page, or a ?agenda= link opened for the
// first time with no signal, still works), then cache-first with a background
// refresh for everything after that.
//
// __BUILD__ is replaced with a real timestamp by scripts/build-precache-manifest.mjs
// after `next build`. Baking the version into the cache NAME (rather than a
// runtime variable) matters because a service worker can be killed and
// restarted by the browser between events — a module-level `let` would lose
// its value and strand old entries under a name nothing matches any more.
// Changing this file's bytes on every deploy is also what makes the browser
// notice there's an update at all; it diffs the script, not its cached data.
const CACHE = "nidc-agenda-__BUILD__";

self.addEventListener("install", (event) => {
  event.waitUntil(
    fetch("/precache-manifest.json")
      .then((r) => r.json())
      .then(({ files }) => caches.open(CACHE).then((c) => c.addAll(files)))
      .catch(() => {}) // offline reinstall: fine, fetch() below fills the cache as pages are visited
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("nidc-agenda-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== location.origin) return;

  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      // ignoreSearch: a shared link (?name=&agenda=) is the same static page
      // as "/agenda" — the agenda itself is built client-side from localStorage and
      // the query string, so the cached shell is correct for any of them.
      const cached = await cache.match(request, { ignoreSearch: true });
      const network = fetch(request)
        .then((res) => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        })
        .catch(() => cached);
      return cached ?? network;
    }),
  );
});
