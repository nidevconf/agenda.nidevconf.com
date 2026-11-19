import talks from "../_data/talks.json";
import { SessionBody, SessionTags } from "./SessionWriteup";
import { byTime, clock } from "../_lib/schedule";
import TalkCard from "./TalkCard";

type Talk = (typeof talks)[number];

/* Sessions in running order, grouped by start time. Each one is the talk card (with its
   status, so going/clash/miss read the same as on the speaker cards), what it's about,
   and who's giving it. /talks and /workshops each show a subset. */
export default function SessionList({ filter = () => true }: { filter?: (t: Talk) => boolean }) {
  const sorted = talks
    .filter((t) => !t.withdrawn && filter(t))
    .sort(byTime);
  const slots = [...new Set(sorted.map((t) => t.start))];

  return slots.map((start) => (
    <section key={start} className="slot">
      <h2 className="slot-time">{clock(start)}</h2>
      {sorted
        .filter((t) => t.start === start)
        .map((s) => (
          <article key={s.id} id={s.slug} className="session">
            <TalkCard talk={s} speakers={false} status details={false} as="div" />
            <SessionTags s={s} />
            <SessionBody description={s.description} speakers={s.speakers} />
          </article>
        ))}
    </section>
  ));
}
