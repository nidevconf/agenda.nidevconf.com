"use client";

import { Check, Link } from "lucide-react";
import { useCopyToClipboard } from "../_lib/clipboard";

export default function SpeakerCopyLink({ name, slug }: { name: string; slug: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <button
      type="button"
      className="deck-round"
      aria-label={copied ? "Link copied" : `Copy link to ${name}'s page`}
      title="Copy link"
      onClick={() => copy(`${location.origin}/speakers/${slug}`)}
    >
      {copied ? <Check size={20} aria-hidden /> : <Link size={20} aria-hidden />}
    </button>
  );
}
