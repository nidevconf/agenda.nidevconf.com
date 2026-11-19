import talks from "../_data/talks.json";
import SpeakerByline from "./SpeakerByline";

type Talk = (typeof talks)[number];

/* What a session's about, as /talks and /workshops write it up and the details sheet
   repeats it: its tags, then the description and who's giving it. */

/* The opening paragraph and who's speaking show straight away; the rest of the
   description and the bios sit behind "Read more", so a slot scans as a list. */
export function SessionBody({ description, speakers }: { description: string; speakers: Talk["speakers"] }) {
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

/** Format, level and topic, as a row of tags. */
export const SessionTags = ({ s }: { s: Talk }) => (
  <ul className="tags" aria-label="About this session">
    {[s.format === "Lightning" ? "Lightning talk" : s.format, s.level, s.chip].filter(Boolean).map((t) => (
      <li key={t}>{t}</li>
    ))}
  </ul>
);
