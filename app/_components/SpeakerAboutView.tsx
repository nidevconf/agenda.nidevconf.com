import { createPortal } from "react-dom";
import type { Speaker } from "../_lib/speakers";
import Sheet from "./Sheet";
import SpeakerByline from "./SpeakerByline";

export type SpeakerAboutViewProps = {
  speaker: Speaker;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

/* Portalled to <body>: inside the speaker card the bio would take the card's two-line clamp. */
export default function SpeakerAboutView({ speaker, open, onOpen, onClose }: SpeakerAboutViewProps) {
  return (
    <>
      <button type="button" className="btn btn-link deck-about" aria-haspopup="dialog" onClick={onOpen}>
        About
      </button>
      {open &&
        createPortal(
          <Sheet title="About" onClose={onClose}>
            <div className="details">
              <SpeakerByline person={speaker} bio />
            </div>
          </Sheet>,
          document.body,
        )}
    </>
  );
}
