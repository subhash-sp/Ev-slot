import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ActivityIcon,
  ArrowRightIcon,
  BellIcon,
  CalendarIcon,
  CheckCircle2Icon,
  ClockIcon,
  PlugIcon,
  PlugZapIcon,
  SearchIcon,
  ShieldCheckIcon,
  WalletIcon } from
'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { StationCard } from '../components/StationCard';
import { useAppData } from '../contexts/AppDataContext';
import { heroImage } from '../data/stations';
import { benefits, howItWorksSteps } from '../data/content';
import type { ConnectorType } from '../types/models';

export const stepIcons: Record<string, React.ReactNode> = {
  search: <SearchIcon className="h-5 w-5" />,
  calendar: <CalendarIcon className="h-5 w-5" />,
  check: <CheckCircle2Icon className="h-5 w-5" />,
  plug: <PlugIcon className="h-5 w-5" />
};

const benefitIcons: Record<string, React.ReactNode> = {
  clock: <ClockIcon className="h-5 w-5" />,
  wallet: <WalletIcon className="h-5 w-5" />,
  activity: <ActivityIcon className="h-5 w-5" />,
  bell: <BellIcon className="h-5 w-5" />
};

export function Home() {
  const navigate = useNavigate();
  const { db } = useAppData();
  const nearby = [...db.stations].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 3);

  const openStationIds = new Set(db.stations.filter((s) => !s.temporarilyClosed).map((s) => s.id));
  const liveChargers = db.chargers.filter((c) => c.status === 'available' && openStationIds.has(c.stationId));
  const byConnector = (['CCS2', 'Type 2', 'CHAdeMO', 'Bharat DC-001'] as ConnectorType[]).map((type) => {
    const list = liveChargers.filter((c) => c.connector === type);
    return {
      type,
      count: list.length,
      maxKw: list.reduce((m, c) => Math.max(m, c.powerKw), 0),
      stations: new Set(list.map((c) => c.stationId)).size
    };
  });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
              <ShieldCheckIcon className="h-3.5 w-3.5" /> Free booking · No payment needed
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find. Book. <span className="text-green-600">Charge.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-slate-600">Reserve your EV charging slot in seconds and skip the wait.</p>
            <div className="mt-8">
              <SearchBar
                onSearch={(q) => navigate(q ? `/stations?q=${encodeURIComponent(q)}` : '/stations')}
                onLocate={(c) => navigate(`/stations?lat=${c.lat}&lng=${c.lng}`)} />
              
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2Icon className="h-4 w-4 text-green-600" /> {db.stations.length} stations</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2Icon className="h-4 w-4 text-green-600" /> {liveChargers.length} chargers live</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2Icon className="h-4 w-4 text-green-600" /> Instant confirmation</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.1 }} className="relative">
            <img src={heroImage} alt="Electric car charging at an EV Slot station" className="aspect-[4/3] w-full rounded-3xl object-cover shadow-xl" />
            <div className="absolute -bottom-5 left-4 right-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg sm:left-6 sm:right-auto sm:w-80">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white">
                <PlugZapIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">Charger 02 reserved</p>
                <p className="text-xs text-slate-500">GreenCharge · 10:00 AM – 10:30 AM</p>
              </div>
              <span className="ml-auto rounded-full bg-green-50 px-2 py-0.5 text-xs font-bold text-green-700">FREE</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Nearby */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Near you"
          title="Nearby charging stations"
          action={<Link to="/stations" className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800">View all <ArrowRightIcon className="h-4 w-4" /></Link>} />
        
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {nearby.map((s) => <StationCard key={s.id} station={s} />)}
        </div>
      </section>

      {/* Available chargers */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Live now" title="Available chargers" subtitle="Chargers ready for booking right now, grouped by connector." />
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {byConnector.map((c) =>
            <Link
              key={c.type}
              to={`/stations?connector=${encodeURIComponent(c.type)}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-green-400 hover:bg-white hover:shadow-sm">
              
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-900">{c.type}</span>
                  <PlugZapIcon className="h-5 w-5 text-green-600" />
                </div>
                <p className="mt-4 text-3xl font-bold text-slate-900">{c.count}</p>
                <p className="text-sm text-slate-500">available</p>
                <p className="mt-3 text-xs text-slate-500">
                  {c.count ? `Up to ${c.maxKw} kW · ${c.stations} station${c.stations > 1 ? 's' : ''}` : 'None available right now'}
                </p>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Simple" title="How it works" subtitle="From search to plug-in in four quick steps." />
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.map((s, i) =>
          <li key={s.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700">{stepIcons[s.icon]}</span>
                <span className="text-sm font-bold text-slate-300">0{i + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.body}</p>
            </li>
          )}
        </ol>
      </section>

      {/* Benefits */}
      <section className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wider text-green-400">Why EV Slot</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white">Charging that fits your day</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) =>
            <div key={b.title}>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white">{benefitIcons[b.icon]}</span>
                <h3 className="mt-4 font-semibold text-white">{b.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{b.body}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-green-600 p-8 sm:p-12 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Ready to charge without the wait?</h2>
            <p className="mt-2 text-green-50">Find a charger near you and reserve your slot for free.</p>
          </div>
          <Link to="/stations" className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-white px-6 font-semibold text-green-700 shadow-sm transition hover:bg-green-50">
            Find a charging station <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>);

}

export function SectionHeader({ eyebrow, title, subtitle, action }: {eyebrow?: string;title: string;subtitle?: string;action?: React.ReactNode;}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-sm font-semibold uppercase tracking-wider text-green-600">{eyebrow}</p>}
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
      </div>
      {action}
    </div>);

}