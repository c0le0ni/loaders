// The "loaders" wordmark: single-stroke letters with round ends, the same stroke
// the loaders are drawn with. The o is a ring, and the lime square of the Coleoni
// symbol travels around it, the way a loader does. Used in the top bar (where the
// square moves), and exported as static SVG files for coleoni.com, the README,
// the favicon and the share images.

/** stroke width, in wordmark units (the x-height is 12) */
export const S = 2.5;
/** the baseline, the top of the x-height and the top of the ascenders */
const BASE = 20, XTOP = 8, ATOP = 2;
/** the bowls (o, a, d, e): a circle on the stroke's center line */
const R = (BASE - XTOP - S) / 2;
const MID = XTOP + S / 2 + R;
/** the space between two letters' outer edges */
const GAP = 1.75;
/** where a round end sits so its outside touches a line */
const END_TOP = ATOP + S / 2, END_X = XTOP + S / 2, END_BASE = BASE - S / 2;

const f = (n: number) => +n.toFixed(3);

interface Glyph {
  /** outer width */
  w: number;
  /** the strokes, with the letter's left outer edge at x */
  d: (x: number) => string;
}

const bowl = (cx: number) => `M${f(cx + R)} ${f(MID)}A${R} ${R} 0 1 0 ${f(cx - R)} ${f(MID)}A${R} ${R} 0 1 0 ${f(cx + R)} ${f(MID)}`;

const GLYPHS: Record<string, Glyph> = {
  l: { w: S, d: (x) => `M${f(x + S / 2)} ${f(END_TOP)}V${f(END_BASE)}` },
  // the o is drawn apart (ring and square), so its strokes are empty here
  o: { w: 2 * R + S, d: () => '' },
  a: { w: 2 * R + S, d: (x) => `${bowl(x + S / 2 + R)}M${f(x + S / 2 + 2 * R)} ${f(END_X)}V${f(END_BASE)}` },
  d: { w: 2 * R + S, d: (x) => `${bowl(x + S / 2 + R)}M${f(x + S / 2 + 2 * R)} ${f(END_TOP)}V${f(END_BASE)}` },
  e: {
    w: 2 * R + S,
    d: (x) => {
      const cx = x + S / 2 + R, a = (40 * Math.PI) / 180;
      return `M${f(cx - R)} ${f(MID)}H${f(cx + R)}A${R} ${R} 0 1 0 ${f(cx + R * Math.cos(a))} ${f(MID + R * Math.sin(a))}`;
    },
  },
  r: {
    w: S + R,
    d: (x) => {
      const sx = x + S / 2;
      return `M${f(sx)} ${f(END_X)}V${f(END_BASE)}M${f(sx)} ${f(MID)}A${R} ${R} 0 0 1 ${f(sx + R)} ${f(END_X)}`;
    },
  },
  s: {
    w: R + S,
    d: (x) => {
      const r = R / 2, cx = x + S / 2 + r, top = XTOP + S / 2 + r, low = top + 2 * r;
      const c = Math.cos(Math.PI / 6) * r, s = Math.sin(Math.PI / 6) * r;
      return `M${f(cx + c)} ${f(top - s)}A${r} ${r} 0 1 0 ${f(cx)} ${f(top + r)}A${r} ${r} 0 1 1 ${f(cx - c)} ${f(low + s)}`;
    },
  },
};

/** the letters laid out, and where the o sits */
function layout(word = 'loaders') {
  let x = 0;
  let d = '';
  let o = { cx: 0, cy: MID };
  for (const ch of word) {
    const g = GLYPHS[ch];
    if (ch === 'o') o = { cx: x + g.w / 2, cy: MID };
    d += g.d(x);
    x += g.w + GAP;
  }
  return { d, o, width: x - GAP };
}

export const WORDMARK = layout();
/** the wordmark's box: from the ascenders' top to the baseline */
export const VIEW = { x: 0, y: ATOP, w: WORDMARK.width, h: BASE - ATOP };

/** the square that travels around the o: its side, and where it rests (45 degrees, top right) */
export const BEAD = { side: 3.75, r: 0.9, rest: 45 };

export const LIME = '#aefa0e';

/** the o: its ring and its square, at `deg` degrees clockwise from 12 o'clock */
export function oMarkup(o: { cx: number; cy: number }, opts: { ink: string; accent: string; deg?: number; live?: boolean }) {
  const deg = opts.deg ?? BEAD.rest;
  const half = BEAD.side / 2;
  const ring = `<circle cx="${f(o.cx)}" cy="${f(o.cy)}" r="${R}" fill="none" stroke="${opts.ink}" stroke-width="${S}"/>`;
  // the square stays upright while it goes around: turn the group, turn the square back
  const bead = `<g${opts.live ? ' data-bead' : ''} transform="rotate(${deg} ${f(o.cx)} ${f(o.cy)})"><rect${opts.live ? ' data-square' : ''} x="${f(o.cx - half)}" y="${f(o.cy - R - half)}" width="${BEAD.side}" height="${BEAD.side}" rx="${BEAD.r}" fill="${opts.accent}" transform="rotate(${-deg} ${f(o.cx)} ${f(o.cy - R)})"/></g>`;
  return ring + bead;
}

/** a static wordmark SVG */
export function wordmarkSvg(opt: { ink?: string; accent?: string; height?: number; live?: boolean; label?: string } = {}): string {
  const ink = opt.ink ?? '#f5f5f5', accent = opt.accent ?? LIME, h = opt.height ?? 24;
  const pad = 0.6;
  const vb = [VIEW.x - pad, VIEW.y - pad, VIEW.w + 2 * pad, VIEW.h + 2 * pad].map(f).join(' ');
  const w = Math.round((h * (VIEW.w + 2 * pad)) / (VIEW.h + 2 * pad));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${w}" height="${h}" role="img" aria-label="${opt.label ?? 'loaders'}"><path d="${WORDMARK.d}" fill="none" stroke="${ink}" stroke-width="${S}" stroke-linecap="round" stroke-linejoin="round"/>${oMarkup(WORDMARK.o, { ink, accent, live: opt.live })}</svg>`;
}

/** the o alone, in a square box (favicon, avatar) */
export function markSvg(opt: { ink?: string; accent?: string; size?: number } = {}): string {
  const side = 2 * R + S + 2.6;
  const o = { cx: side / 2, cy: side / 2 };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${f(side)} ${f(side)}" width="${opt.size ?? 512}" height="${opt.size ?? 512}">${oMarkup(o, { ink: opt.ink ?? '#f5f5f5', accent: opt.accent ?? LIME })}</svg>`;
}

/** bring a live wordmark (rendered with live: true) to life: the square goes around the o */
export function animateWordmark(host: Element, period = 1600) {
  const bead = host.querySelector<SVGGElement>('[data-bead]');
  const square = host.querySelector<SVGRectElement>('[data-square]');
  if (!bead || !square) return () => {};
  const { cx, cy } = WORDMARK.o;
  return (now: number) => {
    const deg = BEAD.rest + ((now % period) / period) * 360;
    bead.setAttribute('transform', `rotate(${f(deg)} ${f(cx)} ${f(cy)})`);
    square.setAttribute('transform', `rotate(${f(-deg)} ${f(cx)} ${f(cy - R)})`);
  };
}
