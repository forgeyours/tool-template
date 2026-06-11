// ============================================================
// FILE: components/AIPanel.jsx
// PURPOSE: Sliding AI assistant panel — user brings own API key
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: Every ForgeYours tool has a built-in AI
//               assistant that understands the tool context.
//               User provides their own Anthropic API key —
//               stored in their browser only, never our servers.
// DEPENDENCIES: lib/aiClient.js, lucide-react
// ⚠️ DO NOT CHANGE: ai-panel class names — defined in globals.css
//                   API key is stored in localStorage only —
//                   never send to any ForgeYours endpoint
//                   toolContext prop must be set by each tool —
//                   it is what makes the AI tool-aware
// ============================================================

'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, Key, Trash2, AlertCircle } from 'lucide-react';
import {
  sendMessage,
  hasApiKey,
  saveApiKey,
  clearApiKey,
  getApiKey,
} from '@/lib/aiClient';

export default function AIPanel({ open, onClose, toolContext }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [keysaved, setKeySaved] = useState(false);
  const messagesEndRef = useRef(null);

  // Check if key exists on mount
  useEffect(() => {
    setKeySaved(hasApiKey());
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSaveKey() {
    if (!keyInput.trim()) return;
    saveApiKey(keyInput.trim());
    setKeySaved(true);
    setShowKeyInput(false);
    setKeyInput('');
    setError(null);
  }

  function handleClearKey() {
    clearApiKey();
    setKeySaved(false);
    setMessages([]);
  }

  async function handleSend() {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const reply = await sendMessage({
        messages: newMessages,
        toolContext,
      });

      setMessages([
        ...newMessages,
        { role: 'assistant', content: reply },
      ]);

    } catch (err) {
      if (err.message === 'NO_API_KEY') {
        setError('No API key found. Add your Anthropic API key below.');
        setShowKeyInput(true);
      } else if (err.message === 'INVALID_API_KEY') {
        setError('Invalid API key. Please check and try again.');
        setShowKeyInput(true);
      } else if (err.message === 'RATE_LIMITED') {
        setError('Rate limited. Wait a moment and try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className={`ai-panel ${open ? 'ai-panel--open' : ''}`}>

      {/* ─── HEADER ──────────────────────────────────────────── */}
      <div className="ai-panel-header">
        <span>✦ AI Assistant</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>

          {/* API key management */}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            title={keySaved ? 'API key saved — click to manage' : 'Add API key'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: keysaved
                ? 'var(--success)'
                : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Key size={14} />
          </button>

          {keySaved && (
            <button
              onClick={handleClearKey}
              title="Remove API key"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Trash2 size={14} />
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ─── API KEY INPUT ────────────────────────────────────── */}
      {showKeyInput && (
        <div style={{
          padding: '12px',
          borderBottom: '1px solid var(--bg-tertiary)',
          background: 'var(--bg-secondary)',
        }}>
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
            margin: '0 0 8px 0',
            lineHeight: 1.5,
          }}>
            Your Anthropic API key. Stored in your browser only —
            never sent to ForgeYours servers.
            Get one at{' '}
            <a
              href="https://console.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--accent-primary)' }}
            >
              console.anthropic.com
            </a>
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="sk-ant-..."
              style={{
                flex: 1,
                border: '1px solid var(--bg-tertiary)',
                borderRadius: 6,
                padding: '6px 10px',
                fontSize: '0.8125rem',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                background: 'var(--bg-primary)',
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
            />
            <button
              onClick={handleSaveKey}
              className="toolbar-btn toolbar-btn--primary"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* ─── MESSAGES ─────────────────────────────────────────── */}
      <div className="ai-panel-messages">

        {/* Empty state */}
        {messages.length === 0 && !error && (
          <div style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.8125rem',
            marginTop: 40,
            lineHeight: 1.6,
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>✦</div>
            <div>Ask anything about your work.</div>
            {!keySaved && (
              <div style={{ marginTop: 8 }}>
                Add your API key above to get started.
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            display: 'flex',
            gap: 8,
            alignItems: 'flex-start',
            padding: '10px 12px',
            background: '#FEF2F2',
            borderRadius: 8,
            color: 'var(--danger)',
            fontSize: '0.8125rem',
          }}>
            <AlertCircle size={14} style={{ marginTop: 2, flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user'
                ? 'flex-end'
                : 'flex-start',
            }}
          >
            <div style={{
              maxWidth: '85%',
              padding: '8px 12px',
              borderRadius: msg.role === 'user'
                ? '12px 12px 2px 12px'
                : '12px 12px 12px 2px',
              background: msg.role === 'user'
                ? 'var(--accent-primary)'
                : 'var(--bg-secondary)',
              color: msg.role === 'user'
                ? '#ffffff'
                : 'var(--text-primary)',
              fontSize: '0.8125rem',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <div style={{
              padding: '8px 12px',
              borderRadius: '12px 12px 12px 2px',
              background: 'var(--bg-secondary)',
              color: 'var(--text-muted)',
              fontSize: '0.8125rem',
            }}>
              ✦ thinking...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ─── INPUT ROW ────────────────────────────────────────── */}
      <div className="ai-panel-input-row">
        <textarea
          className="ai-panel-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything... (Enter to send)"
          rows={2}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="toolbar-btn toolbar-btn--primary"
          style={{ alignSelf: 'flex-end', padding: '8px' }}
        >
          <Send size={15} />
        </button>
      </div>

    </div>
  );
}

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: AI panel with user-owned API key model —
//         key stored in localStorage, never transmitted
//         to ForgeYours servers. Tool context makes AI
//         relevant to what the user is actually doing.
// --- END CHANGE LOG ---
