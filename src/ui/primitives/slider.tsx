import type { CSSProperties, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  /** what the value reads as ("800 ms") */
  show: (value: number) => ReactNode;
  className?: string;
}

/** a labelled range: the name on the left, the value on the right, the track below */
export function Slider({ label, value, min, max, step, onChange, show, className }: SliderProps) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <label className={cn('flex flex-col gap-2', className)}>
      <span className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs">
        <span className="font-medium text-foreground-muted">{label}</span>
        <span className="font-mono text-foreground tabular-nums">{show(value)}</span>
      </span>
      <input type="range" className="slider" min={min} max={max} step={step} value={value} style={{ '--fill': `${fill}%` } as CSSProperties} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}
