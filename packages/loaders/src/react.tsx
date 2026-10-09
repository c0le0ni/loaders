import { createElement, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { BASE_CSS, resolveExtras, rootAttrs, type AnyDef, type BaseOptions, type ExtraOptions, type Node } from './core';

/** what a loader component takes: its options plus any attribute of a <span> */
export type LoaderProps<E extends keyof ExtraOptions = never> = BaseOptions &
  Pick<ExtraOptions, E> &
  Omit<HTMLAttributes<HTMLSpanElement>, 'color'>;

// markup attributes are written the HTML way; React wants camelCase for SVG ones
const camel = (k: string) => (k === 'class' ? 'className' : k.startsWith('data-') || k.startsWith('aria-') ? k : k.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()));

function toReact(n: Node, key: number): ReactNode {
  const props: Record<string, unknown> = { key };
  for (const [k, v] of Object.entries(n.attrs)) props[camel(k)] = v;
  return createElement(n.tag, props, ...n.children.map(toReact));
}

/** turns a definition into a component */
export function component<E extends keyof ExtraOptions>(def: AnyDef) {
  function Loader(props: LoaderProps<E>) {
    const { size, color, duration, playState, className, style, easing, cap, sweep, direction, origin, ...rest } = props as LoaderProps<keyof ExtraOptions>;
    const o = { size, color, duration, playState, easing, cap, sweep, direction, origin };
    const root = rootAttrs(def, o);
    return (
      <>
        {/* React 19 hoists these to <head> and keeps one copy of each */}
        <style href="cl-base" precedence="default">
          {BASE_CSS}
        </style>
        <style href={`cl-${def.name}`} precedence="default">
          {def.css}
        </style>
        <span
          role="status"
          aria-label="Loading"
          {...root.extras}
          data-state={root.state}
          {...rest}
          className={className ? `${root.className} ${className}` : root.className}
          style={{ ...(root.style as CSSProperties), ...style }}
        >
          {def.tree(resolveExtras(def, o)).map(toReact)}
        </span>
      </>
    );
  }
  Loader.displayName = def.component;
  return Loader;
}
