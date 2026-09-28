import React from 'react';
import { ZapIcon } from 'lucide-react';

export function Logo({ inverted = false }: {inverted?: boolean;}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-600 text-white">
        <ZapIcon className="h-5 w-5" fill="currentColor" aria-hidden />
      </span>
      <span className={`text-lg font-bold tracking-tight ${inverted ? 'text-white' : 'text-slate-900'}`}>
        EV <span className="text-green-600">Slot</span>
      </span>
    </span>);

}