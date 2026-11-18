"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { setPicks, usePicks } from "../_lib/picks";
import {
  byTime,
  clock,
  LIVE,
  noun,
  overlaps,
  type Session,
} from "../_lib/schedule";
import { AddGuard } from "./AddToAgenda";
import Sheet from "./Sheet";
import TalkCard from "./TalkCard";

/* The day as a questionnaire in three sections: the workshops (all of them, pick any),
   then the talks one time slot at a time, then the lightning talks (all of them, pick any).
   A clash never happens quietly: adding something that overlaps a pick opens "Choose a
   session" with both, and you keep one. The cards carry no status words here; green is
   picked, and that's all they need to say. */
type Step = {
  section: string;
  question: string;
  sessions: Session[];
  talks: boolean;
};
const talkStarts = [
  ...new Set(LIVE.filter((t) => t.format === "Talk").map((t) => t.start)),
].sort((a, b) => a - b);
const STEPS: Step[] = [
  {
    section: "Workshops",
    question: "Which workshops will you go to?",
    sessions: LIVE.filter((t) => t.format === "Workshop").sort(byTime),
    talks: false,
  },
  ...talkStarts.map((start, i) => ({
    section: `Talks ${i + 1} of ${talkStarts.length}`,
    question: `What will you see at ${clock(start)}?`,
    sessions: LIVE.filter((t) => t.format === "Talk" && t.start === start).sort(
      byTime,
    ),
    talks: true,
  })),
  {
    section: "Lightning talks",
    question: "Which lightning talks will you go to?",
    sessions: LIVE.filter((t) => t.format === "Lightning").sort(byTime),
    talks: false,
  },
];

/* What just happened, and what to do: the session you tapped, what it overlaps. */
function clashLine([id, ...others]: string[], advance = false) {
  const added = LIVE.find((t) => t.id === id)!;
  const what =
    others.length === 1
      ? `your ${noun(LIVE.find((t) => t.id === others[0])!.format)}`
      : `${others.length} sessions you've picked`;
  return advance
    ? `This ${noun(added.format)} overlaps ${what}. Tap + to swap it in, or keep what you have and move on.`
    : `This ${noun(added.format)} overlaps ${what}. Tap + to swap it in, or close to keep what you have.`;
}

/** The builder step for the talk slot starting at `start` (for linking straight to it). */
export const talkStep = (start: number) =>
  STEPS.findIndex((x) => x.talks && x.sessions[0]?.start === start);

/* `single`: one question on its own (/agenda/choose?step=N, from an empty slot on your
   agenda), the same screen without the questionnaire around it: no progress, no
   Previous/Next. Choosing (or resolving the clash) takes you back to your agenda. */
export default function AgendaBuilder({ single }: { single?: boolean }) {
  const router = useRouter();
  // every tap saves: the picks here are your agenda itself
  const draft = usePicks();
  // nothing renders until mounted: the picks and the ?step= are only known in the browser
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  // the sessions in a clash being resolved: the one you tried to add, then what it overlaps
  const [conflict, setConflict] = useState<{
    ids: string[];
    advance: boolean;
  } | null>(null);
  const panel = useRef<HTMLFieldSetElement>(null);

  // opening it starts at the first question; coming back to it (the browser's back button
  // after tapping into a talk) returns to the question you left, which rides in the URL
  useEffect(() => {
    setReady(true);
    const q = Number(new URLSearchParams(location.search).get("step"));
    if (Number.isInteger(q) && q > 0 && q < STEPS.length) setStep(q);
  }, []);
  useEffect(() => {
    if (single) return; // the slot is fixed by the link
    // replaceState, keeping Next's own history state, so each step isn't a back-button stop
    history.replaceState(
      history.state,
      "",
      step ? `?step=${step}` : location.pathname,
    );
  }, [step]);
  // a new step starts at the top, progress showing; focus moves to it without its own scroll
  useEffect(() => {
    panel.current?.focus({ preventScroll: true });
    scrollTo({ top: 0 });
  }, [step]);

  useEffect(() => {
    if (conflict?.advance && draft.includes(conflict.ids[0])) {
      setConflict(null);
      moveOn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draft]);

  if (!ready) return null;
  const picked = (ids: string[]) =>
    LIVE.filter((t) => draft.includes(t.id) && ids.includes(t.id));
  // past the last question there's no review: your agenda is the review
  const go = (to: number) =>
    to >= STEPS.length ? finish() : setStep(Math.max(0, to));

  // everything is already saved, so finishing just takes you to your agenda
  function finish() {
    if (single && history.length > 1) router.back();
    else router.push("/agenda");
  }

  // shadcn's key map: number keys pick a session, ← and → move, Cmd/Ctrl+Enter finishes
  function onKeyDown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") return finish();
    if (
      conflict ||
      (e.target instanceof HTMLElement && e.target.closest("dialog"))
    )
      return;
    if (e.key === "ArrowRight") go(step + 1);
    else if (e.key === "ArrowLeft") go(step - 1);
    else if (/^[1-9]$/.test(e.key))
      panel.current
        ?.querySelectorAll<HTMLButtonElement>(".fav")
        [+e.key - 1]?.click();
  }

  const s = STEPS[step];
  const mine = picked(s.sessions.map((t) => t.id));
  // in a talk slot, something already picked that runs through it (a workshop, a lightning talk)
  const busy = !s.talks
    ? undefined
    : LIVE.find(
        (t) =>
          draft.includes(t.id) &&
          t.format !== "Talk" &&
          s.sessions.some((x) => overlaps(t, x)),
      );

  /* Before a talk is added. In a talk slot (one choice): another talk in the same slot is
     simply swapped out, and you're moved on to the next slot. A clash with anything else
     (a workshop, a lightning talk) opens the sheet; choosing there, or keeping what you
     have, also moves you on. In the workshop and lightning steps (pick any) a clash opens
     the sheet and you stay put. */
  function guard(t: { id: string; start: number; end: number }) {
    const over = LIVE.filter(
      (o) => draft.includes(o.id) && o.id !== t.id && overlaps(o, t),
    ).sort((a, b) => a.start - b.start);
    const single = s.talks && s.sessions.some((x) => x.id === t.id);
    const elsewhere = single
      ? over.filter((o) => !s.sessions.some((x) => x.id === o.id))
      : over;
    if (elsewhere.length) {
      setConflict({
        ids: [t.id, ...elsewhere.map((o) => o.id)],
        advance: single,
      });
      return true;
    }
    if (!single) return false;
    setPicks([...draft.filter((id) => !over.some((o) => o.id === id)), t.id]);
    moveOn();
    return true;
  }
  // a beat to see it turn green, then on
  function moveOn() {
    setTimeout(
      () => (single || step + 1 >= STEPS.length ? finish() : setStep(step + 1)),
      280,
    );
  }

  return (
    <AddGuard value={guard}>
      <div className="builder" onKeyDown={single ? undefined : onKeyDown}>
        {!single && (
          <div className="builder-progress">
            <div
              className="builder-bar"
              role="progressbar"
              aria-label="Building your agenda"
              aria-valuemin={1}
              aria-valuemax={STEPS.length}
              aria-valuenow={step + 1}
              aria-valuetext={s.section}
            >
              {/* one segment per question; done and current are filled */}
              {STEPS.map((_, i) => (
                <span key={i} data-done={i <= step ? "" : undefined} />
              ))}
            </div>
            <p>{s.section}</p>
          </div>
        )}

        <fieldset ref={panel} tabIndex={-1} className="builder-step" key={step}>
          <legend>{s.question}</legend>
          <ul className="builder-choices">
            {s.sessions.map((t: Session) => (
              <TalkCard key={t.id} talk={t} status="plain" />
            ))}
          </ul>
        </fieldset>

        {single ? (
          <div className="builder-actions">
            <span className="builder-spacer" />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={finish}
            >
              Back to my agenda
            </button>
          </div>
        ) : (
          <div className="builder-actions">
            {step > 0 && (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => go(step - 1)}
              >
                Previous
              </button>
            )}
            <span className="builder-spacer" />
            <button
              type="button"
              className={
                mine.length || busy || step === STEPS.length - 1
                  ? "btn btn-primary"
                  : "btn btn-secondary"
              }
              onClick={() => go(step + 1)}
            >
              {step === STEPS.length - 1
                ? "See my agenda"
                : mine.length || busy
                  ? "Next"
                  : "Skip"}
            </button>
          </div>
        )}
      </div>
      {conflict && (
        <Sheet
          title={`You're already booked at ${clock(LIVE.find((t) => t.id === conflict.ids[0])!.start)}`}
          description={clashLine(conflict.ids, conflict.advance)}
          onClose={() => setConflict(null)}
        >
          <ul>
            {conflict.ids.map((id) => (
              <TalkCard
                key={id}
                talk={LIVE.find((t) => t.id === id)!}
                status="plain"
                swap
              />
            ))}
          </ul>
          {conflict.advance && (
            <button
              type="button"
              className="btn btn-secondary sheet-action"
              onClick={() => {
                setConflict(null);
                moveOn();
              }}
            >
              Keep what I have
            </button>
          )}
        </Sheet>
      )}
    </AddGuard>
  );
}
