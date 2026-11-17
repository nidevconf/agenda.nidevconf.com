# NIDC Agenda

A standalone PWA for building and sharing your day at [NIDC 2026](https://nidevconf.com): bookmark the talks you want to see, and share the result as a link. Built with Next.js (App Router, static export) and deployed to GitHub Pages at `agenda.nidevconf.com`, separately from the main site.

## How it works

- **Home (`/`) is your agenda.** It lists the whole day — breaks, and an "open slot, pick one of N" wherever nothing's bookmarked yet. Tap a bookmark on any talk (here, or on a speaker's page) and it moves into your day. Picks live in `localStorage` — no accounts. Visually it's the same card the nidevconf.com homepage agenda uses, just always collapsed to one pick per slot (like that site's own `/my-agenda`), since you can only attend one talk at a time.
- **`/speakers`** lists everyone speaking; **`/speakers/<slug>`** is each speaker's own page (bio, their talk, a bookmark button).
- **Sharing** turns your picks into a link: `?name=<you>&agenda=<hex>`. The "Share my agenda" button asks for a name once (cached for next time), then hands the link to the phone's native share sheet, or copies it on desktop. Opening someone else's link shows a preview banner ("Use this agenda" / "Add these to mine" / "Keep mine") before it touches your own picks — bookmarks are hidden while previewing, since tapping one always acts on *your* agenda, not the one on screen. Adopting or dismissing a shared link clears it from the URL, so your picks diverging from it later doesn't re-trigger the preview.
- **Offline**: `public/sw.js` precaches the entire app shell (every page, every speaker photo) on install, via a manifest `scripts/build-precache-manifest.mjs` generates after each build — so a speaker page or a shared link nobody's opened yet still works with no signal, as long as the app was opened once before, with connectivity, since the last deploy.
- **Install to home screen**: a web manifest + Apple PWA meta tags make it installable on both Android/Chrome and iOS Safari. Note: iOS keeps an installed home-screen app's storage separate from Safari's, so picks made in the browser may not appear in the installed app — re-opening your own share link fixes that.

## The `agenda` hex payload

Every talk has a fixed index, 0 to N-1, in the order they appear in `app/_data/talks.json` — **never reorder that file**; only ever append newly-added talks at the end, or old share links will start pointing at the wrong talk (`scripts/sync-talks.mjs` enforces this, see below). The payload is that index's bits (1 = picked, 0 = not), right-padded to a multiple of 4 and hex-encoded 4 bits per digit.

It's reversible without needing to store the bit count anywhere, because N is always known independently at decode time (it's just `talks.json`'s length) — decoding just re-expands each hex digit back to 4 bits and reads the first N of them. See `app/_lib/agenda-code.ts`, with a round-trip self-check (including the literal worked example from the original spec: talks 1 and 5 of 37 → `8800000000`) at `app/_lib/agenda-code.test.mjs` (`npm test`).

A link encoded against an older/shorter `talks.json` still decodes against a longer one — existing picks come back, anything beyond the old length just reads as unpicked.

## Data

`app/_data/talks.json` and `bands.json` are a **snapshot**, not fetched live — this app has no build-time dependency on the main site being up. Refresh them with:

```bash
npm run sync-talks   # reads ../nidevconf.com by default; NIDEVCONF_REPO=/path overrides
```

This re-derives each talk's time/track/title/bio/etc. from nidevconf.com's current `sessions.json` and its (still hand-placed, pre-launch) schedule logic, but **preserves `talks.json`'s existing array order** — a talk's bit index never moves. A newly-accepted talk is appended at the end; a talk that drops out of the lineup is kept in place but flagged `withdrawn: true` (filtered out of the UI) rather than deleted, since deleting it would shift every later talk's index and quietly break already-shared links. It also copies across any new speaker photos.

There's deliberately no shared package or live fetch between the two repos — if/when nidevconf.com and this app move into one repo, that's the point to replace this snapshot with a real shared data source. They'd still deploy to separate GitHub Pages sites either way.

## Why static (and what it costs)

This deploys as plain files, same pipeline as the main site — no server, no function runtime. The tradeoff: a shared link's social-preview card (WhatsApp/iMessage/Slack unfurl) can't be personalised per-share, since there's no request to render it from. `/speakers/<slug>` pages get a real per-speaker preview image (generated at *build* time, since every speaker's page is known in advance) but the home page `/` always shows the same generic "Build your NIDC 2026 agenda" card, regardless of whose link it is.

## Local dev

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # encode/decode round-trip check
npm run build      # static export -> out/, then generates out/precache-manifest.json and stamps out/sw.js
npm run sync-talks  # refresh app/_data/talks.json + bands.json from ../nidevconf.com
```

## Deploy

GitHub Pages, same as the main site: push to `main`, the included workflow (`.github/workflows/deploy.yml`) runs `npm run build` and deploys `out/`. One-off setup: enable Pages (Settings → Pages → Source: GitHub Actions) and point `agenda.nidevconf.com`'s DNS at GitHub Pages (`public/CNAME` already carries the custom domain).
