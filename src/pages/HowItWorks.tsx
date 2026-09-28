import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CheckCircle2Icon } from 'lucide-react';
import { howItWorksSteps } from '../data/content';
import { stepIcons } from './Home';
import { TimeSlot, TimeSlotLegend } from '../components/TimeSlot';

export function HowItWorks() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-16">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-green-600">How it works</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Reserve a charger in under a minute</h1>
        <p className="mt-3 text-lg text-slate-600">EV Slot holds a charger for you at the time you choose. Booking is always free.</p>
      </div>

      <ol className="mt-12 space-y-4">
        {howItWorksSteps.map((s, i) =>
        <li key={s.title} className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-600 text-white">{stepIcons[s.icon]}</span>
            <div>
              <p className="text-xs font-bold text-slate-400">STEP {i + 1}</p>
              <h2 className="mt-0.5 text-lg font-semibold text-slate-900">{s.title}</h2>
              <p className="mt-1 text-slate-600">{s.body}</p>
            </div>
          </li>
        )}
      </ol>

      <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Reading time slots</h2>
        <p className="mt-1 text-sm text-slate-600">Each slot shows its status so you always know what can be booked.</p>
        <div className="mt-5 grid max-w-md grid-cols-4 gap-2">
          <TimeSlot startTime="09:00" state="available" />
          <TimeSlot startTime="09:30" state="available" selected />
          <TimeSlot startTime="10:00" state="booked" />
          <TimeSlot startTime="10:30" state="unavailable" />
        </div>
        <div className="mt-4"><TimeSlotLegend /></div>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {['No payment or card details', 'Cancel anytime, instantly', 'No double bookings'].map((t) =>
        <div key={t} className="flex items-center gap-2 rounded-xl bg-green-50 p-4 text-sm font-semibold text-green-800">
            <CheckCircle2Icon className="h-5 w-5 text-green-600" /> {t}
          </div>
        )}
      </section>

      <div className="mt-12 text-center">
        <Link to="/stations" className="inline-flex h-12 items-center gap-2 rounded-xl bg-green-600 px-6 font-semibold text-white hover:bg-green-700">
          Find a station <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </div>);

}