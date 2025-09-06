// src/pages/Favorites.tsx
// Favorites page: list, play, remove.

import React from "react";
import { listFavorites, removeFavorite, Favorite } from "@/lib/favorites";
import { speak } from "@/lib/tts";
import { useToast } from "@/components/ui/Toast";

type Props = {
  onOpenRow?: (deckKey: string, rowId: string) => void; // optional: open row in Home
};

const Favorites: React.FC<Props> = ({ onOpenRow }) => {
  const [items, setItems] = React.useState<Favorite[]>([]);
  const toast = useToast();

  React.useEffect(() => {
    setItems(listFavorites());
  }, []);

  const onRemove = (deckKey: string, rowId: string) => {
    removeFavorite(deckKey, rowId);
    setItems(listFavorites());
    toast.show("Removed from favorites.");
  };

  if (items.length === 0) {
    return <div>No favorites yet.</div>;
  }

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Favorites</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 8 }}>
        {items.map((f) => (
          <li
            key={`${f.deckKey}:${f.id}`}
            style={{
              border: "1px solid rgba(255,255,255,.15)",
              borderRadius: 8,
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              justifyContent: "space-between"
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, whiteSpace: "pre-wrap" }}>{f.surface}</div>
              {f.ipa ? (
                <div style={{ opacity: 0.75, fontSize: 13, marginTop: 2, whiteSpace: "pre-wrap" }}>
                  {f.ipa}
                </div>
              ) : null}
              <div style={{ opacity: 0.6, fontSize: 12, marginTop: 4 }}>
                Deck: {f.deckKey} • {new Date(f.savedAt).toLocaleString()}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => speak(f.surface, f.deckKey.startsWith("es") ? "es-ES" : "en-US")} aria-label="Speak favorite">
                🔊
              </button>
              {onOpenRow ? (
                <button onClick={() => onOpenRow(f.deckKey, f.id)} aria-label="Open in deck">
                  🔎
                </button>
              ) : null}
              <button onClick={() => onRemove(f.deckKey, f.id)} aria-label="Remove favorite">
                🗑
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
