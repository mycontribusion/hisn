/**
 * Runtime caching logic for the generated service worker.
 *
 * This file is intentionally dependency-free and written so that
 * `Function.prototype.toString()` (used by Workbox's runtimeCaching converter)
 * emits it verbatim into the generated `sw.js`. It is NOT imported at runtime
 * by the application; it is only consumed by `vite.config.ts` when building
 * the service worker.
 *
 * Minimal local structural types are used instead of the service-worker
 * library types so this file also type-checks cleanly under the normal
 * application TS config.
 */

// Cache name used for cached Google Fonts (CSS + font files).
// IMPORTANT: Workbox's runtimeCaching converter emits the handler function
// verbatim into the generated sw.js as a bare function expression, so the
// cache name must be inlined as a literal inside the handler body (a reference
// to this module-level constant would be unresolved in the SW scope).
export const FONT_CACHE_NAME = 'hisn-muslim-google-fonts-v1'

// Structural shape of Workbox's RouteHandlerCallbackOptions, matching the
// real FetchEvent/request the handler receives at runtime in the SW scope.
interface HandlerOptions {
  request: { url: string }
  event: { request: { url: string } }
}

// A tiny, dependency-free "cache-first, then network" handler for optional
// presentation resources (Google Fonts). It never throws and never lets a
// failed network request break the service worker:
//
//   1. If a valid cached response exists, return it immediately (no network).
//   2. Otherwise try the network.
//   3. On success, cache the successful response and return it.
//   4. On failure, return a valid empty CSS Response so the browser falls
//      back to its local font stack (the app keeps working).
//
// IMPORTANT: Workbox's Router always passes the handler's resolved value to
// event.respondWith(), so the handler MUST resolve to a valid Response even on
// failure — resolving with undefined would itself produce
// "Failed to convert value to 'Response'". The empty CSS Response is a
// legitimate, valid Response: the browser parses it as having no @font-face
// rules and falls back to the local font stack. It is returned but NEVER
// cached (only response.ok responses are cached), so a failed request is
// never stored as a successful resource.
//
// IMPORTANT: Workbox's runtimeCaching converter emits the handler function
// verbatim into the generated sw.js via Function.prototype.toString(), so the
// fallback Response must be constructed INLINE inside the handler body — a
// reference to a module-level constant would be unresolved in the SW scope.
//
// This deliberately does NOT use navigator.onLine, because a device can
// report navigator.onLine === true while the Wi-Fi network has no internet.
export function fontsHandler(options: HandlerOptions): Promise<Response> {
  const request = options.request

  return caches
    .open('hisn-muslim-google-fonts-v1')
    .then(cache =>
      cache.match(request as unknown as Request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse
        }

        return fetch(request as unknown as Request)
          .then(response => {
            // Only cache successful, valid responses. Never cache errors.
            if (!response || !response.ok) {
              return response
            }

            // Cache a clone of the successful response; return the original.
            cache.put(request as unknown as Request, response.clone())
            return response
          })
          .catch(() => {
            // Network failed (dead Wi-Fi / offline) and there is no cached
            // copy. Return a valid empty CSS Response so the browser uses its
            // fallback font stack; the app keeps working and the service
            // worker does not break.
            return new Response('', {
              status: 200,
              headers: { 'Content-Type': 'text/css; charset=utf-8' }
            })
          })
      })
    )
}