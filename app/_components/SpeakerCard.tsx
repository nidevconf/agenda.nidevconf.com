/* eslint-disable @next/next/no-img-element */
import { SOCIALS } from "../_data/socials";
import { large } from "../_lib/photos";
import type { Speaker } from "../_lib/speakers";
import SpeakerLinks from "./SpeakerLinks";
import SpeakerCopyLink from "./SpeakerCopyLink";
import SpeakerAbout from "./SpeakerAbout";
import TalkCard from "./TalkCard";

/* Fills whatever height it's given: the deck sets it to one screen. */
export default function SpeakerCard({ speaker: s }: { speaker: Speaker }) {
  return (
    <div className="deck-tile">
      <div className="deck-photo">
        <img src={`/images/speakers/${large(s.photo)}`} alt="" width={800} height={800} loading="lazy" />
      </div>
      <div className="deck-body">
        <SpeakerLinks name={s.name} links={SOCIALS[s.slug] ?? []}>
          <SpeakerCopyLink name={s.name} slug={s.slug} />
        </SpeakerLinks>
        <header className="deck-head">
          <h2>{s.name}</h2>
          <p>{s.tagline}</p>
          <SpeakerAbout speaker={s} />
        </header>
        <div className="deck-foot">
          <TalkCard talk={s.talk} speakers={false} status as="div" />
        </div>
      </div>
    </div>
  );
}
