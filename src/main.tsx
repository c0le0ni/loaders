import { loaders } from '@coleoni/loaders';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { STRINGS } from './i18n/strings';
import { App, HOME_LOADER } from './ui/app';
import './styles.css';

const S = document.documentElement.lang.startsWith('pt') ? STRINGS.pt : STRINGS.en;

// the address names the loader: /arc/ or /pt/arc/; the home page opens on ours
const slug = location.pathname.replace(/^\/pt(\/|$)/, '/').split('/').filter(Boolean)[0] ?? '';
const initial = loaders.some((d) => d.name === slug) ? slug : HOME_LOADER;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App S={S} initial={initial} />
  </StrictMode>,
);
