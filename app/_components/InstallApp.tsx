"use client";

import { useState, useSyncExternalStore } from "react";
import Sheet from "./Sheet";

/* Installing the app to the home screen. Chrome, Edge and Android offer an install
   prompt the page can trigger (beforeinstallprompt); Safari on iPhone and iPad has no
   such thing, so there the button explains the two taps instead. Hidden once you're in
   the installed app, and wherever neither is possible. */

type InstallPrompt = Event & { prompt: () => Promise<void> };

// the prompt event can fire before anything renders, so it's caught as soon as this loads
let deferred: InstallPrompt | null = null;
const listeners = new Set<() => void>();
if (typeof window !== "undefined") {
  addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault(); // the button below offers it instead of the browser's own banner
    deferred = e as InstallPrompt;
    listeners.forEach((l) => l());
  });
  addEventListener("appinstalled", () => {
    deferred = null;
    listeners.forEach((l) => l());
  });
}
const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

function mode() {
  const installed =
    matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (installed) return "installed";
  if (deferred) return "prompt";
  // iPadOS reports itself as a Mac, so a touch screen gives it away
  const ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return ios ? "ios" : "none";
}

export default function InstallApp({ onDone }: { onDone?: () => void }) {
  const how = useSyncExternalStore(subscribe, mode, () => "none");
  const [help, setHelp] = useState(false);

  if (how === "installed" || how === "none") return null;

  // the menu closes only after the sheet does: a sheet inside a closed menu isn't drawn
  function close() {
    setHelp(false);
    onDone?.();
  }

  function install() {
    if (how === "ios") return setHelp(true);
    deferred?.prompt();
    onDone?.();
  }

  return (
    <>
      <button type="button" className="btn btn-outline" onClick={install}>
        Install app
      </button>
      {help && (
        <Sheet
          title="Install the app"
          description="In Safari, tap the Share button, then Add to Home Screen."
          onClose={close}
        >
          <button type="button" className="btn btn-secondary sheet-action" onClick={close}>
            Got it
          </button>
        </Sheet>
      )}
    </>
  );
}
