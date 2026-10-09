// Loaders made of rows and grids of pieces that grow, shrink and bounce.

import { h, lag, range, still, svg, type Def, type Origin, type Sweep } from '../core';

/** item k of n lags k/n of a cycle behind the first */
const behind = (k: number, n: number) => lag((1 - k / n) % 1);

export const wave: Def<'origin'> = {
  name: 'wave',
  component: 'Wave',
  duration: 900,
  defaults: { origin: 'center' },
  choices: { origin: ['center', 'bottom'] satisfies Origin[] },
  // the bars change height (not scale), so their ends stay round
  css: `@keyframes cl-wave{0%,100%{height:30%}50%{height:100%}}
.cl-wave .cl-l{display:flex;align-items:center;justify-content:space-between}
.cl-wave[data-origin=bottom] .cl-l{align-items:flex-end}
.cl-wave i{width:12.5%;height:100%;border-radius:999px;background:currentColor;animation:cl-wave var(--cl-d) ease-in-out infinite}
${range(5)
  .slice(1)
  .map((k) => `.cl-wave i:nth-child(${k + 1}){animation-delay:${behind(k, 5)}}`)
  .join('\n')}
${still(range(5).map((k) => `.cl-wave i:nth-child(${k + 1}){height:${40 + k * 15}%}`).join(''))}`,
  tree: () => [h('span', { class: 'cl-l' }, range(5).map(() => h('i', {})))],
};

const CELLS = range(9).map((i) => ({ row: Math.floor(i / 3), col: i % 3 }));

/** which wave of the sweep each block belongs to, and how many waves there are */
const SWEEPS: Record<Sweep, { group: (c: { row: number; col: number }) => number; n: number }> = {
  diagonal: { group: (c) => c.row + c.col, n: 5 },
  rows: { group: (c) => c.row, n: 3 },
  columns: { group: (c) => c.col, n: 3 },
};

export const blocks: Def<'sweep'> = {
  name: 'blocks',
  component: 'Blocks',
  duration: 1300,
  defaults: { sweep: 'diagonal' },
  choices: { sweep: ['diagonal', 'rows', 'columns'] satisfies Sweep[] },
  css: `@keyframes cl-blocks{0%{transform:scale(1)}35%{transform:scale(0)}70%,100%{transform:scale(1)}}
.cl-blocks .cl-l{display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);gap:9.375%}
.cl-blocks i{border-radius:23.077%;background:currentColor;animation:cl-blocks var(--cl-d) ease-in-out infinite}
${(Object.keys(SWEEPS) as Sweep[])
  .flatMap((s) =>
    CELLS.map((c, i) => {
      const g = SWEEPS[s].group(c);
      return g ? `.cl-blocks[data-sweep=${s}] i:nth-child(${i + 1}){animation-delay:${behind(g, SWEEPS[s].n)}}` : '';
    }),
  )
  .filter(Boolean)
  .join('\n')}
${still('.cl-blocks i{transform:scale(.8)}')}`,
  tree: () => [h('span', { class: 'cl-l' }, CELLS.map(() => h('i', {})))],
};

export const bouncingDots: Def = {
  name: 'bouncing-dots',
  component: 'BouncingDots',
  duration: 500,
  defaults: {},
  choices: {},
  // down in one cycle, back up in the next; each dot a third of a cycle behind
  css: `@keyframes cl-bouncing-dots{to{transform:translateY(6px)}}
.cl-bouncing-dots circle{animation:cl-bouncing-dots var(--cl-d) ease-in-out infinite alternate}
.cl-bouncing-dots circle:nth-child(2){animation-delay:${lag(5 / 3)}}
.cl-bouncing-dots circle:nth-child(3){animation-delay:${lag(4 / 3)}}
${still(".cl-bouncing-dots circle{transform:translateY(4.32px)}")}`,
  tree: () => [svg({ fill: 'currentColor' }, [1.25, 12, 22.75].map((x) => h('circle', { cx: x, cy: 7.68, r: 3 })))],
};

export const gather: Def = {
  name: 'gather',
  component: 'Gather',
  duration: 1600,
  defaults: {},
  choices: {},
  // four blocks draw in, turn a quarter together, and spread out again
  css: `@keyframes cl-gather-turn{0%,30%{transform:rotate(0)}60%,100%{transform:rotate(90deg)}}
@keyframes cl-gather{0%,100%{translate:0 0}30%,60%{translate:calc(var(--gx) * 21.45%) calc(var(--gy) * 21.45%)}}
.cl-gather .cl-l{animation:cl-gather-turn var(--cl-d) ease-in-out infinite}
.cl-gather i{position:absolute;width:37.5%;height:37.5%;border-radius:36.667%;background:currentColor;animation:cl-gather var(--cl-d) ease-in-out infinite}
.cl-gather i:nth-child(1){left:0;top:0;--gx:1;--gy:1}
.cl-gather i:nth-child(2){right:0;top:0;--gx:-1;--gy:1}
.cl-gather i:nth-child(3){left:0;bottom:0;--gx:1;--gy:-1}
.cl-gather i:nth-child(4){right:0;bottom:0;--gx:-1;--gy:-1}`,
  tree: () => [h('span', { class: 'cl-l' }, h('i', {}), h('i', {}), h('i', {}), h('i', {}))],
};

export const slide: Def = {
  name: 'slide',
  component: 'Slide',
  duration: 2400,
  defaults: {},
  choices: {},
  // three dots in four corners: one at a time slides into the empty corner, so
  // each dot steps clockwise once every quarter of a cycle
  css: `@keyframes cl-slide{0%,100%{translate:81.25% -81.25%}8.333%,25%{translate:81.25% 81.25%}33.333%,50%{translate:-81.25% 81.25%}58.333%,75%{translate:-81.25% -81.25%}83.333%{translate:81.25% -81.25%}}
.cl-slide i{position:absolute;left:33.333%;top:33.333%;width:33.333%;height:33.333%;border-radius:50%;background:currentColor;animation:cl-slide var(--cl-d) ease-in-out infinite}
.cl-slide i:nth-child(2){animation-delay:${lag(2 / 3)}}
.cl-slide i:nth-child(3){animation-delay:${lag(1 / 3)}}
${still(".cl-slide i:nth-child(1){translate:81.25% -81.25%}.cl-slide i:nth-child(2){translate:-81.25% -81.25%}.cl-slide i:nth-child(3){translate:-81.25% 81.25%}")}`,
  tree: () => [h('i', {}), h('i', {}), h('i', {})],
};

export const leap: Def = {
  name: 'leap',
  component: 'Leap',
  duration: 1800,
  defaults: {},
  choices: {},
  // every third of a cycle the first dot swings over the others to the front,
  // turning half a circle around the middle, while the other two step back
  css: `@keyframes cl-leap{0%{transform:rotate(0) translateX(-176.19%)}33.333%{transform:rotate(180deg) translateX(-176.19%)}66.667%{transform:rotate(180deg) translateX(0)}100%{transform:rotate(180deg) translateX(176.19%)}}
.cl-leap i{position:absolute;left:39.063%;top:39.063%;width:21.875%;height:21.875%;border-radius:50%;background:currentColor;animation:cl-leap var(--cl-d) ease-in-out infinite}
.cl-leap i:nth-child(2){animation-delay:${lag(2 / 3)}}
.cl-leap i:nth-child(3){animation-delay:${lag(1 / 3)}}
${still(".cl-leap i:nth-child(1){transform:translateX(-176.19%)}.cl-leap i:nth-child(3){transform:translateX(176.19%)}")}`,
  tree: () => [h('i', {}), h('i', {}), h('i', {})],
};
