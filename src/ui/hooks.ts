// The site's state: the theme, short notices, copying, and the visitor's
// preference for less motion.

import { useCallback, useSyncExternalStore } from 'react';
import { resolved, setTheme, watchSystem } from '../app/theme';

// ---------------------------------------------------------------- theme

const themeListeners = new Set<() => void>();
const themeStore = {
  subscribe(f: () => void) {
    themeListeners.add(f);
    return () => void themeListeners.delete(f);
  },
  get: () => resolved(),
  emit: () => themeListeners.forEach((f) => f()),
};
watchSystem(themeStore.emit);

export function useTheme() {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.get);
  const toggle = useCallback(() => {
    setTheme(resolved() === 'light' ? 'dark' : 'light');
    themeStore.emit();
  }, []);
  return { theme, toggle };
}

// ---------------------------------------------------------------- notices

export interface Notice {
  id: number;
  text: string;
}

let notice: Notice | null = null;
let noticeId = 0;
let noticeTimer = 0;
const noticeListeners = new Set<() => void>();

/** a short notice at the bottom of the page ("Arc copied") */
export function toast(text: string) {
  notice = { id: ++noticeId, text };
  noticeListeners.forEach((f) => f());
  clearTimeout(noticeTimer);
  noticeTimer = window.setTimeout(() => {
    notice = null;
    noticeListeners.forEach((f) => f());
  }, 2200);
}

export function useNotice() {
  return useSyncExternalStore(
    (f) => {
      noticeListeners.add(f);
      return () => void noticeListeners.delete(f);
    },
    () => notice,
  );
}

/** copy text, then say so (or say how to do it by hand) */
export async function copy(text: string, done: string, failed: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast(done);
    return true;
  } catch {
    toast(failed);
    return false;
  }
}

// ---------------------------------------------------------------- motion

const motion = matchMedia('(prefers-reduced-motion: reduce)');

export function useReducedMotion() {
  return useSyncExternalStore(
    (f) => {
      motion.addEventListener('change', f);
      return () => motion.removeEventListener('change', f);
    },
    () => motion.matches,
  );
}
