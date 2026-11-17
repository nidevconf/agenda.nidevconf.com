import type { Metadata } from "next";
import SessionList from "../_components/SessionList";

export const metadata: Metadata = {
  title: "Workshops",
  description: "The hands-on workshops at NIDC 2026, all in Room 2A.",
};

export default function WorkshopsPage() {
  return (
    <div className="page-wrap page">
      <header className="page-head">
        <h1>Workshops</h1>
        <p>Hour-long, hands-on sessions, all in Room 2A.</p>
      </header>
      <SessionList filter={(t) => t.format === "Workshop"} />
    </div>
  );
}
