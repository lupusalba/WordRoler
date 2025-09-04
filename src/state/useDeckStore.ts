/** Global state (Zustand): deck, selection, locks, filtering, spin, current row */
import { create } from 'zustand';
import type { RuntimeDeck } from '@/engine/loader';
import { loadDeck } from '@/engine/loader';
import { allowedItems as _allowedItems, spin as _spin, candidateRows } from '@/engine/runtime';
import type { Row } from '@/types/deck';

type Status = 'idle' | 'loading' | 'ready' | 'error';

type Store = {
  deck?: RuntimeDeck;
  deckId: string;
  status: Status;
  error?: string;

  selection: Record<string, string | undefined>;
  locked: Set<string>;
  currentRow?: Row;

  // actions
  load: (url: string) => Promise<void>;
  setSelection: (slot: string, itemId: string) => void;
  toggleLock: (slot: string) => void;
  spin: () => void;

  // selectors
  allowedItemsFor: (slot: string) => string[];
  labelForItem: (slot: string, itemId: string) => string;
};

export const useDeckStore = create<Store>((set, get) => ({
  deck: undefined,
  deckId: 'es_a1_requests',
  status: 'idle',
  error: undefined,
  selection: {},
  locked: new Set<string>(),
  currentRow: undefined,

  async load(url) {
    set({ status: 'loading', error: undefined });
    try {
      const deck = await loadDeck(url);
      // initialize selection with the first item of each slot
      const sel: Record<string, string> = {};
      for (const s of deck.slots) sel[s.name] = s.items[0]?.id;

      // choose a valid row consistent with default selection
      const cand = Array.from(candidateRows(deck, sel));
      const row = cand.length ? deck.index.rowById[cand[0]] : deck.rows[0];

      set({ deck, status: 'ready', selection: sel, currentRow: row });
    } catch (e: any) {
      set({ status: 'error', error: e?.message ?? String(e) });
    }
  },

  setSelection(slot, itemId) {
    const { deck } = get();
    if (!deck) return;
    const selection = { ...get().selection, [slot]: itemId };
    // recompute a consistent currentRow if possible
    const cand = Array.from(candidateRows(deck, selection));
    const currentRow = cand.length ? deck.index.rowById[cand[0]] : undefined;
    set({ selection, currentRow });
  },

  toggleLock(slot) {
    const locked = new Set(get().locked);
    locked.has(slot) ? locked.delete(slot) : locked.add(slot);
    set({ locked });
  },

  spin() {
    const { deck, selection, locked } = get();
    if (!deck) return;
    const res = _spin(deck, selection, locked);
    if (!res.ok) return; // silent fail; UI remains
    set({ selection: res.sel, currentRow: res.row });
  },

  allowedItemsFor(slot) {
    const { deck, selection } = get();
    if (!deck) return [];
    return _allowedItems(deck, selection, slot);
  },

  labelForItem(slot, itemId) {
    const { deck } = get();
    const items = deck?.slots.find((s) => s.name === slot)?.items ?? [];
    return items.find((i) => i.id === itemId)?.label ?? itemId;
  },
}));
