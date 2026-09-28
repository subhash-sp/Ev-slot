import React from 'react';
import { BuildingIcon, CalendarIcon, LayoutDashboardIcon, TimerIcon, UsersIcon } from 'lucide-react';
import { Tab, TabList, TabPanel, Tabs } from '../components/ds/Tabs';
import { AdminOverview } from '../components/admin/AdminOverview';
import { AdminStations } from '../components/admin/AdminStations';
import { AdminSlots } from '../components/admin/AdminSlots';
import { AdminBookings } from '../components/admin/AdminBookings';
import { AdminCustomers } from '../components/admin/AdminCustomers';
import { useScreenInit } from '../useScreenInit.js';

export function Admin() {
  const screenInit = useScreenInit() as {tab?: string;};
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-green-600">Operator</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Admin dashboard</h1>
          <p className="mt-1 text-slate-600">Manage stations, chargers, time slots and bookings.</p>
        </div>
      </div>
      <div className="mt-6">
        <Tabs defaultTab={screenInit.tab ?? 'overview'} variant="underlined">
          <TabList>
            <Tab id="overview" icon={<LayoutDashboardIcon className="h-4 w-4" />}>Overview</Tab>
            <Tab id="stations" icon={<BuildingIcon className="h-4 w-4" />}>Stations & chargers</Tab>
            <Tab id="slots" icon={<TimerIcon className="h-4 w-4" />}>Time slots</Tab>
            <Tab id="bookings" icon={<CalendarIcon className="h-4 w-4" />}>Bookings</Tab>
            <Tab id="customers" icon={<UsersIcon className="h-4 w-4" />}>Customers</Tab>
          </TabList>
          <TabPanel id="overview"><div className="mt-6"><AdminOverview /></div></TabPanel>
          <TabPanel id="stations"><div className="mt-6"><AdminStations /></div></TabPanel>
          <TabPanel id="slots"><div className="mt-6"><AdminSlots /></div></TabPanel>
          <TabPanel id="bookings"><div className="mt-6"><AdminBookings /></div></TabPanel>
          <TabPanel id="customers"><div className="mt-6"><AdminCustomers /></div></TabPanel>
        </Tabs>
      </div>
    </div>);

}