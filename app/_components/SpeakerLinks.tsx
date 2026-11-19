"use client";

import { useState } from "react";
import SpeakerLinksView, { type SpeakerLinksViewProps } from "./SpeakerLinksView";

type SpeakerLinksProps = Omit<SpeakerLinksViewProps, "moreOpen" | "onOpenMore" | "onCloseMore">;

export default function SpeakerLinks(props: SpeakerLinksProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  return <SpeakerLinksView {...props} moreOpen={moreOpen} onOpenMore={() => setMoreOpen(true)} onCloseMore={() => setMoreOpen(false)} />;
}
