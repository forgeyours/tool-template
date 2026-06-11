# ForgeYours Tool Template

The official starter template for building a ForgeYours tool.
Fork this, build your tool, open a Pull Request.

---

## What is already built for you

Every ForgeYours tool needs the same foundation.
This template has it all pre-wired so you build the tool —
not the plumbing.

| What | Where | What it does |
|---|---|---|
| Auth | `store/authStore.js` | Google sign in and sign out |
| OAuth callback | `app/auth/callback/route.js` | Handles Google redirect |
| Local storage | `lib/localStore.js` | Saves files to user's device via IndexedDB |
| Drive sync | `lib/driveConnector.js` | Saves files to user's Google Drive |
| AI assistant | `components/AIPanel.jsx` | Sliding AI panel, user's own API key |
| AI client | `lib/aiClient.js` | Calls Anthropic API from browser |
| Support button | `components/SupportButton.jsx` | Voluntary tip modal |
| Analytics | `lib/analytics.js` | Logs server contacts for cost projection |
| PWA config | `public/manifest.json` | Makes tool installable and offline-capable |
| Layout | `app/layout.js` | Root layout with auth and toast wired in |
| Styles | `app/globals.css` | Toolbar, status bar, AI panel, design tokens |

---

## How to build your tool

### Step 1 — Fork this repo
Fork `forgeyours/tool-template` to your own GitHub account.
Rename your fork to match your tool — e.g. `yourname/fy-sheet`.

### Step 2 — Replace the placeholder UI
Open `app/page.js`.
Everything marked `⚠️ REPLACE` is yours to build.
Keep the toolbar shell, status bar, and AI panel.
Replace the textarea with your actual tool component.

### Step 3 — Set the tool context for AI
In `app/page.js` find the `AIPanel` component.
Set the `toolContext` prop to describe your tool:

```javascript
// Example for a spreadsheet tool
toolContext="This is a spreadsheet editor. The user is working
with rows, columns, and formulas. Help them with calculations,
data organisation, and formula syntax."
