import React from 'react';
import type { Charger, Station } from '../types/models';
import { formatLongDate, formatTimeRange } from '../utils/time';

interface BookingSummaryProps {
  station: Station;
  charger?: Charger | null;
  date?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  bookingId?: string;
  compact?: boolean;
}

export function BookingSummary({ station, charger, date, startTime, endTime, bookingId, compact = false }: BookingSummaryProps) {
  const rows: {label: string;value: React.ReactNode;}[] = [
  ...(bookingId ? [{ label: 'Booking ID', value: <span className="font-mono">{bookingId}</span> }] : []),
  { label: 'Station', value: station.name },
  { label: 'Location', value: compact ? station.area : station.address },
  { label: 'Date', value: date ? formatLongDate(date) : null },
  { label: 'Time', value: startTime && endTime ? formatTimeRange(startTime, endTime) : null },
  { label: 'Charger', value: charger?.label ?? null },
  { label: 'Connector', value: charger?.connector ?? null },
  { label: 'Charging Speed', value: charger ? `${charger.powerKw} kW` : null }];


  return (
    <dl className="divide-y divide-slate-100 text-sm">
      {rows.map((r) =>
      <div key={r.label} className="flex items-start justify-between gap-4 py-2.5">
          <dt className="shrink-0 text-slate-500">{r.label}</dt>
          <dd className={`text-right font-medium ${r.value ? 'text-slate-900' : 'text-slate-300'}`}>{r.value ?? 'Not selected'}</dd>
        </div>
      )}
      <div className="flex items-center justify-between gap-4 pt-3">
        <dt className="font-semibold text-slate-900">Price</dt>
        <dd className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold tracking-wide text-white">FREE</dd>
      </div>
    </dl>);

}