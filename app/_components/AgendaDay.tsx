"use client";

import Link from "next/link";
import talks from "../_data/talks.json";
import { decodeAgenda } from "../_lib/agenda-code";
import {
  clearShareParams,
  PicksOverride,
  setName,
  setPicks,
  usePicks,
  useQueryParam,
} from "../_lib/picks";
import DayList from "./DayList";
import ScheduleGrid from "./ScheduleGrid";
import ShareBar, { NameField } from "./ShareBar";

/* Your day: what you've picked and the fixed parts of the day (DayList), in
   time order; picking happens in the agenda builder (/agenda/build). A shared link previews someone
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
  const previewing = sharedIds !== null && sharedIds.length > 0;

  const idsSet = new Set(previewing ? sharedIds! : myPicks);
  const picked = liveTalks.filter((t) => idsSet.has(t.id));

  function adopt() {
    setPicks(sharedIds!);
    if (sharedName) setName(sharedName);
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
          <h1 className={previewing ? "sec-title" : "sr-only"}>
            {previewing ? `${sharedName || "A friend"}'s agenda` : "My agenda"}
          </h1>
        </div>
        {!previewing && (
          <div className="name-row">
            <NameField />
            <ShareBar picks={myPicks} />
          </div>
        )}
      </div>

      {previewing && (
        <div className="my-shared" role="status">
          <p>
            This is {sharedName || "a friend"}&apos;s agenda —{" "}
            {sharedIds!.length} talk
            {sharedIds!.length > 1 ? "s" : ""}.
            {myPicks.length > 0 &&
              ` You have ${myPicks.length} of your own on this device.`}
          </p>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={adopt}>
              {sharedName ? `Use ${sharedName}'s agenda` : "Use this agenda"}
            </button>
            {myPicks.length > 0 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addToMine}
              >
                Add to mine
              </button>
            )}
            <button
              type="button"
              className="btn btn-ghost"
              onClick={clearShareParams}
            >
              {myPicks.length ? "Keep mine" : "Dismiss"}
            </button>
          </div>
        </div>
      )}

      {/* desktop shows the whole day as the main site's grid; phones get the list below */}
      <ScheduleGrid picked={idsSet} previewing={previewing} />

      {/* phones: your day as a list (the same one the agenda builder ends on) */}
      <div className="agenda-list">
        {picked.length === 0 && !previewing && (
          <p className="my-empty">
            Nothing on your agenda yet.{" "}
            <Link href="/agenda/build">Build it step by step</Link>.
          </p>
        )}
        {/* previewing someone else's: their picks drive the colours, and nothing can be edited */}
        <PicksOverride
          value={previewing ? { picks: sharedIds!, setPicks: () => {} } : null}
        >
          <DayList ids={[...idsSet]} readOnly={previewing} />
        </PicksOverride>
      </div>
    </div>
  );
}
