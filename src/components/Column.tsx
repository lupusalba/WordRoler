// src/components/Column.tsx
// A single slot column with scrollable options and lock toggle. Disables incompatible items.

import React from "react";
import { useDeckStore } from "@/state/useDeckStore";
import { allowedItemsFor } from "@/engine/runtime";
import type { Deck } from "@/types/deck";

type Props = {
  slotId: string;     // slot name (identifier)
  title: string;      // display label
};

const Column: React.FC<Props> = ({ slotId, title }) => {
  const deck = useDeckStore((s) => s.deck);
  const selection = useDeckStore((s) => s.selection);
  const locked = useDeckStore((s) => s.locked);
  const setSelection = useDeckStore((s) => s.setSelection);
  const toggleLock = useDeckStore((s) => s.toggleLock);

  if (!deck) return null;

  const slot = deck.slots.find((sl) => sl.name === slotId);
  if (!slot) return null;

  // Compute allowed items for this slot to disable incompatible options.
  const allowed = allowedItemsFor(deck, selection, locked, slotId);
  const isLocked = locked.has(slotId);
  const selectedId = selection[slotId];

  const onSelect = (itemId: string) => {
    if (isLocked) return;
    setSelection(slotId, itemId);
  };

  return (
    <div className="col">
      <div className="col__header">
        <div className="col__title">{title}</div>
        <button
          className={isLocked ? "lock lock--on" : "lock"}
          onClick={() => toggleLock(slotId)}
          aria-pressed={isLocked}
          aria-label={isLocked ? "Unlock column" : "Lock column"}
          title={isLocked ? "Unlock column" : "Lock column"}
        >
          {isLocked ? "🔒" : "🔓"}
        </button>
      </div>

      <div className="col__list" role="listbox" aria-label={title}>
        {slot.items.map((it) => {
          const disabled = !allowed.has(it.id);
          const selected = selectedId === it.id;
          return (
            <button
              key={it.id}
              role="option"
              aria-selected={selected}
              disabled={disabled || isLocked}
              className={
                "col__item" +
                (selected ? " col__item--selected" : "") +
                (disabled ? " col__item--disabled" : "")
              }
              onClick={() => onSelect(it.id)}
              title={disabled ? "Incompatible with current selection" : it.label}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Column;
