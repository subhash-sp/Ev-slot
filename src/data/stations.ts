import type { Charger, Station } from '../types/models';

const IMG = {
  a: "/5b7f36f3-07c1-4647-9f01-ce946bfb714d.jpg",
  b: "/eda039d8-38db-4390-a437-5cb7d75438a8.jpg",
  c: "/f92b81c3-5bfd-4962-bacc-53814402accc.jpg",
  d: "/d9b801a5-b704-4be8-9a78-f419a1028a21.jpg",
  hero: "/114745cb-4315-47a9-9177-e1c94ba05f4d.jpg"
};

export const heroImage = IMG.hero;

export const stations: Station[] = [
{
  id: 'st-greencharge',
  name: 'GreenCharge EV Station',
  area: 'Hosur Main Road',
  address: '42, Hosur Main Road, Bommanahalli, Bengaluru 560068',
  city: 'Bengaluru',
  lat: 12.9081,
  lng: 77.6231,
  distanceKm: 1.2,
  rating: 4.7,
  reviewCount: 312,
  images: [IMG.a, IMG.d, IMG.c],
  openTime: '06:00',
  closeTime: '23:00',
  slotMinutes: 30,
  facilities: ['restroom', 'cafe', 'wifi', 'parking', 'cctv', 'accessible'],
  temporarilyClosed: false
},
{
  id: 'st-volthub',
  name: 'VoltHub Electronic City',
  area: 'Electronic City Phase 1',
  address: 'Infosys Gate 2 Road, Electronic City Phase 1, Bengaluru 560100',
  city: 'Bengaluru',
  lat: 12.8452,
  lng: 77.6602,
  distanceKm: 4.8,
  rating: 4.5,
  reviewCount: 198,
  images: [IMG.b, IMG.a, IMG.d],
  openTime: '00:00',
  closeTime: '24:00',
  slotMinutes: 30,
  facilities: ['restroom', 'parking', 'cctv', 'lounge', 'wifi'],
  temporarilyClosed: false
},
{
  id: 'st-hsr',
  name: 'PlugPoint HSR Layout',
  area: 'HSR Layout Sector 2',
  address: '27th Main Road, Sector 2, HSR Layout, Bengaluru 560102',
  city: 'Bengaluru',
  lat: 12.9116,
  lng: 77.6474,
  distanceKm: 2.6,
  rating: 4.3,
  reviewCount: 124,
  images: [IMG.d, IMG.c, IMG.a],
  openTime: '07:00',
  closeTime: '22:00',
  slotMinutes: 30,
  facilities: ['cafe', 'parking', 'cctv'],
  temporarilyClosed: false
},
{
  id: 'st-forum',
  name: 'ChargeZone Forum Mall',
  area: 'Koramangala',
  address: 'Basement 2, Forum Mall, Hosur Road, Koramangala, Bengaluru 560029',
  city: 'Bengaluru',
  lat: 12.9345,
  lng: 77.6112,
  distanceKm: 3.4,
  rating: 4.6,
  reviewCount: 276,
  images: [IMG.c, IMG.b, IMG.d],
  openTime: '10:00',
  closeTime: '22:00',
  slotMinutes: 30,
  facilities: ['restroom', 'cafe', 'shopping', 'wifi', 'parking', 'accessible'],
  temporarilyClosed: false
},
{
  id: 'st-indiranagar',
  name: 'EcoPlug Indiranagar',
  area: '100 Feet Road, Indiranagar',
  address: '812, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
  city: 'Bengaluru',
  lat: 12.9719,
  lng: 77.6412,
  distanceKm: 8.1,
  rating: 4.4,
  reviewCount: 143,
  images: [IMG.a, IMG.c, IMG.b],
  openTime: '06:00',
  closeTime: '23:00',
  slotMinutes: 60,
  facilities: ['cafe', 'parking', 'wifi'],
  temporarilyClosed: false
},
{
  id: 'st-whitefield',
  name: 'SunVolt Whitefield Hub',
  area: 'Whitefield Main Road',
  address: 'ITPL Main Road, near Hope Farm Junction, Whitefield, Bengaluru 560066',
  city: 'Bengaluru',
  lat: 12.9698,
  lng: 77.7499,
  distanceKm: 14.2,
  rating: 4.1,
  reviewCount: 87,
  images: [IMG.d, IMG.b, IMG.a],
  openTime: '06:00',
  closeTime: '22:00',
  slotMinutes: 30,
  facilities: ['restroom', 'parking', 'cctv'],
  temporarilyClosed: true
}];


export const chargers: Charger[] = [
{ id: 'ch-gc-1', stationId: 'st-greencharge', label: 'Charger 01', connector: 'CCS2', powerKw: 60, currentType: 'DC', status: 'available' },
{ id: 'ch-gc-2', stationId: 'st-greencharge', label: 'Charger 02', connector: 'CCS2', powerKw: 120, currentType: 'DC', status: 'available' },
{ id: 'ch-gc-3', stationId: 'st-greencharge', label: 'Charger 03', connector: 'Type 2', powerKw: 22, currentType: 'AC', status: 'available' },

{ id: 'ch-vh-1', stationId: 'st-volthub', label: 'Charger 01', connector: 'CCS2', powerKw: 150, currentType: 'DC', status: 'available' },
{ id: 'ch-vh-2', stationId: 'st-volthub', label: 'Charger 02', connector: 'CCS2', powerKw: 60, currentType: 'DC', status: 'available' },
{ id: 'ch-vh-3', stationId: 'st-volthub', label: 'Charger 03', connector: 'Bharat DC-001', powerKw: 15, currentType: 'DC', status: 'available' },

{ id: 'ch-hsr-1', stationId: 'st-hsr', label: 'Charger 01', connector: 'CCS2', powerKw: 30, currentType: 'DC', status: 'available' },
{ id: 'ch-hsr-2', stationId: 'st-hsr', label: 'Charger 02', connector: 'Type 2', powerKw: 7.4, currentType: 'AC', status: 'available' },

{ id: 'ch-fm-1', stationId: 'st-forum', label: 'Charger 01', connector: 'CCS2', powerKw: 60, currentType: 'DC', status: 'available' },
{ id: 'ch-fm-2', stationId: 'st-forum', label: 'Charger 02', connector: 'Type 2', powerKw: 22, currentType: 'AC', status: 'available' },
{ id: 'ch-fm-3', stationId: 'st-forum', label: 'Charger 03', connector: 'Type 2', powerKw: 22, currentType: 'AC', status: 'available' },

{ id: 'ch-in-1', stationId: 'st-indiranagar', label: 'Charger 01', connector: 'CCS2', powerKw: 50, currentType: 'DC', status: 'available' },
{ id: 'ch-in-2', stationId: 'st-indiranagar', label: 'Charger 02', connector: 'CHAdeMO', powerKw: 50, currentType: 'DC', status: 'unavailable' },

{ id: 'ch-wf-1', stationId: 'st-whitefield', label: 'Charger 01', connector: 'CCS2', powerKw: 120, currentType: 'DC', status: 'available' },
{ id: 'ch-wf-2', stationId: 'st-whitefield', label: 'Charger 02', connector: 'CCS2', powerKw: 60, currentType: 'DC', status: 'available' }];