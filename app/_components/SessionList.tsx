import talks from "../_data/talks.json";
import SpeakerByline from "./SpeakerByline";
import TalkCard, { clock } from "./TalkCard";

const TRACKS = ["Hall 1A", "Hall 1B", "Room 1A", "Room 1B", "Room 2A"];
type Talk = (typeof talks)[number];

/* Sessions in running order, grouped by start time. Each one is the talk card (with its
   status, so going/clash/miss read the same as on the speaker cards), what it's about,
   and who's giving it. /talks and /workshops each show a subset. */
/* The opening paragraph and who's speaking show straight away; the rest of the
   description and the bios sit behind "Read more", so a slot scans as a list. */
function SessionBody({ description, speakers }: { description: string; speakers: Talk["speakers"] }) {
  const [first, ...rest] = description.split(/\n\s*\n/);
  const more = rest.length > 0 || speakers.some((p) => p.bio);
  return (
    <>
      <p className="session-desc">{first}</p>
      <div className="session-people">
        {speakers.map((p) => (
          <SpeakerByline key={p.name} person={p} />
        ))}
      </div>
      {more && (
        <details className="session-more">
          <summary>Read more</summary>
          {rest.length > 0 && <p className="session-desc">{rest.join("\n\n")}</p>}
          {speakers
            .filter((p) => p.bio)
            .map((p) => (
              <div key={p.name} className="session-bio">
                <h3>About {p.name}</h3>
                <p>{p.bio}</p>
              </div>
            ))}
        </details>
      )}
    </>
  );
}

export default function SessionList({ filter = () => true }: { filter?: (t: Talk) => boolean }) {
  const sorted = talks
    .filter((t) => !t.withdrawn && filter(t))
    .sort((a, b) => a.start - b.start || TRACKS.indexOf(a.track) - TRACKS.indexOf(b.track));
  const slots = [...new Set(sorted.map((t) => t.start))];

  return slots.map((start) => (
    <section key={start} className="slot">
      <h2 className="slot-time">{clock(start)}</h2>
      {sorted
        .filter((t) => t.start === start)
        .map((s) => (
          <article key={s.id} id={s.slug} className="session">
            <TalkCard talk={s} speakers={false} status as="div" />
            <ul className="tags" aria-label="About this session">
              {[s.format === "Lightning" ? "Lightning talk" : s.format, s.level, s.chip].filter(Boolean).map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <SessionBody description={s.description} speakers={s.speakers} />
          </article>
        ))}
    </section>
  ));
}
