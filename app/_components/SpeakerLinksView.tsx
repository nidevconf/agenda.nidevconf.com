import { Ellipsis } from "lucide-react";
import type { ReactNode } from "react";
import type { Social } from "../_data/socials";
import LinkList, { LINK_KIND } from "./LinkList";
import Sheet from "./Sheet";

export type SpeakerLinksViewProps = {
  name: string;
  /** ordered: the first one gets its own button (LinkedIn when they have it) */
  links: [Social, string][];
  /** a row on a surface, rather than a column over a photo */
  row?: boolean;
  /** buttons above the links (the speaker card's copy link), shown even with no links */
  children?: ReactNode;
  moreOpen: boolean;
  onOpenMore: () => void;
  onCloseMore: () => void;
};

/* A speaker's links as round buttons: the first link, and "…" opening a sheet with all
   of them when there's more than one. */
export default function SpeakerLinksView({ name, links, row, children, moreOpen, onOpenMore, onCloseMore }: SpeakerLinksViewProps) {
  if (!links.length && !children) return null;
  const first = links[0] && { href: links[0][1], ...LINK_KIND[links[0][0]] };
  return (
    <div className={row ? "deck-rail deck-rail-row" : "deck-rail"}>
      {children}
      {first && (
        <a className="deck-round" href={first.href} target="_blank" rel="noopener noreferrer" aria-label={`${name} on ${first.label}`} title={first.label}>
          <first.Icon size={20} aria-hidden />
        </a>
      )}
      {links.length > 1 && (
        <>
          <button type="button" className="deck-round" aria-label={`All of ${name}'s links`} title="More links" onClick={onOpenMore}>
            <Ellipsis size={20} aria-hidden />
          </button>
          {moreOpen && (
            <Sheet title={name} onClose={onCloseMore}>
              <LinkList links={links.map(([kind, url]) => ({ kind, url }))} />
            </Sheet>
          )}
        </>
      )}
    </div>
  );
}
