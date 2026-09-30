import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BellIcon, CheckIcon, FileSearchIcon, Loader2Icon, MailIcon, MessageSquareIcon, NavigationIcon } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { BookingSummary } from '../components/BookingSummary';
import { BookingStatus } from '../components/BookingStatus';
import { EmptyState } from '../components/EmptyState';
import { directionsUrl } from '../utils/slots';
import { buildEmail, buildSmsMessage, type DeliveryResult } from '../utils/notifications';

export function BookingSuccess() {
  const { bookingId } = useParams();
  const { db, deliveries } = useAppData();
  const booking = db.bookings.find((b) => b.id === bookingId);
  const station = booking && db.stations.find((s) => s.id === booking.stationId);
  const charger = booking && db.chargers.find((c) => c.id === booking.chargerId);
  const user = booking && db.users.find((u) => u.id === booking.userId);

  if (!booking || !station || !charger || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState icon={<FileSearchIcon className="h-6 w-6" />} title="Booking not found" description="We couldn't find this booking." action={<Link className="font-semibold text-green-700" to="/bookings">Go to My Bookings</Link>} />
      </div>);

  }

  const payload = { booking, station, charger, user };
  const results = deliveries[booking.id];
  const email = results?.find((r) => r.channel === 'email');
  const sms = results?.find((r) => r.channel === 'sms');
  const isActive = booking.status === 'confirmed';

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white shadow-lg shadow-green-600/30">
            <CheckIcon className="h-9 w-9" strokeWidth={3} />
          </span>
        </motion.div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          {isActive ? 'Charging Slot Booked!' : `Booking ${booking.status}`}
        </h1>
        <p className="mt-2 text-slate-600">
          {isActive ? 'Your EV charging slot has been successfully reserved.' : 'This booking is no longer active.'}
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">Booking ID</p>
              <p className="font-mono text-2xl font-bold text-slate-900">{booking.id}</p>
            </div>
            <BookingStatus status={booking.status} />
          </div>
          <div className="mt-2">
            <BookingSummary station={station} charger={charger} date={booking.date} startTime={booking.startTime} endTime={booking.endTime} />
          </div>
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            <a href={directionsUrl(station)} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700">
              <NavigationIcon className="h-4 w-4" /> Get Directions
            </a>
            <Link to="/bookings" className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-sm font-semibold text-slate-800 transition hover:bg-slate-50">
              View Booking
            </Link>
            <Link to="/stations" className="inline-flex h-11 items-center justify-center rounded-xl bg-green-50 text-sm font-semibold text-green-700 transition hover:bg-green-100">
              Book Another Slot
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">Please arrive 5 minutes before your slot. Your charger is held for 10 minutes.</p>
        </section>

        <section className="space-y-4 lg:col-span-2" aria-label="Confirmation delivery">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Confirmation</h2>

          <Channel icon={<BellIcon className="h-4 w-4" />} title="In-app notification" status={<Pill tone="green">Delivered</Pill>}>
            Saved to your notifications (bell icon, top right).
          </Channel>

          <Channel icon={<MailIcon className="h-4 w-4" />} title="Email confirmation" status={<StatusPill result={email} />}>
            <p>To {user.email}</p>
            <Preview title={buildEmail(payload).subject} body={buildEmail(payload).body} />
          </Channel>

          <Channel icon={<MessageSquareIcon className="h-4 w-4" />} title="SMS confirmation" status={<StatusPill result={sms} />}>
            <p>To +91 {user.mobile}</p>
            <Preview body={buildSmsMessage(payload)} mono />
          </Channel>

          {(email?.status === 'not_configured' || sms?.status === 'not_configured') &&
          <p className="rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs text-orange-800">
              Email confirmation is active. SMS delivery is simulated in this demo environment.
            </p>
          }
        </section>
      </div>
    </div>);

}

function Channel({ icon, title, status, children }: {icon: React.ReactNode;title: string;status: React.ReactNode;children: React.ReactNode;}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600">{icon}</span>
          {title}
        </p>
        {status}
      </div>
      <div className="mt-2 space-y-2 text-xs text-slate-500">{children}</div>
    </div>);

}

function Preview({ title, body, mono }: {title?: string;body: string;mono?: boolean;}) {
  return (
    <details className="group rounded-lg bg-slate-50 p-2">
      <summary className="cursor-pointer select-none text-xs font-semibold text-slate-700">Preview message</summary>
      {title && <p className="mt-2 font-semibold text-slate-800">{title}</p>}
      <pre className={`mt-2 whitespace-pre-wrap text-[11px] leading-relaxed text-slate-600 ${mono ? 'font-mono' : 'font-sans'}`}>{body}</pre>
    </details>);

}

function StatusPill({ result }: {result?: DeliveryResult;}) {
  if (!result) return <Pill tone="slate"><Loader2Icon className="h-3 w-3 animate-spin" /> Preparing</Pill>;
  if (result.status === 'sent') return <Pill tone="green">Sent</Pill>;
  if (result.status === 'failed') return <Pill tone="red">Failed</Pill>;
  return <Pill tone="orange">Demo</Pill>;
}

function Pill({ tone, children }: {tone: 'green' | 'orange' | 'red' | 'slate';children: React.ReactNode;}) {
  const cls = {
    green: 'bg-green-50 text-green-700',
    orange: 'bg-orange-50 text-orange-700',
    red: 'bg-red-50 text-red-700',
    slate: 'bg-slate-100 text-slate-600'
  }[tone];
  return <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${cls}`}>{children}</span>;
}
