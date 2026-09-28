import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, NavigationIcon, StarIcon, ZapIcon, CalendarClockIcon } from 'lucide-react';
import type { Station } from '../types/models';
import { useAppData } from '../contexts/AppDataContext';
import { countAvailableSlots, isStationOpenNow } from '../utils/slots';
import { TODAY } from '../utils/time';

interface StationCardProps {
  station: Station;
  distanceKm?: number;
}

export function StationCard({ station, distanceKm }: StationCardProps) {
  const { db } = useAppData();
  const stationChargers = db.chargers.filter((c) => c.stationId === station.id);
  const availableChargers = station.temporarilyClosed ? 0 : stationChargers.filter((c) => c.status === 'available').length;
  const connectors = Array.from(new Set(stationChargers.map((c) => c.connector)));
  const maxKw = stationChargers.reduce((m, c) => Math.max(m, c.powerKw), 0);
  const slotsToday = countAvailableSlots(db, station, TODAY);
  const open = isStationOpenNow(station);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <img src={station.images[0]} alt={`${station.name} charging bays`} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
          open ? 'bg-white text-green-700' : 'bg-white text-red-600'}`
          }>
          
          <span className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-green-600' : 'bg-red-600'}`} />
          {open ? 'Open now' : station.temporarilyClosed ? 'Temporarily closed' : 'Closed'}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-900/85 px-2.5 py-1 text-xs font-semibold text-white">
          <StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          {station.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-900">{station.name}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-slate-600">
            <NavigationIcon className="h-3.5 w-3.5" />
            {(distanceKm ?? station.distanceKm).toFixed(1)} km
          </span>
        </div>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-500">
          <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{station.area}</span>
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
          {connectors.map((c) =>
          <span key={c} className="rounded-md bg-slate-100 px-2 py-1 text-slate-700">{c}</span>
          )}
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-slate-700">
            <ZapIcon className="h-3 w-3" /> Up to {maxKw} kW
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
          <div>
            <dt className="text-xs text-slate-500">Chargers</dt>
            <dd className={`font-semibold ${availableChargers ? 'text-green-700' : 'text-slate-400'}`}>
              {availableChargers}/{stationChargers.length} available
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Slots today</dt>
            <dd className={`inline-flex items-center gap-1 font-semibold ${slotsToday ? 'text-slate-900' : 'text-slate-400'}`}>
              <CalendarClockIcon className="h-3.5 w-3.5" />
              {slotsToday} open
            </dd>
          </div>
        </dl>

        <Link
          to={`/stations/${station.id}`}
          className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-green-600 text-sm font-semibold text-white transition hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2">
          
          View Slots
        </Link>
      </div>
    </article>);

}