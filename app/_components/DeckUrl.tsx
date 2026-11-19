"use client";

import { useEffect } from "react";

const SHARE_OF_CARD_ON_SCREEN = 0.6;

/* The speaker you've swiped to, kept in the URL (/speakers#slug), so a copied or reloaded
   link opens the deck on them; each card's id is its slug. replaceState, so swiping isn't
   a trail of back-button stops, with null state as Next's docs do, so its router keeps
   the new URL. Arriving at the top with no hash leaves the URL alone: plain /speakers
   stays /speakers until you move. */
export default function DeckUrl() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const card = entries.find((e) => e.isIntersecting)?.target;
        if (!card || `#${card.id}` === location.hash) return;
        if (!location.hash && scrollY === 0) return;
        history.replaceState(null, "", `#${card.id}`);
      },
      { threshold: SHARE_OF_CARD_ON_SCREEN },
    );
    document.querySelectorAll(".deck-card[id]").forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);
  return null;
}
