import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="md:col-span-2">
          <Logo inverted />
          <p className="mt-3 text-sm">Charge smarter. Drive further.</p>
          <p className="mt-4 max-w-sm text-sm">Free EV charging slot reservations across Bengaluru. No payment, no queues.</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Product</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" to="/stations">Find Stations</Link></li>
            <li><Link className="hover:text-white" to="/bookings">My Bookings</Link></li>
            <li><Link className="hover:text-white" to="/how-it-works">How It Works</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-white" to="/support">Support</Link></li>
            <li><Link className="hover:text-white" to="/profile">Account</Link></li>
            <li><Link className="hover:text-white" to="/admin">Station admin</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <p className="mx-auto max-w-7xl px-4 py-5 text-xs sm:px-6 lg:px-8">© 2026 EV Slot. All rights reserved.</p>
      </div>
    </footer>);

}