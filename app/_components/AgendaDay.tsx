"use client";

import bands from "../_data/bands.json";
import talks from "../_data/talks.json";
import { decodeAgenda } from "../_lib/agenda-code";
import { clearShareParams, setPicks, useName, usePicks, useQueryParam } from "../_lib/picks";
import ScheduleGrid from "./ScheduleGrid";
import ShareBar from "./ShareBar";
import TalkCard, { clock, duration } from "./TalkCard";

type Band = { start: number; end: number; title: string; track?: string; details?: { text: string; href?: string }[] };
type Talk = (typeof talks)[number];

/* Your day: every break and every talk you've picked, in time order, with an
   open slot (pick one of N) wherever a slot is still empty — so this page is
   where you build the day, not just read it. A shared link previews someone
   else's picks first and asks before it touches yours; its add buttons are
   hidden while previewing (action="none"), since tapping one would otherwise
   silently edit your own agenda instead of the one on screen.

   The picks travel in the URL as ?name=&agenda=<hex> (a query string, not a
   hash, so it's visible to a share-preview crawler and to a plain copy of the
   link) rather than ever touching a server. */
export default function AgendaDay() {
  const myPicks = usePicks();
  const sharedHex = useQueryParam("agenda");
  const sharedName = useQueryParam("name");

  // decodeAgenda needs the FULL array (withdrawn talks included) so bit
  // positions line up; everything below that's actually displayed uses the
  // live subset instead.
  const liveTalks = talks.filter((t) => !t.withdrawn);
  const sharedIds = sharedHex ? decodeAgenda(sharedHex, talks) : null;
  const sameAsMine =
    sharedIds !== null && sharedIds.length === myPicks.length && sharedIds.every((id) => myPicks.includes(id));
  const previewing = sharedIds !== null && sharedIds.length > 0 && !sameAsMine;

  const idsSet = new Set(previewing ? sharedIds! : myPicks);
  const picked = liveTalks.filter((t) => idsSet.has(t.id));

  const starts = [...new Set(liveTalks.map((t) => t.start))];
  const openStarts = previewing ? [] : starts.filter((s) => !picked.some((t) => t.start <= s && s < t.end));

  type Item =
    | { start: number; kind: "band"; band: Band }
    | { start: number; kind: "talk"; talk: Talk }
    | { start: number; kind: "open"; options: Talk[] };
  const items: Item[] = [
    ...bands.filter((b) => !b.tba).map((band): Item => ({ start: band.start, kind: "band", band })),
    ...picked.map((talk): Item => ({ start: talk.start, kind: "talk", talk })),
    ...openStarts.map((start): Item => ({ start, kind: "open", options: liveTalks.filter((t) => t.start === start) })),
  ].sort((a, b) => a.start - b.start);

  const clashesOf = (t: Talk) => picked.filter((o) => o.id !== t.id && o.start < t.end && t.start < o.end);

  function adopt() {
    setPicks(sharedIds!);
    clearShareParams();
  }
  function addToMine() {
    setPicks([...myPicks, ...sharedIds!]);
    clearShareParams();
  }

  return (
    <div className="agenda">
      <div className="my-head">
        <div>
          <h1 className={previewing ? "sec-title" : "sr-only"}>{previewing ? `${sharedName || "A friend"}'s agenda` : "My agenda"}</h1>
          {picked.length > 0 && <p className="my-count">{picked.length} talk{picked.length > 1 ? "s" : ""}</p>}
        </div>
        {!previewing && <ShareBar picks={myPicks} />}
      </div>

      {previewing && (
        <div className="my-shared" role="status">
          <p>
            This is {sharedName || "a friend"}&apos;s agenda — {sharedIds!.length} talk
            {sharedIds!.length > 1 ? "s" : ""}.
            {myPicks.length > 0 && ` You have ${myPicks.length} of your own on this device.`}
          </p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={adopt}>
              {myPicks.length ? "Replace mine with this" : "Use this agenda"}
            </button>
            {myPicks.length > 0 && (
              <button type="button" className="btn btn-secondary" onClick={addToMine}>
                Add these to mine
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={clearShareParams}>
              {myPicks.length ? "Keep mine" : "Dismiss"}
            </button>
          </div>
        </div>
      )}

      {/* desktop shows the whole day as the main site's grid; phones get the list below */}
      <ScheduleGrid picked={idsSet} previewing={previewing} />

      <ul className="agenda-list">
        {items.map((item) => {
          if (item.kind === "band") {
            return (
              <li key={`band-${item.band.start}`} className="ag-item ag-band">
                <p className="ag-title">
                  {item.band.title}
                  {item.band.track && ` · ${item.band.track}`}
                </p>
                <p className="ag-when">
                  {clock(item.band.start)} ({duration(item.band.end - item.band.start)})
                </p>
                {item.band.details && (
                  <p className="ag-band-details">
                    {item.band.details.map((d, i) => (
                      <span key={d.text}>
                        {i > 0 && " · "}
                        {d.href ? (
                          <a href={d.href} target="_blank" rel="noopener noreferrer">
                            {d.text}
                          </a>
                        ) : (
                          d.text
                        )}
                      </span>
                    ))}
                  </p>
                )}
              </li>
            );
          }
          if (item.kind === "talk") {
            const clashes = clashesOf(item.talk);
            return (
              <TalkCard
                key={item.talk.id}
                talk={item.talk}
                action={previewing ? "none" : "add"}
                clashNote={clashes.length ? `Clashes with "${clashes[0].title}" in ${clashes[0].track}` : undefined}
              />
            );
          }
          return (
            <li key={`open-${item.start}`} className="ag-item ag-open">
              <details>
                <summary>
                  {clock(item.start)} · Open slot · pick one of {item.options.length}
                </summary>
                <ul className="ag-open-options">
                  {item.options.map((o) => (
                    <TalkCard key={o.id} talk={o} />
                  ))}
                </ul>
              </details>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
