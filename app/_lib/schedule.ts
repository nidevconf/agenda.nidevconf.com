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

export function duration(minutes: number) {
  if (minutes < 60) return `${minutes} minutes`;
  const h = Math.round((minutes / 60) * 10) / 10;
  return `${h} hour${h > 1 ? "s" : ""}`;
}

/** "13:00 (30 minutes)" */
export const when = ({ start, end }: Span) => `${clock(start)} (${duration(end - start)})`;

const NOUN: Record<string, string> = { Talk: "talk", Lightning: "lightning talk", Workshop: "workshop" };
export const noun = (format: string) => NOUN[format] ?? "session";
