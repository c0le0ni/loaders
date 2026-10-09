import { loaders } from '@coleoni/loaders';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Strings } from '../i18n/strings';
import { cn } from '../lib/cn';
import { BLOB, COLEONI, REPO, SKILLS, byName, defaults, type Settings } from '../site';
import { GithubIcon } from './brand';
import { Gallery } from './gallery';
import { useNotice } from './hooks';
import { Inspector } from './inspector';
import { TooltipProvider } from './primitives/tooltip';
import { GithubLink, InstallCommand, LanguageMenu, ThemeToggle, TopBar } from './top-bar';

/** the loader the home page opens on */
export const HOME_LOADER = 'coleoni';

function Toaster() {
  const notice = useNotice();
  const [shown, setShown] = useState(notice);
  useEffect(() => {
    if (notice) return setShown(notice);
    // the last notice leaves with its own animation
    const id = window.setTimeout(() => setShown(null), 160);
    return () => clearTimeout(id);
  }, [notice]);
  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-5 z-50 flex justify-center px-4">
      {shown ? (
        <div key={shown.id} className={cn('rounded-lg border border-border-strong bg-surface-raised px-3 py-2 text-sm font-medium text-foreground shadow-lg', notice ? 'animate-toast-in' : 'animate-toast-out')}>
          {shown.text}
        </div>
      ) : null}
    </div>
  );
}

export function App({ S, initial }: { S: Strings; initial: string }) {
  const [selected, setSelected] = useState(initial);
  const [color, setColor] = useState('');
  const [settings, setSettings] = useState<Record<string, Settings>>(() => Object.fromEntries(loaders.map((d) => [d.name, defaults(d)])));
  const inspector = useRef<HTMLDivElement>(null);

  // each loader has its own address; the home page is the home loader's
  useEffect(() => {
    const path = selected === HOME_LOADER ? S.path : `${S.path}${selected}/`;
    if (location.pathname !== path) history.replaceState(null, '', path);
  }, [selected, S.path]);

  const select = useCallback((name: string) => {
    setSelected(name);
    // on a phone the card sits above the grid: bring it back into view
    const el = inspector.current;
    if (el && matchMedia('(max-width: 767px)').matches && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const change = (patch: Partial<Settings>) => setSettings((all) => ({ ...all, [selected]: { ...all[selected], ...patch } }));
  const reset = () => {
    setSettings((all) => ({ ...all, [selected]: defaults(byName(selected)) }));
    setColor('');
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-dvh flex-col md:h-dvh">
        <a href="#content" className="sr-only z-50 rounded-lg bg-accent px-3 py-2 text-sm font-medium text-accent-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
          {S.skip}
        </a>
        <TopBar
          S={S}
          center={<InstallCommand S={S} />}
          end={
            <>
              <ThemeToggle S={S} />
              <LanguageMenu S={S} slug={selected === HOME_LOADER ? '' : selected} />
              <GithubLink S={S} />
            </>
          }
        />
        <div className="flex justify-center px-3 pb-2 lg:hidden">
          <InstallCommand S={S} />
        </div>
        <main id="content" tabIndex={-1} className="flex min-h-0 outline-none flex-1 flex-col gap-3 px-3 pb-3 md:flex-row md:gap-4 md:px-5 md:pb-0">
          <div className="min-h-0 md:flex-1 md:overflow-y-auto md:pb-4">
            <h1 className="sr-only">{S.h1}</h1>
            <Gallery selected={selected} onSelect={select} color={color} settings={settings} S={S} />
          </div>
          <div ref={inspector} data-intro-card className="order-first scroll-mt-3 md:order-none md:flex md:min-h-0 md:w-[22rem] md:shrink-0 md:flex-col md:pb-4">
            <Inspector name={selected} settings={settings[selected]} onSettings={change} onReset={reset} color={color} onColor={setColor} S={S} />
          </div>
        </main>
        <footer className="flex h-10 shrink-0 items-center justify-center gap-2 px-4 text-2xs text-foreground-muted">
          <span>
            {S.madeBy}{' '}
            <a href={COLEONI} rel="noopener" className="font-medium text-foreground transition-colors hover:text-accent-emphasis">
              Coleoni
            </a>
          </span>
          <span aria-hidden>·</span>
          <a href={REPO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
            <GithubIcon className="size-3" />
            {S.github}
            <span className="sr-only"> {S.newTab}</span>
          </a>
          <span aria-hidden>·</span>
          <a href={`${SKILLS}${S.path}`} rel="noopener" className="transition-colors hover:text-foreground">
            {S.skills}
          </a>
          <span aria-hidden>·</span>
          <a href={`${BLOB}${S.path}`} rel="noopener" className="transition-colors hover:text-foreground">
            {S.blob}
          </a>
        </footer>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
