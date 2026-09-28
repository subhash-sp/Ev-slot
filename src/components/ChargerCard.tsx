import React from 'react';
import { CheckIcon, PlugZapIcon } from 'lucide-react';
import type { Charger } from '../types/models';

interface ChargerCardProps {
  charger: Charger;
  selected?: boolean;
  onSelect?: () => void;
  freeSlots?: number;
}

export function ChargerCard({ charger, selected = false, onSelect, freeSlots }: ChargerCardProps) {
  const unavailable = charger.status === 'unavailable';
  const interactive = Boolean(onSelect);
  const content =
  <>
      <div className="flex items-start justify-between gap-2">
        <span
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
        selected ? 'bg-green-600 text-white' : unavailable ? 'bg-slate-100 text-slate-400' : 'bg-green-50 text-green-700'}`
        }>
        
          <PlugZapIcon className="h-5 w-5" />
        </span>
        {selected &&
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white">
            <CheckIcon className="h-4 w-4" />
          </span>
      }
      </div>
      <p className={`mt-3 text-sm font-semibold ${unavailable ? 'text-slate-400' : 'text-slate-900'}`}>{charger.label}</p>
      <p className="mt-0.5 text-sm text-slate-600">
        {charger.connector} · {charger.currentType}
      </p>
      <p className={`mt-1 text-lg font-bold ${unavailable ? 'text-slate-400' : 'text-slate-900'}`}>{charger.powerKw} kW</p>
      <p className={`mt-2 inline-flex items-center gap-1.5 text-xs font-semibold ${unavailable ? 'text-orange-600' : 'text-green-700'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${unavailable ? 'bg-orange-500' : 'bg-green-600'}`} />
        {unavailable ? 'Under maintenance' : freeSlots !== undefined ? `Available · ${freeSlots} slots` : 'Available'}
      </p>
    </>;


  const base = `w-full rounded-2xl border p-4 text-left transition ${
  selected ?
  'border-green-600 bg-green-50/60 ring-1 ring-green-600' :
  unavailable ?
  'border-slate-200 bg-slate-50' :
  'border-slate-200 bg-white'}`;


  if (!interactive) return <div className={base}>{content}</div>;

  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={unavailable}
      aria-pressed={selected}
      className={`${base} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 disabled:cursor-not-allowed ${
      !selected && !unavailable ? 'hover:border-green-400 hover:shadow-sm' : ''}`
      }>
      
      {content}
    </button>);

}