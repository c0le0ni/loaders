// Loaders where a light runs around a ring of items: each item flashes to full
// and fades while the light moves on, so the newest is the brightest.

import { h, lag, onCircle, range, still, svg, type Def } from '../core';

/**
 * n items fading from 1 to `min` over one cycle, item k lit k/n of a cycle later;
 * held still, all of them at `rest`
 */
function fadeRule(name: string, sel: string, n: number, min: number, rest: number) {
  const delays = range(n)
    .map((k) => `.cl-${name} ${sel}:nth-child(${k + 1}){animation-delay:${lag(((n - k) % n) / n)}}`)
    .join('\n');
  return `.cl-${name}{--cl-min:${min}}
.cl-${name} ${sel}{animation:cl-fade var(--cl-d) linear infinite}
${delays}
${still(`.cl-${name} ${sel}{opacity:${rest}}`)}`;
}

export const circularDots: Def = {
  name: 'circular-dots',
  component: 'CircularDots',
  duration: 800,
  defaults: {},
  choices: {},
  css: fadeRule('circular-dots', 'circle', 8, 0.2, 0.6),
  tree: () => [
    svg(
      { fill: 'currentColor' },
      range(8).map((k) => {
        const p = onCircle(k, 8, 9.75);
        return h('circle', { cx: p.x, cy: p.y, r: 2.25 });
      }),
    ),
  ],
};

/** the eight cells around a 3 by 3 square, clockwise from the top left */
const RIM = [
  [3.75, 3.75],
  [12, 3.75],
  [20.25, 3.75],
  [20.25, 12],
  [20.25, 20.25],
  [12, 20.25],
  [3.75, 20.25],
  [3.75, 12],
];

export const swirl: Def = {
  name: 'swirl',
  component: 'Swirl',
  duration: 1200,
  defaults: {},
  choices: {},
  css: fadeRule('swirl', 'rect', 8, 0.2, 0.6),
  tree: () => [svg({ fill: 'currentColor' }, RIM.map(([x, y]) => h('rect', { x: x - 2.25, y: y - 2.25, width: 4.5, height: 4.5, rx: 1.5 })))],
};

export const classic: Def = {
  name: 'classic',
  component: 'Classic',
  duration: 1200,
  defaults: {},
  choices: {},
  css: fadeRule('classic', 'line', 12, 0.15, 0.5),
  // twelve bars, the first at three o'clock
  tree: () => [
    svg(
      { stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' },
      range(12).map((k) => {
        const a = onCircle(k + 3, 12, 6.5);
        const b = onCircle(k + 3, 12, 10.25);
        return h('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      }),
    ),
  ],
};

export const classicV2: Def = {
  name: 'classic-v2',
  component: 'ClassicV2',
  duration: 800,
  defaults: {},
  choices: {},
  css: fadeRule('classic-v2', 'line', 8, 0.4, 0.5),
  tree: () => [
    svg(
      { stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round' },
      range(8).map((k) => {
        const a = onCircle(k, 8, 7);
        const b = onCircle(k, 8, 11);
        return h('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y });
      }),
    ),
  ],
};

export const linearDots: Def = {
  name: 'linear-dots',
  component: 'LinearDots',
  duration: 900,
  defaults: {},
  choices: {},
  // each dot lights up over a third of the cycle and dims over the other two
  css: `@keyframes cl-linear-dots{0%,100%{opacity:1}66.667%{opacity:.5}}
.cl-linear-dots circle{animation:cl-linear-dots var(--cl-d) linear infinite}
.cl-linear-dots circle:nth-child(2){animation-delay:${lag(2 / 3)}}
.cl-linear-dots circle:nth-child(3){animation-delay:${lag(1 / 3)}}
${still(".cl-linear-dots circle{opacity:.75}")}`,
  tree: () => [svg({ fill: 'currentColor' }, [3, 12, 21].map((x) => h('circle', { cx: x, cy: 12, r: 2.25 })))],
};
