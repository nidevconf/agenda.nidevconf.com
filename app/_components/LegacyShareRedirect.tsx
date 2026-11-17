"use client";

import { useEffect } from "react";

/* Share links used to point at / (?name=&agenda=); the agenda now lives at /agenda. */
export default function LegacyShareRedirect() {
  useEffect(() => {
    if (new URLSearchParams(location.search).has("agenda")) location.replace(`/agenda${location.search}`);
  }, []);
  return null;
}
