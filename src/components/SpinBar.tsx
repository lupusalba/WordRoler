// src/components/SpinBar.tsx
// Spin bar with Spin, Speak, and Save to Favorites.

import React from "react";
import { useDeckStore } from "@/state/useDeckStore";
import { useToast } from "@/components/ui/Toast";
import { addFavorite } from "@/lib/favorites";
import { speak } from "@/lib/tts";

const SpinBar: React.FC = () => {
  // Cast keeps compatibility if your store's spin() still returns void.
  const spin = useDeckStore((s) => s.spin as unknown as () => boolean);
  const deck = useDeckStore((s) => s.deck);
  const selection = useDeckStore((s) => s.selection);
  const currentRowId = useDeckStore((s) => s.currentRowId);

  const toast = useToast();

  const onSpin = () => {
    const ok = spin();
    if (!ok) {
      toast.show("No valid combination. Unlock a column or change a selection.");
    }
  };

  const onSpeak = () => {
    if (!deck || !currentRowId) return;
    const row = deck.rows.find((r) => r.id === currentRowId);
    if (!row) return;
    speak(row.surface, deck.language === "es" ? "es-ES" : "en-US");
  };

  const onSave = () => {
    if (!deck || !currentRowId) return;
    const row = deck.rows.find((r) => r.id === currentRowId);
    if (!row) return;
    const deckKey = `${deck.language}@${deck.version}`;
    addFavorite({
      id: row.id,
      surface: row.surface,
      ipa: row.ipa,
      deckKey,
      savedAt: Date.now()
    });
    toast.show("Saved to favorites.");
  };

  return (
    <div className="spinbar" style={{ display: "flex", gap: 8 }}>
      <button onClick={onSpin} aria-label="Spin for a valid sentence">🎰 Spin</button>
      <button onClick={onSpeak} aria-label="Speak current sentence">🔊 Speak</button>
      <button onClick={onSave} aria-label="Save to Favorites">⭐ Save</button>
    </div>
  );
};

export default SpinBar;
