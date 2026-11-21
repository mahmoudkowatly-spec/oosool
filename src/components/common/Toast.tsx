import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border transition-all transform animate-in slide-in-from-bottom-5 duration-200 ${
              isSuccess
                ? 'bg-[#174638] text-white border-[#205c4a]'
                : isError
                ? 'bg-[#842029] text-white border-[#b02a37]'
                : 'bg-[#25352e] text-white border-[#3d4f46]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-[#86efac]" />}
              {isError && <AlertCircle className="w-5 h-5 text-[#fca5a5]" />}
              {!isSuccess && !isError && <Info className="w-5 h-5 text-[#93c5fd]" />}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold leading-tight">{toast.title}</h4>
              {toast.message && (
                <p className="text-xs opacity-90 mt-1 leading-normal">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="shrink-0 text-white/70 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
