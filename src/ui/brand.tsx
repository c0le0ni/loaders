import { useEffect, useMemo, useRef } from 'react';
import { animateWordmark, wordmarkSvg } from '../brand';
import { cn } from '../lib/cn';
import { useReducedMotion } from './hooks';
import { C_PATH, LETTERS_PATH, LOCKUP_VIEW, SQUARE_PATH, SYMBOL_VIEW } from './lockup-paths';

/** the Coleoni lockup: the C and the letters take the text color, the square stays lime */
export function ColeoniLockup({ className }: { className?: string }) {
  return (
    <svg viewBox={LOCKUP_VIEW} aria-hidden="true" className={cn('h-5.5 w-auto', className)}>
      <path d={C_PATH} fill="currentColor" />
      <path d={SQUARE_PATH} fill="#aefa0e" />
      <path d={LETTERS_PATH} fill="currentColor" />
    </svg>
  );
}

/** the symbol alone, where the lockup would not fit */
export function ColeoniSymbol({ className }: { className?: string }) {
  return (
    <svg viewBox={SYMBOL_VIEW} aria-hidden="true" className={cn('h-5.5 w-auto', className)}>
      <path d={C_PATH} fill="currentColor" />
      <path d={SQUARE_PATH} fill="#aefa0e" />
    </svg>
  );
}

/** the "loaders" wordmark, whose square goes around the o */
export function LoadersWordmark({ className }: { className?: string }) {
  const host = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const html = useMemo(() => wordmarkSvg({ live: true, ink: 'currentColor', height: 22 }), []);
  useEffect(() => {
    if (reduced || !host.current) return;
    const draw = animateWordmark(host.current, 1600);
    let id = 0;
    const tick = (now: number) => {
      draw(now);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [reduced]);
  return <span ref={host} aria-hidden="true" className={cn('flex [&_svg]:h-5.5 [&_svg]:w-auto', className)} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** the GitHub mark, as the Skills site draws it */
export function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}
