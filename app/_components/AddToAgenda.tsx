"use client";

import { Check, Plus } from "lucide-react";
import talks from "../_data/talks.json";
import { usePicksApi } from "../_lib/picks";

type Slot = { id: string; title: string; start: number; end: number };

/* The one control that puts a talk on your agenda, everywhere: a round plus that
   turns into a tick once it's on. With `swap`, adding a talk also drops anything
   you'd picked at the same time (the clash sheet). */
export default function AddToAgenda({ talk, swap }: { talk: Slot; swap?: boolean }) {
  const { picks, setPicks, toggle } = usePicksApi();
  const picked = picks.includes(talk.id);
  const action = picked ? `Remove "${talk.title}" from my agenda` : `Add "${talk.title}" to my agenda`;

  function onClick() {
    if (!swap || picked) return toggle(talk.id);
    const overlapping = (id: string) => talks.some((t) => t.id === id && t.start < talk.end && talk.start < t.end);
    setPicks([...picks.filter((id) => !overlapping(id)), talk.id]);
  }

  return (
    <button type="button" className="fav" aria-pressed={picked} aria-label={action} title={action} onClick={onClick}>
      {picked ? <Check size={22} aria-hidden /> : <Plus size={22} aria-hidden />}
    </button>
  );
}
