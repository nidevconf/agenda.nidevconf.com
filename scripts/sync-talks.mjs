#!/usr/bin/env node
// Refreshes app/_data/talks.json and bands.json from the sibling nidevconf.com
// checkout's current schedule. The bit-index in a shared ?agenda= link is this
// file's ARRAY ORDER, so this script preserves it: existing talks keep their
// position (only their fields are refreshed — time, track, title, bio, all of
// it can change), newly-accepted talks are appended at the end, and a talk
// that drops out of the lineup is kept in place but flagged `withdrawn: true`
// (filtered from the UI) rather than removed, since removing it would shift
// every later talk's bit index and silently break already-shared links.
//
// This duplicates the placement half of nidevconf.com's Schedule.tsx (the
// PINNED/queue logic), rather than depending on that site's own build output,
// because that schedule is still actively in flux pre-launch. Re-copy this
// block from Schedule.tsx when it changes there.
import { existsSync, copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = path.join(HERE, "..");
const SRC = process.env.NIDEVCONF_REPO ?? path.join(ROOT, "..", "nidevconf.com");

if (!existsSync(path.join(SRC, "app/_data/sessions.json"))) {
  console.error(
    `Can't find nidevconf.com's sessions.json under ${SRC}.\n` +
      `Set NIDEVCONF_REPO=/path/to/nidevconf.com if it's not a sibling checkout.`,
  );
  process.exit(1);
}

const sessions = JSON.parse(readFileSync(path.join(SRC, "app/_data/sessions.json"), "utf8"));

const TRACKS = ["Hall 1A", "Hall 1B", "Room 1A", "Room 1B", "Room 2A"];
const at = (h, m = 0) => h * 60 + m;

const TALK_STARTS = [at(10), at(10, 45), at(11, 30), at(13), at(13, 45), at(14, 30), at(15, 30), at(16, 10)];
const WORKSHOPS = [
  [at(10), at(11)],
  [at(11, 15), at(12, 15)],
  [at(13), at(14)],
  [at(14, 15), at(15, 15)],
  [at(15, 30), at(16, 30)],
];
const FLASH_TRACK = 3;
const FLASH_SLOTS = TALK_STARTS.filter((t) => t >= at(13) && t < at(15));
const FLASH_MIN = 10;
const FLASH_GAP = 5;

// Keep this block (through `queues`) in sync with nidevconf.com's
// app/_components/Schedule.tsx — it's a straight copy of the pure-data half.
const PINNED = {
  "1272502": [at(13), 4],
  "1331058": [at(11, 15), 4],
  "1281884": [at(10, 45), 0],
  "1315618": [at(15, 30), 1],
  "1307120": [at(16, 10), 0],
  "1309913": [at(16, 10), 1],
  "1290323": [at(16, 10), 2],
  "1311202": [at(10, 45), 3],
  "1310014": [at(11, 30), 3],
  "1309513": [at(13, 30), 3],
  "1307192": [at(13, 45), 3],
  "1283814": [at(14, 45), 3],
  "1310846": [at(14), 3],
  "1266968": [at(14, 15), 3],
  "1310995": [at(15), 3],
  "1309264": [at(13), 3],
  "1271354": [at(14, 30), 3],
  "1284658": [at(13, 15), 3],
  "1293818": [at(10, 45), 2],
  "1308541": [at(11, 30), 2],
  "1296109": [at(15, 30), 2],
  "1311214": [at(13), 2],
  "1306805": [at(10), 3],
  "1311194": [at(15, 30), 3],
  "1307140": [at(15, 30), 0],
  "1308347": [at(13, 45), 2],
  "1299723": [at(14, 30), 2],
  "1306848": [at(10), 1],
  "1303858": [at(13, 45), 1],
  "1311260": [at(13, 45), 0],
  "1310638": [at(14, 30), 0],
  "1331334": [at(11, 30), 0],
  "dailypay-adam-mcgrogan": [at(10, 45), 1],
  "gearset-curtis-tarr": [at(13), 1],
  "tony-mcbride-cv": [at(15, 30), 4],
  "kainos-lee-service": [at(10), 0],
  "payroc-david-edwards": [at(13), 0],
};
const pinned = (start, track) =>
  sessions.find((s) => PINNED[s.id]?.[0] === start && PINNED[s.id]?.[1] === track);
const HELD = [
  [at(10, 45), 1],
  [at(11, 30), 0],
  [at(11, 30), 1],
  [at(13), 1],
];
const held = (start, track) => HELD.some(([s, t]) => s === start && t === track);
const queue = (format) => sessions.filter((s) => s.format === format && !PINNED[s.id]);
const queues = { Talk: queue("Talk"), Lightning: queue("Lightning"), Workshop: queue("Workshop") };
const slot = (start, end, track, format) => {
  const session = pinned(start, track) ?? (held(start, track) ? undefined : queues[format].shift());
  // talkSlot marks this as a session slot even when nothing filled it (HELD, or
  // the queue ran dry), so it's never mistaken for a band below.
  return { start, end, track, session, talkSlot: true };
};

const ITEMS = [
  { start: at(8, 30), end: at(9), title: "Registration" },
  { start: at(9), end: at(9, 30), title: "Coffee" },
  { start: at(9, 30), end: at(9, 45), track: 0, title: "Opening" },
  ...TALK_STARTS.flatMap((start) =>
    [0, 1, 2, 3].flatMap((track) =>
      track === FLASH_TRACK && FLASH_SLOTS.includes(start)
        ? [0, 1, 2].map((i) => {
            const from = start + i * (FLASH_MIN + FLASH_GAP);
            return slot(from, from + FLASH_MIN, track, "Lightning");
          })
        : [slot(start, start + 30, track, "Talk")],
    ),
  ),
  ...WORKSHOPS.map(([start, end]) => slot(start, end, 4, "Workshop")),
  { start: at(12), end: at(13), title: "Lunch" },
  { start: at(15), end: at(15, 30), title: "Afternoon break" },
  { start: at(16, 50), end: at(17, 10), track: 0, title: "Closing & prizes" },
  {
    start: at(18),
    end: at(22),
    title: "After-party",
    // drawn in the 17:10–17:40 row so the grid doesn't open a two-hour void
    layout: [at(17, 10), at(17, 40)],
    details: [
      { text: "Three Sheets", href: "https://threesheetsbelfast.com/" },
      {
        text: "1 Bankmore Square, Belfast BT7 1DH",
        href: "https://www.google.com/maps/search/?api=1&query=Three+Sheets,+1+Bankmore+Square,+Belfast+BT7+1DH",
      },
      { text: "Pizza and beer" },
    ],
  },
];
ITEMS.sort((a, b) => a.start - b.start || (a.track ?? -1) - (b.track ?? -1));

const placedById = new Map(
  ITEMS.filter((i) => i.session).map((i) => [
    i.session.id,
    { ...i.session, start: i.start, end: i.end, track: TRACKS[i.track], withdrawn: false },
  ]),
);

// Bands (breaks etc.) plus the empty "Coming soon" slots (tba), which only the
// desktop grid draws.
const bands = ITEMS.filter((i) => !i.session).map((i) => ({
  start: i.start,
  end: i.end,
  title: i.talkSlot ? "Coming soon" : i.title,
  track: i.track === undefined ? undefined : TRACKS[i.track],
  tba: i.talkSlot || undefined,
  layout: i.layout,
  details: i.details,
}));

// --- merge, preserving existing order; append new ids; flag dropped ones ---
const dataDir = path.join(ROOT, "app/_data");
const existingPath = path.join(dataDir, "talks.json");
const existing = existsSync(existingPath) ? JSON.parse(readFileSync(existingPath, "utf8")) : [];

const merged = existing.map((old) => {
  const fresh = placedById.get(old.id);
  placedById.delete(old.id);
  return fresh ?? { ...old, withdrawn: true };
});
const added = [...placedById.values()]; // whatever's left is new -> appended
const talks = [...merged, ...added];

mkdirSync(dataDir, { recursive: true });
writeFileSync(path.join(dataDir, "talks.json"), `${JSON.stringify(talks, null, 2)}\n`);
writeFileSync(path.join(dataDir, "bands.json"), `${JSON.stringify(bands, null, 2)}\n`);

// --- copy any speaker photos the agenda app doesn't have yet ---
const destDir = path.join(ROOT, "public/images/speakers");
mkdirSync(destDir, { recursive: true });
let copied = 0;
for (const t of talks) {
  for (const p of t.speakers ?? []) {
    for (const file of [p.photo, p.photo.replace(/\.[^.]+$/, "-lg.jpg")]) {
      const from = path.join(SRC, "public/images/speakers", file);
      const to = path.join(destDir, file);
      if (existsSync(from) && (!existsSync(to) || !readFileSync(from).equals(readFileSync(to)))) {
        copyFileSync(from, to);
        copied++;
      }
    }
  }
}

console.log(
  `talks: ${talks.length} (${added.length} new, ${talks.filter((t) => t.withdrawn).length} withdrawn), ` +
    `bands: ${bands.length}, speaker photos copied: ${copied}`,
);
if (added.length) console.log("new:", added.map((t) => t.slug).join(", "));
const withdrawn = talks.filter((t) => t.withdrawn);
if (withdrawn.length) console.log("withdrawn (kept, hidden):", withdrawn.map((t) => t.slug).join(", "));
