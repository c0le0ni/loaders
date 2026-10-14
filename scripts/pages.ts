// The pages around the app. Before the build: index.html (English), pt/index.html
// (Portuguese), the 404 page and the logo as files; these are committed, so the
// dev server works right after a clone. After the build (--loaders): one page per
// loader in each language, with its own title and description, and the sitemap.
//   npm run pages            the shells and the logo files
//   vite-node scripts/pages.ts -- --loaders   the loader pages, into dist/

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loaders } from '../packages/loaders/src/defs';
import { STRINGS, NAMES, type Strings } from '../src/i18n/strings';
import { markSvg, wordmarkSvg } from '../src/brand';
import { SITE } from '../src/site';

const HOME_LOADER = 'coleoni';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface Head {
  path: string;
  enPath: string;
  ptPath: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
}

/** the page shell: its head for search and sharing, and where React mounts */
function page(S: Strings, h: Head): string {
  const url = `${SITE}${h.path}`;
  return `<!doctype html>
<html lang="${S.htmlLang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <script src="/lang.js"></script>
    <script src="/theme-init.js"></script>
    <title>${esc(h.title)}</title>
    <meta name="description" content="${esc(h.description)}" />
    <meta name="theme-color" content="#1b1c1e" media="(prefers-color-scheme: dark)" />
    <meta name="theme-color" content="#f3f4f5" media="(prefers-color-scheme: light)" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="en" href="${SITE}${h.enPath}" />
    <link rel="alternate" hreflang="pt-BR" href="${SITE}${h.ptPath}" />
    <link rel="alternate" hreflang="x-default" href="${SITE}${h.enPath}" />
    <meta property="og:locale" content="${S.ogLocale}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Loaders" />
    <meta property="og:title" content="${esc(h.ogTitle)}" />
    <meta property="og:description" content="${esc(h.ogDescription)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${SITE}/og/${S.lang}.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(S.ogAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <link rel="preload" href="/fonts/geist-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin />
    <script type="module" src="/src/main.tsx"></script>
    <!-- Contador de visitas, sem cookie (docs/28 do coleoni_digital). -->
    <script defer src="https://visitas.coleoni.com/v.js" data-website-id="c191325f-6280-4916-afde-0da42ff7acbd" data-domains="loaders.coleoni.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <noscript><p style="padding: 24px; text-align: center">${esc(S.noscript)}</p></noscript>
  </body>
</html>
`;
}

const homeHead = (S: Strings): Head => ({ path: S.path, enPath: '/', ptPath: '/pt/', title: S.title, description: S.description, ogTitle: S.ogTitle, ogDescription: S.ogDescription });

const loaderHead = (S: Strings, name: string): Head => {
  const about = S.about[name].charAt(0).toUpperCase() + S.about[name].slice(1);
  return {
    path: `${S.path}${name}/`,
    enPath: `/${name}/`,
    ptPath: `/pt/${name}/`,
    title: S.loaderTitle(NAMES[name]),
    description: S.loaderDescription(NAMES[name], about),
    ogTitle: `${NAMES[name]} · Loaders`,
    ogDescription: about,
  };
};

/** one page for both languages: nginx serves it for any missing path */
function notFound() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Not found · Loaders</title>
    <meta name="robots" content="noindex" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <style>
      @font-face { font-family: 'Geist'; src: url('/fonts/geist-latin-wght-normal.woff2') format('woff2'); font-weight: 100 900; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #0a0a0a; color: #f5f5f5; font: 400 1rem/1.5 'Geist', system-ui, sans-serif; text-align: center; padding: 24px; box-sizing: border-box; }
      main { display: grid; gap: 18px; justify-items: center; }
      h1 { margin: 8px 0 0; font-size: 2rem; letter-spacing: -0.03em; font-weight: 600; }
      p { margin: 0; color: #a0a0a0; }
      nav { display: flex; gap: 10px; margin-top: 8px; }
      a { color: #0a0a0a; background: #aefa0e; text-decoration: none; font-weight: 600; padding: 10px 16px; border-radius: 8px; }
      a + a { color: #f5f5f5; background: #151515; border: 1px solid rgba(255, 255, 255, 0.16); }
    </style>
  </head>
  <body>
    <main>
      ${wordmarkSvg({ height: 44 })}
      <h1>This page does not exist.</h1>
      <p lang="pt-BR">Esta página não existe.</p>
      <nav><a href="/">See the loaders</a><a href="/pt/" lang="pt-BR">Ver os loaders</a></nav>
    </main>
  </body>
</html>
`;
}

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const write = (file: string, text: string) => {
  const path = resolve(root, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text);
};

if (process.argv.includes('--loaders')) {
  // the built shells, with their head swapped for each loader's
  const built = { en: readFileSync(resolve(root, 'dist/index.html'), 'utf8'), pt: readFileSync(resolve(root, 'dist/pt/index.html'), 'utf8') };
  const urls: string[] = ['/', '/pt/'];
  for (const S of [STRINGS.en, STRINGS.pt]) {
    const shell = built[S.lang as 'en' | 'pt'];
    const headOf = (html: string) => html.slice(html.indexOf('<title>'), html.indexOf('<link rel="icon"'));
    const fresh = page(S, homeHead(S));
    for (const d of loaders) {
      if (d.name === HOME_LOADER) continue;
      const own = page(S, loaderHead(S, d.name));
      write(`dist${S.path}${d.name}/index.html`, shell.replace(headOf(shell), headOf(own)));
      urls.push(`${S.path}${d.name}/`);
    }
    // sanity: the built shell carries the same head the generator writes
    if (!shell.includes(headOf(fresh).slice(0, 40))) throw new Error(`dist${S.path}index.html has an unexpected head`);
  }
  write('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${SITE}${u}</loc></url>`).join('\n')}\n</urlset>\n`);
  console.log(`${urls.length - 2} loader pages and the sitemap (${urls.length} addresses)`);
} else {
  const out: [string, string][] = [
    ['index.html', page(STRINGS.en, homeHead(STRINGS.en))],
    ['pt/index.html', page(STRINGS.pt, homeHead(STRINGS.pt))],
    // the logo as files, for coleoni.com, the README and social images
    ['public/brand/loaders.svg', wordmarkSvg({ height: 64 })],
    ['public/brand/loaders-dark.svg', wordmarkSvg({ height: 64, ink: '#161616' })],
    ['public/brand/mark.svg', markSvg()],
    ['public/404.html', notFound()],
  ];
  for (const [file, text] of out) {
    write(file, text);
    console.log(`${file}  ${(text.length / 1024).toFixed(1)} KB`);
  }
}
