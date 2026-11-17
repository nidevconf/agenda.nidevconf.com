import { Facebook, Globe, Instagram, Link as LinkIcon, Linkedin, Mail, PenLine, Twitter } from "lucide-react";

export type LinkKind = "linkedin" | "website" | "blog" | "twitter" | "instagram" | "facebook" | "email" | "other";

export const LINK_KIND: Record<LinkKind, { Icon: typeof Globe; label: string }> = {
  linkedin: { Icon: Linkedin, label: "LinkedIn" },
  website: { Icon: Globe, label: "Website" },
  blog: { Icon: PenLine, label: "Blog" },
  twitter: { Icon: Twitter, label: "X" },
  instagram: { Icon: Instagram, label: "Instagram" },
  facebook: { Icon: Facebook, label: "Facebook" },
  email: { Icon: Mail, label: "Email" },
  other: { Icon: LinkIcon, label: "Link" },
};

const shortUrl = (url: string) => url.replace(/^(https?:\/\/(www\.)?|mailto:)/, "").replace(/\/$/, "");

/* A list of outbound links as rows: icon, what it is, where it goes. Used in the
   speaker links sheet and on village cards. */
export default function LinkList({ links }: { links: { kind: LinkKind; url: string; label?: string }[] }) {
  return (
    <ul className="link-list">
      {links.map(({ kind, url, label }) => {
        const { Icon, label: fallback } = LINK_KIND[kind];
        const external = !url.startsWith("mailto:");
        return (
          <li key={url}>
            <a href={url} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
              <Icon size={18} aria-hidden />
              <span>
                <b>{label ?? fallback}</b>
                <small>{shortUrl(url)}</small>
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
