"use client";

import Link from "next/link";
import { BANDS, LIVE, overlaps, when } from "../_lib/schedule";
import { talkStep } from "./AgendaBuilder";
import BandCard from "./BandCard";
import TalkCard from "./TalkCard";

const FIXED = BANDS.filter((b) => !b.tba); // "Coming soon" placeholders left out
// the talk slots: when the 30-minute talks start, and when they end
const SLOTS = [
  ...new Set(LIVE.filter((t) => t.format === "Talk").map((t) => t.start)),
].map((start) => ({
  start,
  end: Math.max(
    ...LIVE
      .filter((t) => t.format === "Talk" && t.start === start)
      .map((t) => t.end),
  ),
}));

/* Your day as one even column: the sessions picked, with the parts of the day that are
   the same for everyone (registration, lunch, the after-party), in order of when each
   starts. A workshop that runs into lunch starts first, so it's listed first. Cards carry
   no status and no + here: this is the plan to read, and the builder is where you
   change it. A talk slot with nothing in it (nothing picked there, and nothing picked
   running through it) shows as a dashed, empty card that opens that slot's question on
   its own (/agenda/choose). */
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
    ...LIVE.filter((t) => ids.includes(t.id))
      .map((t) => ({
        start: t.start,
        band: false,
        el: <TalkCard key={t.id} talk={t} action="none" />,
      })),
    ...(readOnly ? [] : SLOTS)
      .filter(
        (sl) =>
          !LIVE.some((t) => ids.includes(t.id) && overlaps(t, sl)),
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
              {when(sl)}
            </p>
          </li>
        ),
      })),
  ].sort((a, b) => a.start - b.start || (a.band ? -1 : 1));
  return <ul className="day-list">{items.map((x) => x.el)}</ul>;
}
