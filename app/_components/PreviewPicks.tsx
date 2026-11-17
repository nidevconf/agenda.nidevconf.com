"use client";

import { useState, type ReactNode } from "react";
import { PicksOverride } from "../_lib/picks";

/* Wraps a preview in its own agenda, starting from `picks`. */
export default function PreviewPicks({ picks, children }: { picks: string[]; children: ReactNode }) {
  const [ids, setIds] = useState(picks);
  return <PicksOverride value={{ picks: ids, setPicks: setIds }}>{children}</PicksOverride>;
}
