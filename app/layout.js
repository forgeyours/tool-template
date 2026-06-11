// ============================================================
// FILE: app/layout.js
// PURPOSE: Root layout for every ForgeYours tool
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: Wraps all pages with auth provider, toast
//               notifications, and the PWA manifest link
// DEPENDENCIES: globals.css, AuthProvider, react-hot-toast
// ⚠️ DO NOT CHANGE: AuthProvider must wrap everything
//                   manifest.json path must stay as-is
//                   tool-scroll-container id must stay as-is
// ============================================================

import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  // ⚠️ REPLACE these values when building your tool
  title: 'Tool Name — ForgeYours',
  description: 'Free, open, yours.',
  manifest: '/manifest.json',
  themeColor: '#E85D00',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Tool Name',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>
        <AuthProvider>

          {/* Main scrollable work area — never remove this div */}
          <div id="tool-scroll-container">
            {children}
          </div>

          {/* Toast notifications */}
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '0.875rem',
              },
            }}
          />

        </AuthProvider>
      </body>
    </html>
  );
}

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: Root layout with auth and toast wired in by default
// --- END CHANGE LOG ---
