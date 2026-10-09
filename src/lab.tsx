// A bare page for checking the loaders by eye and by script.
//   /lab.html                      every loader
//   /lab.html?n=arc&size=96&easing=stacked&cap=flat
// One loader sits alone in a 144 px box at the top left, centered.

import { createRoot } from 'react-dom/client';
import { loaders } from '@coleoni/loaders';
import { component } from '../packages/loaders/src/react';

const q = new URLSearchParams(location.search);
const name = q.get('n');
const root = createRoot(document.getElementById('root')!);

if (name) {
  const def = loaders.find((d) => d.name === name);
  if (!def) throw new Error(`no loader ${name}`);
  const Loader = component(def);
  const opts: Record<string, string> = {};
  for (const k of ['easing', 'cap', 'sweep', 'direction', 'origin']) if (q.get(k)) opts[k] = q.get(k)!;
  // dx/dy (in 24-unit grid steps) shift the loader, to line it up with an off-center reference
  const size = Number(q.get('size') ?? 96);
  const shift = `translate(${(Number(q.get('dx') ?? 0) * size) / 24}px, ${(Number(q.get('dy') ?? 0) * size) / 24}px)`;
  root.render(
    <div className="one">
      <span style={{ display: 'inline-flex', transform: shift }}>
        <Loader size={size} {...opts} />
      </span>
    </div>,
  );
} else {
  root.render(
    <div className="all">
      {loaders.map((def) => {
        const Loader = component(def);
        return (
          <figure key={def.name}>
            <Loader size={40} />
            <figcaption>{def.component}</figcaption>
          </figure>
        );
      })}
    </div>,
  );
}
