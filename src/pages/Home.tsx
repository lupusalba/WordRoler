// src/pages/Home.tsx
// Simple home screen that loads a sample deck and shows basic info.

import React, { useEffect } from "react";
import { useDeckStore } from "@/state/useDeckStore";
import type { Deck } from "@/types/deck";

const DECK_PATH = "/decks/es_a1_requests.json"; // Ensure file exists at public/decks/es_a1_requests.json

const Home: React.FC = () => {
  // Read deck and load action from the store
  const deck = useDeckStore((s) => s.deck);
  const load = useDeckStore((s) => s.load);

  // Log when component mounts and when deck changes
  useEffect(() => {
    console.log("Home mounted. Deck present:", Boolean(deck));
  }, [deck]);

  // Helper to load the sample deck with error handling
  const loadSampleDeck = async () => {
    try {
      console.log("Fetching deck from", DECK_PATH);
      const res = await fetch(DECK_PATH, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} loading ${DECK_PATH}`);
      }
      const data = (await res.json()) as Deck;
      // Basic shape sanity check to catch wrong paths/files
      if (!data || !Array.isArray(data.slots) || !Array.isArray(data.rows)) {
        throw new Error("Invalid deck JSON: missing slots/rows array");
      }
      load(data);
      console.log(data)
      console.log("Deck loaded:", {
        language: data.language,
        version: data.version,
        slots: data.slots.length,
        rows: data.rows.length,
      });
    } catch (err) {
      console.error("Failed to load deck:", err);
      alert("Failed to load deck. Open console for details.");
    }
  };

  // If no deck loaded yet, show a clear action
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

  // Safe derived title using existing fields in your Deck type
  const derivedTitle =
    (deck as any)?.meta?.title ??
    `${deck.language.toUpperCase()} deck v${deck.version}`;

  return (
    <div>
      <h2 style={{ margin: 0 }}>{derivedTitle}</h2>
      <div style={{ marginTop: 8 }}>
        <div>Language: {deck.language}</div>
        <div>Version: {deck.version}</div>
        <div>Slots: {deck.slots.length}</div>
        <div>Rows: {deck.rows.length}</div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={loadSampleDeck}>Reload Deck</button>
      </div>
    </div>
  );
};

export default Home;
