// src/lib/favorites.ts
// LocalStorage-backed favorites: save, list, remove.

export type Favorite = {
  id: string;                  // row id
  surface: string;             // rendered sentence
  ipa?: string;                // optional IPA
  deckKey: string;             // e.g., "es@1.0.0"
  savedAt: number;             // epoch ms
};

const KEY = "wordroller.favorites";

function readAll(): Favorite[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Favorite[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function writeAll(list: Favorite[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function listFavorites(): Favorite[] {
  return readAll().sort((a, b) => b.savedAt - a.savedAt);
}

export function addFavorite(fav: Favorite) {
  const all = readAll();
  // De-dup per deckKey+row id
  const exists = all.some((f) => f.id === fav.id && f.deckKey === fav.deckKey);
  if (exists) return;
  all.push(fav);
  writeAll(all);
}

export function removeFavorite(deckKey: string, rowId: string) {
  const all = readAll().filter((f) => !(f.deckKey === deckKey && f.id === rowId));
  writeAll(all);
}

export function clearFavoritesForDeck(deckKey: string) {
  const all = readAll().filter((f) => f.deckKey !== deckKey);
  writeAll(all);
}
