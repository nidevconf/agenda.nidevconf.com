/* eslint-disable @next/next/no-img-element */
import { SOCIALS } from "../_data/socials";
import { large } from "../_lib/photos";
import type { Speaker } from "../_lib/speakers";
import SpeakerLinks from "./SpeakerLinks";
import TalkCard from "./TalkCard";

/* A speaker as one black card: the photo fades into it, their links stack on the right
   above the name, then the tagline and their talk. Fills whatever height it's given. */
export default function SpeakerCard({ speaker: s }: { speaker: Speaker }) {
  return (
    <div className="deck-tile">
      <div className="deck-photo">
        <img src={`/images/speakers/${large(s.photo)}`} alt="" width={800} height={800} loading="lazy" />
      </div>
      <div className="deck-body">
        <SpeakerLinks name={s.name} links={SOCIALS[s.slug] ?? []} />
        <header className="deck-head">
          <h2>{s.name}</h2>
          <p>{s.tagline}</p>
        </header>
        <div className="deck-foot">
          <TalkCard talk={s.talk} speakers={false} status as="div" />
        </div>
      </div>
    </div>
  );
}
