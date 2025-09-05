// src/engine/runtime.ts
// Runtime helpers: find candidate rows and apply a chosen row to the selection.

import type { Deck } from "@/types/deck";
import type { Row } from "@/state/types";

// Compute candidate rows that are consistent with the current selection and locks.
export function candidateRows(
  deck: Deck,
  selection: Record<string, string | null>,
  locked: Set<string>
): Row[] {
  // If no deck or rows, return empty.
  if (!deck || !Array.isArray(deck.rows)) return [];

  // A row is a candidate if, for every locked slot, the row's pick equals the current selection.
  // Additionally, if a slot has a non-null selection (even if unlocked), we keep rows that match it.
  const lockedIds = locked ? Array.from(locked) : [];

  return deck.rows.filter((row) => {
    for (const slotId of Object.keys(selection)) {
      const sel = selection[slotId];
      const rowPick = row.pick[slotId];

      // If the slot is locked, the row must match the selection exactly (including null).
      if (lockedIds.includes(slotId)) {
        if (rowPick !== sel) return false;
      } else {
        // If user has an explicit selection (not null) on an unlocked slot, enforce it too.
        if (sel !== null && rowPick !== sel) return false;
      }
    }
    return true;
  }) as Row[];
}

// Apply a row to the selection, preserving locked slots.
export function applyRowToSelection(
  current: Record<string, string | null>,
  row: Row,
  locked: Set<string>
): Record<string, string | null> {
  const next: Record<string, string | null> = { ...current };
  const lockedIds = locked ? Array.from(locked) : [];

  for (const slotId of Object.keys(row.pick)) {
    // Only overwrite if the slot is not locked.
    if (!lockedIds.includes(slotId)) {
      next[slotId] = row.pick[slotId] ?? null;
    }
  }
  return next;
}
