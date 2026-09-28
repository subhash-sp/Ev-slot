import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MapPinOffIcon, NavigationIcon, XIcon } from 'lucide-react';
import { SearchBar } from '../components/SearchBar';
import { StationCard } from '../components/StationCard';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { useAppData } from '../contexts/AppDataContext';
import type { ConnectorType } from '../types/models';
import { countAvailableSlots, haversineKm, isStationOpenNow } from '../utils/slots';
import { TODAY } from '../utils/time';

const CONNECTORS: ConnectorType[] = ['CCS2', 'Type 2', 'CHAdeMO', 'Bharat DC-001'];
type Sort = 'distance' | 'rating' | 'availability';

export function Stations() {
  const { db } = useAppData();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const connector = params.get('connector') as ConnectorType | null;
  const lat = params.get('lat');
  const lng = params.get('lng');
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState<Sort>('distance');

  const update = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => v ? next.set(k, v) : next.delete(k));
    setParams(next);
  };

  const results = useMemo(() => {
    const coords = lat && lng ? { lat: Number(lat), lng: Number(lng) } : null;
    const term = q.toLowerCase();
    return db.stations.
    map((s) => ({
      station: s,
      distance: coords ? haversineKm(coords.lat, coords.lng, s.lat, s.lng) : s.distanceKm,
      slots: countAvailableSlots(db, s, TODAY)
    })).
    filter(({ station }) => !term || `${station.name} ${station.area} ${station.address}`.toLowerCase().includes(term)).
    filter(({ station }) => !connector || db.chargers.some((c) => c.stationId === station.id && c.connector === connector)).
    filter(({ station }) => !openOnly || isStationOpenNow(station)).
    sort((a, b) =>
    sort === 'rating' ? b.station.rating - a.station.rating : sort === 'availability' ? b.slots - a.slots : a.distance - b.distance
    );
  }, [db, q, connector, lat, lng, openOnly, sort]);

  const chip = (active: boolean) =>
  `inline-flex h-9 items-center rounded-full border px-3.5 text-sm font-medium transition ${
  active ? 'border-green-600 bg-green-600 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`;


  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Find charging stations</h1>
      <p className="mt-1 text-slate-600">Live availability across Bengaluru. Every booking is free.</p>

      <div className="mt-6">
        <SearchBar
          key={q}
          size="md"
          initialQuery={lat ? 'Current location' : q}
          onSearch={(term) => update({ q: term || null, lat: null, lng: null })}
          onLocate={(c) => update({ lat: String(c.lat), lng: String(c.lng), q: null })} />
        
      </div>

      <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <button className={chip(!connector)} onClick={() => update({ connector: null })}>All connectors</button>
          {CONNECTORS.map((c) =>
          <button key={c} className={chip(connector === c)} onClick={() => update({ connector: connector === c ? null : c })}>{c}</button>
          )}
          <span className="mx-1 w-px shrink-0 bg-slate-200" />
          <button className={chip(openOnly)} onClick={() => setOpenOnly((o) => !o)} aria-pressed={openOnly}>Open now</button>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-600">
            
            <option value="distance">Distance</option>
            <option value="availability">Most slots today</option>
            <option value="rating">Rating</option>
          </select>
        </label>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
        <span className="font-semibold text-slate-900">{results.length} station{results.length === 1 ? '' : 's'}</span>
        {q && <FilterPill label={`“${q}”`} onClear={() => update({ q: null })} />}
        {lat && <FilterPill icon={<NavigationIcon className="h-3 w-3" />} label="Near your location" onClear={() => update({ lat: null, lng: null })} />}
      </div>

      {results.length === 0 ?
      <div className="mt-6">
          <EmptyState
          icon={<MapPinOffIcon className="h-6 w-6" />}
          title="No stations match your search"
          description="Try a different area, remove a connector filter, or clear “Open now”."
          action={<Button variant="outline" onClick={() => {setParams(new URLSearchParams());setOpenOnly(false);}}>Clear all filters</Button>} />
        
        </div> :

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map(({ station, distance }) => <StationCard key={station.id} station={station} distanceKm={distance} />)}
        </div>
      }
    </div>);

}

function FilterPill({ label, onClear, icon }: {label: string;onClear: () => void;icon?: React.ReactNode;}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-900 py-1 pl-3 pr-1 text-xs font-medium text-white">
      {icon}
      {label}
      <button onClick={onClear} aria-label={`Clear ${label}`} className="rounded-full p-0.5 hover:bg-white/20">
        <XIcon className="h-3 w-3" />
      </button>
    </span>);

}