import type { Metadata } from "next";
import SessionList from "../_components/SessionList";

export const metadata: Metadata = {
  title: "Talks",
  description: "Every talk at NIDC 2026, in running order. Workshops have their own page.",
};

export default function TalksPage() {
  return (
    <div className="page-wrap page">
      <header className="page-head">
        <h1>Talks</h1>
        <p>Every talk in running order. Workshops have their own page.</p>
      </header>
      <SessionList filter={(t) => t.format !== "Workshop"} />
    </div>
  );
}
