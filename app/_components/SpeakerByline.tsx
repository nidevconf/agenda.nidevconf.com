/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { SOCIALS } from "../_data/socials";
import { slugify } from "../_lib/speakers";
import SpeakerLinks from "./SpeakerLinks";

type Person = { name: string; tagline: string; photo: string; bio?: string };

/* A speaker on a surface: face, name (to their page), tagline, their links as a row,
   and optionally their bio underneath. */
export default function SpeakerByline({ person: p, bio }: { person: Person; bio?: boolean }) {
  const slug = slugify(p.name);
  return (
    <div className="byline">
      <div className="byline-head">
        <img src={`/images/speakers/${p.photo}`} width={48} height={48} alt="" />
        <div className="byline-who">
          <Link href={`/speakers/${slug}`}>{p.name}</Link>
          <span>{p.tagline}</span>
        </div>
        <SpeakerLinks name={p.name} links={SOCIALS[slug] ?? []} row />
      </div>
      {bio && p.bio && <p className="byline-bio">{p.bio}</p>}
    </div>
  );
}
