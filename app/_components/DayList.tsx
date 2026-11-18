"use client";

import bands from "../_data/bands.json";
import talks from "../_data/talks.json";
import Link from "next/link";
import { talkStep } from "./AgendaBuilder";
import BandCard from "./BandCard";
import TalkCard, { clock, duration } from "./TalkCard";

const live = talks.filter((t) => !t.withdrawn);
const FIXED = bands.filter((b) => !b.tba); // "Coming soon" placeholders left out
// the talk slots: when the 30-minute talks start, and when they end
const SLOTS = [
  ...new Set(live.filter((t) => t.format === "Talk").map((t) => t.start)),
].map((start) => ({
  start,
  end: Math.max(
    ...live
      .filter((t) => t.format === "Talk" && t.start === start)
      .map((t) => t.end),
  ),
}));

/* Your day as one even column: the sessions picked, with the parts of the day that are
   the same for everyone (registration, lunch, the after-party), in order of when each
   starts. A workshop that runs into lunch starts first, so it's listed first. Cards carry
   no status and no + here: this is the plan to read, and the builder is where you
   change it. A talk slot with nothing in it
   (nothing picked there, and nothing picked running through it) shows as a dashed, empty
   card that opens the builder at that slot. */
export default function DayList({
  ids,
  readOnly,
}: {
  ids: string[];
  readOnly?: boolean;
}) {
  const items = [
    ...FIXED.map((b) => ({
      start: b.start,
      band: true,
      el: <BandCard key={`band-${b.start}`} band={b} />,
    })),
    ...live
      .filter((t) => ids.includes(t.id))
      .map((t) => ({
        start: t.start,
        band: false,
        el: <TalkCard key={t.id} talk={t} action="none" />,
      })),
    ...(readOnly ? [] : SLOTS)
      .filter(
        (sl) =>
          !live.some(
            (t) => ids.includes(t.id) && t.start < sl.end && sl.start < t.end,
          ),
      )
      .map((sl) => ({
        start: sl.start,
        band: false,
        el: (
          <li key={`free-${sl.start}`} className="ag-item ag-free">
            <Link
              className="ag-title ag-link"
              href={`/agenda/choose?step=${talkStep(sl.start)}`}
            >
              Choose a talk to go to
            </Link>
            <p className="ag-when">
              {clock(sl.start)} ({duration(sl.end - sl.start)})
            </p>
          </li>
        ),
      })),
  ].sort((a, b) => a.start - b.start || (a.band ? -1 : 1));
  return <ul className="day-list">{items.map((x) => x.el)}</ul>;
}
