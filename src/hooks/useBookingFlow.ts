import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';
import { useToast } from '../contexts/ToastContext';
import { buildSlots } from '../utils/slots';
import { TODAY, formatTimeRange, upcomingDates } from '../utils/time';
import type { TimeSlot } from '../types/models';

export function useBookingFlow(stationId: string | undefined) {
  const { db, currentUser, createBooking, deliverConfirmation } = useAppData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const station = db.stations.find((s) => s.id === stationId) ?? null;
  const chargers = useMemo(() => db.chargers.filter((c) => c.stationId === stationId), [db.chargers, stationId]);
  const dates = useMemo(() => upcomingDates(5), []);

  const [date, setDate] = useState(TODAY);
  const [chargerId, setChargerId] = useState<string | null>(() => chargers.find((c) => c.status === 'available')?.id ?? null);
  const [slotStart, setSlotStart] = useState<string | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const submittingRef = useRef(false);

  const charger = chargers.find((c) => c.id === chargerId) ?? null;

  const slots: TimeSlot[] = useMemo(
    () => station && charger ? buildSlots(db, station, charger, date) : [],
    [db, station, charger, date]
  );
  const selectedSlot = slots.find((s) => s.startTime === slotStart) ?? null;

  // If the selected slot stops being available (e.g. booked in another tab), clear it.
  useEffect(() => {
    if (submittingRef.current) return;
    if (slotStart && selectedSlot && selectedSlot.state !== 'available') {
      setSlotStart(null);
      showToast({ variant: 'warning', title: 'That slot was just taken', description: 'Please choose another time.' });
    }
  }, [selectedSlot, slotStart, showToast]);

  const freeSlotsByCharger = useMemo(() => {
    const map: Record<string, number> = {};
    if (!station) return map;
    chargers.forEach((c) => {
      map[c.id] = buildSlots(db, station, c, date).filter((s) => s.state === 'available').length;
    });
    return map;
  }, [db, station, chargers, date]);

  const selectDate = (d: string) => {
    setDate(d);
    setSlotStart(null);
  };
  const selectCharger = (id: string) => {
    setChargerId(id);
    setSlotStart(null);
  };

  const canReview = Boolean(station && charger && selectedSlot && selectedSlot.state === 'available');

  const review = () => {
    if (!canReview) return;
    if (!currentUser) setAuthOpen(true);else
    setConfirmOpen(true);
  };

  const onAuthComplete = () => {
    setAuthOpen(false);
    showToast({ variant: 'success', title: 'You’re signed in', description: 'Review and confirm your free booking.' });
    setConfirmOpen(true);
  };

  const confirm = async () => {
    if (!station || !charger || !selectedSlot) return;
    setConfirming(true);
    submittingRef.current = true;
    const result = await createBooking({
      stationId: station.id,
      chargerId: charger.id,
      date,
      startTime: selectedSlot.startTime
    });
    setConfirming(false);

    if (!result.ok) {
      submittingRef.current = false;
      setConfirmOpen(false);
      if (result.reason === 'not_signed_in') {
        setAuthOpen(true);
        return;
      }
      setSlotStart(null);
      showToast({
        variant: 'error',
        title: result.reason === 'slot_taken' ? 'Slot already booked' : 'Slot no longer available',
        description:
        result.reason === 'slot_taken' ?
        'Another driver confirmed this slot moments ago. Please pick a different time.' :
        'This slot was blocked or the charger went offline. Please pick another.'
      });
      return;
    }

    const { booking } = result;
    setConfirmOpen(false);
    navigate(`/booking/success/${booking.id}`, { replace: true });
    showToast({
      variant: 'success',
      title: `Booking ${booking.id} confirmed`,
      description: `${station.name}\n${formatTimeRange(booking.startTime, booking.endTime)} · ${charger.label}`,
      duration: 7000
    });
    void deliverConfirmation(booking);
  };

  return {
    station,
    chargers,
    charger,
    dates,
    date,
    slots,
    selectedSlot,
    freeSlotsByCharger,
    currentUser,
    selectDate,
    selectCharger,
    selectSlot: setSlotStart,
    canReview,
    review,
    authOpen,
    setAuthOpen,
    onAuthComplete,
    confirmOpen,
    setConfirmOpen,
    confirming,
    confirm
  };
}