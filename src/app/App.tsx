// src/app/App.tsx
// Simple in-app navigation between Home and Favorites (no router).

import React from "react";
import Home from "@/pages/Home";
import Favorites from "@/pages/Favorites";
import { ToastProvider } from "@/components/ui/Toast";
import { useDeckStore } from "@/state/useDeckStore";

type View = "home" | "favorites";

const App: React.FC = () => {
  const [view, setView] = React.useState<View>("home");
  const deck = useDeckStore((s) => s.deck);
  const currentRowId = useDeckStore((s) => s.currentRowId);

  // Optional: open-row handler from Favorites (no-op for now).
  const openRow = () => {
    setView("home");
  };

  return (
    <ToastProvider>
      <div style={{ minHeight: "100vh", padding: 16, display: "grid", gap: 12 }}>
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>WordRoller</div>
          <nav style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setView("home")} aria-label="Go to Home">Home</button>
            <button onClick={() => setView("favorites")} aria-label="Go to Favorites">Favorites</button>
          </nav>
        </header>

        {view === "home" ? <Home /> : <Favorites onOpenRow={openRow} />}

        {/* Optional mini status row */}
        <footer style={{ opacity: 0.7, fontSize: 12 }}>
          {deck ? `Deck: ${deck.language}@${deck.version}` : "No deck loaded"}
          {currentRowId ? ` • Row: ${currentRowId}` : ""}
        </footer>
      </div>
    </ToastProvider>
  );
};

export default App;
