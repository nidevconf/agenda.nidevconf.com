import talks from "../_data/talks.json";

export function slugify(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type Speaker = {
  slug: string;
  name: string;
  tagline: string;
  bio: string;
  photo: string;
  talk: {
    id: string;
    slug: string;
    title: string;
    description: string;
    start: number;
    end: number;
    track: string;
    format: string;
    coSpeakers: { name: string; slug: string }[];
  };
};

// withdrawn talks stay in talks.json (so later talks keep their bit index)
// but are never shown.
export const SPEAKERS: Speaker[] = talks
  .filter((t) => !t.withdrawn)
  .flatMap((t) =>
    t.speakers.map((p) => ({
    slug: slugify(p.name),
    name: p.name,
    tagline: p.tagline,
    bio: p.bio,
    photo: p.photo,
    talk: {
      id: t.id,
      slug: t.slug,
      title: t.title,
      description: t.description,
      start: t.start,
      end: t.end,
      track: t.track,
      format: t.format,
      coSpeakers: t.speakers
        .filter((o) => o.name !== p.name)
        .map((o) => ({ name: o.name, slug: slugify(o.name) })),
    },
  })),
);

// Build-time guard: two speakers must never collapse onto the same URL.
const dupes = SPEAKERS.map((s) => s.slug).filter((slug, i, all) => all.indexOf(slug) !== i);
if (dupes.length) {
  throw new Error(`Duplicate speaker slug(s), fix slugify() or the source data: ${[...new Set(dupes)].join(", ")}`);
}

export const speakerBySlug = (slug: string) => SPEAKERS.find((s) => s.slug === slug);
