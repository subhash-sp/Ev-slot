import type { BlockedSlot, Booking, User } from '../types/models';

export const users: User[] = [
{
  id: 'u-arjun',
  fullName: 'Arjun Mehta',
  mobile: '9845012345',
  email: 'arjun.mehta@example.com',
  vehicleNumber: 'KA 01 MX 4521',
  vehicleModel: 'Tata Nexon EV',
  createdAt: '2026-08-02T09:12:00.000Z'
},
{
  id: 'u-priya',
  fullName: 'Priya Raman',
  mobile: '9880098765',
  email: 'priya.raman@example.com',
  vehicleNumber: 'KA 05 NB 7788',
  vehicleModel: 'MG ZS EV',
  createdAt: '2026-07-18T14:40:00.000Z'
},
{
  id: 'u-rahul',
  fullName: 'Rahul Nair',
  mobile: '9900123456',
  email: 'rahul.nair@example.com',
  vehicleNumber: 'KA 03 AB 1290',
  vehicleModel: 'Hyundai Ioniq 5',
  createdAt: '2026-09-01T08:05:00.000Z'
},
{
  id: 'u-sneha',
  fullName: 'Sneha Kulkarni',
  mobile: '9731055512',
  email: 'sneha.k@example.com',
  vehicleNumber: 'KA 51 ME 3301',
  vehicleModel: 'BYD Atto 3',
  createdAt: '2026-09-10T11:22:00.000Z'
}];


export const bookings: Booking[] = [
// Arjun's history (demo account)
{ id: 'EVS10231', userId: 'u-arjun', stationId: 'st-forum', chargerId: 'ch-fm-1', date: '2026-09-18', startTime: '18:00', endTime: '18:30', status: 'completed', createdAt: '2026-09-17T10:00:00.000Z' },
{ id: 'EVS10236', userId: 'u-arjun', stationId: 'st-greencharge', chargerId: 'ch-gc-2', date: '2026-09-22', startTime: '08:30', endTime: '09:00', status: 'completed', createdAt: '2026-09-21T19:30:00.000Z' },
{ id: 'EVS10240', userId: 'u-arjun', stationId: 'st-hsr', chargerId: 'ch-hsr-1', date: '2026-09-24', startTime: '19:00', endTime: '19:30', status: 'cancelled', createdAt: '2026-09-23T08:15:00.000Z', cancelledAt: '2026-09-24T07:00:00.000Z' },
{ id: 'EVS10245', userId: 'u-arjun', stationId: 'st-volthub', chargerId: 'ch-vh-1', date: '2026-09-28', startTime: '17:30', endTime: '18:00', status: 'confirmed', createdAt: '2026-09-25T12:10:00.000Z' },

// Other customers — these fill slots so "Booked" states are visible
{ id: 'EVS10241', userId: 'u-priya', stationId: 'st-greencharge', chargerId: 'ch-gc-1', date: '2026-09-26', startTime: '11:00', endTime: '11:30', status: 'confirmed', createdAt: '2026-09-25T09:00:00.000Z' },
{ id: 'EVS10242', userId: 'u-rahul', stationId: 'st-greencharge', chargerId: 'ch-gc-1', date: '2026-09-26', startTime: '12:30', endTime: '13:00', status: 'confirmed', createdAt: '2026-09-25T11:40:00.000Z' },
{ id: 'EVS10243', userId: 'u-sneha', stationId: 'st-greencharge', chargerId: 'ch-gc-2', date: '2026-09-26', startTime: '10:30', endTime: '11:00', status: 'confirmed', createdAt: '2026-09-25T16:20:00.000Z' },
{ id: 'EVS10244', userId: 'u-priya', stationId: 'st-greencharge', chargerId: 'ch-gc-2', date: '2026-09-27', startTime: '09:30', endTime: '10:00', status: 'confirmed', createdAt: '2026-09-25T18:05:00.000Z' },
{ id: 'EVS10246', userId: 'u-rahul', stationId: 'st-greencharge', chargerId: 'ch-gc-2', date: '2026-09-27', startTime: '11:00', endTime: '11:30', status: 'confirmed', createdAt: '2026-09-26T07:30:00.000Z' },
{ id: 'EVS10247', userId: 'u-sneha', stationId: 'st-forum', chargerId: 'ch-fm-1', date: '2026-09-26', startTime: '14:00', endTime: '14:30', status: 'confirmed', createdAt: '2026-09-26T08:00:00.000Z' },
{ id: 'EVS10239', userId: 'u-rahul', stationId: 'st-volthub', chargerId: 'ch-vh-2', date: '2026-09-26', startTime: '16:00', endTime: '16:30', status: 'confirmed', createdAt: '2026-09-24T13:00:00.000Z' },
{ id: 'EVS10238', userId: 'u-priya', stationId: 'st-hsr', chargerId: 'ch-hsr-1', date: '2026-09-23', startTime: '10:00', endTime: '10:30', status: 'completed', createdAt: '2026-09-22T10:00:00.000Z' }];


export const blockedSlots: BlockedSlot[] = [
{ id: 'blk-1', chargerId: 'ch-gc-2', date: '2026-09-26', startTime: '13:00', reason: 'Scheduled maintenance' },
{ id: 'blk-2', chargerId: 'ch-gc-2', date: '2026-09-26', startTime: '13:30', reason: 'Scheduled maintenance' }];