// ============================================================
// FILE: app/page.js
// PURPOSE: Placeholder tool UI — replace this with your tool
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: Demonstrates the toolbar + work area + AI panel
//               layout pattern every ForgeYours tool must follow
// DEPENDENCIES: globals.css, AIPanel, SupportButton, AuthProvider
// ⚠️ DO NOT CHANGE: toolbar, status-bar, tool-scroll-container
//                   class names — they are in globals.css
//                   Remove the placeholder content and replace
//                   with your tool — keep the shell structure
// ============================================================

'use client';

import { useState } from 'react';
import { 
  Save, 
  FolderOpen, 
  Download, 
  Sparkles, 
  Heart,
  Cloud,
  CloudOff,
} from 'lucide-react';
import AIPanel from '@/components/AIPanel';
import SupportButton from '@/components/SupportButton';
import { useAuthStore } from '@/store/authStore';
import { logEvent } from '@/lib/analytics';

export default function ToolPage() {
  const { user, signInWithGoogle, signOut } = useAuthStore();
  const [aiOpen, setAiOpen] = useState(false);
  const [saved, setSaved] = useState(true);
  const [wordCount, setWordCount] = useState(0);

  // ⚠️ REPLACE: this is placeholder content tracking
  // Wire your actual tool state here
  function handleContentChange(e) {
    const words = e.target.value
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    setWordCount(words);
    setSaved(false);
  }

  async function handleSave() {
    // ⚠️ REPLACE: wire to your actual save logic
    // For local save: use lib/localStore.js
    // For Drive save: use lib/driveConnector.js
    await logEvent('save', { tool: 'template' });
    setSaved(true);
  }

  return (
    <>
      {/* ─── TOOLBAR ─────────────────────────────────────────── */}
      <div className="toolbar">

        {/* Brand */}
        <a href="https://forgeyours.space" className="toolbar-brand">
          FY
        </a>

        <div className="toolbar-divider" />

        {/* File actions */}
        <button className="toolbar-btn" title="Open file">
          <FolderOpen size={15} />
          <span>Open</span>
        </button>

        <button
          className="toolbar-btn"
          title="Save"
          onClick={handleSave}
        >
          <Save size={15} />
          <span>{saved ? 'Saved' : 'Save'}</span>
        </button>

        <button className="toolbar-btn" title="Download">
          <Download size={15} />
          <span>Download</span>
        </button>

        <div className="toolbar-divider" />

        {/* ⚠️ REPLACE: Add your tool-specific toolbar buttons here
            Examples: Bold, Italic, Heading for a document editor
                      Formula bar for a spreadsheet
                      Brush size for an image editor */}
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          fontStyle: 'italic'
        }}>
          Your tool buttons go here
        </span>

        {/* Push everything after this to the right */}
        <div className="toolbar-spacer" />

        {/* Support button */}
        <SupportButton />

        <div className="toolbar-divider" />

        {/* AI toggle */}
        <button
          className={`toolbar-btn ${aiOpen ? 'toolbar-btn--active' : ''}`}
          onClick={() => setAiOpen(!aiOpen)}
          title="AI Assistant"
        >
          <Sparkles size={15} />
          <span>AI</span>
        </button>

        <div className="toolbar-divider" />

        {/* Auth */}
        {user ? (
          <button
            className="toolbar-btn"
            onClick={signOut}
            title="Signed in — click to sign out"
          >
            <Cloud size={15} />
            <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email?.split('@')[0]}
            </span>
          </button>
        ) : (
          <button
            className="toolbar-btn"
            onClick={signInWithGoogle}
            title="Sign in to sync to Google Drive"
          >
            <CloudOff size={15} />
            <span>Sign in</span>
          </button>
        )}

      </div>

      {/* ─── WORK AREA ───────────────────────────────────────── */}
      {/* ⚠️ REPLACE: this textarea is the placeholder
          Replace with your actual tool component
          Examples: <DocumentEditor /> <Spreadsheet /> <ImageCanvas /> */}
      <div style={{
        padding: '40px 24px',
        maxWidth: 860,
        margin: '0 auto',
        minHeight: '100%',
      }}>
        <textarea
          onChange={handleContentChange}
          placeholder="Your tool UI goes here. Replace this textarea with your actual tool component."
          style={{
            width: '100%',
            minHeight: '60vh',
            border: 'none',
            outline: 'none',
            resize: 'none',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '1rem',
            lineHeight: 1.7,
            color: 'var(--text-primary)',
            background: 'transparent',
          }}
        />
      </div>

      {/* ─── AI PANEL ────────────────────────────────────────── */}
      <AIPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        toolContext="This is a ForgeYours tool. Help the user with their work."
        // ⚠️ REPLACE toolContext with a description of your specific tool
        // Example for document editor:
        // toolContext="This is a document editor. The user is writing a document.
        //              Help them with writing, formatting, grammar, and structure."
      />

      {/* ─── STATUS BAR ──────────────────────────────────────── */}
      <div className="status-bar">
        <span>{saved ? '✓ Saved locally' : '● Unsaved changes'}</span>
        <div className="status-bar-spacer" />
        {/* ⚠️ REPLACE: show tool-relevant status info here */}
        <span>{wordCount} words</span>
        <span>ForgeYours</span>
      </div>

    </>
  );
}

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: Placeholder UI showing the correct shell structure
//         that every ForgeYours tool must follow
// --- END CHANGE LOG ---
