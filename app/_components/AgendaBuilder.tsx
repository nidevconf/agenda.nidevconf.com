"use client";

/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { readPicks, setPicks, usePicks } from "../_lib/picks";
import { BANDS, byTime, clock, duration, LIVE, noun, overlaps, type Session, SLOTS, spoken } from "../_lib/schedule";
import { AddGuard } from "./AddToAgenda";
import Sheet from "./Sheet";
import TalkCard from "./TalkCard";

/* The builder asks by format, in this order: one question for the day's workshops, then
   one per talk slot in running order: that slot's talks, then the lightning talks that
   start during it (three a slot, in the afternoon). Lunch and the afternoon break come
   in between as steps of their own: a line of encouragement, nothing to pick, just Next. Picking never moves you on: you see your pick turn
   green and press Next yourself. Within a question a new pick replaces what it overlaps
   there; a clash with a pick from another question never happens quietly: it opens the
   sheet with both, and you keep one. The cards carry no status words here; green is
   picked, and that's all they need to say. */
type Step = {
  label: string; // "Talks at 2:30pm": the step's name in the progress line and bar
  section: string;
  sessions: Session[];
  pause?: Pause; // a break: shown instead of choices
  // done once one of its own sessions is picked (workshops); otherwise
  // once anything picked is on during it (a talk slot can be filled by a workshop)
  byPick?: boolean;
};
const numbered = (steps: Omit<Step, "section">[]): Step[] =>
  steps.map((x, i) => ({ ...x, section: `${x.label}, step ${i + 1} of ${steps.length}` }));

const WORKSHOPS = LIVE.filter((t) => t.format === "Workshop").sort(byTime);
/* The breaks that get a step, by their title in bands.json, and what they say. Above the
   heading, two emoji (public/images/emoji), left to right, measured off the design
   references in px: width, how far below the top of the pair each one hangs, its tilt,
   and the gap between them. On a phone too narrow for the pair, all of it scales down
   together. */
type Emoji = { src: string; width: number; top: number; tilt: number };
type Pause = { heading: string; message: string; art: Emoji[]; gap: number };
const PAUSES: Record<string, Pause> = {
  Lunch: {
    heading: "Lunch",
    message: "Time to recharge. Grab some lunch and catch up with the people you met this morning.",
    // small top left, big beside it, both upright
    art: [
      { src: "sandwich", width: 39, top: 7, tilt: 0 },
      { src: "yum", width: 106, top: 0, tilt: 0 },
    ],
    gap: 3,
  },
  "Afternoon break": {
    heading: "Break",
    message: "Grab a coffee and a traybake. You've earned it.",
    // big tipped left, small tipped right and hanging a little lower
    art: [
      { src: "coffee", width: 88, top: 0, tilt: -3 },
      { src: "speech_balloon", width: 73, top: 8.5, tilt: 6 },
    ],
    gap: 15,
  },
};
const STEPS = numbered([
  ...(WORKSHOPS.length
    ? [{ label: "Workshops", sessions: WORKSHOPS, byPick: true }]
    : []),
  ...[
    ...SLOTS.map((sl) => ({
      start: sl.start,
      label: `Talks at ${spoken(sl.start)}`,
      sessions: [
        ...sl.sessions.filter((t) => t.format === "Talk"),
        // started in this slot, not running into it from the one before
        ...sl.sessions.filter((t) => t.format === "Lightning" && t.start >= sl.start),
      ],
    })),
    ...BANDS.filter((b) => PAUSES[b.title]).map((b) => ({
      start: b.start,
      label: `${b.title} at ${spoken(b.start)} (${duration(b.end - b.start)})`,
      sessions: [],
      pause: PAUSES[b.title],
    })),
  ]
    .sort((a, b) => a.start - b.start)
    .map(({ start: _, ...x }) => x),
]);
// every session in some step, or the builder can't offer it. Breaks the build, not the page.
if (LIVE.some((t) => !STEPS.some((x) => x.sessions.includes(t))))
  throw new Error("a session is in no builder step");

/* A slot's question on its own (/agenda/choose?step=N, N indexing SLOTS, from an empty
   slot on your agenda): everything on at any point in it, workshops first, then talks,
   then lightning talks, running order within each. */
const FORMATS = ["Workshop", "Talk", "Lightning"];
const byFormat = (a: Session, b: Session) => FORMATS.indexOf(a.format) - FORMATS.indexOf(b.format);
const SLOT_STEPS = numbered(
  SLOTS.map((sl) => ({
    label: `Talks at ${spoken(sl.start)}`,
    sessions: [...sl.sessions].sort(byFormat), // stable, so byTime holds within a format
  })),
);

const filled = (x: Step, picks: string[]) =>
  x.pause // a break has nothing to answer
    ? true
    : x.byPick
    ? x.sessions.some((t) => picks.includes(t.id))
    : LIVE.some((t) => picks.includes(t.id) && x.sessions.some((y) => overlaps(t, y)));

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
  const panel = useRef<HTMLDivElement & HTMLFieldSetElement>(null);
  const steps = single ? SLOT_STEPS : STEPS;

  // the question in the URL (?step=, from an empty slot on your agenda, or the back
  // button) wins; otherwise it picks up at the first slot you've nothing on yet, so
  // leaving mid-way (the installed app has no back button) and coming back through the
  // menu carries on where you were, not from the top
  useEffect(() => {
    setReady(true);
    const q = Number(new URLSearchParams(location.search).get("step"));
    if (Number.isInteger(q) && q > 0 && q < steps.length) return setStep(q);
    if (single) return;
    const mine = readPicks();
    const open = steps.findIndex((x) => !filled(x, mine));
    if (open > 0) setStep(open);
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
  // past the last question there's no review: your agenda is the review
  const go = (to: number) =>
    to >= steps.length ? finish() : setStep(Math.max(0, to));

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

  const s = steps[step];
  const busy = filled(s, draft);

  /* Before a session is added: what it overlaps in this slot it replaces (you're
     choosing here, and you can see the old pick un-green); what it overlaps from another
     slot opens the sheet. In the builder you stay on the step. A talk chosen on its own
     (`single`, /agenda/choose) takes you back to your agenda (choosing in the sheet, or
     keeping what you have, also does). */
  function guard(t: { id: string; start: number; end: number }) {
    const advance = !!single && LIVE.find((x) => x.id === t.id)?.format === "Talk";
    const over = LIVE.filter(
      (o) => draft.includes(o.id) && o.id !== t.id && overlaps(o, t),
    ).sort((a, b) => a.start - b.start);
    const elsewhere = over.filter((o) => !s.sessions.some((x) => x.id === o.id));
    if (elsewhere.length) {
      setConflict({ ids: [t.id, ...elsewhere.map((o) => o.id)], advance });
      return true;
    }
    setPicks([...draft.filter((id) => !over.some((o) => o.id === id)), t.id]);
    if (advance) moveOn();
    return true;
  }
  // a beat to see it turn green, then on
  function moveOn() {
    setTimeout(
      () => (single || step + 1 >= steps.length ? finish() : setStep(step + 1)),
      280,
    );
  }

  return (
    <AddGuard value={guard}>
      <div className="builder" onKeyDown={single ? undefined : onKeyDown}>
        {!single && (
          <div className="builder-progress">
            <nav className="builder-bar" aria-label="Slots">
              {/* one segment per question; done and current are filled. Each one jumps
                  straight to its slot, rather than skipping through to it */}
              {steps.map((x, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to ${x.label}`}
                  aria-current={i === step ? "step" : undefined}
                  data-done={i <= step ? "" : undefined}
                  onClick={() => setStep(i)}
                />
              ))}
            </nav>
            <p>{s.section}</p>
          </div>
        )}

        {s.pause ? (
          <div ref={panel} tabIndex={-1} className="builder-step builder-break" key={step}>
            <div
              className="builder-break-art"
              aria-hidden
              style={{
                "--art-w": s.pause.art.reduce((w, e) => w + e.width, s.pause.gap),
                "--gap": s.pause.gap,
              } as CSSProperties}
            >
              {s.pause.art.map((e) => (
                <img
                  key={e.src}
                  src={`/images/emoji/${e.src}.png`}
                  alt=""
                  style={{ "--w": e.width, "--top": e.top, "--tilt": `${e.tilt}deg` } as CSSProperties}
                />
              ))}
            </div>
            <h2>{s.pause.heading}</h2>
            <p>{s.pause.message}</p>
          </div>
        ) : (
          <fieldset ref={panel} tabIndex={-1} className="builder-step" key={step}>
            <legend className="sr-only">{s.label}</legend>
            <ul className="builder-choices">
              {s.sessions.map((t: Session) => (
                <TalkCard key={t.id} talk={t} status="plain" />
              ))}
            </ul>
          </fieldset>
        )}

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
                busy || step === steps.length - 1
                  ? "btn btn-primary"
                  : "btn btn-secondary"
              }
              onClick={() => go(step + 1)}
            >
              {step === steps.length - 1
                ? "See my agenda"
                : busy
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
