// src/components/OutputPane.tsx
// Shows the current sentence surface and optional IPA for the chosen row.

import React from "react";
import { useDeckStore } from "@/state/useDeckStore";

const OutputPane: React.FC = () => {
  const deck = useDeckStore((s) => s.deck);
  const currentRowId = useDeckStore((s) => s.currentRowId);

  if (!deck || !currentRowId) {
    return (
      <div className="out">
        <div className="out__surface">Spin to generate a sentence.</div>
      </div>
    );
  }

  const row = deck.rows.find((r) => r.id === currentRowId);
  if (!row) {
    return (
      <div className="out">
        <div className="out__surface">Spin to generate a sentence.</div>
      </div>
    );
  }

  return (
    <div className="out">
      <div className="out__surface">{row.surface}</div>
      {row.ipa ? <div className="out__ipa">{row.ipa}</div> : null}
    </div>
  );
};

export default OutputPane;
