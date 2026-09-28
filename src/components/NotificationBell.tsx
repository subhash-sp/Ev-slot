import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon, CheckCircle2Icon } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useAppData } from '../contexts/AppDataContext';

export function NotificationBell() {
  const { db, markNotificationsRead } = useAppData();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = db.notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const toggle = () => {
    setOpen((o) => !o);
    if (!open && unread) markNotificationsRead();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-expanded={open}
        className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
        
        <BellIcon className="h-5 w-5" />
        {unread > 0 &&
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        }
      </button>
      {open &&
      <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
          </div>
          {db.notifications.length === 0 ?
        <p className="px-4 py-8 text-center text-sm text-slate-500">You're all caught up. Booking confirmations will appear here.</p> :

        <ul className="max-h-80 divide-y divide-slate-100 overflow-y-auto">
              {db.notifications.map((n) =>
          <li key={n.id}>
                  <Link
              to={n.bookingId ? `/booking/success/${n.bookingId}` : '/bookings'}
              onClick={() => setOpen(false)}
              className="flex gap-3 px-4 py-3 transition hover:bg-slate-50">
              
                    <CheckCircle2Icon className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900">{n.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{n.body}</p>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {formatDistanceToNow(parseISO(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </Link>
                </li>
          )}
            </ul>
        }
        </div>
      }
    </div>);

}