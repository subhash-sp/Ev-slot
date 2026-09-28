import React from 'react';
import { CheckCircle2Icon, CircleSlashIcon, ClockIcon } from 'lucide-react';
import type { BookingStatus as Status } from '../types/models';

const map: Record<Status, {label: string;cls: string;icon: React.ReactNode;}> = {
  confirmed: { label: 'Confirmed', cls: 'bg-green-50 text-green-700 ring-green-600/20', icon: <ClockIcon className="h-3.5 w-3.5" /> },
  completed: { label: 'Completed', cls: 'bg-slate-100 text-slate-700 ring-slate-500/20', icon: <CheckCircle2Icon className="h-3.5 w-3.5" /> },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-700 ring-red-600/20', icon: <CircleSlashIcon className="h-3.5 w-3.5" /> }
};

export function BookingStatus({ status }: {status: Status;}) {
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${s.cls}`}>
      {s.icon}
      {s.label}
    </span>);

}