import { addDays, format, parseISO } from 'date-fns';

/**
 * Demo clock. The sample data is anchored to this date so the app is
 * immediately testable. Swap for `new Date()` in production.
 */
export const DEMO_NOW = new Date(2026, 8, 26, 10, 15);
export const TODAY = format(DEMO_NOW, 'yyyy-MM-dd');
export const NOW_MINUTES = DEMO_NOW.getHours() * 60 + DEMO_NOW.getMinutes();

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

export function fromMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatTime(hhmm: string): string {
  const mins = toMinutes(hhmm) % (24 * 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime(start)} - ${formatTime(end)}`;
}

export function formatLongDate(iso: string): string {
  return format(parseISO(iso), 'd MMMM yyyy');
}

export function formatShortDate(iso: string): string {
  return format(parseISO(iso), 'd MMM yyyy');
}

export function formatDayLabel(iso: string): string {
  return format(parseISO(iso), 'EEE, d MMM');
}

export function upcomingDates(count: number): string[] {
  return Array.from({ length: count }, (_, i) => format(addDays(DEMO_NOW, i), 'yyyy-MM-dd'));
}

export function hoursLabel(open: string, close: string): string {
  if (open === '00:00' && close === '24:00') return 'Open 24 hours';
  return `${formatTime(open)} – ${formatTime(close)}`;
}

/** Is the booking slot in the past relative to the demo clock? */
export function isPast(date: string, startTime: string): boolean {
  if (date < TODAY) return true;
  if (date > TODAY) return false;
  return toMinutes(startTime) <= NOW_MINUTES;
}