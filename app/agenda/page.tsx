import type { Metadata } from "next";
import AgendaDay from "../_components/AgendaDay";

export const metadata: Metadata = { title: "My agenda" };

export default function AgendaPage() {
  return <AgendaDay />;
}
