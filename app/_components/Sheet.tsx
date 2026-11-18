"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

/* The bottom sheet: a native modal <dialog> pinned to the foot of the screen. It opens
   when mounted, so render it only while it's open. Closes on ×, Esc or a tap on the
   backdrop, and reports that through onClose. Focus lands on the sheet itself, not its
   first button (that drew a focus ring the moment it opened). */
export default function Sheet({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  /** a line under the title: what just happened, what to do */
  description?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) {
      d.showModal();
      d.focus();
    }
  }, []);
  return (
    <dialog ref={ref} tabIndex={-1} className="sheet" onClose={onClose} onClick={(e) => e.target === ref.current && ref.current.close()}>
      <div className="sheet-body">
        <div className="sheet-head">
          <div>
            <h2>{title}</h2>
            {description && <p className="sheet-desc">{description}</p>}
          </div>
          <button type="button" className="sheet-close" aria-label="Close" onClick={() => ref.current?.close()}>
            <X size={16} aria-hidden />
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
