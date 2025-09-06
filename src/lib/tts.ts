// src/lib/tts.ts
// Minimal Web Speech API wrapper with safe fallbacks.

export function speak(text: string, lang: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("TTS not supported in this browser.");
    return;
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang || "es-ES";
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}
