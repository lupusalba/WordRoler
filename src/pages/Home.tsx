// src/pages/Home.tsx
// Render the full UI: columns grid, spin bar, and output pane. Still includes the manual loader button.

import React, { useEffect } from "react";
import { useDeckStore } from "@/state/useDeckStore";
import type { Deck } from "@/types/deck";
import Column from "@/components/Column";
import SpinBar from "@/components/SpinBar";
import OutputPane from "@/components/OutputPane";

const DECK_PATH = "/decks/es_a1_requests.json";

const Home: React.FC = () => {
  const deck = useDeckStore((s) => s.deck);
  const load = useDeckStore((s) => s.load);
  const selection = useDeckStore((s) => s.selection);

  useEffect(() => {
    console.log("Home mounted. Deck present:", Boolean(deck));
  }, [deck]);

  const loadSampleDeck = async () => {
    try {
      const res = await fetch(DECK_PATH, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status} loading ${DECK_PATH}`);
      const data = (await res.json()) as Deck;
      if (!data || !Array.isArray(data.slots) || !Array.isArray(data.rows)) {
        throw new Error("Invalid deck JSON: missing slots/rows array");
      }
      load(data);
    } catch (err) {
      console.error("Failed to load deck:", err);
      alert("Failed to load deck. Open console for details.");
    }
  };

  if (!deck) {
    return (
      <div>
        <p>No deck loaded yet.</p>
        <button onClick={loadSampleDeck}>Load Sample Deck</button>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          Expected path: public/decks/es_a1_requests.json
        </p>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="meta">
        <div>Language: {deck.language}</div>
        <div>Version: {deck.version}</div>
        <div>Slots: {deck.slots.length}</div>
        <div>Rows: {deck.rows.length}</div>
      </div>

      <div className="grid">
        {deck.slots.map((slot) => (
          <Column key={slot.name} slotId={slot.name} title={slot.display} />
        ))}
      </div>

      <SpinBar />

      <OutputPane />

      <div className="debug" style={{ opacity: 0.6, fontSize: 12 }}>
        Selection: {JSON.stringify(selection)}
      </div>
    </div>
  );
};

export default Home;
