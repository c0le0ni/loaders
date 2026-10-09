// Our own: the square of the Coleoni symbol going around a faint ring, always
// upright, the way it goes around the o of the "loaders" wordmark.

import { h, still, svg, type Def } from '../core';

export const coleoni: Def = {
  name: 'coleoni',
  component: 'Coleoni',
  duration: 1000,
  defaults: {},
  choices: {},
  // the layer turns one way and the square turns back the other, so it stays upright;
  // held still, it rests at the top right, where it sits in the symbol
  css: `@keyframes cl-coleoni{to{transform:rotate(-360deg)}}
.cl-coleoni .cl-l{animation:cl-spin var(--cl-d) linear infinite}
.cl-coleoni i{position:absolute;left:38.542%;top:0;width:22.917%;height:22.917%;border-radius:25%;background:currentColor;animation:cl-coleoni var(--cl-d) linear infinite}
${still('.cl-coleoni .cl-l{transform:rotate(45deg)}.cl-coleoni i{transform:rotate(-45deg)}')}`,
  tree: () => [svg({}, h('circle', { cx: 12, cy: 12, r: 9.25, stroke: 'currentColor', 'stroke-width': 2.5, opacity: 0.2 })), h('span', { class: 'cl-l' }, h('i', {}))],
};
