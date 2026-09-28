import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon, XCircleIcon, XIcon } from 'lucide-react';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

export interface ToastData {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

const styles: Record<ToastVariant, {icon: React.ReactNode;ring: string;}> = {
  success: { icon: <CheckCircle2Icon className="h-5 w-5 text-green-600" />, ring: 'border-l-green-600' },
  warning: { icon: <AlertTriangleIcon className="h-5 w-5 text-orange-500" />, ring: 'border-l-orange-500' },
  error: { icon: <XCircleIcon className="h-5 w-5 text-red-600" />, ring: 'border-l-red-600' },
  info: { icon: <InfoIcon className="h-5 w-5 text-slate-600" />, ring: 'border-l-slate-500' }
};

export function Toast({ toast, onDismiss }: {toast: ToastData;onDismiss: () => void;}) {
  const s = styles[toast.variant];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-l-4 border-slate-200 bg-white p-4 shadow-lg ${s.ring}`}>
      
      <span className="mt-0.5 shrink-0">{s.icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
        {toast.description && <p className="mt-0.5 whitespace-pre-line text-sm text-slate-600">{toast.description}</p>}
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
        
        <XIcon className="h-4 w-4" />
      </button>
    </motion.div>);

}