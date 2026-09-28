import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from './ds/Dialog';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  loading?: boolean;
  tone?: 'primary' | 'danger';
  icon?: React.ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel = 'Go back',
  onConfirm,
  loading = false,
  tone = 'primary',
  icon
}: ConfirmationModalProps) {
  return (
    <Dialog isOpen={isOpen} onClose={loading ? () => undefined : onClose} size="md">
      <DialogHeader>
        <div className="flex items-center gap-3 pr-8">
          {icon &&
          <span
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            tone === 'danger' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`
            }>
            
              {icon}
            </span>
          }
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            {description && <p className="text-sm font-normal text-slate-500">{description}</p>}
          </div>
        </div>
      </DialogHeader>
      {children && <DialogContent>{children}</DialogContent>}
      <DialogFooter>
        <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={tone === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            className={tone === 'danger' ? '!bg-red-600 !text-white hover:!bg-red-700' : ''}>
            
            {confirmLabel}
          </Button>
        </div>
      </DialogFooter>
    </Dialog>);

}