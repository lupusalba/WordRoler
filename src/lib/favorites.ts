/** Favorites persistence in localStorage */
const KEY = 'slotlang:favs:v1';
export type Fav = { deckId: string; rowId: string; surface: string; savedAt: number };

export function saveFavorite(f: Fav) {
  const arr: Fav[] = JSON.parse(localStorage.getItem(KEY) || '[]');
  arr.unshift(f);
  localStorage.setItem(KEY, JSON.stringify(arr.slice(0, 200)));
}
export function listFavorites(): Fav[] {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}
