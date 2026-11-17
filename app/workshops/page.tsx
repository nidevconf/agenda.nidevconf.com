import type { Metadata } from "next";
import SessionList from "../_components/SessionList";

export const metadata: Metadata = {
  title: "Workshops",
  description: "The hands-on workshops at NIDC 2026, all in Room 2A.",
};

export default function WorkshopsPage() {
  return (
    <div className="page-wrap sessions">
      <h1 className="sec-title">Workshops</h1>
      <p className="page-lead">Hour-long, hands-on sessions, all in Room 2A.</p>
      <SessionList filter={(t) => t.format === "Workshop"} />
    </div>
  );
}
