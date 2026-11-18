"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

/* The talks picked on this device, and the name to share them under. No
   accounts: both live in localStorage. useSyncExternalStore keeps every
   bookmark on the page, and in other tabs, in step. */

const PICKS_KEY = "nidc-agenda-picks";
const NAME_KEY = "nidc-agenda-name";

const listeners = new Set<() => void>();
function subscribe(onChange: () => void) {
  listeners.add(onChange);
  addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    removeEventListener("storage", onChange);
  };
}
function notify() {
  listeners.forEach((l) => l()); // storage doesn't fire in the tab that wrote it
}

function readRaw(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parsePicks(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const v: unknown = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function usePicks() {
  const raw = useSyncExternalStore(subscribe, () => readRaw(PICKS_KEY), () => null);
  return useMemo(() => parsePicks(raw), [raw]);
}

export function useName() {
  return useSyncExternalStore(subscribe, () => readRaw(NAME_KEY) ?? "", () => "");
}

export function setPicks(ids: string[]) {
  try {
    localStorage.setItem(PICKS_KEY, JSON.stringify([...new Set(ids)]));
  } catch {
    return; // storage blocked: nothing saved, nothing to notify
  }
  notify();
}

/* A stand-in agenda for previews (the /design library): inside one, reads and writes
   go to it instead of localStorage, so trying a component never edits your real picks. */
type PicksApi = { picks: string[]; setPicks: (ids: string[]) => void };
export const PicksOverride = createContext<PicksApi | null>(null);

/** Picks plus the ways to change them — the override's when inside one, the real store's otherwise. */
export function usePicksApi() {
  const override = useContext(PicksOverride);
  const stored = usePicks();
  const api: PicksApi = override ?? { picks: stored, setPicks };
  return {
    ...api,
    toggle: (id: string) =>
      api.setPicks(api.picks.includes(id) ? api.picks.filter((x) => x !== id) : [...api.picks, id]),
  };
}

export function setName(name: string) {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch {
    return;
  }
  notify();
}

/* Tracks the page's own query string as an external store, so a shared
   ?name=&agenda= link re-renders if it changes (the back button, or
   clearShareParams below) without a full reload. */
const queryListeners = new Set<() => void>();
function subscribeQuery(onChange: () => void) {
  queryListeners.add(onChange);
  addEventListener("popstate", onChange);
  return () => {
    queryListeners.delete(onChange);
    removeEventListener("popstate", onChange);
  };
}

export function useQueryParam(key: string) {
  return useSyncExternalStore(
    subscribeQuery,
    () => new URLSearchParams(location.search).get(key),
    () => null,
  );
}

/* Drops ?name=&agenda= once a shared link has been dealt with (adopted,
   merged, or dismissed) — otherwise it would keep re-triggering the preview
   banner against your own picks as they naturally diverge from it later. */
export function clearShareParams() {
  const url = new URL(location.href);
  url.searchParams.delete("name");
  url.searchParams.delete("agenda");
  history.replaceState(null, "", url.pathname + url.search);
  queryListeners.forEach((l) => l()); // replaceState fires no popstate
}
