import type { KeyboardEvent, RefObject } from "react";
import type { Conflict, Step } from "../_lib/builder";
import BuilderStep from "./BuilderStep";
import ClashSheet from "./ClashSheet";

export type AgendaBuilderViewProps = {
  steps: Step[];
  /** the current step's index */
  step: number;
  /** something's chosen for this step: Next rather than Skip */
  busy: boolean;
  conflict: Conflict | null;
  panelRef: RefObject<HTMLElement | null>;
  /** go to step i; past the last one finishes */
  onGo: (i: number) => void;
  onKeyDown: (e: KeyboardEvent) => void;
  onCloseConflict: () => void;
};

/* /agenda/build: the progress (a bar of steps you can jump between, and where you are),
   the current step, and Previous / Skip or Next. Past the last question there's no
   review: your agenda is the review. */
export default function AgendaBuilderView({
  steps,
  step,
  busy,
  conflict,
  panelRef,
  onGo,
  onKeyDown,
  onCloseConflict,
}: AgendaBuilderViewProps) {
  const s = steps[step];
  const last = step === steps.length - 1;
  return (
    <>
      <div className="builder" onKeyDown={onKeyDown}>
        <div className="builder-progress">
          <nav className="builder-bar" aria-label="Steps">
            {/* one segment per step; done and current are filled. Each one jumps
                straight to its step, rather than skipping through to it */}
            {steps.map((x, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to ${x.label}`}
                aria-current={i === step ? "step" : undefined}
                data-done={i <= step ? "" : undefined}
                onClick={() => onGo(i)}
              />
            ))}
          </nav>
          <p>{s.section}</p>
        </div>

        <BuilderStep key={step} step={s} panelRef={panelRef} />

        <div className="builder-actions">
          {step > 0 && (
            <button type="button" className="btn btn-ghost" onClick={() => onGo(step - 1)}>
              Previous
            </button>
          )}
          <button
            type="button"
            className={busy || last ? "btn btn-primary" : "btn btn-secondary"}
            onClick={() => onGo(step + 1)}
          >
            {last ? "See my agenda" : busy ? "Next" : "Skip"}
          </button>
        </div>
      </div>
      {/* the builder never moves on by itself, so a clash here never offers "Keep what I have" */}
      {conflict && <ClashSheet ids={conflict.ids} advance={conflict.advance} onClose={onCloseConflict} onKeep={onCloseConflict} />}
    </>
  );
}
