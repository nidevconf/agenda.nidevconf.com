/* eslint-disable @next/next/no-img-element */
import talks from "../_data/talks.json";
import { large } from "../_lib/photos";
import AddToAgenda from "./AddToAgenda";
import { clock, duration } from "./TalkCard";

const TRACKS = ["Hall 1A", "Hall 1B", "Room 1A", "Room 1B", "Room 2A"];
type Talk = (typeof talks)[number];

/* Sessions in running order, each laid out as nidevconf.com's
   /sessions/<slug> page (its SessionBody): title, meta, speaker cards,
   abstract, bios — plus the add-to-agenda plus beside the title. /talks and /workshops each show a subset. */
export default function SessionList({ filter = () => true }: { filter?: (t: Talk) => boolean }) {
  const sorted = talks
    .filter((t) => !t.withdrawn && filter(t))
    .sort((a, b) => a.start - b.start || TRACKS.indexOf(a.track) - TRACKS.indexOf(b.track));

  return sorted.map((s) => {
    const meta = [`${clock(s.start)} (${duration(s.end - s.start)})`, s.track, s.format, s.level, s.chip]
      .filter(Boolean)
      .join(" · ");
    return (
      <article key={s.id} id={s.slug} className="session">
        <div className="td-head">
          <h2 className="td-title">{s.title}</h2>
          <AddToAgenda talk={s} />
        </div>
        <p className="td-meta">{meta}</p>
        <div className="td-people">
          {s.speakers.map((p) => (
            <figure key={p.name} className="td-person">
              <img src={`/images/speakers/${large(p.photo)}`} alt={p.name} width={800} height={800} loading="lazy" />
              <figcaption>
                <b>{p.name}</b>
                <span>{p.tagline}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="td-desc">{s.description}</p>
        {s.speakers.map((p) => (
          <div key={p.name} className="td-speaker">
            <p className="td-name">{p.name}</p>
            <p className="td-bio">{p.bio}</p>
          </div>
        ))}
      </article>
    );
  });
}
