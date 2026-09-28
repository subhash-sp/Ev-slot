import React, { useState } from 'react';
import { SearchIcon, UserIcon, XCircleIcon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { useToast } from '../../contexts/ToastContext';
import { BookingStatus } from '../BookingStatus';
import { ConfirmationModal } from '../ConfirmationModal';
import { EmptyState } from '../EmptyState';
import { Dialog, DialogContent, DialogHeader } from '../ds/Dialog';
import type { Booking, BookingStatus as Status, User } from '../../types/models';
import { formatDayLabel, formatTimeRange } from '../../utils/time';

export function AdminBookings() {
  const { db, cancelBooking } = useAppData();
  const { showToast } = useToast();
  const [status, setStatus] = useState<Status | 'all'>('all');
  const [query, setQuery] = useState('');
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [customer, setCustomer] = useState<User | null>(null);

  const rows = db.bookings.
  filter((b) => status === 'all' || b.status === status).
  filter((b) => {
    if (!query) return true;
    const u = db.users.find((x) => x.id === b.userId);
    const s = db.stations.find((x) => x.id === b.stationId);
    return `${b.id} ${u?.fullName} ${u?.mobile} ${s?.name}`.toLowerCase().includes(query.toLowerCase());
  }).
  sort((a, b) => `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
        <label className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-slate-300 px-3">
          <SearchIcon className="h-4 w-4 text-slate-400" />
          <span className="sr-only">Search bookings</span>
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search ID, customer, mobile or station" className="w-full bg-transparent text-sm focus:outline-none" />
        </label>
        <select value={status} onChange={(e) => setStatus(e.target.value as Status | 'all')} aria-label="Filter by status" className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm">
          <option value="all">All statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {rows.length === 0 ?
      <div className="p-5"><EmptyState icon={<SearchIcon className="h-6 w-6" />} title="No bookings found" /></div> :

      <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Booking</th>
                <th className="px-4 py-3 font-semibold">Customer</th>
                <th className="px-4 py-3 font-semibold">Station · Charger</th>
                <th className="px-4 py-3 font-semibold">Slot</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((b) => {
              const u = db.users.find((x) => x.id === b.userId);
              const s = db.stations.find((x) => x.id === b.stationId);
              const c = db.chargers.find((x) => x.id === b.chargerId);
              return (
                <tr key={b.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3 font-mono font-semibold text-slate-900">{b.id}</td>
                    <td className="px-4 py-3">
                      {u ?
                    <button onClick={() => setCustomer(u)} className="text-left font-medium text-slate-900 hover:text-green-700">
                          {u.fullName}
                          <span className="block text-xs font-normal text-slate-500">+91 {u.mobile}</span>
                        </button> :
                    '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-700">{s?.name ?? '—'}<span className="block text-xs text-slate-500">{c?.label ?? 'Removed'} · {c?.connector}</span></td>
                    <td className="px-4 py-3 text-slate-700">{formatDayLabel(b.date)}<span className="block text-xs text-slate-500">{formatTimeRange(b.startTime, b.endTime)}</span></td>
                    <td className="px-4 py-3"><BookingStatus status={b.status} /></td>
                    <td className="px-4 py-3 text-right">
                      {b.status === 'confirmed' &&
                    <button onClick={() => setCancelTarget(b)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50">
                          <XCircleIcon className="h-3.5 w-3.5" /> Cancel
                        </button>
                    }
                    </td>
                  </tr>);

            })}
            </tbody>
          </table>
        </div>
      }

      <ConfirmationModal
        isOpen={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        title={`Cancel ${cancelTarget?.id ?? ''}?`}
        description="The customer's slot will be released immediately."
        tone="danger"
        icon={<XCircleIcon className="h-5 w-5" />}
        confirmLabel="Cancel Booking"
        cancelLabel="Keep"
        onConfirm={() => {
          if (cancelTarget) {
            cancelBooking(cancelTarget.id);
            showToast({ variant: 'success', title: `${cancelTarget.id} cancelled` });
          }
          setCancelTarget(null);
        }} />
      

      <Dialog isOpen={Boolean(customer)} onClose={() => setCustomer(null)} size="sm">
        {customer &&
        <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white"><UserIcon className="h-5 w-5" /></span>
                <h2 className="text-lg font-semibold text-slate-900">{customer.fullName}</h2>
              </div>
            </DialogHeader>
            <DialogContent>
              <CustomerDetails user={customer} bookings={db.bookings.filter((b) => b.userId === customer.id).length} />
            </DialogContent>
          </>
        }
      </Dialog>
    </div>);

}

export function CustomerDetails({ user, bookings }: {user: User;bookings: number;}) {
  const rows = [
  ['Mobile', `+91 ${user.mobile}`],
  ['Email', user.email],
  ['Vehicle', user.vehicleModel],
  ['Vehicle no.', user.vehicleNumber],
  ['Total bookings', String(bookings)],
  ['Customer since', new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })]];

  return (
    <dl className="divide-y divide-slate-100 text-sm">
      {rows.map(([k, v]) =>
      <div key={k} className="flex justify-between gap-4 py-2.5">
          <dt className="text-slate-500">{k}</dt>
          <dd className="text-right font-medium text-slate-900">{v}</dd>
        </div>
      )}
    </dl>);

}