// ============================================================
// FILE: store/authStore.js
// PURPOSE: Global auth state using Zustand — user session,
//          Google sign in and sign out
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: Single source of truth for auth state across
//               the entire tool. Any component can read the
//               user object or call signInWithGoogle without
//               prop drilling.
// DEPENDENCIES: lib/supabase.js, zustand
// ⚠️ DO NOT CHANGE: storageKey in supabase.js must match —
//                   both set to forgeyours-auth so all tools
//                   share one login session across subdomains
//                   never duplicate auth logic in components —
//                   always import from this store
// ============================================================

import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { logEvent, EVENTS } from '@/lib/analytics';

export const useAuthStore = create((set) => ({

  // ─── STATE ─────────────────────────────────────────────────
  user: null,
  loading: true,

  // ─── INITIALISE ────────────────────────────────────────────
  // Call this once in AuthProvider on mount.
  // Reads the existing session and listens for auth changes.

  init: async () => {
    // Get current session on load
    const { data: { session } } = await supabase.auth.getSession();
    set({ user: session?.user ?? null, loading: false });

    // Listen for sign in / sign out events
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null });
    });
  },

  // ─── SIGN IN ───────────────────────────────────────────────
  // Opens Google OAuth popup.
  // Requests Drive scope so driveConnector.js can access files.

  signInWithGoogle: async () => {
    await logEvent(EVENTS.SIGN_IN, { tool: 'auth' });

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // [11 Jun 2026] Drive scope required for file sync
        // REASON: Without this scope Google Drive API calls
        // return 403. User sees a consent screen explaining
        // exactly what access is being requested.
        scopes: 'https://www.googleapis.com/auth/drive.file',

        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  },

  // ─── SIGN OUT ──────────────────────────────────────────────

  signOut: async () => {
    await logEvent(EVENTS.SIGN_OUT, { tool: 'auth' });
    await supabase.auth.signOut();
    set({ user: null });
  },

}));

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: Zustand auth store — same pattern as community site
//         adapted for ForgeYours with Drive scope added
//         and analytics events on sign in and sign out
// --- END CHANGE LOG ---
