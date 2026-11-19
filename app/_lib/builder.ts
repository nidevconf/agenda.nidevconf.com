"use client";

import { useState } from "react";
import { setPicks, usePicks } from "./picks";
import { BANDS, byTime, duration, LIVE, overlaps, type Session, SLOTS, spoken } from "./schedule";

/* The agenda builder's steps, and how a pick made on one is checked against the rest of
   your agenda. /agenda/build asks by format, in this order: one question for the day's
   workshops, then one per talk slot in running order: that slot's talks, then the
   lightning talks that start during it (three a slot, in the afternoon). Lunch and the
   afternoon break come in between as steps of their own: a line of encouragement,
   nothing to pick, just Next. /agenda/choose asks one slot's question on its own. */

/* Above a break's heading, two emoji (public/images/emoji), left to right, measured off
   the design references in px: width, how far below the top of the pair each one hangs,
   its tilt, and the gap between them. On a phone too narrow for the pair, all of it
   scales down together. */
export type Emoji = { src: string; width: number; top: number; tilt: number };
export type Pause = { heading: string; message: string; art: Emoji[]; gap: number };

export type Step = {
  label: string; // "Talks at 2:30pm": the step's name in the progress line and bar
  section: string; // "Talks at 2:30pm, step 7 of 11"
  sessions: Session[];
  pause?: Pause; // a break: shown instead of choices
  // done once one of its own sessions is picked (workshops); otherwise
  // once anything picked is on during it (a talk slot can be filled by a workshop)
  byPick?: boolean;
};

const numbered = (steps: Omit<Step, "section">[]): Step[] =>
  steps.map((x, i) => ({ ...x, section: `${x.label}, step ${i + 1} of ${steps.length}` }));

// the breaks that get a step, by their title in bands.json, and what they say
const PAUSES: Record<string, Pause> = {
  Lunch: {
    heading: "Lunch",
    message: "Time to recharge. Grab some lunch and catch up with the people you met this morning.",
    // small top left, big beside it, both upright
    art: [
      { src: "sandwich", width: 39, top: 7, tilt: 0 },
      { src: "yum", width: 106, top: 0, tilt: 0 },
    ],
    gap: 3,
  },
  "Afternoon break": {
    heading: "Break",
    message: "Grab a coffee and a traybake. You've earned it.",
    // big tipped left, small tipped right and hanging a little lower
    art: [
      { src: "coffee", width: 88, top: 0, tilt: -3 },
      { src: "speech_balloon", width: 73, top: 8.5, tilt: 6 },
    ],
    gap: 15,
  },
};

const WORKSHOPS = LIVE.filter((t) => t.format === "Workshop").sort(byTime);

/** /agenda/build's questions, in order. */
export const STEPS = numbered([
  ...(WORKSHOPS.length ? [{ label: "Workshops", sessions: WORKSHOPS, byPick: true }] : []),
  ...[
    ...SLOTS.map((sl) => ({
      start: sl.start,
      label: `Talks at ${spoken(sl.start)}`,
      sessions: [
        ...sl.sessions.filter((t) => t.format === "Talk"),
        // started in this slot, not running into it from the one before
        ...sl.sessions.filter((t) => t.format === "Lightning" && t.start >= sl.start),
      ],
    })),
    ...BANDS.filter((b) => PAUSES[b.title]).map((b) => ({
      start: b.start,
      label: `${b.title} at ${spoken(b.start)} (${duration(b.end - b.start)})`,
      sessions: [],
      pause: PAUSES[b.title],
    })),
  ]
    .sort((a, b) => a.start - b.start)
    .map(({ start: _, ...x }) => x),
]);
// every session in some step, or the builder can't offer it. Breaks the build, not the page.
if (LIVE.some((t) => !STEPS.some((x) => x.sessions.includes(t))))
  throw new Error("a session is in no builder step");

/* A slot's question on its own (/agenda/choose?step=N, N indexing SLOTS, from an empty
   slot on your agenda): everything on at any point in it, workshops first, then talks,
   then lightning talks, running order within each. */
const FORMATS = ["Workshop", "Talk", "Lightning"];
const byFormat = (a: Session, b: Session) => FORMATS.indexOf(a.format) - FORMATS.indexOf(b.format);
export const SLOT_STEPS = numbered(
  SLOTS.map((sl) => ({
    label: `Talks at ${spoken(sl.start)}`,
    sessions: [...sl.sessions].sort(byFormat), // stable, so byTime holds within a format
  })),
);

/** Whether a step needs no more answering, given these picks. */
export const filled = (x: Step, picks: string[]) =>
  x.pause // a break has nothing to answer
    ? true
    : x.byPick
      ? x.sessions.some((t) => picks.includes(t.id))
      : LIVE.some((t) => picks.includes(t.id) && x.sessions.some((y) => overlaps(t, y)));

/** ?step=N as an index into steps, or null when it's missing or out of range. */
export function parseStep(param: string | null, count: number) {
  const n = Number(param);
  return param !== null && Number.isInteger(n) && n > 0 && n < count ? n : null;
}

/** A clash being resolved: the session you tried to add, then what it overlaps. */
export type Conflict = { ids: string[]; advance: boolean };

/* Before a session on this step is added: what it overlaps on this step it replaces
   (you're choosing here, and you can see the old pick un-green); what it overlaps from
   another step opens the clash sheet instead. With onTalkAdded (/agenda/choose), a talk
   added either way, straight away or from the sheet, ends the question. */
export function useClashGuard(sessions: Session[], onTalkAdded?: () => void) {
  const picks = usePicks();
  const [conflict, setConflict] = useState<Conflict | null>(null);

  function beforeAdd(t: { id: string; start: number; end: number }) {
    const advance = !!onTalkAdded && LIVE.find((x) => x.id === t.id)?.format === "Talk";
    const over = LIVE.filter((o) => picks.includes(o.id) && o.id !== t.id && overlaps(o, t)).sort(
      (a, b) => a.start - b.start,
    );
    const elsewhere = over.filter((o) => !sessions.some((x) => x.id === o.id));
    if (elsewhere.length) {
      setConflict({ ids: [t.id, ...elsewhere.map((o) => o.id)], advance });
      return true;
    }
    setPicks([...picks.filter((id) => !over.some((o) => o.id === id)), t.id]);
    if (advance) onTalkAdded?.();
    return true;
  }

  // the clash sheet's + added the session you first tried to add: done here
  function afterAdd(id: string) {
    if (!conflict?.advance || id !== conflict.ids[0]) return;
    setConflict(null);
    onTalkAdded?.();
  }

  return { picks, conflict, beforeAdd, afterAdd, closeConflict: () => setConflict(null) };
}
