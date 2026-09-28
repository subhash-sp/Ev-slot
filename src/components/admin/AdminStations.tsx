import React, { useState } from 'react';
import { ClockIcon, MapPinIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';
import { useToast } from '../../contexts/ToastContext';
import { Button } from '../Button';
import { StationFormDialog } from './StationFormDialog';
import type { ConnectorType, Station } from '../../types/models';
import { hoursLabel } from '../../utils/time';

const CONNECTORS: ConnectorType[] = ['CCS2', 'Type 2', 'CHAdeMO', 'Bharat DC-001'];

export function AdminStations() {
  const { db, saveStation, addCharger, removeCharger, setChargerStatus } = useAppData();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Station | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [newCharger, setNewCharger] = useState<Record<string, {connector: ConnectorType;powerKw: number;}>>({});

  const openForm = (s: Station | null) => {
    setEditing(s);
    setFormOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">{db.stations.length} stations</p>
        <Button leftIcon={<PlusIcon className="h-4 w-4" />} onClick={() => openForm(null)}>Add station</Button>
      </div>

      {db.stations.map((s) => {
        const list = db.chargers.filter((c) => c.stationId === s.id);
        const draft = newCharger[s.id] ?? { connector: 'CCS2' as ConnectorType, powerKw: 60 };
        return (
          <article key={s.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <img src={s.images[0]} alt="" className="h-20 w-full rounded-xl object-cover sm:w-28" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900">{s.name}</h3>
                  {s.temporarilyClosed && <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-orange-700">Closed</span>}
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500"><MapPinIcon className="h-3.5 w-3.5" />{s.area}</p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-slate-500"><ClockIcon className="h-3.5 w-3.5" />{hoursLabel(s.openTime, s.closeTime)} · {s.slotMinutes}-min slots</p>
              </div>
              <Button variant="outline" size="sm" leftIcon={<PencilIcon className="h-4 w-4" />} onClick={() => openForm(s)}>Edit</Button>
            </div>

            <div className="border-t border-slate-100 px-5 py-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Chargers</p>
              <ul className="space-y-2">
                {list.map((c) =>
                <li key={c.id} className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                    <span className="w-24 font-semibold text-slate-900">{c.label}</span>
                    <span className="flex-1 text-slate-600">{c.connector} · {c.powerKw} kW {c.currentType}</span>
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600">
                      <input
                      type="checkbox"
                      className="h-4 w-4 accent-green-600"
                      checked={c.status === 'available'}
                      onChange={(e) => {
                        setChargerStatus(c.id, e.target.checked ? 'available' : 'unavailable');
                        showToast({ variant: e.target.checked ? 'success' : 'warning', title: `${c.label} marked ${e.target.checked ? 'available' : 'unavailable'}` });
                      }} />
                    
                      {c.status === 'available' ? 'Available' : 'Unavailable'}
                    </label>
                    <button
                    aria-label={`Remove ${c.label}`}
                    onClick={() => {
                      removeCharger(c.id);
                      showToast({ variant: 'info', title: `${c.label} removed`, description: 'Any upcoming bookings on it were cancelled.' });
                    }}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600">
                    
                      <Trash2Icon className="h-4 w-4" />
                    </button>
                  </li>
                )}
              </ul>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <select
                  aria-label="Connector type"
                  value={draft.connector}
                  onChange={(e) => setNewCharger({ ...newCharger, [s.id]: { ...draft, connector: e.target.value as ConnectorType } })}
                  className="h-9 rounded-lg border border-slate-300 bg-white px-2 text-sm">
                  
                  {CONNECTORS.map((c) => <option key={c}>{c}</option>)}
                </select>
                <input
                  aria-label="Power in kW"
                  type="number"
                  min={3}
                  max={350}
                  value={draft.powerKw}
                  onChange={(e) => setNewCharger({ ...newCharger, [s.id]: { ...draft, powerKw: Number(e.target.value) } })}
                  className="h-9 w-20 rounded-lg border border-slate-300 px-2 text-sm" />
                
                <span className="text-sm text-slate-500">kW</span>
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<PlusIcon className="h-4 w-4" />}
                  onClick={() => {
                    addCharger({
                      stationId: s.id,
                      label: `Charger ${String(list.length + 1).padStart(2, '0')}`,
                      connector: draft.connector,
                      powerKw: draft.powerKw,
                      currentType: draft.connector === 'Type 2' ? 'AC' : 'DC',
                      status: 'available'
                    });
                    showToast({ variant: 'success', title: 'Charger added' });
                  }}>
                  
                  Add charger
                </Button>
              </div>
            </div>
          </article>);

      })}

      <StationFormDialog
        isOpen={formOpen}
        station={editing}
        onClose={() => setFormOpen(false)}
        onSave={(st) => {
          saveStation(st);
          setFormOpen(false);
          showToast({ variant: 'success', title: editing ? 'Station updated' : 'Station added' });
        }} />
      
    </div>);

}