<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://loaders.coleoni.com/brand/loaders.svg">
    <img src="https://loaders.coleoni.com/brand/loaders-dark.svg" alt="loaders" height="56">
  </picture>
</p>

<p align="center">
  27 loading animations for React and plain HTML. Pick one, set its size, color<br>
  and speed, and copy the code. Free, open source, about 9 KB for all of them.
</p>

<p align="center">
  <a href="https://loaders.coleoni.com"><b>loaders.coleoni.com</b></a> ·
  <a href="https://loaders.coleoni.com/pt/">Português</a> ·
  <a href="https://www.npmjs.com/package/@coleoni/loaders">npm</a> ·
  <a href="https://skills.coleoni.com">Coleoni Skills</a> ·
  <a href="https://blob.coleoni.com">Blob Avatar</a>
</p>

![Loaders](https://loaders.coleoni.com/og/en.jpg)

## Install

```bash
npm i @coleoni/loaders
```

```tsx
import { Arc } from "@coleoni/loaders";

export function Saving() {
  return <Arc size={24} color="#aefa0e" />;
}
```

Every loader is a React component that renders a few elements and its own CSS
(React 19 puts the styles in the `<head>`, once per loader). There is no
JavaScript animation loop: it all runs in CSS. React 19 or later.

## Props

Every loader takes these:

| Prop | Default | |
| --- | --- | --- |
| `size` | `20` | Width and height, in pixels |
| `color` | text color | Any CSS color; by default it takes the color of the text around it |
| `duration` | its own | One cycle, in milliseconds (each loader has a default, listed below) |
| `playState` | `"running"` | `"paused"` holds it still where it is |
| `className`, `style`, any attribute | | Passed to the outer `<span>` |

Some take one or two more:

| Prop | Values | Loaders |
| --- | --- | --- |
| `easing` | `"linear"` (default), `"ease-in-out"`, `"stacked"` | Arc, Atom, Clock, Comet, Dual, Orbit, Ring, Snake, Trace |
| `cap` | `"round"` (default), `"flat"` | Arc, Cascade, Dual, Ring, Snake, Trace |
| `sweep` | `"diagonal"` (default), `"rows"`, `"columns"` | Blocks |
| `direction` | `"out"` (default), `"in"` | Ripple |
| `origin` | `"center"` (default), `"bottom"` | Wave |

`"stacked"` adds a steady turn to an eased one, so the loader speeds up and slows
down without ever stopping.

## The loaders

| Component | Cycle | | Component | Cycle |
| --- | --- | --- | --- | --- |
| `Arc` | 800 ms | | `Gather` | 1600 ms |
| `Atom` | 1000 ms | | `Leap` | 1800 ms |
| `Blocks` | 1300 ms | | `LinearDots` | 900 ms |
| `BouncingDots` | 500 ms | | `Morph` | 1200 ms |
| `Cascade` | 1500 ms | | `Orbit` | 750 ms |
| `CircularDots` | 800 ms | | `Pulse` | 1200 ms |
| `Classic` | 1200 ms | | `Ring` | 800 ms |
| `ClassicV2` | 800 ms | | `Ripple` | 1200 ms |
| `Clock` | 1200 ms | | `Slide` | 2400 ms |
| `Coleoni` | 1000 ms | | `Snake` | 1400 ms |
| `Comet` | 700 ms | | `Swirl` | 1200 ms |
| `Dual` | 1000 ms | | `Trace` | 1200 ms |
| `Eclipse` | 1200 ms | | `Wave` | 900 ms |
| `Flip` | 1200 ms | | | |

See them all, and tune any of them, at [loaders.coleoni.com](https://loaders.coleoni.com).

## Without React

The site copies any loader as HTML with its CSS, ready to paste into any page. The
same markup is in the package, for pages that build HTML themselves:

```js
import { html, css } from "@coleoni/loaders/html";

el.innerHTML = html("ring", { size: 32, color: "#aefa0e" });
document.head.insertAdjacentHTML("beforeend", `<style>${css("ring")}</style>`);
```

## Accessibility

- Each loader tells screen readers it is loading (`role="status"`, labelled
  "Loading"). Next to a text that already says so, hide it with `aria-hidden`.
- To say it in your own words, or in another language, give it a label of your own:
  `<Ring aria-label="Carregando" />` in React, `html("ring", { label: "Carregando" })`
  without it.
- For visitors who ask their system for less motion, every loader stops on a still
  pose of its own.

## How it works

Each loader is one definition: its markup as a small tree and its CSS, scoped to
the loader's own class. The React component and the HTML snippet are both drawn
from it, and a test checks that they always come out the same. Sizes are relative,
so a loader is sharp at any size.

## License

MIT © Coleoni. Source, issues and the site: [github.com/c0le0ni/loaders](https://github.com/c0le0ni/loaders) · [loaders.coleoni.com](https://loaders.coleoni.com).
