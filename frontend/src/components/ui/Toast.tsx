import { ShieldCheck, X } from 'lucide-react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <ShieldCheck size={16} aria-hidden="true" />
      <span>{message}</span>
      <button onClick={onDismiss} aria-label="Dismiss notification">
        <X size={14} />
      </button>
    </div>
  );
}
