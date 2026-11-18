import type { CSSProperties } from "react";
import bands from "../_data/bands.json";
import { byTime, clock, LIVE, TRACKS, when } from "../_lib/schedule";
import TalkCard from "./TalkCard";

/* Desktop: the whole day as nidevconf.com's homepage timetable draws it — a
   copy of its Schedule.tsx Grid, fed from the synced snapshot. Picked talks
   wear the ink fill; the plus on each card is how you pick. */

type Band = (typeof bands)[number];
type Talk = (typeof LIVE)[number];
type Item = { start: number; end: number; track?: string; layout?: number[]; band?: Band; talk?: Talk };

const items: Item[] = [
  ...bands.map((b) => ({ start: b.start, end: b.end, track: b.track, layout: b.layout, band: b })),
  ...LIVE.map((t) => ({ start: t.start, end: t.end, track: t.track, talk: t })),
].sort(byTime);

// same emoji deal as the main site: stepping 13 through 40 gives every empty slot its own face
const FACES = [
  ..."\u{1F600}\u{1F603}\u{1F604}\u{1F601}\u{1F606}\u{1F605}\u{1F923}\u{1F602}\u{1F642}\u{1F643}",
  ..."\u{1F609}\u{1F60A}\u{1F607}\u{1F970}\u{1F60D}\u{1F929}\u{1F618}\u{1F617}\u{1F61A}\u{1F619}",
  ..."\u{1F972}\u{1F60B}\u{1F61B}\u{1F61C}\u{1F92A}\u{1F917}\u{1F914}\u{1F920}\u{1F973}\u{1F60E}",
  ..."\u{1F913}\u{1F9D0}\u{1F92D}\u{1FAE2}\u{1F92B}\u{1F610}\u{1F611}\u{1F636}\u{1F644}\u{1F60F}",
];
const FACE_OF = new Map(items.filter((i) => i.band?.tba).map((i, n) => [i, FACES[(n * 13) % FACES.length]]));

const span = (i: Item) => (i.layout ?? [i.start, i.end]) as [number, number];

// every start and end is a grid line; each row is as tall as its minutes
const lines = [...new Set(items.flatMap(span))].sort((a, b) => a - b);
const row = (m: number) => lines.indexOf(m) + 1;
const rowSizes = lines
  .slice(1)
  .map((t, i) => `minmax(calc(${t - lines[i]} * var(--ag-min)), auto)`)
  .join(" ");

export default function ScheduleGrid({ picked, previewing }: { picked: Set<string>; previewing: boolean }) {
  return (
    <div className="agenda-sched">
      <div className="ag-headrow">
        <span />
        {TRACKS.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <ul className="agenda-grid" style={{ "--ag-rows": rowSizes } as CSSProperties}>
        {/* the rail prints the REAL start, so the pulled-up after-party still says 18:00 */}
        {[...new Set(items.map((i) => span(i)[0]))].map((line) => (
          <li key={`t${line}`} className="ag-time" style={{ "--r1": row(line) } as CSSProperties} aria-hidden>
            {clock(items.find((i) => span(i)[0] === line)!.start)}
          </li>
        ))}
        {items.map((item) => {
          const [from, to] = span(item);
          const style = {
            "--c": item.track ? TRACKS.indexOf(item.track) + 2 : "2 / -1",
            "--r1": row(from),
            "--r2": row(to),
          } as CSSProperties;
          if (item.talk) {
            return (
              <TalkCard
                key={item.talk.id}
                talk={item.talk}
                style={style}
                picked={picked.has(item.talk.id)}
                action={previewing ? "none" : "add"}
              />
            );
          }
          const b = item.band!;
          const key = `${b.start}-${b.track ?? "all"}`;
          if (b.tba) {
            return (
              <li key={key} className="ag-item ag-talk ag-tba" style={style}>
                <span className="ag-face ag-emoji" aria-hidden>
                  {FACE_OF.get(item)}
                </span>
                <span className="ag-who">Coming soon</span>
                <span className="ag-when">{when(item)}</span>
              </li>
            );
          }
          return (
            <li key={key} className="ag-item ag-band" style={style}>
              <p className="ag-title">{b.title}</p>
              <p className="ag-when">{when(item)}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
