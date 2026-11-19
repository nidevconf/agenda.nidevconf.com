"use client";

import { BANDS, LIVE, overlaps, SLOTS } from "../_lib/schedule";
import BandCard from "./BandCard";
import FreeSlotCard from "./FreeSlotCard";
import TalkCard from "./TalkCard";

const FIXED = BANDS.filter((b) => !b.tba); // "Coming soon" placeholders left out

/* Your day as one even column: the sessions picked, with the parts of the day that are
   the same for everyone (registration, lunch, the after-party), in order of when each
   starts. A workshop that runs into lunch starts first, so it's listed first. A picked
   session keeps its tick, so you can take it off here; its slot then opens up again, as
   a FreeSlotCard. */
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
        el: <TalkCard key={t.id} talk={t} action={readOnly ? "none" : "add"} />,
      })),
    ...(readOnly ? [] : SLOTS)
      .filter(
        (sl) =>
          !LIVE.some((t) => ids.includes(t.id) && overlaps(t, sl)),
      )
      .map((sl) => ({
        start: sl.start,
        band: false,
        el: <FreeSlotCard key={`free-${sl.start}`} slot={sl} />,
      })),
  ].sort((a, b) => a.start - b.start || (a.band ? -1 : 1));
  return <ul className="day-list">{items.map((x) => x.el)}</ul>;
}
