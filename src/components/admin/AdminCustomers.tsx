import React from 'react';
import { useAppData } from '../../contexts/AppDataContext';

export function AdminCustomers() {
  const { db } = useAppData();
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
          <tr>
            <th className="px-4 py-3 font-semibold">Customer</th>
            <th className="px-4 py-3 font-semibold">Contact</th>
            <th className="px-4 py-3 font-semibold">Vehicle</th>
            <th className="px-4 py-3 font-semibold">Upcoming</th>
            <th className="px-4 py-3 font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {db.users.map((u) => {
            const mine = db.bookings.filter((b) => b.userId === u.id);
            return (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{u.fullName}</td>
                <td className="px-4 py-3 text-slate-700">+91 {u.mobile}<span className="block text-xs text-slate-500">{u.email}</span></td>
                <td className="px-4 py-3 text-slate-700">{u.vehicleModel}<span className="block font-mono text-xs text-slate-500">{u.vehicleNumber}</span></td>
                <td className="px-4 py-3 font-semibold text-green-700">{mine.filter((b) => b.status === 'confirmed').length}</td>
                <td className="px-4 py-3 text-slate-700">{mine.length}</td>
              </tr>);

          })}
        </tbody>
      </table>
    </div>);

}