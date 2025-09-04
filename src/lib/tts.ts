/** Minimal TTS wrapper; degrades gracefully if unsupported */
export function speak(text: string, locale = 'es-ES') {
  if (!('speechSynthesis' in window)) return { ok: false, reason: 'No TTS in this browser' };
  const u = new SpeechSynthesisUtterance(text);
  u.lang = locale;
  window.speechSynthesis.speak(u);
  return { ok: true as const };
}