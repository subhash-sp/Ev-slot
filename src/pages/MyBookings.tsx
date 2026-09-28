import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarXIcon, LogInIcon, XCircleIcon } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { useToast } from '../contexts/ToastContext';
import { BookingCard } from '../components/BookingCard';
import { EmptyState } from '../components/EmptyState';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { BookingSummary } from '../components/BookingSummary';
import { AuthForm } from '../components/AuthForm';
import { Tab, TabList, TabPanel, Tabs } from '../components/ds/Tabs';
import type { Booking } from '../types/models';

export function MyBookings() {
  const { db, currentUser, cancelBooking } = useAppData();
  const { showToast } = useToast();
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="mb-6 flex items-center gap-2 text-slate-500"><LogInIcon className="h-5 w-5" /> Sign in to see your bookings</div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <AuthForm onComplete={() => undefined} heading="Sign in to My Bookings" />
        </div>
      </div>);

  }

  const mine = db.bookings.filter((b) => b.userId === currentUser.id);
  const byDateAsc = (a: Booking, b: Booking) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`);
  const groups = {
    upcoming: mine.filter((b) => b.status === 'confirmed').sort(byDateAsc),
    completed: mine.filter((b) => b.status === 'completed').sort(byDateAsc).reverse(),
    cancelled: mine.filter((b) => b.status === 'cancelled').sort(byDateAsc).reverse()
  };

  const station = (id: string) => db.stations.find((s) => s.id === id);
  const charger = (id: string) => db.chargers.find((c) => c.id === id);

  const doCancel = () => {
    if (!cancelTarget) return;
    cancelBooking(cancelTarget.id);
    showToast({ variant: 'success', title: 'Booking cancelled', description: `${cancelTarget.id} has been cancelled and the slot released.` });
    setCancelTarget(null);
  };

  const empty = {
    upcoming: { title: 'No upcoming bookings', description: 'Find a nearby station and reserve your next charge for free.' },
    completed: { title: 'No completed charges yet', description: 'Your past charging sessions will appear here.' },
    cancelled: { title: 'No cancelled bookings', description: 'Bookings you cancel will be listed here.' }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Bookings</h1>
          <p className="mt-1 text-slate-600">Manage your charging reservations.</p>
        </div>
        <Link to="/stations" className="inline-flex h-11 items-center rounded-xl bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700">
          Book a slot
        </Link>
      </div>

      <div className="mt-6">
        <Tabs defaultTab="upcoming" variant="underlined">
          <TabList>
            <Tab id="upcoming" badge={groups.upcoming.length || undefined}>Upcoming</Tab>
            <Tab id="completed">Completed</Tab>
            <Tab id="cancelled">Cancelled</Tab>
          </TabList>
          {(['upcoming', 'completed', 'cancelled'] as const).map((key) =>
          <TabPanel key={key} id={key}>
              <div className="mt-6 space-y-4">
                {groups[key].length === 0 ?
              <EmptyState
                icon={<CalendarXIcon className="h-6 w-6" />}
                title={empty[key].title}
                description={empty[key].description}
                action={key === 'upcoming' ? <Link to="/stations" className="font-semibold text-green-700">Find stations →</Link> : undefined} /> :


              groups[key].map((b) =>
              <BookingCard
                key={b.id}
                booking={b}
                station={station(b.stationId)}
                charger={charger(b.chargerId)}
                onCancel={key === 'upcoming' ? () => setCancelTarget(b) : undefined} />

              )
              }
              </div>
            </TabPanel>
          )}
        </Tabs>
      </div>

      {cancelTarget && station(cancelTarget.stationId) &&
      <ConfirmationModal
        isOpen
        onClose={() => setCancelTarget(null)}
        title="Cancel this booking?"
        description="The slot will be released for other drivers."
        icon={<XCircleIcon className="h-5 w-5" />}
        tone="danger"
        confirmLabel="Cancel Booking"
        cancelLabel="Keep booking"
        onConfirm={doCancel}>
        
          <BookingSummary
          station={station(cancelTarget.stationId)!}
          charger={charger(cancelTarget.chargerId)}
          date={cancelTarget.date}
          startTime={cancelTarget.startTime}
          endTime={cancelTarget.endTime}
          bookingId={cancelTarget.id}
          compact />
        
        </ConfirmationModal>
      }
    </div>);

}