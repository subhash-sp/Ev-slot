export type ConnectorType = 'CCS2' | 'Type 2' | 'CHAdeMO' | 'Bharat DC-001';

export type ChargerStatus = 'available' | 'unavailable';

export type BookingStatus = 'confirmed' | 'completed' | 'cancelled';

export type SlotState = 'available' | 'booked' | 'unavailable' | 'blocked';

export type FacilityId =
'restroom' |
'cafe' |
'wifi' |
'parking' |
'cctv' |
'lounge' |
'shopping' |
'accessible';

export interface User {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  vehicleNumber: string;
  vehicleModel: string;
  createdAt: string;
}

export interface Station {
  id: string;
  name: string;
  area: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  images: string[];
  openTime: string; // HH:mm
  closeTime: string; // HH:mm
  slotMinutes: 30 | 60;
  facilities: FacilityId[];
  temporarilyClosed: boolean;
}

export interface Charger {
  id: string;
  stationId: string;
  label: string;
  connector: ConnectorType;
  powerKw: number;
  currentType: 'AC' | 'DC';
  status: ChargerStatus;
}

/** A materialised slot for one charger on one date. Generated from station hours. */
export interface TimeSlot {
  id: string;
  stationId: string;
  chargerId: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  state: SlotState;
}

/** Slots an admin has manually taken out of service. */
export interface BlockedSlot {
  id: string;
  chargerId: string;
  date: string;
  startTime: string;
  reason: string;
}

export interface Booking {
  id: string; // e.g. EVS10248
  userId: string;
  stationId: string;
  chargerId: string;
  date: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: BookingStatus;
  createdAt: string; // ISO
  cancelledAt?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  bookingId?: string;
  createdAt: string;
  read: boolean;
}

export interface Database {
  stations: Station[];
  chargers: Charger[];
  bookings: Booking[];
  users: User[];
  blockedSlots: BlockedSlot[];
  notifications: AppNotification[];
  currentUserId: string | null;
}

export type CreateBookingResult =
{ok: true;booking: Booking;} |
{ok: false;reason: 'slot_taken' | 'slot_unavailable' | 'not_signed_in';};