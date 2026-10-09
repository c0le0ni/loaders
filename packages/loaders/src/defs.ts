// Every loader definition, without React: shared by the components and the HTML entry.

import { arc, atom, cascade, clock, comet, dual, orbit, ring, snake, trace } from './loaders/spinners';
import { circularDots, classic, classicV2, linearDots, swirl } from './loaders/rings';
import { blocks, bouncingDots, gather, leap, slide, wave } from './loaders/grids';
import { pulse, ripple } from './loaders/pulses';
import { eclipse, flip, morph } from './loaders/shapes';
import { coleoni } from './loaders/coleoni';
import type { AnyDef } from './core';

/** every loader, in alphabetical order */
export const loaders: AnyDef[] = [
  arc,
  atom,
  blocks,
  bouncingDots,
  cascade,
  circularDots,
  classic,
  classicV2,
  clock,
  coleoni,
  comet,
  dual,
  eclipse,
  flip,
  gather,
  leap,
  linearDots,
  morph,
  orbit,
  pulse,
  ring,
  ripple,
  slide,
  snake,
  swirl,
  trace,
  wave,
];

export { arc, atom, blocks, bouncingDots, cascade, circularDots, classic, classicV2, clock, coleoni, comet, dual, eclipse, flip, gather, leap, linearDots, morph, orbit, pulse, ring, ripple, slide, snake, swirl, trace, wave };
