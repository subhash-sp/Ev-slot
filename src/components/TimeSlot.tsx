import React from 'react';
import type { SlotState } from '../types/models';
import { formatTime } from '../utils/time';

interface TimeSlotProps {
  startTime: string;
  state: SlotState;
  selected?: boolean;
  onSelect?: () => void;
  /** Admin mode lets blocked slots be clicked to unblock. */
  adminMode?: boolean;
}

export function TimeSlot({ startTime, state, selected = false, onSelect, adminMode = false }: TimeSlotProps) {
  const disabled = adminMode ? state === 'booked' || state === 'unavailable' : state !== 'available';
  const label = formatTime(startTime);

  let cls = 'border-green-600/40 bg-white text-slate-900 hover:border-green-600 hover:bg-green-50';
  if (selected) cls = 'border-green-600 bg-green-600 text-white shadow-sm';else
  if (state === 'booked') cls = 'border-slate-300 bg-slate-200 text-slate-500 line-through decoration-slate-400';else
  if (state === 'blocked')
  cls = adminMode ?
  'border-orange-300 bg-orange-50 text-orange-700 hover:bg-orange-100' :
  'border-slate-200 bg-slate-100 text-slate-400';else
  if (state === 'unavailable') cls = 'border-slate-200 bg-slate-100 text-slate-400';

  const srState = selected ? 'selected' : state === 'blocked' && !adminMode ? 'unavailable' : state;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      aria-label={`${label}, ${srState}`}
      className={`h-11 rounded-xl border text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-1 disabled:cursor-not-allowed ${cls}`}>
      
      {label}
    </button>);

}

export function TimeSlotLegend({ admin = false }: {admin?: boolean;}) {
  const items = [
  { label: 'Available', cls: 'border-green-600/40 bg-white' },
  { label: 'Selected', cls: 'border-green-600 bg-green-600' },
  { label: 'Booked', cls: 'border-slate-300 bg-slate-200' },
  admin ? { label: 'Blocked', cls: 'border-orange-300 bg-orange-50' } : null,
  { label: 'Unavailable', cls: 'border-slate-200 bg-slate-100' }].
  filter(Boolean) as {label: string;cls: string;}[];
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-slate-600">
      {items.map((i) =>
      <li key={i.label} className="inline-flex items-center gap-1.5">
          <span className={`h-3.5 w-3.5 rounded border ${i.cls}`} />
          {i.label}
        </li>
      )}
    </ul>);

}