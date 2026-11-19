"use client";

import { useState } from "react";
import talks from "../_data/talks.json";
import TalkDetailsView from "./TalkDetailsView";

/* Whether a card's details sheet is open (TalkDetailsView draws it). */
export default function TalkDetails({ id, title, action }: { id: string; title: string; action: "add" | "none" }) {
  const [open, setOpen] = useState(false);
  return (
    <TalkDetailsView
      title={title}
      session={talks.find((t) => t.id === id)!}
      open={open}
      action={action}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    />
  );
}
