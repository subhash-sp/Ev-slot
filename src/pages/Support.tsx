import React, { useState } from 'react';
import { ChevronDownIcon, MailIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react';
import { faqs } from '../data/content';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useToast } from '../contexts/ToastContext';

export function Support() {
  const [open, setOpen] = useState<number | null>(0);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const { showToast } = useToast();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (form.message.trim().length < 10) next.message = 'Tell us a bit more (at least 10 characters)';
    setErrors(next);
    if (Object.keys(next).length) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 700));
    setSending(false);
    setForm({ name: '', email: '', message: '' });
    showToast({ variant: 'success', title: 'Request received', description: 'Our team typically replies within 4 hours.' });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:py-16">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Support</h1>
      <p className="mt-1 text-slate-600">We're here to help, 7 days a week.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
        { icon: <PhoneIcon className="h-5 w-5" />, title: 'Call us', value: '1800 123 4567', sub: '8 AM – 10 PM' },
        { icon: <MailIcon className="h-5 w-5" />, title: 'Email', value: 'help@evslot.in', sub: 'Reply within 4 hours' },
        { icon: <MessageCircleIcon className="h-5 w-5" />, title: 'WhatsApp', value: '+91 98450 00000', sub: 'Quick answers' }].
        map((c) =>
        <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700">{c.icon}</span>
            <p className="mt-3 text-sm text-slate-500">{c.title}</p>
            <p className="font-semibold text-slate-900">{c.value}</p>
            <p className="text-xs text-slate-500">{c.sub}</p>
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">Frequently asked questions</h2>
          <ul className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
            {faqs.map((f, i) =>
            <li key={f.q}>
                <button
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900">
                
                  {f.q}
                  <ChevronDownIcon className={`h-4 w-4 shrink-0 text-slate-500 transition ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {open === i && <p className="px-5 pb-4 text-sm text-slate-600">{f.a}</p>}
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Send us a message</h2>
          <form onSubmit={submit} className="mt-4 space-y-4" noValidate>
            <Input id="s-name" label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
            <Input id="s-email" label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            <div>
              <label htmlFor="s-msg" className="mb-1.5 block text-sm font-medium text-slate-700">Message</label>
              <textarea
                id="s-msg"
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Include your booking ID if it's about a booking"
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 ${errors.message ? 'border-red-500' : 'border-slate-300'}`} />
              
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>
            <Button type="submit" loading={sending} fullWidth>Send message</Button>
          </form>
        </section>
      </div>
    </div>);

}