// src/pages/Home.tsx
import React, { useEffect } from "react";
import { useDeckStore } from "@/state/useDeckStore";

const Home: React.FC = () => {
  const deck = useDeckStore((s) => s.deck);
  const load = useDeckStore((s) => s.load);

  useEffect(() => {
    console.log("Home mounted. Deck:", deck);
  }, [deck]);

  if (!deck) {
    return (
      <div>
        <p>No deck loaded yet.</p>
        <button
          onClick={async () => {
            const res = await fetch("/decks/es_a1_requests.json");
            const data = await res.json();
            load(data);
          }}
        >
          Load Sample Deck
        </button>
      </div>
    );
  }

  return (
    <div>
      <p>Deck loaded: {deck.name}</p>
      <p>Slots: {deck.slots.length}</p>
      <p>Rows: {deck.rows.length}</p>
    </div>
  );
};

export default Home;
