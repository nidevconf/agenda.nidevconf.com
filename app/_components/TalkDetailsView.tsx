import { createPortal } from "react-dom";
import talks from "../_data/talks.json";
import { noun, when } from "../_lib/schedule";
import { AddToAgendaWide } from "./AddToAgenda";
import { SessionBody, SessionTags } from "./SessionWriteup";
import Sheet from "./Sheet";

export type TalkDetailsViewProps = {
  title: string;
  session: (typeof talks)[number];
  open: boolean;
  /** "add": the sheet ends with a button putting the session on your agenda */
  action: "add" | "none";
  onOpen: () => void;
  onClose: () => void;
};

/* A card's title as a button, and the sheet it opens: what the session's about, over
   wherever you are, instead of leaving for /talks. Mid-builder that page was a dead end
   in the installed app, which has no back button. The sheet's button adds it the same
   way the card's + does (through the builder's clash check, when there is one).
   Portalled to <body>, so it doesn't inherit the card's or grid's type sizes and clamps. */
export default function TalkDetailsView({ title, session: s, open, action, onOpen, onClose }: TalkDetailsViewProps) {
  return (
    <>
      <button type="button" className="ag-title ag-link" aria-haspopup="dialog" onClick={onOpen}>
        {title}
      </button>
      {open &&
        createPortal(
          <Sheet title={s.title} description={`${s.track} · ${when(s)}`} onClose={onClose}>
            <div className="details">
              <SessionTags s={s} />
              <SessionBody description={s.description} speakers={s.speakers} />
            </div>
            {action === "add" && <AddToAgendaWide talk={s} what={`this ${noun(s.format)}`} />}
          </Sheet>,
          document.body,
        )}
    </>
  );
}
