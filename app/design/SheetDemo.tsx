"use client";

import { useState, type ReactNode } from "react";
import Sheet from "../_components/Sheet";

/* A button that opens a Sheet, for the library. */
export default function SheetDemo({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn btn-secondary" onClick={() => setOpen(true)}>
        {label}
      </button>
      {open && (
        <Sheet title={title} onClose={() => setOpen(false)}>
          {children}
        </Sheet>
      )}
    </>
  );
}
