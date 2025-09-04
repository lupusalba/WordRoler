/** Small reusable lock button (unused in Column because it's inline there; keep for future reuse) */
type Props = { locked: boolean; onToggle: () => void };
export default function LockButton({ locked, onToggle }: Props) {
  return (
    <button className="lock" onClick={onToggle} aria-pressed={locked} title="Lock column">
      {locked ? '🔒' : '🔓'}
    </button>
  );
}
