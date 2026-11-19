"use client";

import { useState } from "react";
import type { Speaker } from "../_lib/speakers";
import SpeakerAboutView from "./SpeakerAboutView";

export default function SpeakerAbout({ speaker }: { speaker: Speaker }) {
  const [open, setOpen] = useState(false);
  return <SpeakerAboutView speaker={speaker} open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)} />;
}
