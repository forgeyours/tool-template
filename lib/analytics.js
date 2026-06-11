// ============================================================
// FILE: lib/analytics.js
// PURPOSE: Logs every server contact event to Supabase for
//          admin dashboard and cost projection
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: ForgeYours runs locally — server contact is
//               rare and intentional. Every contact is logged
//               so the admin console can calculate true
//               concurrent load, project scaling costs, and
//               estimate how long funds last at current burn.
//               This is how we scale free tiers to large userbases.
// DEPENDENCIES: lib/supabase.js
// ⚠️ DO NOT CHANGE: event_type values — admin console queries
//                   depend on these exact strings
//                   Never log personal content — only event
//                   type, tool name, and timestamp
//                   logEvent must never throw — it fails silently
//                   so tool functionality is never blocked by
//                   an analytics failure
// ============================================================

import { supabase } from '@/lib/supabase';

// ─── EVENT TYPES ─────────────────────────────────────────────
// These are the only valid event_type values.
// Add new ones here if needed — never use freeform strings.

export const EVENTS = {
  // Auth events
  SIGN_IN:        'sign_in',
  SIGN_OUT:       'sign_out',

  // Storage events
  SAVE_LOCAL:     'save_local',
  SAVE_DRIVE:     'save_drive',
  OPEN_LOCAL:     'open_local',
  OPEN_DRIVE:     'open_drive',
  DOWNLOAD:       'download',

  // AI events
  AI_MESSAGE:     'ai_message',

  // Support events
  SUPPORT_OPEN:   'support_open',
  SUPPORT_PAID:   'support_paid',

  // Tool events — generic
  TOOL_LOAD:      'tool_load',
};

// ─── LOG EVENT ───────────────────────────────────────────────
// Call this wherever a server contact happens.
// Fails silently — never blocks the user.
//
// Usage:
//   import { logEvent, EVENTS } from '@/lib/analytics';
//   await logEvent(EVENTS.SAVE_DRIVE, { tool: 'write' });

export async function logEvent(eventType, metadata = {}) {
  try {
    // Never log in development — keeps the table clean
    if (process.env.NODE_ENV === 'development') return;

    await supabase
      .from('server_events')
      .insert({
        event_type: eventType,
        tool: metadata.tool ?? 'unknown',
        // [11 Jun 2026] Storing hour-level timestamp only
        // REASON: We need load patterns not individual tracking
        // Full timestamps would enable user behaviour profiling
        // which violates the ForgeYours privacy principle
        hour: new Date().toISOString().slice(0, 13),
        metadata: {
          // Only safe non-personal metadata
          screen_width: window?.innerWidth ?? null,
          is_pwa: window?.matchMedia('(display-mode: standalone)')
            .matches ?? false,
        },
      });

  } catch {
    // Always fail silently — analytics must never break the tool
  }
}

// ─── BATCH LOG ───────────────────────────────────────────────
// For logging multiple events at once — e.g. on tool load
// logs TOOL_LOAD without hammering the DB on every keystroke

let loadLogged = false;

export async function logToolLoad(toolName) {
  if (loadLogged) return;
  loadLogged = true;
  await logEvent(EVENTS.TOOL_LOAD, { tool: toolName });
}

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: Lightweight analytics that enables admin cost projection
//         without tracking personal data or content
//         Hour-level granularity chosen deliberately —
//         enough for load patterns, not enough for surveillance
// --- END CHANGE LOG ---
