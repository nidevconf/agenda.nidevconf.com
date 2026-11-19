import bands from "../_data/bands.json";
import talks from "../_data/talks.json";

/* The day's shared vocabulary: which sessions are on, the rooms in order, how a time
   reads, and when two sessions overlap. */

export type Session = (typeof talks)[number];

// withdrawn talks stay in talks.json (so later talks keep their bit index in a share
// link) but are never shown
export const LIVE = talks.filter((t) => !t.withdrawn);

/* The parts of the day that are the same for everyone (registration, lunch, the
   after-party), plus "Coming soon" placeholders (tba) for talk slots not filled yet.
   Typed by hand: what the synced file holds changes, e.g. it has no tba once every
   slot is filled. */
export type Band = {
  start: number;
  end: number;
  title: string;
  track?: string;
  tba?: boolean;
  layout?: number[];
  details?: { text: string; href?: string }[];
};
export const BANDS: Band[] = bands;

export const TRACKS = ["Hall 1A", "Hall 1B", "Room 1A", "Room 1B", "Room 2A"];

/** Running order: by start, then by room. */
export const byTime = (a: { start: number; track?: string }, b: { start: number; track?: string }) =>
  a.start - b.start || TRACKS.indexOf(a.track ?? "") - TRACKS.indexOf(b.track ?? "");

type Span = { start: number; end: number };
export const overlaps = (a: Span, b: Span) => a.start < b.end && b.start < a.end;

export const clock = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** 12-hour, as people say it: "2:30pm", "10am" */
export const spoken = (m: number) => {
  const h = Math.floor(m / 60), min = m % 60;
  return `${h % 12 || 12}${min ? `:${String(min).padStart(2, "0")}` : ""}${h < 12 ? "am" : "pm"}`;
};

export function duration(minutes: number) {
  if (minutes < 60) return `${minutes} minutes`;
  const h = Math.round((minutes / 60) * 10) / 10;
  return `${h} hour${h > 1 ? "s" : ""}`;
}

/** "13:00 (30 minutes)" */
export const when = ({ start, end }: Span) => `${clock(start)} (${duration(end - start)})`;

const NOUN: Record<string, string> = { Talk: "talk", Lightning: "lightning talk", Workshop: "workshop" };
export const noun = (format: string) => NOUN[format] ?? "session";

/* The day's slots, one per time the 30-minute talks start. A slot runs until the next one
   starts, and holds every session on at any point in it, whatever its format or length:
   a 10-minute lightning talk, or an hour-long workshop that started in an earlier slot
   and is still running. So a session can be in more than one slot. The builder asks one
   question per slot, and an empty slot on your agenda opens that question, so everything
   you could go to then shows up in both. */
export type Slot = { start: number; end: number; sessions: Session[] };
const starts = [...new Set(LIVE.filter((t) => t.format === "Talk").map((t) => t.start))].sort(
  (a, b) => a - b,
);
export const SLOTS: Slot[] = starts.map((start, i) => {
  const span = { start, end: starts[i + 1] ?? Infinity };
  const sessions = LIVE.filter((t) => overlaps(t, span)).sort(byTime);
  const talks = sessions.filter((t) => t.format === "Talk" && t.start === start);
  return {
    start,
    end: Math.max(...talks.map((t) => t.end)), // when the slot's talks finish
    sessions,
  };
});
// every session in at least one slot, or some of the day can't be picked (that bug: workshops
// and lightning talks were left off the agenda). Breaks the build rather than the page.
if (LIVE.some((t) => !SLOTS.some((s) => s.sessions.includes(t))))
  throw new Error("a session ends before the first talk slot; it belongs to no slot");
