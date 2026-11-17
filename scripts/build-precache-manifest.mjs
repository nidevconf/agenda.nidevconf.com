#!/usr/bin/env node
// Postbuild: lists every file the static export produced (as the clean URLs
// GitHub Pages actually serves — foo.html -> /foo) so the service worker can
// precache the whole app shell on install, not just whatever pages a visitor
// happens to open. Without this, a never-before-seen page (including a
// shared ?agenda= link, which the fetch handler also treats as "/" via
// ignoreSearch) would have nothing to fall back to offline.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "out");

// skip: per-speaker/og share-preview images (crawler-only, ~400KB each — not
// needed to use the app, and precaching all of them is a lot of offline
// storage for no benefit), RSC prefetch payloads, Next's own manifests, and
// this script's own output (re-running locally would otherwise fold it into
// its own next listing).
const SKIP = [/\/og\.png$/, /^\/opengraph-image\.png$/, /\.txt$/, /\/__next\./, /^\/precache-manifest\.json$/];

function walk(dir, base = "") {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const url = `${base}/${entry.name}`;
    if (entry.isDirectory()) out.push(...walk(full, url));
    else out.push(url);
  }
  return out;
}

const files = walk(OUT)
  .map((p) => (p === "/index.html" ? "/" : p.replace(/\.html$/, "")))
  .filter((p, i, all) => all.indexOf(p) === i)
  .filter((p) => !SKIP.some((re) => re.test(p)));

const version = String(Date.now());
writeFileSync(path.join(OUT, "precache-manifest.json"), JSON.stringify({ version, files }));

// Stamp the version into sw.js so its bytes change every build — that's what
// makes the browser notice an update (see the comment in sw.js). Read the
// source in public/, not the copy next build just placed in out/: the two
// land on disk from separate processes/steps, and re-reading our own fresh
// write avoids ever racing that copy.
const swSource = path.join(ROOT, "public/sw.js");
writeFileSync(path.join(OUT, "sw.js"), readFileSync(swSource, "utf8").replaceAll("__BUILD__", version));

console.log(`precache manifest: ${files.length} files, version ${version}`);
