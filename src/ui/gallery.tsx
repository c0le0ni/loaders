import { loaders } from '@coleoni/loaders';
import { useMemo, useRef } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { component } from '../../packages/loaders/src/react';
import type { Strings } from '../i18n/strings';
import { NAMES } from '../i18n/strings';
import { cn } from '../lib/cn';
import type { Settings } from '../site';

const TILE = cn(
  'group/tile relative flex min-w-0 flex-col items-center justify-center gap-4 rounded-xl px-2 pt-8 pb-4 text-xs font-medium text-foreground-muted outline-offset-0',
  'transition-[background-color,color,box-shadow] duration-(--motion-normal) hover:bg-hover hover:text-foreground',
  'data-[on=true]:bg-surface-raised data-[on=true]:text-foreground data-[on=true]:shadow-lift',
);

/** every loader, live, as a group of choices: the arrow keys move through the grid */
export function Gallery({ selected, onSelect, color, settings, S }: { selected: string; onSelect: (name: string) => void; color: string; settings: Record<string, Settings>; S: Strings }) {
  const group = useRef<HTMLDivElement>(null);
  const components = useMemo(() => Object.fromEntries(loaders.map((d) => [d.name, component(d)])), []);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const tiles = [...(group.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [])];
    const at = loaders.findIndex((d) => d.name === selected);
    // columns: the tiles that share the first one's row
    const cols = tiles.filter((t) => t.offsetTop === tiles[0]?.offsetTop).length || 1;
    const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols, Home: -at, End: loaders.length - 1 - at }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const next = Math.max(0, Math.min(loaders.length - 1, at + step));
    onSelect(loaders[next].name);
    tiles[next]?.focus();
  }

  return (
    <div ref={group} role="radiogroup" aria-label={S.loaders} onKeyDown={onKeyDown} className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-1.5 sm:grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))]">
      {loaders.map((d, i) => {
        const on = d.name === selected;
        const Loader = components[d.name];
        const s = settings[d.name];
        return (
          <button
            key={d.name}
            type="button"
            role="radio"
            aria-checked={on}
            data-on={on}
            tabIndex={on ? 0 : -1}
            data-intro-tile
            style={{ '--i': i } as CSSProperties}
            className={TILE}
            onClick={() => onSelect(d.name)}
          >
            <span className="grid size-12 place-items-center transition-transform duration-(--motion-slow) ease-out-expo group-hover/tile:scale-110 group-active/tile:scale-95">
              <Loader size={44} color={color || undefined} duration={s?.duration} {...(s?.extras ?? {})} aria-hidden="true" />
            </span>
            <span className="max-w-full truncate">{NAMES[d.name]}</span>
          </button>
        );
      })}
    </div>
  );
}
