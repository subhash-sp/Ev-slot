import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader } from '../ds/Dialog';
import { Input } from '../Input';
import { Button } from '../Button';
import type { Station } from '../../types/models';

interface Props {
  isOpen: boolean;
  station: Station | null;
  onClose: () => void;
  onSave: (station: Station) => void;
}

const DEFAULT_IMG = "/5b7f36f3-07c1-4647-9f01-ce946bfb714d.jpg";

const blank = (): Station => ({
  id: `st-${Math.random().toString(36).slice(2, 8)}`,
  name: '',
  area: '',
  address: '',
  city: 'Bengaluru',
  lat: 12.9716,
  lng: 77.5946,
  distanceKm: 5,
  rating: 4.5,
  reviewCount: 0,
  images: [DEFAULT_IMG],
  openTime: '06:00',
  closeTime: '22:00',
  slotMinutes: 30,
  facilities: ['parking'],
  temporarilyClosed: false
});

export function StationFormDialog({ isOpen, station, onClose, onSave }: Props) {
  const [form, setForm] = useState<Station>(station ?? blank());
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm(station ?? blank());
      setError('');
    }
  }, [isOpen, station]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.area.trim() || !form.address.trim()) return setError('Name, area and address are required.');
    if (form.openTime >= form.closeTime && form.closeTime !== '24:00') return setError('Closing time must be after opening time.');
    onSave({ ...form, name: form.name.trim() });
  };

  const set = <K extends keyof Station,>(k: K, v: Station[K]) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog isOpen={isOpen} onClose={onClose} size="lg">
      <form onSubmit={submit} noValidate>
        <DialogHeader>
          <h2 className="text-lg font-semibold text-slate-900">{station ? 'Edit station' : 'Add charging station'}</h2>
        </DialogHeader>
        <DialogContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id="f-name" label="Station name" value={form.name} onChange={(e) => set('name', e.target.value)} />
            <Input id="f-area" label="Area / road" value={form.area} onChange={(e) => set('area', e.target.value)} />
            <div className="sm:col-span-2">
              <Input id="f-address" label="Full address" value={form.address} onChange={(e) => set('address', e.target.value)} />
            </div>
            <Input id="f-lat" label="Latitude" type="number" step="0.0001" value={form.lat} onChange={(e) => set('lat', Number(e.target.value))} />
            <Input id="f-lng" label="Longitude" type="number" step="0.0001" value={form.lng} onChange={(e) => set('lng', Number(e.target.value))} />
            <Input id="f-open" label="Opens at" type="time" value={form.openTime} onChange={(e) => set('openTime', e.target.value)} />
            <Input id="f-close" label="Closes at" type="time" value={form.closeTime === '24:00' ? '23:59' : form.closeTime} onChange={(e) => set('closeTime', e.target.value === '23:59' ? '24:00' : e.target.value)} />
            <label className="text-sm">
              <span className="mb-1.5 block font-medium text-slate-700">Slot length</span>
              <select value={form.slotMinutes} onChange={(e) => set('slotMinutes', Number(e.target.value) as 30 | 60)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 focus:outline-none focus:ring-2 focus:ring-green-600">
                <option value={30}>30 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </label>
            <Input id="f-img" label="Photo URL" value={form.images[0]} onChange={(e) => set('images', [e.target.value, ...form.images.slice(1)])} />
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
              <input type="checkbox" checked={form.temporarilyClosed} onChange={(e) => set('temporarilyClosed', e.target.checked)} className="h-4 w-4 rounded accent-green-600" />
              Temporarily closed (no new bookings)
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-500">Time slots are generated automatically from operating hours and slot length.</p>
          {error && <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-700" role="alert">{error}</p>}
        </DialogContent>
        <DialogFooter>
          <div className="flex w-full justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">{station ? 'Save changes' : 'Add station'}</Button>
          </div>
        </DialogFooter>
      </form>
    </Dialog>);

}