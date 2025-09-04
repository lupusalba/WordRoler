/** Zod-typed schema for decks; guarantees data sanity at load time */
import { z } from 'zod';

export const ZItem = z.object({
  id: z.string(),
  label: z.string(),
  emit: z.string().nullable().default(null),
  features: z.record(z.string()).default({}),
});

export const ZSlot = z.object({
  name: z.string(),
  display: z.string(),
  items: z.array(ZItem).min(1),
});

export const ZRow = z.object({
  id: z.string(),
  pick: z.record(z.string(), z.string()), // slotName -> itemId
  surface: z.string(),
  tokens: z.array(z.object({ slot: z.string(), text: z.string() })).optional(),
  ipa: z.string().optional(),
});

export const ZDeck = z.object({
  version: z.string(),
  language: z.literal('es'),
  meta: z.object({ rtl: z.boolean().default(false), locale: z.string().default('es-ES') }),
  slots: z.array(ZSlot).min(2),
  rows: z.array(ZRow).min(1),
});

export type Deck = z.infer<typeof ZDeck>;
export type Slot = z.infer<typeof ZSlot>;
export type Row = z.infer<typeof ZRow>;
