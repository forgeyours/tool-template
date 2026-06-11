// ============================================================
// FILE: components/SupportButton.jsx
// PURPOSE: Voluntary support button — no pressure, any amount
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: ForgeYours has no ads, no subscriptions, no
//               paywalls. This button is the only way users
//               can support the platform if they choose to.
//               No account needed. No minimum. No guilt.
//               Opens a modal with payment options.
// DEPENDENCIES: lucide-react
// ⚠️ DO NOT CHANGE: never make this button prominent or pushy
//                   never add it more than once per tool
//                   never gate any feature behind support
//                   the support model must always be voluntary
// ============================================================

'use client';

import { useState } from 'react';
import { Heart, X, ExternalLink } from 'lucide-react';

// ─── PAYMENT LINKS ───────────────────────────────────────────
// ⚠️ REPLACE these with real payment links when live
// UPI: create a UPI payment link via your bank app
// International: create a Razorpay payment page or Stripe link

const PAYMENT_OPTIONS = [
  {
    label: 'UPI (India)',
    description: 'Pay instantly via any UPI app',
    // ⚠️ REPLACE with real UPI link
    url: 'upi://pay?pa=forgeyours@upi&pn=ForgeYours&cu=INR',
    emoji: '🇮🇳',
  },
  {
    label: 'Card / International',
    description: 'Pay with any card or currency',
    // ⚠️ REPLACE with real Razorpay or Stripe payment link
    url: 'https://forgeyours.space/support',
    emoji: '🌍',
  },
  {
    label: 'Crypto',
    description: 'Pay with any cryptocurrency',
    // ⚠️ REPLACE with real crypto wallet address page
    url: 'https://forgeyours.space/crypto',
    emoji: '₿',
  },
];

export default function SupportButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ─── TRIGGER BUTTON ────────────────────────────────── */}
      <button
        className="support-btn"
        onClick={() => setOpen(true)}
        title="Support ForgeYours — voluntary, any amount"
      >
        <Heart size={13} />
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
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: 'var(--bg-primary)',
              borderRadius: 16,
              padding: 28,
              maxWidth: 400,
              width: '100%',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <div style={{
                fontSize: '1.5rem',
                marginBottom: 8,
              }}>
                ♥
              </div>
              <h2 style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '1.125rem',
                color: 'var(--text-primary)',
                margin: '0 0 8px 0',
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
                ForgeYours is free, open, and always will be.
                If it gave you value — contribute what you can,
                when you can. No pressure. No minimum. No guilt.
              </p>
            </div>

            {/* Payment options */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginBottom: 20,
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
                    transition: 'background 0.15s ease',
                    background: 'var(--bg-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'var(--bg-tertiary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'var(--bg-secondary)';
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
                    }}>
                      {option.label}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                    }}>
                      {option.description}
                    </div>
                  </div>
                  <ExternalLink
                    size={14}
                    style={{ color: 'var(--text-muted)' }}
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
      )}
    </>
  );
}

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: Voluntary support modal — three payment options
//         covering India (UPI), international (card),
//         and crypto. Never pushy, never gated.
// --- END CHANGE LOG ---
