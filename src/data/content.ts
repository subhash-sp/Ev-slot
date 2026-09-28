export const howItWorksSteps = [
{
  title: 'Find a station',
  body: 'Search by area or use your location to see nearby chargers with live availability.',
  icon: 'search'
},
{
  title: 'Pick a slot',
  body: 'Choose a date, charger and 30-minute time slot that fits your plan.',
  icon: 'calendar'
},
{
  title: 'Confirm for free',
  body: 'Review your booking and confirm. No payment, no card details — ever.',
  icon: 'check'
},
{
  title: 'Arrive & charge',
  body: 'Get directions, arrive 5 minutes early and plug in. Your charger is held for you.',
  icon: 'plug'
}] as
const;

export const benefits = [
{
  title: 'Skip the queue',
  body: 'Your charger is reserved for your slot, so there is no waiting behind other cars.',
  icon: 'clock'
},
{
  title: '100% free booking',
  body: 'Reserving a slot costs nothing. You only pay the station for energy used, if applicable.',
  icon: 'wallet'
},
{
  title: 'Live availability',
  body: 'See which chargers are free, booked or under maintenance before you drive.',
  icon: 'activity'
},
{
  title: 'Instant confirmation',
  body: 'Get your booking ID and details the moment you confirm, plus reminders in the app.',
  icon: 'bell'
}] as
const;

export const faqs = [
{
  q: 'Is booking really free?',
  a: 'Yes. EV Slot never charges for reserving a slot and never asks for payment details.'
},
{
  q: 'What happens if I arrive late?',
  a: 'Your charger is held for 10 minutes after your slot starts. After that it may be released to walk-in drivers.'
},
{
  q: 'How do I cancel a booking?',
  a: 'Open My Bookings, find the booking under Upcoming and tap Cancel Booking. The slot is released immediately for others.'
},
{
  q: 'Can two people book the same slot?',
  a: 'No. Each charger slot can only be reserved once. We re-check availability the moment you confirm.'
},
{
  q: 'Which connectors are supported?',
  a: 'Stations list CCS2, Type 2, CHAdeMO and Bharat DC-001 connectors. Filter by connector on the Find Stations page.'
}];


export const facilityLabels: Record<string, string> = {
  restroom: 'Restroom',
  cafe: 'Café',
  wifi: 'Free Wi-Fi',
  parking: 'Parking',
  cctv: '24/7 CCTV',
  lounge: 'Driver lounge',
  shopping: 'Shopping',
  accessible: 'Accessible'
};