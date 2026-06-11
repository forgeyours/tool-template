// ============================================================
// FILE: components/AuthProvider.jsx
// PURPOSE: Initialises auth state on app mount
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: Zustand store needs to be initialised once
//               when the app loads — this component does that.
//               Wraps the entire app in layout.js so auth state
//               is available everywhere immediately.
// DEPENDENCIES: store/authStore.js
// ⚠️ DO NOT CHANGE: must stay as a client component
//                   must call init() in useEffect on mount only
//                   never move auth init logic into pages —
//                   always lives here and only here
// ============================================================

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function AuthProvider({ children }) {
  const init = useAuthStore((state) => state.init);

  useEffect(() => {
    init();
  }, []);

  return children;
}

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: Thin wrapper that boots auth — same pattern as
//         community site, no changes needed
// --- END CHANGE LOG ---
