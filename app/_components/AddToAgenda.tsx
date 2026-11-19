"use client";

import { Check, Plus } from "lucide-react";
import { createContext, useContext } from "react";
import talks from "../_data/talks.json";
import { overlaps } from "../_lib/schedule";
import { usePicksApi } from "../_lib/picks";

type Pickable = { id: string; title: string; start: number; end: number };

/* Lets a surrounding view take part in adding a session. beforeAdd steps in first:
   return true to say it has handled the add itself (the agenda builder opens the clash
   sheet when the session would clash); the clash sheet's own swap buttons bypass it.
   afterAdd hears about every add, however it happened. */
export const AddGuard = createContext<{
  beforeAdd?: (talk: Pickable) => boolean;
  afterAdd?: (id: string) => void;
} | null>(null);

/* Whether a session is on your agenda, and the click that adds or removes it. With
   `swap`, adding it also drops anything you'd picked at the same time (the clash sheet). */
function useAddToAgenda(talk: Pickable, swap?: boolean) {
  const { picks, setPicks, toggle } = usePicksApi();
  const guard = useContext(AddGuard);
  const picked = picks.includes(talk.id);

  function onClick() {
    if (picked) return toggle(talk.id);
    if (!swap && guard?.beforeAdd?.(talk)) return;
    if (swap) {
      const overlapping = (id: string) => talks.some((t) => t.id === id && overlaps(t, talk));
      setPicks([...picks.filter((id) => !overlapping(id)), talk.id]);
    } else toggle(talk.id);
    guard?.afterAdd?.(talk.id);
  }

  return { picked, onClick };
}

/* The one control that puts a session on your agenda, everywhere: a round plus that
   turns into a tick once it's on. */
export default function AddToAgenda({ talk, swap }: { talk: Pickable; swap?: boolean }) {
  const { picked, onClick } = useAddToAgenda(talk, swap);
  const action = picked ? `Remove "${talk.title}" from my agenda` : `Add "${talk.title}" to my agenda`;
  return (
    <button type="button" className="fav" aria-pressed={picked} aria-label={action} title={action} onClick={onClick}>
      {picked ? <Check size={22} aria-hidden /> : <Plus size={22} aria-hidden />}
    </button>
  );
}

// the label leaves out what it adds (the sheet's title says it) so it fits beside "View details" on a phone
export function AddToAgendaLabelled({ talk }: { talk: Pickable }) {
  const { picked, onClick } = useAddToAgenda(talk);
  return (
    <button
      type="button"
      className={`btn ${picked ? "btn-secondary" : "btn-primary"} sheet-action`}
      aria-pressed={picked}
      onClick={onClick}
    >
      {picked && <Check size={18} aria-hidden />}
      {picked ? "On my agenda" : "Add to my agenda"}
    </button>
  );
}
