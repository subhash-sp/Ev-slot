import React from 'react';
import { format, parseISO } from 'date-fns';
import { TODAY } from '../utils/time';

interface DateSelectorProps {
  dates: string[];
  value: string;
  onChange: (date: string) => void;
}

export function DateSelector({ dates, value, onChange }: DateSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Select date" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
      {dates.map((d) => {
        const selected = d === value;
        const date = parseISO(d);
        return (
          <button
            key={d}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(d)}
            className={`flex min-w-[76px] shrink-0 flex-col items-center rounded-xl border px-3 py-2.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 ${
            selected ?
            'border-green-600 bg-green-600 text-white shadow-sm' :
            'border-slate-200 bg-white text-slate-700 hover:border-green-400'}`
            }>
            
            <span className={`text-xs font-medium ${selected ? 'text-green-50' : 'text-slate-500'}`}>
              {d === TODAY ? 'Today' : format(date, 'EEE')}
            </span>
            <span className="mt-0.5 text-base font-bold">{format(date, 'd MMM')}</span>
          </button>);

      })}
    </div>);

}