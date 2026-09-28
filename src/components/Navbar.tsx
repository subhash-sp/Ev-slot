import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon, UserIcon, XIcon } from 'lucide-react';
import { Logo } from './Logo';
import { NotificationBell } from './NotificationBell';
import { useAppData } from '../contexts/AppDataContext';

const links = [
{ to: '/', label: 'Home', end: true },
{ to: '/stations', label: 'Find Stations' },
{ to: '/bookings', label: 'My Bookings' },
{ to: '/how-it-works', label: 'How It Works' },
{ to: '/support', label: 'Support' }];


export function Navbar() {
  const { currentUser } = useAppData();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const linkClass = ({ isActive }: {isActive: boolean;}) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
  isActive ? 'bg-green-50 text-green-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`;


  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Link to="/" aria-label="EV Slot home" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) =>
          <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2">
          <NotificationBell />
          <Link
            to="/profile"
            className="hidden items-center gap-2 rounded-xl border border-slate-200 py-1.5 pl-1.5 pr-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 sm:flex">
            
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-semibold text-white">
              {currentUser ? initials(currentUser.fullName) : <UserIcon className="h-4 w-4" />}
            </span>
            {currentUser ? currentUser.fullName.split(' ')[0] : 'Login'}
          </Link>
          <button
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}>
            
            {open ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden border-t border-slate-200 bg-white lg:hidden">
          
            <div className="flex flex-col gap-1 px-4 py-3">
              {links.map((l) =>
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                  {l.label}
                </NavLink>
            )}
              <NavLink to="/profile" className={linkClass}>
                {currentUser ? `Profile · ${currentUser.fullName}` : 'Login / Sign up'}
              </NavLink>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </header>);

}

function initials(name: string) {
  return name.
  split(' ').
  map((p) => p[0]).
  slice(0, 2).
  join('').
  toUpperCase();
}