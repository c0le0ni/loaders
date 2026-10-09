// Where things live, and the code the site hands out for a loader.

import { markup, styles } from '@coleoni/loaders/html';
import { loaders } from '@coleoni/loaders';
import type { AnyDef, Options } from '../packages/loaders/src/core';

export const SITE = 'https://loaders.coleoni.com';
export const REPO = 'https://github.com/c0le0ni/loaders';
export const NPM = 'https://www.npmjs.com/package/@coleoni/loaders';
export const COLEONI = 'https://coleoni.com';
export const SKILLS = 'https://skills.coleoni.com';
export const BLOB = 'https://blob.coleoni.com';
export const INSTALL = 'npm i @coleoni/loaders';

export const SIZES = [24, 48, 96] as const;
export type Size = (typeof SIZES)[number];

/** what can be set on a loader on this site */
export interface Settings {
  size: Size;
  duration: number;
  opacity: number;
  extras: Record<string, string>;
}

export const byName = (name: string) => loaders.find((d) => d.name === name) ?? loaders[0];

export const defaults = (def: AnyDef): Settings => ({ size: 48, duration: def.duration, opacity: 100, extras: { ...(def.defaults as Record<string, string>) } });

/** the props that differ from the loader's own defaults */
function changed(def: AnyDef, s: Settings, color: string) {
  const out: [string, string | number][] = [['size', s.size]];
  if (color) out.push(['color', color]);
  if (s.duration !== def.duration) out.push(['duration', s.duration]);
  for (const [k, v] of Object.entries(s.extras)) if ((def.defaults as Record<string, string>)[k] !== v) out.push([k, v]);
  return out;
}

export function reactCode(def: AnyDef, s: Settings, color: string): string {
  const props = changed(def, s, color).map(([k, v]) => (typeof v === 'number' ? `${k}={${v}}` : `${k}="${v}"`));
  if (s.opacity < 100) props.push(`style={{ opacity: ${s.opacity / 100} }}`);
  return `import { ${def.component} } from "@coleoni/loaders";\n\n<${def.component} ${props.join(' ')} />`;
}

export function htmlCode(def: AnyDef, s: Settings, color: string): string {
  const o: Options = { size: s.size, ...(color ? { color } : {}), ...(s.duration !== def.duration ? { duration: s.duration } : {}), ...s.extras };
  let html = markup(def, o);
  if (s.opacity < 100) html = html.replace(' style="', ` style="opacity:${s.opacity / 100};`);
  return `${html}\n<style>\n${styles(def)}\n</style>`;
}
