import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AccessibilityIcon,
  ArrowLeftIcon,
  CarIcon,
  CctvIcon,
  ClockIcon,
  CoffeeIcon,
  MapPinIcon,
  NavigationIcon,
  ShoppingBagIcon,
  SofaIcon,
  StarIcon,
  BathIcon,
  WifiIcon,
  ZapIcon,
  CalendarPlusIcon } from
'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { ChargerCard } from '../components/ChargerCard';
import { EmptyState } from '../components/EmptyState';
import { facilityLabels } from '../data/content';
import type { FacilityId } from '../types/models';
import { buildSlots, directionsUrl, isStationOpenNow, mapEmbedUrl } from '../utils/slots';
import { TODAY, hoursLabel } from '../utils/time';

const facilityIcons: Record<FacilityId, React.ReactNode> = {
  restroom: <BathIcon className="h-5 w-5" />,
  cafe: <CoffeeIcon className="h-5 w-5" />,
  wifi: <WifiIcon className="h-5 w-5" />,
  parking: <CarIcon className="h-5 w-5" />,
  cctv: <CctvIcon className="h-5 w-5" />,
  lounge: <SofaIcon className="h-5 w-5" />,
  shopping: <ShoppingBagIcon className="h-5 w-5" />,
  accessible: <AccessibilityIcon className="h-5 w-5" />
};

export function StationDetails() {
  const { id } = useParams();
  const { db } = useAppData();
  const station = db.stations.find((s) => s.id === id);
  const [photo, setPhoto] = useState(0);

  if (!station) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={<MapPinIcon className="h-6 w-6" />}
          title="Station not found"
          description="This station may have been removed or the link is incorrect."
          action={<Link to="/stations" className="font-semibold text-green-700">Browse stations</Link>} />
        
      </div>);

  }

  const chargers = db.chargers.filter((c) => c.stationId === station.id);
  const open = isStationOpenNow(station);
  const connectors = Array.from(new Set(chargers.map((c) => c.connector)));
  const speeds = chargers.map((c) => c.powerKw);
  const available = station.temporarilyClosed ? 0 : chargers.filter((c) => c.status === 'available').length;
  const bookable = !station.temporarilyClosed && available > 0;

  const BookButton = ({ full }: {full?: boolean;}) =>
  bookable ?
  <Link
    to={`/book/${station.id}`}
    className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 font-semibold text-white shadow-sm transition hover:bg-green-700 ${full ? 'w-full' : ''}`}>
    
        <CalendarPlusIcon className="h-5 w-5" /> Book Charging Slot
      </Link> :

  <span className={`inline-flex h-12 items-center justify-center rounded-xl bg-slate-200 px-6 font-semibold text-slate-500 ${full ? 'w-full' : ''}`}>
        Booking unavailable
      </span>;


  return (
    <div className="mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-12">
      <Link to="/stations" className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900">
        <ArrowLeftIcon className="h-4 w-4" /> All stations
      </Link>

      {/* Gallery */}
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <img src={station.images[photo]} alt={`${station.name} photo ${photo + 1}`} className="aspect-[16/9] w-full rounded-2xl object-cover md:col-span-3 md:aspect-auto md:h-[420px]" />
        <div className="grid grid-cols-3 gap-3 md:grid-cols-1">
          {station.images.map((img, i) =>
          <button
            key={img + i}
            onClick={() => setPhoto(i)}
            aria-label={`Show photo ${i + 1}`}
            className={`overflow-hidden rounded-xl ring-2 transition ${photo === i ? 'ring-green-600' : 'ring-transparent hover:ring-slate-300'}`}>
            
              <img src={img} alt="" className="aspect-[4/3] h-full w-full object-cover md:aspect-auto md:h-[132px]" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <header>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${open ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-green-600' : 'bg-red-600'}`} />
                {open ? 'Open now' : station.temporarilyClosed ? 'Temporarily closed' : 'Closed'}
              </span>
              <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-slate-900">{station.rating.toFixed(1)}</span> ({station.reviewCount} reviews)
              </span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{station.name}</h1>
            <p className="mt-2 flex items-start gap-1.5 text-slate-600">
              <MapPinIcon className="mt-1 h-4 w-4 shrink-0" /> {station.address} · {station.distanceKm} km away
            </p>
          </header>

          {station.temporarilyClosed &&
          <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-800">
              This station is temporarily closed for upgrades. Bookings will reopen soon — try a nearby station meanwhile.
            </div>
          }

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={<ClockIcon className="h-4 w-4" />} label="Operating hours" value={hoursLabel(station.openTime, station.closeTime)} />
            <Stat icon={<ZapIcon className="h-4 w-4" />} label="Charging speed" value={`${Math.min(...speeds)}–${Math.max(...speeds)} kW`} />
            <Stat label="Connectors" value={connectors.join(', ')} />
            <Stat label="Availability" value={`${available}/${chargers.length} chargers`} highlight={available > 0} />
          </dl>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">Chargers</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              {chargers.map((c) =>
              <ChargerCard
                key={c.id}
                charger={station.temporarilyClosed ? { ...c, status: 'unavailable' } : c}
                freeSlots={buildSlots(db, station, c, TODAY).filter((s) => s.state === 'available').length} />

              )}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">Facilities</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {station.facilities.map((f) =>
              <li key={f} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700">
                  <span className="text-green-600">{facilityIcons[f]}</span>
                  {facilityLabels[f]}
                </li>
              )}
            </ul>
          </section>

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Location</h2>
              <a href={directionsUrl(station)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800">
                <NavigationIcon className="h-4 w-4" /> Get directions
              </a>
            </div>
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
              <iframe title={`Map showing ${station.name}`} src={mapEmbedUrl(station)} className="h-72 w-full" loading="lazy" />
            </div>
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Reserve a charger</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">Free booking</p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• 30-minute slots{station.slotMinutes === 60 ? ' (60 min at this station)' : ''}</li>
              <li>• Instant confirmation with booking ID</li>
              <li>• Cancel anytime from My Bookings</li>
            </ul>
            <div className="mt-6"><BookButton full /></div>
          </div>
        </aside>
      </div>

      {/* Mobile sticky CTA */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white p-4 lg:hidden">
        <BookButton full />
      </div>
    </div>);

}

function Stat({ icon, label, value, highlight }: {icon?: React.ReactNode;label: string;value: string;highlight?: boolean;}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <dt className="flex items-center gap-1 text-xs text-slate-500">{icon}{label}</dt>
      <dd className={`mt-1 text-sm font-semibold ${highlight ? 'text-green-700' : 'text-slate-900'}`}>{value}</dd>
    </div>);

}