'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

/**
 * Client component that triggers rehydration of persisted Zustand store
 * only after the initial render / hydration phase completes.
 * This guarantees zero SSR hydration mismatches across the app.
 */
export function StoreHydration() {
  useEffect(() => {
    useAppStore.persist.rehydrate();
  }, []);

  return null;
}
