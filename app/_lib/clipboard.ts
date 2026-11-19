"use client";

import { useState } from "react";

const COPIED_FOR_MS = 2000;

/** Copies text, and says so for a moment after. */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  function copy(text: string) {
    // no clipboard outside a secure context (an http:// dev server opened on a phone)
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_FOR_MS);
    });
  }

  return { copied, copy };
}
