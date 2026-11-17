import type { Metadata } from "next";
import SpeakerCard from "../_components/SpeakerCard";
import { SPEAKERS } from "../_lib/speakers";

export const metadata: Metadata = {
  title: "Speakers",
  description: "Everyone speaking at NIDC 2026.",
};

/* One screen per speaker, swiped through vertically (scroll-snap). */
export default function SpeakersPage() {
  const sorted = [...SPEAKERS].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <div className="deck">
      <h1 className="sr-only">Speakers</h1>
      {sorted.map((s) => (
        <article key={s.slug} id={s.slug} className="deck-card">
          <SpeakerCard speaker={s} />
        </article>
      ))}
    </div>
  );
}
