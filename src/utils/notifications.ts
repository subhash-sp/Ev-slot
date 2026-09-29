/**
 * Booking confirmation delivery.
 *
 * In-app notifications are delivered for real. Email and SMS are provider
 * integration points: they build the exact message and return an honest
 * delivery status. Nothing here claims a message was sent unless a provider
 * is configured.
 *
 * To go live, implement these on your backend (e.g. POST /api/notifications/sms)
 * with a provider such as Twilio, MSG91 or AWS SNS, then set the flags below.
 */
import type { Booking, Charger, Station, User } from '../types/models';
import { formatLongDate, formatShortDate, formatTimeRange } from './time';

export const SMS_PROVIDER_CONFIGURED = true;
export const EMAIL_PROVIDER_CONFIGURED = false;

export type DeliveryStatus = 'sent' | 'not_configured' | 'failed';

export interface DeliveryResult {
  channel: 'sms' | 'email';
  status: DeliveryStatus;
  to: string;
  message: string;
  subject?: string;
}

export interface ConfirmationPayload {
  booking: Booking;
  station: Station;
  charger: Charger;
  user: User;
}

export function buildSmsMessage({ booking, station, charger }: ConfirmationPayload): string {
  const chargerNo = charger.label.replace(/\D/g, '') || charger.label;
  return [
  'EV Slot: Your charging slot is confirmed!',
  '',
  `Station: ${station.name}`,
  `Date: ${formatShortDate(booking.date)}`,
  `Time: ${formatTimeRange(booking.startTime, booking.endTime)}`,
  `Charger: ${chargerNo}`,
  `Booking ID: ${booking.id}`,
  '',
  'Please arrive 5 minutes before your slot.'].
  join('\n');
}

export function buildEmail({ booking, station, charger, user }: ConfirmationPayload): {subject: string;body: string;} {
  return {
    subject: `Booking confirmed · ${booking.id} · ${station.name}`,
    body: [
    `Hi ${user.fullName.split(' ')[0]},`,
    '',
    'Your EV charging slot has been successfully reserved.',
    '',
    `Booking ID: ${booking.id}`,
    `Station: ${station.name}`,
    `Location: ${station.address}`,
    `Date: ${formatLongDate(booking.date)}`,
    `Time: ${formatTimeRange(booking.startTime, booking.endTime)}`,
    `Charger: ${charger.label} · ${charger.connector} · ${charger.powerKw} kW`,
    'Price: FREE',
    '',
    'Please arrive 5 minutes before your slot. Your charger is held for 10 minutes after the start time.',
    '',
    '— EV Slot · Charge smarter. Drive further.'].
    join('\n')
  };
}

/** SMS integration placeholder — connect a provider on the backend. */
export async function sendSmsConfirmation(payload: ConfirmationPayload): Promise<DeliveryResult> {
  const message = buildSmsMessage(payload);
  const to = `+91 ${payload.user.mobile}`;
  if (!SMS_PROVIDER_CONFIGURED) {
    return { channel: 'sms', status: 'not_configured', to, message };
  }
  try {
    const res = await fetch('/api/notifications/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, message, bookingId: payload.booking.id })
    });
    return { channel: 'sms', status: res.ok ? 'sent' : 'failed', to, message };
  } catch {
    return { channel: 'sms', status: 'failed', to, message };
  }
}

/** Email integration placeholder — connect a provider on the backend. */
export async function sendEmailConfirmation(payload: ConfirmationPayload): Promise<DeliveryResult> {
  const { subject, body } = buildEmail(payload);
  const to = payload.user.email;
  if (!EMAIL_PROVIDER_CONFIGURED) {
    return { channel: 'email', status: 'not_configured', to, message: body, subject };
  }
  try {
    const res = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to, subject, body, bookingId: payload.booking.id })
    });
    return { channel: 'email', status: res.ok ? 'sent' : 'failed', to, message: body, subject };
  } catch {
    return { channel: 'email', status: 'failed', to, message: body, subject };
  }
}
