import type { Metadata } from "next";
import AgendaBuilder from "../../_components/AgendaBuilder";

export const metadata: Metadata = {
  title: "Build my agenda",
  description: "Go through the day slot by slot and pick what to see.",
};

export default function BuildPage() {
  return (
    <div className="page-wrap builder-page">
      <h1 className="sr-only">Build my agenda</h1>
      <AgendaBuilder />
    </div>
  );
}
