"use client";

import { Check, Plus } from "lucide-react";
import { createContext, useContext } from "react";
import talks from "../_data/talks.json";
import { usePicksApi } from "../_lib/picks";

type Slot = { id: string; title: string; start: number; end: number };

/* Lets a surrounding view step in before a talk is added: return true to say it has
   handled the add itself (the agenda builder opens a "Choose a session" sheet when the
   talk would clash). The sheet's own swap buttons bypass it. */
export const AddGuard = createContext<((talk: Slot) => boolean) | null>(null);

/* The one control that puts a talk on your agenda, everywhere: a round plus that
   turns into a tick once it's on. With `swap`, adding a talk also drops anything
   you'd picked at the same time (the clash sheet). */
export default function AddToAgenda({ talk, swap }: { talk: Slot; swap?: boolean }) {
  const { picks, setPicks, toggle } = usePicksApi();
  const guard = useContext(AddGuard);
  const picked = picks.includes(talk.id);
  const action = picked ? `Remove "${talk.title}" from my agenda` : `Add "${talk.title}" to my agenda`;

  function onClick() {
    if (!picked && !swap && guard?.(talk)) return;
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
