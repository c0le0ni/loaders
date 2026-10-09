// The brand lab: the wordmark, the lockup, the mark and our own loader.

import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Coleoni } from '@coleoni/loaders';
import { animateWordmark, LIME, markSvg, wordmarkSvg } from './brand';
import { C_PATH, LETTERS_PATH, LOCKUP_VIEW, SQUARE_PATH } from './ui/lockup-paths';

function Lockup() {
  return (
    <svg viewBox={LOCKUP_VIEW} aria-hidden="true" style={{ height: 22, width: 'auto' }}>
      <path d={C_PATH} fill="currentColor" />
      <path d={SQUARE_PATH} fill={LIME} />
      <path d={LETTERS_PATH} fill="currentColor" />
    </svg>
  );
}

/** a live wordmark: the square goes around the o */
function Live({ height, ink, period }: { height: number; ink: string; period?: number }) {
  const host = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const draw = animateWordmark(host.current!, period);
    let id = 0;
    const tick = (t: number) => {
      draw(t);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [period]);
  return <span ref={host} style={{ display: 'flex' }} dangerouslySetInnerHTML={{ __html: wordmarkSvg({ height, ink, live: true }) }} />;
}

function App() {
  return (
    <main>
      <section className="panel">
        <h2>Top bar</h2>
        <div className="bar">
          <Lockup />
          <span className="slash" />
          <Live height={22} ink="#f5f5f5" />
        </div>
      </section>

      <section className="panel">
        <h2>Wordmark</h2>
        <div className="row">
          <Live height={72} ink="#f5f5f5" />
          <span dangerouslySetInnerHTML={{ __html: wordmarkSvg({ height: 72 }) }} />
        </div>
      </section>

      <section className="panel light">
        <h2>Wordmark, light</h2>
        <div className="row">
          <span dangerouslySetInnerHTML={{ __html: wordmarkSvg({ height: 72, ink: '#1b1c1e', accent: '#1b1c1e' }) }} />
          <span dangerouslySetInnerHTML={{ __html: wordmarkSvg({ height: 72, ink: '#1b1c1e' }) }} />
        </div>
      </section>

      <section className="panel">
        <h2>Mark (favicon, avatar)</h2>
        <div className="row">
          {[16, 32, 64, 128].map((s) => (
            <span key={s} dangerouslySetInnerHTML={{ __html: markSvg({ size: s }) }} />
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>Our loader: Coleoni</h2>
        <div className="row">
          {[20, 32, 48, 96].map((s) => (
            <Coleoni key={s} size={s} />
          ))}
          <span className="lime">
            <Coleoni size={48} />
          </span>
        </div>
      </section>

    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
