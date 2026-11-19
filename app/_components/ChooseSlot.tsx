"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { parseStep, SLOT_STEPS, useClashGuard } from "../_lib/builder";
import { AddGuard } from "./AddToAgenda";
import ChooseSlotView from "./ChooseSlotView";

/* /agenda/choose's state: the slot (?step=N, N indexing SLOTS, from an empty slot on your
   agenda) and a clash being resolved. Choosing a talk, or resolving the clash, takes you
   back to your agenda. Render inside <Suspense> (useSearchParams). */
export default function ChooseSlot() {
  const router = useRouter();
  const step = SLOT_STEPS[parseStep(useSearchParams().get("step"), SLOT_STEPS.length) ?? 0];
  const { conflict, beforeAdd, afterAdd, closeConflict } = useClashGuard(step.sessions, moveOn);
  // nothing renders until mounted: the picks are only known in the browser
  const [ready, setReady] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => setReady(true), []);
  useEffect(() => {
    if (ready) panelRef.current?.focus({ preventScroll: true });
  }, [ready]);

  // everything is already saved, so finishing is just going back
  function finish() {
    if (history.length > 1) router.back();
    else router.push("/agenda");
  }
  // a beat to see it turn green, then back
  function moveOn() {
    setTimeout(finish, 280);
  }

  if (!ready) return null;
  return (
    <AddGuard value={{ beforeAdd, afterAdd }}>
      <ChooseSlotView
        step={step}
        conflict={conflict}
        panelRef={panelRef}
        onFinish={finish}
        onCloseConflict={closeConflict}
        onKeep={() => {
          closeConflict();
          moveOn();
        }}
      />
    </AddGuard>
  );
}
