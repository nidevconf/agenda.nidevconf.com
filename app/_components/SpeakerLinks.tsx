"use client";

import { Ellipsis, Globe, Instagram, Link as LinkIcon, Linkedin, PenLine, Twitter } from "lucide-react";
import { useState } from "react";
import type { Social } from "../_data/socials";
import Sheet from "./Sheet";

const KIND: Record<Social, { Icon: typeof Globe; label: string }> = {
  linkedin: { Icon: Linkedin, label: "LinkedIn" },
  website: { Icon: Globe, label: "Website" },
  blog: { Icon: PenLine, label: "Blog" },
  twitter: { Icon: Twitter, label: "X" },
  instagram: { Icon: Instagram, label: "Instagram" },
  other: { Icon: LinkIcon, label: "Link" },
};

/* A speaker's links as a column of round buttons: the first link (LinkedIn when
   they have it; the list arrives ordered) and, when there's more than one, "…"
   opening a sheet with all of them. No links, no column. */
export default function SpeakerLinks({ name, links }: { name: string; links: [Social, string][] }) {
  const [open, setOpen] = useState(false);
  if (!links.length) return null;
  const [kind, href] = links[0];
  const { Icon, label } = KIND[kind];

  return (
    <div className="deck-rail">
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
              <ul className="sheet-links">
                {links.map(([k, url]) => {
                  const { Icon: I, label: l } = KIND[k];
                  return (
                    <li key={url}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        <I size={18} aria-hidden />
                        <span>
                          <b>{l}</b>
                          <small>{url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</small>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Sheet>
          )}
        </>
      )}
    </div>
  );
}
