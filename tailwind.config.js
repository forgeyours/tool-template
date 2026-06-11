// ============================================================
// FILE: tailwind.config.js
// PURPOSE: Tailwind CSS configuration with ForgeYours colour tokens
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: Extends Tailwind with ForgeYours design system
//               so all tools share the same visual language
// DEPENDENCIES: postcss.config.js must exist
// ⚠️ DO NOT CHANGE: colour names are shared across all tools
//                   changing them breaks visual consistency
//                   across the entire platform
// ============================================================

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './lib/**/*.{js,jsx}',
  ],

  theme: {
    extend: {

      colors: {
        // Backgrounds
        'bg-primary':    '#FFFFFF',
        'bg-secondary':  '#F7F8FA',
        'bg-tertiary':   '#EFF1F3',

        // Text
        'text-primary':   '#1A1D23',
        'text-secondary': '#5B6474',
        'text-muted':     '#9AA0AE',

        // ForgeYours accent — forge orange
        'accent-primary': '#E85D00',
        'accent-hover':   '#C44F00',
        'accent-light':   '#FFF0E6',

        // Status
        'success': '#2E7D32',
        'warning': '#B45309',
        'danger':  '#C62828',

        // Supporter cosmetics
        'supporter-gold':   '#B8860B',
        'supporter-border': '#D4AF37',
        'supporter-bg':     '#FFFBEB',
      },

      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },

      maxWidth: {
        'content': '860px',
        'sidebar': '280px',
      },

    },
  },

  plugins: [],
};

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: ForgeYours design tokens — accent is forge orange
//         distinct from The Real Medico blue
// --- END CHANGE LOG ---
