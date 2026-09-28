import type { Booking, BlockedSlot, Charger, Database, SlotState, Station, TimeSlot } from '../types/models';
import { NOW_MINUTES, TODAY, fromMinutes, toMinutes } from './time';

export function slotKey(chargerId: string, date: string, startTime: string): string {
  return `${chargerId}|${date}|${startTime}`;
}

export function isStationOpenNow(station: Station): boolean {
  if (station.temporarilyClosed) return false;
  return NOW_MINUTES >= toMinutes(station.openTime) && NOW_MINUTES < toMinutes(station.closeTime);
}

export function isSlotTaken(bookings: Booking[], chargerId: string, date: string, startTime: string): boolean {
  return bookings.some(
    (b) => b.status === 'confirmed' && b.chargerId === chargerId && b.date === date && b.startTime === startTime
  );
}

export function isSlotBlocked(blocked: BlockedSlot[], chargerId: string, date: string, startTime: string): boolean {
  return blocked.some((b) => b.chargerId === chargerId && b.date === date && b.startTime === startTime);
}

/** Generates every slot for a charger on a date, with its live state. */
export function buildSlots(db: Pick<Database, 'bookings' | 'blockedSlots'>, station: Station, charger: Charger, date: string): TimeSlot[] {
  const start = toMinutes(station.openTime);
  const end = toMinutes(station.closeTime);
  const slots: TimeSlot[] = [];
  for (let t = start; t + station.slotMinutes <= end; t += station.slotMinutes) {
    const startTime = fromMinutes(t);
    const endTime = fromMinutes(t + station.slotMinutes);
    let state: SlotState = 'available';
    if (station.temporarilyClosed || charger.status === 'unavailable') state = 'unavailable';else
    if (date < TODAY || date === TODAY && t <= NOW_MINUTES) state = 'unavailable';else
    if (isSlotTaken(db.bookings, charger.id, date, startTime)) state = 'booked';else
    if (isSlotBlocked(db.blockedSlots, charger.id, date, startTime)) state = 'blocked';
    slots.push({
      id: slotKey(charger.id, date, startTime),
      stationId: station.id,
      chargerId: charger.id,
      date,
      startTime,
      endTime,
      state
    });
  }
  return slots;
}

export function countAvailableSlots(db: Database, station: Station, date: string): number {
  return db.chargers.
  filter((c) => c.stationId === station.id).
  reduce((sum, c) => sum + buildSlots(db, station, c, date).filter((s) => s.state === 'available').length, 0);
}

export function nextBookingId(existing: Booking[]): string {
  const max = existing.reduce((m, b) => {
    const n = Number(b.id.replace(/\D/g, ''));
    return Number.isFinite(n) && n > m ? n : m;
  }, 10000);
  let candidate = max + 1;
  const ids = new Set(existing.map((b) => b.id));
  while (ids.has(`EVS${candidate}`)) candidate += 1;
  return `EVS${candidate}`;
}

export function directionsUrl(station: Station): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
}

export function mapEmbedUrl(station: Station): string {
  const d = 0.008;
  const bbox = `${station.lng - d},${station.lat - d},${station.lng + d},${station.lat + d}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${station.lat},${station.lng}`;
}

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (v: number) => v * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10;
}