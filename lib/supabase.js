// ============================================================
// FILE: lib/supabase.js
// PURPOSE: Supabase client for browser-side auth and database
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: Single shared Supabase client instance for
//               the entire tool — auth, server_events logging,
//               any tool-specific database tables
// DEPENDENCIES: @supabase/supabase-js, environment variables
// ⚠ DO NOT CHANGE: singleton pattern — one client only
//                   never import createClient anywhere else
//                   always import { supabase } from this file
//                   environment variables must be set in Vercel
//                   and in .env.local for local dev
// ============================================================

import { createClient } from '@supabase/supabase-js';

// These environment variables must exist in Vercel dashboard
// and in .env.local during development
// NEXT_PUBLIC prefix makes them available in the browser
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables.\n' +
    'Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY\n' +
    'to your .env.local file and Vercel dashboard.'
  );
}

// Singleton — created once, reused everywhere
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // [11 Jun 2026] persistSession true — keeps user logged in
    // across browser sessions without re-authentication
    persistSession: true,
    autoRefreshToken: true,
    // Storage key scoped to forgeyours so multiple tools
    // on different subdomains share the same auth session
    storageKey: 'forgeyours-auth',
  },
});

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: Centralised Supabase client with shared auth storage
//         key so user stays logged in across all FY tools
// --- END CHANGE LOG ---
