import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SpeakerCard from "../../_components/SpeakerCard";
import { SPEAKERS, speakerBySlug } from "../../_lib/speakers";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SPEAKERS.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = speakerBySlug(slug);
  if (!s) return {};
  const title = `${s.name} — NIDC 2026`;
  const description = `${s.tagline} · ${s.talk.title}`;
  const image = `/speakers/${s.slug}/og.png`;
  return {
    title,
    description,
    alternates: { canonical: `https://agenda.nidevconf.com/speakers/${s.slug}` },
    openGraph: {
      type: "profile",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: s.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function SpeakerPage({ params }: Params) {
  const { slug } = await params;
  const s = speakerBySlug(slug);
  if (!s) notFound();

  return (
    <div className="deck">
      <h1 className="sr-only">{s.name}</h1>
      <article id={s.slug} className="deck-card">
        <SpeakerCard speaker={s} />
      </article>
    </div>
  );
}
