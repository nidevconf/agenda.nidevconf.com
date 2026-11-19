"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { filled, parseStep, STEPS, useClashGuard } from "../_lib/builder";
import { readPicks } from "../_lib/picks";
import { AddGuard } from "./AddToAgenda";
import AgendaBuilderView from "./AgendaBuilderView";

/* /agenda/build's state: which step you're on (in the URL, ?step=N), your picks, and a
   clash being resolved. Every tap saves: the picks here are your agenda itself, so
   finishing just takes you to it. Picking never moves you on: you see your pick turn
   green and press Next yourself. Render inside <Suspense> (useSearchParams). */
export default function AgendaBuilder() {
  const router = useRouter();
  const fromUrl = parseStep(useSearchParams().get("step"), STEPS.length);
  const step = fromUrl ?? 0;
  const { picks, conflict, beforeAdd, afterAdd, closeConflict } = useClashGuard(STEPS[step].sessions);
  // nothing renders until mounted: the picks are only known in the browser
  const [ready, setReady] = useState(false);
  const panelRef = useRef<HTMLElement>(null);

  // without a step in the URL it picks up at the first step you've nothing on yet, so
  // leaving mid-way (the installed app has no back button) and coming back through the
  // menu carries on where you were, not from the top. Once, on arrival.
  useEffect(() => {
    if (ready) return;
    if (fromUrl === null) {
      const open = STEPS.findIndex((x) => !filled(x, readPicks()));
      if (open > 0) return go(open); // ready once it's in the URL
    }
    setReady(true);
  }, [fromUrl, ready]);
  // a step starts at the top, progress showing; focus moves to it without its own scroll
  useEffect(() => {
    if (!ready) return;
    panelRef.current?.focus({ preventScroll: true });
    scrollTo({ top: 0 });
  }, [step, ready]);

  // replaceState, so each step isn't a back-button stop. Pass null, not history.state:
  // Next copies its own state across itself, and only updates useSearchParams for a call
  // that isn't carrying its internal state (node_modules/next/.../app-router.js)
  function go(to: number) {
    if (to >= STEPS.length) return router.push("/agenda");
    history.replaceState(null, "", to > 0 ? `?step=${to}` : location.pathname);
  }

  // shadcn's key map: number keys pick a session, ← and → move, Cmd/Ctrl+Enter finishes
  function onKeyDown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") return go(STEPS.length);
    if (conflict || (e.target instanceof HTMLElement && e.target.closest("dialog"))) return;
    if (e.key === "ArrowRight") go(step + 1);
    else if (e.key === "ArrowLeft") go(Math.max(0, step - 1));
    else if (/^[1-9]$/.test(e.key)) panelRef.current?.querySelectorAll<HTMLButtonElement>(".fav")[+e.key - 1]?.click();
  }

  if (!ready) return null;
  return (
    <AddGuard value={{ beforeAdd, afterAdd }}>
      <AgendaBuilderView
        steps={STEPS}
        step={step}
        busy={filled(STEPS[step], picks)}
        conflict={conflict}
        panelRef={panelRef}
        onGo={(i) => go(Math.max(0, i))}
        onKeyDown={onKeyDown}
        onCloseConflict={closeConflict}
      />
    </AddGuard>
  );
}
