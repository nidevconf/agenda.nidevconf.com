"use client";

import { Ellipsis } from "lucide-react";
import { useState } from "react";
import type { Social } from "../_data/socials";
import LinkList, { LINK_KIND } from "./LinkList";
import Sheet from "./Sheet";

/* A speaker's links as round buttons: the first link (LinkedIn when they have it; the
   list arrives ordered) and, when there's more than one, "…" opening a sheet with all
   of them. A column over a photo (the speaker card), or a row on a surface. No links,
   nothing. */
export default function SpeakerLinks({ name, links, row }: { name: string; links: [Social, string][]; row?: boolean }) {
  const [open, setOpen] = useState(false);
  if (!links.length) return null;
  const [kind, href] = links[0];
  const { Icon, label } = LINK_KIND[kind];

  return (
    <div className={row ? "deck-rail deck-rail-row" : "deck-rail"}>
      <a className="deck-round" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${name} on ${label}`} title={label}>
        <Icon size={20} aria-hidden />
      </a>
      {links.length > 1 && (
        <>
          <button type="button" className="deck-round" aria-label={`All of ${name}'s links`} title="More links" onClick={() => setOpen(true)}>
            <Ellipsis size={20} aria-hidden />
          </button>
          {open && (
            <Sheet title={name} onClose={() => setOpen(false)}>
              <LinkList links={links.map(([kind, url]) => ({ kind, url }))} />
            </Sheet>
          )}
        </>
      )}
    </div>
  );
}
