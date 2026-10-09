// A single shape that turns, flips and changes form.

import { h, still, type Def } from '../core';

/** the rounded square both shapes start from: 15.25 units, corners of 2 */
const SQUARE = `position:absolute;left:18.229%;top:18.229%;width:63.542%;height:63.542%;border-radius:13.115%;background:currentColor`;

export const morph: Def = {
  name: 'morph',
  component: 'Morph',
  duration: 1200,
  defaults: {},
  choices: {},
  // a quarter turn per cycle, rounding into a circle halfway
  css: `@keyframes cl-morph{0%{transform:rotate(0);border-radius:13.115%}50%{transform:rotate(45deg);border-radius:50%}100%{transform:rotate(90deg);border-radius:13.115%}}
.cl-morph i{${SQUARE};animation:cl-morph var(--cl-d) ease-in-out infinite}`,
  tree: () => [h('i', {})],
};

export const eclipse: Def = {
  name: 'eclipse',
  component: 'Eclipse',
  duration: 1200,
  defaults: {},
  choices: {},
  // two dots across the width, swapping sides each half cycle: the one coming
  // forward grows and brightens and passes in front, the other recedes behind it
  css: `@keyframes cl-eclipse{0%{translate:75.789% 0;scale:1;opacity:.75;z-index:1}25%{scale:1.3;opacity:1}49.99%{z-index:1}50%{translate:-75.789% 0;scale:1;opacity:.75;z-index:0}75%{scale:.7;opacity:.5}99.99%{z-index:0}100%{translate:75.789% 0;scale:1;opacity:.75;z-index:1}}
.cl-eclipse i{position:absolute;left:30.208%;top:30.208%;width:39.583%;height:39.583%;border-radius:50%;background:currentColor;animation:cl-eclipse var(--cl-d) ease-in-out infinite}
.cl-eclipse i+i{animation-delay:calc(var(--cl-d) * -0.5)}
${still(".cl-eclipse i{translate:75.789% 0}.cl-eclipse i+i{translate:-75.789% 0}")}`,
  tree: () => [h('i', {}), h('i', {})],
};

export const flip: Def = {
  name: 'flip',
  component: 'Flip',
  duration: 1200,
  defaults: {},
  choices: {},
  // half a turn over the horizontal axis, then half a turn over the vertical one;
  // the eye sits a little below the square, so edge-on it still shows a sliver
  css: `@keyframes cl-flip{0%{transform:rotateX(0) rotateY(0)}50%{transform:rotateX(-180deg) rotateY(0)}100%{transform:rotateX(-180deg) rotateY(-180deg)}}
.cl-flip{perspective:calc(var(--cl-size) * 2.7);perspective-origin:50% 58.875%}
.cl-flip i{${SQUARE};animation:cl-flip var(--cl-d) ease-in-out infinite}`,
  tree: () => [h('i', {})],
};
