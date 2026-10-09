import { Check, ChevronDown, Copy, Globe, Moon, Sun } from 'lucide-react';
import type { KeyboardEvent, ReactNode } from 'react';
import { STRINGS, type Strings } from '../i18n/strings';
import { cn } from '../lib/cn';
import { COLEONI, INSTALL, REPO } from '../site';
import { ColeoniLockup, ColeoniSymbol, GithubIcon, LoadersWordmark } from './brand';
import { copy, useTheme } from './hooks';
import { Button } from './primitives/button';
import { Popover, PopoverContent, PopoverTrigger } from './primitives/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from './primitives/tooltip';

export function ThemeToggle({ S }: { S: Strings }) {
  const { theme, toggle } = useTheme();
  const label = theme === 'light' ? S.toDark : S.toLight;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 touch:size-10" aria-label={label} onClick={toggle}>
          <span className="relative grid size-4 place-items-center">
            <Sun aria-hidden className={cn('absolute transition-[opacity,rotate,scale] duration-(--motion-slow) ease-out-expo', theme === 'light' ? 'scale-50 -rotate-90 opacity-0' : 'opacity-100')} />
            <Moon aria-hidden className={cn('absolute transition-[opacity,rotate,scale] duration-(--motion-slow) ease-out-expo', theme === 'light' ? 'opacity-100' : 'scale-50 rotate-90 opacity-0')} />
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{label}</TooltipContent>
    </Tooltip>
  );
}

const ITEM = cn(
  'flex min-h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-sm text-foreground outline-none select-none touch:min-h-11',
  'transition-colors duration-(--motion-fast) hover:bg-hover focus-visible:bg-hover',
);

/** EN / PT; the choice is saved, beats the automatic redirect, and keeps the loader */
export function LanguageMenu({ S, slug }: { S: Strings; slug: string }) {
  const langs = [STRINGS.en, STRINGS.pt];
  function moveFocus(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const items = [...event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitemradio"]')];
    const at = items.indexOf(document.activeElement as HTMLElement);
    items[(at + 1) % items.length]?.focus();
  }
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-8 gap-1 px-2 text-sm touch:h-10" aria-haspopup="menu">
          <Globe aria-hidden />
          <span className="sr-only">{S.language}: </span>
          <span className="font-medium">{S.lang.toUpperCase()}</span>
          <ChevronDown aria-hidden className="size-3.5! text-foreground-subtle" />
        </Button>
      </PopoverTrigger>
      <PopoverContent role="menu" aria-label={S.language} align="end" className="w-44 p-1" onKeyDown={moveFocus}>
        {langs.map((L) => {
          const on = L.lang === S.lang;
          const href = `${L.path}${slug ? `${slug}/` : ''}`;
          return (
            <a
              key={L.lang}
              role="menuitemradio"
              aria-checked={on}
              href={href}
              hrefLang={L.htmlLang}
              lang={L.htmlLang}
              className={ITEM}
              onClick={() => {
                try {
                  localStorage.setItem('coleoni-lang', L.lang);
                } catch {}
              }}
            >
              <span className="flex-1">{L.lang === 'pt' ? 'Português' : 'English'}</span>
              {on ? <Check aria-hidden className="size-4 text-foreground-muted" /> : null}
            </a>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}

/** the install command, copied with one click */
export function InstallCommand({ S, className }: { S: Strings; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={`${S.copyInstall}: ${INSTALL}`}
          onClick={() => copy(INSTALL, S.copied, S.copyFailed)}
          className={cn(
            'group flex h-8 items-center gap-2 rounded-lg border border-border bg-surface-sunken px-3 font-mono text-xs text-foreground-muted touch:h-10',
            'transition-colors duration-(--motion-fast) hover:border-border-strong hover:text-foreground',
            className,
          )}
        >
          <span aria-hidden className="text-accent-emphasis">$</span>
          <span>{INSTALL}</span>
          <Copy aria-hidden className="size-3.5 text-foreground-subtle transition-colors group-hover:text-foreground" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">{S.copyInstall}</TooltipContent>
    </Tooltip>
  );
}

export function GithubLink({ S }: { S: Strings }) {
  return (
    <Button asChild variant="ghost" className="h-8 gap-1.5 px-2.5 touch:h-10">
      <a href={REPO} target="_blank" rel="noopener noreferrer">
        <GithubIcon className="size-4" />
        <span className="max-sm:sr-only">{S.github}</span>
        <span className="sr-only"> {S.newTab}</span>
      </a>
    </Button>
  );
}

export function TopBar({ S, center, end, className }: { S: Strings; center?: ReactNode; end: ReactNode; className?: string }) {
  return (
    <header className={cn('relative z-30 flex h-14 shrink-0 items-center gap-3 px-3 sm:px-5', className)}>
      <div className="flex min-w-0 items-center gap-3">
        <a href={COLEONI} rel="noopener" aria-label={S.coleoni} data-intro className="flex shrink-0 rounded-sm text-foreground transition-opacity hover:opacity-80">
          <ColeoniLockup className="max-sm:hidden" />
          <ColeoniSymbol className="sm:hidden" />
        </a>
        <span aria-hidden data-intro className="h-4.5 w-px shrink-0 -skew-x-[18deg] bg-border-strong" />
        <a href={S.path} aria-label={S.home} className="flex shrink-0 rounded-sm text-foreground">
          <LoadersWordmark />
        </a>
      </div>
      {center ? <div className="absolute left-1/2 -translate-x-1/2 max-lg:hidden">{center}</div> : null}
      <div className="ml-auto flex items-center gap-1">{end}</div>
    </header>
  );
}
