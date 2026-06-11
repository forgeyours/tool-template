// ============================================================
// FILE: app/auth/callback/route.js
// PURPOSE: Google OAuth callback handler
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: After Google login, Supabase redirects here.
//               This route exchanges the auth code for a session
//               then redirects the user back to the tool.
// DEPENDENCIES: lib/supabase.js, next/server
// ⚠️ DO NOT CHANGE: this must be a server route — never convert
//                   to a client page or auth will break
//                   never change the redirect path after exchange
//                   this pattern is proven across all Real Medico
//                   properties — do not touch it
// ============================================================

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    // Exchange the auth code for a session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect back to the tool root after login
  return NextResponse.redirect(requestUrl.origin);
}

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: Required OAuth callback — same proven pattern
//         used across all ForgeYours and Real Medico properties
// --- END CHANGE LOG ---
