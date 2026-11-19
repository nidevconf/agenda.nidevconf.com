"use client";

import qrcode from "qrcode-generator";
import { useState } from "react";
import talks from "../_data/talks.json";
import { encodeAgenda } from "../_lib/agenda-code";
import { useCopyToClipboard } from "../_lib/clipboard";
import { useName } from "../_lib/picks";
import NameField from "./NameField";
import Sheet from "./Sheet";

/* Turns your picks into a link (?name=<you>&agenda=<hex bitset>; the name only if you
   gave one) and shows it in a sheet: your name, a QR code to scan off your screen, and
   the link to copy. Both follow the name as you type it. */
export default function ShareBar({ picks }: { picks: string[] }) {
  const name = useName().trim();
  const [open, setOpen] = useState(false);
  const { copied, copy } = useCopyToClipboard();

  if (picks.length === 0) return null;

  const q = new URLSearchParams();
  if (name) q.set("name", name);
  q.set("agenda", encodeAgenda(picks, talks));
  const url = open ? `${location.origin}${location.pathname}?${q}` : "";

  return (
    <>
      <button type="button" className="btn btn-primary" onClick={() => setOpen(true)}>
        Share
      </button>
      {open && (
        <Sheet title="Share my agenda" onClose={() => setOpen(false)}>
          <div className="share-name">
            <NameField />
          </div>
          <p className="share-whose">{name ? `${name}'s agenda` : "My agenda"}</p>
          <QR text={url} />
          <div className="share-link">
            <input
              type="text"
              readOnly
              value={url}
              aria-label="Link to your agenda"
              onFocus={(e) => e.target.select()}
            />
            <button type="button" className="btn btn-primary" onClick={() => copy(url)}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </Sheet>
      )}
    </>
  );
}

/* the code as one SVG path, a module per unit, with the 4-module quiet zone scanners need */
function QR({ text }: { text: string }) {
  const qr = qrcode(0, "M");
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  let d = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) if (qr.isDark(r, c)) d += `M${c + 4} ${r + 4}h1v1h-1z`;
  return (
    <svg className="share-qr" viewBox={`0 0 ${n + 8} ${n + 8}`} role="img" aria-label="QR code for the link">
      <rect width="100%" height="100%" fill="#fff" />
      <path d={d} fill="#000" />
    </svg>
  );
}
