import Link from "next/link";
import { type Slot, SLOTS, when } from "../_lib/schedule";

/* A slot on your agenda with nothing in it (nothing picked during its talks): a dashed,
   empty card saying how many sessions are on then (talks, workshops and lightning talks
   alike), opening that slot's question on its own (/agenda/choose). */
export default function FreeSlotCard({ slot }: { slot: Slot }) {
  return (
    <li className="ag-item ag-free">
      <Link className="ag-title ag-link" href={`/agenda/choose?step=${SLOTS.indexOf(slot)}`}>
        Choose what to go to ({slot.sessions.length} options)
      </Link>
      <p className="ag-when">{when(slot)}</p>
    </li>
  );
}
