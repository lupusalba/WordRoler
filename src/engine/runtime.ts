/** Core runtime: candidate rows, allowed items per slot, spin, and realize */
import type { RuntimeDeck } from './loader';
import type { Row } from '@/types/deck';

export type Selection = Record<string, string | undefined>;

function intersect(a: Set<string>, b: Set<string>) {
  const out = new Set<string>();
  for (const x of a) if (b.has(x)) out.add(x);
  return out;
}

export function candidateRows(deck: RuntimeDeck, sel: Selection): Set<string> {
  let set = new Set(deck.index.allRowIds);
  for (const [slot, itemId] of Object.entries(sel)) {
    if (!itemId) continue;
    const rows = new Set(deck.index.rowsBySlotItem[slot][itemId] || []);
    set = intersect(set, rows);
    if (set.size === 0) break;
  }
  return set;
}

export function allowedItems(deck: RuntimeDeck, sel: Selection, slot: string): string[] {
  const cand = candidateRows(deck, sel);
  const allowed = new Set<string>();
  for (const rowId of cand) {
    const r = deck.index.rowById[rowId];
    allowed.add(r.pick[slot]);
  }
  return Array.from(allowed);
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function spin(deck: RuntimeDeck, sel: Selection, locked: Set<string>) {
  const cand = Array.from(candidateRows(deck, sel));
  if (cand.length === 0) return { sel, row: undefined as unknown as Row, ok: false, reason: 'No valid combination' };
  const row = deck.index.rowById[pickRandom(cand)];

  // Fill unlocked slots from chosen row
  const next: Selection = { ...sel };
  for (const slot of Object.keys(deck.index.rowsBySlotItem)) {
    if (!locked.has(slot)) next[slot] = row.pick[slot];
  }
  return { sel: next, row, ok: true as const };
}
