// src/Toast.jsx — Lightweight toast notification system.
// Replaces alert() with a non-blocking, auto-dismissing notification.
//
// Usage:
//   import { useToast } from './Toast';
//   const toast = useToast();
//   toast.success('บันทึกแล้ว');
//   toast.error('ผิดพลาด: ' + err.message);
//   toast.info('ข้อความทั่วไป');
//
// Wrap your app once with <ToastProvider>...</ToastProvider>.

import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

let counter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const push = useCallback((kind, message, opts = {}) => {
    const id = ++counter;
    const ttl = opts.ttl ?? (kind === 'error' ? 6000 : 3000);
    setToasts(prev => [...prev, { id, kind, message }]);
    if (ttl > 0) setTimeout(() => dismiss(id), ttl);
    return id;
  }, [dismiss]);

  const value = {
    success: (m, o) => push('success', m, o),
    error:   (m, o) => push('error', m, o),
    info:    (m, o) => push('info', m, o),
    dismiss
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast viewport — fixed top-right, stacks downward */}
      <div style={{
        position: 'fixed',
        top: '1rem',
        right: '1rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        maxWidth: '360px',
        pointerEvents: 'none'
      }}>
        {toasts.map(t => {
          const palette = {
            success: { bg: '#f0fdf4', border: '#86efac', text: '#15803d', Icon: CheckCircle2 },
            error:   { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', Icon: AlertCircle },
            info:    { bg: '#eff6ff', border: '#93c5fd', text: '#1e40af', Icon: Info }
          }[t.kind] || { bg: '#fff', border: '#e5e7eb', text: '#1f2937', Icon: Info };
          const { Icon } = palette;
          return (
            <div
              key={t.id}
              role="status"
              style={{
                pointerEvents: 'auto',
                background: palette.bg,
                border: `1px solid ${palette.border}`,
                color: palette.text,
                padding: '0.6rem 0.75rem',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
                fontSize: '0.85rem',
                lineHeight: 1.45,
                animation: 'eco-toast-in 0.18s ease-out'
              }}
            >
              <Icon size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <div style={{ flex: 1, whiteSpace: 'pre-wrap' }}>{t.message}</div>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'inherit',
                  opacity: 0.6,
                  cursor: 'pointer',
                  padding: 2,
                  marginLeft: 4
                }}
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes eco-toast-in {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fallback when used outside provider — degrade to alert so caller still gets feedback
    return {
      success: (m) => alert(m),
      error:   (m) => alert(m),
      info:    (m) => alert(m),
      dismiss: () => {}
    };
  }
  return ctx;
}
