import type { Metadata } from "next";
import SessionList from "../_components/SessionList";

export const metadata: Metadata = {
  title: "Talks",
  description: "Every talk at NIDC 2026, in running order. Workshops have their own page.",
};

export default function TalksPage() {
  return (
    <div className="page-wrap sessions">
      <h1 className="sec-title">Talks</h1>
      <SessionList filter={(t) => t.format !== "Workshop"} />
    </div>
  );
}
