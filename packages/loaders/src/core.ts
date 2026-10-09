// The shared core: one definition per loader (its markup as a small tree, and its
// CSS) feeds both the React components and the plain HTML snippets, so the two
// can never drift apart.

export type Easing = 'linear' | 'ease-in-out' | 'stacked';
export type Cap = 'round' | 'flat';
export type Sweep = 'diagonal' | 'rows' | 'columns';
export type Direction = 'out' | 'in';
export type Origin = 'center' | 'bottom';
export type PlayState = 'running' | 'paused';

/** what every loader takes */
export interface BaseOptions {
  /** width and height in pixels (default 20) */
  size?: number;
  /** any CSS color; inherits the text color by default */
  color?: string;
  /** one cycle, in milliseconds; each loader has its own default */
  duration?: number;
  /** pause or resume the animation */
  playState?: PlayState;
}

/** the options a loader may add on top of the base ones */
export interface ExtraOptions {
  easing?: Easing;
  cap?: Cap;
  sweep?: Sweep;
  direction?: Direction;
  origin?: Origin;
}

export type Options = BaseOptions & ExtraOptions;

/** an element of a loader's markup */
export interface Node {
  tag: string;
  attrs: Record<string, string | number>;
  children: Node[];
}

export function h(tag: string, attrs: Record<string, string | number | undefined | false> = {}, ...children: (Node | Node[] | null | false)[]): Node {
  const clean: Record<string, string | number> = {};
  for (const [k, v] of Object.entries(attrs)) if (v !== undefined && v !== false) clean[k] = v;
  return { tag, attrs: clean, children: children.flat().filter((c): c is Node => !!c) };
}

/** n items, 0..n-1 */
export const range = (n: number) => Array.from({ length: n }, (_, i) => i);

/** a loader: its defaults, the options it accepts, its CSS and its markup */
export interface Def<E extends keyof ExtraOptions = never> {
  /** kebab-case, also the CSS class (`cl-<name>`) */
  name: string;
  /** the exported component's name */
  component: string;
  /** the default cycle, in ms */
  duration: number;
  /** the extra options it accepts, with their default values */
  defaults: Required<Pick<ExtraOptions, E>>;
  /** the extra options' allowed values, in display order */
  choices: { [K in E]: readonly NonNullable<ExtraOptions[K]>[] };
  /** keyframes and rules, scoped under `.cl-<name>` */
  css: string;
  /** the markup inside the root element, for the given options */
  tree(o: Required<Pick<ExtraOptions, E>>): Node[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDef = Def<any>;

/** the rules every loader shares: the root box, layers, pausing */
export const BASE_CSS = `.cl{display:inline-block;position:relative;flex:none;width:var(--cl-size);height:var(--cl-size);vertical-align:middle;line-height:0;color:inherit}
.cl svg{display:block;width:100%;height:100%;overflow:visible}
.cl .cl-l{position:absolute;inset:0;display:block}
.cl[data-state=paused],.cl[data-state=paused] *{animation-play-state:paused!important}
@media (prefers-reduced-motion:reduce){.cl,.cl *{animation:none!important}}
@keyframes cl-spin{to{transform:rotate(360deg)}}
@keyframes cl-fade{from{opacity:1}to{opacity:var(--cl-min)}}`;

/** rules for visitors who ask for less motion: every loader stops, on its own still pose */
export const still = (css: string) => `@media (prefers-reduced-motion:reduce){${css}}`;

/** an SVG layer filling the loader box, on the 24 unit grid */
export const svg = (attrs: Record<string, string | number | undefined | false>, ...children: (Node | Node[] | null | false)[]) =>
  h('svg', { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true', ...attrs }, ...children);

/** a CSS delay that puts item i of n at its place in a staggered cycle */
export const lag = (progress: number) => (progress === 0 ? '0s' : `calc(var(--cl-d) * ${-+progress.toFixed(5)})`);

/** "clockwise from the top": angle k of n, as x and y on a circle of radius r around 12,12 */
export function onCircle(k: number, n: number, r: number) {
  const a = (k / n) * 2 * Math.PI;
  return { x: +(12 + r * Math.sin(a)).toFixed(3), y: +(12 - r * Math.cos(a)).toFixed(3) };
}

/** the root element's attributes, for one loader with the given options */
export function rootAttrs(def: AnyDef, o: Options) {
  const extras: Record<string, string> = {};
  for (const key of Object.keys(def.defaults)) {
    const v = (o as Record<string, string | undefined>)[key] ?? (def.defaults as Record<string, string>)[key];
    extras[`data-${key}`] = v;
  }
  const style: Record<string, string> = {
    '--cl-size': `${o.size ?? 20}px`,
    '--cl-d': `${o.duration ?? def.duration}ms`,
  };
  if (o.color) style.color = o.color;
  return {
    className: `cl cl-${def.name}`,
    state: o.playState === 'paused' ? 'paused' : undefined,
    extras,
    style,
  };
}

/** the extra options with defaults filled in */
export function resolveExtras(def: AnyDef, o: Options) {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(def.defaults)) out[k] = (o as Record<string, string | undefined>)[k] ?? (v as string);
  return out as never;
}
