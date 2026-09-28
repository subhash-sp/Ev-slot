import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapPinIcon, NavigationIcon, PlugZapIcon, XCircleIcon } from 'lucide-react';
import type { Booking, Charger, Station } from '../types/models';
import { BookingStatus } from './BookingStatus';
import { formatDayLabel, formatTimeRange } from '../utils/time';
import { directionsUrl } from '../utils/slots';

interface BookingCardProps {
  booking: Booking;
  station?: Station;
  charger?: Charger;
  onCancel?: () => void;
}

export function BookingCard({ booking, station, charger, onCancel }: BookingCardProps) {
  const upcoming = booking.status === 'confirmed';
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row">
        {station &&
        <img src={station.images[0]} alt="" className="h-28 w-full rounded-xl object-cover sm:h-auto sm:w-36" />
        }
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <Link to={`/stations/${booking.stationId}`} className="text-base font-semibold text-slate-900 hover:text-green-700">
                {station?.name ?? 'Station removed'}
              </Link>
              {station &&
              <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500">
                  <MapPinIcon className="h-3.5 w-3.5" /> {station.area}
                </p>
              }
            </div>
            <BookingStatus status={booking.status} />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm lg:grid-cols-4">
            <Item icon={<CalendarIcon className="h-4 w-4" />} label="Date" value={formatDayLabel(booking.date)} />
            <Item icon={<ClockIcon className="h-4 w-4" />} label="Time" value={formatTimeRange(booking.startTime, booking.endTime)} />
            <Item icon={<PlugZapIcon className="h-4 w-4" />} label="Charger" value={charger ? `${charger.label} · ${charger.connector}` : '—'} />
            <Item label="Booking ID" value={<span className="font-mono">{booking.id}</span>} />
          </dl>
        </div>
      </div>
      {upcoming && station &&
      <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3 sm:flex-row sm:justify-end">
          {onCancel &&
        <button
          onClick={onCancel}
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50">
          
              <XCircleIcon className="h-4 w-4" /> Cancel Booking
            </button>
        }
          <a
          href={directionsUrl(station)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white transition hover:bg-green-700">
          
            <NavigationIcon className="h-4 w-4" /> Get Directions
          </a>
        </div>
      }
    </article>);

}

function Item({ icon, label, value }: {icon?: React.ReactNode;label: string;value: React.ReactNode;}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1 text-xs text-slate-500">{icon}{label}</dt>
      <dd className="mt-0.5 truncate font-medium text-slate-900">{value}</dd>
    </div>);

}