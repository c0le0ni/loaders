// @coleoni/loaders: loading indicators for React, by Coleoni.

import { component } from './react';
import { arc, atom, blocks, bouncingDots, cascade, circularDots, classic, classicV2, clock, comet, dual, eclipse, flip, gather, leap, linearDots, morph, orbit, pulse, ring, ripple, slide, snake, swirl, trace, wave } from './defs';

export { loaders } from './defs';

export type { Cap, Direction, Easing, Origin, PlayState, Sweep } from './core';
export type { LoaderProps } from './react';

export const Arc = /*#__PURE__*/ component<'easing' | 'cap'>(arc);
export const Atom = /*#__PURE__*/ component<'easing'>(atom);
export const Blocks = /*#__PURE__*/ component<'sweep'>(blocks);
export const BouncingDots = /*#__PURE__*/ component(bouncingDots);
export const Cascade = /*#__PURE__*/ component<'cap'>(cascade);
export const CircularDots = /*#__PURE__*/ component(circularDots);
export const Classic = /*#__PURE__*/ component(classic);
export const ClassicV2 = /*#__PURE__*/ component(classicV2);
export const Clock = /*#__PURE__*/ component<'easing'>(clock);
export const Comet = /*#__PURE__*/ component<'easing'>(comet);
export const Dual = /*#__PURE__*/ component<'easing' | 'cap'>(dual);
export const Eclipse = /*#__PURE__*/ component(eclipse);
export const Flip = /*#__PURE__*/ component(flip);
export const Gather = /*#__PURE__*/ component(gather);
export const Leap = /*#__PURE__*/ component(leap);
export const LinearDots = /*#__PURE__*/ component(linearDots);
export const Morph = /*#__PURE__*/ component(morph);
export const Orbit = /*#__PURE__*/ component<'easing'>(orbit);
export const Pulse = /*#__PURE__*/ component(pulse);
export const Ring = /*#__PURE__*/ component<'easing' | 'cap'>(ring);
export const Ripple = /*#__PURE__*/ component<'direction'>(ripple);
export const Slide = /*#__PURE__*/ component(slide);
export const Snake = /*#__PURE__*/ component<'easing' | 'cap'>(snake);
export const Swirl = /*#__PURE__*/ component(swirl);
export const Trace = /*#__PURE__*/ component<'easing' | 'cap'>(trace);
export const Wave = /*#__PURE__*/ component<'origin'>(wave);
