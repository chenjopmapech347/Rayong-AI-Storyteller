/**
 * Modal — central overlay component
 *
 * Props:
 *   onClose   fn        – called when backdrop or ✕ button clicked (or Escape key)
 *   title     string    – header text (optional)
 *   subtitle  string    – header sub-text (optional)
 *   width     string    – CSS value, default 'min(92vw, 520px)'
 *   maxHeight string    – CSS value, default '88vh'
 *   zIndex    number    – default 9990
 *   noClose   bool      – hide ✕ button and disable backdrop click (e.g. busy saving)
 *   children  ReactNode – modal body
 *
 * Usage:
 *   <Modal title="แก้ไขทีม" onClose={() => setTeamModal(null)}>
 *     ...content...
 *   </Modal>
 */

import { useEffect } from 'react';

export default function Modal({
  onClose,
  title,
  subtitle,
  width = 'min(92vw, 520px)',
  maxHeight = '88vh',
  zIndex = 9990,
  noClose = false,
  children,
}) {
  // ── Escape key closes modal ────────────────────────────────────────────────
  useEffect(() => {
    if (noClose) return;
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [noClose, onClose]);

  // ── Prevent body scroll while modal is open ────────────────────────────────
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={noClose ? undefined : onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.45)',
          zIndex,
          cursor: noClose ? 'default' : 'pointer',
        }}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width,
          maxHeight,
          overflowY: 'auto',
          background: '#fff',
          borderRadius: 14,
          padding: '1.5rem',
          zIndex: zIndex + 1,
          boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {/* Header row — only shown if title or close button present */}
        {(title || !noClose) && (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div>
              {title && (
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#1e293b' }}>
                  {title}
                </h3>
              )}
              {subtitle && (
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 2 }}>{subtitle}</div>
              )}
            </div>
            {!noClose && (
              <button
                onClick={onClose}
                aria-label="ปิด"
                style={{
                  flexShrink: 0,
                  background: 'none', border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem', lineHeight: 1,
                  color: '#94a3b8',
                  padding: '0 0.25rem',
                  marginTop: '-2px',
                }}
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Body */}
        {children}
      </div>
    </>
  );
}
