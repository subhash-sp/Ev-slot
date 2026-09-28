import React, { useState } from 'react';
import { useAppData } from '../../contexts/AppDataContext';
import { DateSelector } from '../DateSelector';
import { TimeSlot, TimeSlotLegend } from '../TimeSlot';
import { buildSlots } from '../../utils/slots';
import { TODAY, upcomingDates } from '../../utils/time';

export function AdminSlots() {
  const { db, toggleBlockSlot } = useAppData();
  const [stationId, setStationId] = useState(db.stations[0]?.id ?? '');
  const station = db.stations.find((s) => s.id === stationId);
  const chargers = db.chargers.filter((c) => c.stationId === stationId);
  const [chargerId, setChargerId] = useState(chargers[0]?.id ?? '');
  const charger = chargers.find((c) => c.id === chargerId) ?? chargers[0];
  const [date, setDate] = useState(TODAY);
  const dates = upcomingDates(7);
  const slots = station && charger ? buildSlots(db, station, charger, date) : [];

  const counts = {
    available: slots.filter((s) => s.state === 'available').length,
    booked: slots.filter((s) => s.state === 'booked').length,
    blocked: slots.filter((s) => s.state === 'blocked').length
  };

  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-slate-700">Station</span>
          <select
            value={stationId}
            onChange={(e) => {
              setStationId(e.target.value);
              setChargerId(db.chargers.find((c) => c.stationId === e.target.value)?.id ?? '');
            }}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3">
            
            {db.stations.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1.5 block font-medium text-slate-700">Charger</span>
          <select value={charger?.id ?? ''} onChange={(e) => setChargerId(e.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3">
            {chargers.map((c) => <option key={c.id} value={c.id}>{c.label} · {c.connector} · {c.powerKw} kW{c.status === 'unavailable' ? ' (unavailable)' : ''}</option>)}
          </select>
        </label>
      </div>

      <DateSelector dates={dates} value={date} onChange={setDate} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <TimeSlotLegend admin />
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-green-700">{counts.available}</span> open · <span className="font-semibold">{counts.booked}</span> booked · <span className="font-semibold text-orange-700">{counts.blocked}</span> blocked
        </p>
      </div>

      {!charger ?
      <p className="text-sm text-slate-500">This station has no chargers yet.</p> :

      <>
          <p className="text-xs text-slate-500">Click an open slot to block it, or a blocked slot to reopen it. Booked slots must be cancelled from Bookings first.</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-8">
            {slots.map((s) =>
          <TimeSlot key={s.id} startTime={s.startTime} state={s.state} adminMode onSelect={() => toggleBlockSlot(s.chargerId, s.date, s.startTime)} />
          )}
          </div>
        </>
      }
    </div>);

}