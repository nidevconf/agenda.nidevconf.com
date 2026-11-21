/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maps",
  description: "Floor maps for NIDC 2026 at the ICC Belfast: registration, talks, villages, exhibitors and support rooms across Levels 0 to 3.",
};

/* Ported from nidevconf.com/maps: the same four floor maps (public/images/maps, 1920×1045). */
const levels = [
  {
    id: "level-0",
    title: "Level 0",
    subtitle: "Registration",
    alt: "Level 0 floor map: Registration at the top of the escalators, the Riverside Entrance, lifts, toilets and Changing Places toilet. Waterfront Hall is shown for reference only.",
  },
  {
    id: "level-1",
    title: "Level 1",
    subtitle: "Talks, Villages & Exhibition Hall",
    alt: "Level 1 floor map: the Retro, Maker and Security villages, the Info Desk, Exhibitors and Catering, and the Hall 1A and Hall 1B talk tracks.",
  },
  {
    id: "level-2",
    title: "Level 2",
    subtitle: "Support Rooms",
    alt: "Level 2 floor map: the Quiet Room, Speaker Green Room and Breastfeeding Space.",
  },
  {
    id: "level-3",
    title: "Level 3",
    subtitle: "Talks, Labs and Childcare",
    alt: "Level 3 floor map: Conference Room 1A and 1B talk tracks, Conference Room 2A workshops, the Kids' Village and the quiet and main childcare rooms.",
  },
];

export default function MapsPage() {
  return (
    <div className="page-wrap page">
      <header className="page-head">
        <h1>Maps</h1>
        <p>Lost? Don’t be a stranger: check the map or ask a volunteer.</p>
      </header>

      <nav className="btn-row maps-jump" aria-label="Jump to a map">
        {levels.map((m) => (
          <a key={m.id} className="btn btn-secondary btn-sm" href={`#${m.id}`}>
            {m.title}
          </a>
        ))}
      </nav>

      {levels.map((m, i) => (
        <section key={m.id} id={m.id} className="venue-map">
          <h2>{m.title}</h2>
          <p>{m.subtitle}</p>
          <a href={`/images/maps/${m.id}.png`} aria-label={`Open the ${m.title} map full size`}>
            <img
              src={`/images/maps/${m.id}.png`}
              width={1920}
              height={1045}
              alt={m.alt}
              loading={i === 0 ? undefined : "lazy"}
            />
          </a>
        </section>
      ))}
    </div>
  );
}
