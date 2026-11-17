/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import Link from "next/link";
import { slugify } from "../_lib/speakers";
import AddToAgenda from "./AddToAgenda";
import TalkStatus from "./TalkStatus";

export type Talk = {
  id: string;
  slug: string;
  title: string;
  start: number;
  end: number;
  track: string;
  format: string;
  speakers?: { name: string; photo: string }[];
};

export const clock = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

export function duration(minutes: number) {
  if (minutes < 60) return `${minutes} minutes`;
  const h = Math.round((minutes / 60) * 10) / 10;
  return `${h} hour${h > 1 ? "s" : ""}`;
}

export const talkHref = (t: Pick<Talk, "format" | "slug">) =>
  `/${t.format === "Workshop" ? "workshops" : "talks"}#${t.slug}`;

/* THE talk card — the agenda list, the desktop grid, the speaker tiles and a
   speaker's page all draw a talk with this, so it reads (and works) the same
   everywhere: room + time, who, the title. Tap the card to find out more (the
   title's link stretches over it); tap the plus to put it on your agenda. */
export default function TalkCard({
  talk,
  speakers = true,
  action = "add",
  clashNote,
  style,
  picked,
  status,
  swap,
  as: Tag = "li",
}: {
  talk: Talk;
  /** faces + names; off where the speaker is already on screen */
  speakers?: boolean;
  /** "none" while previewing someone else's agenda: the plus would edit yours */
  action?: "add" | "none";
  clashNote?: string;
  /** desktop grid placement (--c/--r1/--r2) */
  style?: CSSProperties;
  /** highlighted in the desktop grid */
  picked?: boolean;
  /** "you're going" / "you'll miss this" against your agenda (speaker tiles);
      "plain" drops the link to the clash sheet (cards inside that sheet) */
  status?: boolean | "plain";
  /** the + also drops whatever you'd picked at the same time (the clash sheet) */
  swap?: boolean;
  as?: "li" | "div";
}) {
  const flash = talk.end - talk.start < 30;
  const who = speakers ? (talk.speakers ?? []) : [];
  return (
    <Tag
      className={`ag-item ag-talk${flash ? " ag-flash" : ""}${who.length ? "" : " ag-solo"}`}
      data-clash={clashNote ? "" : undefined}
      data-picked={picked ? "" : undefined}
      style={style}
    >
      <span className="ag-top">
        <span className="ag-track">{talk.track}</span>
        <span className="ag-when">
          {clock(talk.start)} ({duration(talk.end - talk.start)})
        </span>
      </span>
      {who.length > 0 && (
        <>
          <span className="ag-face" aria-hidden>
            {who.map((p) => (
              <img key={p.photo} src={`/images/speakers/${p.photo}`} width={28} height={28} alt="" />
            ))}
          </span>
          <span className="ag-who">
            {who.map((p, i) => (
              <span key={p.name}>
                {i > 0 && " & "}
                <Link href={`/speakers/${slugify(p.name)}`}>{p.name}</Link>
              </span>
            ))}
          </span>
        </>
      )}
      <Link className="ag-title ag-link" href={talkHref(talk)}>
        {talk.title}
      </Link>
      {action === "add" && <AddToAgenda talk={talk} swap={swap} />}
      {status && <TalkStatus talk={talk} plain={status === "plain"} />}
      {clashNote && <span className="my-clash">{clashNote}</span>}
    </Tag>
  );
}
