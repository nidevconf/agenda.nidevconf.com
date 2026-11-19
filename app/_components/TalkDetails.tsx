"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import talks from "../_data/talks.json";
import { noun, when } from "../_lib/schedule";
import AddToAgenda from "./AddToAgenda";
import Sheet from "./Sheet";
import SpeakerByline from "./SpeakerByline";

type Talk = (typeof talks)[number];

/* A card's title: tapping it opens what the session's about in a sheet, over wherever
   you are, instead of leaving for /talks. Mid-builder that page was a dead end in the
   installed app, which has no back button. The sheet's button adds it the same way the
   card's + does (through the builder's clash check, when there is one). Portalled to
   <body>, so it doesn't inherit the card's or grid's type sizes and clamps. */
export default function TalkDetails({ id, title, action }: { id: string; title: string; action: "add" | "none" }) {
  const [open, setOpen] = useState(false);
  const s = talks.find((t) => t.id === id)!;
  return (
    <>
      <button type="button" className="ag-title ag-link" aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {title}
      </button>
      {open &&
        createPortal(
          <Sheet title={s.title} description={`${s.track} · ${when(s)}`} onClose={() => setOpen(false)}>
            <div className="details">
              <SessionTags s={s} />
              <SessionBody description={s.description} speakers={s.speakers} />
            </div>
            {action === "add" && <AddToAgenda talk={s} wide={`this ${noun(s.format)}`} />}
          </Sheet>,
          document.body,
        )}
    </>
  );
}

/* The opening paragraph and who's speaking show straight away; the rest of the
   description and the bios sit behind "Read more", so a slot scans as a list. */
export function SessionBody({ description, speakers }: { description: string; speakers: Talk["speakers"] }) {
  const [first, ...rest] = description.split(/\n\s*\n/);
  const more = rest.length > 0 || speakers.some((p) => p.bio);
  return (
    <>
      <p className="session-desc">{first}</p>
      <div className="session-people">
        {speakers.map((p) => (
          <SpeakerByline key={p.name} person={p} />
        ))}
      </div>
      {more && (
        <details className="session-more">
          <summary>Read more</summary>
          {rest.length > 0 && <p className="session-desc">{rest.join("\n\n")}</p>}
          {speakers
            .filter((p) => p.bio)
            .map((p) => (
              <div key={p.name} className="session-bio">
                <h3>About {p.name}</h3>
                <p>{p.bio}</p>
              </div>
            ))}
        </details>
      )}
    </>
  );
}

export const SessionTags = ({ s }: { s: Talk }) => (
  <ul className="tags" aria-label="About this session">
    {[s.format === "Lightning" ? "Lightning talk" : s.format, s.level, s.chip].filter(Boolean).map((t) => (
      <li key={t}>{t}</li>
    ))}
  </ul>
);

