import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, CalendarCheckIcon, CalendarXIcon, MapPinIcon, ShieldCheckIcon } from 'lucide-react';
import { useBookingFlow } from '../hooks/useBookingFlow';
import { DateSelector } from '../components/DateSelector';
import { ChargerCard } from '../components/ChargerCard';
import { TimeSlot, TimeSlotLegend } from '../components/TimeSlot';
import { BookingSummary } from '../components/BookingSummary';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { AuthForm } from '../components/AuthForm';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { Dialog, DialogContent } from '../components/ds/Dialog';
import { formatTime, formatTimeRange, toMinutes } from '../utils/time';
import type { TimeSlot as Slot } from '../types/models';

const PERIODS = [
{ label: 'Morning', from: 0, to: 12 * 60 },
{ label: 'Afternoon', from: 12 * 60, to: 17 * 60 },
{ label: 'Evening', from: 17 * 60, to: 24 * 60 }];


export function BookSlot() {
  const { id } = useParams();
  const f = useBookingFlow(id);

  if (!f.station) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState icon={<MapPinIcon className="h-6 w-6" />} title="Station not found" action={<Link className="font-semibold text-green-700" to="/stations">Browse stations</Link>} />
      </div>);

  }

  const station = f.station;
  const availableCount = f.slots.filter((s) => s.state === 'available').length;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-32 pt-6 sm:px-6 lg:px-8 lg:pb-16">
      <Link to={`/stations/${station.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeftIcon className="h-4 w-4" /> Back to station
      </Link>
      <div className="mt-3">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Book a charging slot</h1>
        <p className="mt-1 flex items-center gap-1.5 text-slate-600">
          <MapPinIcon className="h-4 w-4" /> {station.name} · {station.area}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Step n={1} title="Select date" done>
            <DateSelector dates={f.dates} value={f.date} onChange={f.selectDate} />
          </Step>

          <Step n={2} title="Select charger" done={Boolean(f.charger)}>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {f.chargers.map((c) =>
              <ChargerCard
                key={c.id}
                charger={c}
                selected={c.id === f.charger?.id}
                onSelect={() => f.selectCharger(c.id)}
                freeSlots={f.freeSlotsByCharger[c.id]} />

              )}
            </div>
          </Step>

          <Step n={3} title="Select time slot" done={Boolean(f.selectedSlot)} aside={f.charger ? `${availableCount} available` : undefined}>
            {!f.charger ?
            <p className="text-sm text-slate-500">Choose a charger to see its time slots.</p> :
            availableCount === 0 ?
            <EmptyState
              icon={<CalendarXIcon className="h-6 w-6" />}
              title="No slots left on this day"
              description="Try another date or a different charger." /> :


            <div className="space-y-5">
                <TimeSlotLegend />
                {PERIODS.map((p) => {
                const list = f.slots.filter((s) => toMinutes(s.startTime) >= p.from && toMinutes(s.startTime) < p.to);
                if (!list.length) return null;
                return <SlotGroup key={p.label} label={p.label} slots={list} selected={f.selectedSlot?.startTime ?? null} onSelect={f.selectSlot} />;
              })}
              </div>
            }
          </Step>
        </div>

        {/* Summary */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Booking summary</h2>
            <div className="mt-3">
              <BookingSummary station={station} charger={f.charger} date={f.date} startTime={f.selectedSlot?.startTime} endTime={f.selectedSlot?.endTime} compact />
            </div>
            <Button className="mt-6" fullWidth size="lg" disabled={!f.canReview} onClick={f.review}>
              {f.canReview ? 'Review booking' : 'Select a time slot'}
            </Button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <ShieldCheckIcon className="h-3.5 w-3.5 text-green-600" /> No payment required
            </p>
          </div>
        </aside>
      </div>

      {/* Mobile bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {f.selectedSlot ? formatTimeRange(f.selectedSlot.startTime, f.selectedSlot.endTime) : 'No time selected'}
            </p>
            <p className="truncate text-xs text-slate-500">
              {f.charger ? `${f.charger.label} · ${f.charger.connector} · ${f.charger.powerKw} kW` : 'Select a charger'} · <span className="font-semibold text-green-700">FREE</span>
            </p>
          </div>
          <Button disabled={!f.canReview} onClick={f.review}>Review</Button>
        </div>
      </div>

      {/* Sign in / details */}
      <Dialog isOpen={f.authOpen} onClose={() => f.setAuthOpen(false)} size="md">
        <DialogContent>
          <div className="pt-2">
            <AuthForm onComplete={f.onAuthComplete} heading="Sign in to confirm your slot" />
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm */}
      <ConfirmationModal
        isOpen={f.confirmOpen}
        onClose={() => f.setConfirmOpen(false)}
        title="Confirm your booking"
        description="Please check the details before confirming."
        icon={<CalendarCheckIcon className="h-5 w-5" />}
        confirmLabel="Confirm Free Booking"
        onConfirm={f.confirm}
        loading={f.confirming}>
        
        <BookingSummary station={station} charger={f.charger} date={f.date} startTime={f.selectedSlot?.startTime} endTime={f.selectedSlot?.endTime} />
        {f.currentUser &&
        <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
            Booking for <span className="font-semibold text-slate-900">{f.currentUser.fullName}</span> · {f.currentUser.vehicleModel} ({f.currentUser.vehicleNumber})
          </p>
        }
      </ConfirmationModal>
    </div>);

}

function Step({ n, title, done, aside, children }: {n: number;title: string;done?: boolean;aside?: string;children: React.ReactNode;}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby={`step-${n}`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id={`step-${n}`} className="flex items-center gap-3 text-base font-semibold text-slate-900">
          <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${done ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{n}</span>
          <span><span className="text-slate-400">Step {n}:</span> {title}</span>
        </h2>
        {aside && <span className="text-sm font-medium text-green-700">{aside}</span>}
      </div>
      {children}
    </section>);

}

function SlotGroup({ label, slots, selected, onSelect }: {label: string;slots: Slot[];selected: string | null;onSelect: (t: string) => void;}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label} <span className="font-normal normal-case text-slate-400">· {formatTime(slots[0].startTime)} onwards</span>
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 xl:grid-cols-6">
        {slots.map((s) =>
        <TimeSlot key={s.id} startTime={s.startTime} state={s.state} selected={s.startTime === selected} onSelect={() => onSelect(s.startTime)} />
        )}
      </div>
    </div>);

}