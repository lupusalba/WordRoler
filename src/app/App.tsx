/** Top-level app shell: loads deck and renders Home page */
import { useEffect } from 'react';
import Home from '@/pages/Home';
import { useDeckStore } from '@/state/useDeckStore';
import '@/styles/globals.css';

export default function App() {
  const { load, deck, status, error } = useDeckStore();

  useEffect(() => {
    // Load the default Spanish A1 deck from /public
    load('/decks/es_a1_requests.json');
  }, [load]);

  if (status === 'loading') return <div className="screen">Cargando…</div>;
  if (status === 'error') return <div className="screen error">Error: {error}</div>;
  if (!deck) return null;

  return <Home />;
}
