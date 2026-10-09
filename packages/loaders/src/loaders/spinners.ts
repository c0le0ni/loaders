// Strokes that turn around the center.

import { h, lag, still, svg, type Def, type Easing } from '../core';

const EASINGS = ['linear', 'ease-in-out', 'stacked'] as const satisfies readonly Easing[];
const CAPS = ['round', 'flat'] as const;
const linecap = (cap: string) => (cap === 'flat' ? 'butt' : 'round');

/**
 * The turning rule shared by the spinners. The inner layer turns once a cycle,
 * linear or eased; "stacked" adds a linear turn on the outer layer, so the
 * speed changes without ever stopping.
 */
export function turning(name: string, inner = `.cl-${name}-i`, outer = `.cl-${name}-o`) {
  return `.cl-${name} ${inner}{animation:cl-spin var(--cl-d) linear infinite}
.cl-${name}[data-easing=ease-in-out] ${inner},.cl-${name}[data-easing=stacked] ${inner}{animation-timing-function:ease-in-out}
.cl-${name}[data-easing=stacked] ${outer}{animation:cl-spin var(--cl-d) linear infinite}`;
}

/** a dash of `len` units on the r=10 circle, starting at three o'clock */
const dash = (len: number, cap: string, extra: Record<string, string | number> = {}) =>
  h('circle', { cx: 12, cy: 12, r: 10, stroke: 'currentColor', 'stroke-width': 2.5, 'stroke-linecap': linecap(cap), 'stroke-dasharray': `${len} 100`, ...extra });

export const arc: Def<'easing' | 'cap'> = {
  name: 'arc',
  component: 'Arc',
  duration: 800,
  defaults: { easing: 'linear', cap: 'round' },
  choices: { easing: EASINGS, cap: CAPS },
  css: turning('arc'),
  tree: ({ cap }) => [h('span', { class: 'cl-l cl-arc-o' }, svg({ class: 'cl-l cl-arc-i' }, dash(18, cap)))],
};

export const dual: Def<'easing' | 'cap'> = {
  name: 'dual',
  component: 'Dual',
  duration: 1000,
  defaults: { easing: 'linear', cap: 'round' },
  choices: { easing: EASINGS, cap: CAPS },
  // the outer arc turns clockwise, the inner one the other way
  css: `${turning('dual')}
.cl-dual[data-easing] .cl-dual-b,.cl-dual[data-easing] .cl-dual-b>svg{animation-direction:reverse}
${still('.cl-dual .cl-dual-b{transform:rotate(180deg)}')}`,
  tree: ({ cap }) => [
    h('span', { class: 'cl-l cl-dual-o' }, svg({ class: 'cl-l cl-dual-i' }, dash(18, cap))),
    h('span', { class: 'cl-l cl-dual-o cl-dual-b' }, svg({ class: 'cl-l cl-dual-i' }, dash(10, cap, { r: 5.5 }))),
  ],
};

// a quarter of a circle of radius r, in real units (browsers measure small circles
// loosely when pathLength is used)
const quarter = (r: number) => `${+((Math.PI * r) / 2).toFixed(4)} 100`;

export const cascade: Def<'cap'> = {
  name: 'cascade',
  component: 'Cascade',
  duration: 1500,
  defaults: { cap: 'round' },
  choices: { cap: CAPS },
  // each arc winds back, swings once around past its place and settles; the
  // outer one leads, so they fan into a spiral and line up again
  css: `@keyframes cl-cascade{from{transform:rotate(15deg)}to{transform:rotate(375deg)}}
.cl-cascade svg{animation:cl-cascade var(--cl-d) cubic-bezier(.725,-.858,.306,1.622) infinite}
.cl-cascade svg:nth-child(1){animation-delay:${lag(23 / 24)}}
.cl-cascade svg:nth-child(3){animation-delay:${lag(1 / 24)}}`,
  tree: ({ cap }) =>
    [3.5, 7, 10.5].map((r) =>
      svg(
        { class: 'cl-l' },
        h('circle', { cx: 12, cy: 12, r, stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': linecap(cap), 'stroke-dasharray': quarter(r) }),
      ),
    ),
};

export const atom: Def<'easing'> = {
  name: 'atom',
  component: 'Atom',
  duration: 1000,
  defaults: { easing: 'linear' },
  choices: { easing: EASINGS },
  // a circle, and three rings inside it turning in depth, each around its own
  // axis (straight up, and a sixth of a turn to either side), a third of a
  // cycle apart
  css: `@keyframes cl-atom{to{transform:rotateY(360deg)}}
.cl-atom .cl-atom-o{transform-style:preserve-3d}
.cl-atom i,.cl-atom b{position:absolute;inset:0;border-radius:50%;border:calc(var(--cl-size) * .052083) solid}
.cl-atom i{animation:cl-atom var(--cl-d) linear infinite}
.cl-atom[data-easing=ease-in-out] i,.cl-atom[data-easing=stacked] i{animation-timing-function:ease-in-out}
.cl-atom[data-easing=stacked] .cl-atom-o{animation:cl-atom var(--cl-d) linear infinite}
.cl-atom>span:nth-child(3){transform:rotate(60deg)}
.cl-atom>span:nth-child(4){transform:rotate(-60deg)}
.cl-atom[data-easing]>span:nth-child(3) *{animation-delay:${lag(2 / 3)}}
.cl-atom[data-easing]>span:nth-child(4) *{animation-delay:${lag(1 / 3)}}
${still('.cl-atom i{transform:rotateY(60deg)}')}`,
  tree: () => [h('b', {}), ...[0, 1, 2].map(() => h('span', { class: 'cl-l' }, h('span', { class: 'cl-l cl-atom-o' }, h('i', {}))))],
};

/** a ring of the box's full size, from radius `inner` to 12, painted by a conic gradient */
const ringMask = (inner: number) => `radial-gradient(closest-side,#0000 ${((inner / 12) * 100).toFixed(3)}%,#000 ${((inner / 12) * 100).toFixed(3)}%)`;

export const comet: Def<'easing'> = {
  name: 'comet',
  component: 'Comet',
  duration: 700,
  defaults: { easing: 'linear' },
  choices: { easing: EASINGS },
  // a full ring fading from nothing to the head, which has a round cap
  css: `${turning('comet')}
.cl-comet .cl-comet-i>i{position:absolute;border-radius:50%}
.cl-comet .cl-comet-i>i:first-child{inset:0;background:conic-gradient(#0000,currentColor);-webkit-mask:${ringMask(9)};mask:${ringMask(9)}}
.cl-comet .cl-comet-i>i:last-child{left:43.75%;top:0;width:12.5%;height:12.5%;background:currentColor}`,
  tree: () => [h('span', { class: 'cl-l cl-comet-o' }, h('span', { class: 'cl-l cl-comet-i' }, h('i', {}), h('i', {})))],
};

export const orbit: Def<'easing'> = {
  name: 'orbit',
  component: 'Orbit',
  duration: 750,
  defaults: { easing: 'linear' },
  choices: { easing: EASINGS },
  // half a ring fading into its tail, around a dot
  css: `${turning('orbit')}
.cl-orbit i{position:absolute;border-radius:50%}
.cl-orbit>i{inset:37.5%;background:currentColor}
.cl-orbit .cl-orbit-i>i{inset:8.333%;background:conic-gradient(from 180deg,#0000,currentColor 180deg,#0000 0);-webkit-mask:${ringMask(10.2)};mask:${ringMask(10.2)}}`,
  tree: () => [h('i', {}), h('span', { class: 'cl-l cl-orbit-o' }, h('span', { class: 'cl-l cl-orbit-i' }, h('i', {})))],
};

/**
 * A pie slice of radius r, from 12 o'clock clockwise through `deg`, its corners
 * rounded by k. Each straight edge may sit `off` units inside its ray. Drawn as
 * the slice shrunk by k on every side plus a 2k round-joined stroke.
 */
function slice(deg: number, r: number, k: number, off1 = 0, off2 = 0) {
  const th = (deg * Math.PI) / 180;
  const u1 = [0, -1], n1 = [1, 0];
  const u2 = [Math.sin(th), -Math.cos(th)], n2 = [-Math.cos(th), -Math.sin(th)];
  const d1 = off1 + k, d2 = off2 + k, ri = r - k;
  // apex: on both shrunk edges
  const det = n1[0] * n2[1] - n1[1] * n2[0];
  const ax = 12 + (d1 * n2[1] - d2 * n1[1]) / det, ay = 12 + (n1[0] * d2 - n2[0] * d1) / det;
  // where each shrunk edge meets the shrunk arc
  const s1 = Math.sqrt(ri * ri - d1 * d1), s2 = Math.sqrt(ri * ri - d2 * d2);
  const b = [12 + d1 * n1[0] + s1 * u1[0], 12 + d1 * n1[1] + s1 * u1[1]];
  const c = [12 + d2 * n2[0] + s2 * u2[0], 12 + d2 * n2[1] + s2 * u2[1]];
  const f = (n: number) => +n.toFixed(3);
  return `M${f(ax)} ${f(ay)}L${f(b[0])} ${f(b[1])}A${ri} ${ri} 0 ${deg > 180 ? 1 : 0} 1 ${f(c[0])} ${f(c[1])}Z`;
}

export const clock: Def<'easing'> = {
  name: 'clock',
  component: 'Clock',
  duration: 1200,
  defaults: { easing: 'linear' },
  choices: { easing: EASINGS },
  css: `${turning('clock')}
.cl-clock>i{position:absolute;inset:0;border-radius:50%;background:currentColor;opacity:.1}`,
  tree: () => [
    h('i', {}),
    h(
      'span',
      { class: 'cl-l cl-clock-o' },
      svg({ class: 'cl-l cl-clock-i' }, h('path', { d: slice(131.5, 9, 1, 0, 0.42), fill: 'currentColor', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linejoin': 'round' })),
    ),
  ],
};

/** the rounded square both Trace layers are drawn on */
const square = (extra: Record<string, string | number>) => h('rect', { x: 1.5, y: 1.5, width: 21, height: 21, rx: 4.75, stroke: 'currentColor', 'stroke-width': 3, ...extra });

export const trace: Def<'easing' | 'cap'> = {
  name: 'trace',
  component: 'Trace',
  duration: 1200,
  defaults: { easing: 'linear', cap: 'round' },
  choices: { easing: EASINGS, cap: CAPS },
  // a quarter of the outline travels around it once a cycle; "stacked" is the
  // linear and the eased trip added together (twice around, never stopping)
  css: `@keyframes cl-trace{to{stroke-dashoffset:-75.845}}
.cl-trace .cl-trace-i{animation:cl-trace var(--cl-d) linear infinite}
.cl-trace[data-easing=ease-in-out] .cl-trace-i{animation-timing-function:ease-in-out}
.cl-trace[data-easing=stacked] .cl-trace-i{animation:cl-trace-2 var(--cl-d) cubic-bezier(.42,.21,.58,.79) infinite}
@keyframes cl-trace-2{to{stroke-dashoffset:-151.69}}`,
  tree: ({ cap }) => [
    svg({}, square({ opacity: 0.2 }), square({ class: 'cl-trace-i', 'stroke-dasharray': '19.25 56.595', 'stroke-linecap': linecap(cap) })),
  ],
};

export const snake: Def<'easing' | 'cap'> = {
  name: 'snake',
  component: 'Snake',
  duration: 1400,
  defaults: { easing: 'linear', cap: 'round' },
  choices: { easing: EASINGS, cap: CAPS },
  // while the circle turns once, the dash stretches over the first half; over the
  // second its head runs into the end of the circle and the tail catches up
  css: `${turning('snake')}
@keyframes cl-snake{0%{stroke-dasharray:1 100;stroke-dashoffset:0}50%{stroke-dasharray:45 100;stroke-dashoffset:-17.02}100%{stroke-dasharray:45 100;stroke-dashoffset:-61.832}}
.cl-snake circle{animation:cl-snake var(--cl-d) ease-in-out infinite}
${still('.cl-snake circle{stroke-dasharray:18 100}')}`,
  tree: ({ cap }) => [h('span', { class: 'cl-l cl-snake-o' }, svg({ class: 'cl-l cl-snake-i' }, dash(1, cap)))],
};

export const ring: Def<'easing' | 'cap'> = {
  name: 'ring',
  component: 'Ring',
  duration: 800,
  defaults: { easing: 'linear', cap: 'round' },
  choices: { easing: EASINGS, cap: CAPS },
  css: turning('ring'),
  tree: ({ cap }) => [
    svg({}, h('circle', { cx: 12, cy: 12, r: 10, stroke: 'currentColor', 'stroke-width': 2.5, opacity: 0.2 })),
    h('span', { class: 'cl-l cl-ring-o' }, svg({ class: 'cl-l cl-ring-i' }, dash(16, cap))),
  ],
};
