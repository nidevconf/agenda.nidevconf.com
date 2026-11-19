import talks from "../_data/talks.json";
import SpeakerByline from "./SpeakerByline";

type Talk = (typeof talks)[number];

/* What a session's about, as /talks and /workshops write it up and the details sheet
   repeats it: its tags, then the description and who's giving it. */

// "Read more" sits where the description is cut off, so it reads as one piece rather than
// resuming after the speakers
export function SessionBody({ description, speakers }: { description: string; speakers: Talk["speakers"] }) {
  const [first, ...rest] = description.split(/\n\s*\n/);
  return (
    <>
      <p className="session-desc">{first}</p>
      {rest.length > 0 && (
        <details className="session-more">
          <summary>Read more</summary>
          <p className="session-desc">{rest.join("\n\n")}</p>
        </details>
      )}
      <div className="session-people">
        {speakers.map((p) => (
          <SpeakerByline key={p.name} person={p} bio />
        ))}
      </div>
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
