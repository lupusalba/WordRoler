/** Loads a deck JSON, validates with Zod, and builds indices for fast filtering */
import { ZDeck, type Deck, type Row } from '@/types/deck';

export type RuntimeDeck = Deck & {
  index: {
    rowById: Record<string, Row>;
    slotItemIds: Record<string, string[]>;                    // slot -> [itemId]
    rowsBySlotItem: Record<string, Record<string, string[]>>; // slot -> itemId -> [rowId]
    allRowIds: string[];
  };
};

export async function loadDeck(url: string): Promise<RuntimeDeck> {
  const raw = await fetch(url).then((r) => r.json());
  const deck = ZDeck.parse(raw);

  const rowById: Record<string, Row> = {};
  const slotItemIds: Record<string, string[]> = {};
  const rowsBySlotItem: RuntimeDeck['index']['rowsBySlotItem'] = {};
  const allRowIds: string[] = [];

  for (const s of deck.slots) {
    slotItemIds[s.name] = s.items.map((i) => i.id);
    rowsBySlotItem[s.name] = {};
    for (const i of s.items) rowsBySlotItem[s.name][i.id] = [];
  }

  for (const r of deck.rows) {
    rowById[r.id] = r;
    allRowIds.push(r.id);
    for (const [slot, itemId] of Object.entries(r.pick)) {
      rowsBySlotItem[slot][itemId].push(r.id);
    }
  }

  return { ...deck, index: { rowById, slotItemIds, rowsBySlotItem, allRowIds } };
}
