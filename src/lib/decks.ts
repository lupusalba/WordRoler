// src/lib/decks.ts
// Registry of available decks and helpers to load/persist selection.

import type { Deck } from "@/types/deck";

export type DeckMeta = {
  id: string;      // stable id used in storage and URLs, e.g. "es_a1_requests"
  name: string;    // human-readable name
  path: string;    // public path to JSON
  lang: string;    // ISO code, e.g. "es"
};

const REGISTRY: DeckMeta[] = [
  // Add more decks here as you create them under public/decks/
  { id: "es_a1_requests", name: "Spanish A1 — Requests", path: "/decks/es_a1_requests.json", lang: "es" },
];

// Storage key for last-used deck id.
const KEY_DECK_ID = "wordroller.deckId";

// Return all registered decks.
export function getDecks(): DeckMeta[] {
  return REGISTRY.slice();
}

// Get a deck meta by id (or undefined).
export function getDeckMeta(id: string): DeckMeta | undefined {
  return REGISTRY.find((d) => d.id === id);
}

// Load a deck JSON by meta id. Throws on network/shape issues.
export async function fetchDeckById(id: string): Promise<Deck> {
  const meta = getDeckMeta(id);
  if (!meta) throw new Error(`Unknown deck id: ${id}`);
  const res = await fetch(meta.path, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} loading ${meta.path}`);
  const data = (await res.json()) as Deck;
  if (!data || !Array.isArray(data.slots) || !Array.isArray(data.rows)) {
    throw new Error("Invalid deck JSON: missing slots/rows array");
  }
  return data;
}

// Persist the chosen deck id.
export function saveLastDeckId(id: string) {
  localStorage.setItem(KEY_DECK_ID, id);
}

// Read the last chosen deck id, or null.
export function readLastDeckId(): string | null {
  return localStorage.getItem(KEY_DECK_ID);
}
