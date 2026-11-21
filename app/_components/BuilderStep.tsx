/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, RefObject } from "react";
import type { Pause, Step } from "../_lib/builder";
import TalkCard from "./TalkCard";

export type BuilderStepProps = {
  step: Step;
  /** the step's own element, for its wrapper to move focus to */
  panelRef: RefObject<HTMLElement | null>;
};

/* One step of the agenda builder: a break, or the sessions to choose from. The cards
   carry no status words here; green is picked, and that's all they need to say. */
export default function BuilderStep({ step, panelRef }: BuilderStepProps) {
  const ref = (el: HTMLElement | null) => {
    panelRef.current = el;
  };
  if (step.pause) return <BreakStep pause={step.pause} panelRef={ref} />;
  return (
    <fieldset ref={ref} tabIndex={-1} className="builder-step">
      <legend className="sr-only">{step.label}</legend>
      <ul className="builder-choices">
        {step.sessions.map((t) => (
          <TalkCard key={t.id} talk={t} status="plain" />
        ))}
      </ul>
    </fieldset>
  );
}

/* Lunch or the afternoon break: the pair of emoji, a heading and a line, nothing to pick. */
function BreakStep({ pause, panelRef }: { pause: Pause; panelRef: (el: HTMLElement | null) => void }) {
  return (
    <section ref={panelRef} tabIndex={-1} className="builder-step builder-break">
      {pause.art.length > 0 && (
        <div
          className="builder-break-art"
          style={{ "--art-w": pause.art.reduce((w, e) => w + e.width, pause.gap * (pause.art.length - 1)), "--gap": pause.gap } as CSSProperties}
        >
          {pause.art.map((e) => (
            <img
              key={e.src}
              src={`/images/emoji/${e.src}.png`}
              alt=""
              style={{ "--w": e.width, "--top": e.top, "--tilt": `${e.tilt}deg` } as CSSProperties}
            />
          ))}
        </div>
      )}
      <h2>{pause.heading}</h2>
      <p>{pause.message}</p>
    </section>
  );
}
