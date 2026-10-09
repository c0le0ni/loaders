import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as pkg from '../packages/loaders/src/index';
import { loaders } from '../packages/loaders/src/index';
import { markup, snippet } from '../packages/loaders/src/html';
import { component } from '../packages/loaders/src/react';
import type { AnyDef, Options } from '../packages/loaders/src/core';

/** the root <span> of a loader with sorted attributes, so two renderings compare by content */
function normalize(html: string) {
  const start = html.search(/<span[^>]*class="cl cl-/);
  const root = html.slice(start, html.lastIndexOf('</span>') + 7);
  return root
    .replace(/\s*\n\s*/g, '')
    .replace(/<([a-z]+)((?:\s+[^\s=>]+="[^"]*")*)\s*(\/?)>/g, (_, tag: string, attrs: string, self: string) => {
      const list = (attrs.match(/[^\s=>]+="[^"]*"/g) ?? []).sort();
      return `<${tag}${list.length ? ' ' + list.join(' ') : ''}${self}>`;
    });
}

const react = (def: AnyDef, o: Options = {}) => {
  const Loader = component(def);
  return renderToStaticMarkup(<Loader {...(o as object)} />);
};

describe('the catalog', () => {
  it('has 26 loaders, each with a unique name and an exported component', () => {
    expect(loaders).toHaveLength(26);
    expect(new Set(loaders.map((d) => d.name)).size).toBe(26);
    for (const d of loaders) expect(typeof (pkg as Record<string, unknown>)[d.component]).toBe('function');
  });

  it('gives every option a default among its choices', () => {
    for (const d of loaders) {
      for (const [k, v] of Object.entries(d.defaults)) expect((d.choices as Record<string, readonly string[]>)[k]).toContain(v);
      expect(d.duration).toBeGreaterThan(0);
    }
  });
});

describe('a rendered loader', () => {
  it('announces itself and sizes itself from the props', () => {
    const html = react(loaders[0], { size: 32, color: '#f97316', duration: 1600, playState: 'paused' });
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-label="Loading"');
    expect(html).toContain('--cl-size:32px');
    expect(html).toContain('--cl-d:1600ms');
    expect(html).toContain('color:#f97316');
    expect(html).toContain('data-state="paused"');
  });

  it('uses each loader default when no prop is given', () => {
    for (const d of loaders) {
      const html = react(d);
      expect(html).toContain('--cl-size:20px');
      expect(html).toContain(`--cl-d:${d.duration}ms`);
      for (const [k, v] of Object.entries(d.defaults)) expect(html).toContain(`data-${k}="${v}"`);
    }
  });

  it('lets attributes through, so it can be hidden or relabelled', () => {
    const html = react(loaders[0], { 'aria-hidden': true, className: 'mine' } as Options);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('class="cl cl-arc mine"');
  });
});

describe('the HTML snippet', () => {
  it('is the same markup the component renders, for every loader and option', () => {
    for (const d of loaders) {
      const variants: Options[] = [{}];
      for (const [k, values] of Object.entries(d.choices as Record<string, readonly string[]>)) for (const v of values) variants.push({ [k]: v });
      for (const o of variants) expect(normalize(markup(d, o))).toBe(normalize(react(d, o)));
    }
  });

  it('carries its own CSS, scoped to the loader', () => {
    for (const d of loaders) {
      const s = snippet(d);
      expect(s).toContain('<style>');
      expect(s).toContain(`.cl-${d.name}`);
      // every keyframes name is prefixed, so it cannot collide with the page
      for (const m of d.css.matchAll(/@keyframes ([\w-]+)/g)) expect(m[1].startsWith('cl-')).toBe(true);
    }
  });
});
