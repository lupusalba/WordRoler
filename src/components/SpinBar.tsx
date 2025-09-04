/** Action bar: Spin (random valid row), Speak (TTS), Save (favorites) */
import { useDeckStore } from '@/state/useDeckStore';
import { speak } from '@/lib/tts';
import { saveFavorite } from '@/lib/favorites';

export default function SpinBar() {
  const { spin, currentRow, deck, deckId } = useDeckStore();

  return (
    <div className="actions">
      <button onClick={spin}>🎰 Spin</button>
      <button
        onClick={() => currentRow && speak(currentRow.surface, deck?.meta.locale)}
        disabled={!currentRow}
      >
        🔊 Speak
      </button>
      <button
        onClick={() =>
          currentRow &&
          saveFavorite({
            deckId: deckId,
            rowId: currentRow.id,
            surface: currentRow.surface,
            savedAt: Date.now(),
          })
        }
        disabled={!currentRow}
      >
        ⭐ Save
      </button>
    </div>
  );
}
