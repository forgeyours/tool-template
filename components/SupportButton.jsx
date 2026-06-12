// ============================================================
// FILE: components/SupportButton.jsx
// PURPOSE: Voluntary support button — no pressure, any amount
// LAST CHANGED: 12 Jun 2026
// WHY IT EXISTS: ForgeYours has no ads, no subscriptions.
//               This is the only way users can support if they
//               choose to. No account needed. No minimum.
// DEPENDENCIES: lucide-react
// ⚠️ DO NOT CHANGE: never make this button prominent or pushy
//                   never gate any feature behind support
//                   support model must always be voluntary
// ============================================================

'use client';

import { useState } from 'react';
import { Heart, X, ExternalLink } from 'lucide-react';

const PAYMENT_OPTIONS = [
  {
    label: 'UPI (India)',
    description: 'Pay instantly via any UPI app',
    url: 'upi://pay?pa=forgeyours@upi&pn=ForgeYours&cu=INR',
    emoji: '🇮🇳',
  },
  {
    label: 'Card / International',
    description: 'Pay with any card or currency',
    url: 'https://forgeyours.space/support',
    emoji: '🌍',
  },
  {
    label: 'Crypto',
    description: 'Pay with any cryptocurrency',
    url: 'https://forgeyours.space/crypto',
    emoji: '₿',
  },
];

export default function SupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ─── TRIGGER BUTTON ────────────────────────────────── */}
      {/* Styled to match other toolbar buttons — not gold */}
      <button
        className="toolbar-btn"
        onClick={() => setOpen(true)}
        title="Support ForgeYours — voluntary, any amount"
      >
        <Heart size={15} />
        <span>Support</span>
      </button>

      {/* ─── MODAL ─────────────────────────────────────────── */}
      {open && (
        <div
                    style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            paddingTop: 68,
          }}

          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: 'var(--bg-primary)',
              borderRadius: 16,
              padding: 0,
              maxWidth: 400,
              width: '100%',
              // Fixed max height with internal scroll
              // so nothing gets cut off on small screens
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header — fixed, never scrolls */}
            <div style={{
              padding: '20px 24px 0 24px',
              flexShrink: 0,
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: 12,
              }}>
                <div>
                  <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>♥</div>
                  <h2 style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '1.125rem',
                    color: 'var(--text-primary)',
                    margin: '0 0 6px 0',
                  }}>
                    Support ForgeYours
                  </h2>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)',
                    margin: 0,
                    lineHeight: 1.6,
                  }}>
                    Free, open, and always will be.
                    Contribute what you can, when you can.
                    No pressure. No minimum.
                  </p>
                </div>

                <button
                  onClick={() => setOpen(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                    marginLeft: 12,
                    padding: 4,
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Scrollable content area */}
            <div style={{
              overflowY: 'auto',
              padding: '12px 24px 24px 24px',
            }}>

              {/* Payment options */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginBottom: 16,
              }}>
                {PAYMENT_OPTIONS.map((option) => (
                  <a
                    key={option.label}
                    href={option.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 16px',
                      borderRadius: 10,
                      border: '1px solid var(--bg-tertiary)',
                      textDecoration: 'none',
                      color: 'var(--text-primary)',
                      background: 'var(--bg-secondary)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-tertiary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>
                      {option.emoji}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        marginBottom: 2,
                        fontFamily: 'Inter, sans-serif',
                      }}>
                        {option.label}
                      </div>
                      <div style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        fontFamily: 'Inter, sans-serif',
                      }}>
                        {option.description}
                      </div>
                    </div>
                    <ExternalLink
                      size={14}
                      style={{ color: 'var(--text-muted)', flexShrink: 0 }}
                    />
                  </a>
                ))}
              </div>

              {/* Footer note */}
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                margin: 0,
                textAlign: 'center',
                lineHeight: 1.5,
              }}>
                Every rupee and dollar goes toward server costs
                and contributor recognition. Open books always.{' '}
                <a
                  href="https://forgeyours.space/finances"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-primary)' }}
                >
                  See where it goes
                </a>
              </p>

            </div>
          </div>
        </div>
      )}
    </>
  );
}

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial support button
// [12 Jun 2026] FIXED: button now matches toolbar style
//               modal now has maxHeight + internal scroll
//               so options never get cut off on small screens
// --- END CHANGE LOG ---
