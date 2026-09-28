import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  AppNotification,
  Booking,
  Charger,
  CreateBookingResult,
  Database,
  Station,
  User } from
'../types/models';
import { stations as seedStations, chargers as seedChargers } from '../data/stations';
import { bookings as seedBookings, users as seedUsers, blockedSlots as seedBlocked } from '../data/bookings';
import { isSlotBlocked, isSlotTaken, nextBookingId, slotKey } from '../utils/slots';
import { DEMO_NOW, isPast, toMinutes, fromMinutes } from '../utils/time';
import {
  type DeliveryResult,
  sendEmailConfirmation,
  sendSmsConfirmation,
  buildSmsMessage } from
'../utils/notifications';

const STORAGE_KEY = 'evslot-db-v2';

function seed(): Database {
  return {
    stations: seedStations,
    chargers: seedChargers,
    bookings: seedBookings,
    users: seedUsers,
    blockedSlots: seedBlocked,
    notifications: [],
    currentUserId: null
  };
}

function readDb(): Database {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Database;
  } catch {

    /* ignore corrupt storage */}
  return seed();
}

function writeDb(db: Database) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {

    /* storage full or unavailable */}
}

const uid = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface NewBookingInput {
  stationId: string;
  chargerId: string;
  date: string;
  startTime: string;
}

export type UserDetails = Omit<User, 'id' | 'createdAt'>;

export function useDatabase() {
  const [db, setDb] = useState<Database>(readDb);
  const [deliveries, setDeliveries] = useState<Record<string, DeliveryResult[]>>({});
  const inFlight = useRef<Set<string>>(new Set());

  // Keep tabs in sync so a slot booked in one tab is instantly unavailable in another.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setDb(readDb());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const commit = useCallback((updater: (prev: Database) => Database) => {
    setDb((prev) => {
      const next = updater(prev);
      writeDb(next);
      return next;
    });
  }, []);

  const currentUser = db.users.find((u) => u.id === db.currentUserId) ?? null;

  /* ---------- Auth ---------- */

  const findUserByMobile = useCallback((mobile: string) => db.users.find((u) => u.mobile === mobile) ?? null, [db.users]);

  const signInAs = useCallback((userId: string) => commit((p) => ({ ...p, currentUserId: userId })), [commit]);

  const registerUser = useCallback(
    (details: UserDetails): User => {
      const existing = db.users.find((u) => u.mobile === details.mobile);
      const user: User = existing ?
      { ...existing, ...details } :
      { ...details, id: uid('u'), createdAt: new Date().toISOString() };
      commit((p) => ({
        ...p,
        users: existing ? p.users.map((u) => u.id === user.id ? user : u) : [...p.users, user],
        currentUserId: user.id
      }));
      return user;
    },
    [commit, db.users]
  );

  const updateUser = useCallback(
    (details: Partial<UserDetails>) =>
    commit((p) => ({ ...p, users: p.users.map((u) => u.id === p.currentUserId ? { ...u, ...details } : u) })),
    [commit]
  );

  const signOut = useCallback(() => commit((p) => ({ ...p, currentUserId: null })), [commit]);

  /* ---------- Booking ---------- */

  /**
   * Reserve a slot. Re-reads the latest persisted state (so bookings from other
   * tabs/users are respected), re-checks availability, then writes atomically.
   * An in-flight lock prevents two confirms racing for the same slot.
   */
  const createBooking = useCallback(
    async (input: NewBookingInput): Promise<CreateBookingResult> => {
      const key = slotKey(input.chargerId, input.date, input.startTime);
      if (inFlight.current.has(key)) return { ok: false, reason: 'slot_taken' };
      inFlight.current.add(key);
      try {
        await wait(900); // simulated network round-trip

        const latest = readDb();
        if (!latest.currentUserId) return { ok: false, reason: 'not_signed_in' };
        const station = latest.stations.find((s) => s.id === input.stationId);
        const charger = latest.chargers.find((c) => c.id === input.chargerId);
        if (!station || !charger || station.temporarilyClosed || charger.status === 'unavailable') {
          setDb(latest);
          return { ok: false, reason: 'slot_unavailable' };
        }
        if (isPast(input.date, input.startTime) || isSlotBlocked(latest.blockedSlots, input.chargerId, input.date, input.startTime)) {
          setDb(latest);
          return { ok: false, reason: 'slot_unavailable' };
        }
        if (isSlotTaken(latest.bookings, input.chargerId, input.date, input.startTime)) {
          setDb(latest);
          return { ok: false, reason: 'slot_taken' };
        }

        const booking: Booking = {
          id: nextBookingId(latest.bookings),
          userId: latest.currentUserId,
          stationId: input.stationId,
          chargerId: input.chargerId,
          date: input.date,
          startTime: input.startTime,
          endTime: fromMinutes(toMinutes(input.startTime) + station.slotMinutes),
          status: 'confirmed',
          createdAt: new Date().toISOString()
        };
        const next: Database = { ...latest, bookings: [...latest.bookings, booking] };
        writeDb(next);
        setDb(next);
        return { ok: true, booking };
      } finally {
        inFlight.current.delete(key);
      }
    },
    []
  );

  /** Trigger all confirmation channels for a booking. */
  const deliverConfirmation = useCallback(async (booking: Booking) => {
    const latest = readDb();
    const station = latest.stations.find((s) => s.id === booking.stationId);
    const charger = latest.chargers.find((c) => c.id === booking.chargerId);
    const user = latest.users.find((u) => u.id === booking.userId);
    if (!station || !charger || !user) return;
    const payload = { booking, station, charger, user };

    const notification: AppNotification = {
      id: uid('n'),
      title: 'Charging slot confirmed',
      body: buildSmsMessage(payload).split('\n').slice(2, 6).join(' · '),
      bookingId: booking.id,
      createdAt: new Date().toISOString(),
      read: false
    };
    commit((p) => ({ ...p, notifications: [notification, ...p.notifications] }));

    const results = await Promise.all([sendEmailConfirmation(payload), sendSmsConfirmation(payload)]);
    setDeliveries((d) => ({ ...d, [booking.id]: results }));
  }, [commit]);

  const cancelBooking = useCallback(
    (bookingId: string) =>
    commit((p) => ({
      ...p,
      bookings: p.bookings.map((b) =>
      b.id === bookingId && b.status === 'confirmed' ?
      { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() } :
      b
      )
    })),
    [commit]
  );

  const markNotificationsRead = useCallback(
    () => commit((p) => ({ ...p, notifications: p.notifications.map((n) => ({ ...n, read: true })) })),
    [commit]
  );

  /* ---------- Admin ---------- */

  const saveStation = useCallback(
    (station: Station) =>
    commit((p) => ({
      ...p,
      stations: p.stations.some((s) => s.id === station.id) ?
      p.stations.map((s) => s.id === station.id ? station : s) :
      [...p.stations, station]
    })),
    [commit]
  );

  const addCharger = useCallback(
    (charger: Omit<Charger, 'id'>) => commit((p) => ({ ...p, chargers: [...p.chargers, { ...charger, id: uid('ch') }] })),
    [commit]
  );

  const removeCharger = useCallback(
    (chargerId: string) =>
    commit((p) => ({
      ...p,
      chargers: p.chargers.filter((c) => c.id !== chargerId),
      bookings: p.bookings.map((b) =>
      b.chargerId === chargerId && b.status === 'confirmed' ?
      { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() } :
      b
      )
    })),
    [commit]
  );

  const setChargerStatus = useCallback(
    (chargerId: string, status: Charger['status']) =>
    commit((p) => ({ ...p, chargers: p.chargers.map((c) => c.id === chargerId ? { ...c, status } : c) })),
    [commit]
  );

  const toggleBlockSlot = useCallback(
    (chargerId: string, date: string, startTime: string) =>
    commit((p) => {
      const exists = isSlotBlocked(p.blockedSlots, chargerId, date, startTime);
      return {
        ...p,
        blockedSlots: exists ?
        p.blockedSlots.filter((b) => !(b.chargerId === chargerId && b.date === date && b.startTime === startTime)) :
        [...p.blockedSlots, { id: uid('blk'), chargerId, date, startTime, reason: 'Blocked by admin' }]
      };
    }),
    [commit]
  );

  const resetDemo = useCallback(() => {
    const fresh = seed();
    writeDb(fresh);
    setDb(fresh);
    setDeliveries({});
  }, []);

  return {
    db,
    now: DEMO_NOW,
    currentUser,
    deliveries,
    findUserByMobile,
    signInAs,
    registerUser,
    updateUser,
    signOut,
    createBooking,
    deliverConfirmation,
    cancelBooking,
    markNotificationsRead,
    saveStation,
    addCharger,
    removeCharger,
    setChargerStatus,
    toggleBlockSlot,
    resetDemo
  };
}

export type DatabaseApi = ReturnType<typeof useDatabase>;