"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import talks from "../_data/talks.json";
import { encodeAgenda } from "../_lib/agenda-code";
import { setName, useName } from "../_lib/picks";

/* Turns your picks into a link: ?name=<you>&agenda=<hex bitset>. Asks for a
   name once (cached for next time) then hands the link to the native share
   sheet on a phone, or the clipboard on a desktop. */
export default function ShareBar({ picks }: { picks: string[] }) {
  const name = useName();
  const [copied, setCopied] = useState(false);

  if (picks.length === 0) return null;

  async function share() {
    const who = name || window.prompt("Your name, so people know whose agenda this is:")?.trim();
    if (!who) return;
    if (who !== name) setName(who);

    const hex = encodeAgenda(picks, talks);
    const url = `${location.origin}${location.pathname}?name=${encodeURIComponent(who)}&agenda=${hex}`;
    const text = `${who}'s NIDC 2026 agenda — ${picks.length} talk${picks.length > 1 ? "s" : ""}`;

    if (navigator.share) {
      navigator.share({ title: "My NIDC 2026 agenda", text, url }).catch(() => {});
      return;
    }
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      () => prompt("Copy this link to your agenda:", url),
    );
  }

  return (
    <button type="button" className="btn btn-primary share-btn" onClick={share}>
      <Share2 size={16} aria-hidden /> {copied ? "Link copied" : "Share my agenda"}
    </button>
  );
}
