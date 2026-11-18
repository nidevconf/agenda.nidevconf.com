"use client";

import { setName, useName } from "../_lib/picks";

/* Your name, kept on this device; it goes into the link you share. */
export default function NameField() {
  const name = useName();
  return (
    <label className="field">
      <span>Name (optional)</span>
      <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
    </label>
  );
}
