// src/engine/runtime.ts
// Add allowedItemsFor alongside candidateRows/applyRowToSelection.

import type { Deck } from "@/types/deck";
import type { Row } from "@/state/types";

export function candidateRows(
  deck: Deck,
  selection: Record<string, string | null>,
  locked: Set<string>
): Row[] {
  if (!deck || !Array.isArray(deck.rows)) return [];
  const lockedIds = locked ? Array.from(locked) : [];
  return deck.rows.filter((row) => {
    for (const slotId of Object.keys(selection)) {
      const sel = selection[slotId];
      const rowPick = row.pick[slotId];
      if (lockedIds.includes(slotId)) {
        if (rowPick !== sel) return false;
      } else {
        if (sel !== null && rowPick !== sel) return false;
      }
    }
    return true;
  }) as Row[];
}

export function applyRowToSelection(
  current: Record<string, string | null>,
  row: Row,
  locked: Set<string>
): Record<string, string | null> {
  const next: Record<string, string | null> = { ...current };
  const lockedIds = locked ? Array.from(locked) : [];
  for (const slotId of Object.keys(row.pick)) {
    if (!lockedIds.includes(slotId)) {
      next[slotId] = row.pick[slotId] ?? null;
    }
  }
  return next;
}

// Compute which item ids are allowed for a given slot, given current constraints.
// An item is allowed if there exists at least one candidate row whose pick for slotId equals that item.
export function allowedItemsFor(
  deck: Deck,
  selection: Record<string, string | null>,
  locked: Set<string>,
  slotId: string
): Set<string> {
  const allowed = new Set<string>();
  if (!deck) return allowed;
  const candidates = candidateRows(deck, selection, locked);
  for (const row of candidates) {
    const item = row.pick[slotId];
    if (typeof item === "string") {
      allowed.add(item);
    }
  }
  return allowed;
}
