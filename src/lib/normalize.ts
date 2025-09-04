/** Normalizes sentences for tolerant comparisons (future use) */
export function normalizeSurface(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[¡!¿?.,;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
