import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className={`toast ${type}`}>
      {type === 'success' && <CheckCircle2 size={20} color="#16a34a" />}
      {type === 'error' && <AlertCircle size={20} color="#dc2626" />}
      {type === 'info' && <Info size={20} color="#0284c7" />}
      <div style={{ flex: 1, fontSize: '0.9rem' }}>{message}</div>
      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
