/** Final sentence output (surface + IPA if present) */
import { useDeckStore } from '../state/useDeckStore';

export default function OutputPane() {
  const { currentRow } = useDeckStore();
  if (!currentRow) return <div className="output dim">—</div>;

  return (
    <div className="output">
      <div className="surface">{currentRow.surface}</div>
      {currentRow.ipa ? <div className="ipa">[{currentRow.ipa}]</div> : null}
    </div>
  );
}
