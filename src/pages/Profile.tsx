import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CarIcon, CarFrontIcon, LayoutDashboardIcon, LogOutIcon, MailIcon, PhoneIcon, RotateCcwIcon, UserIcon } from 'lucide-react';
import { useAppData } from '../contexts/AppDataContext';
import { useToast } from '../contexts/ToastContext';
import { AuthForm } from '../components/AuthForm';
import { Input } from '../components/Input';
import { Button } from '../components/Button';

export function Profile() {
  const { currentUser, updateUser, signOut, db, resetDemo } = useAppData();
  const { showToast } = useToast();
  const [form, setForm] = useState({ fullName: '', email: '', vehicleNumber: '', vehicleModel: '' });

  useEffect(() => {
    if (currentUser)
    setForm({
      fullName: currentUser.fullName,
      email: currentUser.email,
      vehicleNumber: currentUser.vehicleNumber,
      vehicleModel: currentUser.vehicleModel
    });
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <AuthForm heading="Login or sign up" onComplete={(u) => showToast({ variant: 'success', title: `Welcome, ${u.fullName.split(' ')[0]}` })} />
        </div>
      </div>);

  }

  const count = db.bookings.filter((b) => b.userId === currentUser.id);
  const save = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ ...form, vehicleNumber: form.vehicleNumber.toUpperCase() });
    showToast({ variant: 'success', title: 'Profile updated' });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">
      <div className="flex flex-wrap items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
          {currentUser.fullName.split(' ').map((p) => p[0]).slice(0, 2).join('')}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-slate-900">{currentUser.fullName}</h1>
          <p className="text-sm text-slate-500">{currentUser.vehicleModel} · {currentUser.vehicleNumber}</p>
        </div>
        <Button variant="outline" leftIcon={<LogOutIcon className="h-4 w-4" />} onClick={signOut}>Log out</Button>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-3">
        {[
        { label: 'Upcoming', value: count.filter((b) => b.status === 'confirmed').length },
        { label: 'Completed', value: count.filter((b) => b.status === 'completed').length },
        { label: 'Cancelled', value: count.filter((b) => b.status === 'cancelled').length }].
        map((s) =>
        <Link to="/bookings" key={s.label} className="rounded-2xl border border-slate-200 bg-white p-4 text-center hover:border-green-400">
            <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </Link>
        )}
      </div>

      <form onSubmit={save} className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Personal & vehicle details</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Input id="p-name" label="Full Name" autoComplete="name" placeholder="e.g. Arjun Mehta" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} startAdornment={<UserIcon />} />
          <Input id="p-mobile" label="Mobile Number" value={`+91 ${currentUser.mobile}`} readOnly helperText="Verified via OTP" startAdornment={<PhoneIcon />} />
          <Input id="p-email" label="Email Address" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} startAdornment={<MailIcon />} />
          <Input id="p-vno" label="Vehicle Number" placeholder="KA 01 AB 1234" value={form.vehicleNumber} onChange={(e) => setForm({ ...form, vehicleNumber: e.target.value })} startAdornment={<CarIcon />} />
          <Input id="p-vmodel" label="Vehicle Model" placeholder="e.g. Tata Nexon EV" value={form.vehicleModel} onChange={(e) => setForm({ ...form, vehicleModel: e.target.value })} startAdornment={<CarFrontIcon />} />
        </div>
        <div className="mt-6 flex justify-end"><Button type="submit">Save changes</Button></div>
      </form>

      <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-dashed border-slate-300 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Operator tools</p>
          <p className="text-xs text-slate-500">Manage stations, chargers, slots and bookings.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" leftIcon={<RotateCcwIcon className="h-4 w-4" />} onClick={() => {resetDemo();showToast({ variant: 'info', title: 'Demo data reset' });}}>Reset demo data</Button>
          <Link to="/admin" className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-sm font-semibold text-white hover:bg-slate-800">
            <LayoutDashboardIcon className="h-4 w-4" /> Admin dashboard
          </Link>
        </div>
      </div>
    </div>);

}