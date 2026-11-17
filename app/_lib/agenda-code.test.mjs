import assert from "node:assert/strict";
import { encodeAgenda, decodeAgenda } from "./agenda-code.ts";

const talks = [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }, { id: "e" }];

// round-trips, including the edge cases naive padding gets wrong: none picked,
// and the very last talk picked (a trailing bit that padding must not eat).
for (const picked of [[], ["a"], ["e"], ["b", "d"], talks.map((t) => t.id)]) {
  const hex = encodeAgenda(picked, talks);
  const back = decodeAgenda(hex, talks);
  assert.deepEqual(new Set(back), new Set(picked), `round-trip failed for ${JSON.stringify(picked)}`);
}

// talks 1 and 5 (1-indexed) of 37 -> bits 10001000...0 (37 bits, padded to 40)
// -> nibbles 1000 1000 0000...0000 -> hex 8800000000.
const thirtySeven = Array.from({ length: 37 }, (_, i) => ({ id: String(i) }));
assert.equal(encodeAgenda(["0", "4"], thirtySeven), "8800000000");
assert.deepEqual(new Set(decodeAgenda("8800000000", thirtySeven)), new Set(["0", "4"]));

// a link encoded against a shorter (older) talk list still decodes against a
// longer one: existing picks survive, nothing crashes on the new talks.
const shortHex = encodeAgenda(["b"], talks.slice(0, 3));
assert.deepEqual(decodeAgenda(shortHex, talks), ["b"]);

// garbage input decodes to an empty agenda instead of throwing.
assert.deepEqual(decodeAgenda("not-hex", talks), []);
assert.deepEqual(decodeAgenda("", talks), []);

console.log("agenda-code: ok");
