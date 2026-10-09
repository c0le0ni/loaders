// @coleoni/loaders: loading indicators for React, by Coleoni.

import { component } from './react';
import { arc, atom, cascade, clock, comet, dual, orbit, ring, snake, trace } from './loaders/spinners';
import { circularDots, classic, classicV2, linearDots, swirl } from './loaders/rings';
import { blocks, bouncingDots, gather, leap, slide, wave } from './loaders/grids';
import { pulse, ripple } from './loaders/pulses';
import { eclipse, flip, morph } from './loaders/shapes';
import type { AnyDef } from './core';

export type { Cap, Direction, Easing, Origin, PlayState, Sweep } from './core';
export type { LoaderProps } from './react';

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

export const Arc = component<'easing' | 'cap'>(arc);
export const Atom = component<'easing'>(atom);
export const Blocks = component<'sweep'>(blocks);
export const BouncingDots = component(bouncingDots);
export const Cascade = component<'cap'>(cascade);
export const CircularDots = component(circularDots);
export const Classic = component(classic);
export const ClassicV2 = component(classicV2);
export const Clock = component<'easing'>(clock);
export const Comet = component<'easing'>(comet);
export const Dual = component<'easing' | 'cap'>(dual);
export const Eclipse = component(eclipse);
export const Flip = component(flip);
export const Gather = component(gather);
export const Leap = component(leap);
export const LinearDots = component(linearDots);
export const Morph = component(morph);
export const Orbit = component<'easing'>(orbit);
export const Pulse = component(pulse);
export const Ring = component<'easing' | 'cap'>(ring);
export const Ripple = component<'direction'>(ripple);
export const Slide = component(slide);
export const Snake = component<'easing' | 'cap'>(snake);
export const Swirl = component(swirl);
export const Trace = component<'easing' | 'cap'>(trace);
export const Wave = component<'origin'>(wave);
