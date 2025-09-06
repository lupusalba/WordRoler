// src/components/DeckSelector.tsx
// Simple dropdown to switch decks. It fetches and loads the selected deck and persists choice.

import React from "react";
import { getDecks, fetchDeckById, saveLastDeckId } from "@/lib/decks";
import { useDeckStore } from "@/state/useDeckStore";
import { useToast } from "@/components/ui/Toast";

const DeckSelector: React.FC = () => {
  const decks = React.useMemo(() => getDecks(), []);
  const load = useDeckStore((s) => s.load);
  const toast = useToast();

  const onChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    try {
      const deck = await fetchDeckById(id);
      load(deck);
      saveLastDeckId(id);
      toast.show(`Loaded deck: ${id}`);
    } catch (err) {
      console.error("Failed to switch deck:", err);
      toast.show("Failed to load deck. See console.", 3000);
    }
  };

  return (
    <label style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
      <span style={{ fontSize: 14, opacity: 0.85 }}>Deck</span>
      <select onChange={onChange} style={{ padding: "6px 8px", borderRadius: 8 }}>
        {decks.map((d) => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>
    </label>
  );
};

export default DeckSelector;
