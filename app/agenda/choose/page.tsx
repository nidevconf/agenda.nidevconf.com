import type { Metadata } from "next";
import { Suspense } from "react";
import ChooseSlot from "../../_components/ChooseSlot";

export const metadata: Metadata = { title: "Choose a talk", robots: { index: false } };

/* One question from the agenda builder, on its own: the slot comes from ?step=N (an
   empty slot on /agenda links here). */
export default function ChoosePage() {
  return (
    <div className="page-wrap builder-page">
      <h1 className="sr-only">Choose a talk</h1>
      {/* the slot is in the URL (useSearchParams), so this renders in the browser */}
      <Suspense>
        <ChooseSlot />
      </Suspense>
    </div>
  );
}
