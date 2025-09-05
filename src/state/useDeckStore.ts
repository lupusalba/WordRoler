// src/state/useDeckStore.ts
// Zustand store for WordRoller: selection state, locks, and spin logic.

import { create } from "zustand";
import type { Store } from "./types";
import { candidateRows, applyRowToSelection } from "@/engine/runtime";
import type { Deck } from "@/types/deck";

export const useDeckStore = create<Store>()((set, get) => ({
  // Initially no deck loaded.
  deck: null,

  // Selection starts empty; will be shaped on load() based on deck slots.
  selection: {},

  // No locks by default.
  locked: new Set<string>(),

  // No current row yet.
  currentRowId: null,

  // Load a deck and initialize selection to all nulls for known slots.
  // Important: slot identifier is `slot.name` (not `slot.id`) per your Deck shape.
  load: (deck: Deck) => {
    const emptySelection: Record<string, string | null> = {};
    for (const slot of deck.slots) {
      emptySelection[slot.name] = null;
    }
    set({
      deck,
      selection: emptySelection,
      locked: new Set<string>(),
      currentRowId: null,
    });
  },

  // Toggle lock for a slot id (identified by slot name).
  toggleLock: (slotId: string) => {
    const { locked } = get();
    const next = new Set<string>(locked);
    if (next.has(slotId)) next.delete(slotId);
    else next.add(slotId);
    set({ locked: next });
  },

  // Set selection for a given slot id (item id or null).
  setSelection: (slotId: string, itemId: string | null) => {
    const { selection } = get();
    set({
      selection: { ...selection, [slotId]: itemId },
    });
  },

  // Spin into a valid row. Returns true if a row was applied, false otherwise.
  spin: () => {
    const state = get();

    // Must have a deck to operate.
    if (!state.deck) return false;

    // Compute candidate rows consistent with current selection and locks.
    const candidates = candidateRows(state.deck, state.selection, state.locked);

    // If no candidates, inform caller (UI can toast).
    if (candidates.length === 0) {
      return false;
    }

    // Pick one uniformly at random.
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];

    // Merge row picks into selection, preserving locked slots.
    const nextSelection = applyRowToSelection(state.selection, chosen, state.locked);

    // Commit selection and the current row id.
    set({ selection: nextSelection, currentRowId: chosen.id });

    return true;
  },
}));
