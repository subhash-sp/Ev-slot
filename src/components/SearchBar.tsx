import React, { useState } from 'react';
import { CrosshairIcon, Loader2Icon, MapPinIcon, SearchIcon } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export interface Coords {
  lat: number;
  lng: number;
}

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string) => void;
  onLocate: (coords: Coords) => void;
  size?: 'lg' | 'md';
}

export function SearchBar({ initialQuery = '', onSearch, onLocate, size = 'lg' }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [locating, setLocating] = useState(false);
  const { showToast } = useToast();

  const locate = () => {
    if (!('geolocation' in navigator)) {
      showToast({ variant: 'warning', title: 'Location not supported', description: 'Search by area name instead.' });
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setQuery('Current location');
        onLocate({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      () => {
        setLocating(false);
        showToast({
          variant: 'warning',
          title: "Couldn't get your location",
          description: 'Allow location access or search by area, e.g. "Hosur Main Road".'
        });
      },
      { timeout: 8000 }
    );
  };

  const h = size === 'lg' ? 'h-14' : 'h-12';

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(query === 'Current location' ? '' : query.trim());
      }}
      className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-900/5 sm:flex-row sm:items-center">
      
      <label className={`flex flex-1 items-center gap-2 rounded-xl px-3 ${h}`}>
        <MapPinIcon className="h-5 w-5 shrink-0 text-green-600" />
        <span className="sr-only">Search by location</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Area, road or station name"
          className="w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none" />
        
      </label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={locate}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex-none ${h}`}>
          
          {locating ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <CrosshairIcon className="h-4 w-4" />}
          <span className="whitespace-nowrap">Use my location</span>
        </button>
        <button
          type="submit"
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-6 text-sm font-semibold text-white transition hover:bg-green-700 sm:flex-none ${h}`}>
          
          <SearchIcon className="h-4 w-4" /> Search
        </button>
      </div>
    </form>);

}