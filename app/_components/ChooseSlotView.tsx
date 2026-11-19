import type { RefObject } from "react";
import type { Conflict, Step } from "../_lib/builder";
import BuilderStep from "./BuilderStep";
import ClashSheet from "./ClashSheet";

export type ChooseSlotViewProps = {
  step: Step;
  conflict: Conflict | null;
  panelRef: RefObject<HTMLElement | null>;
  /** back to your agenda */
  onFinish: () => void;
  onCloseConflict: () => void;
  /** "Keep what I have" in the clash sheet */
  onKeep: () => void;
};

/* /agenda/choose: one slot's question on its own, from an empty slot on your agenda. The
   builder's step without the questionnaire around it: no progress, no Previous/Next,
   just the way back to your agenda. */
export default function ChooseSlotView({ step, conflict, panelRef, onFinish, onCloseConflict, onKeep }: ChooseSlotViewProps) {
  return (
    <>
      <div className="builder">
        <BuilderStep step={step} panelRef={panelRef} />
        <div className="builder-actions">
          <button type="button" className="btn btn-secondary" onClick={onFinish}>
            Back to my agenda
          </button>
        </div>
      </div>
      {conflict && <ClashSheet ids={conflict.ids} advance={conflict.advance} onClose={onCloseConflict} onKeep={onKeep} />}
    </>
  );
}
