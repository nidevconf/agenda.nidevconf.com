/* The ?agenda= payload: one bit per talk (index 0..N-1, in the fixed order of
   _data/talks.json — never reorder that file, only ever append), 1 = picked,
   0 = not — padded on the right to a multiple of 4 and hex-encoded 4 bits per
   digit. Reversible because N (the talk count) is always known independently
   at decode time, so there's nothing to recover from the hex string itself:
   decoding just re-expands each digit to 4 bits and reads the first N of them.
   A hex payload encoded against an older (shorter) talks.json still decodes:
   the picks that still exist are read, anything beyond the old length is just
   not picked. */

export function encodeAgenda(pickedIds: readonly string[], talks: readonly { id: string }[]): string {
  const picked = new Set(pickedIds);
  const bits = talks.map((t) => (picked.has(t.id) ? "1" : "0")).join("");
  const nibbles = Math.ceil(bits.length / 4);
  const padded = bits.padEnd(nibbles * 4, "0");
  let hex = "";
  for (let i = 0; i < padded.length; i += 4) {
    hex += parseInt(padded.slice(i, i + 4), 2).toString(16);
  }
  return hex;
}

export function decodeAgenda(hex: string, talks: readonly { id: string }[]): string[] {
  if (!/^[0-9a-f]*$/i.test(hex)) return [];
  const bits = [...hex].map((c) => parseInt(c, 16).toString(2).padStart(4, "0")).join("");
  return talks.filter((_, i) => bits[i] === "1").map((t) => t.id);
}
