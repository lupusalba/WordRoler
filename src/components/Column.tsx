/** Column (slot wheel): shows only allowed items; supports lock + selection */
import { useMemo } from 'react';
import { clsx } from 'clsx';
import { useDeckStore } from '@/state/useDeckStore';

type Props = { slotName: string };

export default function Column({ slotName }: Props) {
  const {
    deck,
    selection,
    locked,
    toggleLock,
    setSelection,
    allowedItemsFor,
    labelForItem
  } = useDeckStore();

  const allowed = useMemo(
    () => allowedItemsFor(slotName),
    [allowedItemsFor, slotName, selection, locked],
  );

  if (!deck) return null;
  const isLocked = locked.has(slotName);
  const current = selection[slotName];

  return (
    <div className={clsx('column', isLocked && 'locked')}>
      <div className="column-header">
        <span className="slot-name">{deck.slots.find(s => s.name === slotName)?.display ?? slotName}</span>
        <button className="lock" onClick={() => toggleLock(slotName)} aria-pressed={isLocked}>
          {isLocked ? '🔒' : '🔓'}
        </button>
      </div>

      <ul className="wheel" role="listbox" aria-label={slotName}>
        {allowed.map((itemId) => (
          <li key={itemId}>
            <button
              role="option"
              aria-selected={current === itemId}
              className={clsx('item', current === itemId && 'selected')}
              onClick={() => setSelection(slotName, itemId)}
              disabled={isLocked}
            >
              {labelForItem(slotName, itemId)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
