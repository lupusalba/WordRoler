/** Home page: columns (slot wheels), actions, and output */
import { useDeckStore } from '../state/useDeckStore';
import Column from '../components/Column';
import SpinBar from '../components/SpinBar';
import OutputPane from '../components/OutputPane';

export default function Home() {
  const { deck } = useDeckStore();
  if (!deck) return null;

  return (
    <div className="screen">
      <h1 className="title">SlotLang — ES A1</h1>

      <div className="columns">
        {deck.slots.map((slot: any) => (
          <Column key={slot.name} slotName={slot.name} />
        ))}
      </div>

      <SpinBar />
      <OutputPane />
    </div>
  );
}
