// ============================================================
// FILE: postcss.config.js
// PURPOSE: Tells PostCSS to run Tailwind CSS and Autoprefixer
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: Without this file Tailwind classes do not work
// DEPENDENCIES: tailwind.config.js must exist
// ⚠️ DO NOT CHANGE: this file must stay exactly as-is
// ============================================================

module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: Required glue between Next.js and Tailwind CSS
// --- END CHANGE LOG ---
