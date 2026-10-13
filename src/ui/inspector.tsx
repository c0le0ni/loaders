import { Copy, Pause, Play, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { component } from '../../packages/loaders/src/react';
import type { Strings } from '../i18n/strings';
import { NAMES } from '../i18n/strings';
import { cn } from '../lib/cn';
import { byName, htmlCode, reactCode, SIZES, type Settings } from '../site';
import { ColorSwatches } from './color-picker';
import { copy } from './hooks';
import { Button } from './primitives/button';
import { Segmented } from './primitives/segmented';
import { Slider } from './primitives/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from './primitives/tooltip';

type Lang = 'react' | 'html';

/** the card beside the grid: the picked loader large, its settings, and its code */
export function Inspector({ name, settings, onSettings, onReset, color, onColor, S, className }: { name: string; settings: Settings; onSettings: (patch: Partial<Settings>) => void; onReset: () => void; color: string; onColor: (hex: string) => void; S: Strings; className?: string }) {
  const def = byName(name);
  const Loader = useMemo(() => component(def), [def]);
  const [paused, setPaused] = useState(false);
  const [lang, setLang] = useState<Lang>('react');
  const code = lang === 'react' ? reactCode(def, settings, color) : htmlCode(def, settings, color);
  const choices = def.choices as Record<string, readonly string[]>;
  const label = NAMES[def.name];

  return (
    <section aria-label={S.settings} className={cn('flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 shadow-lg [overflow-wrap:anywhere] md:max-h-full md:min-h-0', className)}>
      <header className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">{label}</h2>
          <p className="mt-0.5 text-sm text-foreground-muted first-letter:uppercase">{S.about[def.name]}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={paused ? S.play : S.pause} onClick={() => setPaused((p) => !p)}>
                {paused ? <Play aria-hidden /> : <Pause aria-hidden />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{paused ? S.play : S.pause}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={S.reset} onClick={onReset}>
                <RotateCcw aria-hidden />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{S.reset}</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* on a desktop the card never outgrows the screen: everything below the title scrolls inside it */}
      <div className="flex flex-col gap-4 *:shrink-0 md:-mx-4 md:-mb-4 md:min-h-0 md:overflow-y-auto md:px-4 md:pb-4 md:[scrollbar-gutter:stable] md:[scrollbar-width:thin]">
        <div role="img" aria-label={S.preview(label)} className="grid h-44 place-items-center rounded-lg bg-surface-sunken">
          <Loader key={def.name} size={settings.size} color={color || undefined} duration={settings.duration} playState={paused ? 'paused' : 'running'} style={{ opacity: settings.opacity / 100 }} aria-hidden="true" {...settings.extras} />
        </div>

        <div className="flex flex-col gap-4">
          <Field label={S.size}>
            <Segmented label={S.size} value={String(settings.size)} onChange={(v) => onSettings({ size: Number(v) as Settings['size'] })} options={SIZES.map((v) => ({ value: String(v), label: S.sizes[v] }))} />
          </Field>
          {Object.entries(choices).map(([key, values]) => (
            <Field key={key} label={S.options[key]}>
              <Segmented label={S.options[key]} value={settings.extras[key]} onChange={(v) => onSettings({ extras: { ...settings.extras, [key]: v } })} options={values.map((v) => ({ value: v, label: S.values[v] }))} />
            </Field>
          ))}
          <Field label={S.color}>
            <ColorSwatches value={color} onChange={onColor} S={S} />
          </Field>
          <Slider label={S.speed} min={200} max={4000} step={50} value={settings.duration} onChange={(duration) => onSettings({ duration })} show={S.ms} />
          <Slider label={S.opacity} min={10} max={100} step={5} value={settings.opacity} onChange={(opacity) => onSettings({ opacity })} show={S.percent} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Segmented label={S.code} value={lang} onChange={setLang} tabs options={[{ value: 'react', label: S.react, controls: 'code-panel' }, { value: 'html', label: S.html, controls: 'code-panel' }]} className="max-w-40 grow basis-28" />
            <Button variant="primary" size="md" className="h-auto min-h-control max-w-full shrink py-1 whitespace-normal touch:h-auto touch:min-h-10" onClick={() => copy(code, S.copiedCode(label), S.copyFailed)}>
              <Copy aria-hidden />
              {S.copyCode}
            </Button>
          </div>
          <pre id="code-panel" role="tabpanel" tabIndex={0} aria-label={S.code} className="rounded-lg border border-border bg-surface-sunken p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-foreground-muted outline-offset-2 [overflow-wrap:anywhere]">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-foreground-muted">{label}</span>
      {children}
    </div>
  );
}
