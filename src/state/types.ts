// src/state/types.ts
// Central types for the deck store so components and runtime share the same contracts.

import type { ZodTypeAny } from "zod";
import type { Deck } from "@/types/deck";

// A Row in the deck: each row is a fully grammatical sentence with picks per slot.
export type Row = {
  id: string;
  surface: string;
  ipa?: string;
  pick: Record<string, string | null>;
};

// The store shape used by Zustand.
export type Store = {
  // Loaded deck; null until load() completes.
  deck: Deck | null;

  // Current selection per slot (item ids or null).
  selection: Record<string, string | null>;

  // Locked slot ids; locked slots will not change on spin.
  locked: Set<string>;

  // The last applied row id after a spin or selection, for output pane and favorites.
  currentRowId: string | null;

  // Load a new deck and reset selection/locks.
  load: (deck: Deck) => void;

  // Toggle a slot lock by slot id.
  toggleLock: (slotId: string) => void;

  // Set selection for a given slot id.
  setSelection: (slotId: string, itemId: string | null) => void;

  // Spin into a valid row consistent with current locks; returns true if applied.
  spin: () => boolean;
};
