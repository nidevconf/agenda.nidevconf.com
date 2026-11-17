/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TalkCard from "../../_components/TalkCard";
import talks from "../../_data/talks.json";
import { large } from "../../_lib/photos";
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
    <div className="speaker-page wrap">
      <Link href="/agenda" className="back-link">
        ← My agenda
      </Link>
      <img className="speaker-photo" src={`/images/speakers/${large(s.photo)}`} alt={s.name} width={320} height={320} />
      <h1 className="speaker-name">{s.name}</h1>
      <p className="speaker-tagline">{s.tagline}</p>

      <ul className="speaker-talk">
        {/* faces only when it's shared: the speaker alone is already the page */}
        <TalkCard talk={talks.find((t) => t.id === s.talk.id)!} speakers={s.talk.coSpeakers.length > 0} />
      </ul>
      <p className="speaker-desc">{s.talk.description}</p>

      <div className="speaker-bio">
        <p>{s.bio}</p>
      </div>
    </div>
  );
}
