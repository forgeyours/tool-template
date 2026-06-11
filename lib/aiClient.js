// ============================================================
// FILE: lib/aiClient.js
// PURPOSE: Claude API client using the user's own API key
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: ForgeYours does not provide or bill for AI.
//               The user brings their own Anthropic API key.
//               It is stored only in their browser localStorage —
//               never sent to our servers, never logged.
//               This file handles storing the key safely and
//               making API calls directly from the browser.
// DEPENDENCIES: None — direct fetch to Anthropic API
// ⚠️ DO NOT CHANGE: API key storage key name — changing it
//                   means existing users lose their saved key
//                   never send the API key to any ForgeYours
//                   server — browser to Anthropic only
//                   never log or track the API key anywhere
// ============================================================

const API_KEY_STORAGE = 'forgeyours-ai-key';
const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

// ─── API KEY MANAGEMENT ───────────────────────────────────────

// Save the user's API key to localStorage
export function saveApiKey(key) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}

// Retrieve the saved API key
export function getApiKey() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(API_KEY_STORAGE);
}

// Remove the saved API key
export function clearApiKey() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(API_KEY_STORAGE);
}

// Check if a key is saved
export function hasApiKey() {
  return Boolean(getApiKey());
}

// ─── SEND MESSAGE ─────────────────────────────────────────────
// Sends a message to Claude using the user's own API key.
// toolContext tells Claude what tool it is assisting with —
// each tool sets this differently for relevant responses.
//
// Usage:
//   const reply = await sendMessage({
//     messages: [{ role: 'user', content: 'Help me write an intro' }],
//     toolContext: 'The user is writing a document in a text editor.',
//   });

export async function sendMessage({ messages, toolContext }) {
  const apiKey = getApiKey();

  if (!apiKey) {
    throw new Error('NO_API_KEY');
  }

  const response = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      // [11 Jun 2026] Direct browser-to-Anthropic call
      // REASON: No proxy server — user's key never touches
      // ForgeYours infrastructure. Pure client-side only.
      'anthropic-dangerous-allow-browser': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1024,
      system: `You are an AI assistant built into a ForgeYours tool.
ForgeYours is a free, open-source platform of tools for human expression.
Your role: ${toolContext}
Be concise, practical, and helpful.
Never ask for personal information.
Never suggest paid tools or subscriptions.`,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) throw new Error('INVALID_API_KEY');
    if (response.status === 429) throw new Error('RATE_LIMITED');
    throw new Error(error.error?.message ?? 'API_ERROR');
  }

  const data = await response.json();
  return data.content[0]?.text ?? '';
}

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: User-owned API key model — ForgeYours never sees,
//         stores, or proxies the key. Stored in localStorage
//         which is per-domain, per-browser, never transmitted.
//         anthropic-dangerous-allow-browser header required for
//         direct browser calls — acceptable here because the
//         key is the user's own, not a shared server key.
// --- END CHANGE LOG ---
