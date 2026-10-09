// Loaders that spread out from the center.

import { h, lag, still, type Def, type Direction } from '../core';

export const pulse: Def = {
  name: 'pulse',
  component: 'Pulse',
  duration: 1200,
  defaults: {},
  choices: {},
  css: `@keyframes cl-pulse{from{transform:scale(.25);opacity:.4}to{transform:scale(1);opacity:0}}
.cl-pulse i{position:absolute;border-radius:50%;background:currentColor}
.cl-pulse i:first-child{inset:0;animation:cl-pulse var(--cl-d) ease-out infinite}
.cl-pulse i:last-child{inset:37.5%}
${still(".cl-pulse i:first-child{opacity:.2}")}`,
  tree: () => [h('i', {}), h('i', {})],
};

export const ripple: Def<'direction'> = {
  name: 'ripple',
  component: 'Ripple',
  duration: 1200,
  defaults: { direction: 'out' },
  choices: { direction: ['out', 'in'] satisfies Direction[] },
  css: `@keyframes cl-ripple{from{transform:scale(0);opacity:1}to{transform:scale(1);opacity:0}}
.cl-ripple i{position:absolute;inset:0;border-radius:50%;border:calc(var(--cl-size) * .072917) solid;animation:cl-ripple var(--cl-d) ease-out infinite}
.cl-ripple[data-direction=in] i{animation-direction:reverse}
.cl-ripple i:nth-child(2){animation-delay:${lag(2 / 3)}}
.cl-ripple i:nth-child(3){animation-delay:${lag(1 / 3)}}
${still(".cl-ripple i{opacity:.4}.cl-ripple i:nth-child(1){transform:scale(.3333)}.cl-ripple i:nth-child(2){transform:scale(.6667)}")}`,
  tree: () => [h('i', {}), h('i', {}), h('i', {})],
};
