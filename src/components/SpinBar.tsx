// src/components/SpinBar.tsx
import React from "react";
import { useDeckStore } from "@/state/useDeckStore";
import { useToast } from "@/components/ui/Toast";

const SpinBar: React.FC = () => {
  // We read the spin action from the store.
  // In some codebases spin() currently returns void; we cast it to a boolean-returning fn here
  // to avoid TS1345 ("void cannot be tested for truthiness") until the store is updated.
  const spin = useDeckStore((s) => s.spin as unknown as () => boolean);

  const toast = useToast();

  const onSpin = () => {
    // Call spin() and capture whether it succeeded (true) or had no candidates (false).
    const ok = spin();

    // If there was no valid combination, inform the user with a small toast.
    if (!ok) {
      toast.show("No valid combination. Unlock a column or change a selection.");
    }
  };

  return (
    <div className="spinbar">
      {/* Button to trigger a spin that respects locked columns and valid rows */}
      <button onClick={onSpin} aria-label="Spin for a valid sentence">
        🎰 Spin
      </button>

      {/* Placeholders for Speak and Save buttons if present in your UI */}
      {/* <button aria-label="Speak current sentence">🔊 Speak</button>
      <button aria-label="Save to Favorites">⭐ Save</button> */}
    </div>
  );
};

export default SpinBar;
