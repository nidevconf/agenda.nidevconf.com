import type { Metadata } from "next";
import AgendaBuilder from "../../_components/AgendaBuilder";

export const metadata: Metadata = { title: "Choose a talk", robots: { index: false } };

/* One question from the agenda builder, on its own: the slot comes from ?step=N (an
   empty slot on /agenda links here). */
export default function ChoosePage() {
  return (
    <div className="page-wrap builder-page">
      <h1 className="sr-only">Choose a talk</h1>
      <AgendaBuilder single />
    </div>
  );
}
