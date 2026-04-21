import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const ICONS = {
  success: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  warning: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
};

const COLORS = {
  success: { bg: 'rgba(0, 230, 118, 0.12)', border: 'rgba(0, 230, 118, 0.4)', icon: '#00e676', glow: '0 0 20px rgba(0, 230, 118, 0.2)' },
  error:   { bg: 'rgba(255, 75, 75, 0.12)',  border: 'rgba(255, 75, 75, 0.4)',  icon: '#ff4b4b', glow: '0 0 20px rgba(255, 75, 75, 0.2)' },
  info:    { bg: 'rgba(0, 212, 255, 0.12)',  border: 'rgba(0, 212, 255, 0.4)',  icon: '#00d4ff', glow: '0 0 20px rgba(0, 212, 255, 0.2)' },
  warning: { bg: 'rgba(255, 193, 7, 0.12)',  border: 'rgba(255, 193, 7, 0.4)',  icon: '#ffc107', glow: '0 0 20px rgba(255, 193, 7, 0.2)' },
};

const Toast = ({ toast, onDismiss }) => {
  const c = COLORS[toast.type] || COLORS.info;
  const [exiting, setExiting] = React.useState(false);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  React.useEffect(() => {
    const t = setTimeout(handleDismiss, toast.duration || 3500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '14px',
        background: c.bg,
        border: `1px solid ${c.border}`,
        backdropFilter: 'blur(20px)',
        boxShadow: `${c.glow}, 0 8px 32px rgba(0,0,0,0.4)`,
        minWidth: '280px',
        maxWidth: '380px',
        cursor: 'pointer',
        animation: exiting ? 'toastOut 0.3s ease forwards' : 'toastIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={handleDismiss}
    >
      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '2px',
        background: c.icon,
        opacity: 0.6,
        borderRadius: '0 0 14px 14px',
        animation: `toastProgress ${toast.duration || 3500}ms linear forwards`,
      }} />

      <span style={{ color: c.icon, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
        {ICONS[toast.type] || ICONS.info}
      </span>
      <span style={{
        color: 'rgba(255,255,255,0.92)',
        fontSize: '0.88rem',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: '500',
        lineHeight: '1.4',
        flex: 1,
      }}>
        {toast.message}
      </span>
      <span style={{
        color: 'rgba(255,255,255,0.3)',
        fontSize: '0.75rem',
        flexShrink: 0,
        marginLeft: '4px',
      }}>✕</span>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const showToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast container */}
      <div style={{
        position: 'fixed',
        bottom: '100px',
        right: '32px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'all' }}>
            <Toast toast={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px) scale(0.92); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
        }
        @keyframes toastOut {
          from { opacity: 1; transform: translateX(0) scale(1); }
          to   { opacity: 0; transform: translateX(40px) scale(0.88); }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </ToastContext.Provider>
  );
};
