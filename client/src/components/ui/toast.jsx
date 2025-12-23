import React from 'react';
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-viewport">
      {toasts.map(({ id, title, description, variant = 'default', open = true }) => (
        open && (
          <div key={id} className={`toast ${variant === 'success' ? 'toast-success' : ''} ${variant === 'destructive' ? 'toast-destructive' : ''}`}>
            <div className="toast-content">
              {title && <div className="toast-title">{title}</div>}
              {description && <div className="toast-description">{description}</div>}
            </div>
            <button className="toast-close" onClick={() => dismiss(id)} aria-label="Close">×</button>
          </div>
        )
      ))}
    </div>
  );
}

export const ToastProvider = ({ children }) => children;
export const ToastViewport = () => null;
export const Toast = ({ children }) => <>{children}</>;
export const ToastTitle = ({ children }) => <>{children}</>;
export const ToastDescription = ({ children }) => <>{children}</>;
export const ToastClose = () => null;
export const ToastAction = ({ children, onClick }) => (
  <button className="btn btn-outline" onClick={onClick}>{children}</button>
);
