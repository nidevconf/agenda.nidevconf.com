import { clock, LIVE, noun } from "../_lib/schedule";
import Sheet from "./Sheet";
import TalkCard from "./TalkCard";

export type ClashSheetProps = {
  /** the session you tried to add, then the picks it overlaps */
  ids: string[];
  /** adding it ends the question (/agenda/choose): offers "Keep what I have" too */
  advance: boolean;
  onClose: () => void;
  onKeep: () => void;
};

/* What just happened, and what to do: the session you tapped, what it overlaps. */
function clashLine([id, ...others]: string[], advance: boolean) {
  const added = LIVE.find((t) => t.id === id)!;
  const what =
    others.length === 1
      ? `your ${noun(LIVE.find((t) => t.id === others[0])!.format)}`
      : `${others.length} sessions you've picked`;
  return advance
    ? `This ${noun(added.format)} overlaps ${what}. Tap + to swap it in, or keep what you have and move on.`
    : `This ${noun(added.format)} overlaps ${what}. Tap + to swap it in, or close to keep what you have.`;
}

/* A pick that would clash with one from another step never happens quietly: this sheet
   shows both, and its + swaps (adds this, drops the overlap), so you keep one. */
export default function ClashSheet({ ids, advance, onClose, onKeep }: ClashSheetProps) {
  return (
    <Sheet
      title={`You're already booked at ${clock(LIVE.find((t) => t.id === ids[0])!.start)}`}
      description={clashLine(ids, advance)}
      onClose={onClose}
    >
      <ul>
        {ids.map((id) => (
          <TalkCard key={id} talk={LIVE.find((t) => t.id === id)!} status="plain" swap />
        ))}
      </ul>
      {advance && (
        <button type="button" className="btn btn-secondary sheet-action" onClick={onKeep}>
          Keep what I have
        </button>
      )}
    </Sheet>
  );
}
