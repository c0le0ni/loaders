import { BASE_CSS, resolveExtras, rootAttrs, type AnyDef, type Node, type Options } from './core';
import { loaders } from './defs';

const esc = (v: string | number) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function toHtml(n: Node, depth: number): string {
  const pad = '  '.repeat(depth);
  const attrs = Object.entries(n.attrs)
    .map(([k, v]) => ` ${k}="${esc(v)}"`)
    .join('');
  if (!n.children.length) return `${pad}<${n.tag}${attrs}></${n.tag}>`;
  return `${pad}<${n.tag}${attrs}>\n${n.children.map((c) => toHtml(c, depth + 1)).join('\n')}\n${pad}</${n.tag}>`;
}

/** the markup of one loader, as the React component would render it */
export function markup(def: AnyDef, o: Options = {}): string {
  const root = rootAttrs(def, o);
  const style = Object.entries(root.style)
    .map(([k, v]) => `${k}:${v}`)
    .join(';');
  const data = Object.entries(root.extras)
    .map(([k, v]) => ` ${k}="${esc(v)}"`)
    .join('');
  const state = root.state ? ` data-state="${root.state}"` : '';
  const inner = def.tree(resolveExtras(def, o)).map((c) => toHtml(c, 1));
  return `<span class="${root.className}" role="status" aria-label="Loading"${data}${state} style="${esc(style)}">\n${inner.join('\n')}\n</span>`;
}

/** the CSS one loader needs: the shared rules and its own */
export const styles = (def: AnyDef) => `${BASE_CSS}\n${def.css}`;

/** a self-contained snippet: the markup and its <style>, ready to paste anywhere */
export const snippet = (def: AnyDef, o: Options = {}) => `${markup(def, o)}\n<style>\n${styles(def)}\n</style>`;

const find = (name: string) => {
  const def = loaders.find((d) => d.name === name);
  if (!def) throw new Error(`@coleoni/loaders: there is no loader named "${name}" (the names: ${loaders.map((d) => d.name).join(', ')})`);
  return def;
};

/** a loader's markup by name, for pages without React: html('arc', { size: 24 }) */
export const html = (name: string, o: Options = {}) => markup(find(name), o);

/** the CSS a loader needs, by name: add it once to the page */
export const css = (name: string) => styles(find(name));
