import React from 'react';
import { BuildingIcon, CalendarCheckIcon, PlugZapIcon, TimerIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { countAvailableSlots } from '../../utils/slots';
import { TODAY, formatDayLabel, formatTimeRange } from '../../utils/time';
import { BookingStatus } from '../BookingStatus';
import { EmptyState } from '../EmptyState';

export function AdminOverview() {
  const { db } = useAppData();
  const todays = db.bookings.filter((b) => b.date === TODAY && b.status !== 'cancelled');
  const availableSlots = db.stations.reduce((sum, s) => sum + countAvailableSlots(db, s, TODAY), 0);
  const upcoming = db.bookings.
  filter((b) => b.status === 'confirmed').
  sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`)).
  slice(0, 8);

  const cards = [
  { label: 'Total Stations', value: db.stations.length, icon: <BuildingIcon className="h-5 w-5" />, sub: `${db.stations.filter((s) => !s.temporarilyClosed).length} operational` },
  { label: 'Total Chargers', value: db.chargers.length, icon: <PlugZapIcon className="h-5 w-5" />, sub: `${db.chargers.filter((c) => c.status === 'unavailable').length} under maintenance` },
  { label: "Today's Bookings", value: todays.length, icon: <CalendarCheckIcon className="h-5 w-5" />, sub: formatDayLabel(TODAY) },
  { label: 'Available Slots', value: availableSlots, icon: <TimerIcon className="h-5 w-5" />, sub: 'Remaining today' }];


  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) =>
        <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{c.label}</p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-700">{c.icon}</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">{c.value}</p>
            <p className="mt-1 text-xs text-slate-500">{c.sub}</p>
          </div>
        )}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <h2 className="border-b border-slate-100 px-5 py-4 font-semibold text-slate-900">Upcoming bookings</h2>
        {upcoming.length === 0 ?
        <div className="p-5"><EmptyState icon={<CalendarCheckIcon className="h-6 w-6" />} title="No upcoming bookings" /></div> :

        <ul className="divide-y divide-slate-100">
            {upcoming.map((b) => {
            const st = db.stations.find((s) => s.id === b.stationId);
            const ch = db.chargers.find((c) => c.id === b.chargerId);
            const u = db.users.find((x) => x.id === b.userId);
            return (
              <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3 text-sm">
                  <span className="w-20 font-mono font-semibold text-slate-900">{b.id}</span>
                  <span className="min-w-[140px] flex-1 text-slate-700">{st?.name} · {ch?.label}</span>
                  <span className="text-slate-600">{formatDayLabel(b.date)}, {formatTimeRange(b.startTime, b.endTime)}</span>
                  <span className="text-slate-500">{u?.fullName}</span>
                  <BookingStatus status={b.status} />
                </li>);

          })}
          </ul>
        }
      </section>
    </div>);

}