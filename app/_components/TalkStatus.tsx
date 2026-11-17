"use client";

import { useState } from "react";
import talks from "../_data/talks.json";
import { usePicksApi } from "../_lib/picks";
import Sheet from "./Sheet";
import TalkCard from "./TalkCard";

type Slot = { id: string; start: number; end: number; format: string };

const NOUN: Record<string, string> = {
  Talk: "talk",
  Lightning: "lightning talk",
  Workshop: "workshop",
};
const live = talks.filter((t) => !t.withdrawn);

/* Where this talk stands against your agenda — going, going but clashing, or
   you'll miss it because you picked something else at that time. Always one
   line, whatever the state (and before picks have loaded), so adding or
   removing a talk never changes the card's height.

   On a clash ("clash(es)") or a miss ("another talk") the underlined words open
   a sheet of those talks drawn with the same TalkCard; its + swaps (adds this,
   drops the overlap). The sheet's talks are fixed when it opens, so
   ticking and unticking inside it never closes it or reshuffles the list; only
   the × or a tap outside closes it.
   `plain` keeps only the state (for the edge colour) and drops the text — for
   the cards inside the sheet, where the edges and buttons say it all. */
export default function TalkStatus({
  talk,
  plain,
}: {
  talk: Slot;
  plain?: boolean;
}) {
  const { picks } = usePicksApi();
  const noun = NOUN[talk.format] ?? "session";
  const others = live.filter(
    (t) =>
      t.id !== talk.id &&
      picks.includes(t.id) &&
      t.start < talk.end &&
      talk.start < t.end,
  );
  const going = picks.includes(talk.id);
  const state = going
    ? others.length
      ? "clash"
      : "going"
    : others.length
      ? "miss"
      : "open";
  const group = live.filter(
    (t) => t.id === talk.id || others.some((o) => o.id === t.id),
  );
  const [snap, setSnap] = useState<string[] | null>(null);

  const open = () => setSnap(group.map((t) => t.id));
  const link = (text: string) => (
    <button type="button" className="ag-clash-link" onClick={open}>
      {text}
    </button>
  );

  return (
    <div className="ag-status" data-state={state}>
      {!plain && (
        <span className="ag-status-text">
          {state === "going" && `You're going to this ${noun}`}
          {state === "miss" && (
            <>
              You&apos;ll miss this for{" "}
              {link(
                others.length > 1
                  ? `${others.length} other talks`
                  : "another talk",
              )}
            </>
          )}
          {state === "clash" && (
            <>
              You&apos;ve got {others.length > 1 ? others.length : "a"}{" "}
              {link(`clash${others.length > 1 ? "es" : ""}`)}
            </>
          )}
        </span>
      )}
      {!plain && snap && (
        <Sheet title="Choose a session" onClose={() => setSnap(null)}>
          <ul>
            {live
              .filter((t) => snap.includes(t.id))
              .sort((a, b) => a.start - b.start)
              .map((t) => (
                <TalkCard key={t.id} talk={t} status="plain" swap />
              ))}
          </ul>
        </Sheet>
      )}
    </div>
  );
}
