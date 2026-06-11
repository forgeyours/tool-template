
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


Step 4 — Update the metadata

In app/layout.js replace:

	•	Tool Name with your tool name
	•	description with one sentence about your tool

In public/manifest.json replace:

	•	Tool Name with your tool name
	•	description with one sentence about your tool

Step 5 — Set environment variables

Create a .env.local file in the root with:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key


Get these from the ForgeYours Supabase project.
Ask the maintainer for access — open an Issue in
forgeyours/platform tagged supabase access.

Step 6 — Deploy to Vercel

Connect your fork to Vercel.
Add the environment variables in the Vercel dashboard.
Deploy.

Step 7 — Open a Pull Request

When your tool works and you are happy with it:
Open a PR to forgeyours/platform to add it to the directory.
See CONTRIBUTING.md for exactly what to include.

File logging standard

Every file must start with this header block.
Do not skip this. It protects your work from being
overwritten by future contributors or AI assistants.

// ============================================================
// FILE: FileName.jsx
// PURPOSE: One sentence — what this file does
// LAST CHANGED: DD Mon YYYY
// WHY IT EXISTS: Why this file needs to exist
// DEPENDENCIES: What it imports or relies on
// ⚠️ DO NOT CHANGE: Anything future contributors must not touch
// ============================================================


Design tokens

Use these CSS variables and Tailwind classes everywhere.
Never use raw hex values in your tool components.



|Token                  |Value  |Use for                      |
|-----------------------|-------|-----------------------------|
|`var(--accent-primary)`|#E85D00|Primary actions, brand colour|
|`var(--accent-hover)`  |#C44F00|Hover states on primary      |
|`var(--accent-light)`  |#FFF0E6|Active backgrounds           |
|`var(--bg-primary)`    |#FFFFFF|Page background              |
|`var(--bg-secondary)`  |#F7F8FA|Panel backgrounds            |
|`var(--bg-tertiary)`   |#EFF1F3|Borders, dividers            |
|`var(--text-primary)`  |#1A1D23|Main text                    |
|`var(--text-secondary)`|#5B6474|Secondary text               |
|`var(--text-muted)`    |#9AA0AE|Placeholder, hints           |
|`var(--success)`       |#2E7D32|Success states               |
|`var(--danger)`        |#C62828|Error states                 |

Supabase tables used by the template

The analytics system writes to one table.
This table must exist in the ForgeYours Supabase project.

create table server_events (
  id uuid default gen_random_uuid() primary key,
  event_type text not null,
  tool text not null,
  hour text not null,
  metadata jsonb,
  created_at timestamptz default now()
);


If you add tool-specific tables — name them with your
tool prefix to avoid conflicts:

	•	write_documents
	•	sheet_files
	•	image_projects

Stack reference



|Technology     |Version|Purpose                         |
|---------------|-------|--------------------------------|
|Next.js        |14.2.29|Framework — do not upgrade to 15|
|React          |18     |UI                              |
|Tailwind CSS   |3      |Styling                         |
|Supabase       |2      |Auth and database               |
|Zustand        |4      |State management                |
|idb            |8      |IndexedDB for local storage     |
|lucide-react   |0.303  |Icons                           |
|react-hot-toast|2      |Notifications                   |
|next-pwa       |—      |PWA and offline support         |

Questions

Open an Issue in forgeyours/platform tagged question.
All project discussion is public and on GitHub.

ForgeYours — forgeyours.space — MIT License
github.com/forgeyours


